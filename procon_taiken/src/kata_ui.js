
/* ============ 第35回：ボード表示（ピースが すべって 動く） ============ */
const KCOL={normal:['#e2a63b','#4a8fd0','#d4574a','#55a868'],night:['#b9862f','#3b72a8','#a9473c','#448653'],eye:['#c9a35e','#6f8fae','#b77a68','#7f9e78'],
  cud:['#E69F00','#56B4E9','#D55E00','#009E73']};
const KSHAPE=['●','▲','■','◆'].map(c=>c+'︎');
function kColor(v,th){ return (KCOL[th]||KCOL.normal)[v]; }
let KBID=1;
function KBoard(host,opts){
  this.host=host; this.opts=opts||{}; this.busy=false; this.showMiss=opts.showMiss!==false;
  this.setVals(opts.vals);
  this.die=opts.die||null; this.pos=opts.pos||{x:0,y:0};
  BOARDS.push(this);
  this.mount();
}
KBoard.prototype.setVals=function(vals){
  this.H=vals.length; this.W=vals[0].length; this.val={}; this.ids=vals.map(r=>r.map(v=>{ const id=KBID++; this.val[id]=v; return id; }));
};
KBoard.prototype.vals=function(){ return this.ids.map(r=>r.map(id=>this.val[id])); };
KBoard.prototype.mount=function(){
  const max=this.opts.maxPx||360, gap=this.W>10?2:3;
  const cs=Math.floor(Math.min((max-gap*(this.W+1))/this.W,(this.opts.maxH||max)/this.H*0.98-gap));
  this.cs=Math.max(8,cs); this.gap=gap;
  this.host.innerHTML='';
  const w=document.createElement('div'); w.className='kwrap'+(this.opts.interactive?' kint':'');
  w.style.width=(this.cs*this.W+gap*(this.W+1))+'px'; w.style.height=(this.cs*this.H+gap*(this.H+1))+'px';
  w.style.setProperty('--cs',this.cs+'px');
  this.host.appendChild(w); this.wrap=w; this.els={};
  this.ids.flat().forEach(id=>{ const d=document.createElement('div'); d.className='kp'; this.els[id]=d; w.appendChild(d); });
  this.dieEl=document.createElement('div'); this.dieEl.className='kdie'; w.appendChild(this.dieEl);
  if(this.opts.interactive) this.bind();
  this.render(true);
};
KBoard.prototype.xy=function(x,y){ return [this.gap+x*(this.cs+this.gap), this.gap+y*(this.cs+this.gap)]; };
KBoard.prototype.render=function(instant){
  const th=this.opts.theme||SETTINGS.theme, goal=this.opts.goal;
  this.wrap.dataset.th=th;
  for(let y=0;y<this.H;y++) for(let x=0;x<this.W;x++){
    const id=this.ids[y][x], d=this.els[id], v=this.val[id], [px,py]=this.xy(x,y);
    if(instant) d.style.transition='none';
    d.style.transform=`translate(${px}px,${py}px)`;
    d.style.background=kColor(v,th);
    d.className='kp'+(this.showMiss&&goal&&goal[y][x]!==v?' miss':'')+(th==='cud'&&(v===0||v===1)?' dk':'');
    d.innerHTML=v+(th==='cud'?`<span class="shp">${KSHAPE[v]}</span>`:'');
    if(instant){ void d.offsetWidth; d.style.transition=''; }
  }
  this.drawDie();
  if(this.opts.onChange) this.opts.onChange(this);
};
KBoard.prototype.drawDie=function(){
  const el=this.dieEl, d=this.die;
  if(!d){ el.style.display='none'; return; }
  el.style.display='block';
  const [px,py]=this.xy(this.pos.x,this.pos.y), c=this.cs, g=this.gap;
  el.style.transform=`translate(${px}px,${py}px)`;
  el.innerHTML=d.cells.map((row,yy)=>row.map((v,xx)=>`<i class="${v?'on':''}" style="left:${xx*(c+g)}px;top:${yy*(c+g)}px;width:${c}px;height:${c}px"></i>`).join('')).join('')+
    (this.opts.hideLabel?'':`<b class="klbl">${t('k_pos',{x:this.pos.x,y:this.pos.y})}</b>`);
};
KBoard.prototype.setDie=function(die,keepPos){ this.die=die; if(!keepPos) this.pos={x:0,y:0}; this.clampPos(); this.drawDie(); };
KBoard.prototype.clampPos=function(){ if(!this.die) return; const d=this.die; this.pos.x=Math.max(-(d.w-1),Math.min(this.W-1,this.pos.x)); this.pos.y=Math.max(-(d.h-1),Math.min(this.H-1,this.pos.y)); };
KBoard.prototype.cellAt=function(e){ const r=this.wrap.getBoundingClientRect(); return [Math.floor((e.clientX-r.left-this.gap/2)/(this.cs+this.gap)), Math.floor((e.clientY-r.top-this.gap/2)/(this.cs+this.gap))]; };
KBoard.prototype.bind=function(){
  let st=null;
  this.wrap.addEventListener('pointerdown',e=>{ if(this.busy||!this.die) return; e.preventDefault(); this.wrap.setPointerCapture(e.pointerId); st={c:this.cellAt(e),o:{...this.pos},moved:false}; });
  this.wrap.addEventListener('pointermove',e=>{ if(!st) return; const [cx,cy]=this.cellAt(e); const dx=cx-st.c[0], dy=cy-st.c[1]; if(!dx&&!dy&&!st.moved) return; st.moved=true; this.pos={x:st.o.x+dx,y:st.o.y+dy}; this.clampPos(); this.drawDie(); if(this.opts.onPos) this.opts.onPos(this.pos); });
  const end=()=>{ if(!st) return; if(!st.moved){ const [cx,cy]=st.c; if(cx>=0&&cy>=0&&cx<this.W&&cy<this.H){ this.pos={x:cx,y:cy}; this.clampPos(); this.drawDie(); if(this.opts.onPos) this.opts.onPos(this.pos); } } st=null; };
  this.wrap.addEventListener('pointerup',end); this.wrap.addEventListener('pointercancel',()=>{st=null;});
};
// 型抜きを アニメーションつきで 行う
KBoard.prototype.cut=function(die,x,y,s,animate,cb){
  const W=this.W,H=this.H, before=this.ids.map(r=>r.slice());
  const hit=(xx,yy)=>{ const dx=xx-x, dy=yy-y; return dy>=0&&dy<die.h&&dx>=0&&dx<die.w&&die.cells[dy][dx]===1; };
  const cutIds=[]; for(let yy=0;yy<H;yy++) for(let xx=0;xx<W;xx++) if(hit(xx,yy)) cutIds.push(before[yy][xx]);
  this.ids=katanuki(before,die.cells,x,y,s);
  const gen=this.gen=(this.gen||0)+1;
  if(!animate){ this.render(); cb&&cb(); return; }
  this.busy=true;
  cutIds.forEach(id=>this.els[id].classList.add('cut'));
  setTimeout(()=>{
    if(gen!==this.gen) return;
    this.render();
    cutIds.forEach(id=>this.els[id].classList.add('cut'));
    setTimeout(()=>{ if(gen!==this.gen) return; cutIds.forEach(id=>this.els[id].classList.remove('cut')); this.busy=false; cb&&cb(); },430);
  },260);
};
KBoard.prototype.setGrid=function(vals){ this.gen=(this.gen||0)+1; this.busy=false; this.setVals(vals); this.mount(); };
KBoard.prototype.miss=function(){ return this.opts.goal? kMiss(this.vals(),this.opts.goal) : 0; };

