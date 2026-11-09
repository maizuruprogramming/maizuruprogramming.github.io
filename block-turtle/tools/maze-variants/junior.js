/*@@ STR */
const EXTRA = {
  ja: {
    bUp: 'うえへ ⬆', bDown: 'したへ ⬇', bLeftA: 'ひだりへ ⬅', bRightA: 'みぎへ ➡',
    crash: '🌿 くさむらに ぶつかったよ。やじるしを なおそう', noGoal: 'ダイヤまで とどかなかったよ。やじるしを たそう'
  },
  en: {
    bUp: 'up ⬆', bDown: 'down ⬇', bLeftA: 'left ⬅', bRightA: 'right ➡',
    crash: '🌿 Bump into the bushes! Fix your arrows.', noGoal: 'Not at the diamond yet. Add more arrows.'
  }
};
/*@@ BLOCKS */
/* ========== 1. オリジナルのブロック（やじるし：むきを かんがえずに うえ・した・ひだり・みぎへ 1マス） ========== */
Blockly.common.defineBlocksWithJsonArray([
  { type: 'jr_up',    message0: t('bUp'),     previousStatement: null, nextStatement: null, colour: '#3c5aa6' },
  { type: 'jr_down',  message0: t('bDown'),   previousStatement: null, nextStatement: null, colour: '#2e7d32' },
  { type: 'jr_left',  message0: t('bLeftA'),  previousStatement: null, nextStatement: null, colour: '#8e44ad' },
  { type: 'jr_right', message0: t('bRightA'), previousStatement: null, nextStatement: null, colour: '#c0631a' }
]);

/* ========== 2. ブロック → JavaScript ========== */
const gen = javascript.javascriptGenerator;
gen.STATEMENT_PREFIX = 'highlight(%1);\n';
gen.addReservedWords('highlight');
gen.forBlock['jr_up']    = () => 'go(0);\n';
gen.forBlock['jr_right'] = () => 'go(1);\n';
gen.forBlock['jr_down']  = () => 'go(2);\n';
gen.forBlock['jr_left']  = () => 'go(3);\n';

/* ========== 3. ステージ（ちいさな めいろ） ==========
   map の きごう：S=スタート  G=ゴール（ダイヤ）  #=くさむら（かべ）  .=みち */
const ARROWS = ['jr_up', 'jr_down', 'jr_left', 'jr_right'];
const ALL = [...ARROWS, 'controls_repeat_ext'];

const LEVELS = [
  { title: 'ステージ1　みぎへ すすもう',
    en: { title: 'Stage 1: Go right', text: 'Stack three "right ➡" arrows and go to the diamond 💎.', hint: 'The diamond is 3 squares away.' },
    text: '「みぎへ ➡」を 3つ つなげて、ダイヤ 💎 まで いこう。',
    hint: 'ダイヤまで 3マス だよ。',
    map: ['####', 'S..G', '####', '####'], dir: 1, blocks: ['jr_right'] },
  { title: 'ステージ2　したへ まがろう',
    en: { title: 'Stage 2: Go down', text: 'Use "right ➡" and "down ⬇".', hint: 'right, then down 3 times, then right 2 times.' },
    text: '「みぎへ ➡」と「したへ ⬇」を つかおう。',
    hint: 'みぎへ 1つ、したへ 3つ、みぎへ 2つ。',
    map: ['S.##', '#.##', '#.##', '#..G'], dir: 1, blocks: ['jr_right', 'jr_down'] },
  { title: 'ステージ3　かいだん',
    en: { title: 'Stage 3: Stairs', text: 'Right and down, one after the other.', hint: 'right, down, right, down, right, down' },
    text: 'みぎ と した を じゅんばんに。',
    hint: 'みぎ → した → みぎ → した → みぎ → した',
    map: ['S.##', '#..#', '##..', '###G'], dir: 1, blocks: ['jr_right', 'jr_down'] },
  { title: 'ステージ4　うえへ のぼろう',
    en: { title: 'Stage 4: Go up', text: 'Now use "up ⬆" too.', hint: 'up 3 times, then right 3 times.' },
    text: 'こんどは「うえへ ⬆」も つかうよ。',
    hint: 'うえへ 3つ、みぎへ 3つ。',
    map: ['...G', '.###', '.###', 'S###'], dir: 0, blocks: ARROWS },
  { title: 'ステージ5　ぐるっと まわろう',
    en: { title: 'Stage 5: Go around', text: 'Use all four arrows.', hint: 'right 2, down 2, left 2.' },
    text: '4つの やじるしを ぜんぶ つかおう。',
    hint: 'みぎへ 2つ、したへ 2つ、ひだりへ 2つ。',
    map: ['S..#', '##.#', 'G..#', '####'], dir: 1, blocks: ARROWS },
  { title: 'ステージ6　くりかえしを つかおう',
    en: { title: 'Stage 6: Use repeat', text: 'A long staircase! Put "right ➡ down ⬇" inside "repeat".', hint: 'repeat 4 times: right, down' },
    text: 'ながい かいだん！「みぎへ ➡ したへ ⬇」を「くりかえす」の なかに いれよう。',
    hint: '「4かい くりかえす」の なかに「みぎへ」「したへ」。',
    map: ['S.###', '#..##', '##..#', '###..', '####G'], dir: 1, blocks: ALL, limit: 3 }
];
const A = (() => {
  const chain = (list) => list.reduceRight((next, b) => next ? { ...b, next: { block: next } } : b, null);
  return {
    u: () => ({ type: 'jr_up' }), d: () => ({ type: 'jr_down' }), l: () => ({ type: 'jr_left' }), r: () => ({ type: 'jr_right' }),
    repeat: (n, body) => ({ type: 'controls_repeat_ext',
      inputs: { TIMES: { shadow: { type: 'math_number', fields: { NUM: n } } }, DO: { block: chain(body) } } }),
    program: (body) => ({ blocks: { languageVersion: 0, blocks: [{ ...chain(body), x: 30, y: 30 }] } })
  };
})();
{
const u = A.u, d = A.d, l = A.l, r = A.r;
const ANSWER_BLOCKS = [
  A.program([r(), r(), r()]),
  A.program([r(), d(), d(), d(), r(), r()]),
  A.program([r(), d(), r(), d(), r(), d()]),
  A.program([u(), u(), u(), r(), r(), r()]),
  A.program([r(), r(), d(), d(), l(), l()]),
  A.program([A.repeat(4, [r(), d()])])
];
LEVELS.forEach((lv, i) => { lv.answer = ANSWER_BLOCKS[i]; });
}
/*@@ SCALE */
1.4
/*@@ WORLD */
/* ========== 5. めいろ（ちいさい・やじるし） ========== */
let N = 4, CELL = 96;
const DR = [-1, 0, 1, 0], DC = [0, 1, 0, -1];   // 0:うえ 1:みぎ 2:した 3:ひだり
let rocks = [], START = { r: 0, c: 0, dir: 1 }, GOAL = { r: 3, c: 3 };

