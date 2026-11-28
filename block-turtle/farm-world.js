/* =====================================================================
   🌱 はたけの せかい（farm.html と python-farm.html で きょうつう）
   ---------------------------------------------------------------------
   さきに よういしておく もの：SAVE_KEY / store（ほぞん）
   この ファイルが つくる もの：
     STR / t / L        … ことば（にほんご ／ English）
     FARM               … ステージの はたけ（map・ゴール・かごの おおきさ）
     loadFarm(stage)    … はたけを よみこむ
     simulate(code)     … プログラムを うごかして、うごきの きろく（frames）と けっかを かえす
     draw() / Sound     … ドット絵・こうかおん
   はたけの きごう：S=スタート（くさ） .=くさ  s=つち  p=め（みずが まだ）  r=みが なっている
   なかで つかう じょうたい：e=たね  g=め（みずを やった）  q=め（あとから みずを やった）  x=とった あと
   ===================================================================== */

/* ========== 0. ことば ========== */
const STR = {
  ja: {
    appTitle: 'はたけで そだてよう', run: 'じっこう', reset: 'もどす', answer: 'こたえ', nextPerson: 'つぎの ひとへ',
    soundOn: 'おと：オン', soundOff: 'おと：オフ', hintBtn: '💡 ヒント', speed: 'はやさ',
    dlgTitle: '🌱 ステージ クリア！', dlgQuestion: 'つぎの ステージに いきますか？', yes: 'はい', no: 'いいえ',
    bForward: 'まえに すすむ', bRight: 'みぎを むく ↻', bLeft: 'ひだりを むく ↺',
    bPlant: '🌱 たねを まく', bWater: '💧 みずを やる', bHarvest: '🍅 みを とる',
    bIfRipe: 'もし ここに 🍅 みが なっていたら', bElse: 'でなければ',
    bSet: '🔢 とれた かず を %1 に する', bInc: '🔢 とれた かず を 1 ふやす',
    bWhile: '🔢 とれた かず が %1 より すくない あいだ くりかえす',
    bDef: '⭐ じぶんの ブロック「%1」を つくる', bCall: '⭐ じぶんの ブロック「%1」', defName: '1れつ うえる',
    tooManyMoves: (n) => `うごきが おおすぎるよ（${n}かいまで）`, endless: 'くりかえしが おわらないよ',
    outside: '🚧 はたけの そとには でられないよ',
    plantGrass: '🌿 ここは くさの マス。つちの マスに まこう', plantTwice: '🌱 ここには もう なにか うえて あるよ',
    waterNoSeed: '💧 たねが まだ ないよ。さきに たねを まこう', waterBad: '💧 ここには みずは いらないよ',
    notRipe: '🍅 ここには とれる みが ないよ', full: (n) => `🧺 かごが いっぱい！（${n}こまで）`,
    noDef: (n) => `⭐ じぶんの ブロック「${n}」が まだ ないよ。さきに つくろう`, dupDef: (n) => `⭐「${n}」という ブロックが 2つ あるよ`,
    deep: '⭐ じぶんの ブロックが じぶんを よびつづけて おわらないよ',
    grown: (a, n) => `🌱 せわを した マス：${a} / ${n}`, basket: (b, c) => `🧺 かご：${b}${c ? ' / ' + c : ''}`, varShow: (v) => `🔢 とれた かず ＝ ${v}`,
    left: (n) => `まだ せわを して いない マスが ${n}こ あるよ`, notFive: (b, c) => `かごに ${b}こ。ちょうど ${c}こ とったら クリアだよ`,
    testPartial: (ok, n) => `この はたけは クリア！ でも テストは ${n}こ中 ${ok}こ。どんな はたけでも ${5}こで とまる くふうを しよう`,
    grand: '🏆 どの はたけでも ちょうど 5こ！ はたけ マスター！',
    limit: (n) => `🎯 めやす：ブロック ${n}こ いないで クリア`,
    used: (n) => `つかった ブロック：${n}こ`, moves: (n) => ` ／ うごいた かず：${n}かい`,
    overLimit: (n, lim) => `クリア！ でも ブロックが ${n}こ。${lim}こ いかに できるかな？`,
    stageClear: '🌱 ステージ クリア！', retry: 'もういちど ちょうせん！ ブロックを なおして ▶ じっこう してね',
    armedItem: 'もういちど おすと リセット', armedMsg: '⚠ もういちど「つぎの ひとへ」を おすと、ぜんぶ リセットするよ',
    certItem: 'しゅうりょうしょうを みる', resetDone: '✨ リセットしたよ。つぎの ひと、がんばってね！', answerLoaded: '📖 こたえを よみこんだよ。▶ じっこう で たしかめよう'
  },
  en: {
    appTitle: 'Block Farm', run: 'Run', reset: 'Restart', answer: 'Answer', nextPerson: 'Next player',
    soundOn: 'Sound: On', soundOff: 'Sound: Off', hintBtn: '💡 Hint', speed: 'Speed',
    dlgTitle: '🌱 Stage clear!', dlgQuestion: 'Go to the next stage?', yes: 'Yes', no: 'No',
    bForward: 'move forward', bRight: 'turn right ↻', bLeft: 'turn left ↺',
    bPlant: '🌱 plant a seed', bWater: '💧 water', bHarvest: '🍅 harvest',
    bIfRipe: 'if a 🍅 is ripe here', bElse: 'else',
    bSet: '🔢 set harvested to %1', bInc: '🔢 add 1 to harvested',
    bWhile: '🔢 repeat while harvested is less than %1',
    bDef: '⭐ make my block “%1”', bCall: '⭐ my block “%1”', defName: 'plant a row',
    tooManyMoves: (n) => `Too many moves (max ${n})`, endless: 'The loop never ends!',
    outside: '🚧 You can’t leave the farm.',
    plantGrass: '🌿 This is grass. Plant on a soil square.', plantTwice: '🌱 Something is already planted here.',
    waterNoSeed: '💧 There is no seed yet. Plant a seed first.', waterBad: '💧 This square doesn’t need water.',
    notRipe: '🍅 There is nothing ripe to harvest here.', full: (n) => `🧺 The basket is full! (max ${n})`,
    noDef: (n) => `⭐ There is no block called “${n}” yet. Make it first.`, dupDef: (n) => `⭐ There are two blocks called “${n}”.`,
    deep: '⭐ Your block keeps calling itself and never ends.',
    grown: (a, n) => `🌱 Squares cared for: ${a} / ${n}`, basket: (b, c) => `🧺 Basket: ${b}${c ? ' / ' + c : ''}`, varShow: (v) => `🔢 harvested = ${v}`,
    left: (n) => `${n} square${n > 1 ? 's still need' : ' still needs'} care.`, notFive: (b, c) => `${b} in the basket. Harvest exactly ${c} to clear.`,
    testPartial: (ok, n) => `Cleared here! But only ${ok} of ${n} tests passed. Make it stop at exactly 5 on any farm.`,
    grand: '🏆 Exactly 5 on every farm! Farm master!',
    limit: (n) => `🎯 Target: clear with ${n} blocks or fewer`,
    used: (n) => `Blocks used: ${n}`, moves: (n) => ` / Moves: ${n}`,
    overLimit: (n, lim) => `Cleared! But you used ${n} blocks. Can you do it with ${lim} or fewer?`,
    stageClear: '🌱 Stage clear!', retry: 'Try again! Fix your blocks and press ▶ Run.',
    armedItem: 'Tap again to reset', armedMsg: '⚠ Tap "Next player" again to reset everything.',
    certItem: 'View certificate', resetDone: '✨ All reset. Good luck, next player!', answerLoaded: '📖 Answer loaded. Press ▶ Run to check it.'
  }
};
const t = makeT(STR);
const L = (item, k) => (LANG === 'en' && item.en && item.en[k] !== undefined) ? item.en[k] : item[k];
const COL = { move: '#2a7fbd', farm: '#3d8b2f', loop: '#b56d12', iff: '#1f7480', vari: '#b0402e', func: '#7a3fa8' };

