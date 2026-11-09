"""めいろの ほん（PDF）を つくる。

つかいかた: python3 tools/book/build.py [maze,draw,space,craft]
  → book/{maze,draw,space,craft}-book.pdf と book/en/…（にほんご・English）
ステージの もんだい・こたえ は guide-data.js、めいろの かたちは 各アプリの map から よむ。
おえかき・うちゅう・こわす・おく の 盤面の えは tools/book/boards/（capture_boards.py で とる）。
ぶんしょうは tools/book/content*.py。
"""
import html
import io
import json
import re
import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright
from pypdf import PdfReader, PdfWriter

sys.path.insert(0, str(Path(__file__).parent))
import content as C  # noqa: E402
import content as C_MAZE  # noqa: E402
import content_draw, content_space, content_craft  # noqa: E402
BOOKS = {'maze': C_MAZE, 'draw': content_draw, 'space': content_space, 'craft': content_craft}
BOARDS = Path(__file__).parent / 'boards'

ROOT = Path(__file__).resolve().parents[2]
CACHE = Path('/tmp/bookimg')
L = 0  # 0=ja 1=en（main で せってい）


def t(pair):
    return pair[L] if isinstance(pair, (tuple, list)) else pair


def ui(k, **kw):
    return t(C.UI[k]).format(**kw)


# ── データ ────────────────────────────────────────────────
def guide():
    s = (ROOT / 'guide-data.js').read_text()
    return json.loads(s[s.index('{'):s.rindex('}') + 1])


def maps_from(path):
    src = (ROOT / path).read_text()
    out = []
    for m in re.finditer(r"map: \[([^\]]*)\], dir: (\d)", src):
        rows = re.findall(r"'([^']*)'", m.group(1))
        out.append((rows, int(m.group(2))))
    return out


SAMPLE8 = (['S..#...', '##.#.#.', '.....#.', '.#####.', '...#...', '##.#.##', '......G'], 1)


def all_maps():
    m = {
        'maze': maps_from('maze.html'),
        'junior': maps_from('tools/maze-variants/junior.js'),
        'key': maps_from('tools/maze-variants/key.js'),
        'enemy': maps_from('tools/maze-variants/enemy.js'),
        'python': maps_from('python.html'),
    }
    m['maze'] = m['maze'][:7] + [SAMPLE8]
    assert [len(m[k]) for k in ('maze', 'junior', 'key', 'enemy', 'python')] == [8, 6, 4, 4, 5], {k: len(v) for k, v in m.items()}
    return m


# python.html の ステージ → ブロックで めいろ の ステージ
PY_SAME = {1: 1, 2: 2, 3: 4, 4: 6, 5: 7}


