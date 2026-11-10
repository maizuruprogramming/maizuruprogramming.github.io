// システム紹介スライド（ブロックで プログラミング）
const pptxgen = require('pptxgenjs');
const React = require('react');
const RDS = require('react-dom/server');
const sharp = require('sharp');
const fa = require('react-icons/fa');
const path = require('path');
const fs = require('fs');
const { applyTheme } = require(process.env.SKILL + '/scripts/apply_theme.js');

const LANG = process.env.DECK_LANG || 'ja';
const EN = JSON.parse(fs.readFileSync('/tmp/deck/en.json', 'utf8'));
const L = (ja) => LANG === 'en' ? (EN[ja] !== undefined ? EN[ja] : (() => { throw new Error('no EN: ' + ja); })()) : ja;
const IMG_EN = { 'python-blocks-mode.png': 'python-run-en.png', 'python-error.png': 'python-error-en.png', 'cert-1.png': 'videos.png' };
const IMG = (f) => LANG === 'en' ? path.join('/tmp/deck/img_en', IMG_EN[f] || f) : path.join('/tmp/deck/img', f);
const THEME = {
  name: 'Block Programming', headFontFace: LANG === 'en' ? 'Calibri' : 'Yu Gothic', bodyFontFace: LANG === 'en' ? 'Calibri' : 'Yu Gothic',
  colors: { dk1: '1E2430', lt1: 'FFFFFF', dk2: '2B3A55', lt2: 'EEF2F7',
    accent1: '2E8B57', accent2: '306998', accent3: 'FFD43B', accent4: 'D9692B', accent5: '6A4A8A', accent6: '8A93A8',
    hlink: '306998', folHlink: '6A4A8A' }
};
const HEX = THEME.colors;

