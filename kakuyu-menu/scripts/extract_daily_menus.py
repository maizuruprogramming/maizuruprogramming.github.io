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
    value = unicodedata.normalize("NFKC", value or "").replace("\u3000", " ").replace("\xa0", " ")
    lines = []
    for raw in value.replace("\r", "\n").split("\n"):
        line = re.sub(r"\s+", " ", raw).strip(" ・\t\u2022")
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
    compact = line.replace(" ", "")
    if re.search(r"[【\[（(]共通料理[】\]）)]", compact) or compact.startswith("共通料理"):
        return "common"
    if re.search(r"[【\[（(]A[】\]）)]", compact) or compact in {"A", "献立A"}:
        return "a"
    if re.search(r"[【\[（(]B[】\]）)]", compact) or compact in {"B", "献立B"}:
        return "b"
    return None


def option_prefix(line: str) -> tuple[str, str] | None:
    """Return (a|b, remaining text) when a line starts with A or B.

    The official menu can prefix option entries with plain `A` / `B` rather
    than bracketed labels. Accept forms such as `A ごはん`, `A:ごはん`, and
    `Aごはん` while avoiding ordinary English words such as `Apple`/`Bread`.
    """
    # Also allow an explicit label such as `A定食：カレー`.
    meal_label = re.match(r"^([AB])定食(?:\s*[:：]\s*|\s+)?(.*)$", line, flags=re.IGNORECASE)
    if meal_label:
        return ("a" if meal_label.group(1).upper() == "A" else "b", meal_label.group(2).strip())

    match = re.match(
        r"^([AB])(?:(?:\s*[:：.．、)）\-－]\s*)|(?:\s+)|(?=[^A-Za-z]))(.*)$",
        line,
        flags=re.IGNORECASE,
    )
    if not match:
        return None
    return ("a" if match.group(1).upper() == "A" else "b", match.group(2).strip())


def parse_meal_text(value: str) -> dict[str, Any]:
    """Parse a date/meal table cell into A, B, common dishes and nutrition."""
    result: dict[str, Any] = {
        "a": [], "b": [], "common": [],
        "nutrition": {"a": {}, "b": {}},
        "allergens": {"a": None, "b": None},
        "allergen_status": "unverified",
    }
    section: str | None = None
    marker_pattern = re.compile(r"(?=[【\[（(]\s*(?:共通料理|A|B)\s*[】\]）)])")
    # A/B may also be plain prefixes at the beginning of a text segment.
    # A following whitespace/punctuation/Japanese character makes it a label;
    # an ordinary English word beginning with A or B is left untouched.
    option_split_pattern = re.compile(
        r"(?<=\s)(?=[AB](?:\s*[:：.．、)）\-－]\s*|\s+|(?=[^A-Za-z])))",
        flags=re.IGNORECASE,
    )
    for raw_line in normalize_lines(value):
        # Some PDF text layers concatenate several labelled sections onto one
        # line. Split at bracketed markers and whitespace-separated A/B prefixes.
        marked_parts: list[str] = []
        for part in marker_pattern.split(raw_line):
            marked_parts.extend(option_split_pattern.split(part))
        for line in marked_parts:
            line = line.strip()
            if not line:
                continue
            marker_match = re.match(r"^[【\[（(]\s*(共通料理|A|B)\s*[】\]）)]\s*(.*)$", line)
            if marker_match:
                marker_label, remainder = marker_match.groups()
                section = {"A": "a", "B": "b", "共通料理": "common"}[marker_label]
                line = remainder.strip()
                if not line:
                    continue
            else:
                marker = marker_for_line(line)
                if marker:
                    section = marker
                    continue
                prefix = option_prefix(line)
                if prefix:
                    section, line = prefix
                    if not line:
                        continue
            if "エネルギー" in line or "蛋白質" in line or "たんぱく質" in line or "食塩" in line:
                nutrition = extract_nutrition(line)
                if nutrition and section in {"a", "b"}:
                    result["nutrition"][section].update(nutrition)
                continue
            if line:
                if section in {"a", "b", "common"}:
                    result[section].append(line)
                else:
                    # The PDF sometimes uses a single shared weekend menu without A/B labels.
                    result["common"].append(line)

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
    parsed: dict[str, dict[str, Any]] = {}
    date_header: dict[int, str] = {}
    meal_rows: list[tuple[str, list[str]]] = []

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
        return parsed

    current_meal: str | None = None
    for row in rows[header_index + 1:]:
        if not row:
            continue
        label = re.sub(r"\s+", "", row[0] or "")
        found_meal = next((key for label_text, key in MEAL_MAP.items() if label_text in label), None)
        if found_meal:
            current_meal = found_meal
            for column, date in date_header.items():
                if column >= len(row):
                    continue
                cell = row[column] or ""
                if not cell.strip():
                    continue
                day = parsed.setdefault(date, {"date": date, "meals": {}, "pdf_url": pdf_url})
                day["meals"][current_meal] = parse_meal_text(cell)
            continue

        # A merged or continuation row may have a blank first cell. Do not
        # attach arbitrary rows unless they line up with a known meal table.
        if current_meal and len(row) > 1 and any((row[col] or "").strip() for col in date_header if col < len(row)):
            for column, date in date_header.items():
                if column >= len(row) or not (row[column] or "").strip():
                    continue
                day = parsed.setdefault(date, {"date": date, "meals": {}, "pdf_url": pdf_url})
                meal = day["meals"].setdefault(current_meal, parse_meal_text(""))
                extra = parse_meal_text(row[column] or "")
                for key in ("a", "b", "common"):
                    meal[key].extend(item for item in extra[key] if item not in meal[key])
                for option in ("a", "b"):
                    meal["nutrition"][option].update(extra["nutrition"][option])
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
                day["month"] = menu.get("month", date[:7])
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
        return 0 if output_path.is_file() else 1
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Updated {output_path}: {len(payload['days'])} days")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
