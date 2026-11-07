/* =====================================================================
   📜 しゅうりょうしょう（修了証）
   ぜんぶの ステージを クリアしたら だす。めいろ・うちゅう・こわす・おく で きょうつう
   つかいかた：Certificate.show({ app: 'ブロックでめいろ', icons: ['⛏', '💎'] })
   - なまえは その ばで いれる（ほぞん しない：きょうゆうの たんまつでも あんしん）
   - ひづけは たんまつの ひづけ
   - 🖨 いんさつ（A4 よこ）／ 💾 がぞうで ほぞん
   ===================================================================== */
(function () {
  var ISSUER = {
    ja: ['舞鶴工業高等専門学校', '井上泰仁'],
    en: ['National Institute of Technology (KOSEN), Maizuru College', 'Yasuhito Inoue']
  };
  var TXT = {
    ja: {
      heading: '🎉 ぜんぶの ステージを クリア！', namePh: 'なまえを いれてね（なくても OK）',
      print: '🖨 いんさつ', save: '💾 がぞうで ほぞん', close: 'とじる',
      ruby: 'しゅうりょうしょう', title: '修 了 証', san: 'さん',
      body: function (app) { return ['あなたは「' + app + '」の', 'すべての ステージを クリアしました。', 'プログラミングで かんがえて、さいごまで', 'よく がんばりました。ここに これを しょうします。']; },
      date: function (d) { return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日'; },
      file: 'しゅうりょうしょう.png'
    },
    en: {
      heading: '🎉 You cleared every stage!', namePh: 'Type your name (optional)',
      print: '🖨 Print', save: '💾 Save as image', close: 'Close',
      ruby: '', title: 'Certificate of Completion', san: '',
      body: function (app) { return ['This certifies that the person named above', 'has cleared every stage of “' + app + '”.', 'You thought like a programmer and', 'never gave up. Great job!']; },
      date: function (d) {
        var M = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return M[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
      },
      file: 'certificate.png'
    }
  };
  var W = 1414, H = 1000;   // A4 よこ の ひりつ
  var SERIF = '"Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", "Times New Roman", serif';
  var PIXEL = '"DotGothic16", "MS Gothic", monospace';
  var el = null, opts = null, nameInput = null, img = null, canvas = null;

  function L() { return TXT[window.LANG === 'en' ? 'en' : 'ja']; }
  function issuer() { return ISSUER[window.LANG === 'en' ? 'en' : 'ja']; }

  function build() {
    var css = document.createElement('style');
    css.textContent =
      '#certOverlay{display:none;position:fixed;inset:0;z-index:400;background:rgba(0,0,0,.7);align-items:center;justify-content:center;padding:12px}' +
      '#certOverlay.show{display:flex}' +
      '#certBox{background:var(--panel-bg,#c6c6c6);color:var(--panel-text,#333);padding:12px 14px 14px;max-width:96vw;max-height:96vh;display:flex;flex-direction:column;gap:10px;align-items:center;' +
      'border:4px solid;border-color:var(--panel-light,#fff) var(--panel-dark,#555) var(--panel-dark,#555) var(--panel-light,#fff);outline:2px solid #000}' +
      '#certHeading{font-size:22px}' +
      '#certName{font:inherit;font-size:18px;padding:6px 10px;width:min(420px,80vw);border:3px solid;border-color:#555 #fff #fff #555;text-align:center}' +
      '#certImg{display:block;width:auto;height:auto;max-width:min(900px,90vw);max-height:62vh;box-shadow:0 4px 16px rgba(0,0,0,.4)}' +
      '.certBtns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}' +
      '.certBtns button{font-size:17px}' +
      '#certPrint{background:var(--run,#4f9a2d)}' +
      '@media print{' +
      '  @page{size:A4 landscape;margin:0}' +
      '  html,body{background:#fff !important;height:auto}' +
      '  body>*:not(#certOverlay){display:none !important}' +
      '  #certOverlay{position:static;display:flex !important;background:none;padding:0}' +
      '  #certBox{background:none;border:none;outline:none;padding:0;max-width:none;max-height:none;filter:none !important}' +
      '  #certHeading,#certName,.certBtns{display:none !important}' +
      '  #certOverlay,#certBox{width:100vw;height:100vh;overflow:hidden;align-items:center;justify-content:center}' +
      '  #certImg{width:100vw;height:100vh;max-height:none;object-fit:contain;box-shadow:none}' +
      '}';
    document.head.appendChild(css);
    el = document.createElement('div');
    el.id = 'certOverlay'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    el.innerHTML =
      '<div id="certBox"><div id="certHeading"></div>' +
      '<input id="certName" type="text" maxlength="20" autocomplete="off">' +
      '<img id="certImg" alt="">' +
      '<div class="certBtns"><button id="certPrint"></button><button id="certSave"></button><button id="certClose"></button></div></div>';
    document.body.appendChild(el);
    nameInput = el.querySelector('#certName');
    img = el.querySelector('#certImg');
    canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
    nameInput.addEventListener('input', draw);
    el.querySelector('#certPrint').addEventListener('click', function () { draw(); setTimeout(function () { window.print(); }, 50); });
    el.querySelector('#certSave').addEventListener('click', function () {
      draw();
      var a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = L().file;
      document.body.appendChild(a); a.click(); a.remove();
    });
    el.querySelector('#certClose').addEventListener('click', hide);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && el.classList.contains('show')) hide(); });
  }

  // もじが はばに おさまるように ちいさく する
  function fitText(c, text, font, size, maxW) {
    var s = size;
    do { c.font = font.replace('{s}', s); s -= 2; } while (c.measureText(text).width > maxW && s > 12);
  }

  function draw() {
    var c = canvas.getContext('2d'), t = L(), d = new Date(), name = (nameInput.value || '').trim();
    // かみ
    c.fillStyle = '#fffaf0'; c.fillRect(0, 0, W, H);
    // ドットの わく（2じゅう）
    var P = 10;
    for (var x = 0; x < W; x += P) for (var y = 0; y < H; y += P) {
      var edge = Math.min(x, y, W - P - x, H - P - y);
      if (edge < 3 * P) { c.fillStyle = ((x + y) / P) % 2 ? '#c99a2e' : '#e0b64a'; c.fillRect(x, y, P, P); }
      else if (edge < 4 * P) { c.fillStyle = '#fffaf0'; c.fillRect(x, y, P, P); }
      else if (edge < 5 * P) { c.fillStyle = '#8a6a1f'; c.fillRect(x, y, P, P); }
    }
    // すみの アイコン
    var icons = (opts && opts.icons) || ['⭐', '⭐'];
    c.font = '64px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(icons[0], 120, 120); c.fillText(icons[1], W - 120, 120);
    c.fillText(icons[1], 120, H - 120); c.fillText(icons[0], W - 120, H - 120);
    // タイトル
    c.fillStyle = '#3a2a10';
    if (t.ruby) { c.font = '22px ' + PIXEL; c.fillText(t.ruby, W / 2, 128); }
    fitText(c, t.title, 'bold {s}px ' + SERIF, window.LANG === 'en' ? 72 : 92, W - 360);
    c.fillText(t.title, W / 2, 205);
    // なまえ
    c.strokeStyle = '#3a2a10'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(W / 2 - 300, 352); c.lineTo(W / 2 + 300, 352); c.stroke();
    if (name) { fitText(c, name, 'bold {s}px ' + SERIF, 60, 560); c.fillText(name, W / 2 - (t.san ? 30 : 0), 315); }
    if (t.san) { c.font = '34px ' + SERIF; c.textAlign = 'left'; c.fillText(t.san, W / 2 + 310, 325); c.textAlign = 'center'; }
    // ほんぶん
    var lines = t.body((opts && opts.app) || '');
    lines.forEach(function (ln, i) { fitText(c, ln, '{s}px ' + SERIF, 38, W - 340); c.fillText(ln, W / 2, 445 + i * 62); });
    // ひづけ・だす ひと
    c.font = '32px ' + SERIF; c.fillText(t.date(d), W / 2, 735);
    var iss = issuer();
    fitText(c, iss[0], '{s}px ' + SERIF, 34, W - 360); c.fillText(iss[0], W / 2, 810);
    c.font = 'bold 40px ' + SERIF; c.fillText(iss[1], W / 2, 870);
    img.src = canvas.toDataURL('image/png');
  }

  function show(o) {
    opts = o || {};
    if (!el) build();
    var t = L();
    el.querySelector('#certHeading').textContent = t.heading;
    nameInput.placeholder = t.namePh;
    el.querySelector('#certPrint').textContent = t.print;
    el.querySelector('#certSave').textContent = t.save;
    el.querySelector('#certClose').textContent = t.close;
    img.alt = t.title.replace(/ /g, '');
    el.classList.add('show');
    var go = function () { draw(); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(go); else go();
    draw();
    setTimeout(function () { nameInput.focus(); }, 50);
  }
  function hide() { if (el) el.classList.remove('show'); if (opts && opts.onClose) { var f = opts.onClose; opts.onClose = null; f(); } }
  // つぎの ひとへ：なまえを けす
  function clearName() { if (nameInput) nameInput.value = ''; }

  window.Certificate = { show: show, hide: hide, clearName: clearName };
})();
