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
    // ℹ️ この アプリに ついて：どの ページでも いちばん したに だす
    items = items.concat([window.aboutMenuItem()]);
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
  var PY_PAIRS = { 'index.html': 'python-draw.html', 'maze.html': 'python.html', 'space.html': 'python-space.html', 'craft.html': 'python-craft.html',
    'maze-junior.html': 'python-maze-junior.html', 'maze-key.html': 'python-maze-key.html', 'maze-enemy.html': 'python-maze-enemy.html' };
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

  // ⛏ めいろの なかま：ブロック 4つ ＋ Python版 4つ。めいろの ページでは「⚙ きのう → ⛏ めいろを えらぶ…」で ひょうを だす
  var MAZES = [
    { icon: '⛏', ja: 'ブロックでめいろ', en: 'Block Maze', sub: ['じゅんばん・くりかえし・もし', 'Sequence, loops, if'],
      b: { href: 'maze.html', key: 'block-maze', n: 8 }, p: { href: 'python.html', key: 'block-python', n: 5 } },
    { icon: '🧭', ja: 'やじるしの めいろ', en: 'Arrow Maze', sub: ['ていがくねん むけ', 'For younger kids'],
      b: { href: 'maze-junior.html', key: 'block-mazejr', n: 6 }, p: { href: 'python-maze-junior.html', key: 'block-pymazejr', n: 6 } },
    { icon: '🗝', ja: 'かぎと とびら', en: 'Keys & Doors', sub: ['もっている ものを おぼえる', 'Remember what you carry'],
      b: { href: 'maze-key.html', key: 'block-mazekey', n: 4 }, p: { href: 'python-maze-key.html', key: 'block-pymazekey', n: 4 } },
    { icon: '👾', ja: 'てきを よける', en: 'Dodge the Slime', sub: ['タイミング', 'Timing'],
      b: { href: 'maze-enemy.html', key: 'block-mazeenemy', n: 4 }, p: { href: 'python-maze-enemy.html', key: 'block-pymazeenemy', n: 4 } }
  ];
  window.MAZES = MAZES;
  function mazeHere() {
    var here = location.pathname.split('/').pop() || 'index.html';
    return MAZES.some(function (m) { return m.b.href === here || m.p.href === here; }) ? here : null;
  }
  // クリアした ステージの かず（ブロックは [true, …]、Python版は [0, 2, …] の かたちで ほぞん）
  function clearedCount(key) {
    try {
      var c = JSON.parse(localStorage.getItem(key + '-cleared'));
      if (!Array.isArray(c)) return 0;
      var seen = {};
      c.forEach(function (x, i) { if (x === true) seen[i] = 1; else if (typeof x === 'number') seen['n' + x] = 1; });
      return Object.keys(seen).length;
    } catch (e) { return 0; }
  }
  window.openMazePicker = function () {
    var here = mazeHere();
    var old = document.getElementById('mazePicker'); if (old) old.remove();
    var J = lang === 'ja';
    var wrap = document.createElement('div'); wrap.id = 'mazePicker';
    wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-modal', 'true'); wrap.setAttribute('aria-label', J ? 'めいろを えらぶ' : 'Choose a maze');
    var box = document.createElement('div'); box.className = 'mpBox';
    var head = document.createElement('div'); head.className = 'mpHead';
    var ttl = document.createElement('div'); ttl.className = 'mpTitle'; ttl.textContent = J ? 'めいろを えらぶ' : 'Choose a maze';
    var x = document.createElement('button'); x.className = 'mpClose'; x.textContent = '×'; x.setAttribute('aria-label', J ? 'とじる' : 'Close');
    head.appendChild(ttl); head.appendChild(x); box.appendChild(head);
    var grid = document.createElement('div'); grid.className = 'mpGrid';
    ['', J ? '🧩 ブロック' : '🧩 Blocks', '🐍 Python'].forEach(function (t) { var h = document.createElement('div'); h.className = 'mpCol'; h.textContent = t; grid.appendChild(h); });
    MAZES.forEach(function (m) {
      var nm = document.createElement('div'); nm.className = 'mpName';
      var n1 = document.createElement('div'); n1.textContent = m.icon + ' ' + (J ? m.ja : m.en);
      var n2 = document.createElement('div'); n2.className = 'mpSub'; n2.textContent = m.sub[J ? 0 : 1];
      nm.appendChild(n1); nm.appendChild(n2); grid.appendChild(nm);
      [m.b, m.p].forEach(function (v, k) {
        var b = document.createElement('button'); b.className = 'mpCell' + (v.href === here ? ' on' : '');
        var got = clearedCount(v.key), all = got >= v.n;
        b.textContent = (v.href === here ? (J ? 'いま ここ　' : 'You are here  ') : '') + (all ? (J ? '✅ ぜんぶ' : '✅ All') : '✅ ' + got + ' / ' + v.n);
        b.setAttribute('aria-label', (J ? m.ja : m.en) + (k ? ' Python' : (J ? ' ブロック' : ' Blocks')) + ' ' + got + '/' + v.n);
        b.addEventListener('click', function () { if (v.href === here) { close(); return; } location.href = v.href + (k ? '?mode=python' : ''); });
        grid.appendChild(b);
      });
    });
    box.appendChild(grid);
    var note = document.createElement('div'); note.className = 'mpNote';
    note.textContent = J ? 'あおい ところが いま やっている めいろ。✅ は クリアした ステージの かず。' : 'Blue = the maze you are playing now. ✅ = stages cleared.';
    box.appendChild(note);
    wrap.appendChild(box); document.body.appendChild(wrap);
    function close() { wrap.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    x.addEventListener('click', close);
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
    document.addEventListener('keydown', onKey);
    var cur = box.querySelector('.mpCell.on') || box.querySelector('.mpCell'); if (cur) cur.focus();
  };
  // ⚙ きのう の こうもく（めいろの ページだけ）
  window.mazeFamilyItems = function () {
    if (!mazeHere()) return [];
    return [{
      icon: function () { return '⛏'; },
      label: function () { return lang === 'ja' ? 'めいろを えらぶ…（ブロック・Python）' : 'Choose a maze… (Blocks / Python)'; },
      onClick: function (m) { m.close(); window.openMazePicker(); }
    }];
  };

  // ℹ️ この アプリに ついて（バージョン・つくった ひと・データの あつかい・つかっている もの）
  window.openAbout = function () {
    var J = lang === 'ja';
    var old = document.getElementById('aboutBox'); if (old) old.remove();
    var wrap = document.createElement('div'); wrap.id = 'aboutBox';
    wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-label', J ? 'この アプリに ついて' : 'About this app');
    var T = function (ja, en) { return J ? ja : en; };
    var sec = function (ttl, body) { return '<section><h3>' + ttl + '</h3>' + body + '</section>'; };
    var html =
      '<div class="abHead"><div class="abTitle">ℹ️ ' + T('この アプリに ついて', 'About this app') + '</div>' +
      '<button class="abClose" aria-label="' + T('とじる', 'Close') + '">×</button></div>' +
      '<div class="abApp">🧱 ' + T('ブロックで プログラミング', 'Block Programming') + '</div>' +
      '<p>' + T('ブロックを つなげて、カメで え を かいたり、めいろを ぬけたり、うちゅうで ほしを あつめたりしながら、プログラミングの かんがえかたを まなぶ アプリです。さいごは Python（パイソン）の ことばでも かけるように なります。',
                'Snap blocks together to draw with a turtle, escape mazes and collect stars in space while learning how to think like a programmer. In the end, you can write the same programs in Python, too.') + '</p>' +
      '<dl class="abList">' +
      '<dt>' + T('バージョン', 'Version') + '</dt><dd>' + window.RELEASE_VERSION + '（' + window.RELEASE_DATE + '）　<a href="releases.html">📝 ' + T('リリースノート', 'Release notes') + '</a></dd>' +
      '<dt>' + T('つくった ひと', 'Made by') + '</dt><dd>' + T('舞鶴工業高等専門学校　井上泰仁', 'Yasuhito Inoue, National Institute of Technology, Maizuru College') + '</dd>' +
      '</dl>' +
      sec('🤝 ' + T('つかう ときの おやくそく', 'Terms of use'),
        '<p>' + T('この アプリは だれでも むりょうで つかえます。がっこうの じゅぎょうや いえでの べんきょうに じゆうに つかってください。',
                  'Anyone can use this app for free. Please feel free to use it in school lessons and for learning at home.') + '</p>') +
      sec('🔒 ' + T('データの あつかい', 'Your data'),
        '<p>' + T('クリアした ステージや せっていは、この たんまつの ブラウザの なかだけに ほぞんされます。なまえや メールアドレスを いれる ところは ありません。',
                  'Cleared stages and settings are saved only in this device’s browser. There is no place to enter your name or email address.') + '</p>') +
      sec('💻 ' + T('つかえる たんまつ', 'Devices'),
        '<p>' + T('パソコン・タブレット・スマートフォンの ブラウザ（Chrome、Safari、Edge など）で うごきます。インストールは いりません。',
                  'Works in the browser (Chrome, Safari, Edge, etc.) on computers, tablets and smartphones. No installation needed.') + '</p>' +
        '<p class="abWarn">🌐 ' + T('動作にはインターネット接続が必要です。', 'An internet connection is required.') + '</p>') +
      sec('🧭 ' + T('こまったときは', 'Need help?'),
        '<div class="abLinks"><a href="howto.html">🎮 ' + T('あそびかた', 'How to play') + '</a><a href="guide.html">📖 ' + T('かいせつしょ', 'Guide') + '</a>' +
        '<a href="videos.html">🎬 ' + T('どうが', 'Videos') + '</a><a href="releases.html">📝 ' + T('リリースノート', 'Release notes') + '</a></div>') +
      '<details class="abMore"><summary>' + T('くわしく（先生・保護者の方へ）', 'More (for teachers and parents)') + '</summary>' +
        '<h4>' + T('授業で使える教材', 'Materials for lessons') + '</h4>' +
        '<p>' + T('ワークシート（日本語・英語）、学習指導案（原案）、めいろの本（PDF）、授業用スライドを用意しています。ワークシート・学習指導案・めいろの本は「📖 かいせつしょ」から開けます。',
                  'Worksheets (Japanese/English), lesson plans (Japanese), a maze book (PDF) and lesson slides are available. Open the worksheets, lesson plans and maze book from the 📖 Guide.') + '</p>' +
        '<h4>' + T('先生モード', 'Teacher mode') + '</h4>' +
        '<p>' + T('アドレスの最後に <code>?sensei</code> を付けると「こたえ」ボタンが表示され、答えのブロックを読み込めます。',
                  'Add <code>?sensei</code> to the end of the address to show an “Answer” button that loads the answer blocks.') + '</p>' +
        '<h4>' + T('使用しているもの', 'Credits') + '</h4>' +
        '<ul><li>Blockly（Google）― ' + T('ブロックの しくみ', 'block editor') + '（Apache License 2.0）</li>' +
        '<li>BIZ UDPGothic / BIZ UDGothic（Morisawa）・DotGothic16 ― ' + T('フォント', 'fonts') + '（SIL Open Font License 1.1）。Google Fonts ' + T('から読み込み', 'served by Google Fonts') + '</li></ul>' +
      '</details>';
    var box = document.createElement('div'); box.className = 'abBox'; box.innerHTML = html;
    wrap.appendChild(box); document.body.appendChild(wrap);
    function close() { wrap.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    box.querySelector('.abClose').addEventListener('click', close);
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
    document.addEventListener('keydown', onKey);
    box.querySelector('.abClose').focus();
  };
  window.aboutMenuItem = function () {
    return {
      icon: function () { return 'ℹ️'; },
      label: function () { return lang === 'ja' ? 'この アプリに ついて' : 'About this app'; },
      onClick: function (m) { m.close(); window.openAbout(); }
    };
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
  var RELEASE_VERSION = '1.19';
  var RELEASE_DATE = '2026-11-09';   // リリースノートの ひづけ（「この アプリに ついて」に だす）
  window.RELEASE_DATE = RELEASE_DATE;
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
  var look = { night: false, calm: false, ud: true };
  try {
    look.night = localStorage.getItem('block-night') === '1'; look.calm = localStorage.getItem('block-calm') === '1';
    // ふつうは よみやすい もじ（UD フォント）。「⚙ きのう」で ドットもじに かえると 'dot' を おぼえる
    look.ud = localStorage.getItem('block-font2') !== 'dot';
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
      localStorage.setItem('block-font2', look.ud ? 'ud' : 'dot');
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
      icon: function () { return look.ud ? '👾' : '🔤'; },
      label: function () {
        return lang === 'ja' ? (look.ud ? 'ドットもじに する' : 'よみやすい もじに もどす')
                             : (look.ud ? 'Pixel font' : 'Back to easy-to-read font');
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
    { href: 'maze.html',     icon: '⛏️', ja: 'めいろ',     en: 'Maze' },
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