/* ========== 1. ステージの はたけ（ブロック版と Python版で おなじ） ========== */
const G8 = '........';
const FARM = [
  { map: [G8, G8, G8, 'Ssss....', G8, G8, G8, G8], dir: 1, goal: 'seed' },
  { map: [G8, G8, G8, 'Ssss....', G8, G8, G8, G8], dir: 1, goal: 'grow' },
  { map: [G8, G8, G8, 'Sssssss.', G8, G8, G8, G8], dir: 1, goal: 'grow' },
  { map: [G8, G8, 'Sssss...', '.ssss...', G8, G8, G8, G8], dir: 1, goal: 'grow' },
  { map: [G8, G8, 'Sssss...', '.ssss...', '.ssss...', G8, G8, G8], dir: 1, goal: 'grow' },
  { map: [G8, G8, G8, 'Srprrpr.', G8, G8, G8, G8], dir: 1, goal: 'care' },
  { map: [G8, G8, G8, 'Srrprrrr', G8, G8, G8, G8], dir: 1, goal: 'count', cap: 5, mode: 'test' }
];
const TESTS = 20;
// ステージ7の テスト：みが なる ばしょが ちがう はたけ（7マス中 6〜7こ みが なっている）
function randomFarm() {
  const cells = Array(7).fill('r');
  if (Math.random() < 0.7) cells[Math.floor(Math.random() * 7)] = 'p';   // みどりは 0〜1こ（かならず 6こ いじょう とれる）
  return [G8, G8, G8, 'S' + cells.join(''), G8, G8, G8, G8];
}

