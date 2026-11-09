/*@@ STR */
const EXTRA = {
  ja: {
    bPick: 'かぎを ひろう 🔑', bOpen: 'とびらを あける 🚪', bIfThing: 'もし %1 なら',
    cDoor: 'まえが とびら', cKey: 'ここに かぎが ある',
    doorLocked: '🚪 とびらが あかないよ。かぎは どこかな？', doorBump: '🚪 とびらに ぶつかった！「とびらを あける」を つかおう',
    noKeyHere: 'ここには かぎが ないよ', noDoor: 'まえに とびらが ないよ', needKey: 'かぎを もっていないよ。さきに かぎを ひろおう',
    have: 'もちもの'
  },
  en: {
    bPick: 'pick up key 🔑', bOpen: 'open door 🚪', bIfThing: 'if %1',
    cDoor: 'door in front', cKey: 'key here',
    doorLocked: '🚪 The door is locked. Where is the key?', doorBump: '🚪 Bump! Use "open door" first.',
    noKeyHere: 'There is no key here.', noDoor: 'There is no door in front.', needKey: 'You have no key. Pick one up first.',
    have: 'Items'
  }
};
/*@@ BLOCKS */
/* ========== 1. オリジナルのブロック（めいろ ＋ かぎ・とびら） ========== */
const DIRS = [[t('dirF'), 'F'], [t('dirR'), 'R'], [t('dirL'), 'L']];
const THINGS = [[t('cDoor'), 'DOOR'], [t('cKey'), 'KEY']];

Blockly.common.defineBlocksWithJsonArray([
  { type: 'maze_forward', message0: t('bForward'), previousStatement: null, nextStatement: null, colour: '#4f8f2f' },
  { type: 'maze_right', message0: t('bRight'), previousStatement: null, nextStatement: null, colour: '#4f8f2f' },
  { type: 'maze_left', message0: t('bLeft'), previousStatement: null, nextStatement: null, colour: '#4f8f2f' },
  { type: 'maze_until_goal', message0: t('bUntilGoal'),
    message1: '%1', args1: [{ type: 'input_statement', name: 'DO' }],
    previousStatement: null, nextStatement: null, colour: '#8b5a2b' },
  { type: 'maze_ifelse', message0: t('bIf'),
    args0: [{ type: 'field_dropdown', name: 'DIR', options: DIRS }],
    message1: '%1', args1: [{ type: 'input_statement', name: 'DO' }],
    message2: t('bElse'), args2: [{ type: 'input_statement', name: 'ELSE' }],
    previousStatement: null, nextStatement: null, colour: '#3c5aa6' },
  { type: 'key_pick', message0: t('bPick'), previousStatement: null, nextStatement: null, colour: '#b8860b' },
  { type: 'door_open', message0: t('bOpen'), previousStatement: null, nextStatement: null, colour: '#b8860b' },
  { type: 'key_if', message0: t('bIfThing'),
    args0: [{ type: 'field_dropdown', name: 'WHAT', options: THINGS }],
    message1: '%1', args1: [{ type: 'input_statement', name: 'DO' }],
    previousStatement: null, nextStatement: null, colour: '#3c5aa6' }
]);

/* ========== 2. ブロック → JavaScript ========== */
const gen = javascript.javascriptGenerator;
gen.STATEMENT_PREFIX = 'highlight(%1);\n';
gen.addReservedWords('highlight');
gen.forBlock['maze_forward'] = () => 'forward();\n';
gen.forBlock['maze_right']   = () => 'turnRight();\n';
gen.forBlock['maze_left']    = () => 'turnLeft();\n';
gen.forBlock['maze_until_goal'] = (b, g) => `while (!atGoal()) {\n  loopGuard();\n${g.statementToCode(b, 'DO')}}\n`;
gen.forBlock['maze_ifelse'] = (b, g) =>
  `if (isOpen('${b.getFieldValue('DIR')}')) {\n${g.statementToCode(b, 'DO')}} else {\n${g.statementToCode(b, 'ELSE')}}\n`;
gen.forBlock['key_pick']  = () => 'pickKey();\n';
gen.forBlock['door_open'] = () => 'openDoor();\n';
gen.forBlock['key_if'] = (b, g) => `if (check('${b.getFieldValue('WHAT')}')) {\n${g.statementToCode(b, 'DO')}}\n`;

/* ========== 3. ステージ ==========
   map の きごう：S=スタート  G=ゴール  #=いわ  .=みち  K=かぎ  D=とびら（かぎ 1こで 1つ あく） */
