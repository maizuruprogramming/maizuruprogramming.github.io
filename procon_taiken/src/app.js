
/* ============ navigation ============ */
const $=id=>document.getElementById(id);
let mode='solo';
function show(name){
  if(typeof closeDiePop==='function') closeDiePop();
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on'));
  $('s-'+name).classList.add('on'); window.scrollTo(0,0);
  if(name==='rules') initRules();
  if(name==='krules') initKRules();
  if(name==='code') codeSetup(SETTINGS.game); else if(typeof codeStop==='function') codeStop();
}
function setupTitles(){
  const s=t(mode==='robot'?'robot_title':'solo_title');
  $('setupTitle').textContent=s; $('gameTitle').textContent=s; $('kgameTitle').textContent=s;
}
/* ---- 2つの 競技（第36回「エ。ー縁結びの誘導についてー」／第35回「シン・よみがえれ世界遺産」） ---- */
const GAMEPAL=()=>[0,1,2,3,1,2,3,0,2,3,0,1,3,0,1,2].map(v=>kColor(v,SETTINGS.theme));
function renderHome(){
  const k=SETTINGS.game==='kata';
  document.querySelectorAll('#gameSw button').forEach(b=>b.classList.toggle('on',b.dataset.g===SETTINGS.game));
  $('hBadge').innerHTML=t(k?'k_badge':'badge');
  $('hLogoEn').innerHTML=t('logo'); $('hTagEn').innerHTML=t('tag'); $('hFootEn').innerHTML=t('foot');
  $('hLogoK').innerHTML=t('k_logo'); $('hTagK').innerHTML=t('k_tag'); $('hFootK').innerHTML=t('k_foot');
  $('hSoloS').innerHTML=t(k?'k_m_solo_s':'m_solo_s');
  document.querySelectorAll('#s-home .head').forEach(el=>{ const on=el.dataset.g===SETTINGS.game; el.classList.toggle('on',on); el.setAttribute('aria-hidden',on?'false':'true'); });
  $('logoKata').innerHTML=GAMEPAL().map(c=>`<i style="background:${c}"></i>`).join('');
}
document.querySelectorAll('#gameSw button').forEach(b=>b.onclick=()=>{ SETTINGS.game=b.dataset.g; saveSettings(); renderHome(); renderSetup(); });
function renderSetup(){
  const k=SETTINGS.game==='kata', keepSize=document.querySelector('#segSize button.on'), keepProb=document.querySelector('#segProb button.on');
  const sizes=k?[4,6,8]:[4,6,8,10,12], probs=k?['easy','mid','hard','sample']:['rand','sample'];
  const sv=keepSize&&sizes.includes(+keepSize.dataset.v)?keepSize.dataset.v:(k?'4':'6');
  const pv=keepProb&&probs.includes(keepProb.dataset.v)?keepProb.dataset.v:probs[k?1:0];
  $('segSize').innerHTML=sizes.map(s=>`<button data-v="${s}" class="${String(s)===sv?'on':''}">${s}×${s}</button>`).join('');
  $('segProb').innerHTML=probs.map(p=>`<button data-v="${p}" class="${p===pv?'on':''}">${t(k?'k_prob_'+p:(p==='rand'?'prob_rand':'prob_sample'))}</button>`).join('');
  $('sizeP').innerHTML=t(k?'k_size_p':'size_p'); $('botP').innerHTML=t(k?'k_bot_p':'bot_p');
  ['segSize','segProb'].forEach(id=>document.querySelectorAll('#'+id+' button').forEach(b=>b.addEventListener('click',()=>{
    setSeg(id,b.dataset.v);
    if(id==='segProb'&&b.dataset.v==='sample'&&!k) setSeg('segSize','4');
    if(id==='segSize'&&!k&&b.dataset.v!=='4'&&segVal('segProb')==='sample') setSeg('segProb','rand');
  })));
}
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>{
  const g=b.dataset.go;
  if(g==='setup-solo'||g==='setup-robot'){
    mode=g==='setup-robot'?'robot':'solo';
    setupTitles();
    $('robotPanel').style.display=mode==='robot'?'':'none';
    if(mode==='robot'){ setSeg('segTime','180'); }
    show('setup');
  } else if(g==='rules') show(SETTINGS.game==='kata'?'krules':'rules');
  else show(g);
}));
function segVal(id){return document.querySelector('#'+id+' button.on').dataset.v;}
function setSeg(id,v){document.querySelectorAll('#'+id+' button').forEach(b=>b.classList.toggle('on',b.dataset.v===v));}
['segTime','segBot'].forEach(id=>{
  document.querySelectorAll('#'+id+' button').forEach(b=>b.addEventListener('click',()=>{
    setSeg(id,b.dataset.v);
    if(id==='segProb'&&b.dataset.v==='sample') setSeg('segSize','4');
    if(id==='segSize'&&b.dataset.v!=='4') setSeg('segProb','rand');
  }));
});
function toast(s){const e=$('toast'); e.textContent=s; e.classList.add('on'); clearTimeout(toast.t); toast.t=setTimeout(()=>e.classList.remove('on'),2200);}

