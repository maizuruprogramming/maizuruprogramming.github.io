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
USER_AGENT = "Mozilla/5.0 (compatible; KakuyuryoMealSite/2.1)"
JST = timezone(timedelta(hours=9))

IGNORE_TOKENS = {
    "[Ａ]", "[Ｂ]", "[A]", "[B]", "[ 共通料理 ]", "[共通料理]",
    "A", "B", "Ａ", "Ｂ", "栄養価", "アレルゲン", "●", "・",
    "卵", "乳", "小麦", "エビ", "カニ", "そば", "落花生", "くるみ",
    "朝", "昼", "夕", "食", "日付", "週", "間", "献", "立", "表",
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


def transform_point(tm: list[float], cm: list[float], rotation: int, page_w: float, page_h: float) -> tuple[float, float]:
    """テキスト行列(tm)・CTM(cm)・ページ回転を適用し、左→右(x), 下→上(y)の座標に正規化する."""
    ux = tm[4] * cm[0] + tm[5] * cm[2] + cm[4]
    uy = tm[4] * cm[1] + tm[5] * cm[3] + cm[5]

    rot = rotation % 360
    if rot == 90:
        return uy, page_w - ux
    if rot == 180:
        return page_w - ux, page_h - uy
    if rot == 270:
        return page_h - uy, ux
    return ux, uy


def merge_same_line_fragments(fragments: list[tuple[float, float, str]], y_tol: float = 3.5) -> list[tuple[float, float, str]]:
    """同一Y座標上の分割されたテキスト断片（例: '2026年' + '11月' + '21日(土)'）を結合する."""
    if not fragments:
        return []

    sorted_f = sorted(fragments, key=lambda t: (-round(t[1] / y_tol), t[0]))
    merged: list[dict] = []

    for x, y, txt in sorted_f:
        if merged and abs(merged[-1]["y"] - y) <= y_tol and (x - merged[-1]["end_x"]) <= 42.0:
            gap = x - merged[-1]["end_x"]
            sep = " " if gap > 8.0 and not merged[-1]["text"].endswith(("年", "月", "日")) else ""
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
    """近いY座標をグループ化し、上から順（Y降順）に代表値を返す."""
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


def is_noise_token(txt: str) -> bool:
    t = txt.strip()
    if not t or t in IGNORE_TOKENS:
        return True
    if set(t) <= {"●", "・", " ", " "}:
        return True
    if t.startswith(("蛋白質", "脂質", "食塩", "◆", "【アレルギー", "★都合により", "舞鶴工業")):
        return True
    return False


def parse_meal_cell_lines(entries: list[tuple[float, str]], set_b_y: float | None = None) -> dict:
    """1食分（朝食/昼食/夕食）のセル内テキスト群から A定食・B定食・共通料理・カロリーを構築する."""
    calorie_re = re.compile(r"(?:ｴﾈﾙｷﾞｰ|エネルギー)\s*(\d+)\s*kcal", re.IGNORECASE)
    calories_found: list[int] = []
    dish_entries: list[tuple[float, str]] = []

    for y, txt in sorted(entries, key=lambda t: -t[0]):
        cal_m = calorie_re.search(txt)
        if cal_m:
            calories_found.append(int(cal_m.group(1)))
            continue
        if is_noise_token(txt):
            continue
        dish_entries.append((y, txt))

    # 同一セル内で2行に折り返された料理名（Y差が小さい行）を結合
    grouped_dishes: list[tuple[float, str]] = []
    for y, txt in dish_entries:
        if grouped_dishes and (grouped_dishes[-1][0] - y) < 9.5:
            prev_y, prev_txt = grouped_dishes[-1]
            grouped_dishes[-1] = (y, f"{prev_txt} {txt}")
        else:
            grouped_dishes.append((y, txt))

    dishes = [d[1] for d in grouped_dishes]
    set_a_name = dishes[0] if len(dishes) >= 1 else ""
    set_b_name = dishes[1] if len(dishes) >= 2 else ""
    common_items = dishes[2:] if len(dishes) >= 3 else []

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

        def visitor_body(text, cm, tm, font_dict, font_size):
            cleaned = " ".join((text or "").split())
            if cleaned:
                px, py = transform_point(tm, cm, rotation, page_w, page_h)
                raw_fragments.append((px, py, cleaned))

        page.extract_text(visitor_text=visitor_body)
        lines = merge_same_line_fragments(raw_fragments)

        # 日付列ヘッダーの検出
        date_headers: list[tuple[float, float, str, str, bool]] = []
        for x, y, txt in lines:
            m = date_re.search(txt)
            if m:
                y_num, m_num, d_num, dow = int(m.group(1)), int(m.group(2)), int(m.group(3)), m.group(4)
                iso = f"{y_num:04d}-{m_num:02d}-{d_num:02d}"
                is_target = (y_num == target_year and m_num == target_month)
                date_headers.append((x, y, iso, dow, is_target))

        date_headers.sort(key=lambda t: t[0])
        print(f"  - Page {page_idx}: 検出列 {len(date_headers)} 日分 ({[d[2] for d in date_headers]})")
        if not date_headers:
            continue

        header_y = max(d[1] for d in date_headers)

        # [Ａ] と [Ｂ] のY座標クラスタから 朝食・昼食・夕食 の3段の境界を特定
        a_ys = cluster_y_positions([y for _, y, txt in lines if txt in {"[Ａ]", "[A]"}])
        b_ys = cluster_y_positions([y for _, y, txt in lines if txt in {"[Ｂ]", "[B]"}])

        if len(a_ys) >= 3:
            # 上から順に 朝食[A], 昼食[A], 夕食[A]
            b_top = header_y - 4.0
            l_top = (a_ys[0] + a_ys[1]) / 2 + 25.0
            d_top = (a_ys[1] + a_ys[2]) / 2 + 25.0
            # 各食の実際の開始位置は [A] の少し上（主食行を含む）
            l_top = max(a_ys[1] + 28.0, (a_ys[0] + a_ys[1]) / 2)
            d_top = max(a_ys[2] + 28.0, (a_ys[1] + a_ys[2]) / 2)
        else:
            span = header_y - 40.0
            b_top = header_y - 4.0
            l_top = header_y - span * 0.34
            d_top = header_y - span * 0.67

        for col_idx, (col_x, _, iso, dow, is_target) in enumerate(date_headers):
            if not is_target:
                continue

            left_bound = (date_headers[col_idx - 1][0] + col_x) / 2 if col_idx > 0 else (col_x - 55.0)
            right_bound = (col_x + date_headers[col_idx + 1][0]) / 2 if col_idx + 1 < len(date_headers) else (col_x + 85.0)

            col_items = [
                (y, txt)
                for x, y, txt in lines
                if left_bound <= x < right_bound and y < b_top and not date_re.search(txt)
            ]

            buckets: dict[str, list[tuple[float, str]]] = {
                "breakfast": [],
                "lunch": [],
                "dinner": [],
            }
            for y, txt in col_items:
                if y >= l_top:
                    buckets["breakfast"].append((y, txt))
                elif y >= d_top:
                    buckets["lunch"].append((y, txt))
                elif y >= 35.0:
                    buckets["dinner"].append((y, txt))

            meals_obj = {
                meal_key: parse_meal_cell_lines(
                    buckets[meal_key],
                    b_ys[idx] if idx < len(b_ys) else None,
                )
                for idx, meal_key in enumerate(("breakfast", "lunch", "dinner"))
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
        raise RuntimeError("公式PDFから献立データを1日分も抽出できませんでした。PDFレイアウトを確認してください。")

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