# ── めいろの え（SVG）────────────────────────────────────
def board(rows, d, junior=False, size=90):
    n, w = len(rows), max(len(r) for r in rows)
    u = 40
    g = [f'<svg class="board" viewBox="0 0 {w * u} {n * u}" style="width:{size}mm" xmlns="http://www.w3.org/2000/svg">']
    for r, row in enumerate(rows):
        for c, ch in enumerate(row):
            x, y = c * u, r * u
            if ch == '#':
                if junior:
                    g.append(f'<rect x="{x}" y="{y}" width="{u}" height="{u}" fill="#7cc46a"/>'
                             f'<circle cx="{x + 13}" cy="{y + 24}" r="9" fill="#4f9a43"/><circle cx="{x + 26}" cy="{y + 17}" r="10" fill="#4f9a43"/>'
                             f'<circle cx="{x + 28}" cy="{y + 29}" r="7" fill="#3f8636"/>')
                else:
                    g.append(f'<rect x="{x}" y="{y}" width="{u}" height="{u}" fill="#8d939c"/>'
                             f'<path d="M{x} {y + 13}h{u}M{x} {y + 27}h{u}M{x + 20} {y}v13M{x + 8} {y + 13}v14M{x + 30} {y + 13}v14M{x + 20} {y + 27}v13" stroke="#6d727a" stroke-width="2"/>')
            else:
                g.append(f'<rect x="{x}" y="{y}" width="{u}" height="{u}" fill="#efe2c2"/>')
                if ch == 'e':
                    g.append(f'<circle cx="{x + u / 2}" cy="{y + u / 2}" r="5" fill="#9fd39a"/>')
    # マスの せん
    for i in range(w + 1):
        g.append(f'<line x1="{i * u}" y1="0" x2="{i * u}" y2="{n * u}" stroke="#00000022" stroke-width="1"/>')
    for i in range(n + 1):
        g.append(f'<line x1="0" y1="{i * u}" x2="{w * u}" y2="{i * u}" stroke="#00000022" stroke-width="1"/>')
    for r, row in enumerate(rows):
        for c, ch in enumerate(row):
            cx, cy = c * u + u / 2, r * u + u / 2
            if ch == 'G':
                g.append(f'<path d="M{cx} {cy - 15}L{cx + 13} {cy - 3}L{cx} {cy + 15}L{cx - 13} {cy - 3}Z" fill="#5fd6e8" stroke="#1d7f91" stroke-width="2.5"/>'
                         f'<path d="M{cx - 13} {cy - 3}H{cx + 13}" stroke="#1d7f91" stroke-width="1.5"/>')
            elif ch == 'K':
                g.append(f'<text x="{cx}" y="{cy + 9}" font-size="26" text-anchor="middle">🔑</text>')
            elif ch == 'D':
                g.append(f'<rect x="{cx - 12}" y="{cy - 16}" width="24" height="32" rx="3" fill="#a0602c" stroke="#5a3214" stroke-width="2.5"/>'
                         f'<circle cx="{cx + 6}" cy="{cy + 1}" r="2.5" fill="#f2c94c"/>')
            elif ch == 'E':
                g.append(f'<path d="M{cx - 14} {cy + 12}Q{cx - 15} {cy - 14} {cx} {cy - 14}Q{cx + 15} {cy - 14} {cx + 14} {cy + 12}Z" fill="#4cbf4a" stroke="#226b21" stroke-width="2.5"/>'
                         f'<circle cx="{cx - 5}" cy="{cy - 2}" r="3" fill="#123"/><circle cx="{cx + 5}" cy="{cy - 2}" r="3" fill="#123"/>')
            elif ch == 'S':
                g.append(f'<circle cx="{cx}" cy="{cy}" r="14" fill="#3b82d6" stroke="#174a87" stroke-width="2.5"/>')
                if not junior:
                    ang = [-90, 0, 90, 180][d]
                    g.append(f'<path d="M{cx + 7} {cy}L{cx - 5} {cy - 8}L{cx - 5} {cy + 8}Z" fill="#ffd54a" transform="rotate({ang} {cx} {cy})"/>')
                else:
                    g.append(f'<text x="{cx}" y="{cy + 6}" font-size="16" font-weight="bold" fill="#fff" text-anchor="middle" font-family="DejaVu Sans">S</text>')
    g.append('</svg>')
    return ''.join(g)


def legend_html():
    cells = []
    for ch, label in C.LEGEND:
        rows = [ch if ch != 'e' else 'e']
        cells.append(f'<div class="lg">{board(rows, 1, size=11)}<span>{t(label)}</span></div>')
    cells.append(f'<div class="lg">{board(["#"], 1, junior=True, size=11)}<span>{"くさむら（やじるしの めいろ）" if L == 0 else "Bushes (Arrow Maze)"}</span></div>')
    head = 'めいろの きごう' if L == 0 else 'Maze symbols'
    return f'<h3>{head}</h3><div class="legend">' + ''.join(cells) + '</div>'


# ── え（こたえ）────────────────────────────────────────────
def answer_img(rel):
    src = ROOT / rel
    CACHE.mkdir(exist_ok=True)
    out = CACHE / (rel.replace('/', '_').replace('.png', '.jpg'))
    if not out.exists():
        im = Image.open(src).convert('RGB')
        if im.width > 900:
            im = im.resize((900, round(im.height * 900 / im.width)), Image.LANCZOS)
        im.save(out, 'JPEG', quality=86)
    import base64
    return 'data:image/jpeg;base64,' + base64.b64encode(out.read_bytes()).decode()


def code_html(code):
    lines = code.split('\n')
    return '<pre class="code">' + ''.join(
        f'<span class="ln">{i + 1}</span>{html.escape(l)}\n' for i, l in enumerate(lines)) + '</pre>'


# ── ページ ────────────────────────────────────────────────
def mark(k):
    return f'<span class="mk">@@{k}@@</span>'


def chips(G, it):
    return ''.join(f'<span class="chip">{html.escape(G["concepts"][c][["ja", "en"][L]])}</span>' for c in it['tags'])


