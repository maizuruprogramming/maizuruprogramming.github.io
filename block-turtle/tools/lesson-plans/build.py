"""学習指導案（原案）の PDF を つくる（書式：利用者 提供の 学習指導案に そろえる）。
つかいかた: python3 tools/lesson-plans/build.py  → lesson-plans/lp-*.pdf と lesson-plans/lesson-plans-all.pdf
"""
import html
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright
from pypdf import PdfReader, PdfWriter

sys.path.insert(0, str(Path(__file__).parent))
from plans import PLANS, AUTHOR_NOTE, NEXT_NOTE  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'lesson-plans'
AUTHOR = '舞鶴工業高等専門学校　井上泰仁'
CIRC = '①②③④⑤⑥⑦⑧⑨'

CSS = '''
@page { size: A4; margin: 13mm 14mm 15mm; }
* { box-sizing: border-box; }
body { font-family: 'Noto Sans CJK JP', sans-serif; font-size: 9.6pt; line-height: 1.6; color: #222; margin: 0; }
.plan { break-after: page; } .plan:last-child { break-after: auto; }
.hd { display: flex; align-items: center; gap: 4mm; padding-bottom: 2.5mm; border-bottom: 1.5px solid #333; }
.badge { background: #c4552b; color: #fff; font-weight: 700; font-size: 11pt; padding: 1.6mm 3.5mm; border-radius: 1.6mm; white-space: nowrap; }
.hd h1 { margin: 0; font-size: 14.5pt; line-height: 1.35; }
.hd .sub { font-size: 8.6pt; color: #555; margin-top: .6mm; }
.meta { display: flex; gap: 6mm; font-size: 9pt; padding: 2.5mm 1mm; border-bottom: 1px solid #999; margin-bottom: 3mm; }
.meta span { white-space: pre; }
.box { background: #fff6df; border: 1.5px solid #e3a33b; border-radius: 2.5mm; padding: 2.5mm 4mm; margin: 2mm 0 4mm; }
.box b.lbl { color: #b8432a; margin-right: 3mm; }
h2 { display: flex; align-items: center; gap: 2.5mm; font-size: 12pt; margin: 5mm 0 2mm; break-after: avoid; }
h2 .no { background: #b8432a; color: #fff; width: 6.2mm; height: 6.2mm; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 10pt; flex: none; }
h3 { font-size: 10pt; margin: 3mm 0 1mm; break-after: avoid; }
p { margin: 1mm 0; }
table { width: 100%; border-collapse: collapse; margin: 1.5mm 0 2mm; font-size: 9pt; line-height: 1.55; }
th, td { border: 1px solid #d5c09c; padding: 1.4mm 2.2mm; vertical-align: top; }
th { background: #f6e8cf; font-weight: 700; text-align: center; }
td.k { background: #fbf4e6; font-weight: 700; white-space: nowrap; width: 26mm; }
td.c { text-align: center; vertical-align: middle; white-space: nowrap; font-weight: 700; }
tr { break-inside: avoid; }
.honji { display: inline-block; background: #c4552b; color: #fff; font-size: 7.5pt; padding: .2mm 2mm; border-radius: 1mm; margin-top: 1mm; font-weight: 700; }
ul { margin: 1mm 0 2mm; padding-left: 5mm; } li { margin: .6mm 0; }
li b.code { color: #b8432a; }
.why b { color: #b8432a; margin-right: 2mm; }
.note { font-size: 8.4pt; color: #666; }
.url { display: block; font-size: 7.8pt; color: #777; word-break: break-all; }
'''


def e(s):
    return html.escape(str(s))


def crit_cell(items):
    return '<br>'.join(f'{CIRC[i]} {e(t)}' for i, t in enumerate(items))


