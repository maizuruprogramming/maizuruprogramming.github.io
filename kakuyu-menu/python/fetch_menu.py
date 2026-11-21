from __future__ import annotations

import argparse
import hashlib
import io
import json
import re
from datetime import datetime, timedelta, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin
from urllib.request import Request, urlopen

TOP_URL = "https://www.maizuru-ct.ac.jp/kakuyu/"
CATEGORY_URL = "https://www.maizuru-ct.ac.jp/kakuyu/category/dining/"
DEFAULT_MENU_PDF_URL = (
    "https://www.maizuru-ct.ac.jp/kakuyu/wp-content/uploads/sites/3/2026/10/menu-domitory-2026_11-2.pdf"
)
ALLERGY_NOTICE = "PDFファイルを確認してください．"
USER_AGENT = "Mozilla/5.0 (compatible; KakuyuryoMealSite/2.6)"
JST = timezone(timedelta(hours=9))

ALLERGEN_GLYPH_CHARS = set("卵乳小麦エビカニそば落花生くるみ●○◎・")
STATIC_NOISE_TOKENS = {
    "[Ａ]", "[Ｂ]", "[A]", "[B]", "[ 共通料理 ]", "[共通料理]",
    "栄養価", "アレルゲン", "朝", "昼", "夕", "食", "日付", "週", "間", "献", "立", "表",
}

# 単独セルで完結する主食・汁物・飲料（前後の料理行と誤結合させないためのガード）
STANDALONE_STAPLES = {
    "ごはん", "食パン", "ロールパン", "味噌汁", "赤だし",
    "卵スープ", "わかめスープ", "野菜スープ", "中華スープ", "コンソメスープ",
    "牛乳", "ジョア", "コーヒー牛乳",
}

# PDFの枠幅都合で末尾が省略されている表記の補完
DISH_TEXT_NORMALIZATIONS = {
    "メンチカツとのり塩コロッ": "メンチカツとのり塩コロッケ",
    "白身魚の野菜あんか": "白身魚の野菜あんかけ",
    "ちゃんぽん風": "ちゃんぽん風うどん",
}


class AnchorParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[dict[str, str]] = []
        self._href: str | None = None
        self._parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() == "a":
            href = dict(attrs).get("href")
            if href:
                self._href = href
                self._parts = []

    def handle_data(self, data: str) -> None:
        if self._href is not None:
            self._parts.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "a" and self._href is not None:
            text = " ".join("".join(self._parts).split())
            self.links.append({"href": self._href, "text": text})
            self._href = None
            self._parts = []


def get_next_monday_0630_jst(now_jst: datetime | None = None) -> datetime:
    current = now_jst or datetime.now(JST)
    days_ahead = (0 - current.weekday()) % 7
    candidate = current.replace(hour=6, minute=30, second=0, microsecond=0) + timedelta(days=days_ahead)
    if candidate <= current:
        candidate += timedelta(days=7)
    return candidate


def fetch_bytes(url: str, timeout: int = 25) -> bytes:
    req = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(req, timeout=timeout) as resp:
        return resp.read()


def fetch_html(url: str, timeout: int = 25) -> str:
    return fetch_bytes(url, timeout=timeout).decode("utf-8", errors="replace")


def extract_links(html: str, base_url: str) -> list[dict[str, str]]:
    parser = AnchorParser()
    parser.feed(html)
    return [
        {"href": urljoin(base_url, item["href"].strip()), "text": item["text"]}
        for item in parser.links
    ]


def find_latest_official_links() -> dict:
    """公式サイトから最新の献立表PDF・栄養価計算書PDFのURLを取得する."""
    menu_pdf_url = ""
    nutrition_pdf_url = ""
    article_title = "学寮食堂献立表（令和8年11月）※11/12変更"

    for page_url in (TOP_URL, CATEGORY_URL):
        try:
            html = fetch_html(page_url)
            for link in extract_links(html, page_url):
                text = link["text"]
                href = link["href"]
                if "学寮食堂献立表" in text and href.lower().endswith(".pdf") and not menu_pdf_url:
                    menu_pdf_url = href
                    article_title = text
                elif "栄養価計算書" in text and href.lower().endswith(".pdf") and not nutrition_pdf_url:
                    nutrition_pdf_url = href
            if menu_pdf_url:
                break
        except Exception as exc:
            print(f"[WARN] 一覧ページ取得スキップ ({page_url}): {exc}")

    if not menu_pdf_url:
        menu_pdf_url = DEFAULT_MENU_PDF_URL

    return {
        "published_date": "2026年10月27日",
        "title": article_title,
        "note": "※11.14の昼食が変更になっています。",
        "article_url": TOP_URL,
        "menu_pdf_url": menu_pdf_url,
        "nutrition_pdf_url": nutrition_pdf_url,
    }


