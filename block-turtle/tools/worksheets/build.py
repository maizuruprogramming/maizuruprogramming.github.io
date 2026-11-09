"""ワークシート（Claude Docs の XML）→ シートごとの PDF を つくる。

つかいかた: python3 tools/worksheets/build.py tools/worksheets/worksheet-ja.xml [en]
  出力: worksheets/ws0-teacher.pdf … ws8-check.pdf と worksheets/worksheets-all.pdf
  en を つけると tools/worksheets/en.json で ほんやくして worksheets/en/ に つくる
"""
import html
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'worksheets'

# 見出し（じゅんばん）→ ファイル名：先生へ、①〜⑧
FILES = ['ws0-teacher', 'ws1-goal', 'ws2-draw', 'ws3-maze', 'ws4-arrow',
         'ws5-space-craft', 'ws6-key-enemy', 'ws7-python', 'ws8-check']
BRAND = {'ja': ('ブロックで プログラミング　ワークシート', '舞鶴工業高等専門学校　井上泰仁'),
         'en': ('Block Programming — Worksheet', 'National Institute of Technology, Maizuru College — Yasuhito Inoue')}

CSS = """
@page { size: A4; margin: 12mm 13mm 14mm; }
* { box-sizing: border-box; }
body { font-family: 'DejaVu Sans', 'Noto Sans CJK JP', 'Noto Sans CJK TC', 'Noto Color Emoji', sans-serif; font-size: 11pt;
       line-height: 1.45; color: #222; margin: 0; }
.sheet { break-after: page; }
.sheet:last-child { break-after: auto; }
.brand { font-size: 8.5pt; color: #777; border-bottom: 1px solid #bbb; padding-bottom: 2mm; margin-bottom: 3mm;
         display: flex; justify-content: space-between; }
h2 { font-size: 16pt; margin: 0 0 3mm; padding: 2mm 3mm; background: #fff4d6; border-left: 6px solid #f2a33a;
     border-radius: 2mm; }
p { margin: 2mm 0; }
ul { margin: 1mm 0 2mm; padding-left: 6mm; }
table { border-collapse: collapse; width: 100%; margin: 2mm 0 3.5mm; break-inside: avoid; }
th, td { border: 1px solid #555; padding: 1.2mm 2mm; vertical-align: middle; }
th { background: #eef3fb; font-weight: bold; text-align: left; }
td.blank { height: 8mm; }
table.wide td.blank { height: 12mm; }          /* 1れつの かきこみ らん */
table.grid { width: auto; }
table.grid th, table.grid td { width: 11.5mm; height: 11.5mm; text-align: center; padding: 0; }
table.grid th:first-child, table.grid td:first-child { width: 8mm; background: #eef3fb; }
table.check td, table.check th { text-align: center; padding: 1mm; }
table.check td:first-child, table.check th:first-child { text-align: left; white-space: nowrap; }
table.check td.blank { height: 8.5mm; width: 9mm; }
td.dash { color: #bbb; background: #f2f2f2; }
"""


def inline(el):
    """paragraph の なかみ → HTML"""
    out = []
    for c in el:
        tag = c.tag
        if tag == 'text':
            out.append(html.escape(c.text or '') + inline(c) if len(c) else html.escape(c.text or ''))
        elif tag == 'bold':
            out.append('<b>' + (inline(c) if len(c) else html.escape(c.text or '')) + '</b>')
        elif tag == 'date':
            out.append('')
        elif tag == 'mention':
            out.append('')
        else:
            out.append(html.escape(''.join(c.itertext())))
    return ''.join(out)


def blank(s):
    return s.strip(' 　') == ''


def table(el):
    rows = el.findall('row')
    cells = [[(c.get('header') == 'true', inline(c.find('paragraph')) if c.find('paragraph') is not None else '')
              for c in r.findall('cell')] for r in rows]
    ncol = max(len(r) for r in cells)
    body = [r for r in cells if not r[0][0]]
    texts = [t for r in body for _, t in r]
    cls = []
    if ncol == 1:
        cls.append('wide')
    # 5×5・4×4 の めいろ（みだしが すうじ or から、なかみが ほぼ から）
    heads = [t for h, t in cells[0]] if cells and cells[0][0][0] else []
    if heads and all(re.fullmatch(r'\d*', h.strip()) for h in heads) and ncol >= 4 and \
            sum(blank(t) for t in texts) >= len(texts) * 0.6 and len(body) >= 4:
        cls.append('grid')
    if ncol >= 9 and any(t == '―' for t in texts):
        cls.append('check')
    h = [f'<table class="{" ".join(cls)}">']
    for r in cells:
        h.append('<tr>')
        for is_h, t in r:
            if is_h:
                h.append(f'<th>{t}</th>')
            else:
                c = 'blank' if blank(t) else ('dash' if t == '―' else '')
                h.append(f'<td class="{c}">{t}</td>')
        h.append('</tr>')
    h.append('</table>')
    return ''.join(h)


def block(el):
    tag = el.tag
    if tag == 'paragraph':
        lv = el.get('heading')
        body = inline(el)
        if lv == '1':
            return ''
        if lv:
            return f'<h{int(lv) + 1}>{body}</h{int(lv) + 1}>'
        return f'<p>{body}</p>' if body.strip() else ''
    if tag == 'table':
        return table(el)
    if tag == 'list':
        items = []
        for li in el:
            items.append('<li>' + ''.join(block(c) for c in li).replace('<p>', '').replace('</p>', '') + '</li>')
        return '<ul>' + ''.join(items) + '</ul>'
    return ''


def sections(doc):
    secs, cur = [], None
    for el in doc:
        if el.tag == 'paragraph' and el.get('heading') == '2':
            cur = {'title': ''.join(el.itertext()).strip(), 'html': []}
            secs.append(cur)
        if cur is not None:
            cur['html'].append(block(el))
    return secs


def translate(doc, table):
    """text・bold の もじを ほんやく。ないものは ほうこく"""
    missing = set()
    for e in doc.iter():
        if e.tag in ('text', 'bold') and e.text:
            t = e.text
            if t in table:
                e.text = table[t]
            elif re.search(r'[\u3040-\u30ff\u4e00-\u9fff]', t):
                missing.add(t)
    if missing:
        sys.exit('ほんやく が ない: ' + json.dumps(sorted(missing), ensure_ascii=False))


def page(sheets, lang):
    left, right = BRAND[lang]
    body = ''.join(
        f'<section class="sheet"><div class="brand"><span>{left}</span>'
        f'<span>{right}</span></div>{"".join(s["html"])}</section>' for s in sheets)
    return f'<!DOCTYPE html><html lang="{lang}"><head><meta charset="utf-8"><style>{CSS}</style></head><body>{body}</body></html>'


def main(src, lang='ja'):
    doc = ET.fromstring(Path(src).read_text())
    out = OUT
    if lang == 'en':
        translate(doc, json.loads((Path(__file__).parent / 'en.json').read_text()))
        out = OUT / 'en'
    secs = sections(doc)
    assert len(secs) == len(FILES), len(secs)
    out.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        jobs = []
        for name, s in zip(FILES, secs):
            jobs.append((name, [s]))
        jobs.append(('worksheets-all', secs))
        for name, ss in jobs:
            pg.set_content(page(ss, lang), wait_until='load')
            pg.pdf(path=str(out / f'{name}.pdf'), format='A4', prefer_css_page_size=True, print_background=True)
            print(name, ss[0]['title'] if len(ss) == 1 else 'all')
        b.close()


if __name__ == '__main__':
    main(*sys.argv[1:])