/* ========== 2. はたけの じょうたい ========== */
const N = 8, CELL = 50;
const DR = [-1, 0, 1, 0], DC = [0, 1, 0, -1];   // 0:うえ 1:みぎ 2:した 3:ひだり
let ST = FARM[0], FMAP = FARM[0].map, START = { r: 3, c: 0, dir: 1 };
const key = (r, c) => r * N + c;
function inside(r, c) { return r >= 0 && r < N && c >= 0 && c < N; }
function startOf(map, dir) {
  for (let r = 0; r < N; r++) { const c = map[r].indexOf('S'); if (c >= 0) return { r, c, dir }; }
  return { r: 0, c: 0, dir };
}
function loadFarm(stage, map) { ST = stage; FMAP = map || stage.map; START = startOf(FMAP, stage.dir); }
const cellsOf = (map) => map.join('').replace('S', '.').split('');
// せわを する マスの かず（ゴールの もと）
function careTotal(map) { return cellsOf(map).filter((c) => c === 's' || c === 'p' || c === 'r').length; }
function careDone(orig, cur) {
  let n = 0;
  orig.forEach((o, k) => {
    const c = cur[k];
    if (o === 's' && (ST.goal === 'seed' ? c !== 's' : c === 'g')) n++;
    if (o === 'r' && c === 'x') n++;
    if (o === 'p' && c === 'q') n++;
  });
  return n;
}

/* ========== 3. プログラムを うごかして、うごきの きろくを つくる ========== */
const MAX_MOVES = 500, MAX_LOOPS = 3000;
class Stop { constructor(kind, text, why) { this.kind = kind; this.text = text; this.why = why; } }