async function icon(Comp, color, size = 256) {
  const svg = RDS.renderToStaticMarkup(React.createElement(Comp, { color: '#' + color, size: String(size) }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return 'image/png;base64,' + buf.toString('base64');
}

(async () => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.author = L('舞鶴工業高等専門学校　井上泰仁');
  pres.title = L('ブロックで プログラミング ― システムの紹介');
  const C = pres.SchemeColor;

  pres.defineSlideMaster({
    title: 'TITLE_DARK', background: { color: HEX.dk1 },
    objects: [
      { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 1.2, w: 5.3, h: 1.8, fontSize: 32, bold: true, color: C.background1, valign: 'bottom', align: 'left' }, text: '' } },
      { placeholder: { options: { name: 'body', type: 'body', x: 0.6, y: 3.2, w: 5.3, h: 1.5, fontSize: 16, color: C.background2, valign: 'top', align: 'left' }, text: '' } }
    ]
  });
  pres.defineSlideMaster({
    title: 'CONTENT', background: { color: HEX.lt1 },
    objects: [
      { placeholder: { options: { name: 'title', type: 'title', x: 0.5, y: 0.3, w: 9.0, h: 0.7, fontSize: 28, bold: true, color: C.text1, valign: 'middle', margin: 0 }, text: '' } }
    ],
    slideNumber: { x: 9.2, y: 5.2, w: 0.5, h: 0.3, fontSize: 10, color: HEX.accent6, align: 'right' }
  });

  const shadow = () => ({ type: 'outer', blur: 6, offset: 2, angle: 90, color: '000000', opacity: 0.25 });
  const pic = (s, f, x, y, w, h, name, sizing) => s.addImage({ path: IMG(f), x, y, w, h, rounding: false, shadow: shadow(), objectName: name,
    sizing: sizing || undefined, altText: name });
  const circleIcon = async (s, Comp, x, y, d, fill, name) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill }, objectName: name + ' circle' });
    s.addImage({ data: await icon(Comp, 'FFFFFF'), x: x + d * 0.22, y: y + d * 0.22, w: d * 0.56, h: d * 0.56, objectName: name + ' icon', altText: name });
  };
  const tx = (s, text, o) => s.addText(text, Object.assign({ isTextBox: true, fontSize: 14, color: C.text1, valign: 'top', margin: 0 }, o));

  // 1. 表紙
  pres.addSection({ title: L('はじめに') });
  let s = pres.addSlide({ masterName: 'TITLE_DARK', sectionTitle: L('はじめに') });
  s.addText([{ text: L('ブロックで'), options: { breakLine: true } }, { text: L('プログラミング') }], { placeholder: 'title' });
  s.addText([{ text: L('小・中学生向け 無料の プログラミング教材'), options: { breakLine: true } },
             { text: L('システムの紹介'), options: { breakLine: true } },
             { text: L('舞鶴工業高等専門学校　井上泰仁'), options: { fontSize: 13 } }], { placeholder: 'body' });
  pic(s, 'maze6.png', 6.1, 0.6, 3.4, 1.99, L('迷路の答えの画面'));
  pic(s, 'draw-cover.png', 6.1, 2.85, 2.1, 2.1, L('おえかきの作品'));
  pic(s, 'space5.png', 8.35, 2.85, 1.15 * 1.0, 2.1, L('うちゅうの画面'), { type: 'cover', w: 1.15, h: 2.1 });
  s.addNotes(L('ブラウザで動く、小・中学生向けの無料のブロックプログラミング教材です。ブロックからはじめて Python まで学べます。'));

  // 2. この教材でできること
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: L('はじめに') });
  s.addText(L('ブラウザだけで、ブロックから Python まで'), { placeholder: 'title' });
  const pts = [
    [fa.FaGlobeAsia, HEX.accent2, L('インストール不要・無料'), L('パソコン・タブレット・スマートフォンのブラウザで動く。GitHub Pages で公開')],
    [fa.FaPuzzlePiece, HEX.accent1, L('ブロック → Python'), L('同じ課題をブロックと Python の両方で。ブロックを組むと Python のコードも表示')],
    [fa.FaChalkboardTeacher, HEX.accent4, L('授業でそのまま使える'), L('解説書・解説動画・ワークシート・本・学習指導案・授業スライドを用意')]
  ];
  for (let i = 0; i < 3; i++) {
    const x = 0.5 + i * 3.05;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.35, w: 2.85, h: 3.6, rectRadius: 0.12, fill: { color: HEX.lt2 }, line: { color: HEX.lt2 }, objectName: 'card ' + (i + 1) });
    await circleIcon(s, pts[i][0], x + 0.25, 1.6, 0.8, pts[i][1], pts[i][2]);
    tx(s, pts[i][2], { x: x + 0.25, y: 2.6, w: 2.45, h: 0.5, fontSize: 16, bold: true });
    tx(s, pts[i][3], { x: x + 0.25, y: 3.15, w: 2.4, h: 1.6, fontSize: 14, color: C.text2 });
  }
  s.addNotes(L('特長は3つです。インストール不要で無料、ブロックから Python へ、授業で使える教材一式がそろっていることです。'));

  // 3. 数字で見る
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: L('はじめに') });
  s.addText(L('数字で見る教材の全体'), { placeholder: 'title' });
  const stats = [['14', L('アプリ'), L('ブロック 7・Python 7'), HEX.accent2], ['86', L('課題'), L('おだい・ステージ'), HEX.accent1],
                 ['172', L('解説動画'), L('日本語・英語（各86本）'), HEX.accent4], ['2', L('言語'), L('日本語・English'), HEX.accent5]];
  stats.forEach(([n, label, sub, col], i) => {
    const x = 0.5 + i * 2.3;
    tx(s, n, { x, y: 1.45, w: 2.1, h: 1.1, fontSize: 60, bold: true, color: col, align: 'left' });
    tx(s, label, { x, y: 2.6, w: 2.1, h: 0.45, fontSize: 18, bold: true });
    tx(s, sub, { x, y: 3.05, w: 2.1, h: 0.45, fontSize: 13, color: C.text2 });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 3.8, w: 9.0, h: 1.15, rectRadius: 0.1, fill: { color: HEX.lt2 }, line: { color: HEX.lt2 }, objectName: 'materials band' });
  tx(s, [{ text: L('授業用の教材：'), options: { bold: true } },
         { text: L('ワークシート 9種（日英）・本 4冊（日英、PDF）・学習指導案 7本（原案）・授業スライド 16本（日英）・修了証') }],
     { x: 0.75, y: 3.95, w: 8.5, h: 0.85, fontSize: 15, valign: 'middle' });
  s.addNotes(L('アプリは14、課題は86。解説動画は日本語と英語で172本あります。'));

  // 4. 学びの流れ
  pres.addSection({ title: L('アプリ') });
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: L('アプリ') });
  s.addText(L('学びの流れ：順序から一般化、そして Python へ'), { placeholder: 'title', fontSize: 26 });
  const flow = [[L('順序'), L('うえから じゅんばんに'), HEX.accent1], [L('反復'), L('くりかえしで まとめる'), HEX.accent1], [L('条件分岐'), L('もし〜なら で きめる'), HEX.accent2],
                [L('状態'), L('もっている かず・タイミング'), HEX.accent5], [L('一般化'), L('どんな めいろでも とける'), HEX.accent4], ['Python', L('おなじ ことを コードで'), HEX.dk2]];
  flow.forEach(([h, sub, col], i) => {
    const x = 0.5 + i * 1.53;
    s.addShape(pres.shapes.CHEVRON, { x, y: 1.6, w: 1.45, h: 1.0, fill: { color: col }, line: { color: col }, objectName: 'step ' + h });
    tx(s, h, { x: x + 0.3, y: 1.6, w: 1.0, h: 1.0, fontSize: 12, bold: true, color: C.background1, align: 'center', valign: 'middle' });
    tx(s, sub, { x, y: 2.75, w: 1.45, h: 0.8, fontSize: 12, color: C.text2, align: 'center' });
  });
  tx(s, [{ text: L('低学年'), options: { bold: true } }, { text: L('：やじるしの めいろ（向きを考えずに順序だけ）　') },
         { text: L('中・高学年'), options: { bold: true } }, { text: L('：めいろ・うちゅう・こわす・おく・かぎ・てき　') },
         { text: L('小6〜中学'), options: { bold: true } }, { text: L('：Python版 7アプリ') }],
     { x: 0.5, y: 3.85, w: 9.0, h: 1.0, fontSize: 14 });
  s.addNotes(L('順序、反復、条件分岐、状態とタイミング、一般化と段階的に進み、最後に同じ考え方を Python で書きます。'));

  // 5. アプリ一覧
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: L('アプリ') });
  s.addText(L('ブロックのアプリ 7つ（それぞれに Python版）'), { placeholder: 'title', fontSize: 26 });
  const apps = [[L('おえかき'), L('9題'), L('角度・くりかえし・変数'), fa.FaPaintBrush, HEX.accent2],
                [L('めいろ'), '8', L('順序→反復→条件→一般化'), fa.FaRoute, HEX.accent1],
                [L('やじるしの めいろ'), '6', L('低学年向け・順序'), fa.FaArrowsAlt, HEX.accent1],
                [L('かぎと とびら'), '4', L('状態（持っている数）'), fa.FaKey, HEX.accent5],
                [L('てきを よける'), '4', L('タイミング・条件'), fa.FaGhost, HEX.accent5],
                [L('うちゅう'), '7', L('調べてから動く'), fa.FaRocket, HEX.accent4],
                [L('こわす・おく'), '7', L('数の増減・2つの条件'), fa.FaCubes, HEX.accent4],
                [L('すいぞくかん'), L('自由'), L('ブロックで魚を動かす'), fa.FaFish, HEX.accent6]];
  for (let i = 0; i < apps.length; i++) {
    const [name, n, what, Ic, col] = apps[i];
    const x = 0.5 + (i % 4) * 2.28, y = 1.3 + Math.floor(i / 4) * 1.9;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 2.1, h: 1.7, rectRadius: 0.1, fill: { color: HEX.lt2 }, line: { color: HEX.lt2 }, objectName: 'app ' + name });
    await circleIcon(s, Ic, x + 0.18, y + 0.18, 0.55, col, name);
    tx(s, n, { x: x + 0.85, y: y + 0.2, w: 1.1, h: 0.5, fontSize: 20, bold: true, color: col, align: 'right', valign: 'middle' });
    tx(s, name, { x: x + 0.18, y: y + 0.85, w: 1.85, h: 0.35, fontSize: 15, bold: true });
    tx(s, what, { x: x + 0.18, y: y + 1.2, w: 1.85, h: 0.4, fontSize: 11, color: C.text2 });
  }
  s.addNotes(L('ブロックのアプリが7つあり、それぞれに Python 版があります。すいぞくかんは自由制作のアプリです。'));

  // 6. おえかき
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: L('アプリ') });
  s.addText(L('おえかき：カメを動かして図形をかく'), { placeholder: 'title' });
  pic(s, 'odai5.png', 0.5, 1.25, 5.3, 3.27, L('おえかき ⑤はな の答え'));
  tx(s, [{ text: L('お手本と同じ図形がかければ正解'), options: { bold: true, breakLine: true } },
         { text: L('六角形・星・円から、入れ子、変数を使ったうずまき、雪の結晶まで 9題'), options: { bullet: true, breakLine: true } },
         { text: L('回る角度 ＝ 360 ÷ 辺の数 を体験的に見つけられる'), options: { bullet: true, breakLine: true } },
         { text: L('小5 算数「正多角形と円」でのプログラミング活動に対応'), options: { bullet: true } }],
     { x: 6.1, y: 1.3, w: 3.4, h: 3.4, fontSize: 14, paraSpaceAfter: 8 });
  s.addNotes(L('おえかきは、カメに命令して線をかくアプリです。お手本と線が重なれば正解になります。'));

  // 7. めいろ
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: L('アプリ') });
  s.addText(L('めいろ と めいろの なかま'), { placeholder: 'title' });
  pic(s, 'maze6.png', 0.5, 1.25, 4.4, 2.57, L('めいろ ステージ6 の答え'));
  tx(s, L('「もし まえが あいていたら」で、たんけんかが自分で判断。ステージ8はランダムな迷路30個でテスト'), { x: 0.5, y: 3.95, w: 4.4, h: 0.9, fontSize: 13, color: C.text2 });
  const fam = [['mazejr3.png', L('やじるし（低学年）')], ['mazekey3.png', L('かぎと とびら')], ['mazeenemy2.png', L('てきを よける')]];
  fam.forEach(([f, cap], i) => {
    const y = 1.25 + i * 1.25;
    pic(s, f, 5.2, y, 1.7, 1.05, cap, { type: 'cover', w: 1.7, h: 1.05 });
    tx(s, cap, { x: 7.1, y: y + 0.3, w: 2.4, h: 0.45, fontSize: 15, bold: true, valign: 'middle' });
  });
  s.addNotes(L('めいろは順序から一般化まで。なかまとして、低学年向けのやじるし、状態を学ぶかぎととびら、タイミングを学ぶてきをよけるがあります。'));

  // 8. うちゅう・こわす
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: L('アプリ') });
  s.addText(L('うちゅう と こわす・おく'), { placeholder: 'title' });
  pic(s, 'space5.png', 0.5, 1.25, 4.35, 2.48, L('うちゅう ステージ5'));
  pic(s, 'craft6.png', 5.15, 1.25, 3.92, 2.48, L('こわす・おく ステージ6'));
  tx(s, [{ text: L('うちゅうで ほしあつめ'), options: { bold: true, breakLine: true } }, { text: L('星があるときだけ拾う ― 調べてから動く条件分岐') }],
     { x: 0.5, y: 4.05, w: 4.35, h: 0.9, fontSize: 14 });
  tx(s, [{ text: L('こわして つくる ぼうけん'), options: { bold: true, breakLine: true } }, { text: L('壊すと＋1、置くと−1 ― 持っている数（状態）を考える') }],
     { x: 5.15, y: 4.05, w: 4.35, h: 0.9, fontSize: 14 });
  s.addNotes(L('うちゅうは条件分岐、こわす・おくは持っている数を考えながら手順を組み立てる教材です。'));

  // 9. Python版
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: L('アプリ') });
  s.addText(L('Python版：同じ課題をテキストで書く'), { placeholder: 'title' });
  pic(s, 'python-blocks-mode.png', 0.5, 1.25, 4.35, 2.74, L('Python版 ブロックモード'));
  pic(s, 'python-error.png', 5.15, 1.25, 4.35, 2.74, L('Python版 エラー表示'));
  tx(s, L('ブロックで組むと、同じ動きの Python が表示される'), { x: 0.5, y: 4.1, w: 4.35, h: 0.8, fontSize: 14 });
  tx(s, L('SyntaxError などのエラーを日本語のヒント付きで表示。動いている行が光る'), { x: 5.15, y: 4.1, w: 4.35, h: 0.8, fontSize: 14 });
  s.addNotes(L('Python版は7アプリ41ステージ。ブロックモードで組むと対応する Python が表示されるので、ブロックからテキストへ無理なく移れます。'));

  // 10. 授業を支える教材
  pres.addSection({ title: L('授業での活用') });
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: L('授業での活用') });
  s.addText(L('授業を支える教材'), { placeholder: 'title' });
  pic(s, 'guide_item.png', 0.5, 1.25, 4.4, 2.61, L('かいせつしょの画面'));
  const mats = [[fa.FaBook, L('かいせつしょ'), L('めあて・つまずき・ヒント・答え')], [fa.FaVideo, L('解説動画'), L('1本30〜60秒、字幕と効果音')],
                [fa.FaPencilAlt, L('ワークシート'), L('9種、日本語・英語')], [fa.FaBookOpen, L('本（PDF）'), L('子ども向け＋指導編、4冊')],
                [fa.FaClipboardList, L('学習指導案'), L('45分の展開例、7本')], [fa.FaDesktop, L('授業スライド'), L('PowerPoint、日本語・英語')]];
  for (let i = 0; i < mats.length; i++) {
    const [Ic, h, sub] = mats[i];
    const x = 5.2 + (i % 2) * 2.2, y = 1.25 + Math.floor(i / 2) * 1.2;
    await circleIcon(s, Ic, x, y, 0.5, HEX.accent2, h);
    tx(s, h, { x: x + 0.6, y, w: 1.55, h: 0.32, fontSize: 14, bold: true });
    tx(s, sub, { x: x + 0.6, y: y + 0.34, w: 1.55, h: 0.7, fontSize: 11, color: C.text2 });
  }
  tx(s, L('各課題から、動画・本・ワークシート・学習指導案へ1クリックで移動できる'), { x: 0.5, y: 4.0, w: 4.4, h: 0.8, fontSize: 13, color: C.text2 });
  s.addNotes(L('かいせつしょの各課題から、解説動画、本、ワークシート、学習指導案にすぐ移動できます。'));

  // 11. 本・ワークシート・指導案
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: L('授業での活用') });
  s.addText(L('印刷して使える：本・ワークシート・学習指導案'), { placeholder: 'title', fontSize: 24 });
  const prints = [['bookcover-01.png', L('本（4冊・日英）'), L('子ども向け：もんだい → ヒント → 次のページに こたえ')],
                  ['ws-1.png', L('ワークシート'), L('道を写す・手順を書く・振り返る')],
                  ['lp-2.png', L('学習指導案（原案）'), L('単元計画・本時の展開・板書計画')]];
  prints.forEach(([f, h, sub], i) => {
    const x = 0.5 + i * 3.1;
    pic(s, f, x + 0.45, 1.2, 2.0, 2.83, h);
    tx(s, h, { x, y: 4.15, w: 2.9, h: 0.35, fontSize: 15, bold: true, align: 'center' });
    tx(s, sub, { x, y: 4.5, w: 2.9, h: 0.6, fontSize: 12, color: C.text2, align: 'center' });
  });
  s.addNotes(L('本は第1部が子ども向け、第2部が先生向けの指導編です。ワークシートと学習指導案もPDFで印刷できます。'));

  // 12. 授業の流れ
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: L('授業での活用') });
  s.addText(L('45分の授業の流れ（例）'), { placeholder: 'title' });
  const steps = [[L('5分'), L('導入'), L('めあてを確認（ワークシート①）')], [L('5分'), L('予想'), L('迷路を見て、指でなぞって手順を考える')],
                 [L('20分'), L('試行'), L('アプリで試す。止まった場所から原因を見つけて直す')], [L('10分'), L('共有'), L('異なる解き方を比べ、短く書く工夫を考える')],
                 [L('5分'), L('振り返り'), L('わかったこと・次にやりたいことを書く')]];
  const total = 45; let x0 = 0.5;
  steps.forEach(([m, h, sub], i) => {
    const w = 9.0 * parseInt(m) / total;
    const col = [HEX.accent6, HEX.accent2, HEX.accent1, HEX.accent4, HEX.accent5][i];
    s.addShape(pres.shapes.RECTANGLE, { x: x0, y: 1.4, w: w - 0.05, h: 0.75, fill: { color: col }, line: { color: col }, objectName: 'time ' + h });
    tx(s, [{ text: h, options: { bold: true, breakLine: true } }, { text: m, options: { fontSize: 11 } }],
       { x: x0, y: 1.4, w: w - 0.05, h: 0.75, fontSize: 13, color: C.background1, align: 'center', valign: 'middle' });
    x0 += w;
  });
  steps.forEach(([m, h, sub], i) => {
    const y = 2.45 + i * 0.5;
    tx(s, h, { x: 0.5, y, w: 1.3, h: 0.42, fontSize: 14, bold: true, valign: 'middle' });
    tx(s, sub, { x: 1.85, y, w: 7.6, h: 0.42, fontSize: 14, valign: 'middle' });
  });
  s.addNotes(L('答えを教えず、「どこで止まった？」と問いかけるのがポイントです。'));

  // 13. 使いやすさ
  pres.addSection({ title: L('しくみ') });
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: L('しくみ') });
  s.addText(L('だれでも使いやすい工夫'), { placeholder: 'title' });
  const feats = [[fa.FaMobileAlt, L('スマホ・タブレット'), L('画面の幅に合わせて配置を切り替え、タップでブロックを組める')],
                 [fa.FaLanguage, L('日本語・English'), L('「⚙ きのう」でいつでも切り替え')],
                 [fa.FaFont, L('読みやすい文字'), L('標準は BIZ UDPゴシック。ドット文字にも変更可')],
                 [fa.FaMoon, L('ナイトモード・落ち着いた色'), L('まぶしさや刺激をおさえる')],
                 [fa.FaAward, L('修了証'), L('全ステージをクリアすると表示・印刷できる')],
                 [fa.FaUserGraduate, L('先生モード'), L('アドレスに ?sensei を付けると答えを読み込める')]];
  for (let i = 0; i < feats.length; i++) {
    const [Ic, h, sub] = feats[i];
    const x = 0.5 + (i % 2) * 4.6, y = 1.3 + Math.floor(i / 2) * 1.2;
    await circleIcon(s, Ic, x, y, 0.65, [HEX.accent1, HEX.accent2, HEX.accent4][Math.floor(i / 2)], h);
    tx(s, h, { x: x + 0.8, y: y - 0.02, w: 3.6, h: 0.35, fontSize: 15, bold: true });
    tx(s, sub, { x: x + 0.8, y: y + 0.36, w: 3.6, h: 0.6, fontSize: 13, color: C.text2 });
  }
  s.addNotes(L('スマホ対応、日英切り替え、読みやすいフォント、ナイトモード、修了証、先生モードなどがあります。'));

  // 14. しくみ
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: L('しくみ') });
  s.addText(L('しくみ：サーバー不要のシンプルな構成'), { placeholder: 'title', fontSize: 26 });
  const box = (x, y, w, h, title, sub, col, name) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: col }, line: { color: col }, objectName: name });
    tx(s, [{ text: title, options: { bold: true, breakLine: true } }, { text: sub, options: { fontSize: 12 } }],
       { x: x + 0.15, y, w: w - 0.3, h, fontSize: 15, color: C.background1, align: 'center', valign: 'middle' });
  };
  box(0.5, 1.4, 2.6, 1.5, 'GitHub Pages', L('HTML・JavaScript・画像・動画・PDF を配信'), HEX.dk2, 'box pages');
  box(3.7, 1.4, 2.6, 1.5, L('子どもの端末'), L('ブラウザで動作（インストール不要）'), HEX.accent2, 'box device');
  box(6.9, 1.4, 2.6, 1.5, L('ブラウザの保存領域'), L('クリア状況・設定（端末の中だけ）'), HEX.accent1, 'box storage');
  s.addShape(pres.shapes.RIGHT_ARROW, { x: 3.15, y: 1.95, w: 0.5, h: 0.4, fill: { color: HEX.accent6 }, line: { color: HEX.accent6 }, objectName: 'arrow 1' });
  s.addShape(pres.shapes.RIGHT_ARROW, { x: 6.35, y: 1.95, w: 0.5, h: 0.4, fill: { color: HEX.accent6 }, line: { color: HEX.accent6 }, objectName: 'arrow 2' });
  tx(s, [{ text: LANG === 'en' ? 'Blockly (Google)' : 'Blockly（Google）', options: { bold: true } }, { text: L('：ブロックの部品（インターネットから読み込み）'), options: { breakLine: true } },
         { text: L('Python版'), options: { bold: true } }, { text: L('：ブラウザの中で Python のコードを解釈して実行（自作の処理系）'), options: { breakLine: true } },
         { text: L('名前やメールアドレスは入力しない'), options: { bold: true } }, { text: L('。動作にはインターネット接続が必要') }],
     { x: 0.5, y: 3.2, w: 9.0, h: 1.6, fontSize: 14, paraSpaceAfter: 6 });
  s.addNotes(L('サーバーを持たない構成です。記録は各端末のブラウザの中だけに保存され、個人情報は扱いません。'));

  // 15. 今後
  pres.addSection({ title: L('まとめ') });
  s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: L('まとめ') });
  s.addText(L('今後の拡張候補'), { placeholder: 'title' });
  const fut = [[fa.FaChartLine, L('学習履歴の記録と分析'), L('学年・経験・試行錯誤の回数・よくある間違い')],
               [fa.FaCode, L('Python版の拡張'), L('変数・print・関数（def）、本格的な Python による上級モード')],
               [fa.FaPuzzlePiece, L('迷路の新しい種類'), L('じぶんの ブロック（関数）、タイムアタック')],
               [fa.FaGlobe, L('多言語化'), L('タイ語・クメール語（モックあり）')]];
  for (let i = 0; i < fut.length; i++) {
    const [Ic, h, sub] = fut[i];
    const y = 1.3 + i * 0.9;
    await circleIcon(s, Ic, 0.5, y, 0.6, i === 0 ? HEX.accent4 : HEX.accent6, h);
    tx(s, h, { x: 1.3, y: y - 0.02, w: 8.2, h: 0.35, fontSize: 16, bold: true });
    tx(s, sub, { x: 1.3, y: y + 0.33, w: 8.2, h: 0.35, fontSize: 13, color: C.text2 });
  }
  s.addNotes(L('次の課題は学習履歴の記録と分析です。GitHub Pages だけでは集められないため、端末内記録と書き出しから始める予定です。'));

  // 16. まとめ
  s = pres.addSlide({ masterName: 'TITLE_DARK', sectionTitle: L('まとめ') });
  s.addText([{ text: L('ブロックから'), options: { breakLine: true } }, { text: L('Python まで、'), options: { breakLine: true } }, { text: LANG === 'en' ? 'ready for the classroom' : '授業でそのまま使える' }], { placeholder: 'title' });
  s.addText([{ text: L('無料・インストール不要・日本語と英語'), options: { breakLine: true } },
             { text: L('14アプリ 86課題、動画・本・ワークシート・指導案つき'), options: { breakLine: true } },
             { text: L('舞鶴工業高等専門学校　井上泰仁'), options: { fontSize: 13 } }], { placeholder: 'body' });
  pic(s, 'about.png', 6.1, 1.2, 3.4, 2.02, L('この アプリに ついて の画面'));
  pic(s, 'cert-1.png', 6.67, 3.45, 2.26, 1.6, L('修了証'));
  s.addNotes(L('ご清聴ありがとうございました。'));

  const out = LANG === 'en' ? '/tmp/deck/Block_Programming_System_Overview.pptx' : '/tmp/deck/ブロックでプログラミング_システム紹介.pptx';
  await pres.writeFile({ fileName: out });
  await applyTheme(out, THEME);
  console.log('wrote', out);
})();
