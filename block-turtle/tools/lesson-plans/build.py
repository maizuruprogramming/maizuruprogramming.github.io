"""学習指導案（原案）の PDF を つくる。
つかいかた: python3 tools/lesson-plans/build.py  → lesson-plans/lp-*.pdf と lesson-plans/lesson-plans-all.pdf
"""
import html
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright
from pypdf import PdfReader, PdfWriter

sys.path.insert(0, str(Path(__file__).parent))
from plans import PLANS, COMMON_NOTE  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'lesson-plans'
AUTHOR = '舞鶴工業高等専門学校　井上泰仁'

CSS = '''
@page { size: A4; margin: 16mm 17mm 16mm; }
* { box-sizing: border-box; }
body { font-family: 'Noto Serif CJK JP', serif; font-size: 10.3pt; line-height: 1.6; color: #111; margin: 0; }
.plan { break-after: page; } .plan:last-child { break-after: auto; }
h1 { font-size: 15.5pt; text-align: center; margin: 0 0 3mm; letter-spacing: 1px; }
.draft { text-align: right; font-size: 8.5pt; color: #666; margin-bottom: 1mm; font-family: 'Noto Sans CJK JP'; }
.meta { width: 62%; margin: 0 0 3mm auto; border-collapse: collapse; font-size: 9.8pt; }
.meta td { padding: .4mm 1mm; } .meta td:first-child { width: 22mm; }
.meta td.line { border-bottom: 1px solid #555; }
h2 { font-size: 11.2pt; margin: 3.5mm 0 1mm; font-family: 'Noto Sans CJK JP'; font-weight: bold; }
h3 { font-size: 10.4pt; margin: 2mm 0 .5mm; font-family: 'Noto Sans CJK JP'; font-weight: bold; }
p { margin: .5mm 0 1mm; text-indent: 1em; }
ol.goals { margin: .5mm 0 1mm; padding-left: 0; list-style: none; } ol.goals li { padding-left: 4.5em; text-indent: -4.5em; }
table.t { width: 100%; border-collapse: collapse; margin: 1mm 0 2mm; font-size: 9.4pt; line-height: 1.5; }
table.t th, table.t td { border: 1px solid #333; padding: 1mm 1.6mm; vertical-align: top; }
table.t th { background: #eee; font-family: 'Noto Sans CJK JP'; font-weight: bold; text-align: center; }
table.t:not(.flow) { break-inside: avoid; }
table.t tr.honji td { background: #fff6d6; }
table.flow td { white-space: pre-wrap; } table.flow td.c { text-align: center; white-space: normal; }
table.flow tr.meate td { text-align: center; font-weight: bold; border-left: 1px solid #333; }
table.flow tr.meate td span { display: inline-block; border: 1.5px solid #333; padding: .5mm 3mm; }
table.flow tr { break-inside: avoid; }
.board { display: grid; grid-template-columns: 1fr 1.6fr 1fr; border: 2px solid #2f4f3f; background: #f3f7f3; min-height: 38mm; font-size: 9pt; }
.board div { padding: 2mm 3mm; white-space: pre-wrap; border-right: 1px dashed #8aa; } .board div:last-child { border-right: none; }
.board .code { font-family: 'DejaVu Sans Mono', 'Noto Sans CJK JP', monospace; font-size: 8.4pt; }
.note { font-size: 8.6pt; color: #444; border-top: 1px solid #aaa; margin-top: 3mm; padding-top: 1mm; text-indent: 0; }
.mk { font-family: 'Noto Sans CJK JP'; font-size: 8.6pt; color: #444; }
'''


def e(s):
    return html.escape(s)


