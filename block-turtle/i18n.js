/* =====================================================================
   にほんご ／ English の きりかえ（4つの アプリで きょうつう）
   - えらんだ ことばは ブラウザに おぼえておく（URL に ?lang=en でも OK）
   - Blockly の ことば（右クリックの メニューなど）も あわせて よみこむ
   - かならず Blockly 本体の あと、ページの プログラムの まえに よみこむ
   ===================================================================== */
(function () {
  var params = new URLSearchParams(location.search);
  var lang = params.get('lang');
  try { lang = lang || localStorage.getItem('block-lang'); } catch (e) {}
  if (lang !== 'en') lang = 'ja';
  try { localStorage.setItem('block-lang', lang); } catch (e) {}
  window.LANG = lang;
  document.documentElement.lang = lang;

  // Blockly の ことばの ファイル（ページを よみこむ とちゅうで いれる）
  if (window.Blockly) document.write('<script src="https://unpkg.com/blockly@11/msg/' + lang + '.js"><\/script>');

  // ことばを きりかえて よみなおす（くんだ ブロックは ブラウザに ほぞん されているので きえない）
  window.setLang = function (l) {
    try { localStorage.setItem('block-lang', l); } catch (e) {}
    var u = new URL(location.href);
    u.searchParams.delete('lang');
    location.href = u.toString();
  };

  // t('key', ...) で いまの ことばの もじを とりだす
  window.makeT = function (STR) {
    return function (k) {
      var args = Array.prototype.slice.call(arguments, 1);
      var s = (STR[lang] && STR[lang][k] !== undefined) ? STR[lang][k] : STR.ja[k];
      if (typeof s === 'function') return s.apply(null, args);
      return s === undefined ? k : s;
    };
  };

  // data-i18n="key" の ついた ところに もじを いれる
  window.applyI18n = function (t) {
    document.querySelectorAll('[data-i18n]').forEach(function (e) { e.textContent = t(e.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach(function (e) { e.innerHTML = t(e.dataset.i18nHtml); });
    document.querySelectorAll('[data-i18n-title]').forEach(function (e) {
      e.title = t(e.dataset.i18nTitle); e.setAttribute('aria-label', e.title);
    });
  };

  // アイコン＋ことば の ボタン（せまい がめんでは ことばを かくす）
  window.setLabel = function (el, icon, label) {
    el.innerHTML = '';
    var i = document.createElement('span'); i.className = 'ico'; i.textContent = icon;
    var l = document.createElement('span'); l.className = 'lbl'; l.textContent = label;
    el.appendChild(i); el.appendChild(l);
    el.title = label; el.setAttribute('aria-label', label);
  };

  // ことばの きりかえ ボタン
  window.langButton = function (btn) {
    window.setLabel(btn, '🌐', lang === 'ja' ? 'English' : 'にほんご');
    btn.addEventListener('click', function () { window.setLang(lang === 'ja' ? 'en' : 'ja'); });
  };


  /* -------------------------------------------------------------------
     ⚙「きのう」メニュー：おと・ことば・リセット などを 1つの ボタンに まとめる
     items: [{ icon: () => '🔊', label: () => 'おと：オン', onClick: (menu) => {...}, warn: () => false }]
     menu.render() で ひょうじを なおす、menu.close() で とじる
     ------------------------------------------------------------------- */
  window.FnMenu = function (btn, items) {
    window.setLabel(btn, '⚙', lang === 'ja' ? 'きのう' : 'Settings');
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    var box = document.createElement('div');
    box.className = 'fnMenu'; box.setAttribute('role', 'menu');
    document.body.appendChild(box);   // ヘッダーの そとに おく（きれないように）
    // 🐍 Python に きりかえる ／ 🧩 ブロックに もどる：たいおうする ページが ある ときだけ、いちばん うえに だす
    var sw = window.pythonMenuItem();
    if (sw) items = [sw].concat(items);
    // 📝 リリースノート：どの ページでも ページへ いく こうもくの つぎに だす（リリースノートの ページ いがい）
    // 🎮 あそびかた・べんきょうの しかた も、ページへ いく こうもくの つぎに ならべる
    var pages = [];
    if (!/howto\.html$/.test(location.pathname)) pages.push(window.howtoMenuItem());
    if (!/videos\.html$/.test(location.pathname)) pages.push(window.pageMenuItem('🎬', 'どうが（かいせつ どうが）', 'Videos', 'videos.html'));
    if (!/guide\.html$/.test(location.pathname)) pages.push(window.pageMenuItem('📖', 'かいせつしょ', 'Guide book', 'guide.html'));
    if (!/releases\.html$/.test(location.pathname)) pages.push(window.releaseMenuItem());
    if (pages.length) {
      var at = items.length && items[0].cls === 'go' ? 1 : 0;
      pages.forEach(function (p, k) { p.cls = k === pages.length - 1 ? 'go2' : 'go3'; });
      items = items.slice(0, at).concat(pages, items.slice(at));
    }
    // ⛏ めいろの なかま（ふつう・やじるし・かぎと とびら・てき）：めいろの ページ どうしで いききできる
    var fam = window.mazeFamilyItems();
    if (fam.length) {
      var at2 = (items.length && items[0].cls === 'go' ? 1 : 0) + pages.length;
      fam.forEach(function (p, k) { p.cls = k === fam.length - 1 ? 'go2' : 'go3'; });
      items = items.slice(0, at2).concat(fam, items.slice(at2));
    }
    // 🔤 フォントを かえる：「おちついた いろ」の つぎに だす（どの ページでも）
    var ci = -1;
    items.forEach(function (it, k) { if (it._calm) ci = k; });
    if (ci >= 0) items = items.slice(0, ci + 1).concat([window.fontMenuItem()], items.slice(ci + 1));
    var menu = {
      render: function () {
        box.innerHTML = '';
        items.forEach(function (it) {
          if (it.visible && !it.visible()) return;
          var b = document.createElement('button');
          b.className = 'fnItem' + (it.warn && it.warn() ? ' warn' : '') + (it.cls ? ' ' + it.cls : '');
          b.setAttribute('role', 'menuitem');
          var i = document.createElement('span'); i.className = 'fnIco'; i.textContent = it.icon();
          var l = document.createElement('span'); l.textContent = it.label();
          b.appendChild(i); b.appendChild(l);
          if (it.badge && it.badge()) { var nb = document.createElement('span'); nb.className = 'fnNew'; nb.textContent = it.badge(); b.appendChild(nb); }
          b.addEventListener('click', function (e) { e.stopPropagation(); it.onClick(menu); });
          box.appendChild(b);
        });
      },
      open: function () {
        menu.render();
        var r = btn.getBoundingClientRect();
        box.style.top = (r.bottom + 6) + 'px';
        box.style.right = Math.max(6, window.innerWidth - r.right) + 'px';
        box.classList.add('show'); btn.setAttribute('aria-expanded', 'true');
        var first = box.querySelector('button'); if (first) first.focus();
      },
      close: function () { box.classList.remove('show'); btn.setAttribute('aria-expanded', 'false'); },
      isOpen: function () { return box.classList.contains('show'); },
      el: box
    };
    btn.addEventListener('click', function (e) { e.stopPropagation(); menu.isOpen() ? menu.close() : menu.open(); });
    document.addEventListener('pointerdown', function (e) {
      if (menu.isOpen() && !box.contains(e.target) && !btn.contains(e.target)) menu.close();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.isOpen()) { menu.close(); btn.focus(); } });
    window.addEventListener('resize', function () { menu.close(); });
    return menu;
  };

  // ブロックの アプリ ⇄ Python版 の くみあわせ
  var PY_PAIRS = { 'index.html': 'python-draw.html', 'maze.html': 'python.html', 'space.html': 'python-space.html', 'craft.html': 'python-craft.html' };
  // メニューの「🐍 Python に きりかえる」（Python版では「🧩 ブロックに もどる」）の こうもく
  window.pythonMenuItem = function () {
    var here = location.pathname.split('/').pop() || 'index.html';
    var toPy = PY_PAIRS[here], toBlock = null;
    Object.keys(PY_PAIRS).forEach(function (b) { if (PY_PAIRS[b] === here) toBlock = b; });
    if (!toPy && !toBlock) return null;   // たいおうする ページが ない（おえかき・すいぞくかん など）
    return {
      cls: 'go',
      icon: function () { return toPy ? '🐍' : '🧩'; },
      label: function () {
        if (toPy) return lang === 'ja' ? 'Python に きりかえる' : 'Switch to Python';
        return lang === 'ja' ? 'ブロックの アプリに もどる' : 'Back to the block app';
      },
      // Python版へは、すぐ かけるように Python の がめんで ひらく
      onClick: function () { location.href = toPy ? toPy + '?mode=python' : toBlock; }
    };
  };

  // ⛏ めいろの なかま：いまの ページが この なかに あれば、ほかの めいろへの こうもくを つくる
  var MAZES = [
    { href: 'maze.html',        icon: '⛏', ja: 'ブロックでめいろ', en: 'Block Maze' },
    { href: 'maze-junior.html', icon: '🧭', ja: 'やじるしの めいろ（ていがくねん）', en: 'Arrow Maze (younger kids)' },
    { href: 'maze-key.html',    icon: '🗝', ja: 'かぎと とびらの めいろ', en: 'Keys & Doors Maze' },
    { href: 'maze-enemy.html',  icon: '👾', ja: 'てきを よける めいろ', en: 'Dodge the Slime Maze' }
  ];
  window.MAZES = MAZES;
  window.mazeFamilyItems = function () {
    var here = location.pathname.split('/').pop() || 'index.html';
    if (!MAZES.some(function (m) { return m.href === here; })) return [];
    return MAZES.filter(function (m) { return m.href !== here; }).map(function (m) {
      return window.pageMenuItem(m.icon, m.ja, m.en, m.href);
    });
  };

  // 🎮 あそびかた・べんきょうの しかた（しょうかいの ページへ いく）
  window.howtoMenuItem = function () {
    return {
      icon: function () { return '🎮'; },
      label: function () { return lang === 'ja' ? 'あそびかた・べんきょうの しかた' : 'How to play and learn'; },
      onClick: function () { location.href = 'howto.html'; }
    };
  };

  // 🎬 どうが・📖 かいせつしょ など、ページへ いく こうもく
  window.pageMenuItem = function (icon, ja, en, href) {
    return {
      icon: function () { return icon; },
      label: function () { return lang === 'ja' ? ja : en; },
      onClick: function () { location.href = href; }
    };
  };

  // 📝 リリースノート：あたらしい バージョンを だしたら、ここと releases.html の いちばん うえを そろえる
  var RELEASE_VERSION = '1.16';
  window.RELEASE_VERSION = RELEASE_VERSION;
  function releaseSeen() { try { return localStorage.getItem('block-release-seen') === RELEASE_VERSION; } catch (e) { return true; } }
  window.markReleaseSeen = function () { try { localStorage.setItem('block-release-seen', RELEASE_VERSION); } catch (e) {} };
  window.releaseMenuItem = function () {
    return {
      cls: 'go2',
      icon: function () { return '📝'; },
      label: function () { return lang === 'ja' ? 'リリースノート（v' + RELEASE_VERSION + '）' : 'Release notes (v' + RELEASE_VERSION + ')'; },
      badge: function () { return releaseSeen() ? '' : 'NEW'; },
      onClick: function () { location.href = 'releases.html'; }
    };
  };

  // メニューの「ことば」の こうもく
  window.langMenuItem = function () {
    return {
      icon: function () { return '🌐'; },
      label: function () { return lang === 'ja' ? 'English（えいご）に する' : '日本語 (Japanese)'; },
      onClick: function () { window.setLang(lang === 'ja' ? 'en' : 'ja'); }
    };
  };


  /* -------------------------------------------------------------------
     みための せってい：🌙 ナイトモード ／ 🎨 おちついた いろ
     5つの アプリで きょうつう。ページを ひらいた すぐに あてるので ちらつかない
     ------------------------------------------------------------------- */
  var look = { night: false, calm: false, ud: false };
  try {
    look.night = localStorage.getItem('block-night') === '1'; look.calm = localStorage.getItem('block-calm') === '1';
    look.ud = localStorage.getItem('block-font') === 'ud';
  } catch (e) {}
  // 🔤 よみやすい フォント（UD フォント）：Google Fonts から よみこむ。つながらない ときは パソコンの フォントで だす
  var UD_FAMILY = '"BIZ UDPGothic", "BIZ UDPゴシック", "Hiragino Maru Gothic ProN", "Hiragino Sans", "Meiryo", sans-serif';
  var UD_MONO = '"BIZ UDGothic", "BIZ UDゴシック", "Osaka-Mono", "MS Gothic", monospace';
  window.UD_FAMILY = UD_FAMILY;
  function loadUdFont() {
    if (document.getElementById('udFontCss')) return;
    var l = document.createElement('link');
    l.id = 'udFontCss'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=BIZ+UDPGothic:wght@400;700&family=BIZ+UDGothic:wght@400;700&display=swap';
    (document.head || document.documentElement).appendChild(l);
  }
  function applyLook() {
    document.documentElement.classList.toggle('theme-night', look.night);
    document.documentElement.classList.toggle('theme-calm', look.calm);
    document.documentElement.classList.toggle('font-ud', look.ud);
    if (look.ud) loadUdFont();
  }
  function saveLook() {
    try {
      localStorage.setItem('block-night', look.night ? '1' : '0'); localStorage.setItem('block-calm', look.calm ? '1' : '0');
      localStorage.setItem('block-font', look.ud ? 'ud' : 'dot');
    } catch (e) {}
  }
  applyLook();
  // ブロックの もじも おなじ フォントに する（Blockly は テーマの フォントで もじの はばを はかるため）
  if (window.Blockly && Blockly.Theme && Blockly.Theme.defineTheme) {
    var defineTheme = Blockly.Theme.defineTheme;
    Blockly.Theme.defineTheme = function (name, opts) {
      if (look.ud && opts && opts.fontStyle) opts.fontStyle = Object.assign({}, opts.fontStyle, { family: UD_FAMILY, size: 12 });
      return defineTheme.call(Blockly.Theme, name, opts);
    };
  }
  window.nightMenuItem = function () {
    return {
      icon: function () { return look.night ? '☀️' : '🌙'; },
      label: function () {
        return lang === 'ja' ? (look.night ? 'ふつうの あかるさに もどす' : 'ナイトモードに する')
                             : (look.night ? 'Back to day mode' : 'Night mode');
      },
      onClick: function (m) { look.night = !look.night; saveLook(); applyLook(); m.render(); }
    };
  };
  // 🔤 フォントを かえる：ドットの もじ ⇄ よみやすい もじ（UD フォント）
  window.fontMenuItem = function () {
    return {
      icon: function () { return '🔤'; },
      label: function () {
        return lang === 'ja' ? (look.ud ? 'フォントを かえる（もとの ドットもじへ）' : 'フォントを かえる（よみやすい もじへ）')
                             : (look.ud ? 'Change font (back to pixel)' : 'Change font (easy to read)');
      },
      onClick: function (m) {
        look.ud = !look.ud; saveLook();
        // ブロックの ある ページは よみなおす（ブロックの おおきさを もじに あわせる ため。くんだ ブロックは ほぞん されている）
        if (window.Blockly && window.Blockly.inject) { location.reload(); return; }
        applyLook(); m.render();
      }
    };
  };
  window.calmMenuItem = function () {
    return {
      _calm: true,
      icon: function () { return look.calm ? '🌈' : '🎨'; },
      label: function () {
        return lang === 'ja' ? (look.calm ? 'もとの いろに もどす' : 'おちついた いろに する')
                             : (look.calm ? 'Back to normal colors' : 'Calm colors');
      },
      onClick: function (m) { look.calm = !look.calm; saveLook(); applyLook(); m.render(); }
    };
  };

  // ヘッダーの アプリ リンク（いまの ページいがい）
  var APPS = [
    { href: 'index.html',    icon: '🐢', ja: 'おえかき',   en: 'Drawing' },
    { href: 'maze.html',     icon: '⛏', ja: 'めいろ',     en: 'Maze' },
    { href: 'space.html',    icon: '🚀', ja: 'うちゅう',   en: 'Space' },
    { href: 'craft.html',    icon: '🧱', ja: 'こわす・おく', en: 'Break & Build' },
    { href: 'aquarium.html', icon: '🐟', ja: 'すいぞくかん', en: 'Aquarium' }
    // 🎬 どうが・📖 かいせつしょ は「⚙ きのう」メニューから ひらく（ヘッダーには おかない）
  ];
  window.buildNav = function (nav) {
    var here = location.pathname.split('/').pop() || 'index.html';
    APPS.forEach(function (a) {
      if (a.href === here) return;
      var link = document.createElement('a');
      link.href = a.href;
      window.setLabel(link, a.icon, a[lang]);
      nav.appendChild(link);
    });
  };
})();