def apply_ctm(x: float, y: float, cm: list[float], rotation: int, page_w: float, page_h: float) -> tuple[float, float]:
    ux = x * cm[0] + y * cm[2] + cm[4]
    uy = x * cm[1] + y * cm[3] + cm[5]

    rot = rotation % 360
    if rot == 90:
        return uy, page_w - ux
    if rot == 180:
        return page_w - ux, page_h - uy
    if rot == 270:
        return page_h - uy, ux
    return ux, uy


def transform_point(tm: list[float], cm: list[float], rotation: int, page_w: float, page_h: float) -> tuple[float, float]:
    return apply_ctm(tm[4], tm[5], cm, rotation, page_w, page_h)


def merge_same_line_fragments(
    fragments: list[tuple[float, float, str]],
    y_tol: float = 2.8,
    max_x_gap: float = 28.0,
) -> list[tuple[float, float, str]]:
    """同一Y座標上の分割されたテキスト断片を結合する."""
    if not fragments:
        return []

    sorted_f = sorted(fragments, key=lambda t: (-round(t[1] / y_tol), t[0]))
    merged: list[dict] = []

    for x, y, txt in sorted_f:
        if merged and abs(merged[-1]["y"] - y) <= y_tol and (x - merged[-1]["end_x"]) <= max_x_gap:
            gap = x - merged[-1]["end_x"]
            sep = " " if gap > 10.0 and not merged[-1]["text"].endswith(("年", "月", "日")) else ""
            merged[-1]["text"] += sep + txt
            merged[-1]["end_x"] = x + max(len(txt) * 4.5, 4.0)
        else:
            merged.append(
                {
                    "x": x,
                    "end_x": x + max(len(txt) * 4.5, 4.0),
                    "y": y,
                    "text": txt,
                }
            )

    return [(m["x"], m["y"], " ".join(m["text"].split())) for m in merged]


def cluster_y_positions(ys: list[float], tol: float = 15.0) -> list[float]:
    if not ys:
        return []
    sorted_ys = sorted(ys, reverse=True)
    clusters: list[list[float]] = [[sorted_ys[0]]]
    for y in sorted_ys[1:]:
        if abs(clusters[-1][-1] - y) <= tol:
            clusters[-1].append(y)
        else:
            clusters.append([y])
    return [sum(c) / len(c) for c in clusters]


def is_allergen_or_noise_text(txt: str) -> bool:
    t = txt.strip()
    if not t or t in STATIC_NOISE_TOKENS:
        return True
    compact = t.replace(" ", "").replace(" ", "")
    if not compact:
        return True
    if all(ch in ALLERGEN_GLYPH_CHARS for ch in compact):
        return True
    if t.startswith(("蛋白質", "脂質", "食塩", "◆", "【アレルギー", "★都合により", "舞鶴工業")):
        return True
    return False


def normalize_dish_name(name: str) -> str:
    cleaned = " ".join(name.split()).strip()
    return DISH_TEXT_NORMALIZATIONS.get(cleaned, cleaned)