const MOVE = ['maze_forward', 'maze_right', 'maze_left'];
const ITEM = ['key_pick', 'door_open'];
const ALL  = [...MOVE, ...ITEM, 'controls_repeat_ext', 'maze_until_goal', 'maze_ifelse', 'key_if'];

const LEVELS = [
  { title: 'ステージ1　かぎを ひろって とびらを あけよう',
    en: { title: 'Stage 1: Pick up the key, open the door', text: 'Move onto the key 🔑 and use "pick up key". In front of the door 🚪, use "open door" and you can go through.', hint: 'forward → forward → pick up key → open door → forward → forward' },
    text: 'かぎ 🔑 の うえで「かぎを ひろう」。とびら 🚪 の まえで「とびらを あける」と、とおれるように なるよ。',
    hint: 'すすむ → すすむ → かぎを ひろう → とびらを あける → すすむ → すすむ',
    map: ['#####', '#####', 'S.KDG', '#####', '#####'], dir: 1, blocks: ['maze_forward', ...ITEM] },
  { title: 'ステージ2　かぎは どこ？',
    en: { title: 'Stage 2: Where is the key?', text: 'The diamond is behind the door. Go and get the key first. Without a key, the door will not open.', hint: 'Walk to the key and pick it up. Then turn right twice and go back.' },
    text: 'とびらの むこうに ダイヤが あるよ。さきに かぎを ひろいに いこう。かぎが ないと とびらは あかないよ。',
    hint: 'かぎまで いって ひろったら、みぎを 2かい むいて もどろう。',
    map: ['S..##', '##.##', 'K..DG', '#####', '#####'], dir: 1, blocks: [...MOVE, ...ITEM, 'controls_repeat_ext'] },
  { title: 'ステージ3　とびらが 2つ',
    en: { title: 'Stage 3: Two doors', text: 'Keys and doors are in a row. Find the set of moves that repeats and use "repeat".', hint: 'Repeat 2 times: forward → pick up key → open door → forward. Then turn right and move forward.' },
    text: 'かぎと とびらが ならんでいるよ。おなじ うごきの セットを みつけて「くりかえす」で まとめよう。',
    hint: '「すすむ → かぎを ひろう → とびらを あける → すすむ」を 2かい。さいごに みぎを むいて すすむ。',
    map: ['SKDKD', '####G', '#####', '#####', '#####'], dir: 1, blocks: [...MOVE, ...ITEM, 'controls_repeat_ext'], limit: 7 },
  { title: 'ステージ4　じぶんで かんがえる たんけんか',
    en: { title: 'Stage 4: A thinking explorer', text: 'Use "repeat until goal" and "if". Make a program that picks up a key when it finds one and opens a door when there is one.', hint: 'Inside the loop: if key here → pick up key; if door in front → open door; if front is open → forward, else → turn right.' },
    text: '「ゴールに つくまで くりかえす」と「もし 〜なら」で、かぎを みつけたら ひろい、とびらが あったら あける プログラムに しよう。',
    hint: 'くりかえしの なかで：もし ここに かぎが ある なら ひろう → もし まえが とびら なら あける → もし まえが あいていたら すすむ、そうでなければ みぎを むく',
    map: ['SK.D.', '####.', '..G#K', '.###.', '.D.K.'], dir: 1, blocks: ALL, limit: 8 }
];
const A = (() => {
  const chain = (list) => list.reduceRight((next, b) => next ? { ...b, next: { block: next } } : b, null);
  return {
    f: () => ({ type: 'maze_forward' }), r: () => ({ type: 'maze_right' }), l: () => ({ type: 'maze_left' }),
    pick: () => ({ type: 'key_pick' }), open: () => ({ type: 'door_open' }),
    repeat: (n, body) => ({ type: 'controls_repeat_ext',
      inputs: { TIMES: { shadow: { type: 'math_number', fields: { NUM: n } } }, DO: { block: chain(body) } } }),
    untilGoal: (body) => ({ type: 'maze_until_goal', inputs: { DO: { block: chain(body) } } }),
    ifElse: (dir, yes, no) => ({ type: 'maze_ifelse', fields: { DIR: dir }, inputs: { DO: { block: chain(yes) }, ELSE: { block: chain(no) } } }),
    ifThing: (w, yes) => ({ type: 'key_if', fields: { WHAT: w }, inputs: { DO: { block: chain(yes) } } }),
    program: (body) => ({ blocks: { languageVersion: 0, blocks: [{ ...chain(body), x: 30, y: 30 }] } })
  };
})();
{
const f = A.f, r = A.r, pick = A.pick, open = A.open;
const ANSWER_BLOCKS = [
  A.program([f(), f(), pick(), open(), f(), f()]),
  A.program([f(), f(), r(), f(), f(), r(), f(), f(), pick(), r(), r(), f(), f(), open(), f(), f()]),
  A.program([A.repeat(2, [f(), pick(), open(), f()]), r(), f()]),
  A.program([A.untilGoal([A.ifThing('KEY', [pick()]), A.ifThing('DOOR', [open()]), A.ifElse('F', [f()], [r()])])])
];
LEVELS.forEach((lv, i) => { lv.answer = ANSWER_BLOCKS[i]; });
}
/*@@ WORLD */
/* ========== 5. めいろ（かぎと とびら） ========== */
let N = 5, CELL = 80;
const DR = [-1, 0, 1, 0], DC = [0, 1, 0, -1];   // 0:うえ 1:みぎ 2:した 3:ひだり
let rocks = [], START = { r: 0, c: 0, dir: 1 }, GOAL = { r: 4, c: 4 };
let KEYS = new Set(), DOORS = new Set();          // 'r,c' の かたちで おぼえる
let world = { keys: 0, taken: [], opened: [] };   // え に だす いまの ようす
const P = (r, c) => r + ',' + c;