def stage_pages(G, app, it, rows, d, label, junior=False, same=None, board_html=None, board_cap=''):
    lang = ['ja', 'en'][L]
    lim = f'<div class="lim">{ui("limit", n=it["limit"])}</div>' if it.get('limit') else ''
    note8 = f'<p class="cap">{ui("sample")}</p>' if app['key'] == 'maze' and it['n'] == 8 else ''
    same_txt = f'<p class="cap">{same}</p>' if same else ''
    q = f'''<section class="pg stage">
<div class="crumb">{app["icon"]} {html.escape(label)}</div>
<h3 class="st">{html.escape(it["title"][lang])}</h3>
<div class="chips">{chips(G, it)}</div>
<div class="bd">{board_html or board(rows, d, junior=junior, size=86 if len(rows) <= 5 else 100)}{board_cap}{note8}{same_txt}</div>
<div class="box q"><b>{ui("q")}</b><p>{html.escape(it["text"][lang])}</p>{lim}</div>
<div class="box g"><b>🎯 {ui("goal")}</b>：{html.escape(it["goal"][lang])}</div>
<div class="box h"><b>{ui("hint")}</b><p class="hinttxt">{html.escape(it["hint"][lang])}</p></div>
<div class="box memo"><b>{ui("memo")}</b></div>
<div class="nextp">{ui("next")}</div>
</section>'''
    if it.get('code'):
        ans = code_html(it['code'])
    else:
        ans = f'<img class="ans" src="{answer_img(it["img"][lang])}">'
    vid = f'<p class="vid">{ui("video")}<code>{it["video"][lang]}</code></p>' if it.get('video') else ''
    a = f'''<section class="pg stage">
<div class="crumb">{app["icon"]} {html.escape(label)}</div>
<h3 class="st">{ui("answer")}　{html.escape(it["title"][lang])}</h3>
<div class="ansbox">{ans}</div>
<div class="box p"><b>{ui("point")}</b><p>{html.escape(it["point"][lang])}</p></div>
<div class="box m"><b>{ui("mistake")}</b><p>{html.escape(it["mistake"][lang])}</p></div>
{vid}
</section>'''
    return q + a


def chapter_open(n, ch, k, legend=False, extra=''):
    return f'''<section class="pg chap">{mark(k)}
<div class="chno">{ui("chapter", n=n)}</div>
<h2 class="cht">{ch["icon"]} {t(ch["title"])}</h2>
<p class="lead">{t(ch["lead"])}</p>
<div class="box blocks"><b>{"この しょうで つかう めいれい" if L == 0 else "Commands in this chapter"}</b><p>{t(ch["blocks"])}</p></div>
{extra}
{legend_html() if legend else ''}
</section>'''


def column(ch):
    c = ch['column']
    title, body = (c[0], c[1]) if L == 0 else (c[2], c[3])
    return f'<section class="pg col"><div class="colbox"><div class="coltag">{ui("column")}</div><h3>{title}</h3>{body}</div></section>'


def overview_table(G, order=None):
    lang = ['ja', 'en'][L]
    order = order or ['mazejr', 'maze', 'mazekey', 'mazeenemy', 'python', 'pymazejr', 'pymazekey', 'pymazeenemy']
    apps = {a['key']: a for a in G['apps']}
    h = ['<table class="t map"><tr><th>' + ('アプリ' if L == 0 else 'App') + '</th><th>#</th><th>' +
         ('ステージ' if L == 0 else 'Stage') + '</th><th>' + ('考え方' if L == 0 else 'Ideas') + '</th></tr>']
    for k in order:
        a = apps[k]
        for i, it in enumerate(a['items']):
            name = f'{a["icon"]} {a["name"][lang]}' if i == 0 else ''
            title = re.sub(r'^(ステージ\d+\s*|Stage \d+:\s*)', '', it['title'][lang])
            h.append(f'<tr class="{"first" if i == 0 else ""}"><td>{html.escape(name)}</td><td>{it["n"]}</td><td>{html.escape(title)}</td>'
                     f'<td>{"、".join(G["concepts"][c][lang] for c in it["tags"]) if L == 0 else ", ".join(G["concepts"][c][lang] for c in it["tags"])}</td></tr>')
    h.append('</table>')
    return ''.join(h)


def toc(entries, pages):
    rows = ''.join(f'<div class="tr {cls}"><span>{html.escape(title)}</span><i></i><b>{pages.get(k, "")}</b></div>'
                   for k, title, cls in entries)
    return f'<section class="pg tocp"><h2>{ui("toc")}</h2>{rows}</section>'