function simulateOne(code, map) {
  const s = { ...startOf(map, ST.dir) };
  const orig = cellsOf(map), cells = orig.slice();
  const frames = [];
  const cap = ST.cap || 0;
  let blockId = null, loops = 0, basket = 0, v = 0, depth = 0;
  const defs = {};
  const rec = (event, extra) => {
    frames.push({ r: s.r, c: s.c, dir: s.dir, id: blockId, event, cells: cells.join(''), basket, v, ...extra });
    if (frames.length > MAX_MOVES) throw new Stop('ng', t('tooManyMoves', MAX_MOVES));
  };
  const here = () => key(s.r, s.c);
  const api = {
    highlight: (id) => { blockId = id; },
    forward: () => {
      const nr = s.r + DR[s.dir], nc = s.c + DC[s.dir];
      if (!inside(nr, nc)) { rec('bump'); throw new Stop('ng', t('outside'), 'crash'); }
      s.r = nr; s.c = nc; rec('move');
    },
    turnRight: () => { s.dir = (s.dir + 1) % 4; rec('turn'); },
    turnLeft:  () => { s.dir = (s.dir + 3) % 4; rec('turn'); },
    plant: () => {
      const c = cells[here()];
      if (c === '.') { rec('miss'); throw new Stop('ng', t('plantGrass'), 'miss'); }
      if (c !== 's') { rec('miss'); throw new Stop('ng', t('plantTwice'), 'miss'); }
      cells[here()] = 'e'; rec('plant');
    },
    water: () => {
      const c = cells[here()];
      if (c === 's') { rec('miss'); throw new Stop('ng', t('waterNoSeed'), 'miss'); }
      if (c === 'e') cells[here()] = 'g';
      else if (c === 'p') cells[here()] = 'q';
      else { rec('miss'); throw new Stop('ng', t('waterBad'), 'miss'); }
      rec('water');
    },
    harvest: () => {
      if (cells[here()] !== 'r') { rec('miss'); throw new Stop('ng', t('notRipe'), 'miss'); }
      if (cap && basket >= cap) { rec('miss'); throw new Stop('ng', t('full', cap), 'miss'); }
      cells[here()] = 'x'; basket++; rec('harvest');
    },
    isRipe: () => cells[here()] === 'r',
    setCount: (n) => { v = n; rec('var'); },
    incCount: () => { v++; rec('var'); },
    countLess: (n) => v < n,
    defBlock: (name, fn) => { if (defs[name]) throw new Stop('ng', t('dupDef', name)); defs[name] = fn; },
    callBlock: (name) => {
      if (!defs[name]) throw new Stop('ng', t('noDef', name));
      if (++depth > 30) throw new Stop('ng', t('deep'));
      try { defs[name](); } finally { depth--; }
    },
    loopGuard: () => { if (++loops > MAX_LOOPS) throw new Stop('ng', t('endless')); }
  };
  let result;
  try {
    new Function(...Object.keys(api), code)(...Object.values(api));
    if (ST.goal === 'count') result = basket === cap ? new Stop('ok', 'goal') : new Stop('ng', t('notFive', basket, cap));
    else {
      const leftN = careTotal(map) - careDone(orig, cells);
      result = leftN === 0 ? new Stop('ok', 'goal') : new Stop('ng', t('left', leftN));
    }
  } catch (e) {
    result = e instanceof Stop ? e : new Stop('ng', '⚠ ' + e.message);
  }
  return { frames, result };
}
// いまの はたけで うごかす。ステージ7は ほかの はたけ 20こでも ためす
let lastTest = null;
function simulate(code) {
  const out = simulateOne(code, FMAP);
  lastTest = null;
  if (out.result.kind === 'ok' && ST.mode === 'test') {
    let ok = 0;
    for (let k = 0; k < TESTS; k++) if (simulateOne(code, randomFarm()).result.kind === 'ok') ok++;
    lastTest = ok;
    if (ok < TESTS) out.result = new Stop('ng', t('testPartial', ok, TESTS), 'test');
  }
  return out;
}

/* ========== 4. えを かく（ドット絵：1マス 10×10） ========== */
const ctx = document.getElementById('board').getContext('2d');
ctx.imageSmoothingEnabled = false;
const PX = CELL / 10;
let robot = { ...START }, view = cellsOf(FMAP), viewBasket = 0, viewVar = 0, crashed = false, timer = null, tick = 0, splash = -1, splashT = 0;