def parse_meal_cell(
    frags: list[tuple[float, float, str]],
    col_left: float,
    col_right: float,
    horizontal_borders: list[tuple[float, float, float]],
) -> dict:
    """1食分（朝食/昼食/夕食）の断片群から、テーブル罫線とA/Bマーカーを使って料理単位へ結合する."""
    col_width = max(col_right - col_left, 1.0)
    calorie_re = re.compile(r"(?:ｴﾈﾙｷﾞｰ|エネルギー)\s*(\d+)\s*kcal", re.IGNORECASE)
    calories_found: list[int] = []
    ab_markers: list[tuple[float, str]] = []
    dish_frags: list[tuple[float, float, str]] = []

    for x, y, raw_txt in frags:
        txt = raw_txt.replace("●", "").strip()
        if not txt:
            continue

        cal_m = calorie_re.search(txt)
        if cal_m:
            calories_found.append(int(cal_m.group(1)))
            continue

        if is_allergen_or_noise_text(txt):
            continue

        rel_x = (x - col_left) / col_width

        if txt in {"A", "Ａ", "[A]", "[Ａ]"} and rel_x <= 0.42:
            ab_markers.append((y, "A"))
            continue
        if txt in {"B", "Ｂ", "[B]", "[Ｂ]"} and rel_x <= 0.42:
            ab_markers.append((y, "B"))
            continue

        m_prefix = re.match(r"^([ABＡＢ])\s+(.+)$", txt)
        if m_prefix and rel_x <= 0.42:
            kind = "A" if m_prefix.group(1) in {"A", "Ａ"} else "B"
            ab_markers.append((y, kind))
            rest = m_prefix.group(2).strip()
            if not is_allergen_or_noise_text(rest):
                dish_frags.append((x + 6.0, y, rest))
            continue

        dish_frags.append((x, y, txt))

    merged_lines = merge_same_line_fragments(dish_frags, y_tol=2.8, max_x_gap=26.0)

    col_mid_x = col_left + col_width * 0.45
    col_border_ys = sorted(
        {
            round(hy, 1)
            for x0, x1, hy in horizontal_borders
            if x0 <= col_mid_x <= x1
        },
        reverse=True,
    )

    def has_border_between(y_upper: float, y_lower: float) -> bool:
        for hy in col_border_ys:
            if (y_lower + 1.5) < hy < (y_upper - 1.5):
                return True
        return False

    def has_marker_starting_at(y_upper: float, y_lower: float) -> bool:
        for my, _ in ab_markers:
            if abs(my - y_lower) <= 4.0 and abs(my - y_upper) > 8.0:
                return True
        return False

    dishes: list[dict] = []
    for x, y, txt in merged_lines:
        clean_t = txt.replace("●", "").strip()
        if not clean_t or clean_t in {"A", "B", "Ａ", "Ｂ"} or is_allergen_or_noise_text(clean_t):
            continue

        if not dishes:
            dishes.append({"first_y": y, "last_y": y, "center_y": y, "text": clean_t})
            continue

        prev_y = dishes[-1]["last_y"]
        prev_txt = dishes[-1]["text"]
        dy = prev_y - y

        if clean_t in STANDALONE_STAPLES or prev_txt in STANDALONE_STAPLES:
            same_cell = False
        elif col_border_ys:
            same_cell = (
                dy < 24.0
                and not has_border_between(prev_y, y)
                and not has_marker_starting_at(prev_y, y)
            )
        else:
            same_cell = dy < 17.8 and not has_marker_starting_at(prev_y, y)

        if same_cell:
            dishes[-1]["text"] += clean_t
            dishes[-1]["last_y"] = y
        else:
            dishes.append({"first_y": y, "last_y": y, "center_y": y, "text": clean_t})

    for d in dishes:
        d["center_y"] = (d["first_y"] + d["last_y"]) / 2.0
        d["text"] = normalize_dish_name(d["text"])

    a_ys = sorted([y for y, k in ab_markers if k == "A"], reverse=True)
    b_ys = sorted([y for y, k in ab_markers if k == "B"], reverse=True)

    set_a_name = ""
    set_b_name = ""
    common_items: list[str] = []

    if dishes:
        if a_ys or b_ys:
            used_indices: set[int] = set()
            if a_ys:
                ay = a_ys[0]
                best_i = min(range(len(dishes)), key=lambda i: abs(dishes[i]["center_y"] - ay))
                if abs(dishes[best_i]["center_y"] - ay) <= 24.0:
                    set_a_name = dishes[best_i]["text"]
                    used_indices.add(best_i)
            if b_ys:
                by = b_ys[0]
                candidates = [i for i in range(len(dishes)) if i not in used_indices]
                if candidates:
                    best_i = min(candidates, key=lambda i: abs(dishes[i]["center_y"] - by))
                    if abs(dishes[best_i]["center_y"] - by) <= 24.0:
                        set_b_name = dishes[best_i]["text"]
                        used_indices.add(best_i)
            for i, d in enumerate(dishes):
                if i not in used_indices:
                    common_items.append(d["text"])
        else:
            set_a_name = dishes[0]["text"]
            set_b_name = "共通メニュー（選択なし）"
            common_items = [d["text"] for d in dishes[1:]]

    set_a_obj: dict = {"name": set_a_name}
    set_b_obj: dict = {"name": set_b_name}
    if len(calories_found) >= 1:
        set_a_obj["calories"] = calories_found[0]
    if len(calories_found) >= 2:
        set_b_obj["calories"] = calories_found[1]

    return {
        "set_a": set_a_obj,
        "set_b": set_b_obj,
        "common": {"items": common_items},
    }


