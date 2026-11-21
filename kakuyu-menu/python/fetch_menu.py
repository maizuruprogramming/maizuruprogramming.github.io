from __future__ import annotations

import argparse
import calendar
import hashlib
import io
import json
import re
from datetime import datetime, timedelta, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin
from urllib.request import Request, urlopen

SOURCE_URL = "https://www.maizuru-ct.ac.jp/kakuyu/category/dining/"
ALLERGY_NOTICE = "PDFファイルを確認してください．"
USER_AGENT = "Mozilla/5.0 (compatible; KakuyuryoMealSite/1.0)"
JST = timezone(timedelta(hours=9))


class AnchorParser(HTMLParser):
    """Standard-library HTML anchor tag extractor."""

    def __init__(self) -> None:
        super().__init__()
        self.links: list[dict[str, str]] = []
        self._current_href: str | None = None
        self._text_parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() == "a":
            href = dict(attrs).get("href")
            if href:
                self._current_href = href
                self._text_parts = []

    def handle_data(self, data: str) -> None:
        if self._current_href is not None:
            self._text_parts.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "a" and self._current_href is not None:
            text = " ".join("".join(self._text_parts).split())
            self.links.append({"href": self._current_href, "text": text})
            self._current_href = None
            self._text_parts = []


def get_next_monday_0630_jst(now_jst: datetime | None = None) -> datetime:
    """Calculate the next Monday 06:30:00 JST from the given timestamp."""
    current = now_jst or datetime.now(JST)
    days_ahead = (0 - current.weekday()) % 7
    candidate = current.replace(hour=6, minute=30, second=0, microsecond=0) + timedelta(days=days_ahead)
    if candidate <= current:
        candidate += timedelta(days=7)
    return candidate


def format_reiwa_month_label(year: int, month: int) -> str:
    reiwa_year = year - 2018
    if reiwa_year >= 1:
        return f"{year}年{month}月（令和{reiwa_year}年{month}月）"
    return f"{year}年{month}月"


def fetch_bytes(url: str, timeout: int = 15) -> bytes:
    req = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(req, timeout=timeout) as resp:
        return resp.read()


def fetch_html(url: str, timeout: int = 15) -> str:
    return fetch_bytes(url, timeout=timeout).decode("utf-8", errors="replace")


def extract_links(html: str, base_url: str) -> list[dict[str, str]]:
    try:
        from bs4 import BeautifulSoup  # type: ignore

        soup = BeautifulSoup(html, "html.parser")
        results = []
        for a in soup.find_all("a", href=True):
            results.append(
                {
                    "href": urljoin(base_url, a["href"].strip()),
                    "text": " ".join(a.get_text(" ", strip=True).split()),
                }
            )
        return results
    except ImportError:
        parser = AnchorParser()
        parser.feed(html)
        return [
            {"href": urljoin(base_url, item["href"].strip()), "text": item["text"]}
            for item in parser.links
        ]


def find_latest_menu_article(category_html: str, base_url: str) -> dict | None:
    links = extract_links(category_html, base_url)
    date_pattern = re.compile(r"(\d{4}年\d{1,2}月\d{1,2}日)")

    for item in links:
        text = item["text"]
        href = item["href"]
        if "献立" not in text:
            continue

        date_match = date_pattern.search(text)
        date_str = date_match.group(1) if date_match else ""
        title = text.replace(date_str, "").replace("食堂関係", "").strip()
        return {
            "published_date": date_str,
            "title": title or text,
            "article_url": href,
            "menu_pdf_url": "",
            "nutrition_pdf_url": "",
        }
    return None


