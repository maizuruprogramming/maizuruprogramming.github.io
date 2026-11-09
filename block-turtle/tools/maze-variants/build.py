# maze.html を もとに、めいろの べつバージョン（かぎと とびら・てき・やじるし）を つくる
# つかいかた：python3 tools/maze-variants/build.py （key enemy junior の どれかだけ つくる ことも できる）
import re, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))
SRC = os.path.join(ROOT, 'maze.html')
OUT = ROOT + os.sep
base = open(SRC, encoding='utf-8').read()

def cut(s, start, end):
    i = s.index(start); j = s.index(end, i)
    return i, j

def build(v):
    s = base
    snip = open(os.path.join(HERE, v['key'] + '.js'), encoding='utf-8').read()
    parts = dict(re.findall(r'/\*@@ (\w+) \*/\n(.*?)(?=/\*@@ |\Z)', snip, re.S))
    # タイトル・アイコン
    s = s.replace('<title>ブロックでめいろ / Block Maze</title>', f'<title>{v["title_ja"]} / {v["title_en"]}</title>')
    s = s.replace('<h1><span class="ico">⛏</span>', f'<h1><span class="ico">{v["icon"]}</span>', 1)
    s = s.replace("appTitle: 'ブロックでめいろ',", f"appTitle: '{v['title_ja']}',", 1)
    s = s.replace("appTitle: 'Block Maze',", f"appTitle: '{v['title_en']}',", 1)
    # ことばを たす
    s = s.replace('const t = makeT(STR);', parts['STR'].strip() + "\nObject.assign(STR.ja, EXTRA.ja); Object.assign(STR.en, EXTRA.en);\nconst t = makeT(STR);", 1)
    # 1〜3：ブロック・JavaScript・ステージ
    i, j = cut(s, '/* ========== 1. オリジナルのブロック ========== */', '/* ========== 4. ワークスペース ========== */')
    s = s[:i] + parts['BLOCKS'].strip() + '\n\n\n' + s[j:]
    # ワークスペースの おおきさ
    if 'SCALE' in parts:
        s = s.replace("zoom: { controls: true, wheel: true, startScale: 1.0 }", "zoom: { controls: true, wheel: true, startScale: " + parts['SCALE'].strip() + " }", 1)
    s = s.replace("const SAVE_KEY = 'block-maze';", f"const SAVE_KEY = '{v['save']}';", 1)
    # 5〜6：せかい と シミュレーション
    i, j = cut(s, '/* ========== 5. めいろ ========== */', '/* ========== 7. えを かく（ドット絵） ==========')
    s = s[:i] + parts['WORLD'].strip() + '\n\n' + s[j:]
    # 7：え（マスの おおきさが ステージで かわる）
    s = s.replace('const PX = CELL / 16;', 'let PX = CELL / 16;', 1)
    i, j = cut(s, 'function draw() {', '/* ========== 8. ステージの きりかえ ========== */')
    s = s[:i] + parts['DRAW'].strip() + '\n\n' + s[j:]
    # じっこうの コマ・リセット
    s = s.replace("      if (f.event === 'crash') { crashed = true; Sound.crash(); }",
                  "      if (f.event === 'crash') { crashed = true; Sound.crash(); }\n      onFrame(f);", 1)
    s = s.replace("  robot = { ...START }; trail = [[START.r, START.c]]; crashed = false;",
                  "  robot = { ...START }; trail = [[START.r, START.c]]; crashed = false;\n  resetWorld();", 1)
    s = s.replace("      timer = setTimeout(tick, 650 - speed * 60);",
                  "      timer = setTimeout(tick, Math.max(40, (650 - speed * 60) * " + v.get('speedMul', '1') + "));", 1)
    # こうかおん
    s = s.replace("  toggle() {\n    this.muted = !this.muted;", parts['SOUND'].rstrip() + "\n  toggle() {\n    this.muted = !this.muted;", 1)
    # しゅうりょうしょう
    s = s.replace("icons: ['⛏', '💎']", f"icons: {v['cert']}", 1)
    if v.get('status'):   # ばんめんの うえに もちもの・ターンを だす ぎょう
        s = s.replace('    <canvas id="board" class="board"', '    <div class="row" id="statusRow" style="font-size:17px"></div>\n    <canvas id="board" class="board"', 1)
    for a, b in v.get('extra', []):
        assert a in s, a
        s = s.replace(a, b, 1)
    head = f'<!-- {v["icon"]} {v["title_ja"]}：maze.html を もとに tools/maze-variants/build.py で つくった ページ（{v["key"]}.js が ちがう ところ） -->\n'
    s = s.replace('<html lang="ja">\n<head>', '<html lang="ja">\n<head>\n' + head, 1)
    open(OUT + v['file'], 'w', encoding='utf-8').write(s)
    print('wrote', v['file'], len(s))

VARIANTS = [
    dict(key='key', file='maze-key.html', icon='🗝', title_ja='かぎと とびらの めいろ', title_en='Keys & Doors Maze', save='block-mazekey', cert="['🗝', '🚪']", status=True),
    dict(key='enemy', file='maze-enemy.html', icon='👾', title_ja='てきを よける めいろ', title_en='Dodge the Slime Maze', save='block-mazeenemy', cert="['👾', '💎']", speedMul='0.7', status=True),
    dict(key='junior', file='maze-junior.html', icon='🧭', title_ja='やじるしの めいろ', title_en='Arrow Maze', save='block-mazejr', cert="['🧭', '💎']"),
]
for v in VARIANTS:
    if len(sys.argv) > 1 and v['key'] not in sys.argv[1:]: continue
    build(v)