/* ============ settings（テーマ・ことば） ============ */
function saveSettings(){ try{ localStorage.setItem('enmusubi-settings',JSON.stringify(SETTINGS)); }catch(e){} }
function applyTheme(){
  document.documentElement.dataset.theme=SETTINGS.theme;
  document.querySelectorAll('.th').forEach(b=>b.classList.toggle('on',b.dataset.theme===SETTINGS.theme));
  BOARDS.forEach(b=>{ if(b.host.isConnected && !b.busy && !b.opts.theme) b.render(); });
  renderHome();
}
function applyLang(){
  document.documentElement.lang=SETTINGS.lang;
  document.title=t('doc_title');
  document.querySelectorAll('[data-i18n]').forEach(el=>{ el.innerHTML=t(el.dataset.i18n); });
  document.querySelectorAll('.langs button').forEach(b=>b.classList.toggle('on',b.dataset.lang===SETTINGS.lang));
  $('rulesJson').textContent=`${t('json_q')}
{"problem":{"field":{"size":4,
  "entities":[[6,3,4,0],
              [1,5,3,5],
              [2,7,0,6],
              [1,2,7,4]]}}}

${t('json_a')}
{"ops":[{"x":0,"y":0,"n":2},
        {"x":2,"y":2,"n":2}]}`;
  setupTitles();
  BOARDS.forEach(b=>{ if(b.host.isConnected){ if(b.drawSel) b.drawSel(); else b.drawDie(); } });
  renderHome(); renderSetup(); kRulesJson();
  if($('s-learn').classList.contains('on')) renderLearn();
  if(typeof INFO!=='undefined'){ if(INFO==='rel') showRelease(); else if(INFO==='about') showAbout(); }
  if(typeof KG!=='undefined' && KG && !KG.ended){ kUpd(KG.board); kUpdSubs(); kTick(); kUpdPos(); $('kDieName').textContent=dieName(KG.die); if(KG.hintKey) $('kHint').innerHTML=t(KG.hintKey); }
  if(G && !G.ended){ updStats(G.board); updSubs(); tick(); if(G.hintKey) $('hint').innerHTML=t(G.hintKey); }
  PLAYERS.forEach(p=>p.relabel());
  relabelCode();
}
/* ---- リリースノート／このアプリについて ---- */
const APP_VERSION='0.9.6', APP_DATE='2026-11-11';
const RELEASES=[
  {v:'0.9.6',items:{ja:['設定に「勉強の仕方・遊び方」ページを追加（遊び方の動画・おすすめの進め方・ヒント・授業での使い方の例）','「このアプリについて」に 高専プロコン公式サイトへの リンクを追加'],en:['Added a “How to learn & play” page in Settings (how-to video, suggested path, tips, lesson plan example)','Added a link to the official KOSEN PROCON site in “About this app”'],vi:['Thêm trang «Cách học & cách chơi» trong Cài đặt (video hướng dẫn, lộ trình gợi ý, mẹo, ví dụ tiết học)','Thêm liên kết đến trang chính thức của PROCON KOSEN trong «Giới thiệu ứng dụng»'],th:['เพิ่มหน้า «วิธีเรียนและวิธีเล่น» ในการตั้งค่า (วิดีโอสอนเล่น ลำดับที่แนะนำ คำแนะนำ ตัวอย่างแผนการสอน)','เพิ่มลิงก์ไปยังเว็บไซต์ทางการของโปรคอนโคเซ็นใน «เกี่ยวกับแอปนี้»'],mn:['Тохиргоонд «Суралцах ба тоглох арга» хуудас нэмэв (заавар видео, санал болгох дараалал, зөвлөгөө, хичээлийн жишээ)','«Энэ апп-ын тухай» хэсэгт Косэн Проконы албан ёсны сайтын холбоос нэмэв']}},
  {v:'0.9.5',items:{ja:['第35回「プログラムでとく」で、抜き型を 形の絵を見ながら えらべるように'],en:['35th “Solve with Blocks”: choose dies by looking at their shapes'],vi:['Lần 35 «Giải bằng khối lệnh»: chọn khuôn bằng cách xem hình dạng'],th:['ครั้งที่ 35 «แก้โจทย์ด้วยบล็อก»: เลือกแม่พิมพ์โดยดูจากรูปทรง'],mn:['35 дахь «Блокоор бодох»: хэвийг дүрсээр нь харж сонгох']}},
  {v:'0.9.4',items:{ja:['第35回のゲーム画面を、横向きでも1画面に収まるように（操作パネルを2列に）'],en:['The 35th contest’s game screen now fits on one screen in landscape (two-column controls)'],vi:['Màn hình chơi phần thi lần 35 nay vừa một màn hình khi để ngang (bảng điều khiển hai cột)'],
    th:['หน้าจอเกมของการแข่งขันครั้งที่ 35 แสดงครบในหน้าเดียวเมื่อวางแนวนอน (แผงควบคุมสองคอลัมน์)'],mn:['35 дахь тэмцээний тоглоомын дэлгэц хэвтээ байрлалд нэг дэлгэцэнд багтдаг болсон (хоёр баганатай удирдлага)']}},
  {v:'0.9.3',items:{ja:['ホーム画面の競技切り替えで、第35回を左側に','第35回・第36回のタイトルを同じ文字の大きさに','競技を切り替えても、ボタンやカードの位置が動かないように'],
    en:['The 35th contest is now on the left of the switch on the home screen','Both contest titles now use the same font size','Buttons and cards stay in place when switching contests'],
    vi:['Phần thi lần 35 nay nằm bên trái nút chuyển ở trang chủ','Tiêu đề hai phần thi có cùng cỡ chữ','Nút và thẻ không bị dịch chuyển khi chuyển phần thi'],
    th:['ย้ายการแข่งขันครั้งที่ 35 ไปไว้ด้านซ้ายของปุ่มสลับในหน้าแรก','ชื่อการแข่งขันทั้งสองใช้ขนาดตัวอักษรเท่ากัน','ปุ่มและการ์ดไม่เลื่อนตำแหน่งเมื่อสลับการแข่งขัน'],
    mn:['Нүүр хуудасны сонголтод 35 дахь тэмцээнийг зүүн талд байрлуулсан','Хоёр тэмцээний гарчиг ижил хэмжээтэй үсэгтэй болсон','Тэмцээн солиход товч, картын байрлал хөдлөхгүй болсон']}},
  {v:'0.9.2',items:{ja:['タイトル上のメッセージを、第36回・第35回とも「高専プロコン 競技部門を たいけんしよう」にそろえた'],en:['The message above the title is now the same for both contests: “Try the KOSEN PROCON Competition Section”'],vi:['Dòng chữ phía trên tiêu đề nay giống nhau cho cả hai phần thi'],
    th:['ข้อความเหนือชื่อเรื่องเหมือนกันทั้งสองการแข่งขันแล้ว'],mn:['Гарчгийн дээрх бичвэр хоёр тэмцээнд адилхан болсон']}},
  {v:'0.9.1',items:{ja:['第36回のタイトルを大会テーマ「エ。ー縁結びの誘導についてー」に変更'],en:['Renamed the 36th contest to its official theme “エ。ー縁結びの誘導についてー”'],vi:['Đổi tên phần thi lần 36 theo chủ đề chính thức “エ。ー縁結びの誘導についてー”'],
    th:['เปลี่ยนชื่อการแข่งขันครั้งที่ 36 เป็นธีมทางการ “エ。ー縁結びの誘導についてー”'],mn:['36 дахь тэмцээний нэрийг албан ёсны сэдэв “エ。ー縁結びの誘導についてー” болгон өөрчилсөн']}},
  {v:'0.9',items:{ja:['タイ語・モンゴル語に対応（5言語に）','タイ語用のフォント（Noto Sans Thai）を追加'],en:['Added Thai and Mongolian (now 5 languages)','Added a Thai font (Noto Sans Thai)'],vi:['Hỗ trợ tiếng Thái và tiếng Mông Cổ (nay có 5 ngôn ngữ)','Thêm phông chữ tiếng Thái (Noto Sans Thai)'],
    th:['รองรับภาษาไทยและภาษามองโกเลีย (รวม 5 ภาษา)','เพิ่มฟอนต์ภาษาไทย (Noto Sans Thai)'],mn:['Тай болон монгол хэл нэмсэн (одоо 5 хэл)','Тай хэлний фонт (Noto Sans Thai) нэмсэн']}},
  {v:'0.8',items:{th:["เพิ่ม “บันทึกการเปลี่ยนแปลง” และ “เกี่ยวกับแอปนี้” ในการตั้งค่า"],mn:["Тохиргоонд “Шинэчлэлийн тэмдэглэл” ба “Энэ апп-ын тухай”-г нэмсэн"],ja:['設定に「リリースノート」と「このアプリについて」を追加'],en:['Added “Release notes” and “About this app” to Settings'],vi:['Thêm “Ghi chú phát hành” và “Giới thiệu ứng dụng” vào Cài đặt']}},
  {v:'0.7',items:{th:["เพิ่มการแข่งขันครั้งที่ 35 “ฟื้นคืนมรดกโลก” (กติกา เล่นคนเดียว ประลองกับหุ่นยนต์ คำตอบตัวอย่าง บล็อก)", "สลับระหว่างสองการแข่งขันได้ที่หน้าแรก", "แผงควบคุมสองคอลัมน์สำหรับ iPad แนวตั้ง"],mn:["35 дахь тэмцээн “Дэлхийн өвийг сэргээ”-г нэмсэн (дүрэм, ганцаараа, роботтой өрсөлдөх, жишээ хариулт, блок)", "Нүүр хуудаснаас хоёр тэмцээнийг сольж болно", "iPad босоо байрлалд хоёр баганатай удирдлагын самбар"],ja:['第35回「シン・よみがえれ世界遺産」を追加（ルール説明・ひとり・ロボット対戦・模範回答・ブロック）','ホーム画面で2つの競技を切り替えられるように','iPad 縦向きで、型抜きの操作パネルを2列に'],
    en:['Added the 35th contest “Revive the World Heritage” (rules, solo, robot battle, model answer, blocks)','Switch between the two contests on the home screen','Two-column controls for die-cutting in iPad portrait'],
    vi:['Thêm phần thi lần 35 “Hồi sinh Di sản Thế giới” (luật chơi, chơi một mình, đấu rô-bốt, đáp án mẫu, khối lệnh)','Chuyển đổi giữa hai phần thi ở trang chủ','Bảng điều khiển hai cột khi dùng iPad dọc']}},
  {v:'0.6',items:{th:["เพิ่ม “ช่วยการมองเห็นสี” (8 สีที่แยกง่าย + สัญลักษณ์รูปทรง คู่มีกรอบสองชั้นและ ✓)", "บล็อกที่ผิดพลาดแสดงด้วยกรอบเส้นประและ ⚠ ด้วย"],mn:["“Өнгө ялгалтын дэмжлэг” нэмсэн (ялгахад амар 8 өнгө + хэлбэрийн тэмдэг; хос нь давхар хүрээ ба ✓-тэй)", "Алдаатай блокийг тасархай хүрээ ба ⚠-ээр бас харуулна"],ja:['画面の色に「色覚サポート」を追加（見分けやすい8色＋形のしるし、ペアは二重枠と ✓）','エラーのブロックを破線の枠と ⚠ でも示すように'],
    en:['Added “Color-vision support” (8 easy-to-tell colors + shape marks; pairs get a double frame and ✓)','Error blocks are also shown with a dashed frame and ⚠'],
    vi:['Thêm “Hỗ trợ sắc giác” (8 màu dễ phân biệt + ký hiệu hình; cặp có viền đôi và ✓)','Khối lỗi cũng được hiển thị bằng viền nét đứt và ⚠']}},
  {v:'0.5',items:{th:["เพิ่ม “แก้โจทย์ด้วยบล็อก” (เขียนโปรแกรมแบบบล็อก) บล็อกที่กำลังทำงานจะเรืองแสง"],mn:["“Блокоор бодох” (блок програмчлал) нэмсэн; ажиллаж буй блок гэрэлтэнэ"],ja:['「プログラムでとく」（ブロック型プログラミング）を追加。実行中のブロックが光る'],en:['Added “Solve with Blocks” (block programming); the running block lights up'],vi:['Thêm “Giải bằng khối lệnh” (lập trình kéo thả); khối đang chạy sẽ sáng lên']}},
  {v:'0.4',items:{th:["เพิ่มการตั้งค่า (มาตรฐาน โหมดกลางคืน ถนอมสายตา)", "รองรับภาษาอังกฤษและภาษาเวียดนาม"],mn:["Тохиргоо нэмсэн (энгийн, шөнийн горим, нүдэнд ээлтэй)", "Англи, вьетнам хэл нэмсэн"],ja:['設定メニューを追加（ふつう・ナイトモード・目にやさしい）','英語・ベトナム語に対応'],en:['Added Settings (Standard, Night mode, Eye-friendly)','Added English and Vietnamese'],vi:['Thêm Cài đặt (Tiêu chuẩn, Ban đêm, Dịu mắt)','Hỗ trợ tiếng Anh và tiếng Việt']}},
  {v:'0.3',items:{th:["คำตอบตัวอย่างใช้จำนวนครั้งน้อยลงประมาณ 30%", "ดูคำตอบของหุ่นยนต์ย้อนหลังได้หลังการประลอง"],mn:["Жишээ хариулт ойролцоогоор 30% цөөн алхам хэрэглэдэг болсон", "Өрсөлдөөний дараа роботын хариултыг дахин үзэх боломжтой"],ja:['模範回答の手数を約3割へらした','ロボット対戦のあと、ロボットの回答を再生できるように'],en:['Model answers now use about 30% fewer moves','Replay the robot’s answer after a battle'],vi:['Đáp án mẫu dùng ít lượt hơn khoảng 30%','Xem lại đáp án của rô-bốt sau trận đấu']}},
  {v:'0.2',items:{th:["คำตอบตัวอย่างเล่นอัตโนมัติเมื่อหมดเวลา"],mn:["Хугацаа дуусахад жишээ хариулт автоматаар тоглоно"],ja:['時間切れのとき、模範回答を自動で再生'],en:['Model answer plays automatically when time runs out'],vi:['Đáp án mẫu tự động phát khi hết giờ']}},
  {v:'0.1',items:{th:["เวอร์ชันแรก: การแข่งขันครั้งที่ 36 “エ。ー縁結びの誘導についてー” — กติกา เล่นคนเดียว ประลองกับหุ่นยนต์"],mn:["Анхны хувилбар: 36 дахь тэмцээн “エ。ー縁結びの誘導についてー” — дүрэм, ганцаараа тоглох, роботтой өрсөлдөх"],ja:['初版：第36回「エ。ー縁結びの誘導についてー」のルール説明・ひとりであそぶ・ロボットとしょうぶ'],en:['First version: 36th contest “エ。ー縁結びの誘導についてー” rules, solo play, robot battle'],vi:['Phiên bản đầu: phần thi lần 36 “エ。ー縁結びの誘導についてー” — luật chơi, chơi một mình, đấu rô-bốt']}}
];
function showRelease(){
  $('infoBody').innerHTML=`<h3>${t('rel_title')}</h3>`+RELEASES.map((r,i)=>`<div class="rel${i===0?' new':''}"><span class="rv">${t('rel_ver',{v:r.v})}</span><span class="rd">${APP_DATE}</span>
    <ul>${(r.items[SETTINGS.lang]||r.items.ja).map(s=>`<li>${s}</li>`).join('')}</ul></div>`).join('');
  $('infoModal').classList.add('on'); $('infoModal').querySelector('.box').scrollTop=0; INFO='rel';
}
function showAbout(){
  $('infoBody').innerHTML=`<div class="about"><h3>${t('about_title')}</h3>
    <p style="font-size:15px;line-height:1.8">${t('ab_lead')}</p>
    <dl>
      <dt>${t('ab_name_h')}</dt><dd>${t('ab_name')}</dd>
      <dt>${t('ab_ver_h')}</dt><dd>${t('rel_ver',{v:APP_VERSION})}（${APP_DATE}）</dd>
      <dt>${t('ab_games_h')}</dt><dd>${t('ab_games')}</dd>
      <dt>${t('ab_for_h')}</dt><dd>${t('ab_for')}</dd>
      <dt>${t('ab_env_h')}</dt><dd>${t('ab_env')}</dd>
      <dt>${t('ab_lang_h')}</dt><dd>日本語 / English / Tiếng Việt / ไทย / Монгол</dd>
      <dt>${t('ab_site_h')}</dt><dd><a href="${PROCON_URL}" target="_blank" rel="noopener">${t('ab_site')}</a><br><span class="url">${PROCON_URL}</span></dd>
      <dt>${t('ab_src_h')}</dt><dd>${t('ab_src')}</dd>
      <dt>${t('ab_data_h')}</dt><dd>${t('ab_data')}</dd>
      <dt>${t('ab_credit_h')}</dt><dd>${t('ab_credit')}</dd>
    </dl>
    <p class="note">${t('ab_note')}</p></div>`;
  $('infoModal').classList.add('on'); $('infoModal').querySelector('.box').scrollTop=0; INFO='about';
}
let INFO=null;
/* ---- 勉強の仕方・遊び方 ---- */
const PROCON_URL='https://www.procon.gr.jp/', HOWTO_VIDEO='howto.mp4';
let LEARN_FROM='home';
function renderLearn(){
  const box=$('learnBody'); if(!box) return;
  const v=box.querySelector('video'); const tm=v? v.currentTime:0;
  const steps=[1,2,3,4,5,6].map(i=>`<li><b>${t('lr_s'+i+'_h')}</b><span>${t('lr_s'+i)}</span></li>`).join('');
  box.innerHTML=`
  <div class="panel lrn">
    <h3>🎬 ${t('lr_video_h')}</h3>
    <p class="lrlead">${t('lr_video_p')}</p>
    <div class="lrvid"><video controls playsinline preload="metadata" src="${HOWTO_VIDEO}"></video><div class="lrerr" hidden>${t('lr_video_err')}</div></div>
  </div>
  <div class="panel lrn">
    <h3>🪜 ${t('lr_steps_h')}</h3>
    <ol class="lrsteps">${steps}</ol>
  </div>
  <div class="lrtips">
    <div class="panel lrn"><h3>🏯 ${t('lr_k_h')}</h3><ul>${t('lr_k_tips')}</ul></div>
    <div class="panel lrn"><h3>🔁 ${t('lr_e_h')}</h3><ul>${t('lr_e_tips')}</ul></div>
  </div>
  <div class="panel lrn">
    <h3>🧑‍🏫 ${t('lr_t_h')}</h3>
    <p>${t('lr_t_p')}</p>
    <ol class="lrplan">${t('lr_t_plan')}</ol>
    <p class="lrsmall">${t('lr_t_note')}</p>
  </div>
  <div class="panel lrn lrlink">
    <h3>🔗 ${t('lr_link_h')}</h3>
    <p>${t('lr_link_p')}</p>
    <a class="btn sub" href="${PROCON_URL}" target="_blank" rel="noopener">${t('ab_site')} ↗</a>
  </div>`;
  const nv=box.querySelector('video');
  nv.addEventListener('error',()=>{ nv.hidden=true; box.querySelector('.lrerr').hidden=false; });
  if(tm) nv.addEventListener('loadedmetadata',()=>{ nv.currentTime=tm; },{once:true});
}
function openLearn(){
  const cur=document.querySelector('.screen.on'); LEARN_FROM=cur&&cur.id!=='s-learn'? cur.id.slice(2) : 'home';
  $('settings').classList.remove('on');
  renderLearn(); show('learn');
}
$('learnBtn').onclick=openLearn;
$('learnBack').onclick=()=>{ const v=document.querySelector('#learnBody video'); if(v) v.pause(); show(LEARN_FROM); };
$('relBtn').onclick=showRelease; $('aboutBtn').onclick=showAbout;
$('infoClose').onclick=()=>{ $('infoModal').classList.remove('on'); INFO=null; };
$('infoModal').addEventListener('click',e=>{ if(e.target.id==='infoModal'){ $('infoModal').classList.remove('on'); INFO=null; } });
$('gearBtn').onclick=()=>$('settings').classList.add('on');
$('setClose').onclick=()=>$('settings').classList.remove('on');
$('settings').addEventListener('click',e=>{ if(e.target.id==='settings') $('settings').classList.remove('on'); });
document.querySelectorAll('.th').forEach(b=>b.onclick=()=>{ SETTINGS.theme=b.dataset.theme; saveSettings(); applyTheme(); });
document.querySelectorAll('.langs button').forEach(b=>b.onclick=()=>{ SETTINGS.lang=b.dataset.lang; saveSettings(); applyLang(); });