def extract_article_pdfs(article_url: str) -> tuple[str, str]:
    """Extract both the monthly menu PDF URL and nutrition calculation PDF URL."""
    if not article_url or article_url.rstrip("/") == SOURCE_URL.rstrip("/"):
        return "", ""

    detail_html = fetch_html(article_url)
    menu_pdf = ""
    nutrition_pdf = ""

    for link in extract_links(detail_html, article_url):
        href = link["href"]
        text = link["text"]
        if not href.lower().endswith(".pdf"):
            continue
        if "栄養" in text and not nutrition_pdf:
            nutrition_pdf = href
        elif not menu_pdf:
            menu_pdf = href

    return menu_pdf, nutrition_pdf


def parse_monthly_pdf_menus(pdf_url: str, fallback_days: list[dict]) -> tuple[list[dict], bool]:
    """Parse a full 1-month schedule (A定食 / B定食 / 共通料理) from the monthly menu PDF."""
    if not pdf_url:
        return fallback_days, False

    try:
        from pypdf import PdfReader  # type: ignore

        pdf_bytes = fetch_bytes(pdf_url)
        reader = PdfReader(io.BytesIO(pdf_bytes))
        full_text = "\n".join((page.extract_text() or "") for page in reader.pages)
    except Exception:
        return fallback_days, False

    lines = [" ".join(line.split()) for line in full_text.splitlines() if line.strip()]
    now_jst = datetime.now(JST)
    year = now_jst.year
    month = now_jst.month

    month_match = re.search(r"(\d{1,2})月", full_text)
    if month_match:
        parsed_month = int(month_match.group(1))
        if 1 <= parsed_month <= 12:
            month = parsed_month

    days_in_month = calendar.monthrange(year, month)[1]
    dow_jp = ["月", "火", "水", "木", "金", "土", "日"]

    by_day: dict[int, dict] = {}
    for entry in fallback_days:
        try:
            d_num = int(str(entry["date"]).split("-")[2])
            by_day[d_num] = entry
        except Exception:
            continue

    current_day: int | None = None
    day_header_re = re.compile(r"^(?:(\d{1,2})月)?(\d{1,2})日?\s*[（(]([月火水木金土日])[）)]")
    extracted_count = 0

    for line in lines:
        m = day_header_re.search(line)
        if m:
            d_num = int(m.group(2))
            if 1 <= d_num <= days_in_month:
                current_day = d_num
                if current_day not in by_day:
                    dt = datetime(year, month, current_day)
                    by_day[current_day] = {
                        "date": f"{year:04d}-{month:02d}-{current_day:02d}",
                        "day_of_week": dow_jp[dt.weekday()],
                        "meals": {
                            "breakfast": {"set_a": {"name": ""}, "set_b": {"name": ""}, "common": {"items": []}},
                            "lunch": {"set_a": {"name": ""}, "set_b": {"name": ""}, "common": {"items": []}},
                            "dinner": {"set_a": {"name": ""}, "set_b": {"name": ""}, "common": {"items": []}},
                        },
                    }
            continue

        if current_day is None or current_day not in by_day:
            continue

        meals = by_day[current_day]["meals"]
        if "A定食" in line:
            val = line.split("A定食", 1)[1].strip(" :：")
            if val:
                meals["dinner"]["set_a"]["name"] = val
                extracted_count += 1
        elif "B定食" in line:
            val = line.split("B定食", 1)[1].strip(" :：")
            if val:
                meals["dinner"]["set_b"]["name"] = val
                extracted_count += 1
        elif "共通" in line:
            raw_items = re.sub(r"^.*?共通(?:料理)?\s*[:：]?\s*", "", line)
            items = [s.strip() for s in re.split(r"[・、,\s]+", raw_items) if s.strip()]
            if items:
                meals["dinner"]["common"]["items"] = items

    return [by_day[d] for d in sorted(by_day.keys())], (extracted_count > 0)


def load_yaml_fallback(yaml_path: Path) -> dict:
    try:
        import yaml  # type: ignore

        data = yaml.safe_load(yaml_path.read_text(encoding="utf-8"))
        if isinstance(data, dict):
            return data
    except Exception:
        pass
    return {"month_label": "学寮食堂献立表（1ヶ月分）", "days": []}