def build_body(G, pages):
    lang = ['ja', 'en'][L]
    M = all_maps()
    apps = {a['key']: a for a in G['apps']}
    entries, parts = [], []

    entries.append(('howto', 'この ほんの つかいかた' if L == 0 else 'How to use this book', ''))
    entries.append(('p1', t(C.PART1), 'tp'))
    entries.append(('ch1', ('だい1しょう　プログラムって なに？' if L == 0 else 'Chapter 1　What is a program?'), 'ch'))

    rows_tbl = ''.join(f'<tr><td>{t(n)}</td><td>{s}</td><td>{t(g)}</td></tr>' for n, f, s, g in C.APPS_TABLE)
    howto = t(C.HOWTO) + (f'<table class="t"><tr><th>{"めいろ" if L == 0 else "Maze"}</th><th>{"ステージ" if L == 0 else "Stages"}</th>'
                          f'<th>{"めやすの がくねん" if L == 0 else "Grade"}</th></tr>{rows_tbl}</table>')
    parts.append(f'<section class="pg">{mark("howto")}{howto}</section>')
    parts.append(f'<section class="pg part">{mark("p1")}<div class="ptag">PART 1</div><h1>{t(C.PART1)}</h1></section>')
    ch1 = t(C.CH1).replace('{BOARD}', board(['S..#', '#.##', '#..G'], 1, size=40))
    parts.append(f'<section class="pg">{mark("ch1")}<div class="chno">{ui("chapter", n=1)}</div>{ch1}</section>')

    n = 1
    for ch in C.CHAPTERS:
        n += 1
        k = f'ch{n}'
        entries.append((k, f'{ui("chapter", n=n)}　{t(ch["title"])}', 'ch'))
        parts.append(chapter_open(n, ch, k, legend=(n == 2)))
        a = apps[ch['key']]
        label = a['name'][lang]
        junior = ch['maps'] == 'junior'
        for i, it in enumerate(a['items']):
            rows, d = M[ch['maps']][i]
            same = None
            if ch.get('py'):
                same = ui('same', app=apps['maze']['name'][lang], n=PY_SAME[it['n']])
            parts.append(stage_pages(G, a, it, rows, d, label, junior=junior, same=same))
        for sk, mk in ch.get('sub', []):
            sa = apps[sk]
            sub_k = f'{k}-{sk}'
            entries.append((sub_k, '　　' + t(C.PY_SUB_TITLES[sk]), 'sub'))
            parts.append(f'<section class="pg subopen">{mark(sub_k)}<h2 class="cht">{sa["icon"]} {t(C.PY_SUB_TITLES[sk])}</h2>'
                         f'<p class="lead">{html.escape(sa["intro"][lang])}</p></section>')
            base = {'junior': 'mazejr', 'key': 'mazekey', 'enemy': 'mazeenemy'}[mk]
            for i, it in enumerate(sa['items']):
                rows, d = M[mk][i]
                same = ui('same', app=apps[base]['name'][lang], n=it['n'])
                parts.append(stage_pages(G, sa, it, rows, d, sa['name'][lang], junior=(mk == 'junior'), same=same))
        parts.append(column(ch))

    entries.append(('outro', 'おわりに' if L == 0 else 'Well done!', 'ch'))
    parts.append(f'<section class="pg">{mark("outro")}{t(C.OUTRO)}</section>')

    entries.append(('p2', t(C.PART2), 'tp'))
    parts.append(f'<section class="pg part p2">{mark("p2")}<div class="ptag">PART 2</div><h1>{t(C.PART2)}</h1></section>')
    for i, (title, ja, en) in enumerate(C.TEACHER):
        k = f't{i}'
        entries.append((k, t(title), 'tch'))
        body = (ja if L == 0 else en).replace('{MAP}', overview_table(G))
        parts.append(f'<section class="pg teach">{mark(k)}<h2>{t(title)}</h2>{body}</section>')

    return toc(entries, pages) + ''.join(parts)


def img_uri(path):
    import base64
    return 'data:image/png;base64,' + base64.b64encode(Path(path).read_bytes()).decode()