def plan_html(P):
    is_jhs = '中学校' in P['grade']
    who = '児童（生徒）' if is_jhs else '児童'
    goals = ''.join(f'<li>{lab}{e(g)}</li>' for lab, g in zip(['（知識・技能）', '（思考・判断・表現）', '（主体的に学習に取り組む態度）'], P['goals']))
    crit = ('<table class="t"><tr><th>知識・技能</th><th>思考・判断・表現</th><th>主体的に学習に取り組む態度</th></tr><tr>'
            + ''.join(f'<td>{e(c)}</td>' for c in P['criteria']) + '</tr></table>')
    honji_no = P['honji'].split('／')[0]
    total = P['honji'].split('／')[1]
    rows = ''.join(
        f'<tr class="{"honji" if "本時" in act else ""}"><td class="c" style="width:12mm;text-align:center">{e(n)}</td><td>{e(act)}</td><td style="width:42mm">{e(ev)}</td></tr>'
        for n, act, ev in P['plan'])
    plan_tbl = f'<table class="t"><tr><th>時</th><th>主な学習活動</th><th>評価（観点・方法）</th></tr>{rows}</table>'
    flow_rows = []
    for st, mins, act, care, ev in P['flow']:
        if act.startswith('【めあて】') and not st:
            flow_rows.append(f'<tr class="meate"><td></td><td></td><td colspan="3"><span>{e(act)}</span></td></tr>')
            continue
        if not act and not care:
            continue
        flow_rows.append(f'<tr><td class="c">{e(st)}</td><td class="c">{e(mins)}</td><td>{e(act)}</td><td>{e(care)}</td><td>{e(ev)}</td></tr>')
    flow = ('<table class="t flow"><colgroup><col style="width:11mm"><col style="width:8mm"><col style="width:40%"><col style="width:33%"><col></colgroup>'
            '<tr><th>段階</th><th>分</th><th>学習活動<br><span class="mk">○主な発問・活動　・予想される反応</span></th>'
            '<th>指導上の留意点<br><span class="mk">・留意点　◇支援</span></th><th>評価<br><span class="mk">【観点】（方法）</span></th></tr>'
            + ''.join(flow_rows) + '</table>')
    b = P['board']
    board = f'<div class="board"><div>{e(b[0])}</div><div class="{"code" if "while" in b[1] else ""}">{e(b[1])}</div><div>{e(b[2])}</div></div>'
    return f'''<section class="plan">
<div class="draft">学習指導案（原案）　作成：{AUTHOR}</div>
<h1>{e(P["grade"])}　{e(P["subject"])}　学習指導案</h1>
<table class="meta">
<tr><td>日　時</td><td class="line">令和　　年　　月　　日（　）第　　校時</td></tr>
<tr><td>学　級</td><td class="line">{e(P["grade"].split("／")[0].strip())}　　組（　　名）</td></tr>
<tr><td>場　所</td><td class="line"></td></tr>
<tr><td>指導者</td><td class="line"></td></tr>
</table>
<h2>１　単元名</h2><p>「{e(P["unit"])}」</p><p class="mk" style="text-indent:1em">使用教材：{e(P["app"])}</p>
<h2>２　単元の目標</h2><ol class="goals">{goals}</ol>
<h2>３　単元の評価規準</h2>{crit}
<h2>４　単元について</h2>
<h3>（１）{who}観</h3><p>{e(P["children"])}</p>
<h3>（２）教材観</h3><p>{e(P["material"])}</p>
<h3>（３）指導観</h3><p>{e(P["teaching"])}</p>
<h2>５　単元の指導計画（全{total}時間）</h2>{plan_tbl}
<h2>６　本時の学習（{honji_no}／{total}）</h2>
<h3>（１）本時の目標</h3><p>{e(P["honji_goal"])}</p>
<h3>（２）準備物</h3><p>{e(P["prep"])}</p>
<h3>（３）展開（45分）</h3>{flow}
<h2>７　板書計画</h2>{board}
<p class="note">{e(COMMON_NOTE)}　ワークシートの番号（①〜⑧）は、かいせつしょの「📝 ワークシート（PDF）」に対応しています。</p>
</section>'''


def page(body):
    return f'<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8"><style>{CSS}</style></head><body>{body}</body></html>'


FOOT = '<div style="width:100%;text-align:center;font-size:8px;color:#888">- <span class="pageNumber"></span> / <span class="totalPages"></span> -</div>'


def main():
    OUT.mkdir(exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        files = []
        for P in PLANS:
            pg.set_content(page(plan_html(P)), wait_until='load')
            out = OUT / f'{P["file"]}.pdf'
            pg.pdf(path=str(out), format='A4', prefer_css_page_size=True, print_background=True,
                   display_header_footer=True, header_template='<div></div>', footer_template=FOOT)
            files.append(out)
            print(out.name, len(PdfReader(out).pages), 'pages')
        w = PdfWriter()
        for f in files:
            for pgx in PdfReader(f).pages:
                w.add_page(pgx)
        w.add_metadata({'/Title': '学習指導案（原案）', '/Author': AUTHOR})
        with open(OUT / 'lesson-plans-all.pdf', 'wb') as fh:
            w.write(fh)
        b.close()


if __name__ == '__main__':
    main()