function inside(r, c) { return r >= 0 && r < N && c >= 0 && c < N; }
function free(r, c)   { return inside(r, c) && !rocks[r][c]; }

function loadMap(map, dir) {
  N = map.length; CELL = 16 * Math.floor(400 / (N * 16)); PX = CELL / 16;
  const cv = document.getElementById('board'); cv.width = cv.height = N * CELL; ctx.imageSmoothingEnabled = false;
  KEYS = new Set(); DOORS = new Set();
  rocks = map.map((row, r) => [...row].map((ch, c) => {
    if (ch === 'S') START = { r, c, dir };
    if (ch === 'G') GOAL = { r, c };
    if (ch === 'K') KEYS.add(P(r, c));
    if (ch === 'D') DOORS.add(P(r, c));
    return ch === '#';
  }));
}
function resetWorld() { world = { keys: 0, taken: [], opened: [] }; }
function onFrame(f) {
  world = f.world;
  if (f.event === 'pick') Sound.pick();
  if (f.event === 'open') Sound.open();
}
// ランダムな めいろは つかわない（ステージだけ）
function solvable() { return true; }
function randomRocks() { return rocks; }
function setRandomMaze() { resetRobot(); }

/* ========== 6. プログラムを しらべて、うごきの きろくを つくる ========== */
const MAX_MOVES = 300, MAX_LOOPS = 1000;
class Stop { constructor(kind, text, why) { this.kind = kind; this.text = text; this.why = why; } }

function simulate(code) {
  const s = { ...START };
  const frames = [];
  let blockId = null, loops = 0, keys = 0;
  const taken = new Set(), opened = new Set();
  const isKey  = (r, c) => KEYS.has(P(r, c)) && !taken.has(P(r, c));
  const isDoor = (r, c) => DOORS.has(P(r, c)) && !opened.has(P(r, c));
  const front = (d) => { const dd = (s.dir + (d || 0)) % 4; return [s.r + DR[dd], s.c + DC[dd]]; };
  const rec = (event) => {
    frames.push({ r: s.r, c: s.c, dir: s.dir, id: blockId, event, world: { keys, taken: [...taken], opened: [...opened] } });
    if (frames.length > MAX_MOVES) throw new Stop('ng', t('tooManyMoves', MAX_MOVES));
  };
  const api = {
    highlight: (id) => { blockId = id; },
    forward: () => {
      const [nr, nc] = front();
      if (!free(nr, nc)) { rec('crash'); throw new Stop('ng', t('crash'), 'crash'); }
      if (isDoor(nr, nc)) { rec('crash'); throw new Stop('ng', keys ? t('doorBump') : t('doorLocked'), 'crash'); }
      s.r = nr; s.c = nc; rec('move');
      if (s.r === GOAL.r && s.c === GOAL.c) throw new Stop('ok', 'goal');
    },
    turnRight: () => { s.dir = (s.dir + 1) % 4; rec('turn'); },
    turnLeft:  () => { s.dir = (s.dir + 3) % 4; rec('turn'); },
    pickKey: () => {
      if (!isKey(s.r, s.c)) throw new Stop('ng', t('noKeyHere'));
      taken.add(P(s.r, s.c)); keys++; rec('pick');
    },
    openDoor: () => {
      const [nr, nc] = front();
      if (!isDoor(nr, nc)) throw new Stop('ng', t('noDoor'));
      if (!keys) throw new Stop('ng', t('needKey'));
      keys--; opened.add(P(nr, nc)); rec('open');
    },
    isOpen: (which) => { const [nr, nc] = front({ F: 0, R: 1, L: 3 }[which]); return free(nr, nc) && !isDoor(nr, nc); },
    check: (what) => {
      if (what === 'KEY') return isKey(s.r, s.c);
      const [nr, nc] = front(); return isDoor(nr, nc);
    },
    atGoal: () => s.r === GOAL.r && s.c === GOAL.c,
    loopGuard: () => { if (++loops > MAX_LOOPS) throw new Stop('ng', t('endless')); }
  };
  let result;
  try {
    new Function(...Object.keys(api), code)(...Object.values(api));
    result = new Stop('ng', t('noGoal'));
  } catch (e) {
    result = e instanceof Stop ? e : new Stop('ng', '⚠ ' + e.message);
  }
  return { frames, result };
}
/*@@ DRAW */
// かぎ・とびらの ドット絵
const KEY_ART = [
  '................', '................', '.....yyyy.......', '....yYYYYy......', '...yYy..yYy.....', '...yYy..yYy.....',
  '....yYYYYy......', '.....yYYy.......', '......yYy.......', '......yYyyy.....', '......yYYYy.....', '......yYyy......',
  '......yYYy......', '......yyyy......', '................', '................'];