def extract_days_from_official_pdf(pdf_url: str, target_year: int = 2026, target_month: int = 11) -> list[dict]:
    """公式週間献立表PDFから全ページ・全日程の朝食・昼食・夕食を抽出する."""
    from pypdf import PdfReader  # type: ignore

    print(f"[INFO] 公式献立表PDFをダウンロード中: {pdf_url}")
    pdf_bytes = fetch_bytes(pdf_url)
    reader = PdfReader(io.BytesIO(pdf_bytes))
    print(f"[INFO] PDFページ数: {len(reader.pages)} ページ")

    date_re = re.compile(r"(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日\s*[（(]([月火水木金土日])[）)]")
    extracted_days: dict[str, dict] = {}

    for page_idx, page in enumerate(reader.pages, start=1):
        rotation = int(page.get("/Rotate", 0) or 0)
        page_w = float(page.mediabox.width)
        page_h = float(page.mediabox.height)
        raw_fragments: list[tuple[float, float, str]] = []
        horizontal_borders: list[tuple[float, float, float]] = []
        path_state: dict[str, tuple[float, float] | None] = {"cur": None}

        def visitor_body(text, cm, tm, font_dict, font_size):
            cleaned = " ".join((text or "").split())
            if cleaned:
                px, py = transform_point(tm, cm, rotation, page_w, page_h)
                raw_fragments.append((px, py, cleaned))

        def visitor_op(op, args, cm, tm):
            try:
                if op == b"re" and len(args) == 4:
                    rx, ry, rw, rh = [float(v) for v in args]
                    x0, y0 = apply_ctm(rx, ry, cm, rotation, page_w, page_h)
                    x1, y1 = apply_ctm(rx + rw, ry + rh, cm, rotation, page_w, page_h)
                    xmin, xmax = min(x0, x1), max(x0, x1)
                    if (xmax - xmin) >= 20.0:
                        horizontal_borders.append((xmin, xmax, y0))
                        if abs(y1 - y0) >= 2.0:
                            horizontal_borders.append((xmin, xmax, y1))
                elif op == b"m" and len(args) == 2:
                    path_state["cur"] = apply_ctm(float(args[0]), float(args[1]), cm, rotation, page_w, page_h)
                elif op == b"l" and len(args) == 2 and path_state["cur"] is not None:
                    nx, ny = apply_ctm(float(args[0]), float(args[1]), cm, rotation, page_w, page_h)
                    px, py = path_state["cur"]
                    if abs(ny - py) <= 1.5 and abs(nx - px) >= 20.0:
                        horizontal_borders.append((min(px, nx), max(px, nx), (py + ny) / 2.0))
                    path_state["cur"] = (nx, ny)
            except Exception:
                pass

        page.extract_text(visitor_text=visitor_body, visitor_operand_before=visitor_op)
        lines = merge_same_line_fragments(raw_fragments, y_tol=3.2, max_x_gap=38.0)

        date_headers: list[tuple[float, float, str, str, bool]] = []
        for x, y, txt in lines:
            m = date_re.search(txt)
            if m:
                y_num, m_num, d_num, dow = int(m.group(1)), int(m.group(2)), int(m.group(3)), m.group(4)
                iso = f"{y_num:04d}-{m_num:02d}-{d_num:02d}"
                is_target = (y_num == target_year and m_num == target_month)
                date_headers.append((x, y, iso, dow, is_target))

        date_headers.sort(key=lambda t: t[0])
        print(
            f"  - Page {page_idx}: 検出列 {len(date_headers)} 日分 / 水平罫線 {len(horizontal_borders)} 本"
        )
        if not date_headers:
            continue

        header_y = max(d[1] for d in date_headers)
        a_ys = cluster_y_positions([y for _, y, txt in lines if txt in {"[Ａ]", "[A]"}])

        if len(a_ys) >= 3:
            b_top = header_y - 4.0
            l_top = max(a_ys[1] + 28.0, (a_ys[0] + a_ys[1]) / 2)
            d_top = max(a_ys[2] + 28.0, (a_ys[1] + a_ys[2]) / 2)
        else:
            span = header_y - 40.0
            b_top = header_y - 4.0
            l_top = header_y - span * 0.34
            d_top = header_y - span * 0.67

        col_widths = [
            date_headers[i + 1][0] - date_headers[i][0]
            for i in range(len(date_headers) - 1)
        ]
        avg_col_width = sum(col_widths) / len(col_widths) if col_widths else 110.0

        for col_idx, (col_x, _, iso, dow, is_target) in enumerate(date_headers):
            if not is_target:
                continue

            left_bound = (
                (date_headers[col_idx - 1][0] + col_x) / 2
                if col_idx > 0
                else (col_x - avg_col_width * 0.38)
            )
            right_bound = (
                (col_x + date_headers[col_idx + 1][0]) / 2
                if col_idx + 1 < len(date_headers)
                else (left_bound + avg_col_width)
            )

            col_frags = [
                (x, y, txt)
                for x, y, txt in raw_fragments
                if left_bound <= x < right_bound and y < b_top and not date_re.search(txt)
            ]

            buckets: dict[str, list[tuple[float, float, str]]] = {
                "breakfast": [],
                "lunch": [],
                "dinner": [],
            }
            for x, y, txt in col_frags:
                if y >= l_top:
                    buckets["breakfast"].append((x, y, txt))
                elif y >= d_top:
                    buckets["lunch"].append((x, y, txt))
                elif y >= 35.0:
                    buckets["dinner"].append((x, y, txt))

            meals_obj = {
                meal_key: parse_meal_cell(buckets[meal_key], left_bound, right_bound, horizontal_borders)
                for meal_key in ("breakfast", "lunch", "dinner")
            }

            extracted_days[iso] = {
                "date": iso,
                "day_of_week": dow,
                "meals": meals_obj,
            }

    return [extracted_days[k] for k in sorted(extracted_days.keys())]


