from __future__ import annotations

import re
import threading
import time
from datetime import datetime, timezone
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup
from flask import Flask, jsonify, render_template, request
from werkzeug.middleware.proxy_fix import ProxyFix

app = Flask(__name__)
# Honor X-Forwarded-Prefix when deployed behind Nginx under a subpath.
app.wsgi_app = ProxyFix(app.wsgi_app, x_prefix=1)

CATEGORY_URL = "https://www.maizuru-ct.ac.jp/kakuyu/category/dining/"
SCHOOL_HOST = "www.maizuru-ct.ac.jp"
CACHE_SECONDS = 60 * 30
REQUEST_TIMEOUT = 18
USER_AGENT = (
    "Mozilla/5.0 (compatible; TsuruyuMenuViewer/1.0; "
    "+https://www.maizuru-ct.ac.jp/)"
)

# Verified fallback: the September 2026 menu PDF linked from the school's page.
# The normal operation is to re-discover PDF links from the official category page.
FALLBACK_MENU = {
    "month": "2026-09",
    "month_label": "令和8年9月",
    "title": "学寮食堂献立表（令和8年9月）",
    "published": "2026年9月10日",
    "post_url": "https://www.maizuru-ct.ac.jp/kakuyu/2026/09/10/2191/",
    "pdf_url": "https://www.maizuru-ct.ac.jp/kakuyu/wp-content/uploads/sites/3/2026/09/menu-domitory-2026_9-2.pdf",
}

_cache: dict | None = None
_cache_at = 0.0
_cache_lock = threading.Lock()


def _safe_school_url(url: str) -> bool:
    """Accept only HTTPS links hosted by the official Maizuru KOSEN site."""
    parsed = urlparse(url)
    return parsed.scheme == "https" and parsed.hostname == SCHOOL_HOST


def _get_soup(url: str) -> BeautifulSoup:
    response = requests.get(
        url,
        headers={"User-Agent": USER_AGENT},
        timeout=REQUEST_TIMEOUT,
    )
    response.raise_for_status()
    response.encoding = response.apparent_encoding or response.encoding
    return BeautifulSoup(response.text, "html.parser")


def _extract_month(title: str, post_url: str) -> tuple[str, str]:
    text = title.replace("　", " ")
    # Japanese era notation, e.g. 令和8年9月.
    match = re.search(r"令和\s*(\d+)\s*年\s*(\d+)\s*月", text)
    if match:
        era_year, month = int(match.group(1)), int(match.group(2))
        western_year = 2018 + era_year
        return f"{western_year:04d}-{month:02d}", f"令和{era_year}年{month}月"

    # Western notation, e.g. 2026年9月.
    match = re.search(r"(20\d{2})\s*年\s*(\d{1,2})\s*月", text)
    if match:
        year, month = int(match.group(1)), int(match.group(2))
        return f"{year:04d}-{month:02d}", f"{year}年{month}月"

    # Last resort: infer year/month from the WordPress post URL.
    match = re.search(r"/(20\d{2})/(\d{1,2})/", urlparse(post_url).path)
    if match:
        year, month = int(match.group(1)), int(match.group(2))
        return f"{year:04d}-{month:02d}", f"{year}年{month}月"

    return "", "掲載月不明"


def _get_post_title(soup: BeautifulSoup) -> str:
    heading = soup.select_one("main h1, article h1, h1")
    if heading:
        return heading.get_text(" ", strip=True)
    if soup.title:
        return soup.title.get_text(" ", strip=True).split(" - ")[0]
    return "学寮食堂献立表"


def _get_published_date(soup: BeautifulSoup) -> str:
    time_tag = soup.select_one("time[datetime]")
    if time_tag:
        raw = time_tag.get("datetime", "")
        try:
            return datetime.fromisoformat(raw.replace("Z", "+00:00")).strftime("%Y年%-m月%-d日")
        except (ValueError, TypeError):
            pass

    # The school page also displays dates as e.g. 9月10日 2026.
    text = soup.get_text(" ", strip=True)
    match = re.search(r"(\d{1,2})月(\d{1,2})日\s*(20\d{2})", text)
    if match:
        month, day, year = map(int, match.groups())
        return f"{year}年{month}月{day}日"
    return ""