def build_body_simple(G, pages):
    lang = ['ja', 'en'][L]
    apps = {a['key']: a for a in G['apps']}
    entries, parts = [], []
    entries.append(('howto', 'この ほんの つかいかた' if L == 0 else 'How to use this book', ''))
    entries.append(('p1', t(C.PART1), 'tp'))
    entries.append(('ch1', f'{ui("chapter", n=1)}　{t(C.CH1_TITLE)}', 'ch'))
    rows_tbl = ''.join(f'<tr><td>{t(n)}</td><td>{s}</td><td>{t(g)}</td></tr>' for n, f, s, g in C.APPS_TABLE)
    howto = t(C.HOWTO) + (f'<table class="t"><tr><th>{"アプリ" if L == 0 else "App"}</th><th>{"かず" if L == 0 else "Tasks"}</th>'
                          f'<th>{"めやすの がくねん" if L == 0 else "Grade"}</th></tr>{rows_tbl}</table>')
    parts.append(f'<section class="pg">{mark("howto")}{howto}</section>')
    parts.append(f'<section class="pg part">{mark("p1")}<div class="ptag">PART 1</div><h1>{t(C.PART1)}</h1></section>')
    parts.append(f'<section class="pg">{mark("ch1")}<div class="chno">{ui("chapter", n=1)}</div>{t(C.CH1)}</section>')
    n = 1
    for ch in C.CHAPTERS:
        n += 1
        k = f'ch{n}'
        entries.append((k, f'{ui("chapter", n=n)}　{t(ch["title"])}', 'ch'))
        parts.append(chapter_open(n, ch, k))
        a = apps[ch['key']]
        for it in a['items']:
            img = BOARDS / f'{ch["boards"]}-{it["n"]}.png'
            bh = f'<img class="bimg{" smooth" if ch["boards"] == "draw" else ""}" src="{img_uri(img)}">'
            cap = f'<p class="cap">{ui(C.BOARD_LABEL)}</p>'
            same = None
            if ch.get('py') and C.SAME_NOTE:
                same = t(C.SAME_NOTE).format(n=it['n'])
            if ch['key'] == 'space' and it['n'] == 7:
                cap += f'<p class="cap">{"れい：うちゅうは じっこうする たびに かわるよ" if L == 0 else "Example: the world changes every time you run"}</p>'
            parts.append(stage_pages(G, a, it, None, None, a['name'][lang], same=same, board_html=bh, board_cap=cap))
        parts.append(column(ch))
    entries.append(('outro', 'おわりに' if L == 0 else 'Well done!', 'ch'))
    parts.append(f'<section class="pg">{mark("outro")}{t(C.OUTRO)}</section>')
    entries.append(('p2', t(C.PART2), 'tp'))
    parts.append(f'<section class="pg part p2">{mark("p2")}<div class="ptag">PART 2</div><h1>{t(C.PART2)}</h1></section>')
    order = [ch['key'] for ch in C.CHAPTERS]
    for i, (title, ja, en) in enumerate(C.TEACHER):
        k = f't{i}'
        entries.append((k, t(title), 'tch'))
        body = (ja if L == 0 else en).replace('{MAP}', overview_table(G, order))
        parts.append(f'<section class="pg teach">{mark(k)}<h2>{t(title)}</h2>{body}</section>')
    return toc(entries, pages) + ''.join(parts)


