/* =====================================================================
   📱 スマホの ならび（はば 600px いか の ときだけ）
   - うえに ばんめん、したに プログラム、いちばん したに ブロックの たな と ▶ じっこう
   - ブロックは ドラッグ ではなく「タップで たす」
     （うらでは いつもの Blockly の ワークスペースを そのまま つかうので、
       ほぞん・こたえあわせ・じっこう は PC と まったく おなじ）
   - Python版：ブロック タブの ときは おなじ タップ、Python タブの ときは
     めいれいボタンに「→| さげる」「|← あげる」を たす
   ===================================================================== */
(function () {
  'use strict';
  var MQ = window.matchMedia('(max-width: 600px)');
  var LANGX = function () { return (window.LANG === 'en') ? 'en' : 'ja'; };
  var S = {
    ja: { prog: 'プログラム', n: 'こ', clearAll: 'ぜんぶ けす', confirmClear: 'ブロックを ぜんぶ けしても いい？',
          empty: 'したの ブロックを タップすると、ここに ならぶよ', addEnd: '＋ ここに つける', addIn: '＋ ここに いれる',
          up: 'うえへ', del: 'けす', newVar: '＋ へんすうを つくる', varPrompt: 'へんすうの なまえは？',
          pickSlot: 'さきに、いれたい ところの ◇ を タップしてね', pick: 'ここに ブロックを いれる', indent: '→| さげる', dedent: '|← あげる', blocks: 'ブロック' },
    en: { prog: 'Program', n: '', clearAll: 'Clear all', confirmClear: 'Delete all blocks?',
          empty: 'Tap a block below to add it here', addEnd: '+ Add here', addIn: '+ Put inside',
          up: 'Move up', del: 'Delete', newVar: '+ Make a variable', varPrompt: 'Variable name?',
          pickSlot: 'First tap the ◇ where it should go', pick: 'Put a block here', indent: '→| Indent', dedent: '|← Unindent', blocks: 'Blocks' }
  };
  var tr = function (k) { return S[LANGX()][k]; };

  var ws = null, B = window.Blockly;
  var on = false, sel = null, cat = 0, lastDef = null, pending = false, curId = null;
  var hasVal = false, ed, list, head, bar, pal, cats, runRow, moved = [];

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  /* ---------- ばしょを つくる ---------- */
  function build() {
    var bd = document.getElementById('blocklyDiv');
    ed = el('div'); ed.id = 'tapEd';
    head = el('div', 'tapHead');
    list = el('div', 'tapList');
    ed.appendChild(head); ed.appendChild(list);
    bd.parentNode.insertBefore(ed, bd.nextSibling);

    bar = el('div'); bar.id = 'mobBar';
    cats = el('div', 'mobCats'); pal = el('div', 'mobPal'); pal.id = 'mobPal';
    var palWrap = el('div'); palWrap.id = 'mobPalWrap';
    palWrap.appendChild(cats); palWrap.appendChild(pal);
    runRow = el('div', 'mobRun');
    bar.appendChild(palWrap); bar.appendChild(runRow);
    document.body.appendChild(bar);

    // Python タブ：さげる・あげる ボタン
    var py = document.getElementById('palette'), code = document.getElementById('code');
    if (py && code) {
      [['dedent', -1], ['indent', 1]].forEach(function (p) {
        var b = el('button', 'mobOnly pyInd'); b.dataset.k = p[0];
        b.addEventListener('click', function () { indent(code, p[1]); });
        py.insertBefore(b, py.firstChild);
      });
    }
  }

  function indent(code, d) {
    if (code.readOnly) return;
    var v = code.value, s = code.selectionStart, ls = v.lastIndexOf('\n', s - 1) + 1;
    if (d > 0) { code.setRangeText('    ', ls, ls, 'end'); code.setSelectionRange(s + 4, s + 4); }
    else { var m = v.slice(ls).match(/^ {1,4}/); if (!m) return; code.setRangeText('', ls, ls + m[0].length, 'end'); var ns = Math.max(ls, s - m[0].length); code.setSelectionRange(ns, ns); }
    code.dispatchEvent(new Event('input', { bubbles: true }));
    code.focus();
  }

  /* ---------- PC ⇄ スマホ ---------- */
  function apply() {
    var want = MQ.matches;
    if (want === on) return;
    on = want;
    document.body.classList.toggle('mobile', on);
    var hdr = document.querySelector('header');
    if (on) {
      ['run', 'reset', 'clear'].forEach(function (id) {
        var b = document.getElementById(id);
        if (b && hdr.contains(b)) { moved.push({ b: b, p: b.parentNode, n: b.nextSibling }); runRow.appendChild(b); }
      });
      render();
    } else {
      moved.reverse().forEach(function (m) { m.p.insertBefore(m.b, m.n && m.n.parentNode === m.p ? m.n : null); });
      moved = [];
      if (ws) setTimeout(function () { B.svgResize(ws); }, 0);
    }
    pad();
  }
  function pad() { document.body.style.paddingBottom = on ? (bar.offsetHeight + 8) + 'px' : ''; }

  /* ---------- ツールボックス → たなの ブロック ---------- */
  function toolboxDef() { return lastDef || (ws.options && ws.options.languageTree) || null; }
  function groups() {
    var d = toolboxDef(); if (!d) return [];
    var c = d.contents || [];
    if (c.some(function (x) { return x.kind === 'category'; })) {
      return c.filter(function (x) { return x.kind === 'category'; }).map(function (x) {
        return { name: x.name, colour: x.colour, items: x.custom === 'VARIABLE' ? varItems() : (x.contents || []).filter(function (y) { return y.kind === 'block'; }) };
      });
    }
    return [{ name: '', items: c.filter(function (y) { return y.kind === 'block'; }) }];
  }
  function varItems() {
    var vs = ws.getAllVariables ? ws.getAllVariables() : ws.getVariableMap().getAllVariables();
    var out = [{ kind: '_newVar' }];
    vs.forEach(function (v) {
      var id = v.getId();
      out.push({ kind: 'block', type: 'variables_set', fields: { VAR: { id: id } }, inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } });
      out.push({ kind: 'block', type: 'math_change', fields: { VAR: { id: id } }, inputs: { DELTA: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } });
      out.push({ kind: 'block', type: 'variables_get', fields: { VAR: { id: id } } });
    });
    return out;
  }
  function stateOf(item) { var s = JSON.parse(JSON.stringify(item)); delete s.kind; return s; }

  var infoCache = {};
  function info(item) {   // ブロックの もじ・いろ・かたち を しらべる
    var key = JSON.stringify(item) + '|' + LANGX();
    if (item.fields && item.fields.VAR) { var vv = ws.getVariableById(item.fields.VAR.id); key += '|' + (vv ? (vv.getName ? vv.getName() : vv.name) : ''); }
    if (infoCache[key]) return infoCache[key];
    var res = { label: item.type, colour: '#777', stmt: true, value: false };
    // ほんものの ワークスペースを よごさないように、みえない べつの ワークスペースで ためす
    var g = B.Events.isEnabled(); B.Events.disable();
    var tmp = new B.Workspace();
    try {
      (ws.getAllVariables ? ws.getAllVariables() : ws.getVariableMap().getAllVariables()).forEach(function (v) { tmp.createVariable(v.getName ? v.getName() : v.name, v.getType ? v.getType() : v.type, v.getId()); });
      var b = B.serialization.blocks.append(stateOf(item), tmp);
      res = { label: blockText(b), colour: b.getColour(), stmt: !!b.previousConnection, value: !!b.outputConnection };
    } catch (e) { /* よめない ブロックは なまえだけ */ }
    tmp.dispose();
    if (g) B.Events.enable();
    infoCache[key] = res;
    return res;
  }
  function blockText(b) {
    var t = [];
    b.inputList.forEach(function (inp) {
      inp.fieldRow.forEach(function (f) { var x = f.getText(); if (x && x.trim()) t.push(x.trim()); });
      if (inp.connection && inp.connection.type === B.ConnectionType.INPUT_VALUE) {
        var c = inp.connection.targetBlock(); t.push(c ? blockText(c) : '□');
      }
    });
    return t.join(' ').replace(/\s+/g, ' ');
  }

  function renderPal() {
    var gs = groups();
    if (cat >= gs.length) cat = 0;
    cats.innerHTML = ''; pal.innerHTML = '';
    cats.style.display = gs.length > 1 ? '' : 'none';
    gs.forEach(function (g, i) {
      var b = el('button', 'mobCat' + (i === cat ? ' on' : ''), g.name);
      b.addEventListener('click', function () { cat = i; renderPal(); pad(); });
      cats.appendChild(b);
    });
    var g = gs[cat]; if (!g) return;
    g.items.forEach(function (item) {
      if (item.kind === '_newVar') {
        var nb = el('button', 'mobChip var', tr('newVar'));
        nb.addEventListener('click', function () {
          var name = window.prompt(tr('varPrompt'));
          if (name && name.trim()) { ws.createVariable(name.trim()); renderPal(); }
        });
        pal.appendChild(nb); return;
      }
      var inf = info(item);
      var b = el('button', 'mobChip' + (inf.value ? ' val' : ''), (inf.value ? '' : '＋ ') + inf.label);
      b.style.background = inf.colour;
      b.addEventListener('click', function () { add(item, inf); });
      pal.appendChild(b);
    });
  }

  /* ---------- ブロックを たす ---------- */
  function mainStack() {
    var tops = ws.getTopBlocks(true).filter(function (b) { return b.nextConnection; });
    return tops[0] || null;
  }
  function lastIn(b) { while (b && b.getNextBlock()) b = b.getNextBlock(); return b; }
  function stmtTarget() {
    if (sel && sel.kind === 'stmt') {
      var p = ws.getBlockById(sel.id), inp = p && p.getInput(sel.input);
      if (inp && inp.connection) { var f = inp.connection.targetBlock(); return f ? lastIn(f).nextConnection : inp.connection; }
      sel = null;
    }
    var m = mainStack(); return m ? lastIn(m).nextConnection : null;
  }
  function bottomY() {
    var y = 10;
    ws.getTopBlocks(false).forEach(function (b) { var xy = b.getRelativeToSurfaceXY(), hw = b.getHeightWidth(); y = Math.max(y, xy.y + hw.height); });
    return y + 30;
  }
  function add(item, inf) {
    if (inf.value) {
      if (!sel || sel.kind !== 'val') { flash(tr('pickSlot')); return; }
      var pb = ws.getBlockById(sel.id), inp = pb && pb.getInput(sel.input);
      if (!inp) { sel = null; return; }
      B.Events.setGroup(true);
      var vb = B.serialization.blocks.append(stateOf(item), ws);
      var old = inp.connection.targetBlock();
      if (old && !old.isShadow()) old.dispose(false);
      inp.connection.connect(vb.outputConnection);
      B.Events.setGroup(false);
      sel = null; schedule(); return;
    }
    var conn = inf.stmt ? stmtTarget() : null;   // つなぐ さきは、たす まえに きめる
    B.Events.setGroup(true);
    var nb = B.serialization.blocks.append(stateOf(item), ws);
    if (conn && nb.previousConnection) conn.connect(nb.previousConnection);
    else nb.moveBy(20, ws.getTopBlocks(false).length > 1 ? bottomY() : 20);
    B.Events.setGroup(false);
    // なかに いれられる ブロック（くりかえす など）は、つぎから その なかに たす
    var si = nb.inputList.filter(function (i) { return i.connection && i.connection.type === B.ConnectionType.NEXT_STATEMENT; })[0];
    if (si) sel = { kind: 'stmt', id: nb.id, input: si.name };
    schedule();
    setTimeout(function () { var r = list.querySelector('[data-id="' + nb.id + '"]'); if (r && r.scrollIntoView) r.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 60);
  }
  function flash(t) {
    var f = el('div', 'tapFlash', t); ed.appendChild(f);
    setTimeout(function () { f.remove(); }, 2200);
  }

  function moveUp(b) {
    var prev = b.getPreviousBlock();
    if (!prev || prev.nextConnection.targetBlock() !== b) return;   // さいしょの ブロックは うごかさない
    B.Events.setGroup(true);
    var parentConn = prev.previousConnection ? prev.previousConnection.targetConnection : null;
    b.unplug(true);
    if (parentConn) parentConn.connect(b.previousConnection);
    else { var xy = prev.getRelativeToSurfaceXY(), bxy = b.getRelativeToSurfaceXY(); b.moveBy(xy.x - bxy.x, xy.y - bxy.y); b.nextConnection.connect(prev.previousConnection); }
    B.Events.setGroup(false);
  }

  /* ---------- プログラムを かく ---------- */
  function schedule() { if (pending || !on) return; pending = true; requestAnimationFrame(function () { pending = false; render(); }); }
  var num = 0;
  function render() {
    if (!on || !ws) return;
    var sy = list.scrollTop;
    num = 0;
    // かず・へんすうの ブロックが たなに ある ときだけ ◇（いれる ばしょを えらぶ）を だす
    hasVal = groups().some(function (g) { return g.items.some(function (it) { return it.kind === '_newVar' || info(it).value; }); });
    var count = ws.getAllBlocks(false).filter(function (b) { return !b.isShadow(); }).length;
    head.innerHTML = '';
    head.appendChild(el('span', 'tapTitle', tr('prog') + '（' + count + tr('n') + '）'));
    var cb = el('button', 'tapClear', tr('clearAll'));
    cb.addEventListener('click', function () { if (count && window.confirm(tr('confirmClear'))) { ws.clear(); sel = null; } });
    head.appendChild(cb);

    list.innerHTML = '';
    var tops = ws.getTopBlocks(true);
    tops.forEach(function (t, i) {
      if (i) list.appendChild(el('div', 'tapGap'));
      chain(t, list);
    });
    if (!tops.length) list.appendChild(el('div', 'tapEmpty', tr('empty')));
    var endSlot = slotBtn(null, null, tr('addEnd'));
    list.appendChild(endSlot);
    list.scrollTop = sy;
    renderPal(); pad();
  }
  function chain(b, into) { for (; b; b = b.getNextBlock()) into.appendChild(row(b)); }

  function row(b) {
    var wrap = el('div', 'tapBlk'); wrap.dataset.id = b.id;
    var col = b.getColour();
    wrap.style.setProperty('--c', col);
    if (b.id === curId) wrap.classList.add('cur');
    var r = el('div', 'tapRow');
    r.appendChild(el('span', 'tapNum', String(++num)));
    var parts = el('span', 'tapParts'); r.appendChild(parts);
    wrap.appendChild(r);
    var firstRow = true, curParts = parts;
    b.inputList.forEach(function (inp) {
      if (inp.isVisible && !inp.isVisible()) return;
      var st = inp.connection && inp.connection.type === B.ConnectionType.NEXT_STATEMENT;
      if (st) {
        inp.fieldRow.forEach(function (f) { var x = fieldEl(f); if (x) curParts.appendChild(x); });
        var nest = el('div', 'tapNest');
        chain(inp.connection.targetBlock(), nest);
        nest.appendChild(slotBtn(b.id, inp.name, tr('addIn')));
        wrap.appendChild(nest);
        var cont = el('div', 'tapRow sub'); curParts = el('span', 'tapParts'); cont.appendChild(curParts);
        wrap.appendChild(cont);
        firstRow = false;
        return;
      }
      inp.fieldRow.forEach(function (f) { var x = fieldEl(f); if (x) curParts.appendChild(x); });
      if (inp.connection && inp.connection.type === B.ConnectionType.INPUT_VALUE) curParts.appendChild(valEl(b, inp));
    });
    // からっぽの つづきの ぎょうは けす
    Array.prototype.slice.call(wrap.querySelectorAll(':scope > .tapRow.sub')).forEach(function (x) { if (!x.textContent.trim()) x.remove(); });

    var up = el('button', 'tapBtn', '▲'); up.setAttribute('aria-label', tr('up'));
    up.addEventListener('click', function () { moveUp(b); });
    var del = el('button', 'tapBtn', '×'); del.setAttribute('aria-label', tr('del'));
    del.addEventListener('click', function () { if (sel && (sel.id === b.id || b.getDescendants(false).some(function (d) { return d.id === sel.id; }))) sel = null; b.dispose(true); });
    r.appendChild(up); r.appendChild(del);
    return wrap;
  }

  function slotBtn(id, input, label) {
    var isSel = id ? (sel && sel.kind === 'stmt' && sel.id === id && sel.input === input) : !(sel && sel.kind === 'stmt');
    var s = el('button', 'tapSlot' + (isSel ? ' on' : ''), label);
    s.addEventListener('click', function () { sel = id ? { kind: 'stmt', id: id, input: input } : null; render(); });
    return s;
  }

  function fieldEl(f) {
    if (f.isVisible && !f.isVisible()) return null;
    var blk = f.getSourceBlock();
    if (B.FieldDropdown && f instanceof B.FieldDropdown) {
      var s = el('select', 'tapSel');
      var opts = [];
      try { opts = f.getOptions(false); } catch (e) { opts = []; }
      opts.forEach(function (o) {
        if (o[1] === 'RENAME_VARIABLE_ID' || o[1] === 'DELETE_VARIABLE_ID') return;
        var op = el('option', null, typeof o[0] === 'string' ? o[0] : (o[0] && o[0].alt) || o[1]);
        op.value = o[1]; s.appendChild(op);
      });
      s.value = f.getValue();
      s.addEventListener('change', function () { f.setValue(s.value); });
      if (blk.isShadow()) s.addEventListener('click', function (e) { e.stopPropagation(); });
      return s;
    }
    if (B.FieldTextInput && f instanceof B.FieldTextInput) {
      var isNum = B.FieldNumber && f instanceof B.FieldNumber;
      var i = el('input', 'tapIn');
      i.type = isNum ? 'number' : 'text'; if (isNum) i.inputMode = 'decimal';
      i.value = f.getValue(); i.size = Math.max(2, String(f.getValue()).length + 1);
      i.addEventListener('change', function () { f.setValue(isNum ? Number(i.value) : i.value); });
      i.addEventListener('click', function (e) { e.stopPropagation(); });
      return i;
    }
    var t = f.getText();
    return t && t.trim() ? el('span', 'tapLbl', t) : null;
  }

  function valEl(b, inp) {
    var child = inp.connection.targetBlock();
    var isSel = sel && sel.kind === 'val' && sel.id === b.id && sel.input === inp.name;
    var v = el('span', 'tapVal' + (isSel ? ' on' : ''));
    v.tabIndex = 0;
    v.addEventListener('click', function (e) { e.stopPropagation(); sel = isSel ? null : { kind: 'val', id: b.id, input: inp.name }; render(); });
    if (hasVal) {
    var pk = el('button', 'tapPick', '◇'); pk.setAttribute('aria-label', tr('pick'));   // かず・へんすうを いれる ばしょを えらぶ
    pk.addEventListener('click', function (e) { e.stopPropagation(); sel = isSel ? null : { kind: 'val', id: b.id, input: inp.name }; render(); });
    v.appendChild(pk);
    }
    if (!child) { v.appendChild(el('span', 'tapLbl', '□')); return v; }
    if (!child.isShadow()) v.style.background = child.getColour();
    child.inputList.forEach(function (ci) {
      ci.fieldRow.forEach(function (f) { var x = fieldEl(f); if (x) v.appendChild(x); });
      if (ci.connection && ci.connection.type === B.ConnectionType.INPUT_VALUE) v.appendChild(valEl(child, ci));
    });
    if (!child.isShadow()) {
      var x = el('button', 'tapX', '×'); x.setAttribute('aria-label', tr('del'));
      x.addEventListener('click', function (e) { e.stopPropagation(); child.dispose(false); });
      v.appendChild(x);
    }
    return v;
  }

  /* ---------- はじめる ---------- */
  function init() {
    if (!B || typeof workspace === 'undefined' || !document.getElementById('blocklyDiv')) return;
    ws = workspace;   // eslint-disable-line no-undef
    build();
    ws.addChangeListener(function (e) { if (!e.isUiEvent) schedule(); });
    var upd = ws.updateToolbox.bind(ws);
    ws.updateToolbox = function (d) { lastDef = d; infoCache = {}; upd(d); schedule(); };
    var hl = ws.highlightBlock.bind(ws);
    ws.highlightBlock = function (id, state) {   // うごいている ブロックを ひからせる
      hl(id, state);
      curId = id || null;
      if (!on) return;
      Array.prototype.forEach.call(list.querySelectorAll('.tapBlk.cur'), function (x) { x.classList.remove('cur'); });
      if (id) { var r = list.querySelector('[data-id="' + id + '"]'); if (r) r.classList.add('cur'); }
    };
    // ▶ じっこう：ばんめんが みえる ところまで もどる
    var run = document.getElementById('run');
    if (run) run.addEventListener('click', function () {
      if (!on) return;
      var bd = document.querySelector('#stage .board');
      if (bd) { var top = bd.getBoundingClientRect().top; if (top < 0 || top > window.innerHeight * 0.4) bd.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    });
    // Python の タブを かえた ときも かきなおす
    var cs = document.getElementById('codeSide');
    if (cs && window.MutationObserver) new MutationObserver(function () { schedule(); pad(); }).observe(cs, { attributes: true, attributeFilter: ['class'] });
    // ことばを かえた とき
    document.addEventListener('langchange', function () { infoCache = {}; schedule(); });
    Array.prototype.forEach.call(document.querySelectorAll('.pyInd'), function (b) { b.textContent = tr(b.dataset.k); });
    (MQ.addEventListener ? MQ.addEventListener('change', apply) : MQ.addListener(apply));
    window.addEventListener('resize', pad);
    apply();
  }
  if (document.readyState === 'complete') init(); else window.addEventListener('load', init);
})();