def _collect_post_links() -> list[str]:
    """Read the recent WordPress category pages and collect menu article URLs."""
    article_urls: list[str] = []
    # Three archive pages are enough for a useful recent-month list while keeping
    # requests to the school's site modest. Pagination can be extended if needed.
    for page_number in range(1, 4):
        page_url = CATEGORY_URL if page_number == 1 else urljoin(CATEGORY_URL, f"page/{page_number}/")
        try:
            soup = _get_soup(page_url)
        except requests.RequestException:
            if page_number == 1:
                raise
            continue
        for anchor in soup.select("a[href]"):
            label = anchor.get_text(" ", strip=True)
            href = urljoin(page_url, anchor.get("href", "").strip())
            path = urlparse(href).path
            if "献立表" not in label:
                continue
            if not _safe_school_url(href):
                continue
            if not re.search(r"/kakuyu/20\d{2}/\d{1,2}/\d{1,2}/", path):
                continue
            if href not in article_urls:
                article_urls.append(href)
    return article_urls[:24]


def fetch_school_menus() -> dict:
    """Scrape official monthly posts and their menu PDFs."""
    records: list[dict] = []
    errors: list[str] = []

    try:
        post_urls = _collect_post_links()
    except requests.RequestException as exc:
        post_urls = []
        errors.append(f"献立一覧ページを取得できませんでした: {exc.__class__.__name__}")

    for post_url in post_urls:
        try:
            soup = _get_soup(post_url)
            title = _get_post_title(soup)
            pdf_url = None
            candidates: list[tuple[int, str]] = []
            for anchor in soup.select("a[href]"):
                href = urljoin(post_url, anchor.get("href", "").strip())
                label = anchor.get_text(" ", strip=True)
                path = urlparse(href).path.lower()
                if not path.endswith(".pdf") or not _safe_school_url(href):
                    continue
                score = (10 if "献立" in label else 0)
                if any(term in path for term in ("menu", "domitory", "dormitory")):
                    score += 4
                if "栄養" in label or "nutrition" in path:
                    score -= 20
                candidates.append((score, href))
            if candidates:
                candidates.sort(key=lambda item: item[0], reverse=True)
                pdf_url = candidates[0][1]

            if not pdf_url:
                continue

            month_key, month_label = _extract_month(title, post_url)
            records.append({
                "month": month_key,
                "month_label": month_label,
                "title": title,
                "published": _get_published_date(soup),
                "post_url": post_url,
                "pdf_url": pdf_url,
            })
        except requests.RequestException:
            # One unavailable article should not prevent the other months loading.
            continue

    # Avoid showing duplicate PDFs/posts and sort newest month first.
    unique: dict[str, dict] = {}
    for item in records:
        key = item["month"] or item["pdf_url"]
        if key not in unique:
            unique[key] = item

    result = list(unique.values())
    result.sort(key=lambda item: item.get("month", ""), reverse=True)

    if not result:
        result = [FALLBACK_MENU.copy()]
        status = "fallback"
        message = (
            "学校サイトから最新情報を取得できなかったため、確認済みの掲載例を表示しています。"
            "学校サイトで最新の献立表も確認してください。"
        )
    else:
        status = "ok"
        message = "舞鶴高専の鶴友寮公式ページから献立表を取得しました。"

    return {
        "menus": result,
        "status": status,
        "message": message,
        "source_url": CATEGORY_URL,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }


def get_menus(force_refresh: bool = False) -> dict:
    global _cache, _cache_at
    with _cache_lock:
        if not force_refresh and _cache and (time.time() - _cache_at) < CACHE_SECONDS:
            return _cache
        try:
            _cache = fetch_school_menus()
        except Exception as exc:  # Keep the viewer usable even if the source changes.
            app.logger.exception("Could not update menu list")
            _cache = {
                "menus": [FALLBACK_MENU.copy()],
                "status": "fallback",
                "message": "献立一覧を更新できませんでした。学校の公式ページで最新情報をご確認ください。",
                "source_url": CATEGORY_URL,
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "error_type": exc.__class__.__name__,
            }
        _cache_at = time.time()
        return _cache


@app.get("/")
def index():
    return render_template("index.html")


@app.get("/api/menus")
def api_menus():
    force_refresh = request.args.get("refresh") == "1"
    return jsonify(get_menus(force_refresh=force_refresh))


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