// 抜き型の 小さな 絵
function dieThumb(d,px){
  const n=Math.max(d.w,d.h), c=Math.max(3,Math.floor(px/n)-1);
  return `<span class="dthumb" style="grid-template-columns:repeat(${d.w},${c}px)">${d.cells.flat().map(v=>`<i class="${v?'on':''}" style="width:${c}px;height:${c}px"></i>`).join('')}</span>`;
}
function dieName(d){ return d.type? `${d.p}（${d.w}×${d.h} ${['','Ⅰ','Ⅱ','Ⅲ'][d.type]}）` : `${d.p}（${d.w}×${d.h} ${t('k_gen_short')}）`; }

/* ============ 第35回：ルール説明 ============ */
let krulesReady=false, kslide=0, kd2=null;
function initKRules(){
  if(!krulesReady){
    krulesReady=true;
    const mp=Math.min(300,(window.innerWidth-120)/2);
    new KBoard($('kdemo0a'),{vals:K_SAMPLE.start,maxPx:mp,goal:K_SAMPLE.goal,showMiss:false});
    new KBoard($('kdemo0b'),{vals:K_SAMPLE.goal,maxPx:mp});
    const ex=[makeFixedDie(4),makeFixedDie(5),makeFixedDie(6),...K_SAMPLE.general];
    $('kdemo1').innerHTML=ex.map((d,i)=>`<div class="dcard">${dieThumb(d,80)}<b>${i<3?t('k_type'+(i+1)):t('k_general')}</b><span>p = ${d.p}</span></div>`).join('');
    kd2=new KBoard($('kdemo2'),{vals:K_FIG1.board,maxPx:Math.min(340,window.innerWidth-90),die:K_FIG1.die,pos:{x:1,y:2}});
    $('kdots').innerHTML='<i></i>'.repeat(5);
    document.querySelectorAll('#kdemo2dir button').forEach(b=>b.onclick=()=>{ if(kd2.busy) return; kd2.setGrid(K_FIG1.board); kd2.setDie(K_FIG1.die,true); kd2.pos={x:1,y:2}; kd2.drawDie(); setTimeout(()=>kd2.cut(K_FIG1.die,1,2,+b.dataset.s,true),60); });
    $('kdemo2reset').onclick=()=>{ kd2.setGrid(K_FIG1.board); kd2.pos={x:1,y:2}; kd2.drawDie(); };
  }
  goKSlide(kslide);
}
function goKSlide(i){
  kslide=Math.max(0,Math.min(4,i));
  document.querySelectorAll('#s-krules .slide').forEach(s=>s.classList.toggle('on',+s.dataset.i===kslide));
  document.querySelectorAll('#kdots i').forEach((d,k)=>d.classList.toggle('on',k===kslide));
  $('kprev').disabled=kslide===0; $('knext').style.visibility=kslide===4?'hidden':'visible';
}
$('kprev').onclick=()=>goKSlide(kslide-1); $('knext').onclick=()=>goKSlide(kslide+1);
function kRulesJson(){
  $('krulesJson').textContent=`${t('json_q')}
{"board":{"width":6,"height":4,
  "start":["220103","213033","022103","322033"],
  "goal":["000000","111222","222233","333333"]},
 "general":{"n":2,"patterns":[
  {"p":25,"width":4,"height":2,"cells":["0111","1001"]},
  {"p":26,"width":2,"height":2,"cells":["10","01"]}]}}

${t('json_a')}
{"n":3,"ops":[{"p":4,"x":5,"y":6,"s":2},
              {"p":11,"x":3,"y":-12,"s":3},
              {"p":25,"x":6,"y":0,"s":0}]}`;
}

