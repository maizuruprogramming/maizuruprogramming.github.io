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
  document.write('<script src="https://unpkg.com/blockly@11/msg/' + lang + '.js"><\/script>');

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
    var menu = {
      render: function () {
        box.innerHTML = '';
        items.forEach(function (it) {
          var b = document.createElement('button');
          b.className = 'fnItem' + (it.warn && it.warn() ? ' warn' : '');
          b.setAttribute('role', 'menuitem');
          var i = document.createElement('span'); i.className = 'fnIco'; i.textContent = it.icon();
          var l = document.createElement('span'); l.textContent = it.label();
          b.appendChild(i); b.appendChild(l);
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

  // メニューの「ことば」の こうもく
  window.langMenuItem = function () {
    return {
      icon: function () { return '🌐'; },
      label: function () { return lang === 'ja' ? 'English（えいご）に する' : '日本語 (Japanese)'; },
      onClick: function () { window.setLang(lang === 'ja' ? 'en' : 'ja'); }
    };
  };

  // ヘッダーの アプリ リンク（いまの ページいがい）
  var APPS = [
    { href: 'index.html',    icon: '🐢', ja: 'おえかき',   en: 'Drawing' },
    { href: 'maze.html',     icon: '⛏', ja: 'めいろ',     en: 'Maze' },
    { href: 'space.html',    icon: '🚀', ja: 'うちゅう',   en: 'Space' },
    { href: 'craft.html',    icon: '🧱', ja: 'こわす・おく', en: 'Break & Build' },
    { href: 'aquarium.html', icon: '🐟', ja: 'すいぞくかん', en: 'Aquarium' }
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
