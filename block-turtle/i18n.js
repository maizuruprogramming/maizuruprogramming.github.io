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

  // ヘッダーの アプリ リンク（いまの ページいがい）
  var APPS = [
    { href: 'index.html',    icon: '🐢', ja: 'おえかき',   en: 'Drawing' },
    { href: 'maze.html',     icon: '⛏', ja: 'めいろ',     en: 'Maze' },
    { href: 'space.html',    icon: '🚀', ja: 'うちゅう',   en: 'Space' },
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
