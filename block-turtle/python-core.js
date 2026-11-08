/* =====================================================================
   🐍 Python版の きょうつう エンジン（めいろ・うちゅう・こわす・おく）
   ---------------------------------------------------------------------
   ページの さきに つぎの ものを よういしておく：
     STR / t / L          … ことば（もとの アプリの ものに Python ようを たす）
     SAVE_KEY / store     … ほぞん
     simulate(js) ／ draw() ／ Sound ／ timer … もとの アプリの せかい・はんてい・え・おと
     WORLD                … この せかいの めいれい・しらべる もの・うごきの みせかた
     LEVELS               … Python の ステージ
   Python は ちいさな かいしゃくき で よみとり、きまった めいれい だけの
   JavaScript に なおして、もとの アプリと おなじ simulate で うごかす。
   こどもが かいた もじを そのまま eval する ことは ない（あんぜん）。
   ===================================================================== */

/* ========== 0. Python ようの ことば ========== */
Object.assign(STR.ja, {
  pyRun: 'じっこう', pyReset: 'もどす', pyAnswer: 'こたえ',
  tabBlocks: '🧩 ブロック', tabPy: '🐍 Python',
  pyLabel: '🐍 Python で かくと こうなるよ（みるだけ。かきかえるなら「🐍 Python」へ）',
  mapTitle: '🧩 ブロックと 🐍 Python の たいおう', consoleHello: '>>> ここに けっかや エラーが でるよ',
  pyUsed: (n) => `つかった ぎょう：${n}ぎょう`, pyMoves: (n) => ` ／ うごいた かず：${n}かい`,
  pyClear: '🎉 Python で クリア！', pyDone: '✅ じっこう おわり',
  line: (n) => `${n}ぎょうめ`, sep: '：',
  pyAnswerLoaded: '📖 こたえの コードを いれたよ。▶ じっこう で たしかめよう',
  toBlocksOk: '🧩 Python を ブロックに したよ', toPyOk: '🐍 ブロックを Python に したよ。じぶんで かきかえてみよう',
  cantBlock: (n) => `${n}ぎょうめは ブロックに できない かきかただよ（Python の まま つかってね）`,
  fixFirst: 'エラーを なおしてから ブロックに もどそう', cmLost: '（# の コメントは ブロックには ないので きえたよ）',
  loose: 'はなれている ブロックは うごかないよ（いちばん うえの かたまりだけ うごく）',
  pyRepeat: '%1 かい くりかえす', pyRepeatLbl: '〇かい くりかえす', pyElse: 'そうでなければ',
  eColon: 'SyntaxError：さいごに「:」（コロン）が ひつようだよ',
  eIndent: 'IndentationError：じさげ（あたまの スペース）が そろっていないよ',
  eBody: 'IndentationError：「:」の つぎの ぎょうは、スペース 4つ じさげ しよう',
  eParen: (f) => `SyntaxError：「${f}」の あとに「()」を つけよう`,
  eName: (w) => `NameError：「${w}」という めいれいは ないよ`,
  eElse: 'SyntaxError：「else」「elif」の まえには「if」が ひつようだよ',
  eSyntax: 'SyntaxError：かきかたが ちがうみたい',
  eCmdArg: (f) => `TypeError：「${f}()」の () の なかには なにも かかないよ`,
  eArg: (f, list) => `ValueError：「${f}()」の () の なかは ${list} の どれかだよ`,
  eNoArg: (f) => `TypeError：「${f}()」の () の なかには なにも かかないよ`,
  eNotCmd: (f) => `「${f}()」は しらべる ための もの。if や while と いっしょに つかおう`,
  eRange: 'ValueError：range() の かずは 1〜50 に しよう',
  eVar: (w) => `NameError：「${w}」という なまえ（へんすう）は まだ ないよ`,
  eNeedArg: (f) => `TypeError：「${f}()」の () の なかに かずを かこう（れい：${f}(90)）`,
  eExpr: 'SyntaxError：けいさんの かきかたが ちがうみたい',
  eStep: 'ValueError：range() の 3つめ（ふやす かず）を 0 には できないよ',
  eZero: 'ZeroDivisionError：0 で わる ことは できないよ',
  eRangeArgs: 'TypeError：range() の () の なかは 1〜3こ の かずだよ',
  certItem: 'しゅうりょうしょうを みる', dlgTitle: '🎉 ステージ クリア！', dlgQuestion: 'つぎの ステージに いきますか？', yes: 'はい', no: 'いいえ',
  pyRetry: 'もういちど チャレンジ！ べつの かきかたも ためしてみよう', nextPerson: 'つぎの ひとへ', armedItem: 'もういちど おすと リセット',
  armedMsg: '⚠ もういちど「つぎの ひとへ」を おすと、ぜんぶ リセットするよ', resetDone: '✨ リセットしたよ。つぎの ひと、がんばってね！',
  soundOn: 'おと：オン', soundOff: 'おと：オフ', hintBtn: '💡 ヒント', speed: 'はやさ'
});
Object.assign(STR.en, {
  pyRun: 'Run', pyReset: 'Restart', pyAnswer: 'Answer',
  tabBlocks: '🧩 Blocks', tabPy: '🐍 Python',
  pyLabel: '🐍 This is your program in Python (view only — use “🐍 Python” to edit)',
  mapTitle: '🧩 Blocks and 🐍 Python', consoleHello: '>>> Results and errors appear here',
  pyUsed: (n) => `Lines used: ${n}`, pyMoves: (n) => ` / Moves: ${n}`,
  pyClear: '🎉 Cleared with Python!', pyDone: '✅ Finished',
  line: (n) => `line ${n}`, sep: ': ',
  pyAnswerLoaded: '📖 Answer code loaded. Press ▶ Run to check it.',
  toBlocksOk: '🧩 Your Python is now blocks', toPyOk: '🐍 Your blocks are now Python. Try editing it yourself!',
  cantBlock: (n) => `Line ${n} cannot be shown as blocks (keep using Python)`,
  fixFirst: 'Fix the error before going back to blocks', cmLost: '(# comments are not kept in blocks)',
  loose: 'Blocks that are not connected do not run (only the top group runs)',
  pyRepeat: 'repeat %1 times', pyRepeatLbl: 'repeat 〇 times', pyElse: 'else',
  eColon: 'SyntaxError: put a “:” (colon) at the end',
  eIndent: 'IndentationError: the spaces at the start of the line do not line up',
  eBody: 'IndentationError: indent the line after “:” by 4 spaces',
  eParen: (f) => `SyntaxError: add “()” after “${f}”`,
  eName: (w) => `NameError: there is no command called “${w}”`,
  eElse: 'SyntaxError: “else” / “elif” needs an “if” before it',
  eSyntax: 'SyntaxError: something is written the wrong way',
  eCmdArg: (f) => `TypeError: write nothing inside the () of “${f}()”`,
  eArg: (f, list) => `ValueError: inside “${f}()” write one of ${list}`,
  eNoArg: (f) => `TypeError: write nothing inside the () of “${f}()”`,
  eNotCmd: (f) => `“${f}()” is for checking. Use it with if or while.`,
  eRange: 'ValueError: use a number from 1 to 50 in range()',
  eVar: (w) => `NameError: the name (variable) “${w}” does not exist yet`,
  eNeedArg: (f) => `TypeError: write a number inside the () of “${f}()” (e.g. ${f}(90))`,
  eExpr: 'SyntaxError: the math is written the wrong way',
  eStep: 'ValueError: the 3rd number of range() (the step) cannot be 0',
  eZero: 'ZeroDivisionError: you cannot divide by 0',
  eRangeArgs: 'TypeError: range() takes 1 to 3 numbers',
  certItem: 'View certificate', dlgTitle: '🎉 Stage clear!', dlgQuestion: 'Go to the next stage?', yes: 'Yes', no: 'No',
  pyRetry: 'Try again! Maybe write it a different way.', nextPerson: 'Next player', armedItem: 'Tap again to reset',
  armedMsg: '⚠ Tap "Next player" again to reset everything.', resetDone: '✨ All reset. Good luck, next player!',
  soundOn: 'Sound: On', soundOff: 'Sound: Off', hintBtn: '💡 Hint', speed: 'Speed'
});