function rand(r, c, i) {
  let h = (r * 73856093) ^ (c * 19349663) ^ (i * 83492791);
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function dot(x, y, px, py, color) { ctx.fillStyle = color; ctx.fillRect(x + px * PX, y + py * PX, PX, PX); }
function sprite(x, y, rows, colors) {
  rows.forEach((row, py) => [...row].forEach((ch, px) => { if (colors[ch]) dot(x, y, px, py, colors[ch]); }));
}
function grassTile(x, y, r, c) {
  ctx.fillStyle = '#6cab3e'; ctx.fillRect(x, y, CELL, CELL);
  for (let k = 0; k < 6; k++) dot(x, y, Math.floor(rand(r, c, k) * 10), Math.floor(rand(r, c, k + 7) * 10), k % 2 ? '#5a9433' : '#82c252');
}
function soilTile(x, y, wet) {
  ctx.fillStyle = wet ? '#5c3a1c' : '#8b5a2b'; ctx.fillRect(x, y, CELL, CELL);
  ctx.fillStyle = wet ? '#47290f' : '#6e4320';
  for (let py = 2; py < 10; py += 3) ctx.fillRect(x + PX, y + py * PX, CELL - PX * 2, PX);
  ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(x, y, CELL, 1); ctx.fillRect(x, y, 1, CELL);
}
const SEED = ['..........', '..........', '..........', '...W......', '......W...', '..........', '....W.....', '..........', '..........', '..........'];
const SPROUT = ['..........', '..........', '.LL....LL.', '.LLL..LLL.', '..LLLLLL..', '....SS....', '....S.....', '....S.....', '..........', '..........'];
const RIPE = ['....G.....', '..GGGGG...', '.GG.G.GG..', '.RR.G.RR..', 'RRWRGRWRR.', 'RRRR.RRRR.', '.RRRRRRR..', '...RWRR...', '...RRRR...', '....RR....'];
const STUB = ['..........', '..........', '..........', '..........', '..........', '...L..L...', '...LLLL...', '....SS....', '....S.....', '..........'];
// のうかの ロボット（うえむき）。むぎわら ぼうしを うえから みた ところ
const FARMER = ['....FF....', '..HHHHHH..', '.HHHHHHHH.', 'HHHBBBBHHH', 'HHBHHHHBHH', 'HHBHHHHBHH', 'HHHBBBBHHH', '.HHHHHHHH.', '..HHHHHH..', '...AAAA...'];

function drawFarmer() {
  const cx = robot.c * CELL + CELL / 2, cy = robot.r * CELL + CELL / 2;
  const col = crashed ? { F: '#ffcdd2', H: '#ff8a80', B: '#b71c1c', A: '#c62828' } : { F: '#ffffff', H: '#f2cf6b', B: '#c0392b', A: '#3c5aa6' };
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(robot.dir * Math.PI / 2);
  ctx.fillStyle = 'rgba(255,255,255,.22)';   // まえの むき
  ctx.beginPath(); ctx.moveTo(-PX, -PX * 5); ctx.lineTo(PX, -PX * 5); ctx.lineTo(PX * 3, -CELL * 0.78); ctx.lineTo(-PX * 3, -CELL * 0.78); ctx.fill();
  FARMER.forEach((row, py) => [...row].forEach((ch, px) => {
    if (col[ch]) { ctx.fillStyle = col[ch]; ctx.fillRect((px - 5) * PX, (py - 5) * PX, PX, PX); }
  }));
  ctx.restore();
}

function draw() {
  tick++;
  ctx.clearRect(0, 0, 400, 400);
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const x = c * CELL, y = r * CELL, ch = view[key(r, c)];
    if (ch === '.') { grassTile(x, y, r, c); if (r === START.r && c === START.c) { ctx.fillStyle = 'rgba(255,224,102,.35)'; ctx.fillRect(x + 4, y + 4, CELL - 8, CELL - 8); } continue; }
    soilTile(x, y, ch === 'g' || ch === 'q');
    if (ch === 'e') sprite(x, y, SEED, { W: '#f5e6b8' });
    if (ch === 'g' || ch === 'p' || ch === 'q') {
      const sway = Math.floor(tick / 10 + c) % 2;
      ctx.save(); ctx.translate(sway && (ch === 'g' || ch === 'q') ? PX * 0.4 : 0, 0);
      sprite(x, y, SPROUT, { L: ch === 'p' ? '#9ccf6e' : '#7fd34e', S: '#4e9a2c' });
      ctx.restore();
    }
    if (ch === 'r') sprite(x, y, RIPE, { R: '#e53935', W: '#ff8a80', G: '#3f8f2a' });
    if (ch === 'x') sprite(x, y, STUB, { L: '#5cb83a', S: '#4e9a2c' });
  }
  ctx.strokeStyle = 'rgba(0,0,0,.12)'; ctx.lineWidth = 1;
  for (let i = 1; i < N; i++) {
    ctx.beginPath(); ctx.moveTo(i * CELL + .5, 0); ctx.lineTo(i * CELL + .5, 400); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * CELL + .5); ctx.lineTo(400, i * CELL + .5); ctx.stroke();
  }
  if (splash >= 0 && tick - splashT < 6) {   // みずの しぶき
    const x = (splash % N) * CELL, y = Math.floor(splash / N) * CELL, k = tick - splashT;
    ctx.fillStyle = '#6cc4ff';
    [[2, 1], [7, 2], [4, 0], [8, 6], [1, 6]].forEach(([px, py]) => ctx.fillRect(x + px * PX, y + (py + k) * PX, PX, PX));
  }
  drawFarmer();
  const box = document.getElementById('farmCount');
  if (box) {
    const total = careTotal(FMAP), done = careDone(cellsOf(FMAP), view);
    const parts = ST.goal === 'count'
      ? [t('basket', viewBasket, ST.cap)].concat(window.SHOW_VAR ? [t('varShow', viewVar)] : [])
      : [t('grown', done, total)].concat(ST.goal === 'care' ? [t('basket', viewBasket)] : []);
    box.textContent = parts.join('　');
    box.className = (ST.goal === 'count' ? viewBasket === ST.cap : done === total) ? 'done' : '';
  }
}
setInterval(() => { if (!timer) draw(); }, 120);