def run_monthly_menu_check(trigger: str = "manual") -> dict:
    root_dir = Path(__file__).resolve().parent.parent
    output_json_path = root_dir / "web" / "monthly_menu.json"
    output_yaml_path = root_dir / "data" / "menu.yaml"

    now_jst = datetime.now(JST)
    checked_at_str = now_jst.strftime("%Y-%m-%d %H:%M:%S JST")
    next_monday_str = get_next_monday_0630_jst(now_jst).strftime("%Y-%m-%d %H:%M:%S JST")
    target_month_label = f"{now_jst.year}年{now_jst.month}月（令和{now_jst.year - 2018}年{now_jst.month}月）"

    latest_article = find_latest_official_links()
    days = extract_days_from_official_pdf(
        latest_article["menu_pdf_url"],
        target_year=now_jst.year,
        target_month=now_jst.month,
    )

    if not days:
        raise RuntimeError("公式PDFから献立データを1日分も抽出できませんでした。")

    menu_hash = hashlib.sha256(
        json.dumps(days, ensure_ascii=False, sort_keys=True).encode("utf-8")
    ).hexdigest()[:12]

    payload = {
        "source_url": CATEGORY_URL,
        "fetched_at": checked_at_str,
        "status": "live_pdf_extracted",
        "error": "",
        "allergy_notice": ALLERGY_NOTICE,
        "auto_check": {
            "enabled": True,
            "schedule_label": "毎週月曜日 06:30 ごろ（JST）",
            "cron_utc": "30 21 * * 0",
            "trigger": trigger,
            "last_checked_at": checked_at_str,
            "next_check_at": next_monday_str,
            "target_month": target_month_label,
            "result_status": "success",
            "updated": True,
            "menu_hash": menu_hash,
            "result_message": (
                f"公式PDF「{latest_article['title']}」から直接 {len(days)}日分の献立を取得・反映しました。"
            ),
        },
        "latest_article": latest_article,
        "days": days,
    }

    output_json_path.parent.mkdir(parents=True, exist_ok=True)
    output_json_path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    try:
        import yaml  # type: ignore

        yaml_doc = {
            "source_url": CATEGORY_URL,
            "article_url": TOP_URL,
            "menu_pdf_url": latest_article["menu_pdf_url"],
            "month_label": latest_article["title"],
            "note": latest_article.get("note", ""),
            "allergy_notice": ALLERGY_NOTICE,
            "days": days,
        }
        output_yaml_path.parent.mkdir(parents=True, exist_ok=True)
        output_yaml_path.write_text(
            yaml.safe_dump(yaml_doc, allow_unicode=True, sort_keys=False),
            encoding="utf-8",
        )
    except ImportError:
        pass

    print(f"[OK] 公式PDFから {len(days)}日分の朝食・昼食・夕食を取得し、反映しました。")
    return payload


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--trigger", default="manual")
    args = parser.parse_args()
    run_monthly_menu_check(trigger=args.trigger)