# めいろの なかま（やじるし・かぎと とびら・てき）の 🐍 Python版を つくる
# つかいかた：さきに build.py で maze-*.html を つくってから  python3 tools/maze-variants/build_python.py
# もとの ページから「ことば・せかい・はんてい・ドット絵・こうかおん」を とりだし、python-core.js に つなぐ
import re, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..', '..')) + os.sep

def lines(f): return open(ROOT + f, encoding='utf-8').read().split('\n')
def grab(L, start_pred, end_pred, include_end=False):
    i = next(k for k, l in enumerate(L) if start_pred(l))
    j = next(k for k in range(i + 1, len(L)) if end_pred(L[k]))
    return '\n'.join(L[i:j + 1 if include_end else j])
def block_until_close(L, start):
    return grab(L, lambda l: l.startswith(start), lambda l: l in ('};', '});'), True)
def style(L):
    m = re.search(r'<style>(.*?)</style>', '\n'.join(L), re.S); return m.group(1)
def extra_str(key):   # tools/maze-variants/<key>.js の ことば（EXTRA）
    s = open(os.path.join(HERE, key + '.js'), encoding='utf-8').read()
    return re.search(r'/\*@@ STR \*/\n(.*?)(?=/\*@@ )', s, re.S).group(1).strip()

BODY = '''<body>
<header>
  <h1><span class="ico">🐍</span><span class="lbl" id="appTitle"></span></h1>
  <nav class="nav" id="nav"></nav>
  <button id="run"></button>
  <button id="reset" class="sub"></button>
  <button id="answerBtn" class="sub" style="display:none;"></button>
  <button id="fnBtn" class="sub2"></button>
</header>
<main>
  <div id="codeSide">
    <div id="tabs"><button id="tabBlocks" class="on"></button><button id="tabPy" class="off"></button></div>
    <div id="blocklyDiv"></div>
    <div id="pyLabel"></div>
    <div id="editorBox"><div id="lineNo"></div><div id="codeWrap"><pre id="hl" aria-hidden="true"></pre><textarea id="code" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea></div></div>
    <div id="palette"></div>
    <details id="mapBox"><summary id="mapTitle"></summary><table id="mapTable"></table></details>
    <div id="console"></div>
  </div>
  <div id="stage">
    <div id="lesson" class="panel">
      <select id="levelSelect"></select>
      <div id="lessonText" class="lessonText"></div>
      <button id="hintBtn"></button>
      <div id="hintText"></div>
    </div>
    <canvas id="board" class="board" width="400" height="400"></canvas>
    <div class="row"><label><span id="speedLbl"></span> <input id="speed" type="range" min="1" max="10" value="5"></label></div>
    <div id="msg"></div>
    <div id="info"></div>
  </div>
</main>
<div id="clearDialog" role="dialog" aria-modal="true" aria-labelledby="dlgQuestion">
  <div class="panel box">
    <div class="title" id="dlgTitle"></div>
    <div class="question" id="dlgQuestion"></div>
    <div class="btns"><button id="dlgYes"></button><button id="dlgNo"></button></div>
  </div>
</div>
'''
STORE = '''// ほぞん（この ブラウザの なかだけ）
const store = {
  get(k) { let v = null; try { v = localStorage.getItem(SAVE_KEY + k); } catch (_) { return null; } if (v == null) return null; try { return JSON.parse(v); } catch (_) { return v; } },
  set(k, v) { try { localStorage.setItem(SAVE_KEY + k, JSON.stringify(v)); } catch (_) {} }
};
'''
COMMON_VIEW = '''  load(lv) { loadMap(lv.map, lv.dir); },
  resetView() { robot = { ...START }; trail = [[START.r, START.c]]; crashed = false; resetWorld(); draw(); },
  apply(f, i, frames) {   // うごきの きろく 1コマぶんを えと おとに する（もとの アプリと おなじ）
    robot = { r: f.r, c: f.c, dir: f.dir };
    if (f.event === 'move') { trail.push([f.r, f.c]); Sound.step(); }
    if (f.event === 'turn') { const prev = i > 1 ? frames[i - 2].dir : START.dir; if ((prev + 1) % 4 === f.dir) Sound.turnRight(); else Sound.turnLeft(); }
    if (f.event === 'crash') { crashed = true; Sound.crash(); }
    onFrame(f);
  }'''