/* ============ rules slides ============ */
let slide=0, rulesReady=false, d2;
const PAIR_DEMO=[[6,3,4,1],[6,5,7,2],[0,0,3,5],[1,2,7,4]];   // 「6」たてペア・「0」よこペア（募集要項 図1右と同じ形）
function initRules(){
  if(!rulesReady){
    rulesReady=true;
    const mp=Math.min(380, window.innerWidth-90);
    const d0=new Board($('demo0'),{field:SAMPLE,maxPx:mp,coord:true,interactive:true,hideLabel:true});
    d0.setSel=function(x,y){ this.blinkPartner(x,y); };
    d0.selEl.style.display='none';
    new Board($('demo1'),{field:PAIR_DEMO,maxPx:mp});
    d2=new Board($('demo2'),{field:SAMPLE,maxPx:mp,sel:{x:1,y:1,n:2}});
    $('dots').innerHTML='<i></i>'.repeat(5);
  }
  goSlide(slide);
}
function goSlide(i){
  slide=Math.max(0,Math.min(4,i));
  document.querySelectorAll('.slide').forEach(s=>s.classList.toggle('on',+s.dataset.i===slide));
  document.querySelectorAll('#dots i').forEach((d,k)=>d.classList.toggle('on',k===slide));
  $('prev').disabled=slide===0; $('next').style.visibility=slide===4?'hidden':'visible';
}
$('prev').onclick=()=>goSlide(slide-1); $('next').onclick=()=>goSlide(slide+1);
const demoPos={2:[1,1],3:[0,0],4:[0,0]};
document.querySelectorAll('#demo2seg button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#demo2seg button').forEach(x=>x.classList.toggle('on',x===b));
  const n=+b.dataset.n; d2.setField(SAMPLE); d2.setSel(...demoPos[n],n);
}));
$('demo2rot').onclick=()=>d2.doRotate();
$('demo2reset').onclick=()=>d2.setField(SAMPLE);

