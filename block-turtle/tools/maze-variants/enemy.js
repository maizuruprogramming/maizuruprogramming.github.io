/*@@ STR */
const EXTRA = {
  ja: {
    bWait: 'まつ（1かい）⏳', bDanger: 'もし まえが あぶなかったら', bElse2: 'そうでなければ',
    caught: '👾 スライムに つかまっちゃった！ まって タイミングを あわせよう', turns: (n) => ` ／ ターン：${n}`
  },
  en: {
    bWait: 'wait (1 turn) ⏳', bDanger: 'if danger ahead', bElse2: 'else',
    caught: '👾 The slime caught you! Wait and time your move.', turns: (n) => ` / Turns: ${n}`
  }
};
/*@@ BLOCKS */
/* ========== 1. オリジナルのブロック（めいろ ＋ まつ・あぶない） ========== */
const DIRS = [[t('dirF'), 'F'], [t('dirR'), 'R'], [t('dirL'), 'L']];

Blockly.common.defineBlocksWithJsonArray([
  { type: 'maze_forward', message0: t('bForward'), previousStatement: null, nextStatement: null, colour: '#4f8f2f' },
  { type: 'maze_right', message0: t('bRight'), previousStatement: null, nextStatement: null, colour: '#4f8f2f' },
  { type: 'maze_left', message0: t('bLeft'), previousStatement: null, nextStatement: null, colour: '#4f8f2f' },
  { type: 'maze_wait', message0: t('bWait'), previousStatement: null, nextStatement: null, colour: '#c0631a' },
  { type: 'maze_until_goal', message0: t('bUntilGoal'),
    message1: '%1', args1: [{ type: 'input_statement', name: 'DO' }],
    previousStatement: null, nextStatement: null, colour: '#8b5a2b' },
  { type: 'maze_ifelse', message0: t('bIf'),
    args0: [{ type: 'field_dropdown', name: 'DIR', options: DIRS }],
    message1: '%1', args1: [{ type: 'input_statement', name: 'DO' }],
    message2: t('bElse'), args2: [{ type: 'input_statement', name: 'ELSE' }],
    previousStatement: null, nextStatement: null, colour: '#3c5aa6' },
  { type: 'enemy_ifelse', message0: t('bDanger'),
    message1: '%1', args1: [{ type: 'input_statement', name: 'DO' }],
    message2: t('bElse2') + ' %1', args2: [{ type: 'input_statement', name: 'ELSE' }],
    previousStatement: null, nextStatement: null, colour: '#8e44ad' }
]);

/* ========== 2. ブロック → JavaScript ========== */
const gen = javascript.javascriptGenerator;
gen.STATEMENT_PREFIX = 'highlight(%1);\n';
gen.addReservedWords('highlight');
gen.forBlock['maze_forward'] = () => 'forward();\n';
gen.forBlock['maze_right']   = () => 'turnRight();\n';
gen.forBlock['maze_left']    = () => 'turnLeft();\n';
gen.forBlock['maze_wait']    = () => 'wait();\n';
gen.forBlock['maze_until_goal'] = (b, g) => `while (!atGoal()) {\n  loopGuard();\n${g.statementToCode(b, 'DO')}}\n`;
gen.forBlock['maze_ifelse'] = (b, g) =>
  `if (isOpen('${b.getFieldValue('DIR')}')) {\n${g.statementToCode(b, 'DO')}} else {\n${g.statementToCode(b, 'ELSE')}}\n`;
gen.forBlock['enemy_ifelse'] = (b, g) =>
  `if (danger()) {\n${g.statementToCode(b, 'DO')}} else {\n${g.statementToCode(b, 'ELSE')}}\n`;

/* ========== 3. ステージ ==========
   map の きごう：S=スタート  G=ゴール  #=いわ  .=みち
                  E=スライムの はじめの ばしょ  e=スライムが とおる みち（たて か よこ に いったり きたり）
   スライムは たんけんかが 1かい うごく（すすむ・むく・まつ）たびに 1マス うごく */
const MOVE = ['maze_forward', 'maze_right', 'maze_left'];
const ALL  = [...MOVE, 'maze_wait', 'controls_repeat_ext', 'maze_until_goal', 'maze_ifelse', 'enemy_ifelse'];