CSS = '''
@page { size: A4; margin: 15mm 16mm 16mm; }
* { box-sizing: border-box; }
body { font-family: 'DejaVu Sans', 'Noto Sans CJK JP', 'Noto Color Emoji', sans-serif; color: #222; margin: 0; font-size: 12.5pt; line-height: 1.75; }
html[lang=ja] body { font-family: 'Noto Sans CJK JP', 'Noto Color Emoji', sans-serif; }
.pg { break-after: page; position: relative; }
.mk { position: absolute; font-size: 1px; color: #fff; }
h1 { font-size: 26pt; } h2 { font-size: 19pt; margin: 0 0 4mm; color: #5a3a1a; } h3 { font-size: 14pt; margin: 5mm 0 2mm; color: #6b4a1f; }
p { margin: 2mm 0; }
code { font-family: 'DejaVu Sans Mono', monospace; background: #f3efe6; padding: 0 1mm; border-radius: 1mm; font-size: .92em; }
.cap { font-size: 10pt; color: #666; text-align: center; margin: 1mm 0; }
.note { background: #fff7dd; border-radius: 3mm; padding: 3mm 4mm; }
.steps div { display: flex; gap: 3mm; align-items: flex-start; margin: 2mm 0; }
.steps > div > b { background: #f2a33a; color: #fff; border-radius: 50%; width: 8mm; height: 8mm; flex: none; display: flex; align-items: center; justify-content: center; }
table.t, table.sum { border-collapse: collapse; width: 100%; margin: 3mm 0; font-size: 10.5pt; line-height: 1.5; }
table.t th, table.t td, table.sum th, table.sum td { border: 1px solid #999; padding: 1.5mm 2.5mm; vertical-align: top; }
table.t th, table.sum th { background: #f4ead6; text-align: left; }
table.map { font-size: 8.6pt; line-height: 1.3; } table.map td, table.map th { padding: .8mm 2mm; } table.map tr.first td { border-top: 2px solid #555; }
.tocp h2 { margin-bottom: 6mm; }
.tr { display: flex; align-items: baseline; gap: 2mm; margin: 1.6mm 0; font-size: 12pt; }
.tr i { flex: 1; border-bottom: 1px dotted #999; } .tr b { font-weight: normal; min-width: 8mm; text-align: right; }
.tr.tp { font-weight: bold; margin-top: 5mm; color: #8a4b12; } .tr.sub { font-size: 10.5pt; color: #555; } .tr.tch { padding-left: 4mm; }
.part { height: 255mm; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;
  background: #fff4d6; border-radius: 6mm; }
.part.p2 { background: #e6eef8; }
.ptag { font-size: 16pt; letter-spacing: 4px; color: #b07020; } .p2 .ptag { color: #3b5f8f; }
.chno { display: inline-block; background: #5a3a1a; color: #fff; padding: 0 4mm; border-radius: 2mm; font-size: 11pt; }
.cht { font-size: 22pt; margin-top: 3mm; }
.lead { font-size: 13pt; }
.box { border-radius: 3mm; padding: 2.5mm 4mm; margin: 3mm 0; break-inside: avoid; }
.box p { margin: 1mm 0; }
.box.blocks { background: #eef6ea; border: 1px solid #a9cf9b; }
.box.q { background: #fff; border: 2px solid #f2a33a; }
.box.g { background: #fff7dd; }
.box.h { background: #eef3fb; border: 1px dashed #7b98c9; }
.box.memo { border: 1px solid #bbb; height: 30mm; }
.box.p { background: #fff7dd; border: 2px solid #f2c14e; }
.box.m { background: #fdeeee; border: 1px solid #e3a1a1; }
.lim { margin-top: 1mm; font-size: 11pt; color: #9a4a00; }
.crumb { font-size: 10pt; color: #8a6a3a; border-bottom: 1px solid #e5d6b8; margin-bottom: 2mm; }
.st { font-size: 17pt; margin: 1mm 0 1mm; color: #333; }
.chips { margin: 0 0 2mm; } .chip { display: inline-block; font-size: 9pt; background: #3f5f9e; color: #fff; border-radius: 1.5mm; padding: 0 2mm; margin-right: 1.5mm; }
.bd { text-align: center; margin: 2mm 0; }
svg.board { border: 3px solid #5a3a1a; border-radius: 2mm; display: block; margin: 0 auto; }
.nextp { text-align: right; color: #999; font-size: 10pt; }
.ansbox { text-align: center; margin: 3mm 0; }
img.ans { max-width: 100%; max-height: 150mm; border-radius: 2mm; }
img.bimg.smooth { image-rendering: auto; }
img.bimg { width: 92mm; border: 3px solid #5a3a1a; border-radius: 2mm; display: block; margin: 0 auto; image-rendering: pixelated; }
pre.code { text-align: left; font-family: 'DejaVu Sans Mono', monospace; font-size: 12pt; line-height: 1.6; background: #1f2430; color: #e8e8e8; padding: 4mm 5mm; border-radius: 3mm; white-space: pre; }
pre.code .ln { display: inline-block; width: 7mm; color: #7c8496; user-select: none; }
.vid { font-size: 9.5pt; color: #666; }
.legend { display: grid; grid-template-columns: 1fr 1fr; gap: 2mm 6mm; margin-top: 4mm; font-size: 10.5pt; }
.lg { display: flex; align-items: center; gap: 3mm; } .lg svg.board { margin: 0; border-width: 1.5px; }
.screen { display: grid; grid-template-columns: 1fr 1fr 1.1fr; gap: 2mm; background: #4a3426; border-radius: 3mm; padding: 3mm; margin: 4mm 0 1mm; }
.screen > div { background: #5e4433; border-radius: 2mm; padding: 2mm; }
.sc-cap { color: #f4e3c4; font-size: 8.5pt; margin-bottom: 1mm; }
.blk { color: #fff; font-size: 9pt; padding: 1mm 2mm; margin: 1mm 0; border-radius: 1mm; }
.blk.g { background: #4e8f32; } .blk.o { background: #c08a19; }
.btns { display: flex; gap: 1mm; margin-top: 2mm; justify-content: center; } .btns span { background: #2f6db0; color: #fff; font-size: 8pt; padding: .5mm 2mm; border-radius: 1mm; }
.sc-right svg.board { border-width: 2px; }
.col .colbox { border: 3px solid #7cb36a; border-radius: 5mm; padding: 6mm 8mm; margin-top: 20mm; background: #f6fbf3; }
.coltag { display: inline-block; background: #7cb36a; color: #fff; padding: 0 4mm; border-radius: 2mm; font-size: 11pt; }
.subopen { padding-top: 40mm; }
.teach { font-size: 11pt; line-height: 1.7; }
.teach h2 { color: #2f4f7f; border-bottom: 3px solid #9db6d8; padding-bottom: 1mm; } .teach h3 { color: #2f4f7f; }
.teach ul { padding-left: 6mm; } .teach li { margin: 1mm 0; }
'''