DIRS_CFG = '''// しらべる むき：[ブロックの ことば, Python の ことば, もとの アプリの きごう]
const PDIR = [[t('dirF'), 'front', 'F'], [t('dirR'), 'right', 'R'], [t('dirL'), 'left', 'L']];
const dirCode = (a) => PDIR.find((o) => o[1] === a)[2];'''

def build(src, out, title, savekey, key, config_top, config_world, levels_js, status=False):
    L = lines(src)
    html = f'''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<!-- 🐍 Python版：{src} から tools/maze-variants/build_python.py で つくった ページ。
     ブロックで くむと Python に なる。Python は ページの なかの ちいさな かいしゃくき（python-core.js）で よみとり、
     もとの アプリと おなじ せかい・はんてい・ドット絵・こうかおん で うごかす -->
<script src="https://unpkg.com/blockly@11/blockly_compressed.js"></script>
<script src="https://unpkg.com/blockly@11/blocks_compressed.js"></script>
<script src="i18n.js"></script>
<script src="certificate.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DotGothic16&display=swap" rel="stylesheet">
<link rel="stylesheet" href="common.css">
<link rel="stylesheet" href="python.css">
<link rel="stylesheet" href="mobile.css">  <!-- 📱 スマホの ならび（はば 600px いか） -->
<style>{style(L)}</style>
</head>
{BODY.replace('    <canvas id="board"', '    <div class="row" id="statusRow" style="font-size:17px"></div>\n    <canvas id="board"') if status else BODY}<script>
/* ========== 0. ことば（もとの アプリと おなじ。Python ようの ことばは python-core.js で たす） ========== */
{block_until_close(L, 'const STR = {')}
{extra_str(key)}
Object.assign(STR.ja, EXTRA.ja); Object.assign(STR.en, EXTRA.en);
const t = makeT(STR);
const L = (item, k) => (LANG === 'en' && item.en && item.en[k] !== undefined) ? item.en[k] : item[k];
{config_top}
const SAVE_KEY = '{savekey}';
{STORE}
/* ---------- ここから {src} と おなじ（せかい・はんてい・ドット絵） ---------- */
{grab(L, lambda l: l.startswith('/* ========== 5.'), lambda l: l.startswith('/* ========== 8.'))}
/* ---------- {src} と おなじ（こうかおん） ---------- */
{block_until_close(L, 'const Sound = {')}

/* ========== Python版の せってい ========== */
{grab(L, lambda l: re.match(r'const \w+Theme = Blockly\.Theme\.defineTheme', l), lambda l: l == '});', True)}
{config_world}

/* ========== Python の ステージ ==========
   blocks：ブロック モードで つかえる ブロック   start：さいしょの コード   answer：こたえ（先生モード） */
{levels_js}
</script>
<script src="python-core.js"></script>
<script src="mobile.js"></script>
</body>
</html>
'''
    open(ROOT + out, 'w', encoding='utf-8').write(html)
    print('wrote', out, len(html))