const LEVELS = [
  { title: 'ステージ1　まって よけよう',
    en: { title: 'Stage 1: Wait and dodge', text: 'The slime goes up and down. Use "wait" to time your move so you do not bump into it.', hint: 'Move 1 square, then wait 2 times until the slime passes. Then move 3 squares.' },
    text: 'スライムが うえと したに いったり きたり しているよ。ぶつからないように「まつ」で タイミングを あわせよう。',
    hint: '1マス すすんだら、スライムが とおりすぎるまで 2かい まつ。それから 3マス すすもう。',
    map: ['##E##', '##e##', 'S.e.G', '##e##', '##e##'], dir: 1, blocks: ['maze_forward', 'maze_wait'] },
  { title: 'ステージ2　あぶなかったら まつ',
    en: { title: 'Stage 2: Wait if it is dangerous', text: 'Use "if danger ahead". It is dangerous when a slime is in front of you, or will move in front of you next.', hint: 'Repeat until goal: if danger ahead → wait, else → move forward.' },
    text: '「もし まえが あぶなかったら」を つかおう。スライムが まえに いる ときや、つぎに まえに くる ときは「あぶない」だよ。',
    hint: 'ゴールに つくまで くりかえす：もし まえが あぶなかったら まつ、そうでなければ すすむ',
    map: ['##E#e##', '##e#e##', '##e#e##', 'S.e.e.G', '##e#e##', '##e#E##', '##e#e##'], dir: 1,
    blocks: ['maze_forward', 'maze_wait', 'maze_until_goal', 'enemy_ifelse'], limit: 4 },
  { title: 'ステージ3　おおきな めいろ',
    en: { title: 'Stage 3: A bigger maze', text: 'The maze is bigger. If it is dangerous, wait. If not: move forward when the front is open, turn right when it is blocked.', hint: 'Repeat until goal: if danger ahead → wait, else → (if front is open → forward, else → turn right).' },
    text: 'めいろが おおきく なったよ。あぶなかったら まつ。そうでなければ、まえが あいていたら すすむ、ふさがっていたら みぎを むく。',
    hint: 'ゴールに つくまで くりかえす：もし まえが あぶなかったら まつ、そうでなければ（もし まえが あいていたら すすむ、そうでなければ みぎを むく）',
    map: ['S..e....', '###e###.', '###e###.', '###E###.', '####Eeee', '#######.', '#######.', '#######G'], dir: 1, blocks: ALL, limit: 6 },
  { title: 'ステージ4　うずまきの めいろ',
    en: { title: 'Stage 4: The spiral maze', text: 'Last one: a 10×10 spiral with three slimes. Can the program from Stage 3 reach the goal?', hint: 'Use the same program as Stage 3. The slimes cross the path, so check for danger every time.' },
    text: 'さいごは 10×10 の うずまき。スライムが 3びき いるよ。ステージ3の プログラムで ゴール できるかな？',
    hint: 'ステージ3と おなじ プログラムで いけるよ。スライムは みちを よこぎるので、まいかい「あぶない」を しらべよう。',
    map: ['S...e.....', '####E####.', '....e...#.', '.######.#.', '.#...G#.#.', '.#.####eEe', '.#.####.#.', '.#...e..#.', '.####e###.', '.....E....'], dir: 1, blocks: ALL, limit: 6 }
];
const A = (() => {
  const chain = (list) => list.reduceRight((next, b) => next ? { ...b, next: { block: next } } : b, null);
  return {
    f: () => ({ type: 'maze_forward' }), r: () => ({ type: 'maze_right' }), w: () => ({ type: 'maze_wait' }),
    untilGoal: (body) => ({ type: 'maze_until_goal', inputs: { DO: { block: chain(body) } } }),
    ifElse: (dir, yes, no) => ({ type: 'maze_ifelse', fields: { DIR: dir }, inputs: { DO: { block: chain(yes) }, ELSE: { block: chain(no) } } }),
    danger: (yes, no) => ({ type: 'enemy_ifelse', inputs: { DO: { block: chain(yes) }, ELSE: { block: chain(no) } } }),
    program: (body) => ({ blocks: { languageVersion: 0, blocks: [{ ...chain(body), x: 30, y: 30 }] } })
  };
})();
{
const f = A.f, r = A.r, w = A.w;
const SMART = [A.untilGoal([A.danger([w()], [A.ifElse('F', [f()], [r()])])])];
const ANSWER_BLOCKS = [
  A.program([f(), w(), w(), f(), f(), f()]),
  A.program([A.untilGoal([A.danger([w()], [f()])])]),
  A.program(SMART),
  A.program(SMART)
];
LEVELS.forEach((lv, i) => { lv.answer = ANSWER_BLOCKS[i]; });
}
/*@@ WORLD */
/* ========== 5. めいろ（うごく てき） ========== */
let N = 5, CELL = 80;
const DR = [-1, 0, 1, 0], DC = [0, 1, 0, -1];   // 0:うえ 1:みぎ 2:した 3:ひだり
let rocks = [], START = { r: 0, c: 0, dir: 1 }, GOAL = { r: 4, c: 4 };
let ENEMIES = [];                       // { path: [[r,c],...], idx, step }
let world = { foes: [], turn: 0 };      // え に だす いまの ようす