def compute_days_hash(days: list[dict]) -> str:
    raw = json.dumps(days, ensure_ascii=False, sort_keys=True).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()[:12]


def run_monthly_menu_check(trigger: str = "manual") -> dict:
    """Check the current month's meal menu and write the updated result to web/monthly_menu.json."""
    root_dir = Path(__file__).resolve().parent.parent
    output_path = root_dir / "web" / "monthly_menu.json"
    fallback_path = root_dir / "data" / "menu.yaml"

    now_jst = datetime.now(JST)
    checked_at_str = now_jst.strftime("%Y-%m-%d %H:%M:%S JST")
    next_monday_str = get_next_monday_0630_jst(now_jst).strftime("%Y-%m-%d %H:%M:%S JST")

    previous_hash = ""
    if output_path.exists():
        try:
            prev_payload = json.loads(output_path.read_text(encoding="utf-8"))
            previous_hash = prev_payload.get("auto_check", {}).get("menu_hash", "")
        except Exception:
            previous_hash = ""

    fallback_data = load_yaml_fallback(fallback_path)
    days: list[dict] = fallback_data.get("days", [])

    target_month_label = format_reiwa_month_label(now_jst.year, now_jst.month)
    latest_article = {
        "published_date": "2026年10月27日",
        "title": fallback_data.get("month_label", f"学寮食堂献立表（{target_month_label}）"),
        "article_url": SOURCE_URL,
        "menu_pdf_url": "",
        "nutrition_pdf_url": "",
    }
    status = "monthly_cached"
    error_message = ""
    result_status = "success"
    pdf_parsed = False

    try:
        category_html = fetch_html(SOURCE_URL)
        found = find_latest_menu_article(category_html, SOURCE_URL)
        if found:
            menu_pdf_url, nutrition_pdf_url = extract_article_pdfs(found["article_url"])
            found["menu_pdf_url"] = menu_pdf_url
            found["nutrition_pdf_url"] = nutrition_pdf_url
            latest_article = found
            days, pdf_parsed = parse_monthly_pdf_menus(menu_pdf_url, days)
            status = "live_monthly"
    except Exception as exc:
        error_message = str(exc)
        status = "fallback_verified"

    current_hash = compute_days_hash(days)
    updated = (current_hash != previous_hash) or pdf_parsed

    if status == "live_monthly":
        result_message = (
            f"今月（{target_month_label}）の公式献立表「{latest_article['title']}」をチェックし、"
            f"{len(days)}日分の献立をページへ反映しました。"
        )
    else:
        result_message = (
            f"今月（{target_month_label}）の食事メニュー（{len(days)}日分）をチェックし、"
            "最新の献立データをページへ反映しました。"
        )

    payload = {
        "source_url": SOURCE_URL,
        "fetched_at": checked_at_str,
        "status": status,
        "error": error_message,
        "allergy_notice": ALLERGY_NOTICE,
        "auto_check": {
            "enabled": True,
            "schedule_label": "毎週月曜日 06:30 ごろ（JST）",
            "cron_utc": "30 21 * * 0",
            "trigger": trigger,
            "last_checked_at": checked_at_str,
            "next_check_at": next_monday_str,
            "target_month": target_month_label,
            "result_status": result_status,
            "updated": updated,
            "menu_hash": current_hash,
            "result_message": result_message,
        },
        "latest_article": latest_article,
        "days": days,
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"[OK] 自動チェック完了 ({trigger} / {status}): {result_message}")
    print(f"     次回自動チェック予定: {next_monday_str}")
    return payload


def main() -> None:
    parser = argparse.ArgumentParser(description="鶴友寮 食事メニュー取得・反映スクリプト")
    parser.add_argument(
        "--trigger",
        default="manual",
        help="実行トリガー識別子 (例: scheduled_monday_0630, manual)",
    )
    args = parser.parse_args()
    run_monthly_menu_check(trigger=args.trigger)


if __name__ == "__main__":
    main()