# ---------------- 🧭 やじるし ----------------
JR_LEVELS = r"""const ARROWS = ['w_up', 'w_down', 'w_left', 'w_right'];
const LEVELS = [
  { title: 'ステージ1　right() で すすもう',
    en: { title: 'Stage 1: Go with right()', text: 'right() moves one square to the right. Write it 3 times, one per line, to reach the diamond 💎.', hint: 'right() on 3 lines.' },
    text: 'right() と かくと みぎへ 1マス すすむよ。3ぎょう かいて ダイヤ 💎 まで いこう。',
    hint: 'right() を 3ぎょう。',
    map: ['####', 'S..G', '####', '####'], dir: 1, blocks: ['w_right'],
    start: '# みぎへ 1マス\nright()\n', startEn: '# one square right\nright()\n',
    answer: 'right()\nright()\nright()\n' },
  { title: 'ステージ2　down() で したへ',
    en: { title: 'Stage 2: Go down with down()', text: 'down() moves one square down.', hint: 'right() → down() ×3 → right() ×2' },
    text: 'down() で したへ 1マス すすむよ。',
    hint: 'right() → down() を 3つ → right() を 2つ',
    map: ['S.##', '#.##', '#.##', '#..G'], dir: 1, blocks: ['w_right', 'w_down'],
    start: 'right()\n', startEn: 'right()\n',
    answer: 'right()\ndown()\ndown()\ndown()\nright()\nright()\n' },
  { title: 'ステージ3　かいだん',
    en: { title: 'Stage 3: Stairs', text: 'right() and down(), one after the other.', hint: 'right() down() right() down() right() down()' },
    text: 'right() と down() を じゅんばんに かこう。',
    hint: 'right() → down() → right() → down() → right() → down()',
    map: ['S.##', '#..#', '##..', '###G'], dir: 1, blocks: ['w_right', 'w_down'],
    start: 'right()\n', startEn: 'right()\n',
    answer: 'right()\ndown()\nright()\ndown()\nright()\ndown()\n' },
  { title: 'ステージ4　up() で うえへ',
    en: { title: 'Stage 4: Go up with up()', text: 'up() moves one square up.', hint: 'up() ×3 → right() ×3' },
    text: 'up() で うえへ 1マス すすむよ。',
    hint: 'up() を 3つ → right() を 3つ',
    map: ['...G', '.###', '.###', 'S###'], dir: 0, blocks: ARROWS,
    start: 'up()\n', startEn: 'up()\n',
    answer: 'up()\nup()\nup()\nright()\nright()\nright()\n' },
  { title: 'ステージ5　left() も つかおう',
    en: { title: 'Stage 5: Use left() too', text: 'left() moves one square to the left. Use all four.', hint: 'right() ×2 → down() ×2 → left() ×2' },
    text: 'left() で ひだりへ 1マス。4つ ぜんぶ つかおう。',
    hint: 'right() を 2つ → down() を 2つ → left() を 2つ',
    map: ['S..#', '##.#', 'G..#', '####'], dir: 1, blocks: ARROWS,
    start: 'right()\n', startEn: 'right()\n',
    answer: 'right()\nright()\ndown()\ndown()\nleft()\nleft()\n' },
  { title: 'ステージ6　for で くりかえそう',
    en: { title: 'Stage 6: Repeat with for', text: '“for i in range(4):” repeats the lines under it 4 times. Indent those lines with 4 spaces.', hint: 'for i in range(4): → (indented) right() and down()' },
    text: '「for i in range(4):」で、したの ぎょうを 4かい くりかえすよ。くりかえす ぎょうは スペース 4つ じさげ。',
    hint: 'for i in range(4): → （じさげ）right() と down()',
    map: ['S.###', '#..##', '##..#', '###..', '####G'], dir: 1, blocks: [...ARROWS, 'w_repeat'],
    start: 'for i in range(4):\n    right()\n', startEn: 'for i in range(4):\n    right()\n',
    answer: 'for i in range(4):\n    right()\n    down()\n' }
];"""
build('maze-junior.html', 'python-maze-junior.html', 'Pythonで やじるし めいろ / Python Arrow Maze', 'block-pymazejr', 'junior',
 "STR.ja.pyTitle = 'Pythonで やじるし めいろ'; STR.en.pyTitle = 'Python Arrow Maze';",
 '''const JC = { up: '#3c5aa6', down: '#2e7d32', left: '#8e44ad', right: '#c0631a', loop: '#8b5a2b' };
const WORLD = {
  icons: ['🐍', '🧭'], theme: craftTheme, renderer: 'geras', gridColour: '#3f2e1f', loopColour: JC.loop,
  // うえ・した・ひだり・みぎ へ 1マス（むきは かんがえない）
  cmds: [
    { py: 'up', js: 'go(0)', label: t('bUp'), colour: JC.up },
    { py: 'down', js: 'go(2)', label: t('bDown'), colour: JC.down },
    { py: 'left', js: 'go(3)', label: t('bLeftA'), colour: JC.left },
    { py: 'right', js: 'go(1)', label: t('bRightA'), colour: JC.right }
  ],
  conds: [],
  palette: ['up()', 'down()', 'left()', 'right()', 'for i in range(4):'],
  mapRows: [[JC.up, t('bUp'), 'up()'], [JC.down, t('bDown'), 'down()'], [JC.left, t('bLeftA'), 'left()'], [JC.right, t('bRightA'), 'right()'],
            [JC.loop, t('pyRepeatLbl'), 'for i in range(〇):']],
''' + COMMON_VIEW + '''
};''', JR_LEVELS)