/* ============ 第35回：ゲーム ============ */
let KG=null;
function kMaxPx(){ return window.innerWidth>900? Math.min(window.innerWidth-420, window.innerHeight-150, 640) : Math.min(window.innerWidth-48, window.innerHeight*0.44, 560); }
function startKata(){
  stopPlayers();
  const S=+segVal('segSize'), limit=+segVal('segTime'), lv=segVal('segProb');
  const P=kMakeProblem(S, lv);
  KG={P,limit,start:Date.now(),ops:[],hist:[],subs:[],ended:false,robot:null,hintKey:'k_hint_start',die:P.dies[0]};
  if(mode==='robot'){ KG.robot=kRobotSolver(P.start,P.goal,P.dies,+segVal('segBot')); KG.robot.run(); }
  setupTitles();
  show('kgame');
  // 抜き型の パレット（ボードより 大きい ものは 出さない）
  const usable=P.dies.filter(d=>d.p>=25 || d.w<=Math.max(P.W,P.H));
  $('kDies').innerHTML=usable.map(d=>`<button class="kdb" data-p="${d.p}">${dieThumb(d,30)}<span>${d.p}</span></button>`).join('');
  $('kDies').querySelectorAll('.kdb').forEach(b=>b.onclick=()=>kPickDie(+b.dataset.p));
  $('kHint').innerHTML=t('k_hint_start');
  KG.board=new KBoard($('kBoard'),{vals:P.start,goal:P.goal,maxPx:kMaxPx(),interactive:true,die:KG.die,pos:{x:0,y:0},onChange:kUpd,onPos:()=>kUpdPos(),showMiss:$('kMissChk').checked});
  KG.goalBoard=new KBoard($('kGoal'),{vals:P.goal,maxPx:150,showMiss:false});
  kPickDie(KG.die.p);
  kUpdSubs(); kUpd(KG.board);
  clearInterval(KG.tick); KG.tick=setInterval(kTick,250); kTick();
}
function kPickDie(p){ KG.die=dieByP(KG.P.dies,p); document.querySelectorAll('#kDies .kdb').forEach(b=>b.classList.toggle('on',+b.dataset.p===p)); KG.board.setDie(KG.die,true); $('kDieName').textContent=dieName(KG.die); kUpdPos(); }
function kUpdPos(){ $('kPosTxt').textContent=t('k_pos',{x:KG.board.pos.x,y:KG.board.pos.y}); }
function kTick(){
  if(!KG||KG.ended) return;
  const e=Math.floor((Date.now()-KG.start)/1000);
  if(KG.limit){ const r=Math.max(0,KG.limit-e); $('kTimeL').innerHTML=t('st_left'); $('kTime').textContent=fmt(r); $('kTime').style.color=r<=30?'var(--shu)':''; if(r<=0) kFinish(true); }
  else { $('kTimeL').innerHTML=t('st_elapsed'); $('kTime').textContent=fmt(e); $('kTime').style.color=''; }
}
const kElapsed=()=>Math.floor((Date.now()-KG.start)/1000);
function kUpd(b){
  if(!KG||!b) return;
  const all=KG.P.W*KG.P.H, m=b.miss();
  $('kMiss').textContent=m; $('kMove').textContent=KG.ops.length; $('kMatchOf').textContent=t('k_match_of',{a:all-m,b:all});
  $('kMeter').style.width=((all-m)/all*100)+'%'; $('kUndo').disabled=!KG.hist.length;
  if(m===0 && KG.ops.length && !KG.ended && !KG.done){ KG.done=true; setTimeout(()=>{ toast(t('k_toast_all')); kSubmit(true); kFinish(false); },600); }
}
function kSetHint(k){ KG.hintKey=k; $('kHint').innerHTML=t(k); }
document.querySelectorAll('#kDir button').forEach(b=>b.onclick=()=>{
  if(!KG||KG.ended||KG.board.busy) return;
  const s=+b.dataset.s, {x,y}=KG.board.pos, before=KG.board.miss();
  KG.hist.push(KG.board.vals()); KG.ops.push({p:KG.die.p,x,y,s});
  KG.board.cut(KG.die,x,y,s,true,()=>{ const a=KG.board.miss(); kSetHint(a<before?'k_hint_up':a>before?'k_hint_down':'k_hint_same'); kUpd(KG.board); });
});
$('kUndo').onclick=()=>{ if(!KG||!KG.hist.length||KG.board.busy) return; KG.ops.pop(); const v=KG.hist.pop(), pos={...KG.board.pos}; KG.board.setGrid(v); KG.board.pos=pos; KG.board.setDie(KG.die,true); kUpd(KG.board); };
$('kMissChk').onchange=e=>{ if(KG&&KG.board){ KG.board.showMiss=e.target.checked; KG.board.render(); } };
$('kSubmit').onclick=()=>kSubmit(false);
function kSubmit(silent){
  if(!KG||KG.ended) return;
  const b=KG.board; KG.subs.push({miss:b.miss(),moves:KG.ops.length,time:kElapsed(),ops:KG.ops.map(o=>({...o}))});
  kUpdSubs(); if(!silent) toast(t('k_toast_ok',{d:b.miss(),m:KG.ops.length}));
}
function kUpdSubs(){ if(!KG) return; $('kSubInfo').textContent=t('k_sub_info',{n:KG.subs.length})+(KG.subs.length?t('k_sub_last',{d:KG.subs.at(-1).miss}):''); }
$('kQuit').onclick=()=>{ if(KG && !KG.ended && KG.ops.length){ kFinish(false); } else { if(KG){clearInterval(KG.tick);KG.ended=true;if(KG.robot)clearTimeout(KG.robot.timer);} show('home'); } };
function kAnswerJSON(ops){ return JSON.stringify({n:ops.length,ops}).replace(/\},\{/g,'},\n  {').replace('[{','[\n  {').replace('}]}','}\n]}'); }
function kFinish(timeout){
  if(KG.ended) return; clearInterval(KG.tick);
  let auto=false; if(!KG.subs.length){ kSubmit(true); auto=true; }
  KG.ended=true;
  const all=KG.P.W*KG.P.H, me=KG.subs.at(-1);
  if(mode==='robot'){ KG.robot.finishNow(); KG.robot.miss=kMiss(KG.robot.board,KG.P.goal); KG.robot.time=Math.min(kElapsed(),1+Math.ceil(KG.robot.ops.length/10)); }
  const lines=s=>`${t('k_l_miss')} <b>${s.miss}</b> / ${all}<br>${t('l_moves')} <b>${s.moves}</b><br>${t('l_time')} ${fmt(s.time)}`;
  let html='';
  if(mode==='robot'){
    const r=KG.robot, rb={miss:r.miss,moves:r.ops.length,time:r.time}; let win,why;
    if(me.miss!==rb.miss){ win=me.miss<rb.miss; why=t('k_why1'); }
    else if(me.moves!==rb.moves){ win=me.moves<rb.moves; why=t('k_why2'); }
    else if(me.time!==rb.time){ win=me.time<rb.time; why=t('k_why3'); }
    else { win=null; why=t('why4'); }
    html=`<div class="big">${win===null?'🤝':win?'🏆':'🤖'}</div><h3>${t(win===null?'r_draw':win?'r_win':'r_lose')}</h3>
      <div class="vs"><div class="side ${win?'win':''}"><h5>${t('you')}</h5><div>${lines(me)}</div></div><div class="mid">VS</div>
      <div class="side ${win===false?'win':''}"><h5>${t('robot')}</h5><div>${lines(rb)}</div></div></div><p class="why">${why}</p><div id="robotArea"></div>`;
  } else {
    const ok=me.miss===0;
    html=`<div class="big">${ok?'🎉':me.miss<=all/4?'✨':'🌱'}</div><h3>${t(ok?'k_perfect':'good')}</h3>
      <div class="vs" style="grid-template-columns:1fr"><div class="side"><div style="font-size:18px">${t('k_l_miss')} <b style="font-size:28px;color:var(--shu)">${me.miss}</b> / ${all}　｜　${t('l_moves')} <b>${me.moves}</b>　｜　${t('l_time')} ${fmt(me.time)}</div></div></div>
      <p class="why">${t(ok?'k_msg_perfect':'k_msg_tip')}</p>`;
  }
  if(timeout) html=`<p style="font-weight:800;color:var(--shu)">${t('timeup')}</p>`+html;
  if(auto) html+=`<p class="why" style="font-size:13px">${t('auto_note')}</p>`;
  html+= timeout ? `<div id="modelArea"></div>` : `<button class="btn sub modelbtn" id="showModel">${t('show_model')}</button><div id="modelArea"></div>`;
  html+=`<details><summary>${t('json_mine')}</summary><pre class="json" style="margin-top:8px">${kAnswerJSON(me.ops)}</pre></details>
    <div class="mbtns"><button class="btn main" id="againBtn">${t('again')}</button><button class="btn sub" id="homeBtn">${t('home')}</button></div>`;
  $('modalBox').innerHTML=html; $('modal').classList.add('on');
  stopPlayers();
  if(mode==='robot') new KPlayer($('robotArea'),{titleKey:'robot_ans',P:KG.P,ops:KG.robot.ops,auto:!timeout,desc:()=>t('k_robot_desc',{d:KG.robot.miss,m:KG.robot.ops.length})});
  const showM=(auto2)=>{ const sol=kModelSolve(KG.P.start,KG.P.goal,KG.P.dies);
    new KPlayer($('modelArea'),{titleKey:'model_title',P:KG.P,ops:sol.ops,auto:auto2,
      desc:()=>(auto2?t('model_auto'):'')+(me.miss>0? t('k_model_lt',{me:me.miss,d:sol.miss,m:sol.ops.length}) : t('k_model_all',{m:sol.ops.length,me:me.moves}))+'<br>'+t('k_model_plan')});
    if(auto2) setTimeout(()=>$('modelArea').scrollIntoView({behavior:'smooth',block:'start'}),100); };
  if(timeout) showM(true); else $('showModel').onclick=()=>{ $('showModel').remove(); showM(false); };
  $('againBtn').onclick=()=>{ stopPlayers(); $('modal').classList.remove('on'); startKata(); };
  $('homeBtn').onclick=()=>{ stopPlayers(); $('modal').classList.remove('on'); show('home'); };
}