function resetFarmView() {
  robot = { ...START }; view = cellsOf(FMAP); viewBasket = 0; viewVar = 0; crashed = false; splash = -1;
}
// うごきの きろく 1こを がめんに うつす（おとも ならす）
function applyFrame(f, prevDir) {
  robot = { r: f.r, c: f.c, dir: f.dir };
  view = f.cells.split(''); viewBasket = f.basket; viewVar = f.v;
  if (f.event === 'move') Sound.step();
  if (f.event === 'turn') { if ((prevDir + 1) % 4 === f.dir) Sound.turnRight(); else Sound.turnLeft(); }
  if (f.event === 'plant') Sound.plant();
  if (f.event === 'water') { Sound.water(); splash = key(f.r, f.c); splashT = tick; }
  if (f.event === 'harvest') Sound.harvest();
  if (f.event === 'var') Sound.count();
  if (f.event === 'miss') Sound.miss();
  if (f.event === 'bump') { crashed = true; Sound.crash(); }
}

/* ========== 5. 効果音（Web Audio で その場で つくる） ========== */
const Sound = {
  ctx: null, master: null, muted: !!store.get('-muted'), foot: 0,
  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      this.ctx = new AC(); this.master = this.ctx.createGain(); this.master.gain.value = 0.25; this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  },
  tone(type, f1, f2, len, delay = 0, vol = 1) {
    if (this.muted || !this.ctx) return;
    const tt = this.ctx.currentTime + delay, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f1, tt);
    if (f2 !== f1) o.frequency.exponentialRampToValueAtTime(f2, tt + len);
    g.gain.setValueAtTime(vol, tt); g.gain.exponentialRampToValueAtTime(0.001, tt + len);
    o.connect(g); g.connect(this.master); o.start(tt); o.stop(tt + len + 0.02);
  },
  noise(len, delay = 0, vol = 1, freq = 900) {
    if (this.muted || !this.ctx) return;
    const tt = this.ctx.currentTime + delay;
    const buf = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * len), this.ctx.sampleRate);
    const d = buf.getChannelData(0); for (let k = 0; k < d.length; k++) d[k] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource(), g = this.ctx.createGain(), lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = freq;
    g.gain.setValueAtTime(vol, tt); g.gain.exponentialRampToValueAtTime(0.001, tt + len);
    src.buffer = buf; src.connect(lp); lp.connect(g); g.connect(this.master); src.start(tt);
  },
  notes(list, type = 'square', vol = 0.6) { for (const [f, at, len] of list) this.tone(type, f, f, len, at, vol); },
  step()      { this.foot ^= 1; this.noise(0.07, 0, 0.45, this.foot ? 700 : 500); },   // ざっ ざっ（つちの うえ）
  turnRight() { this.tone('triangle', 520, 880, 0.12, 0, 0.7); },
  turnLeft()  { this.tone('triangle', 880, 520, 0.12, 0, 0.7); },
  plant()     { this.tone('sine', 420, 640, 0.1, 0, 0.7); this.noise(0.05, 0.02, 0.3, 1500); },          // ぽこっ
  water()     { this.noise(0.35, 0, 0.5, 2600); this.tone('sine', 900, 600, 0.2, 0, 0.25); },             // しゃー
  harvest()   { this.notes([[784, 0, .07], [1175, .07, .16]], 'square', 0.5); },                           // ぷちっ
  count()     { this.tone('square', 1320, 1320, 0.05, 0, 0.35); },
  miss()      { this.tone('square', 200, 150, 0.25, 0, 0.6); },
  crash()     { this.noise(0.3, 0, 0.9); this.tone('square', 160, 70, 0.3, 0, 0.7); },
  clear()     { this.notes([[523, 0.2, .12], [659, 0.32, .12], [784, 0.44, .12], [1047, 0.56, .45]]); this.notes([[392, 0.56, .45], [659, 0.56, .45]], 'triangle', 0.5); },
  goalSoSo()  { this.notes([[784, 0.2, .12], [1047, 0.34, .25]]); },
  fail()      { this.notes([[392, 0, .16], [330, .18, .16], [262, .36, .35]], 'square', 0.5); },
  grandClear(){ this.notes([[523, 0.2, .1], [523, 0.32, .1], [523, 0.44, .1], [523, 0.56, .3], [415, 0.9, .3], [466, 1.2, .3], [523, 1.5, .15], [466, 1.7, .1], [523, 1.82, .7]]);
                this.notes([[262, 1.5, 1.0], [330, 1.5, 1.0], [392, 1.5, 1.0]], 'triangle', 0.4); },
  toggle() { this.muted = !this.muted; store.set('-muted', this.muted); return this.muted; }
};

/* ========== 6. Blockly の みため（はたけ） ========== */
const farmTheme = Blockly.Theme.defineTheme('farm', {
  base: Blockly.Themes.Classic,
  blockStyles: {
    loop_blocks: { colourPrimary: COL.loop, colourSecondary: '#d89a4a', colourTertiary: '#7a4708' },
    math_blocks: { colourPrimary: '#7a6a4f', colourSecondary: '#a08f70', colourTertiary: '#4f4330' }
  },
  componentStyles: {
    workspaceBackgroundColour: '#2e2416', toolboxBackgroundColour: '#3b2e1c', flyoutBackgroundColour: '#4a3a24',
    flyoutOpacity: 1, scrollbarColour: '#a08f70', insertionMarkerColour: '#ffe066'
  },
  fontStyle: { family: 'DotGothic16, monospace', size: 12 }
});