function keyTile(x, y) {
  const col = { Y: '#ffd43b', y: '#8a6a00' };
  KEY_ART.forEach((row, py) => [...row].forEach((ch, px) => { if (col[ch]) dot(x, y, px, py, col[ch]); }));
}
function doorTile(x, y, r, c, open) {
  if (open) {   // あいた とびら：りょうがわに はしらだけ
    dirtTile(x, y, r, c);
    for (let py = 0; py < 16; py++) { dot(x, y, 0, py, '#4a2e12'); dot(x, y, 1, py, '#8b5a2b'); dot(x, y, 14, py, '#8b5a2b'); dot(x, y, 15, py, '#4a2e12'); }
    return;
  }
  noiseTile(x, y, r, c, 5, ['#8b5a2b', '#7a4e25', '#966434']);
  for (let i = 0; i < 16; i++) { dot(x, y, i, 0, '#4a2e12'); dot(x, y, i, 15, '#4a2e12'); dot(x, y, 0, i, '#4a2e12'); dot(x, y, 15, i, '#4a2e12'); dot(x, y, 8, i, '#5e3b1a'); }
  for (let i = 1; i < 15; i++) { dot(x, y, i, 5, '#5e3b1a'); dot(x, y, i, 10, '#5e3b1a'); }
  for (let py = 7; py <= 9; py++) { dot(x, y, 11, py, '#ffd43b'); dot(x, y, 12, py, '#ffd43b'); }
  dot(x, y, 11, 10, '#222222');
}

function draw() {
  const W = N * CELL;
  ctx.clearRect(0, 0, W, W);
  const walked = new Set(trail.map(([r, c]) => r + ',' + c));
  const taken = new Set(world.taken), opened = new Set(world.opened);
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const x = c * CELL, y = r * CELL;
    if (rocks[r][c]) stoneTile(x, y, r, c);
    else if (r === GOAL.r && c === GOAL.c) diamondTile(x, y, r, c);
    else if (r === START.r && c === START.c) plankTile(x, y, r, c);
    else if (DOORS.has(P(r, c))) doorTile(x, y, r, c, opened.has(P(r, c)));
    else if (walked.has(r + ',' + c)) dirtTile(x, y, r, c);
    else grassTile(x, y, r, c);
    if (KEYS.has(P(r, c)) && !taken.has(P(r, c))) keyTile(x, y);
  }
  ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 1;
  for (let i = 1; i < N; i++) {
    ctx.beginPath(); ctx.moveTo(i * CELL + .5, 0); ctx.lineTo(i * CELL + .5, W); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * CELL + .5); ctx.lineTo(W, i * CELL + .5); ctx.stroke();
  }
  drawHero();
  // もちもの（ばんめんの うえの ぎょう）
  const sr = document.getElementById('statusRow');
  if (sr) sr.textContent = (LANG === 'en' ? 'Items: 🔑 × ' : 'もちもの：🔑 × ') + world.keys;
}
/*@@ SOUND */
  pick() { this.notes([[988, 0, .08], [1319, .08, .18]], 'square', 0.5); },              // ちゃりん
  open() { this.tone('sawtooth', 180, 120, 0.25, 0, 0.35); this.notes([[523, .2, .1], [784, .3, .2]], 'triangle', 0.6); },   // ぎぃ…がちゃ