/* ============ 第35回：回答の 再生 ============ */
function KPlayer(host,{titleKey,desc,P,ops,auto}){
  this.P=P; this.ops=ops; this.k=0; this.playing=false; this.speed='mid'; this.titleKey=titleKey; this.desc=desc;
  host.innerHTML=`<div class="model"><h4 class="pt"></h4><p class="pd"></p>
    <div class="kpb"><div class="pb"></div><div class="kgoalmini"><small>${t('k_goal_short')}</small><div class="pg"></div></div></div>
    <div class="prog"></div>
    <div class="play"><button class="btn sub" data-a="first">⏮</button><button class="btn sub" data-a="step"></button><button class="btn main" data-a="play"></button><button class="btn sub" data-a="last">⏭</button></div>
    <div class="play"><div class="seg"><button data-v="slow"></button><button data-v="mid" class="on"></button><button data-v="fast"></button></div></div>
    <details><summary class="pj"></summary><pre class="json" style="margin-top:8px">${kAnswerJSON(ops)}</pre></details></div>`;
  this.el=host; this.progEl=host.querySelector('.prog'); this.playBtn=host.querySelector('[data-a=play]');
  this.board=new KBoard(host.querySelector('.pb'),{vals:P.start,goal:P.goal,maxPx:Math.min(360,window.innerWidth-200),onChange:()=>this.prog(),hideLabel:true});
  new KBoard(host.querySelector('.pg'),{vals:P.goal,maxPx:100,showMiss:false});
  const A=a=>host.querySelector(`[data-a=${a}]`);
  A('first').onclick=()=>this.reset();
  A('last').onclick=()=>{ this.stop(); this.k=ops.length; this.board.die=null; this.board.setGrid(kReplay(P.start,P.dies,ops)); };
  A('step').onclick=()=>{ this.stop(); if(!this.board.busy) this.step(true); };
  this.playBtn.onclick=()=>{ if(this.playing) this.stop(); else { if(this.k>=ops.length) this.reset(); this.playing=true; this.btn(); this.loop(); } };
  host.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{ host.querySelectorAll('.seg button').forEach(x=>x.classList.toggle('on',x===b)); this.speed=b.dataset.v; });
  PLAYERS.push(this); this.relabel();
  if(auto) setTimeout(()=>{ if(!this.playing&&this.k===0) this.playBtn.onclick(); },900);
}
KPlayer.prototype.relabel=Player.prototype.relabel;
KPlayer.prototype.btn=Player.prototype.btn;
KPlayer.prototype.stop=Player.prototype.stop;
KPlayer.prototype.prog=function(){ if(this.progEl&&this.board) this.progEl.textContent=t('k_p_prog',{k:this.k,n:this.ops.length,d:this.board.miss()}); };
KPlayer.prototype.reset=function(){ this.stop(); this.k=0; this.board.die=null; this.board.setGrid(this.P.start); };
KPlayer.prototype.step=function(anim,cb){
  if(this.k>=this.ops.length){ this.stop(); return; }
  const o=this.ops[this.k++], d=dieByP(this.P.dies,o.p);
  this.board.die=d; this.board.pos={x:o.x,y:o.y}; this.board.drawDie();
  this.board.cut(d,o.x,o.y,o.s,anim,()=>{ this.prog(); cb&&cb(); });
};
KPlayer.prototype.loop=function(){
  if(!this.playing) return;
  const ms=SPEEDS[this.speed], anim=ms>=400;
  this.step(anim,()=>{ if(this.playing) this.timer=setTimeout(()=>this.loop(), anim? Math.max(60,ms-700+200) : ms); });
};