# ---------------- 🗝 かぎと とびら ----------------
KEY_LEVELS = r"""const MOVE = ['w_forward', 'w_turn_right', 'w_turn_left'];
const ITEM = ['w_pick_up', 'w_open_door'];
const LEVELS = [
  { title: 'ステージ1　pick_up() と open_door()',
    en: { title: 'Stage 1: pick_up() and open_door()', text: 'On the key 🔑, pick_up(). In front of the door 🚪, open_door(). Then you can go through.', hint: 'forward() ×2 → pick_up() → open_door() → forward() ×2' },
    text: 'かぎ 🔑 の うえで pick_up()、とびら 🚪 の まえで open_door()。すると とおれるよ。',
    hint: 'forward() を 2かい → pick_up() → open_door() → forward() を 2かい',
    map: ['#####', '#####', 'S.KDG', '#####', '#####'], dir: 1, blocks: ['w_forward', ...ITEM],
    start: '# かぎの うえで pick_up()\nforward()\n', startEn: '# pick_up() on the key\nforward()\n',
    answer: 'forward()\nforward()\npick_up()\nopen_door()\nforward()\nforward()\n' },
  { title: 'ステージ2　かぎは どこ？',
    en: { title: 'Stage 2: Where is the key?', text: 'Get the key first. Without a key, open_door() does not work.', hint: 'Walk to the key, pick_up(), turn_right() twice and go back.' },
    text: 'さきに かぎを とりに いこう。かぎが ないと open_door() は できないよ。',
    hint: 'かぎまで いって pick_up()、turn_right() を 2かい して もどろう。',
    map: ['S..##', '##.##', 'K..DG', '#####', '#####'], dir: 1, blocks: [...MOVE, ...ITEM, 'w_repeat'],
    start: 'forward()\n', startEn: 'forward()\n',
    answer: 'forward()\nforward()\nturn_right()\nforward()\nforward()\nturn_right()\nforward()\nforward()\npick_up()\nturn_right()\nturn_right()\nforward()\nforward()\nopen_door()\nforward()\nforward()\n' },
  { title: 'ステージ3　for で とびら 2つ',
    en: { title: 'Stage 3: Two doors with for', text: 'Repeat “forward() → pick_up() → open_door() → forward()” with for.', hint: 'for i in range(2): (4 lines, indented) → turn_right() → forward()' },
    text: '「forward() → pick_up() → open_door() → forward()」を for で くりかえそう。',
    hint: 'for i in range(2): の なかに 4ぎょう（じさげ）→ turn_right() → forward()',
    map: ['SKDKD', '####G', '#####', '#####', '#####'], dir: 1, blocks: [...MOVE, ...ITEM, 'w_repeat'],
    start: 'for i in range(2):\n    forward()\n', startEn: 'for i in range(2):\n    forward()\n',
    answer: 'for i in range(2):\n    forward()\n    pick_up()\n    open_door()\n    forward()\nturn_right()\nforward()\n' },
  { title: 'ステージ4　key_here() と door_ahead()',
    en: { title: 'Stage 4: key_here() and door_ahead()', text: 'key_here() checks for a key where you stand. door_ahead() checks for a door in front. Use them inside “while not at_goal():”.', hint: "while not at_goal(): if key_here(): pick_up() / if door_ahead(): open_door() / if is_open('front'): forward() else: turn_right()" },
    text: 'key_here() で いまの マスに かぎが あるか、door_ahead() で まえに とびらが あるか しらべられるよ。「while not at_goal():」の なかで つかおう。',
    hint: "while not at_goal(): の なかで if key_here(): pick_up() → if door_ahead(): open_door() → if is_open('front'): forward() → else: turn_right()",
    map: ['SK.D.', '####.', '..G#K', '.###.', '.D.K.'], dir: 1, blocks: [...MOVE, ...ITEM, 'w_until', 'w_if_key_here', 'w_if_door_ahead', 'w_ifelse_is_open'],
    start: 'while not at_goal():\n    forward()\n', startEn: 'while not at_goal():\n    forward()\n',
    answer: "while not at_goal():\n    if key_here():\n        pick_up()\n    if door_ahead():\n        open_door()\n    if is_open('front'):\n        forward()\n    else:\n        turn_right()\n" }
];"""
build('maze-key.html', 'python-maze-key.html', 'Pythonで かぎと とびら / Python Keys & Doors', 'block-pymazekey', 'key',
 "STR.ja.pyTitle = 'Pythonで かぎと とびら'; STR.en.pyTitle = 'Python Keys & Doors';\n"
 "Object.assign(STR.ja, { bIfDoor: 'もし まえが とびら なら', bIfKeyHere: 'もし ここに かぎが あったら' });\n"
 "Object.assign(STR.en, { bIfDoor: 'if door in front', bIfKeyHere: 'if key here' });",
 DIRS_CFG + '''
const WORLD = {
  icons: ['🐍', '🗝'], theme: craftTheme, renderer: 'geras', gridColour: '#3f2e1f', loopColour: '#8b5a2b',
  cmds: [
    { py: 'forward', js: 'forward()', label: t('bForward'), colour: '#4f8f2f' },
    { py: 'turn_right', js: 'turnRight()', label: t('bRight'), colour: '#4f8f2f' },
    { py: 'turn_left', js: 'turnLeft()', label: t('bLeft'), colour: '#4f8f2f' },
    { py: 'pick_up', js: 'pickKey()', label: t('bPick'), colour: '#b8860b' },
    { py: 'open_door', js: 'openDoor()', label: t('bOpen'), colour: '#b8860b' }
  ],
  conds: [
    { py: 'key_here', js: () => "check('KEY')", label: t('bIfKeyHere'), colour: '#b8860b' },
    { py: 'door_ahead', js: () => "check('DOOR')", label: t('bIfDoor'), colour: '#b8860b' },
    { py: 'is_open', opts: PDIR, js: (a) => `isOpen('${dirCode(a)}')`, label: t('bIf'), colour: '#3c5aa6' }
  ],
  until: { py: 'at_goal', js: 'atGoal()', label: t('bUntilGoal') },
''' + COMMON_VIEW + '''
};''', KEY_LEVELS, status=True)