/* ============ game ============ */
let G=null;
$('startBtn').onclick=()=>{ if(SETTINGS.game==='kata') startKata(); else startGame(); };
function startGame(){
  stopPlayers();
  const S=+segVal('segSize'), limit=+segVal('segTime');
  const field = segVal('segProb')==='sample' ? clone(SAMPLE) : genField(S);
  G={S,limit,start:Date.now(),field0:clone(field),ops:[],hist:[],subs:[],ended:false,robot:null,hintKey:'hint_start'};
  if(mode==='robot'){ G.robot=robotSolver(field,+segVal('segBot')); G.robot.run(); }
  setupTitles();
  const seg=$('segN'); seg.innerHTML='';
  for(let n=2;n<=S;n++){const b=document.createElement('button'); b.textContent=n+'×'+n; b.dataset.v=n; b.onclick=()=>{G.board.setSel(G.board.sel.x,G.board.sel.y,n);}; seg.appendChild(b);}
  show('game');
  $('hint').innerHTML=t('hint_start');
  const maxPx=Math.min(window.innerWidth>860? window.innerWidth-370 : window.innerWidth-48, window.innerHeight-120, 760);
  G.board=new Board($('gameBoard'),{field,interactive:true,coord:$('coordChk').checked,maxPx,
    onChange:updStats,onSel:s=>{document.querySelectorAll('#segN button').forEach(b=>b.classList.toggle('on',+b.dataset.v===s.n));}});
  G.board.setSel(0,0,2);
  updSubs(); updStats(G.board);
  clearInterval(G.tick); G.tick=setInterval(tick,250); tick();
}
function elapsed(){return Math.floor((Date.now()-G.start)/1000);}
function fmt(s){return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
function tick(){
  if(!G||G.ended) return;
  const e=elapsed();
  if(G.limit){ const r=Math.max(0,G.limit-e); $('stTimeL').innerHTML=t('st_left'); $('stTime').textContent=fmt(r); $('stTime').style.color=r<=30?'var(--shu)':''; if(r<=0) finish(true); }
  else { $('stTimeL').innerHTML=t('st_elapsed'); $('stTime').textContent=fmt(e); $('stTime').style.color=''; }
}
function updStats(b){
  if(!G||!b) return;
  $('stPair').textContent=b.pairs; $('pairOf').textContent=t('pair_of',{a:b.pairs,b:G.S*G.S/2});
  $('stMove').textContent=G.ops.length;
  $('meter').style.width=(b.pairs/(G.S*G.S/2)*100)+'%';
  $('undoBtn').disabled=!G.hist.length;
  if(b.pairs===G.S*G.S/2 && !G.ended && G.ops.length && !G.done){ G.done=true; setTimeout(()=>{ toast(t('toast_all')); submit(true); finish(false); },500); }
}
function setHint(k){ G.hintKey=k; $('hint').innerHTML=t(k); }
$('rotBtn').onclick=()=>{
  if(!G||G.ended||G.board.busy) return;
  G.hist.push(clone(G.board.field)); G.ops.push({...G.board.sel});
  G.board.doRotate((b,a)=>{ setHint(a>b?'hint_up':a<b?'hint_down':'hint_same'); });
};
$('undoBtn').onclick=()=>{ if(!G||!G.hist.length||G.board.busy) return; G.ops.pop(); G.board.setField(G.hist.pop()); };
$('coordChk').onchange=e=>{ if(G&&G.board){ G.board.showCoord=e.target.checked; G.board.render(); } };
$('submitBtn').onclick=()=>submit(false);
function submit(silent){
  if(!G||G.ended) return;
  if(G.subs.length>=30){ toast(t('toast_max')); return; }
  G.subs.push({pairs:G.board.pairs,moves:G.ops.length,time:elapsed(),ops:G.ops.map(o=>({...o}))});
  updSubs();
  if(!silent) toast(t('toast_ok',{p:G.board.pairs,m:G.ops.length}));
}
function updSubs(){ if(!G) return; $('subInfo').textContent=t('sub_info',{n:G.subs.length}) + (G.subs.length?t('sub_last',{p:G.subs.at(-1).pairs}):''); }
$('quitBtn').onclick=()=>{ if(G && !G.ended && G.ops.length){ finish(false); } else { if(G){clearInterval(G.tick);G.ended=true;if(G.robot)clearTimeout(G.robot.timer);} show('home'); } };

const statLines=s=>`${t('l_pairs')} <b>${s.pairs}</b> / ${G.S*G.S/2}<br>${t('l_moves')} <b>${s.moves}</b><br>${t('l_time')} ${fmt(s.time)}`;
function finish(timeout){
  if(G.ended) return; clearInterval(G.tick);
  let auto=false;
  if(!G.subs.length){ submit(true); auto=true; }
  G.ended=true;
  if(mode==='robot'){ G.robot.finishNow(); G.robot.pairs=pairSet(G.robot.field).cnt; G.robot.time=Math.min(elapsed(), 1+Math.ceil(G.robot.ops.length/10)); }
  const me=G.subs.at(-1), max=G.S*G.S/2;
  let html='';
  if(mode==='robot'){
    const r=G.robot, rb={pairs:r.pairs,moves:r.ops.length,time:r.time};
    let win, why;
    if(me.pairs!==rb.pairs){ win=me.pairs>rb.pairs; why=t('why1'); }
    else if(me.moves!==rb.moves){ win=me.moves<rb.moves; why=t('why2'); }
    else if(me.time!==rb.time){ win=me.time<rb.time; why=t('why3'); }
    else { win=null; why=t('why4'); }
    html=`<div class="big">${win===null?'🤝':win?'🏆':'🤖'}</div><h3>${t(win===null?'r_draw':win?'r_win':'r_lose')}</h3>
      <div class="vs"><div class="side ${win?'win':''}"><h5>${t('you')}</h5><div>${statLines(me)}</div></div>
      <div class="mid">VS</div>
      <div class="side ${win===false?'win':''}"><h5>${t('robot')}</h5><div>${statLines(rb)}</div></div></div>
      <p class="why">${why}</p>
      <div id="robotArea"></div>`;
  } else {
    const rate=me.pairs/max;
    html=`<div class="big">${rate===1?'🎉':rate>=.5?'✨':'🌱'}</div><h3>${t(rate===1?'perfect':'good')}</h3>
      <div class="vs" style="grid-template-columns:1fr"><div class="side"><div style="font-size:18px">${t('l_pairs')} <b style="font-size:28px;color:var(--shu)">${me.pairs}</b> / ${max}　｜　${t('l_moves')} <b>${me.moves}</b>　｜　${t('l_time')} ${fmt(me.time)}</div></div></div>
      <p class="why">${t(rate===1?'msg_perfect':'msg_tip')}</p>`;
  }
  if(timeout) html=`<p style="font-weight:800;color:var(--shu)">${t('timeup')}</p>`+html;
  if(auto) html+=`<p class="why" style="font-size:13px">${t('auto_note')}</p>`;
  html+= timeout ? `<div id="modelArea"></div>` : `<button class="btn sub modelbtn" id="showModel">${t('show_model')}</button><div id="modelArea"></div>`;
  html+=`<details><summary>${t('json_mine')}</summary><pre class="json" style="margin-top:8px">${JSON.stringify({ops:me.ops}).replace(/\},\{/g,'},\n  {').replace('[{','[\n  {').replace('}]}','}\n]}')}</pre></details>
    <div class="mbtns"><button class="btn main" id="againBtn">${t('again')}</button><button class="btn sub" id="homeBtn">${t('home')}</button></div>`;
  $('modalBox').innerHTML=html; $('modal').classList.add('on');
  stopPlayers();
  if(mode==='robot') new Player($('robotArea'),{titleKey:'robot_ans',field0:G.field0,ops:G.robot.ops,auto:!timeout,
    desc:()=>t('robot_desc',{p:G.robot.pairs,m:G.robot.ops.length})});
  if(timeout) showModel(me,true);
  else $('showModel').onclick=()=>{ $('showModel').remove(); showModel(me,false); };
  $('againBtn').onclick=()=>{ stopPlayers(); $('modal').classList.remove('on'); startGame(); };
  $('homeBtn').onclick=()=>{ stopPlayers(); $('modal').classList.remove('on'); show('home'); };
}

/* ============ replay player（模範回答・ロボットの回答） ============ */
const SPEEDS={slow:900,mid:450,fast:60};
let PLAYERS=[];
function stopPlayers(){ PLAYERS.forEach(p=>p.stop()); PLAYERS=[]; }
function Player(host,{titleKey,desc,field0,ops,auto}){
  this.field0=field0; this.ops=ops; this.k=0; this.playing=false; this.speed='mid'; this.max=field0.length**2/2;
  this.titleKey=titleKey; this.desc=desc;
  host.innerHTML=`<div class="model">
    <h4 class="pt"></h4><p class="pd"></p>
    <div class="pb" style="display:flex;justify-content:center;padding-top:30px"></div>
    <div class="prog"></div>
    <div class="play">
      <button class="btn sub" data-a="first">⏮</button>
      <button class="btn sub" data-a="step"></button>
      <button class="btn main" data-a="play"></button>
      <button class="btn sub" data-a="last">⏭</button>
    </div>
    <div class="play"><div class="seg"><button data-v="slow"></button><button data-v="mid" class="on"></button><button data-v="fast"></button></div></div>
    <details><summary class="pj"></summary><pre class="json" style="margin-top:8px">${JSON.stringify({ops})}</pre></details>
  </div>`;
  this.el=host; this.progEl=host.querySelector('.prog'); this.playBtn=host.querySelector('[data-a=play]');
  this.board=new Board(host.querySelector('.pb'),{field:field0,maxPx:Math.min(420,window.innerWidth-100),onChange:()=>this.prog()});
  this.board.sel=null; this.board.drawSel();
  const A=a=>host.querySelector(`[data-a=${a}]`);
  A('first').onclick=()=>this.reset();
  A('last').onclick=()=>{ this.stop(); let g=clone(field0); ops.forEach(o=>g=rotate(g,o.x,o.y,o.n)); this.k=ops.length; this.board.sel=null; this.board.setField(g); };
  A('step').onclick=()=>{ this.stop(); if(!this.board.busy) this.step(true); };
  this.playBtn.onclick=()=>{ if(this.playing){this.stop();} else { if(this.k>=ops.length) this.reset(); this.playing=true; this.btn(); this.loop(); } };
  host.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{ host.querySelectorAll('.seg button').forEach(x=>x.classList.toggle('on',x===b)); this.speed=b.dataset.v; });
  PLAYERS.push(this);
  this.relabel();
  if(auto) setTimeout(()=>{ if(!this.playing&&this.k===0) this.playBtn.onclick(); },900);
}
Player.prototype.relabel=function(){
  const h=this.el;
  h.querySelector('.pt').innerHTML=t(this.titleKey); h.querySelector('.pd').innerHTML=this.desc();
  h.querySelector('[data-a=step]').textContent=t('p_step');
  h.querySelector('.seg [data-v=slow]').textContent=t('p_slow'); h.querySelector('.seg [data-v=mid]').textContent=t('p_mid'); h.querySelector('.seg [data-v=fast]').textContent=t('p_fast');
  h.querySelector('.pj').textContent=t('p_json');
  this.btn(); this.prog();
};
Player.prototype.prog=function(){ if(this.progEl&&this.board) this.progEl.textContent=t('p_prog',{k:this.k,n:this.ops.length,p:this.board.pairs,max:this.max}); };
Player.prototype.btn=function(){ this.playBtn.textContent=t(this.playing?'p_pause':'p_play'); };
Player.prototype.stop=function(){ clearTimeout(this.timer); this.playing=false; this.btn(); };
Player.prototype.reset=function(){ this.stop(); this.k=0; this.board.sel=null; this.board.setField(this.field0); };
Player.prototype.step=function(anim,cb){
  if(this.k>=this.ops.length){ this.stop(); return; }
  const o=this.ops[this.k++]; this.board.setSel(o.x,o.y,o.n);
  if(anim) this.board.doRotate(()=>{this.prog(); cb&&cb();});
  else { this.board.field=rotate(this.board.field,o.x,o.y,o.n); this.board.render(); cb&&cb(); }
};
Player.prototype.loop=function(){
  if(!this.playing) return;
  const ms=SPEEDS[this.speed], anim=ms>=400;
  this.step(anim,()=>{ if(this.playing) this.timer=setTimeout(()=>this.loop(), anim? ms-480+120 : ms); });
};
function showModel(me,auto){
  const sol=modelSolve(G.field0), max=G.S*G.S/2;
  new Player($('modelArea'),{titleKey:'model_title',field0:G.field0,ops:sol.ops,auto,
    desc:()=>(auto?t('model_auto'):'')+(me.pairs<max? t('model_lt',{me:me.pairs,p:sol.pairs,m:sol.ops.length}) : t('model_all',{m:sol.ops.length,me:me.moves}))+'<br>'+t('model_plan')});
  if(auto) setTimeout(()=>$('modelArea').scrollIntoView({behavior:'smooth',block:'start'}),100);
}

let rz; window.addEventListener('resize',()=>{clearTimeout(rz); rz=setTimeout(()=>{ if(G&&G.board&&$('s-game').classList.contains('on')&&!G.board.busy){ const s=G.board.sel; G.board.opts.maxPx=Math.min(window.innerWidth>860? window.innerWidth-370 : window.innerWidth-48, window.innerHeight-120, 760); G.board.mount(); G.board.sel=s; G.board.drawSel(); } },200);});

/* ============ start ============ */
%%CODE%%
applyTheme(); applyLang();