def plan_html(P):
    jhs = '中学校' in P['grade']
    who = '生徒観' if jhs else '児童観'
    U = P['unit_word']
    n, k = P['hours'], P['honji']
    sub = f'{P["subject"]} ｜ {P["grade"]}・全{n}時間（本時は{k}時間目）'
    import re as _re
    m = _re.fullmatch(r'(小学校|中学校)第(\d)学年', P['grade'].split('（')[0])
    cls = f'{m.group(2)}年' if m else '　　年'
    t1 = ''.join(f'<tr><td class="k">{e(a)}</td><td>{e(b)}</td></tr>' for a, b in [
        (f'{U}名', P['title']), ('対象・時数', f'{P["grade"]}・全{n}時間（本時は{k}時間目）'), ('使う教材', P['materials']),
        ('主に扱う内容', P['main']), ('つながる内容', P['related'])])
    cos = ''.join(f'<li><b class="code">{e(c)}</b>：{e(t)}</li>' for c, t in P['cos'])
    goals = ''.join(f'<li>{e(g)}</li>' for g in P['goals'])
    crit = (f'<table><tr><th>知識・技能</th><th>思考・判断・表現</th><th>主体的に学習に取り組む態度</th></tr>'
            f'<tr><td>{crit_cell(P["crit"]["知"])}</td><td>{crit_cell(P["crit"]["思"])}</td><td>{crit_cell(P["crit"]["態"])}</td></tr></table>')
    prow = ''
    for t, act, scr, ev in P['plan']:
        is_h = t == str(k)
        prow += (f'<tr><td class="c">{e(t)}{"<br><span class=\"honji\">本時</span>" if is_h else ""}</td><td>{e(act)}</td>'
                 f'<td style="width:34mm">{e(scr)}</td><td style="width:32mm">{e(ev)}</td></tr>')
    plan_tbl = f'<table><tr><th style="width:12mm">時</th><th>学習内容と主な活動</th><th>使う画面</th><th>評価の観点（方法）</th></tr>{prow}</table>'
    frow = ''.join(f'<tr><td class="c">{e(st)}<br>{m}分</td><td>{e(act)}</td><td style="width:52mm">{e(care)}</td><td style="width:27mm">{e(ev)}</td></tr>'
                   for st, m, act, care, ev in P['flow'])
    flow_tbl = f'<table><tr><th style="width:14mm">時間</th><th>学習活動</th><th>指導上の留意点</th><th>評価（方法）</th></tr>{frow}</table>'
    prep = ''.join(f'<li>{e(x)}</li>' for x in P['prep'])
    care = ''.join(f'<li>{e(x)}</li>' for x in P['care'])
    refs = ''.join(f'<li>{e(t)}{f"<span class=\"url\">{e(u)}</span>" if u else ""}</li>' for t, u in P['refs'])
    return f'''<section class="plan">
<div class="hd"><span class="badge">学習指導案</span><div><h1>{e(P["title"])}</h1><div class="sub">{e(sub)}</div></div></div>
<div class="meta"><span>日時　　　年　　月　　日（　）　　校時</span><span>学級　{cls}　　組（　　名）</span><span>指導者　　　　　　　　</span></div>
<div class="box">{e(P["summary"])}</div>
<h2><span class="no">1</span>{U}と学習指導要領との関連</h2>
<table><tr><th style="width:26mm">項目</th><th>内容</th></tr>{t1}</table>
<p>本{U}で押さえる学習指導要領（平成29年告示）の事項は次のとおりである。</p>
<ul>{cos}</ul>
<p>{e(P["cos_text"])}</p>
<h2><span class="no">2</span>{U}の目標と評価規準</h2>
<h3>{U}の目標</h3><ol style="margin:1mm 0 2mm;padding-left:5mm">{goals}</ol>
<h3>{U}の評価規準</h3>{crit}
<h2><span class="no">3</span>{U}設定の理由</h2>
<p class="why"><b>{who}</b>{e(P["children"])}</p>
<p class="why"><b>教材観</b>{e(P["material"])}</p>
<p class="why"><b>指導観</b>{e(P["teaching"])}</p>
<h2><span class="no">4</span>指導と評価の計画（全{n}時間）</h2>
{plan_tbl}<p class="note">{e(P["plan_note"])}</p>
<h2><span class="no">5</span>本時（{k}/{n}時間）の学習指導</h2>
<div class="box"><b class="lbl">本時の目標</b>{e(P["honji_goal"])}</div>
{flow_tbl}
<h2><span class="no">6</span>準備・配慮事項と参考資料</h2>
<h3>準備</h3><ul>{prep}</ul>
<h3>配慮事項</h3><ul>{care}</ul>
<h3>参考資料</h3><ul>{refs}</ul>
<p class="note">{e(NEXT_NOTE)}　{e(AUTHOR_NOTE)}　作成：{AUTHOR}</p>
</section>'''


def page(body):
    return f'<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8"><style>{CSS}</style></head><body>{body}</body></html>'


def footer(P):
    t = html.escape(f'{P["title"]} ｜ {P["subject"]} ｜ 学習指導案')
    return (f'<div style="width:100%;text-align:center;font-size:7px;color:#666;font-family:Noto Sans CJK JP">{t}　'
            f'<span class="pageNumber"></span> / <span class="totalPages"></span></div>')


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
                   display_header_footer=True, header_template='<div></div>', footer_template=footer(P))
            files.append(out)
            print(out.name, len(PdfReader(out).pages), 'pages')
        w = PdfWriter()
        for f in files:
            first = len(w.pages)
            for pgx in PdfReader(f).pages:
                w.add_page(pgx)
            w.add_outline_item(next(P['title'] for P in PLANS if P['file'] == f.stem), first)
        w.add_metadata({'/Title': '学習指導案（原案）', '/Author': AUTHOR})
        with open(OUT / 'lesson-plans-all.pdf', 'wb') as fh:
            w.write(fh)
        b.close()


if __name__ == '__main__':
    main()