# ---------------- 👾 てき ----------------
EN_LEVELS = r"""const MOVE = ['w_forward', 'w_turn_right', 'w_turn_left'];
const LEVELS = [
  { title: 'ステージ1　wait() で まとう',
    en: { title: 'Stage 1: wait()', text: 'wait() makes the explorer wait for 1 turn. The slime moves 1 square every turn. Time your move!', hint: 'forward() → wait() ×2 → forward() ×3' },
    text: 'wait() で 1かい まつよ。スライムは 1かいごとに 1マス うごく。タイミングを あわせよう！',
    hint: 'forward() → wait() を 2かい → forward() を 3かい',
    map: ['##E##', '##e##', 'S.e.G', '##e##', '##e##'], dir: 1, blocks: ['w_forward', 'w_wait'],
    start: '# 1かい まつ\nwait()\n', startEn: '# wait 1 turn\nwait()\n',
    answer: 'forward()\nwait()\nwait()\nforward()\nforward()\nforward()\n' },
  { title: 'ステージ2　if danger_ahead():',
    en: { title: 'Stage 2: if danger_ahead():', text: 'danger_ahead() is True when a slime is in front of you or will come there next. If so, wait(); else, forward().', hint: 'while not at_goal(): if danger_ahead(): wait() else: forward()' },
    text: 'danger_ahead() は、スライムが まえに いる ときや つぎに まえに くる とき True に なるよ。そう なら wait()、そうでなければ forward()。',
    hint: 'while not at_goal(): の なかで if danger_ahead(): wait() → else: forward()',
    map: ['##E#e##', '##e#e##', '##e#e##', 'S.e.e.G', '##e#e##', '##e#E##', '##e#e##'], dir: 1, blocks: ['w_forward', 'w_wait', 'w_until', 'w_ifelse_danger_ahead'],
    start: 'while not at_goal():\n    forward()\n', startEn: 'while not at_goal():\n    forward()\n',
    answer: 'while not at_goal():\n    if danger_ahead():\n        wait()\n    else:\n        forward()\n' },
  { title: 'ステージ3　elif で おおきな めいろ',
    en: { title: 'Stage 3: A bigger maze with elif', text: 'If danger, wait(). elif the front is open, forward(). else turn_right().', hint: "while not at_goal(): if danger_ahead(): wait() / elif is_open('front'): forward() / else: turn_right()" },
    text: 'あぶなければ wait()、そうでなくて（elif）まえが あいていれば forward()、どれでもなければ turn_right()。',
    hint: "while not at_goal(): の なかで if danger_ahead(): wait() → elif is_open('front'): forward() → else: turn_right()",
    map: ['S..e....', '###e###.', '###e###.', '###E###.', '####Eeee', '#######.', '#######.', '#######G'], dir: 1,
    blocks: [...MOVE, 'w_wait', 'w_until', 'w_ifelse_danger_ahead', 'w_ifelse_is_open'],
    start: 'while not at_goal():\n    forward()\n', startEn: 'while not at_goal():\n    forward()\n',
    answer: "while not at_goal():\n    if danger_ahead():\n        wait()\n    elif is_open('front'):\n        forward()\n    else:\n        turn_right()\n" },
  { title: 'ステージ4　うずまきの めいろ',
    en: { title: 'Stage 4: The spiral maze', text: 'A 10×10 spiral with three slimes. Does your program from Stage 3 work here too?', hint: 'The Stage 3 program works as it is.' },
    text: '10×10 の うずまきに スライムが 3びき。ステージ3の プログラムで いけるかな？',
    hint: 'ステージ3の プログラムが そのまま つかえるよ。',
    map: ['S...e.....', '####E####.', '....e...#.', '.######.#.', '.#...G#.#.', '.#.####eEe', '.#.####.#.', '.#...e..#.', '.####e###.', '.....E....'], dir: 1,
    blocks: [...MOVE, 'w_wait', 'w_until', 'w_ifelse_danger_ahead', 'w_ifelse_is_open'],
    start: 'while not at_goal():\n    forward()\n', startEn: 'while not at_goal():\n    forward()\n',
    answer: "while not at_goal():\n    if danger_ahead():\n        wait()\n    elif is_open('front'):\n        forward()\n    else:\n        turn_right()\n" }
];"""
build('maze-enemy.html', 'python-maze-enemy.html', 'Pythonで てきを よける / Python Slime Maze', 'block-pymazeenemy', 'enemy',
 "STR.ja.pyTitle = 'Pythonで てきを よける'; STR.en.pyTitle = 'Python Slime Maze';\n"
 "Object.assign(STR.ja, { bDangerPy: 'もし まえが あぶなかったら' }); Object.assign(STR.en, { bDangerPy: 'if danger ahead' });",
 DIRS_CFG + '''
const WORLD = {
  icons: ['🐍', '👾'], theme: craftTheme, renderer: 'geras', gridColour: '#3f2e1f', loopColour: '#8b5a2b',
  cmds: [
    { py: 'forward', js: 'forward()', label: t('bForward'), colour: '#4f8f2f' },
    { py: 'turn_right', js: 'turnRight()', label: t('bRight'), colour: '#4f8f2f' },
    { py: 'turn_left', js: 'turnLeft()', label: t('bLeft'), colour: '#4f8f2f' },
    { py: 'wait', js: 'wait()', label: t('bWait'), colour: '#c0631a' }
  ],
  conds: [
    { py: 'danger_ahead', js: () => 'danger()', label: t('bDangerPy'), colour: '#8e44ad' },
    { py: 'is_open', opts: PDIR, js: (a) => `isOpen('${dirCode(a)}')`, label: t('bIf'), colour: '#3c5aa6' }
  ],
  until: { py: 'at_goal', js: 'atGoal()', label: t('bUntilGoal') },
  delay: (f, sp) => Math.max(40, (650 - sp * 60) * 0.7),
''' + COMMON_VIEW + '''
};''', EN_LEVELS, status=True)
