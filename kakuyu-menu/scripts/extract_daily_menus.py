#!/usr/bin/env python3
"""Extract daily menu text from the official dormitory menu PDFs.

The PDF's red-circle allergen marks are graphical. They are deliberately not
inferred from ordinary text extraction; those values remain unverified unless
an editor supplies a verified entry in site/data/allergen-overrides.json.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import fitz  # PyMuPDF
import requests

SCHOOL_HOST = "www.maizuru-ct.ac.jp"
USER_AGENT = "Mozilla/5.0 (compatible; KakuyuMenu/1.0; +https://www.maizuru-ct.ac.jp/)"
TIMEOUT = 30
DATE_RE = re.compile(r"(20\d{2})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日")
MEAL_MAP = {"朝食": "breakfast", "昼食": "lunch", "昼": "lunch", "夕食": "dinner", "夕": "dinner"}
ALLERGEN_KEYS = {"egg", "milk", "wheat", "shrimp", "crab", "buckwheat", "peanut"}


def safe_pdf_url(url: str) -> bool:
    parsed = urlparse(url)
    return parsed.scheme == "https" and parsed.hostname == SCHOOL_HOST and parsed.path.lower().endswith(".pdf")


def parse_date(value: str) -> str | None:
    value = unicodedata.normalize("NFKC", value or "")
    match = DATE_RE.search(value)
    if not match:
        return None
    year, month, day = map(int, match.groups())
    try:
        return f"{datetime(year, month, day).date().isoformat()}"
    except ValueError:
        return None


def normalize_lines(value: str) -> list[str]:
    """Normalize spacing without trimming meaningful menu-name characters.

    Dish names can legitimately begin or end with parenthetical notes or
    partial-looking words (for example ``(北海道)``, ``豚の`` or
    ``カスタード``). Only surrounding whitespace is removed here; punctuation
    and text at either edge are kept intact for classification and display.
    """
    value = unicodedata.normalize("NFKC", value or "").replace("\u3000", " ").replace("\xa0", " ")
    lines = []
    for raw in value.replace("\r", "\n").split("\n"):
        line = re.sub(r"\s+", " ", raw).strip()
        if not line or line in {"—", "－", "-", "ー", "―"}:
            continue
        lines.append(line)
    return lines


def extract_nutrition(line: str) -> dict[str, float | int] | None:
    if not any(word in line for word in ("エネルギー", "蛋白質", "たんぱく質", "脂質", "食塩")):
        return None
    result: dict[str, float | int] = {}
    patterns = {
        "energy_kcal": r"エネルギー\s*([0-9]+(?:\.[0-9]+)?)\s*kcal",
        "protein_g": r"(?:蛋白質|たんぱく質)\s*([0-9]+(?:\.[0-9]+)?)\s*g",
        "fat_g": r"脂質\s*([0-9]+(?:\.[0-9]+)?)\s*g",
        "salt_g": r"食塩\s*([0-9]+(?:\.[0-9]+)?)\s*g",
    }
    for key, pattern in patterns.items():
        match = re.search(pattern, line)
        if match:
            value = float(match.group(1))
            result[key] = int(value) if value.is_integer() else value
    return result or None


def marker_for_line(line: str) -> str | None:
    """Return an explicit bracketed menu marker, if the entire line is one."""
    compact = unicodedata.normalize("NFKC", line or "").replace(" ", "")
    if re.fullmatch(r"[【\[（(]共通料理[】\]）)]", compact) or compact == "共通料理":
        return "common"
    if re.fullmatch(r"[【\[（(]A[】\]）)]", compact):
        return "a"
    if re.fullmatch(r"[【\[（(]B[】\]）)]", compact):
        return "b"
    return None


def option_prefix(line: str) -> tuple[str, str] | None:
    """Classify an item by its first character: A -> A set, B -> B set.

    The prefix is deliberately literal: any normalized item beginning with A
    or B is classified accordingly. All other items are common dishes. This
    follows the dining-menu convention requested for kakuyu-menu.

    Text after the A/B marker is retained verbatim apart from whitespace and
    the marker separator. Parentheses and words at the beginning/end of the
    dish name are not treated as delimiters or continuation hints.
    """
    value = unicodedata.normalize("NFKC", line or "").lstrip()
    if not value:
        return None
    first = value[0].upper()
    if first not in {"A", "B"}:
        return None

    remainder = value[1:].lstrip()
    # Also accept labels written as "A定食：料理名" / "B定食：料理名".
    if remainder.startswith("定食"):
        remainder = remainder[2:].lstrip()
    remainder = re.sub(r"^[:：.．、)）\-－]+\s*", "", remainder).strip()
    return ("a" if first == "A" else "b", remainder)


def split_option_prefixed_segments(line: str) -> list[str]:
    """Split one extracted PDF line where whitespace introduces another A/B item."""
    # Example: "Aカレー B焼き魚" -> ["Aカレー", "B焼き魚"].
    # A/B is treated as a label at the beginning of each segment.
    return [part.strip() for part in re.split(r"(?<=\s)(?=[AB])", line, flags=re.IGNORECASE) if part.strip()]


def parse_meal_text(value: str) -> dict[str, Any]:
    """Parse a meal cell using per-item A/B prefixes; all other items are common.

    Unlike a section-state parser, an A/B label is not carried into following
    unlabelled lines. This is important because unprefixed dishes must appear
    for both set-meal choices.
    """
    result: dict[str, Any] = {
        "a": [], "b": [], "common": [],
        "nutrition": {"a": {}, "b": {}, "common": {}},
        "allergens": {"a": None, "b": None},
        "allergen_status": "unverified",
    }
    marker_pattern = re.compile(r"([【\[（(]\s*(?:共通料理|A|B)\s*[】\]）)])", re.IGNORECASE)

    # A rice-only continuation is the one intentional positional exception to
    # the per-item A/B prefix rule: when 「ごはん」 appears immediately below a
    # B-prefixed dish and before the 「共通料理」 heading, it belongs to B.
    # Once the common heading has appeared, the same word is common.
    previous_item_section: str | None = None
    common_heading_seen = False

    def add_item(item_text: str, forced_section: str | None = None) -> None:
        nonlocal previous_item_section, common_heading_seen
        item_text = item_text.strip()
        if not item_text:
            return

        # "共通料理" is a section heading, not a dish. It also closes the
        # positional B -> ごはん rule for the rest of this meal cell.
        common_heading = re.match(r"^共通料理\s*[:：]?\s*(.*)$", item_text)
        if common_heading:
            common_heading_seen = True
            previous_item_section = None
            item_text = common_heading.group(1).strip()
            if not item_text:
                return
            forced_section = "common"

        prefixed = option_prefix(item_text)
        inherited_b_rice = False
        if prefixed:
            section, item_text = prefixed
        elif forced_section:
            section = forced_section
        elif (re.fullmatch(r"(?:ごはん|ご飯)", item_text)
              and previous_item_section == "b" and not common_heading_seen):
            section = "b"
            inherited_b_rice = True
        else:
            section = "common"

        item_text = item_text.strip()
        if not item_text:
            return

        # Some PDF text extractors flatten a visually separate B-menu rice
        # line into the same string as the B main dish, e.g.
        # "B 白身魚のチーズ焼き ごはん". Split only a standalone trailing
        # rice word while the B section is active and before 共通料理. The
        # recursive calls preserve the same behavior as two physical lines.
        if section == "b" and not common_heading_seen:
            rice_suffix = re.fullmatch(r"(.+?)\s+(ごはん|ご飯)", item_text)
            if rice_suffix:
                add_item(f"B {rice_suffix.group(1).strip()}", "b")
                add_item(rice_suffix.group(2), None)
                return

        nutrition = extract_nutrition(item_text)
        if nutrition:
            if section in {"a", "b"}:
                result["nutrition"][section].update(nutrition)
            else:
                # Do not guess whether unlabelled nutrition belongs to A or B.
                result["nutrition"]["common"].update(nutrition)
            previous_item_section = None
            return

        if item_text:
            result[section].append(item_text)
            # Only an immediately following rice line can inherit B. Any other
            # unprefixed item clears the context; explicit prefixes reset it.
            previous_item_section = (
                section if section in {"a", "b"} and not inherited_b_rice else None
            )

    for raw_line in normalize_lines(value):
        # Split bracketed labels. A/B labels apply to the next item; the common
        # heading applies as a boundary for the special B -> rice continuation.
        pieces = marker_pattern.split(raw_line)
        forced_section: str | None = None
        for piece in pieces:
            marker = marker_for_line(piece)
            if marker:
                if marker == "common":
                    common_heading_seen = True
                    previous_item_section = None
                forced_section = marker
                continue

            for segment in split_option_prefixed_segments(piece):
                add_item(segment, forced_section)
                # A detached marker is a prefix for the first following item only.
                forced_section = None

    for key in ("a", "b", "common"):
        result[key] = list(dict.fromkeys(result[key]))
    return result

def extract_tables(page: fitz.Page) -> list[list[list[str]]]:
    tables: list[list[list[str]]] = []
    finder = getattr(page, "find_tables", None)
    if not callable(finder):
        return tables
    for strategy in ("lines", "text"):
        try:
            found = finder(strategy=strategy)
            for table in found.tables:
                rows = table.extract()
                if rows:
                    normalized = [[str(cell or "") for cell in row] for row in rows]
                    if normalized not in tables:
                        tables.append(normalized)
        except Exception as exc:  # Some PDFs have no detectable tables under one strategy.
            print(f"DEBUG: table extraction ({strategy}) skipped: {exc}", file=sys.stderr)
    return tables


def parse_table_rows(rows: list[list[str]], pdf_url: str) -> dict[str, dict[str, Any]]:
    """Parse table rows while preserving vertical order within each meal cell.

    PDF table extraction may split the B dish, its immediately-following rice,
    and the common-food heading into separate physical rows. Accumulating raw
    cell text before calling parse_meal_text() preserves that context.
    """
    date_header: dict[int, str] = {}

    # Find the header row containing the weekly date columns.
    header_index = -1
    for index, row in enumerate(rows):
        candidates = {col: parse_date(cell) for col, cell in enumerate(row)}
        candidates = {col: date for col, date in candidates.items() if date}
        if len(candidates) >= 2:
            date_header = candidates
            header_index = index
            break
    if header_index < 0:
        return {}

    current_meal: str | None = None
    cell_texts: dict[str, dict[str, list[str]]] = {}
    for row in rows[header_index + 1:]:
        if not row:
            continue
        raw_label = row[0] or ""
        label = re.sub(r"\s+", "", raw_label)
        found_meal = next((key for label_text, key in MEAL_MAP.items() if label_text in label), None)
        if found_meal:
            current_meal = found_meal
            for column, date in date_header.items():
                if column >= len(row):
                    continue
                cell = row[column] or ""
                if cell.strip():
                    cell_texts.setdefault(date, {}).setdefault(current_meal, []).append(cell)
            continue

        # Some PDF table extractors expose A/B or 共通料理 as the first
        # (leftmost) cell rather than repeating the marker in every date cell.
        row_marker: str | None = None
        normalized_label = unicodedata.normalize("NFKC", label).upper()
        if normalized_label in {"A", "A定食"}:
            row_marker = "A"
        elif normalized_label in {"B", "B定食"}:
            row_marker = "B"
        elif normalized_label == "共通料理":
            row_marker = "共通料理"

        has_date_content = any(
            (row[col] or "").strip() for col in date_header if col < len(row)
        )
        # Merged/continuation rows often have an empty first cell. Keep their
        # text in sequence so a B dish and the rice below it can be recognized.
        # Also preserve section-only rows so 「共通料理」 can affect the next
        # date-cell row even when the heading itself is in column zero.
        if current_meal and len(row) > 1 and (has_date_content or row_marker):
            for column, date in date_header.items():
                if column >= len(row):
                    continue
                cell = row[column] or ""
                if row_marker == "共通料理":
                    combined = "共通料理" + ("\n" + cell if cell.strip() else "")
                elif row_marker in {"A", "B"} and cell.strip():
                    # Do not duplicate a marker already present in the cell.
                    combined = cell if option_prefix(cell) else f"{row_marker} {cell}"
                else:
                    combined = cell
                if combined.strip():
                    cell_texts.setdefault(date, {}).setdefault(current_meal, []).append(combined)

    parsed: dict[str, dict[str, Any]] = {}
    for date, meals in cell_texts.items():
        parsed[date] = {
            "date": date,
            "meals": {
                meal_key: parse_meal_text("\n".join(parts))
                for meal_key, parts in meals.items()
            },
            "pdf_url": pdf_url,
        }
    return parsed


def parse_page_coordinates(page: fitz.Page, pdf_url: str) -> dict[str, dict[str, Any]]:
    """Fallback for PDFs where table borders are not detectable.

    It groups PDF text spans into lines, locates the seven date headings and
    the three meal labels, then associates text by the resulting column/row
    areas. It is intentionally conservative: it returns nothing when the
    expected date and meal anchors are absent.
    """
    raw = page.get_text("dict")
    spans: list[tuple[float, float, float, float, str]] = []
    for block in raw.get("blocks", []):
        for line in block.get("lines", []):
            for span in line.get("spans", []):
                text = (span.get("text") or "").strip()
                if text:
                    x0, y0, x1, y1 = span.get("bbox", (0, 0, 0, 0))
                    spans.append((float(x0), float(y0), float(x1), float(y1), text))
    if not spans:
        return {}

    # Merge nearby spans on the same baseline *within each column*. A single
    # PDF baseline can contain seven different day cells, so never merge spans
    # across large horizontal gaps.
    lines: list[dict[str, Any]] = []
    baseline_groups: list[list[tuple[float, float, float, float, str]]] = []
    for span in sorted(spans, key=lambda item: (item[1], item[0])):
        _, y0, _, _, _ = span
        group = next((items for items in reversed(baseline_groups) if abs(items[0][1] - y0) <= 2.5), None)
        if group is None:
            group = []
            baseline_groups.append(group)
        group.append(span)

    for group in baseline_groups:
        segments: list[list[tuple[float, float, float, float, str]]] = []
        for span in sorted(group, key=lambda item: item[0]):
            if not segments or span[0] - max(item[2] for item in segments[-1]) > 14:
                segments.append([span])
            else:
                segments[-1].append(span)
        for segment in segments:
            segment.sort(key=lambda item: item[0])
            lines.append({
                "y": min(item[1] for item in segment),
                "x0": min(item[0] for item in segment),
                "x1": max(item[2] for item in segment),
                "text": "".join(item[4] for item in segment),
            })
    lines.sort(key=lambda line: (line["y"], line["x0"]))

    date_lines = []
    for line in lines:
        date = parse_date(line["text"])
        if date:
            date_lines.append({"date": date, "x": (line["x0"] + line["x1"]) / 2, "y": line["y"]})
    # One weekly table normally contains seven dates; require at least three
    # so a month title or a single date in the footer is not mistaken for it.
    date_lines = sorted({item["date"]: item for item in date_lines}.values(), key=lambda item: item["x"])
    if len(date_lines) < 3:
        return {}

    meal_lines = []
    first_date_x = date_lines[0]["x"]
    for line in lines:
        compact = re.sub(r"\s+", "", line["text"])
        key = next((meal for label, meal in MEAL_MAP.items() if compact == label), None)
        if key and line["x0"] < first_date_x:
            meal_lines.append({"key": key, "y": line["y"]})
    meal_lines.sort(key=lambda item: item["y"])
    unique_meals = []
    for meal in meal_lines:
        if not unique_meals or meal["key"] != unique_meals[-1]["key"]:
            unique_meals.append(meal)
    if not any(item["key"] == "breakfast" for item in unique_meals) or not any(item["key"] == "dinner" for item in unique_meals):
        return {}

    centers = [item["x"] for item in date_lines]
    bounds = [page.rect.x0]
    bounds.extend((centers[i] + centers[i + 1]) / 2 for i in range(len(centers) - 1))
    bounds.append(page.rect.x1)
    output: dict[str, dict[str, Any]] = {}
    for meal_index, meal_row in enumerate(unique_meals):
        y0 = meal_row["y"] - 2
        y1 = unique_meals[meal_index + 1]["y"] - 2 if meal_index + 1 < len(unique_meals) else page.rect.y1 - 22
        for index, date_item in enumerate(date_lines):
            x0, x1 = bounds[index], bounds[index + 1]
            cell_lines = [line for line in lines if y0 <= line["y"] < y1 and x0 <= (line["x0"] + line["x1"]) / 2 < x1]
            cell_text = "\n".join(line["text"] for line in sorted(cell_lines, key=lambda item: item["y"]))
            if not cell_text.strip():
                continue
            day = output.setdefault(date_item["date"], {"date": date_item["date"], "meals": {}, "pdf_url": pdf_url})
            day["meals"][meal_row["key"]] = parse_meal_text(cell_text)
    return output


def parse_pdf(pdf_bytes: bytes, pdf_url: str) -> dict[str, dict[str, Any]]:
    document = fitz.open(stream=pdf_bytes, filetype="pdf")
    days: dict[str, dict[str, Any]] = {}
    try:
        for page in document:
            page_days: dict[str, dict[str, Any]] = {}
            for rows in extract_tables(page):
                result = parse_table_rows(rows, pdf_url)
                for date, day in result.items():
                    existing = page_days.setdefault(date, {"date": date, "meals": {}, "pdf_url": pdf_url})
                    for meal_key, meal in day["meals"].items():
                        # Prefer the richer cell when table detection yields overlapping tables.
                        current = existing["meals"].get(meal_key)
                        score = lambda obj: sum(len(obj.get(k, [])) for k in ("a", "b", "common"))
                        if current is None or score(meal) >= score(current):
                            existing["meals"][meal_key] = meal
            if not page_days:
                page_days = parse_page_coordinates(page, pdf_url)
            for date, day in page_days.items():
                existing = days.setdefault(date, {"date": date, "meals": {}, "pdf_url": pdf_url})
                for meal_key, meal in day["meals"].items():
                    current = existing["meals"].get(meal_key)
                    if current is None or sum(len(meal.get(k, [])) for k in ("a", "b", "common")) >= sum(len(current.get(k, [])) for k in ("a", "b", "common")):
                        existing["meals"][meal_key] = meal
    finally:
        document.close()
    return days


def apply_allergen_overrides(days: dict[str, dict[str, Any]], override_path: Path) -> None:
    if not override_path.is_file():
        return
    try:
        overrides = json.loads(override_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"WARN: allergy override file could not be read: {exc}", file=sys.stderr)
        return
    for date, meals in overrides.items():
        if date not in days or not isinstance(meals, dict):
            continue
        for meal_key, options in meals.items():
            if meal_key not in days[date]["meals"] or not isinstance(options, dict):
                continue
            meal = days[date]["meals"][meal_key]
            allergens: dict[str, list[str] | None] = {"a": None, "b": None}
            valid = True
            for option in ("a", "b"):
                value = options.get(option)
                if not isinstance(value, list) or not all(isinstance(item, str) and item in ALLERGEN_KEYS for item in value):
                    valid = False
                    break
                allergens[option] = sorted(set(value))
            if valid:
                meal["allergens"] = allergens
                meal["allergen_status"] = "verified"


def build_daily_payload(menus_path: Path, override_path: Path, limit: int = 18) -> dict[str, Any]:
    monthly_payload = json.loads(menus_path.read_text(encoding="utf-8"))
    menus = monthly_payload.get("menus", [])
    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT})
    all_days: dict[str, dict[str, Any]] = {}

    for menu in menus[:limit]:
        pdf_url = menu.get("pdf_url", "")
        if not safe_pdf_url(pdf_url):
            continue
        try:
            response = session.get(pdf_url, timeout=TIMEOUT)
            response.raise_for_status()
            if "pdf" not in response.headers.get("Content-Type", "").lower() and not response.content.startswith(b"%PDF"):
                raise ValueError("response is not a PDF")
            extracted = parse_pdf(response.content, pdf_url)
            if not extracted:
                print(f"WARN: no date/meal table was recognized in {pdf_url}", file=sys.stderr)
            for date, day in extracted.items():
                day["month"] = date[:7]  # Use the actual date in the PDF, not the post/archive month.
                day["source_title"] = menu.get("title", "")
                all_days[date] = day
            print(f"INFO: extracted {len(extracted)} day(s) from {pdf_url}")
        except Exception as exc:
            print(f"WARN: could not parse {pdf_url}: {exc}", file=sys.stderr)

    if not all_days:
        raise RuntimeError("献立PDFから日別データを抽出できませんでした。既存データは保持してください。")

    apply_allergen_overrides(all_days, override_path)
    return {
        "days": [all_days[key] for key in sorted(all_days)],
        "status": "partial" if any(meal.get("allergen_status") != "verified" for day in all_days.values() for meal in day["meals"].values()) else "ok",
        "message": "献立PDFから抽出した日別データです。アレルゲン表示は原本確認済みデータ以外を未確認として扱います。",
        "allergen_status": "mixed_or_unverified",
        "allergen_items": ["egg", "milk", "wheat", "shrimp", "crab", "buckwheat", "peanut"],
        "updated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--menus-json", default="site/data/menus.json")
    parser.add_argument("--output", default="site/data/daily-menus.json")
    parser.add_argument("--allergen-overrides", default="site/data/allergen-overrides.json")
    parser.add_argument("--limit", type=int, default=18)
    args = parser.parse_args()
    output_path = Path(args.output)
    try:
        payload = build_daily_payload(Path(args.menus_json), Path(args.allergen_overrides), args.limit)
    except Exception as exc:
        print(f"WARN: daily menu extraction failed: {exc}", file=sys.stderr)
        # Keep a previously populated dataset during a transient source outage,
        # but do not silently succeed with an empty/pending placeholder file.
        if output_path.is_file():
            try:
                existing = json.loads(output_path.read_text(encoding="utf-8"))
                if isinstance(existing.get("days"), list) and existing["days"]:
                    print("INFO: preserving previously generated daily menu data.", file=sys.stderr)
                    return 0
            except (OSError, json.JSONDecodeError, AttributeError):
                pass
        return 1
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Updated {output_path}: {len(payload['days'])} days")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