function inside(r, c) { return r >= 0 && r < N && c >= 0 && c < N; }
function free(r, c)   { return inside(r, c) && !rocks[r][c]; }

function loadMap(map, dir) {
  N = map.length; CELL = 16 * Math.floor(400 / (N * 16)); PX = CELL / 16;
  const cv = document.getElementById('board'); cv.width = cv.height = N * CELL; ctx.imageSmoothingEnabled = false;
  const isE = (r, c) => inside(r, c) && (map[r][c] === 'e' || map[r][c] === 'E');
  ENEMIES = [];
  rocks = map.map((row, r) => [...row].map((ch, c) => {
    if (ch === 'S') START = { r, c, dir };
    if (ch === 'G') GOAL = { r, c };
    return ch === '#';
  }));
  // E から よこ（なければ たて）に つづく e を スライムの みちに する
  map.forEach((row, r) => [...row].forEach((ch, c) => {
    if (ch !== 'E') return;
    let path = [];
    let c0 = c; while (isE(r, c0 - 1)) c0--;
    let c1 = c; while (isE(r, c1 + 1)) c1++;
    if (c1 > c0) for (let k = c0; k <= c1; k++) path.push([r, k]);
    else {
      let r0 = r; while (isE(r0 - 1, c)) r0--;
      let r1 = r; while (isE(r1 + 1, c)) r1++;
      for (let k = r0; k <= r1; k++) path.push([k, c]);
    }
    ENEMIES.push({ path, idx: path.findIndex(([pr, pc]) => pr === r && pc === c), step: 1 });
  }));
}
function foesNow(es) { return es.map((e) => e.path[e.idx]); }
function resetWorld() { world = { foes: foesNow(ENEMIES), turn: 0 }; }
function onFrame(f) {
  world = f.world;
  if (f.event === 'wait') Sound.wait();
}
function solvable() { return true; }
function randomRocks() { return rocks; }
function setRandomMaze() { resetRobot(); }

/* ========== 6. プログラムを しらべて、うごきの きろくを つくる ========== */
const MAX_MOVES = 500, MAX_LOOPS = 2000;
class Stop { constructor(kind, text, why) { this.kind = kind; this.text = text; this.why = why; } }

// スライムの つぎの ばしょ（はしに ついたら ひきかえす）
function nextIdx(e) {
  if (e.path.length < 2) return { idx: e.idx, step: e.step };
  let step = e.step;
  if (e.idx + step < 0 || e.idx + step >= e.path.length) step = -step;
  return { idx: e.idx + step, step };
}