function inside(r, c) { return r >= 0 && r < N && c >= 0 && c < N; }
function free(r, c)   { return inside(r, c) && !rocks[r][c]; }

function loadMap(map, dir) {
  N = map.length; CELL = 16 * Math.floor(400 / (N * 16)); PX = CELL / 16;
  const cv = document.getElementById('board'); cv.width = cv.height = N * CELL; ctx.imageSmoothingEnabled = false;
  rocks = map.map((row, r) => [...row].map((ch, c) => {
    if (ch === 'S') START = { r, c, dir };
    if (ch === 'G') GOAL = { r, c };
    return ch === '#';
  }));
}
function resetWorld() {}
function onFrame() {}
function solvable() { return true; }
function randomRocks() { return rocks; }
function setRandomMaze() { resetRobot(); }

/* ========== 6. プログラムを しらべて、うごきの きろくを つくる ========== */
const MAX_MOVES = 100, MAX_LOOPS = 1000;
class Stop { constructor(kind, text, why) { this.kind = kind; this.text = text; this.why = why; } }

function simulate(code) {
  const s = { ...START };
  const frames = [];
  let blockId = null, loops = 0;
  const rec = (event) => {
    frames.push({ r: s.r, c: s.c, dir: s.dir, id: blockId, event });
    if (frames.length > MAX_MOVES) throw new Stop('ng', t('tooManyMoves', MAX_MOVES));
  };
  const api = {
    highlight: (id) => { blockId = id; },
    go: (d) => {   // その むきを むいて 1マス すすむ（むきを かえる だけの コマは つくらない）
      s.dir = d;
      const nr = s.r + DR[d], nc = s.c + DC[d];
      if (!free(nr, nc)) { rec('crash'); throw new Stop('ng', t('crash'), 'crash'); }
      s.r = nr; s.c = nc; rec('move');
      if (s.r === GOAL.r && s.c === GOAL.c) throw new Stop('ok', 'goal');
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
// かべは くさの しげみ（こわく ない ように いわでは なく くさ）
function bushTile(x, y, r, c) {
  noiseTile(x, y, r, c, 6, ['#3f8a2a', '#4e9a2f', '#35781f', '#4e9a2f']);
  [[2, 3], [7, 2], [11, 5], [4, 9], [9, 11], [13, 12]].forEach(([px, py]) => {
    dot(x, y, px, py, '#7fd055'); dot(x, y, px + 1, py, '#7fd055'); dot(x, y, px, py + 1, '#2a5e18');
  });
}
function draw() {
  const W = N * CELL;
  ctx.clearRect(0, 0, W, W);
  const walked = new Set(trail.map(([r, c]) => r + ',' + c));
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const x = c * CELL, y = r * CELL;
    if (rocks[r][c]) bushTile(x, y, r, c);
    else if (r === GOAL.r && c === GOAL.c) { plankTile(x, y, r, c); const col = { D: '#4ee8e0', d: '#d3fffb', k: '#1b9e98' };
      GEM.forEach((row, py) => [...row].forEach((ch, px) => { if (col[ch]) dot(x, y, px, py, col[ch]); })); }
    else if (r === START.r && c === START.c) plankTile(x, y, r, c);
    else if (walked.has(r + ',' + c)) dirtTile(x, y, r, c);
    else plankTile(x, y, r, c);
  }
  ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 2;
  for (let i = 1; i < N; i++) {
    ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, W); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(W, i * CELL); ctx.stroke();
  }
  drawHero();
}
/*@@ SOUND */