def cover_html():
    if C is C_MAZE:
        b = board(['S..#....', '##.#.##.', '...#..#.', '.####.#.', '......#G'], 1, size=150)
    else:
        b = f'<img src="{img_uri(BOARDS / (C.COVER_IMG + ".png"))}" style="width:120mm;border:4px solid #5a3a1a;border-radius:3mm;image-rendering:{'auto' if C.COVER_IMG.startswith('draw') else 'pixelated'};background:#fff">'
    return f'''<!DOCTYPE html><html lang="{['ja', 'en'][L]}"><head><meta charset="utf-8"><style>{CSS}
@page {{ margin: 0; }}
.cover {{ height: 297mm; padding: 30mm 20mm; background: linear-gradient(#fff4d6, #f5d79a); text-align: center; }}
.cover h1 {{ font-size: {(32 if len(t(C.TITLE)) <= 15 else 25) if L == 0 else 28}pt; word-break: keep-all; color: #5a3a1a; margin: 0 0 6mm; line-height: 1.3; }}
.cover .sub {{ font-size: 14pt; color: #7a5a2a; }}
.cover .bd {{ margin: 18mm 0; }}
.cover .au {{ position: absolute; bottom: 25mm; left: 0; right: 0; font-size: 12pt; color: #5a3a1a; }}
.cover .tag {{ display: inline-block; background: #5a3a1a; color: #fff; border-radius: 3mm; padding: 1mm 5mm; font-size: 11pt; margin-bottom: 8mm; }}
</style></head><body><div class="cover pg"><div class="tag">{'こども と 先生の ための' if L == 0 else 'For kids and teachers'}</div>
<h1>{t(C.TITLE)}</h1><div class="sub">{t(C.SUBTITLE)}</div><div class="bd">{b}</div><div class="au">{t(C.AUTHOR)}</div></div></body></html>'''


def body_html(G, pages):
    body = build_body(G, pages) if C is C_MAZE else build_body_simple(G, pages)
    return f'<!DOCTYPE html><html lang="{["ja", "en"][L]}"><head><meta charset="utf-8"><style>{CSS}</style></head><body>{body}</body></html>'


FOOT = '<div style="width:100%;text-align:center;font-size:8px;color:#888;font-family:DejaVu Sans"><span class="pageNumber"></span></div>'


def render(pg, html_s, path, footer):
    pg.set_content(html_s, wait_until='load')
    pg.wait_for_timeout(300)
    opts = dict(path=str(path), format='A4', prefer_css_page_size=True, print_background=True)
    if footer:
        opts.update(display_header_footer=True, header_template='<div></div>', footer_template=FOOT)
    pg.pdf(**opts)