function simulate(code) {
  const s = { ...START };
  const frames = [];
  let blockId = null, loops = 0, turn = 0;
  const foes = ENEMIES.map((e) => ({ ...e }));
  const same = (a, b) => a[0] === b[0] && a[1] === b[1];
  const rec = (event) => {
    frames.push({ r: s.r, c: s.c, dir: s.dir, id: blockId, event, world: { foes: foesNow(foes), turn } });
    if (frames.length > MAX_MOVES) throw new Stop('ng', t('tooManyMoves', MAX_MOVES));
  };
  // たんけんかが 1かい うごいたら、スライムも 1マス うごく。かさなったら つかまる
  const tick = (from, event) => {
    turn++;
    const to = [s.r, s.c];
    let caught = false;
    foes.forEach((e) => {
      const before = e.path[e.idx];
      const n = nextIdx(e); e.idx = n.idx; e.step = n.step;
      const after = e.path[e.idx];
      if (same(after, to) || (same(before, to) && same(after, from))) caught = true;
    });
    rec(event);
    if (caught) { frames[frames.length - 1].event = 'crash'; throw new Stop('ng', t('caught'), 'crash'); }
  };
  const front = (d) => { const dd = (s.dir + (d || 0)) % 4; return [s.r + DR[dd], s.c + DC[dd]]; };
  const api = {
    highlight: (id) => { blockId = id; },
    forward: () => {
      const from = [s.r, s.c];
      const [nr, nc] = front();
      if (!free(nr, nc)) { rec('crash'); throw new Stop('ng', t('crash'), 'crash'); }
      s.r = nr; s.c = nc;
      tick(from, 'move');
      if (s.r === GOAL.r && s.c === GOAL.c) throw new Stop('ok', 'goal');
    },
    turnRight: () => { s.dir = (s.dir + 1) % 4; tick([s.r, s.c], 'turn'); },
    turnLeft:  () => { s.dir = (s.dir + 3) % 4; tick([s.r, s.c], 'turn'); },
    wait: () => { tick([s.r, s.c], 'wait'); },
    // まえの マスに スライムが いる か、つぎに くる なら「あぶない」
    danger: () => {
      const fr = front();
      return foes.some((e) => same(e.path[e.idx], fr) || same(e.path[nextIdx(e).idx], fr));
    },
    isOpen: (which) => { const [nr, nc] = front({ F: 0, R: 1, L: 3 }[which]); return free(nr, nc); },
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
// スライム（オリジナル）の ドット絵
const SLIME = [
  '................', '................', '................', '......PPPP......', '....PPpPPPPP....', '...PPppPPPPPP...',
  '..PPPpPPPPPPPP..', '..PPWWPPPPWWPP..', '..PPWKPPPPWKPP..', '.PPPPPPPPPPPPPP.', '.PPPPPPPPPPPPPP.', '.PPPPPkkkkPPPPP.',
  '.PPPPPPPPPPPPPP.', '..dddddddddddd..', '................', '................'];
function drawSlime(r, c) {
  const x = c * CELL, y = r * CELL;
  const col = { P: '#9b59b6', p: '#c39bd3', d: '#5e2a7a', W: '#ffffff', K: '#222222', k: '#5e2a7a' };
  SLIME.forEach((row, py) => [...row].forEach((ch, px) => { if (col[ch]) dot(x, y, px, py, col[ch]); }));
}

function draw() {
  const W = N * CELL;
  ctx.clearRect(0, 0, W, W);
  const walked = new Set(trail.map(([r, c]) => r + ',' + c));
  const patrol = new Set();
  ENEMIES.forEach((e) => e.path.forEach(([r, c]) => patrol.add(r + ',' + c)));
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const x = c * CELL, y = r * CELL;
    if (rocks[r][c]) stoneTile(x, y, r, c);
    else if (r === GOAL.r && c === GOAL.c) diamondTile(x, y, r, c);
    else if (r === START.r && c === START.c) plankTile(x, y, r, c);
    else if (walked.has(r + ',' + c)) dirtTile(x, y, r, c);
    else grassTile(x, y, r, c);
    if (patrol.has(r + ',' + c)) {   // スライムの とおりみち：むらさきの てん
      ctx.fillStyle = 'rgba(142,68,173,.55)';
      ctx.beginPath(); ctx.arc(x + CELL / 2, y + CELL / 2, CELL * 0.1, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 1;
  for (let i = 1; i < N; i++) {
    ctx.beginPath(); ctx.moveTo(i * CELL + .5, 0); ctx.lineTo(i * CELL + .5, W); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * CELL + .5); ctx.lineTo(W, i * CELL + .5); ctx.stroke();
  }
  drawHero();
  world.foes.forEach(([r, c]) => drawSlime(r, c));
  // ターン（ひだりうえ）
  ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(3, 3, CELL * 1.6, CELL * 0.45);
  ctx.fillStyle = '#ffffff'; ctx.font = Math.round(CELL * 0.28) + 'px DotGothic16, monospace'; ctx.textBaseline = 'middle';
  ctx.fillText((LANG === 'en' ? 'Turn ' : 'ターン ') + world.turn, 8, 3 + CELL * 0.23);
}
/*@@ SOUND */
  wait() { this.tone('triangle', 660, 660, 0.06, 0, 0.4); this.tone('triangle', 660, 660, 0.06, 0.12, 0.25); },   // ちっ ちっ
