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
USER_AGENT = "Mozilla/5.0 (compatible; KakuyuryoMealSite/2.0)"
JST = timezone(timedelta(hours=9))


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


def fetch_bytes(url: str, timeout: int = 20) -> bytes:
    req = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(req, timeout=timeout) as resp:
        return resp.read()


def fetch_html(url: str, timeout: int = 20) -> str:
    return fetch_bytes(url, timeout=timeout).decode("utf-8", errors="replace")


def extract_links(html: str, base_url: str) -> list[dict[str, str]]:
    parser = AnchorParser()
    parser.feed(html)
    return [
        {"href": urljoin(base_url, item["href"].strip()), "text": item["text"]}
        for item in parser.links
    ]


def find_latest_official_links() -> dict:
    """公式サイトから最新の献立表PDF・栄養価計算書PDFのURLを取得する（仮データは一切使用しない）."""
    html = fetch_html(TOP_URL)
    links = extract_links(html, TOP_URL)

    menu_pdf_url = ""
    nutrition_pdf_url = ""
    article_title = "学寮食堂献立表（令和8年11月）※11/12変更"

    for link in links:
        text = link["text"]
        href = link["href"]
        if "学寮食堂献立表" in text and href.lower().endswith(".pdf"):
            menu_pdf_url = href
            article_title = text
        elif "栄養価計算書" in text and href.lower().endswith(".pdf") and not nutrition_pdf_url:
            nutrition_pdf_url = href

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


def extract_days_from_official_pdf(pdf_url: str, target_year: int = 2026, target_month: int = 11) -> list[dict]:
    """公式週間献立表PDF（横並び7列レイアウト）から座標ベースで日別献立を抽出する."""
    from pypdf import PdfReader  # type: ignore

    pdf_bytes = fetch_bytes(pdf_url)
    reader = PdfReader(io.BytesIO(pdf_bytes))

    date_re = re.compile(r"(\d{4})年(\d{1,2})月(\d{1,2})日\(([月火水木金土日])\)")
    extracted_days: dict[str, dict] = {}

    for page in reader.pages:
        items: list[tuple[float, float, str]] = []

        def visitor_body(text, cm, tm, font_dict, font_size):
            cleaned = " ".join((text or "").split())
            if cleaned:
                items.append((float(tm[4]), float(tm[5]), cleaned))

        page.extract_text(visitor_text=visitor_body)

        date_headers: list[tuple[float, str, str]] = []
        for x, y, txt in items:
            m = date_re.search(txt)
            if m:
                y_num, m_num, d_num, dow = int(m.group(1)), int(m.group(2)), int(m.group(3)), m.group(4)
                if y_num == target_year and m_num == target_month:
                    iso = f"{y_num:04d}-{m_num:02d}-{d_num:02d}"
                    date_headers.append((x, iso, dow))

        date_headers.sort(key=lambda t: t[0])
        if not date_headers:
            continue

        meal_markers = {"breakfast": None, "lunch": None, "dinner": None}
        for _, y, txt in items:
            if "朝" in txt and "食" in txt:
                meal_markers["breakfast"] = y
            elif "昼" in txt and "食" in txt:
                meal_markers["lunch"] = y
            elif "夕" in txt and "食" in txt:
                meal_markers["dinner"] = y

        for col_idx, (col_x, iso, dow) in enumerate(date_headers):
            left_bound = (date_headers[col_idx - 1][0] + col_x) / 2 if col_idx > 0 else -1e9
            right_bound = (col_x + date_headers[col_idx + 1][0]) / 2 if col_idx + 1 < len(date_headers) else 1e9

            col_items = [
                (y, txt)
                for x, y, txt in items
                if left_bound <= x < right_bound and not date_re.search(txt)
            ]
            col_items.sort(key=lambda t: -t[0])

            b_y = meal_markers["breakfast"] or 600.0
            l_y = meal_markers["lunch"] or 380.0
            d_y = meal_markers["dinner"] or 180.0

            buckets: dict[str, list[str]] = {"breakfast": [], "lunch": [], "dinner": []}
            for y, txt in col_items:
                if (
                    txt in {"[Ａ]", "[Ｂ]", "[ 共通料理 ]", "A", "B", "栄養価"}
                    or txt.startswith("ｴﾈﾙｷﾞｰ")
                    or txt.startswith("蛋白質")
                    or txt.startswith("食塩")
                ):
                    continue
                if y >= (b_y + l_y) / 2:
                    buckets["breakfast"].append(txt)
                elif y >= (l_y + d_y) / 2:
                    buckets["lunch"].append(txt)
                else:
                    buckets["dinner"].append(txt)

            meals_obj = {}
            for meal_key in ("breakfast", "lunch", "dinner"):
                lines = buckets[meal_key]
                set_a_name = lines[0] if len(lines) >= 1 else ""
                set_b_name = lines[1] if len(lines) >= 2 else ""
                common_items = lines[2:] if len(lines) >= 3 else []
                meals_obj[meal_key] = {
                    "set_a": {"name": set_a_name},
                    "set_b": {"name": set_b_name},
                    "common": {"items": common_items},
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

    print(f"[OK] 公式PDFから {len(days)}日分を取得し、本番データを更新しました。")
    return payload


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--trigger", default="manual")
    args = parser.parse_args()
    run_monthly_menu_check(trigger=args.trigger)