def main(which=None):
    global L, C
    G = guide()
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        for key in (which or list(BOOKS)):
          C = BOOKS[key]
          fname = getattr(C, 'FILE', 'maze-book') + '.pdf'
          for L, out in ((0, ROOT / 'book' / fname), (1, ROOT / 'book' / 'en' / fname)):
              out.parent.mkdir(parents=True, exist_ok=True)
              tmp_c, tmp_b = Path('/tmp/book_cover.pdf'), Path('/tmp/book_body.pdf')
              render(pg, cover_html(), tmp_c, False)
              # 1かいめ：ページばんごうを しらべる → 2かいめ：もくじに いれる
              render(pg, body_html(G, {}), tmp_b, True)
              pages = {}
              for i, page in enumerate(PdfReader(tmp_b).pages):
                  for k in re.findall(r'@@([\w-]+)@@', page.extract_text() or ''):
                      pages.setdefault(k, i + 1)
              render(pg, body_html(G, pages), tmp_b, True)
              w = PdfWriter()
              for f in (tmp_c, tmp_b):
                  for page in PdfReader(f).pages:
                      w.add_page(page)
              w.add_metadata({'/Title': t(C.TITLE), '/Author': t(C.AUTHOR)})
              with open(out, 'wb') as fh:
                  w.write(fh)
              print(out.relative_to(ROOT), len(w.pages), 'pages', round(out.stat().st_size / 1e6, 1), 'MB', 'marks', len(pages))
        b.close()


ALL_TITLE = ('ほん ぜんぶ ― ブロックで プログラミング', 'All books — Block Programming')


def build_all():
    """4さつの ほんを 1つに まとめる（ひょうし ＋ もくじ ＋ しおり）。book/all-books.pdf と book/en/all-books.pdf"""
    global L, C
    order = ['draw', 'maze', 'space', 'craft']   # おえかき → めいろ → うちゅう → こわす・おく
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        for L, d in ((0, ROOT / 'book'), (1, ROOT / 'book' / 'en')):
            readers = [(k, PdfReader(d / f'{getattr(BOOKS[k], "FILE", "maze-book")}.pdf')) for k in order]
            start, n = {}, 2   # ひょうし（1ページ）の つぎから
            for k, r in readers:
                start[k] = n; n += len(r.pages)
            rows = ''.join(
                f'<div class="tr"><span>{"📘 " + t(BOOKS[k].TITLE)}</span><i></i><b>{start[k]}</b></div>'
                f'<div class="sub2">{t(BOOKS[k].SUBTITLE)}</div>' for k, r in readers)
            cover = f'''<!DOCTYPE html><html lang="{['ja', 'en'][L]}"><head><meta charset="utf-8"><style>{CSS}
@page {{ margin: 0; }}
.cv {{ height: 297mm; padding: 34mm 24mm; background: linear-gradient(#fff4d6, #f5d79a); }}
.cv h1 {{ font-size: 23pt; word-break: keep-all; color: #5a3a1a; text-align: center; margin: 0 0 4mm; }}
.cv .lead {{ text-align: center; color: #7a5a2a; margin-bottom: 16mm; }}
.cv .tr {{ font-size: 15pt; margin-top: 8mm; }} .cv .sub2 {{ font-size: 10.5pt; color: #7a5a2a; margin-left: 9mm; }}
.cv .au {{ position: absolute; bottom: 25mm; left: 0; right: 0; text-align: center; color: #5a3a1a; }}
</style></head><body><div class="cv pg"><h1>{t(ALL_TITLE)}</h1>
<div class="lead">{"おえかき・めいろ・うちゅう・こわす おく の 4さつ（ブロック と Python）" if L == 0 else "Four books: Drawing, Maze, Space, Break & Build (blocks and Python)"}</div>
{rows}<p class="cap" style="margin-top:10mm">{"ばんごうは PDF の ページ（それぞれの ほんの ページばんごうは 1 から はじまります）" if L == 0 else "Numbers are PDF pages (each book numbers its own pages from 1)."}</p><div class="au">{t(C_MAZE.AUTHOR)}</div></div></body></html>'''
            tmp = Path('/tmp/all_cover.pdf')
            render(pg, cover, tmp, False)
            w = PdfWriter()
            for page in PdfReader(tmp).pages:
                w.add_page(page)
            for k, r in readers:
                first = len(w.pages)
                for page in r.pages:
                    w.add_page(page)
                w.add_outline_item(t(BOOKS[k].TITLE), first)
            w.add_metadata({'/Title': t(ALL_TITLE), '/Author': t(C_MAZE.AUTHOR)})
            out = d / 'all-books.pdf'
            with open(out, 'wb') as fh:
                w.write(fh)
            print(out.relative_to(ROOT), len(w.pages), 'pages', round(out.stat().st_size / 1e6, 1), 'MB')
        b.close()


if __name__ == '__main__':
    args = sys.argv[1].split(',') if len(sys.argv) > 1 else None
    if args != ['all']:
        main(args)
    build_all()