const W = WORLD;
W.conds = W.conds || [];
const UNTIL = W.until ? W.until.py : null;      // 「〜まで くりかえす」の しらべる なまえ（ない せかいも ある）
const EXPRS = !!W.exprs;                         // かず・へんすう・けいさん を つかう せかい（おえかき）
const CMD = new Map(W.cmds.map((c) => [c.py, c]));
const CONDS = new Map(W.conds.map((c) => [c.py, c]));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ========== 1. ちいさな Python かいしゃくき ==========
   つかえる もの：めいれい()  pass  for 名前 in range(数):  while じょうけん:  while True:
                  if / elif / else   じょうけん ＝ [not] しらべる()  または  [not] しらべる('ことば') */
class PyError { constructor(line, text) { this.line = line; this.text = text; } }

function parse(src) {
  const lines = [];
  src.replace(/\t/g, '    ').split('\n').forEach((raw, i) => {
    const noCm = raw.replace(/#.*$/, '');
    if (!noCm.trim()) return;
    lines.push({ no: i + 1, indent: noCm.match(/^ */)[0].length, text: noCm.trim() });
  });
  let pos = 0;
  const firstWord = (s) => (s.match(/[A-Za-z_]\w*/) || [s])[0];
  const known = new Set();   // for で つくった へんすう（つかえる なまえ）
  // けいさんの しき：かず・へんすう・( )・+ - * / // % **
  function expr(text, no) {
    const toks = []; const re = /\s*(\d+\.\d*|\.\d+|\d+|[A-Za-z_]\w*|\*\*|\/\/|[-+*\/%(),]|\S)/y; let m;
    re.lastIndex = 0;
    while (re.lastIndex < text.length && (m = re.exec(text))) toks.push(m[1]);
    if (!toks.length) throw new PyError(no, t('eExpr'));
    let k = 0;
    const peek = () => toks[k], take = () => toks[k++];
    function atom() {
      const tk = take();
      if (tk === undefined) throw new PyError(no, t('eExpr'));
      if (/^(\d+\.?\d*|\.\d+)$/.test(tk)) return { k: 'num', v: Number(tk) };
      if (/^[A-Za-z_]\w*$/.test(tk)) {
        if (!known.has(tk)) throw new PyError(no, CMD.has(tk) || CONDS.has(tk) ? t('eExpr') : t('eVar', tk));
        return { k: 'var', name: tk };
      }
      if (tk === '(') { const e = sum(); if (take() !== ')') throw new PyError(no, t('eExpr')); return e; }
      throw new PyError(no, t('eExpr'));
    }
    function power() { const a = atom(); if (peek() === '**') { take(); return { k: 'bin', op: '**', a, b: unary() }; } return a; }
    function unary() {
      if (peek() === '-') { take(); const x = unary(); return x.k === 'num' ? { k: 'num', v: -x.v } : { k: 'neg', x }; }
      if (peek() === '+') { take(); return unary(); }
      return power();
    }
    function term() { let a = unary(); while (['*', '/', '//', '%'].includes(peek())) { const op = take(); a = { k: 'bin', op, a, b: unary() }; } return a; }
    function sum() { let a = term(); while (['+', '-'].includes(peek())) { const op = take(); a = { k: 'bin', op, a, b: term() }; } return a; }
    const e = sum();
    if (k !== toks.length) throw new PyError(no, t('eExpr'));
    return e;
  }
  // ( ) の なかを いちばん そとがわの「,」で わける
  function splitArgs(text) {
    const out = []; let depth = 0, cur = '';
    for (const ch of text) {
      if (ch === '(') depth++; if (ch === ')') depth--;
      if (ch === ',' && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
    }
    if (cur.trim() || out.length) out.push(cur);
    return out.map((x) => x.trim());
  }
  function cond(text, no) {
    const m = text.match(/^(not\s+)?([A-Za-z_]\w*)\s*\(\s*(?:(['"])(\w*)\3\s*)?\)$/);
    if (!m) {
      const w = text.replace(/^not\s+/, '');
      const name = firstWord(w);
      if ((CONDS.has(name) || name === UNTIL) && !/\(/.test(w)) throw new PyError(no, t('eParen', name));
      if (CONDS.has(name) || name === UNTIL) throw new PyError(no, t('eSyntax'));
      throw new PyError(no, t('eName', name));
    }
    const fn = m[2], arg = m[4];
    if (fn === UNTIL) { if (arg !== undefined) throw new PyError(no, t('eNoArg', fn)); return { not: !!m[1], fn, arg: null }; }
    const fam = CONDS.get(fn);
    if (!fam) throw new PyError(no, t('eName', fn));
    if (fam.opts) {
      if (arg === undefined || !fam.opts.some((o) => o[1] === arg)) throw new PyError(no, t('eArg', fn, fam.opts.map((o) => `'${o[1]}'`).join(' ')));
    } else if (arg !== undefined) throw new PyError(no, t('eNoArg', fn));
    return { not: !!m[1], fn, arg: arg ?? null };
  }
  function header(ln) {
    if (/^(for|while|if|elif|else)\b/.test(ln.text) && !ln.text.endsWith(':')) throw new PyError(ln.no, t('eColon'));
    return ln.text.replace(/:$/, '').trim();
  }
  function body(ln, indent) {
    const nx = lines[pos];
    if (!nx || nx.indent <= indent) throw new PyError(ln.no, t('eBody'));
    return block(nx.indent);
  }
  function block(indent) {
    const out = [];
    while (pos < lines.length) {
      const ln = lines[pos];
      if (ln.indent < indent) break;
      if (ln.indent > indent) throw new PyError(ln.no, t('eIndent'));
      pos++;
      const h = header(ln);
      let m;
      if (EXPRS && (m = h.match(/^for\s+([A-Za-z_]\w*)\s+in\s+range\((.*)\)$/))) {
        const parts = splitArgs(m[2]);
        if (parts.length < 1 || parts.length > 3 || parts.some((x) => !x)) throw new PyError(ln.no, t('eRangeArgs'));
        const args = parts.map((x) => expr(x, ln.no));
        known.add(m[1]);
        out.push({ type: 'for', no: ln.no, var: m[1], args, body: body(ln, indent) });
      } else if ((m = h.match(/^for\s+([A-Za-z_]\w*)\s+in\s+range\(\s*(\d+)\s*\)$/))) {
        const n = Number(m[2]);
        if (n < 1 || n > 50) throw new PyError(ln.no, t('eRange'));
        out.push({ type: 'for', no: ln.no, n, body: body(ln, indent) });
      } else if ((m = h.match(/^while\s+(.+)$/))) {
        const c = m[1].trim() === 'True' ? { always: true } : cond(m[1].trim(), ln.no);
        out.push({ type: 'while', no: ln.no, cond: c, body: body(ln, indent) });
      } else if ((m = h.match(/^if\s+(.+)$/))) {
        const node = { type: 'if', no: ln.no, arms: [{ no: ln.no, cond: cond(m[1].trim(), ln.no), body: body(ln, indent) }], other: null };
        while (pos < lines.length && lines[pos].indent === indent && /^(elif|else)\b/.test(lines[pos].text)) {
          const l2 = lines[pos]; pos++;
          const h2 = header(l2);
          if (h2 === 'else') { node.other = body(l2, indent); break; }
          const m2 = h2.match(/^elif\s+(.+)$/);
          if (!m2) throw new PyError(l2.no, t('eSyntax'));
          node.arms.push({ no: l2.no, cond: cond(m2[1].trim(), l2.no), body: body(l2, indent) });
        }
        out.push(node);
      } else if (/^(elif|else)\b/.test(h)) throw new PyError(ln.no, t('eElse'));
      else if (h === 'pass') { /* なにも しない */ }
      else if ((m = h.match(/^([A-Za-z_]\w*)\s*\((.*)\)$/))) {
        const name = m[1];
        const c = CMD.get(name), inner = m[2].trim();
        if (c && c.arg === 'num') {
          if (!inner) throw new PyError(ln.no, t('eNeedArg', name));
          out.push({ type: 'cmd', no: ln.no, cmd: name, arg: expr(inner, ln.no) });
        } else if (c && c.opts) {
          const q = inner.match(/^(['"])(\w*)\1$/);
          if (!q || !c.opts.some((o) => o[1] === q[2])) throw new PyError(ln.no, t('eArg', name, c.opts.map((o) => `'${o[1]}'`).join(' ')));
          out.push({ type: 'cmd', no: ln.no, cmd: name, arg: q[2] });
        } else if (c) { if (inner) throw new PyError(ln.no, t('eCmdArg', name)); out.push({ type: 'cmd', no: ln.no, cmd: name }); }
        else if (CONDS.has(name) || name === UNTIL) throw new PyError(ln.no, t('eNotCmd', name));
        else throw new PyError(ln.no, t('eName', name));
      }
      else if (CMD.has(h)) throw new PyError(ln.no, t('eParen', h));
      else throw new PyError(ln.no, t('eName', firstWord(h)));
    }
    return out;
  }
  if (lines.length && lines[0].indent > 0) throw new PyError(lines[0].no, t('eIndent'));
  const prog = block(0);
  if (pos < lines.length) throw new PyError(lines[pos].no, t('eIndent'));
  PY_VARS = [...known];
  return { prog, count: lines.length, vars: [...known] };
}
let PY_VARS = [];

/* ========== 2. よみとった Python → きまった めいれい だけの JavaScript ==========
   どの ぎょうを うごかしているかを pyLine(ぎょうばんごう) で しらせる */
let pyLastLine = 0, pyFinished = false;
function pyLine(n) { pyLastLine = n; }
function pyEnd() { pyFinished = true; }
function condJs(c) {
  if (c.always) return 'true';
  const e = c.fn === UNTIL ? W.until.js : CONDS.get(c.fn).js(c.arg);
  return c.not ? `!(${e})` : e;
}
function toJs(list, d) { return list.map((n) => nodeJs(n, d)).join(''); }
// しきを JavaScript に（へんすうは v_なまえ）
function exprJs(e) {
  if (e.k === 'num') return String(e.v);
  if (e.k === 'var') return 'v_' + e.name;
  if (e.k === 'neg') return `(-${exprJs(e.x)})`;
  const a = exprJs(e.a), b = exprJs(e.b);
  if (e.op === '/') return `pyDiv(${a},${b})`;
  if (e.op === '//') return `Math.floor(pyDiv(${a},${b}))`;
  if (e.op === '%') return `pyMod(${a},${b})`;
  if (e.op === '**') return `Math.pow(${a},${b})`;
  return `(${a}${e.op}${b})`;
}
function pyDiv(a, b) { if (b === 0) throw new Error(t('eZero')); return a / b; }
function pyMod(a, b) { if (b === 0) throw new Error(t('eZero')); return ((a % b) + b) % b; }
function nodeJs(n, d) {
  const at = (no) => `pyLine(${no});highlight(${no});`;
  if (n.type === 'cmd') {
    const c = CMD.get(n.cmd);
    if (c.arg === 'num') return at(n.no) + c.js(exprJs(n.arg)) + ';\n';
    if (c.opts) return at(n.no) + c.js(c.opts.find((o) => o[1] === n.arg)[2]) + ';\n';
    return at(n.no) + c.js + ';\n';
  }
  if (n.type === 'for' && n.args) {   // for へんすう in range(はじめ, おわり, ふやす かず)
    const [a0, a1, a2] = n.args;
    const start = n.args.length === 1 ? '0' : exprJs(a0), end = exprJs(n.args.length === 1 ? a0 : a1), step = a2 ? exprJs(a2) : '1';
    const v = 'v_' + n.var;
    return `${at(n.no)}{const s${d}=${step},e${d}=${end};if(s${d}===0)throw new Error(t('eStep'));` +
      `for(${v}=${start};s${d}>0?${v}<e${d}:${v}>e${d};${v}+=s${d}){loopGuard();${at(n.no)}\n${toJs(n.body, d + 1)}}}\n`;
  }
  if (n.type === 'for') return `${at(n.no)}for(let i${d}=0;i${d}<${n.n};i${d}++){loopGuard();${at(n.no)}\n${toJs(n.body, d + 1)}}\n`;
  if (n.type === 'while') return `${at(n.no)}while(${condJs(n.cond)}){loopGuard();\n${toJs(n.body, d + 1)}${at(n.no)}}\n`;
  // if / elif / else は「もし … そうでなければ（もし …）」の いれこに する
  let s = n.other ? toJs(n.other, d + 1) : '';
  for (let i = n.arms.length - 1; i >= 0; i--) {
    const a = n.arms[i];
    s = `${at(a.no)}if(${condJs(a.cond)}){\n${toJs(a.body, d + 1)}}${s ? `else{\n${s}}` : ''}\n`;
  }
  return s;
}
function compile(prog) { return (PY_VARS.length ? 'let ' + PY_VARS.map((v) => 'v_' + v).join(',') + ';\n' : '') + toJs(prog, 0) + 'pyEnd();\n'; }

/* ========== 3. ブロック ⇄ Python ==========
   ブロック 1こ ＝ Python 1ぎょう。じっこう ちゅうの ぎょうから ブロックを ひからせられる */
const BT = { cmd: (py) => 'w_' + py, repeat: 'w_repeat', until: 'w_until', iff: (fn) => 'w_if_' + fn, ifelse: (fn) => 'w_ifelse_' + fn };
const condBlockArgs = (fam) => fam.opts ? [{ type: 'field_dropdown', name: 'ARG', options: fam.opts.map((o) => [o[0], o[1]]) }] : [];
Blockly.common.defineBlocksWithJsonArray([
  ...W.cmds.map((c) => ({ type: BT.cmd(c.py), message0: c.label, previousStatement: null, nextStatement: null, colour: c.colour,
    args0: c.arg === 'num' ? [{ type: 'input_value', name: 'N', check: 'Number' }] : c.opts ? [{ type: 'field_dropdown', name: 'C', options: c.opts.map((o) => [o[0], o[1]]) }] : undefined,
    inputsInline: true })),
  EXPRS
    ? { type: BT.repeat, message0: t('pyRepeat'), args0: [{ type: 'input_value', name: 'TIMES', check: 'Number' }], inputsInline: true,
        message1: '%1', args1: [{ type: 'input_statement', name: 'DO' }], previousStatement: null, nextStatement: null, colour: W.loopColour }
    : { type: BT.repeat, message0: t('pyRepeat'), args0: [{ type: 'field_number', name: 'TIMES', value: 3, min: 1, max: 50, precision: 1 }],
        message1: '%1', args1: [{ type: 'input_statement', name: 'DO' }], previousStatement: null, nextStatement: null, colour: W.loopColour },
  ...(W.until ? [{ type: BT.until, message0: W.until.label, message1: '%1', args1: [{ type: 'input_statement', name: 'DO' }],
    previousStatement: null, nextStatement: null, colour: W.loopColour }] : []),
  ...W.conds.flatMap((f) => [
    { type: BT.iff(f.py), message0: f.label, args0: condBlockArgs(f), message1: '%1', args1: [{ type: 'input_statement', name: 'DO' }],
      previousStatement: null, nextStatement: null, colour: f.colour },
    { type: BT.ifelse(f.py), message0: f.label, args0: condBlockArgs(f), message1: '%1', args1: [{ type: 'input_statement', name: 'DO' }],
      message2: t('pyElse') + ' %1', args2: [{ type: 'input_statement', name: 'ELSE' }],
      previousStatement: null, nextStatement: null, colour: f.colour }
  ])
]);
const TYPE2CMD = new Map(W.cmds.map((c) => [BT.cmd(c.py), c.py]));
const TYPE2COND = new Map(W.conds.flatMap((f) => [[BT.iff(f.py), f], [BT.ifelse(f.py), f]]));
const condText = (f, arg) => f.opts ? `${f.py}('${arg || f.opts[0][1]}')` : `${f.py}()`;

// ブロック（JSON の つながり）→ Python の ぎょう { text, id }
let VARMAP = {};   // へんすうの id → なまえ
const OPS = { ADD: '+', MINUS: '-', MULTIPLY: '*', DIVIDE: '/', POWER: '**' };
const PREC = { '+': 1, '-': 1, '*': 2, '/': 2, '//': 2, '%': 2, '**': 3 };
const fmtNum = (v) => { const n = Number(v); return Number.isInteger(n) ? String(n) : String(Math.round(n * 1e6) / 1e6); };
// あたいの ブロック（かず・へんすう・けいさん）→ Python の しき
function exprNode(inp) { return inp ? (inp.block || inp.shadow) : null; }
function exprText(node, parentPrec = 0, right = false) {
  if (!node) return '0';
  if (node.type === 'math_number') { const s = fmtNum((node.fields || {}).NUM ?? 0); return s.startsWith('-') && parentPrec ? `(${s})` : s; }
  if (node.type === 'variables_get') return VARMAP[((node.fields || {}).VAR || {}).id] || ((node.fields || {}).VAR || {}).name || 'i';
  if (node.type === 'math_arithmetic') {
    const op = OPS[(node.fields || {}).OP] || '+', p = PREC[op], inp = node.inputs || {};
    const s = `${exprText(exprNode(inp.A), p)} ${op} ${exprText(exprNode(inp.B), p, true)}`;
    return parentPrec > p || (parentPrec === p && right) ? `(${s})` : s;
  }
  return '0';
}
const numOf = (node) => node && node.type === 'math_number' ? Number((node.fields || {}).NUM) : null;
function blocksToLines(first, depth, out, scope = []) {
  for (let b = first; b; b = b.next && b.next.block) {
    const pad = '    '.repeat(depth), f = b.fields || {}, inp = b.inputs || {};
    const sub = (blk, d, id, sc = scope) => { if (blk) blocksToLines(blk, d, out, sc); else out.push({ text: '    '.repeat(d) + 'pass', id }); };
    if (TYPE2CMD.has(b.type)) {
      const c = CMD.get(TYPE2CMD.get(b.type));
      const arg = c.arg === 'num' ? exprText(exprNode(inp.N)) : c.opts ? `'${f.C || c.opts[0][1]}'` : '';
      out.push({ text: `${pad}${c.py}(${arg})`, id: b.id });
    } else if (b.type === BT.repeat && EXPRS) {
      const name = ['i', 'k', 'j', 'm', 'p'].find((x) => !scope.includes(x)) || 'q';
      out.push({ text: `${pad}for ${name} in range(${exprText(exprNode(inp.TIMES))}):`, id: b.id });
      sub(inp.DO && inp.DO.block, depth + 1, b.id, [...scope, name]);
    } else if (b.type === 'controls_for') {
      const name = VARMAP[(f.VAR || {}).id] || (f.VAR || {}).name || 'i';
      const from = exprNode(inp.FROM), to = exprNode(inp.TO), by = exprNode(inp.BY);
      const byN = numOf(by), toN = numOf(to);
      const toText = toN !== null ? fmtNum(byN !== null && byN < 0 ? toN - 1 : toN + 1) : `${exprText(to, 1)} + 1`;
      const args = [exprText(from), toText];
      if (!(byN === 1)) args.push(exprText(by));
      out.push({ text: `${pad}for ${name} in range(${args.join(', ')}):`, id: b.id });
      sub(inp.DO && inp.DO.block, depth + 1, b.id, [...scope, name]);
    } else if (b.type === BT.repeat) {
      out.push({ text: `${pad}for i in range(${Math.min(50, Math.max(1, Math.round(Number(f.TIMES) || 1)))}):`, id: b.id });
      sub(inp.DO && inp.DO.block, depth + 1, b.id);
    } else if (b.type === BT.until && UNTIL) {
      out.push({ text: `${pad}while not ${UNTIL}():`, id: b.id });
      sub(inp.DO && inp.DO.block, depth + 1, b.id);
    } else if (TYPE2COND.has(b.type)) {
      // 「そうでなければ」の なかが「もし」1こ だけ なら elif に まとめる
      let cur = b, kw = 'if';
      for (;;) {
        const fam = TYPE2COND.get(cur.type), ci = cur.inputs || {};
        out.push({ text: `${pad}${kw} ${condText(fam, (cur.fields || {}).ARG)}:`, id: cur.id });
        sub(ci.DO && ci.DO.block, depth + 1, cur.id);
        if (cur.type !== BT.ifelse(fam.py)) break;
        const el = ci.ELSE && ci.ELSE.block;
        if (el && TYPE2COND.has(el.type) && !el.next) { cur = el; kw = 'elif'; continue; }
        out.push({ text: pad + 'else:', id: cur.id });
        sub(el, depth + 1, cur.id);
        break;
      }
    }
  }
  return out;
}
function workspaceToLines() {
  const saved = Blockly.serialization.workspaces.save(workspace);
  VARMAP = Object.fromEntries((saved.variables || []).map((v) => [v.id, v.name]));
  const tops = (saved.blocks || {}).blocks || [];
  tops.sort((a, b) => (a.y || 0) - (b.y || 0) || (a.x || 0) - (b.x || 0));
  return { lines: tops.length ? blocksToLines(tops[0], 0, []) : [], loose: tops.length > 1 };
}

// Python（よみとり けっか）→ ブロックの JSON。ブロックに できない かきかたは ぎょうばんごうを かえす
class NoBlock { constructor(line) { this.line = line; } }
const clean = (o) => { Object.keys(o).forEach((k) => o[k] === undefined && delete o[k]); return o; };
function nodesToBlocks(list) {
  let head = null, tail = null;
  for (const n of list) {
    const b = nodeToBlock(n);
    if (!head) head = b; else tail.next = { block: b };
    tail = b;
  }
  return head;
}
const bodyInput = (list) => { const b = nodesToBlocks(list); return b ? { block: b } : undefined; };
// しき → あたいの ブロック
const OPNAME = { '+': 'ADD', '-': 'MINUS', '*': 'MULTIPLY', '/': 'DIVIDE', '**': 'POWER' };
function exprBlock(e, no) {
  if (e.k === 'num') return { type: 'math_number', fields: { NUM: e.v } };
  if (e.k === 'var') return { type: 'variables_get', fields: { VAR: { id: 'v_' + e.name } } };
  if (e.k === 'neg') return exprBlock({ k: 'bin', op: '-', a: { k: 'num', v: 0 }, b: e.x }, no);
  if (!OPNAME[e.op]) throw new NoBlock(no);   // // と % は ブロックに ない
  return { type: 'math_arithmetic', fields: { OP: OPNAME[e.op] }, inputs: { A: valueInput(e.a, no), B: valueInput(e.b, no) } };
}
function valueInput(e, no) {
  if (e.k === 'num') return { shadow: { type: 'math_number', fields: { NUM: e.v } } };
  return { shadow: { type: 'math_number', fields: { NUM: 0 } }, block: exprBlock(e, no) };
}
const usesVar = (list, name) => JSON.stringify(list).includes(`"k":"var","name":"${name}"`);
function nodeToBlock(n) {
  if (n.type === 'cmd') {
    const c = CMD.get(n.cmd);
    if (c.arg === 'num') return { type: BT.cmd(n.cmd), inputs: { N: valueInput(n.arg, n.no) } };
    if (c.opts) return { type: BT.cmd(n.cmd), fields: { C: n.arg } };
    return { type: BT.cmd(n.cmd) };
  }
  if (n.type === 'for' && n.args) {
    if (n.args.length === 1 && !usesVar(n.body, n.var)) return { type: BT.repeat, inputs: clean({ TIMES: valueInput(n.args[0], n.no), DO: bodyInput(n.body) }) };
    const one = { k: 'num', v: 1 };
    const from = n.args.length === 1 ? { k: 'num', v: 0 } : n.args[0], end = n.args.length === 1 ? n.args[0] : n.args[1], step = n.args[2] || one;
    if (step.k !== 'num' || step.v === 0) throw new NoBlock(n.no);
    const to = end.k === 'num' ? { k: 'num', v: step.v > 0 ? end.v - 1 : end.v + 1 } : { k: 'bin', op: step.v > 0 ? '-' : '+', a: end, b: one };
    return { type: 'controls_for', fields: { VAR: { id: 'v_' + n.var } },
      inputs: clean({ FROM: valueInput(from, n.no), TO: valueInput(to, n.no), BY: valueInput({ k: 'num', v: Math.abs(step.v) }, n.no), DO: bodyInput(n.body) }) };
  }
  if (n.type === 'for') return { type: BT.repeat, fields: { TIMES: n.n }, inputs: clean({ DO: bodyInput(n.body) }) };
  if (n.type === 'while') {
    if (!UNTIL || n.cond.always || n.cond.fn !== UNTIL || !n.cond.not) throw new NoBlock(n.no);
    return { type: BT.until, inputs: clean({ DO: bodyInput(n.body) }) };
  }
  const build = (arms, other) => {
    const a = arms[0];
    if (a.cond.not || !CONDS.has(a.cond.fn)) throw new NoBlock(a.no);
    const fam = CONDS.get(a.cond.fn), rest = arms.length > 1 || other;
    const blk = { type: rest ? BT.ifelse(fam.py) : BT.iff(fam.py), inputs: clean({ DO: bodyInput(a.body) }) };
    if (fam.opts) blk.fields = { ARG: a.cond.arg };
    if (arms.length > 1) blk.inputs.ELSE = { block: build(arms.slice(1), other) };
    else if (other) { const e = bodyInput(other); if (e) blk.inputs.ELSE = e; }
    return blk;
  };
  return build(n.arms, n.other);
}

/* ========== 4. ワークスペース ========== */
const sh = (v) => ({ shadow: { type: 'math_number', fields: { NUM: v } } });
function flyEntry(type) {   // ツールボックスの ブロック（かずの はいる ところには さいしょの かずを いれておく）
  const c = CMD.get(TYPE2CMD.get(type));
  if (c && c.arg === 'num') return { kind: 'block', type, inputs: { N: sh(c.def ?? 10) } };
  if (type === BT.repeat && EXPRS) return { kind: 'block', type, inputs: { TIMES: sh(4) } };
  if (type === 'controls_for') return { kind: 'block', type, fields: { VAR: { name: 'i' } }, inputs: { FROM: sh(1), TO: sh(10), BY: sh(1) } };
  if (type === 'math_arithmetic') return { kind: 'block', type, fields: { OP: 'DIVIDE' }, inputs: { A: sh(360), B: sh(6) } };
  if (type === 'variables_get') return { kind: 'block', type, fields: { VAR: { name: 'i' } } };
  return { kind: 'block', type };
}
const flyout = (types) => ({ kind: 'flyoutToolbox', contents: types.map(flyEntry) });
const codeSide = document.getElementById('codeSide');
codeSide.classList.add('blocks');   // はいる まえに みえる ように して おく（おおきさを はかる ため）
const workspace = Blockly.inject('blocklyDiv', {
  toolbox: flyout(LEVELS[0].blocks), renderer: W.renderer || 'geras', theme: W.theme, trashcan: true,
  grid: { spacing: 24, length: W.gridLength ?? 24, colour: W.gridColour || '#3f2e1f', snap: true },
  zoom: { controls: true, wheel: true, startScale: 1.0 },
  move: { scrollbars: true, drag: true, wheel: false }
});

/* ========== 5. エディタ（いろづけ・ぎょうばんごう・じさげ） ========== */
const code = document.getElementById('code'), hl = document.getElementById('hl'), lineNo = document.getElementById('lineNo');
const wrap = document.getElementById('codeWrap');
const consoleEl = document.getElementById('console'), msg = document.getElementById('msg'), info = document.getElementById('info');
let markLine = 0, markKind = '';
const FN_NAMES = [...W.cmds.map((c) => c.py), ...W.conds.map((c) => c.py), ...(UNTIL ? [UNTIL] : [])];
const TOKEN = new RegExp(`('[^']*'|"[^"]*")|\\b(for|in|while|if|elif|else|not|pass|True|False|and|or)\\b|\\b(${FN_NAMES.join('|')})\\b|\\b(range|print)\\b|\\b(\\d+)\\b`, 'g');
function colorLine(s) {
  const m = s.match(/^([^#]*?)(#.*)?$/);
  const escT = (x) => x.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');   // ' と " は そのまま（もじれつの いろづけの ため）
  const cm = m[2] ? '<span class="cm">' + escT(m[2]) + '</span>' : '';
  const body = escT(m[1]).replace(TOKEN, (all, str, kw, fn, bi, num) =>
    str ? `<span class="str">${str}</span>` : kw ? `<span class="kw">${kw}</span>` : fn ? `<span class="fn">${fn}</span>` : bi ? `<span class="bi">${bi}</span>` : `<span class="num">${num}</span>`);
  return body + cm;
}
function render() {
  const ls = code.value.split('\n');
  hl.innerHTML = ls.map((s, i) => { const h = colorLine(s) || ' '; return i + 1 === markLine ? `<span class="${markKind}">${h}</span>` : h; }).join('\n') + '\n';
  lineNo.innerHTML = ls.map((_, i) => i + 1 === markLine ? `<span class="cur">${i + 1}</span>` : String(i + 1)).join('\n');
  code.style.height = 'auto'; code.style.height = Math.max(code.scrollHeight, wrap.clientHeight) + 'px';
}
wrap.addEventListener('scroll', () => { lineNo.scrollTop = wrap.scrollTop; });
function mark(line, kind) {
  markLine = line; markKind = kind; render();
  if (line) {   // その ぎょうが みえるように
    const lh = parseFloat(getComputedStyle(code).lineHeight) || 28.8, y = 10 + (line - 1) * lh;
    if (y < wrap.scrollTop || y > wrap.scrollTop + wrap.clientHeight - lh) wrap.scrollTop = y - wrap.clientHeight / 2;
  }
}
function insert(text) { code.setRangeText(text, code.selectionStart, code.selectionEnd, 'end'); code.focus(); render(); save(); }
code.addEventListener('input', () => { if (markKind === 'err') markLine = 0; render(); save(); });
code.addEventListener('keydown', (e) => {
  if (mode !== 'python') return;
  const s = code.selectionStart, v = code.value;
  if (e.key === 'Tab') { e.preventDefault(); insert('    '); }
  else if (e.key === 'Enter' && !e.isComposing) {
    e.preventDefault();
    const cur = v.slice(v.lastIndexOf('\n', s - 1) + 1, s);
    let ind = cur.match(/^ */)[0];
    if (/:\s*(#.*)?$/.test(cur)) ind += '    ';   // 「:」の あとは じさげを ふやす
    insert('\n' + ind);
  } else if (e.key === 'Backspace' && s === code.selectionEnd) {
    const cur = v.slice(v.lastIndexOf('\n', s - 1) + 1, s);
    if (cur.length && /^ +$/.test(cur) && cur.length % 4 === 0) { e.preventDefault(); code.setRangeText('', s - 4, s, 'end'); render(); save(); }
  }
});

// めいれいの ボタン（キーボードが にがてな こ むけ）
const PALETTE = W.palette || [
  ...W.cmds.map((c) => c.py + '()'),
  'for i in range(3):', `while not ${UNTIL}():`,
  ...W.conds.map((f) => `if ${condText(f)}:`),
  `elif ${condText(W.conds[W.conds.length - 1])}:`, 'else:'
];
const pal = document.getElementById('palette');
PALETTE.forEach((p) => {
  const b = document.createElement('button'); b.textContent = p;
  b.addEventListener('click', () => {   // いまの ぎょうの じさげに あわせて、1ぎょう いれる
    const v = code.value, s = code.selectionStart, cur = v.slice(v.lastIndexOf('\n', s - 1) + 1, s);
    const ind = cur.match(/^ */)[0], blank = cur.trim() === '';
    insert((blank ? '' : '\n' + ind) + p + (p.endsWith(':') ? '\n' + ind + '    ' : '\n' + ind));
  });
  pal.appendChild(b);
});

// ブロックと Python の たいおうひょう
const fill = (label, fam) => label.replace('%1', fam && fam.opts ? fam.opts[0][0] : '〇');
const MAP = W.mapRows || [
  ...W.cmds.map((c) => [c.colour, c.label, c.py + '()']),
  [W.loopColour, t('pyRepeatLbl'), 'for i in range(〇):'],
  [W.loopColour, W.until && W.until.label, `while not ${UNTIL}():`],
  ...W.conds.map((f) => [f.colour, fill(f.label, f), `if ${condText(f)}:`]),
  [W.conds[0].colour, t('pyElse'), LANG === 'en' ? 'else:   (only an “if” inside → elif)' : 'else:（なかが「もし」だけなら elif）']
];
document.getElementById('mapTable').innerHTML = MAP.map(([col, label, py]) =>
  `<tr><td class="blk" style="background:${col}">${esc(label)}</td><td>→</td><td><code>${esc(py)}</code></td></tr>`).join('');

/* ========== 6. ステージ・ほぞん ========== */
let level = 0, LV = LEVELS[0], mode = 'blocks', lineIds = [];
function save() { store.set('-code-' + level, code.value); }
function logLine(text, cls) { const d = document.createElement('div'); if (cls) d.className = cls; d.textContent = text; consoleEl.appendChild(d); consoleEl.scrollTop = consoleEl.scrollHeight; }
function clearConsole() { consoleEl.innerHTML = ''; logLine(t('consoleHello')); }
function resetBoard() {
  if (timer) { clearTimeout(timer); clearInterval(timer); }
  timer = null;
  W.resetView();
  workspace.highlightBlock(null);
}

// ブロックから Python を つくって、したの まどに だす
workspace.addChangeListener((e) => { if (!e.isUiEvent && mode === 'blocks') syncFromBlocks(); });
function syncFromBlocks() {
  const { lines } = workspaceToLines();
  lineIds = lines.map((l) => l.id);
  const txt = lines.map((l) => l.text).join('\n') + (lines.length ? '\n' : '');
  if (code.value !== txt) { code.value = txt; if (markKind !== 'run') markLine = 0; render(); save(); }
}
// Python の もじを ブロックに する（できなければ エラーを なげる）
function codeToBlocks(src) {
  const parsed = parse(src);
  const first = nodesToBlocks(parsed.prog);
  if (first) { first.x = 20; first.y = 20; }
  Blockly.serialization.workspaces.load({ blocks: { languageVersion: 0, blocks: first ? [first] : [] },
    variables: parsed.vars.map((v) => ({ name: v, id: 'v_' + v })) }, workspace);
  syncFromBlocks();
}
function setMode(m, quiet) {
  if (m === 'blocks' && mode !== 'blocks') {
    const hadComment = /(^|\s)#/.test(code.value);
    try { codeToBlocks(code.value); }
    catch (e) {
      if (e instanceof PyError) { mark(e.line, 'err'); msg.className = 'ng'; msg.textContent = t('fixFirst') + ' — ' + t('line', e.line) + t('sep') + e.text; return false; }
      if (e instanceof NoBlock) { mark(e.line, 'err'); msg.className = 'ng'; msg.textContent = t('cantBlock', e.line); return false; }
      throw e;
    }
    mode = 'blocks';
    if (!quiet) { msg.className = ''; msg.textContent = t('toBlocksOk') + (hadComment ? ' ' + t('cmLost') : ''); }
  } else if (m === 'python' && mode !== 'python') {
    mode = 'python';
    if (!quiet) { msg.className = ''; msg.textContent = t('toPyOk'); }
  }
  codeSide.classList.toggle('blocks', mode === 'blocks');
  code.readOnly = mode === 'blocks';
  document.getElementById('tabBlocks').className = mode === 'blocks' ? 'on' : 'off';
  document.getElementById('tabPy').className = mode === 'python' ? 'on' : 'off';
  store.set('-mode', mode);
  Blockly.svgResize(workspace);
  render();
  return true;
}
function setLevel(i) {
  hideClearDialog();
  level = i; LV = LEVELS[i]; store.set('-level', i);
  document.getElementById('levelSelect').value = i;
  document.getElementById('lessonText').textContent = L(LV, 'text');
  const ht = document.getElementById('hintText'); ht.textContent = L(LV, 'hint'); ht.style.display = 'none';
  W.load(LV);
  resetBoard();
  code.value = store.get('-code-' + i) ?? (LANG === 'en' ? LV.startEn : LV.start);
  markLine = 0;
  workspace.updateToolbox(flyout(LV.blocks));
  if (mode === 'blocks') {
    try { codeToBlocks(code.value); workspace.scrollCenter && workspace.scrollCenter(); }
    catch (e) { if (e instanceof PyError || e instanceof NoBlock) setMode('python', true); else throw e; }
  }
  render(); wrap.scrollTop = 0;
  msg.textContent = ''; msg.className = ''; info.textContent = '';
  clearConsole();
}

/* ========== 7. じっこう ========== */
function runCode() {
  if (Sound.unlock) Sound.unlock();
  hideClearDialog(); resetBoard(); msg.textContent = ''; msg.className = ''; clearConsole();
  let parsed;
  try { parsed = parse(code.value); }
  catch (e) {
    if (!(e instanceof PyError)) throw e;
    mark(e.line, 'err');
    logLine(`File "main.py", ${t('line', e.line)}`, 'e'); logLine(e.text, 'e');
    msg.className = 'ng'; msg.textContent = t('line', e.line) + t('sep') + e.text;
    if (Sound.fail) Sound.fail();
    return;
  }
  pyLastLine = 0; pyFinished = false;
  const { frames, result } = simulate(compile(parsed.prog));
  const errLine = pyFinished ? 0 : pyLastLine;   // とちゅうで とまった ときは その ぎょう
  window.__lastResult = { frames, result, errLine };   // テストよう
  logLine('>>> python main.py', 'o');
  if (mode === 'blocks' && workspaceToLines().loose) logLine(t('loose'), 'e');
  let i = 0;
  const finish = () => {
    timer = null;
    info.textContent = t('pyUsed', parsed.count) + t('pyMoves', frames.filter((f) => f.event === 'move' || f.event === 'turn').length);
    if (result.kind === 'ok') {
      mark(0, ''); workspace.highlightBlock(null);
      if (W.onGoal) W.onGoal();
      msg.className = 'ok'; msg.textContent = t('pyClear'); logLine(t('pyDone'));
      Sound.clear(); markCleared(level);
    } else {
      mark(errLine, errLine ? 'err' : '');
      workspace.highlightBlock(mode === 'blocks' && errLine ? lineIds[errLine - 1] || null : null);
      msg.className = 'ng'; msg.textContent = (errLine ? t('line', errLine) + t('sep') : '') + result.text;
      logLine(result.text, 'e');
      if (result.why !== 'crash' && result.why !== 'miss' && Sound.fail) Sound.fail();
    }
  };
  const step = () => {
    if (i >= frames.length) return finish();
    const f = frames[i++];
    W.apply(f, i, frames);
    mark(f.id || 0, 'run');
    if (mode === 'blocks') workspace.highlightBlock(lineIds[(f.id || 0) - 1] || null);
    draw();
    if (W.afterDraw) W.afterDraw();
    const sp = Number(document.getElementById('speed').value);
    timer = setTimeout(step, window.__instant ? 0 : W.delay ? W.delay(f, sp) : 650 - sp * 60);
  };
  if (window.__instant) {   // テストよう：まつ じかん なしで さいごまで
    while (i < frames.length) { const f = frames[i++]; W.apply(f, i, frames); if (mode === 'blocks') workspace.highlightBlock(lineIds[(f.id || 0) - 1] || null); }
    draw(); return finish();
  }
  step();
}

/* ========== 8. クリア・しゅうりょうしょう・つぎの ひとへ ========== */
let cleared = []; { const c = store.get('-cleared'); if (Array.isArray(c)) cleared = c; }
const clearDialog = document.getElementById('clearDialog');
let dialogTimer = null;
function allStagesCleared() { return LEVELS.every((_, i) => cleared.includes(i)); }
function showClearDialog() {
  const next = LEVELS[level + 1];
  document.getElementById('dlgQuestion').innerHTML =
    `${esc(t('dlgQuestion'))}<br><span style="font-size:15px">${LANG === 'en' ? '(' : '（'}${esc(L(next, 'title'))}${LANG === 'en' ? ')' : '）'}</span>`;
  clearDialog.classList.add('show');
  document.getElementById('dlgYes').focus();
}
function hideClearDialog() { clearTimeout(dialogTimer); dialogTimer = null; clearDialog.classList.remove('show'); }
function showCertificate(thenNext) {
  Certificate.show({ app: t('pyTitle'), icons: W.icons, onClose: thenNext && level < LEVELS.length - 1 ? showClearDialog : null });
}
function markCleared(i) {
  const wasAll = allStagesCleared();
  if (!cleared.includes(i)) { cleared.push(i); store.set('-cleared', cleared); fillLevels(); }
  if (!wasAll && allStagesCleared()) { dialogTimer = setTimeout(() => showCertificate(true), 900); return; }   // ぜんぶ クリア！
  if (i < LEVELS.length - 1) dialogTimer = setTimeout(showClearDialog, 900);
}
function fillLevels() {
  const sel = document.getElementById('levelSelect');
  sel.innerHTML = LEVELS.map((lv, i) => `<option value="${i}">${cleared.includes(i) ? '✅ ' : ''}${esc(L(lv, 'title'))}</option>`).join('');
  sel.value = level;
}
let resetArmed = null;
function resetForNextPerson() {
  try {
    Object.keys(localStorage).filter((k) => k.startsWith(SAVE_KEY + '-code-') || [SAVE_KEY + '-cleared', SAVE_KEY + '-level'].includes(k))
      .forEach((k) => localStorage.removeItem(k));
  } catch (_) {}
  cleared = []; Certificate.clearName(); fillLevels(); setLevel(0);
  msg.className = 'ok'; msg.textContent = t('resetDone');
}

/* ========== 9. がめんの じゅんび ========== */
document.getElementById('levelSelect').addEventListener('change', (e) => setLevel(Number(e.target.value)));
document.getElementById('hintBtn').addEventListener('click', () => { const h = document.getElementById('hintText'); h.style.display = h.style.display === 'none' ? 'block' : 'none'; });
document.getElementById('run').addEventListener('click', runCode);
document.getElementById('reset').addEventListener('click', () => { hideClearDialog(); resetBoard(); mark(0, ''); msg.textContent = ''; msg.className = ''; clearConsole(); });
// 先生モード：URL の さいごに ?sensei を つけると「こたえ」ボタンが でる
const params = new URLSearchParams(location.search);
if (params.has('sensei')) document.getElementById('answerBtn').style.display = '';
document.getElementById('answerBtn').addEventListener('click', () => {
  hideClearDialog();
  code.value = LV.answer; render(); save(); mark(0, ''); resetBoard();
  if (mode === 'blocks') codeToBlocks(LV.answer);
  msg.className = ''; msg.textContent = t('pyAnswerLoaded');
});
document.getElementById('tabBlocks').addEventListener('click', () => { if (!timer) setMode('blocks'); });
document.getElementById('tabPy').addEventListener('click', () => { if (!timer) setMode('python'); });
document.getElementById('dlgYes').addEventListener('click', () => { hideClearDialog(); setLevel(level + 1); });
document.getElementById('dlgNo').addEventListener('click', () => { hideClearDialog(); resetBoard(); mark(0, ''); msg.className = 'ok'; msg.textContent = t('pyRetry'); });
document.addEventListener('keydown', (e) => { if (clearDialog.classList.contains('show') && e.key === 'Escape') document.getElementById('dlgNo').click(); });

document.title = t('pyTitle');
document.getElementById('appTitle').textContent = t('pyTitle');
[['tabBlocks', 'tabBlocks'], ['tabPy', 'tabPy'], ['mapTitle', 'mapTitle'], ['hintBtn', 'hintBtn'], ['speedLbl', 'speed'],
 ['dlgTitle', 'dlgTitle'], ['dlgYes', 'yes'], ['dlgNo', 'no'], ['pyLabel', 'pyLabel']]
  .forEach(([id, k]) => { document.getElementById(id).textContent = t(k); });
setLabel(document.getElementById('run'), '▶', t('pyRun'));
setLabel(document.getElementById('reset'), '↺', t('pyReset'));
setLabel(document.getElementById('answerBtn'), '📖', t('pyAnswer'));
buildNav(document.getElementById('nav'));
FnMenu(document.getElementById('fnBtn'), [
  { icon: () => Sound.muted ? '🔇' : '🔊', label: () => Sound.muted ? t('soundOff') : t('soundOn'),
    onClick: (m) => { if (Sound.unlock) Sound.unlock(); Sound.toggle(); m.render(); if (!Sound.muted) Sound.turnRight(); } },
  langMenuItem(), nightMenuItem(), calmMenuItem(),
  { icon: () => '📜', label: () => t('certItem'), visible: allStagesCleared, onClick: (m) => { m.close(); showCertificate(false); } },
  { icon: () => resetArmed ? '⚠' : '🔄', label: () => resetArmed ? t('armedItem') : t('nextPerson'), warn: () => !!resetArmed,
    onClick: (m) => {
      if (!resetArmed) { msg.className = 'ng'; msg.textContent = t('armedMsg'); resetArmed = setTimeout(() => { resetArmed = null; m.render(); }, 4000); m.render(); return; }
      clearTimeout(resetArmed); resetArmed = null; m.close(); resetForNextPerson();
    } }
]);
fillLevels();
setLevel(Math.min(Number(store.get('-level')) || 0, LEVELS.length - 1));
// 「⚙ Python に きりかえる」で きたときは Python で ひらく
setMode(params.get('mode') === 'python' || store.get('-mode') === 'python' ? 'python' : 'blocks', true);
window.addEventListener('resize', () => { render(); Blockly.svgResize(workspace); });
if (params.has('mode')) { try { const u = new URL(location.href); u.searchParams.delete('mode'); history.replaceState(null, '', u); } catch (_) {} }
