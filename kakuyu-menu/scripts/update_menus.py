#!/usr/bin/env python3
"""Fetch monthly dormitory menu PDF links and write a static JSON file for Pages."""
from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

CATEGORY_URL = "https://www.maizuru-ct.ac.jp/kakuyu/category/dining/"
SCHOOL_HOST = "www.maizuru-ct.ac.jp"
USER_AGENT = "Mozilla/5.0 (compatible; TsuruyuMenuViewer/1.0)"
TIMEOUT = 20


def safe_school_url(url: str) -> bool:
    parsed = urlparse(url)
    return parsed.scheme == "https" and parsed.hostname == SCHOOL_HOST


def get_soup(session: requests.Session, url: str) -> BeautifulSoup:
    response = session.get(url, timeout=TIMEOUT)
    response.raise_for_status()
    response.encoding = response.apparent_encoding or response.encoding
    return BeautifulSoup(response.text, "html.parser")


def extract_month(title: str, post_url: str) -> tuple[str, str]:
    text = title.replace("　", " ")
    match = re.search(r"令和\s*(\d+)\s*年\s*(\d+)\s*月", text)
    if match:
        era_year, month = map(int, match.groups())
        return f"{2018 + era_year:04d}-{month:02d}", f"令和{era_year}年{month}月"

    match = re.search(r"(20\d{2})\s*年\s*(\d{1,2})\s*月", text)
    if match:
        year, month = map(int, match.groups())
        return f"{year:04d}-{month:02d}", f"{year}年{month}月"

    match = re.search(r"/(20\d{2})/(\d{1,2})/", urlparse(post_url).path)
    if match:
        year, month = map(int, match.groups())
        return f"{year:04d}-{month:02d}", f"{year}年{month}月"
    return "", "掲載月不明"


def extract_published(soup: BeautifulSoup) -> str:
    time_tag = soup.select_one("time[datetime]")
    if time_tag:
        raw = time_tag.get("datetime", "")
        try:
            parsed = datetime.fromisoformat(raw.replace("Z", "+00:00"))
            return f"{parsed.year}年{parsed.month}月{parsed.day}日"
        except (TypeError, ValueError):
            pass
    text = soup.get_text(" ", strip=True)
    match = re.search(r"(\d{1,2})月(\d{1,2})日\s*(20\d{2})", text)
    if match:
        month, day, year = map(int, match.groups())
        return f"{year}年{month}月{day}日"
    return ""


def collect_post_urls(session: requests.Session) -> list[str]:
    urls: list[str] = []
    # Walk several archive pages so a missed or recently added post is less likely.
    for page_no in range(1, 6):
        page_url = CATEGORY_URL if page_no == 1 else urljoin(CATEGORY_URL, f"page/{page_no}/")
        try:
            soup = get_soup(session, page_url)
        except requests.RequestException:
            if page_no == 1:
                raise
            break

        for anchor in soup.select("a[href]"):
            label = anchor.get_text(" ", strip=True)
            href = urljoin(page_url, anchor.get("href", "").strip())
            path = urlparse(href).path
            if "献立表" not in label or not safe_school_url(href):
                continue
            if not re.search(r"/kakuyu/20\d{2}/\d{1,2}/\d{1,2}/", path):
                continue
            if href not in urls:
                urls.append(href)
    return urls[:36]


def menu_from_post(session: requests.Session, post_url: str) -> dict | None:
    soup = get_soup(session, post_url)
    heading = soup.select_one("main h1, article h1, h1")
    title = heading.get_text(" ", strip=True) if heading else "学寮食堂献立表"

    pdf_candidates: list[tuple[int, str]] = []
    for anchor in soup.select("a[href]"):
        href = urljoin(post_url, anchor.get("href", "").strip())
        label = anchor.get_text(" ", strip=True)
        path = urlparse(href).path.lower()
        if not path.endswith(".pdf") or not safe_school_url(href):
            continue
        score = 10 if "献立" in label else 0
        if any(word in path for word in ("menu", "domitory", "dormitory")):
            score += 4
        if "栄養" in label or "nutrition" in path:
            score -= 20
        pdf_candidates.append((score, href))

    if not pdf_candidates:
        return None
    pdf_candidates.sort(key=lambda item: item[0], reverse=True)
    month, month_label = extract_month(title, post_url)
    if not month:
        return None
    return {
        "month": month,
        "month_label": month_label,
        "title": title,
        "published": extract_published(soup),
        "post_url": post_url,
        "pdf_url": pdf_candidates[0][1],
    }


def build_payload() -> dict:
    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT})

    post_urls = collect_post_urls(session)
    records: dict[str, dict] = {}
    for post_url in post_urls:
        try:
            item = menu_from_post(session, post_url)
        except requests.RequestException as exc:
            print(f"WARN: could not read {post_url}: {exc}", file=sys.stderr)
            continue
        if item:
            # Later entries for a month may be updated posts; preserve first by archive order.
            records.setdefault(item["month"], item)

    menus = sorted(records.values(), key=lambda item: item["month"], reverse=True)
    if not menus:
        raise RuntimeError("公式ページから献立表PDFを1件も取得できませんでした")

    return {
        "menus": menus,
        "status": "ok",
        "message": "舞鶴高専の鶴友寮公式ページから献立表を取得しました。",
        "source_url": CATEGORY_URL,
        "updated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="site/data/menus.json", help="output JSON path")
    args = parser.parse_args()
    output_path = Path(args.output)

    try:
        payload = build_payload()
    except Exception as exc:  # Keep an already committed JSON if the source is temporarily down.
        print(f"WARN: menu refresh failed; keeping the existing JSON: {exc}", file=sys.stderr)
        if output_path.is_file():
            return 0
        return 1

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Updated {output_path} with {len(payload['menus'])} monthly menu(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
