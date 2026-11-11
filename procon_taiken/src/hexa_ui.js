/* ============ 第37回「ヘキサうどん」：画面 ============ */
const SQ3=Math.sqrt(3);
const HTERR={normal:['#a8d983','#c58250','#7cc4ea','#c9c9c9'],night:['#47703a','#7a4d31','#2d5c78','#55575d'],eye:['#b6c99c','#b4907a','#98b5c6','#c7c1b4'],cud:['#cfe8a8','#c98a4b','#56B4E9','#c4c4c4']};
const HKIND={normal:['#e2a63b','#d4574a','#3f7fc8','#8e5bc8','#2f9e6e'],night:['#b9862f','#a9473c','#36699f','#734aa3','#2a7d58'],eye:['#c9a35e','#b77a68','#6f8fae','#957ba8','#6f9a7c'],cud:['#E69F00','#D55E00','#0072B2','#CC79A7','#009E73']};
const HKSYM=['●','▲','■','◆','★'];
const HTEAMC=['#c8452f','#2f6fd0','#23926a','#8a4bbd'];
const HAGC=['#E69F00','#0072B2','#009E73','#CC79A7'];
const HDASH=['', '6 4', '2 4', '10 3 2 3'];
const HROADC={normal:['', '#f0a020','#d83a2a'],night:['','#c98418','#b33224'],eye:['','#d1a25a','#b8705f'],cud:['','#E69F00','#D55E00']};
const H_CAR='M-0.42 0.08 L-0.42 -0.06 L-0.27 -0.07 L-0.16 -0.26 L0.18 -0.26 L0.3 -0.07 L0.42 -0.05 L0.42 0.08 Z';
const H_DROP='M0 -0.42 C0.24 -0.12 0.3 0.02 0.3 0.1 A0.3 0.3 0 0 1 -0.3 0.1 C-0.3 0.02 -0.24 -0.12 0 -0.42 Z';
function hKindName(k){ return (t('h_kind_names')||'').split(',')[k]||('#'+k); }
function hKindChip(k,th){ const c=(HKIND[th||SETTINGS.theme]||HKIND.normal)[k]; return `<i class="hkdot" style="background:${c}">${HKSYM[k]}︎</i>`; }
function hAgentIcon(type,color,size){ size=size||22; return `<svg class="hai" width="${size}" height="${size}" viewBox="-0.5 -0.5 1 1"><circle r="0.47" fill="#fff" stroke="${color}" stroke-width="0.07"/><g transform="scale(0.8)" fill="${color}">${type==='p'?`<path d="${H_CAR}"/><circle cx="-0.24" cy="0.11" r="0.1"/><circle cx="0.24" cy="0.11" r="0.1"/>`:`<path d="${H_DROP}"/>`}</g></svg>`; }

/* ---- 六角形の ボード（SVG） ---- */
let HBID=1;
function HBoard(host,opts){
  this.host=host; this.opts=opts||{}; this.P=opts.P; this.bid=HBID++; this.busy=false;
  this.state={roads:new Array(this.P.N).fill(0),teams:[],stock:null,plans:[],sel:-1,pops:[],marks:[]};
  BOARDS.push(this); this.mount();
}
HBoard.prototype.mount=function(){
  const P=this.P, mw=this.opts.maxW||480, mh=this.opts.maxH||480;
  this.r=Math.max(8,Math.min(mw/(SQ3*(P.W+0.5)), mh/(1.5*P.H+0.5)));
  this.pad=2; this.w=SQ3*this.r*(P.W+0.5)+this.pad*2; this.h=this.r*(1.5*P.H+0.5)+this.pad*2;
  this.host.innerHTML=`<svg class="hsvg${this.opts.interactive?' hint':''}" width="${Math.round(this.w)}" height="${Math.round(this.h)}" viewBox="0 0 ${this.w} ${this.h}"><g class="hs"></g><g class="hp"></g><g class="ha"></g><g class="hx"></g></svg>`;
  this.svg=this.host.querySelector('svg'); this.wrap=this.svg; this.gS=this.svg.querySelector('.hs'); this.gP=this.svg.querySelector('.hp'); this.gA=this.svg.querySelector('.ha'); this.gX=this.svg.querySelector('.hx');
  if(this.opts.interactive) this.svg.addEventListener('click',e=>{
    const ag=e.target.closest('[data-ag]'); if(ag&&this.opts.onAgent){ this.opts.onAgent(+ag.dataset.ag); return; }
    const pt=this.svg.createSVGPoint(); pt.x=e.clientX; pt.y=e.clientY; const p=pt.matrixTransform(this.svg.getScreenCTM().inverse());
    const c=this.cellAt(p.x,p.y); if(c>=0&&this.opts.onCell) this.opts.onCell(c);
  });
  this.render();
};
HBoard.prototype.cxy=function(c){ const W=this.P.W, x=c%W, y=(c-x)/W, r=this.r; return [this.pad+SQ3*r*(x+0.5+(y%2===0?0.5:0)), this.pad+r+1.5*r*y]; };
HBoard.prototype.cellAt=function(px,py){ let best=-1,bd=1e9; for(let c=0;c<this.P.N;c++){ const [x,y]=this.cxy(c), d=(x-px)**2+(y-py)**2; if(d<bd){bd=d;best=c;} } return bd<=this.r*this.r? best : -1; };
HBoard.prototype.hexPts=function(c,k){ const [x,y]=this.cxy(c), r=this.r*(k||0.96); let s=''; for(let i=0;i<6;i++){ const a=Math.PI/180*(60*i-90); s+=(x+r*Math.cos(a)).toFixed(1)+','+(y+r*Math.sin(a)).toFixed(1)+' '; } return s; };
HBoard.prototype.set=function(o){ Object.assign(this.state,o); this.render(); };
HBoard.prototype.drawDie=function(){ this.render(); };
HBoard.prototype.render=function(){
  const P=this.P, th=SETTINGS.theme, TC=HTERR[th]||HTERR.normal, RC=HROADC[th]||HROADC.normal, KC=HKIND[th]||HKIND.normal, r=this.r, st=this.state, sa=hSpotAt(P);
  let s='';
  for(let c=0;c<P.N;c++){
    const tr=P.terr[c], [x,y]=this.cxy(c), tf=`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${r.toFixed(2)})`;
    s+=`<polygon points="${this.hexPts(c)}" fill="${TC[tr]}" class="hc"/>`;
    if(tr===1) s+=`<path transform="${tf}" d="M-0.48 0.3 L-0.14 -0.32 L0.04 -0.02 L0.18 -0.22 L0.5 0.3 Z" fill="rgba(0,0,0,.22)"/>`;
    else if(tr===2) s+=`<path transform="${tf}" d="M-0.5 -0.12 q0.125 -0.16 0.25 0 t0.25 0 t0.25 0 t0.25 0 M-0.5 0.2 q0.125 -0.16 0.25 0 t0.25 0 t0.25 0 t0.25 0" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="0.08"/>`;
    else if(tr===3){ const rs=st.roads[c]||0;
      if(rs) s+=`<polygon points="${this.hexPts(c,0.9)}" fill="${RC[rs]}" opacity="0.7"/>`;
      s+=`<path transform="${tf}" d="M-0.45 -0.22 h0.9 M-0.45 0.22 h0.9" stroke="rgba(255,255,255,.8)" stroke-width="0.07" stroke-dasharray="0.18 0.1"/>`;
      if(rs) s+=`<text x="${x}" y="${y+r*0.2}" text-anchor="middle" font-size="${r*0.62}" font-weight="800" fill="#fff" stroke="rgba(0,0,0,.45)" stroke-width="${r*0.06}" paint-order="stroke">${rs===1?'!':'!!'}</text>`; }
  }
  P.spots.forEach((sp,i)=>{
    const [x,y]=this.cxy(sp.c), left=st.stock? st.stock[i] : sp.max, empty=left<=0;
    s+=`<g opacity="${empty?0.35:1}"><circle cx="${x}" cy="${y}" r="${r*0.5}" fill="${KC[sp.kind]}" stroke="#fff" stroke-width="${r*0.09}"/>
      <text x="${x}" y="${y+r*0.2}" text-anchor="middle" font-size="${r*0.55}" fill="#fff" font-weight="800">${HKSYM[sp.kind]}︎</text></g>`;
    if(this.opts.stockBadge!==false){ s+=`<circle cx="${x+r*0.48}" cy="${y-r*0.45}" r="${r*0.26}" fill="var(--paper)" stroke="var(--ink)" stroke-width="${r*0.05}"/><text x="${x+r*0.48}" y="${y-r*0.36}" text-anchor="middle" font-size="${r*0.3}" font-weight="800" fill="var(--ink)">${left}</text>`; }
  });
  (st.marks||[]).forEach(m=>{ const [x,y]=this.cxy(m.c); s+=`<polygon points="${this.hexPts(m.c,0.98)}" fill="none" stroke="${m.color||'var(--gold)'}" stroke-width="${r*0.14}"/>`; });
  this.gS.innerHTML=s;
  // 計画の 道
  let p='';
  (st.plans||[]).forEach((pl,i)=>{
    if(!pl||!pl.cells||pl.cells.length<2&&!pl.waits) return;
    const pts=pl.cells.map(c=>this.cxy(c)), off=(i-1.5)*r*0.09, col=pl.color||HAGC[i%4];
    const good=pl.bad>=0? pts.slice(0,pl.bad+1) : pts, bad=pl.bad>=0? pts.slice(pl.bad) : [];
    const poly=a=>a.map(([x,y])=>(x+off).toFixed(1)+','+(y+off).toFixed(1)).join(' ');
    if(good.length>1) p+=`<polyline points="${poly(good)}" fill="none" stroke="${col}" stroke-width="${r*0.16}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${HDASH[i%4].split(' ').map(v=>v*r/14).join(' ')}" opacity="${pl.dim?0.35:0.95}"/>`;
    if(bad.length>1) p+=`<polyline points="${poly(bad)}" fill="none" stroke="#d00" stroke-width="${r*0.12}" stroke-dasharray="${r*0.2} ${r*0.15}"/>`;
    if(!pl.dim&&pts.length>1){ const [ex,ey]=pts[pts.length-1]; p+=`<circle cx="${ex+off}" cy="${ey+off}" r="${r*0.16}" fill="${col}" stroke="#fff" stroke-width="${r*0.05}"/>`; }
    (pl.gets||[]).forEach(c=>{ const [x,y]=this.cxy(c); p+=`<text x="${x-r*0.5}" y="${y-r*0.3}" font-size="${r*0.42}" font-weight="800" fill="${col}" stroke="#fff" stroke-width="${r*0.08}" paint-order="stroke">✓</text>`; });
  });
  this.gP.innerHTML=p;
  this.drawAgents();
};
// teams: [{agents:[{type,pos,fuel}], color, ghost, at:[[x,y]...] (アニメ中の 位置)}]
HBoard.prototype.drawAgents=function(){
  const r=this.r, st=this.state, groups={}; let a='';
  (st.teams||[]).forEach((tm,k)=>tm.agents.forEach((ag,i)=>{ const xy=tm.at? tm.at[i] : this.cxy(ag.pos); const key=Math.round(xy[0]/(r*0.6))+':'+Math.round(xy[1]/(r*0.6)); (groups[key]=groups[key]||[]).push({tm,k,ag,i,xy}); }));
  const order=[]; Object.values(groups).forEach(g=>g.forEach((o,j)=>{ const n=g.length, ang=Math.PI*2*j/n-Math.PI/2, rr=n>1? r*0.36 : 0; order.push({...o,x:o.xy[0]+rr*Math.cos(ang),y:o.xy[1]+rr*Math.sin(ang),small:n>1}); }));
  order.sort((p,q)=>(q.tm.ghost?1:0)-(p.tm.ghost?1:0));
  order.forEach(o=>{
    const sz=r*(o.small?0.42:0.56), col=o.tm.color, selk=!o.tm.ghost&&st.sel===o.i;
    a+=`<g transform="translate(${o.x.toFixed(1)},${o.y.toFixed(1)}) scale(${sz.toFixed(2)})" opacity="${o.tm.ghost?0.5:1}" ${o.tm.ghost?'':`data-ag="${o.i}"`} class="${o.tm.ghost?'':'hag'}">
      ${selk?`<circle r="0.95" fill="none" stroke="var(--gold)" stroke-width="0.22"/>`:''}
      <circle r="0.75" fill="#fff" stroke="${col}" stroke-width="0.16"/>
      <g fill="${col}" transform="scale(1.05)">${o.ag.type==='p'?`<path d="${H_CAR}"/><circle cx="-0.24" cy="0.11" r="0.1"/><circle cx="0.24" cy="0.11" r="0.1"/>`:`<path d="${H_DROP}"/>`}</g>
      ${o.tm.ghost?'':`<circle cx="0.62" cy="0.58" r="0.34" fill="${HAGC[o.i%4]}" stroke="#fff" stroke-width="0.08"/><text x="0.62" y="0.72" text-anchor="middle" font-size="0.42" font-weight="800" fill="#fff">${o.i+1}</text>`}
    </g>`;
  });
  this.gA.innerHTML=a;
};
HBoard.prototype.pop=function(c,kind,color){
  const [x,y]=this.cxy(c), r=this.r, KC=HKIND[SETTINGS.theme]||HKIND.normal, g=document.createElementNS('http://www.w3.org/2000/svg','g');
  g.setAttribute('class','hpop'); g.innerHTML=`<circle cx="${x}" cy="${y-r*0.9}" r="${r*0.42}" fill="${KC[kind]}" stroke="${color||'#fff'}" stroke-width="${r*0.1}"/><text x="${x}" y="${y-r*0.74}" text-anchor="middle" font-size="${r*0.45}" font-weight="800" fill="#fff">+1</text>`;
  this.gX.appendChild(g); setTimeout(()=>g.remove(),900);
};

/* ---- 1日の 動きを 再生する（ぜんチーム 同時に） ---- */
function hPosAt(board,start,moves,tau){
  const at=start.map(a=>board.cxy(a.pos));
  moves.forEach(m=>{ if(tau>=m.t1) at[m.a]=board.cxy(m.to); else if(tau>m.t0){ const f=(tau-m.t0)/(m.t1-m.t0), A=board.cxy(m.from), B=board.cxy(m.to); at[m.a]=[A[0]+(B[0]-A[0])*f, A[1]+(B[1]-A[1])*f]; } });
  return at;
}
// rec = {roads,start:[{agents}],res:[...],S}; look = (k)=>({color,ghost})
function HAnim(board,rec,look,opts){
  this.board=board; this.rec=rec; this.look=look; this.opts=opts||{}; this.tau=0; this.fired=0; this.stop=false;
  this.evs=[]; rec.res.forEach((r,k)=>r.events.forEach(e=>this.evs.push({...e,k}))); this.evs.sort((a,b)=>a.t-b.t||a.k-b.k);
  this.stock=rec.res.map(()=>this.board.P.spots.map(s=>s.max));
  this.S=rec.res[0].S;
}
HAnim.prototype.frame=function(){
  const b=this.board, rec=this.rec;
  while(this.fired<this.evs.length && this.evs[this.fired].t<=this.tau){ const e=this.evs[this.fired++]; this.stock[e.k][e.s]--; if(!this.look(e.k).ghost||this.opts.popAll) b.pop(e.c,e.kind,this.look(e.k).color); this.opts.onEvent&&this.opts.onEvent(e); }
  const teams=rec.start.map((s,k)=>({agents:s.agents,...this.look(k),at:hPosAt(b,s.agents,rec.res[k].moves,this.tau)}));
  b.state.teams=teams; b.state.stock=this.stock[this.opts.stockOf||0];
  if(this.fired!==this._lastF){ this._lastF=this.fired; b.render(); } else b.drawAgents();
  this.opts.onStep&&this.opts.onStep(this.tau);
};
HAnim.prototype.run=function(msPerStep,cb){
  this.board.busy=true; let last=performance.now();
  const go=now=>{ if(this.stop){ this.board.busy=false; return; }
    this.tau=Math.min(this.S,this.tau+(now-last)/msPerStep()); last=now; this.frame();
    if(this.tau>=this.S){ this.board.busy=false; cb&&cb(); return; }
    this.raf=requestAnimationFrame(go); };
  this.raf=requestAnimationFrame(go);
};
HAnim.prototype.skip=function(){ this.tau=this.S; };
HAnim.prototype.cancel=function(){ this.stop=true; cancelAnimationFrame(this.raf); this.board.busy=false; };

/* ============ 第37回：ルール説明 ============ */
let hrulesReady=false, hslide=0, HDEMO={};
const H_RULE_MAP=(()=>{ // 7×5 の 見本マップ
  const W=7,H=5,N=W*H, terr=[0,0,1,1,0,2,2, 3,3,3,3,3,3,3, 0,0,0,1,0,0,2, 0,2,0,3,0,0,0, 0,2,0,3,1,1,0];
  return {W,H,N,terr,spots:[{c:1,kind:0,max:2},{c:4,kind:1,max:1},{c:16,kind:2,max:1},{c:21,kind:0,max:1},{c:34,kind:1,max:2}],starts:[18,19],steps:[12],fuelMax:4,days:1,kinds:3,agents:2,S:7};
})();
function initHRules(){
  if(!hrulesReady){
    hrulesReady=true;
    const mw=Math.min(440,window.innerWidth-80);
    HDEMO.map=new HBoard($('hdemo0'),{P:H_RULE_MAP,maxW:mw,maxH:300,stockBadge:false});
    HDEMO.spot=new HBoard($('hdemo1'),{P:H_RULE_MAP,maxW:mw,maxH:300});
    HDEMO.spot.set({teams:[{agents:[{type:'p',pos:18}],color:HTEAMC[0]}]});
    // 燃料と 補給の デモ（7×1）
    const F={W:7,H:1,N:7,terr:[0,0,3,3,0,0,0],spots:[{c:6,kind:0,max:1}],starts:[1,0],steps:[30],fuelMax:4,days:1,kinds:1,agents:2,S:7};
    HDEMO.F=F; HDEMO.fuel=new HBoard($('hdemo2'),{P:F,maxW:mw,maxH:120});
    hFuelReset();
    $('hd2move').onclick=()=>hFuelMove('p'); $('hd2sup').onclick=()=>hFuelMove('s'); $('hd2reset').onclick=hFuelReset;
    HDEMO.road=new HBoard($('hdemo3'),{P:{W:3,H:1,N:3,terr:[3,3,3],spots:[],starts:[],steps:[1],fuelMax:1,S:3},maxW:Math.min(300,mw),maxH:110});
    HDEMO.road.set({roads:[0,1,2]});
    $('hdots').innerHTML='<i></i>'.repeat(6);
  }
  hRulesText(); goHSlide(hslide);
}
function hFuelReset(){ HDEMO.fs={p:1,s:0,fuel:2,steps:0}; hFuelDraw(); }
function hFuelDraw(msg){
  const f=HDEMO.fs; HDEMO.fuel.set({teams:[{agents:[{type:'p',pos:f.p},{type:'s',pos:f.s}],color:HTEAMC[0]}],stock:[f.got?0:1]});
  $('hd2info').innerHTML=t('h_d2_info',{f:f.fuel,m:HDEMO.F.fuelMax,s:f.steps})+(msg?`<br><b>${msg}</b>`:'');
}
function hFuelMove(who){
  const f=HDEMO.fs, F=HDEMO.F;
  if(who==='p'){
    if(f.p>=6) return hFuelDraw(t('h_d2_end'));
    const need=H_FUEL[F.terr[f.p]], tt=hTime(F.terr[f.p],0);
    if(f.fuel<need) return hFuelDraw(t('h_d2_nofuel'));
    f.fuel-=need; f.steps+=tt; f.p++; if(f.p===6){ f.got=true; HDEMO.fuel.pop(6,0,HTEAMC[0]); }
    hFuelDraw(t('h_d2_moved',{t:tt,n:need}));
  } else {
    if(f.s<f.p){ f.s=f.p; f.steps+=1; f.fuel=F.fuelMax; hFuelDraw(t('h_d2_refuel')); } else hFuelDraw(t('h_d2_same'));
  }
}
function hRulesText(){
  $('hTerrTbl').innerHTML=`<tr><th></th><th>${t('h_th_time')}</th><th>${t('h_th_fuel')}</th></tr>`+
    [[0,'2','1'],[1,'3','2'],[2,t('h_noentry'),'—'],[3,'1 / 2 / 4','2']].map(([k,a,b])=>`<tr><td><i class="hsw" style="background:${(HTERR[SETTINGS.theme]||HTERR.normal)[k]}"></i>${t('h_terr'+k)}</td><td>${a}</td><td>${b}</td></tr>`).join('');
  $('hKindLegend').innerHTML=[0,1,2].map(k=>`<span>${hKindChip(k)} ${hKindName(k)}</span>`).join('');
  $('hRoadLegend').innerHTML=[0,1,2].map(k=>`<span><b>${t('h_rs'+k)}</b> ${t('h_rs_t',{n:H_ROADT[k]})}</span>`).join('');
  $('hrulesJson').textContent=`${t('h_json_q')}
{"daySteps":[20,22,18],
 "map":{"height":8,"width":8,
  "cells":[[0,0,1,2,2,0,3,3],
           [1,1,1,1,1,1,1,1], ...]},
 "spots":[{"brand":0,"pos":1,"stocks":2}, ...],
 "agents":[27,28,35,36],
 "fuelLimits":20,"players":4,
 "busyThreshold":3,"jammedThreshold":6}

${t('h_json_a')}
[[2,2,1,-1,3,-12],
 [5,4,4,-2,0,-9],
 [-20],
 [2,3,-15]]`;
}
function goHSlide(i){
  hslide=Math.max(0,Math.min(5,i));
  document.querySelectorAll('#s-hrules .slide').forEach(s=>s.classList.toggle('on',+s.dataset.i===hslide));
  document.querySelectorAll('#hdots i').forEach((d,k)=>d.classList.toggle('on',k===hslide));
  $('hprev').disabled=hslide===0; $('hnext').style.visibility=hslide===5?'hidden':'visible';
}
$('hprev').onclick=()=>goHSlide(hslide-1); $('hnext').onclick=()=>goHSlide(hslide+1);

/* ============ 第37回：ゲーム ============ */
let HG=null;
function hMaxWH(){ const wide=window.innerWidth>900; return wide? {w:Math.min(window.innerWidth,1400)-40-420-20-12, h:window.innerHeight-120} : {w:window.innerWidth-40, h:window.innerHeight*0.44}; }
function startHexa(){
  stopPlayers(); if(HG&&HG.anim) HG.anim.cancel();
  const S=+segVal('segSize'), lv=segVal('segProb'), limit=+segVal('segTime');
  const P=hMakeProblem(S,lv);
  const nOpp= mode==='robot'? +segVal('segOpp') : 0, lvl=+segVal('segBot');
  HG={P,limit,mode,nT:1+nOpp,lvl,day:0,phase:'types',types:hRobotTypes(P,2),teams:[],stays:[],days:[],plans:[],segs:[],sel:0,ended:false,times:[],hintKey:'h_hint_types'};
  setupTitles(); show('hgame');
  const m=hMaxWH(); HG.board=new HBoard($('hBoard'),{P,maxW:m.w,maxH:m.h,interactive:true,onCell:hTapCell,onAgent:hTapAgent});
  HG.board.set({teams:[{agents:HG.types.map((ty,i)=>({type:ty,pos:P.starts[i]})),color:HTEAMC[0]}]});
  $('hProbNo').textContent=t('h_prob_no',{n:P.seed});
  hRender();
  clearInterval(HG.tick); HG.tick=setInterval(hTick,250); hTick();
}
const hLook=k=>({color:HTEAMC[k%4],ghost:k>0});
function hConfirmTypes(){
  const P=HG.P; HG.teams=[hInitTeam(P,HG.types)];
  for(let k=1;k<HG.nT;k++) HG.teams.push(hInitTeam(P,hRobotTypes(P,HG.lvl)));
  hBeginDay(0);
}
function hBeginDay(d){
  const P=HG.P; HG.day=d; HG.phase='plan';
  HG.roads=hRoadStates(P,HG.stays,HG.nT);
  HG.teams=HG.teams.map(s=>hNewDayStock(P,s));
  HG.start=HG.teams.map(s=>JSON.parse(JSON.stringify({agents:s.agents})));
  HG.robotRes=HG.teams.map((s,k)=>k? hRobotDay(P,d,HG.roads,s,HG.lvl,k) : null);
  HG.plans=HG.teams[0].agents.map(()=>[]); HG.segs=HG.plans.map(()=>[]);
  HG.sel=HG.teams[0].agents.findIndex(a=>a.type==='p'); if(HG.sel<0) HG.sel=0;
  HG.planStart=Date.now(); HG.hintKey=d===0?'h_hint_plan':'h_hint_next';
  hPreview(); hRender();
}
function hPreview(){ const P=HG.P; HG.prev=hRunPlan(P,HG.day,HG.roads,HG.teams[0],HG.plans); return HG.prev; }
function hEndCell(i){ const P=HG.P; let c=HG.teams[0].agents[i].pos; HG.plans[i].forEach(a=>{ if(a!=='w'){ const n=hNb(P.W,P.H,c,a); if(n>=0) c=n; } }); return c; }
function hPlanCells(i){ const P=HG.P; let c=HG.teams[0].agents[i].pos; const out=[c]; HG.plans[i].forEach(a=>{ if(a!=='w'){ c=hNb(P.W,P.H,c,a); out.push(c); } }); return out; }
function hTapAgent(i){ if(!HG||HG.phase!=='plan') { if(HG&&HG.phase==='types') hToggleType(i); return; } HG.sel=i; hRender(); }
function hTapCell(c){
  if(!HG||HG.phase!=='plan'||HG.ended) return;
  const P=HG.P, i=HG.sel; if(i<0) return;
  if(P.terr[c]===2){ toast(t('h_toast_pond')); return; }
  const from=hEndCell(i);
  if(c===from){ hWait(); return; }
  const D=hDijkstra(P,HG.roads,from), path=hPath(D,c); if(!path.length){ toast(t('h_toast_pond')); return; }
  const old=HG.plans[i].length; let cur=from;
  path.forEach(n=>{ HG.plans[i].push(hDirTo(P.W,P.H,cur,n)); cur=n; });
  const pr=hPreview(), bad=pr.invalid[i];
  if(bad>=0&&bad>=old){ HG.plans[i].length=bad; hPreview(); toast(t(pr.why[i]==='fuel'?'h_toast_fuel':'h_toast_steps')); }
  if(HG.plans[i].length>old) HG.segs[i].push(HG.plans[i].length-old);
  HG.hintKey= HG.prev.events.length? 'h_hint_got' : 'h_hint_plan';
  hRender();
}
function hMeet(){
  if(!HG||HG.phase!=='plan') return; const P=HG.P, i=HG.sel, A=HG.teams[0].agents, me=A[i];
  const others=A.map((a,j)=>j).filter(j=>j!==i&&A[j].type!==me.type);
  if(!others.length){ toast(t(me.type==='p'?'h_toast_nosup':'h_toast_nopat')); return; }
  let pi,si;
  if(me.type==='p'){ pi=i; const D=hDijkstra(P,HG.roads,hEndCell(i)); si=others.reduce((m,j)=>D.dist[hEndCell(j)]<D.dist[hEndCell(m)]?j:m); }
  else { si=i; pi=others.reduce((m,j)=>HG.prev.st.agents[j].fuel<HG.prev.st.agents[m].fuel?j:m); }
  const c=hEndCell(pi), sFrom=hEndCell(si);
  // 補給車を 巡回車の ところへ
  if(sFrom!==c){
    const path=hPath(hDijkstra(P,HG.roads,sFrom),c), old=HG.plans[si].length; let cur=sFrom;
    path.forEach(n=>{ HG.plans[si].push(hDirTo(P.W,P.H,cur,n)); cur=n; });
    const pr=hPreview(); if(pr.invalid[si]>=0&&pr.invalid[si]>=old){ HG.plans[si].length=old; hPreview(); toast(t('h_toast_steps')); hRender(); return; }
    HG.segs[si].push(HG.plans[si].length-old);
  }
  // 巡回車は 補給車が 来るまで まつ（+1ステップで 満タン）
  let pr=hPreview(); const w=Math.max(0,pr.endT[si]-pr.endT[pi]), old=HG.plans[pi].length;
  for(let k=0;k<w;k++) HG.plans[pi].push('w');
  pr=hPreview(); if(pr.invalid[pi]>=0&&pr.invalid[pi]>=old){ HG.plans[pi].length=pr.invalid[pi]; hPreview(); toast(t('h_toast_steps')); }
  if(HG.plans[pi].length>old) HG.segs[pi].push(HG.plans[pi].length-old);
  HG.sel=pi; HG.hintKey='h_hint_meet'; hRender();
}
function hWait(){ if(!HG||HG.phase!=='plan') return; const i=HG.sel; HG.plans[i].push('w'); const pr=hPreview(); if(pr.invalid[i]>=0&&pr.invalid[i]>=HG.plans[i].length-1){ HG.plans[i].pop(); hPreview(); toast(t('h_toast_steps')); } else HG.segs[i].push(1); hRender(); }
function hUndo(){ if(!HG||HG.phase!=='plan') return; const i=HG.sel, n=HG.segs[i].pop(); if(n){ HG.plans[i].length-=n; hPreview(); hRender(); } }
function hClear(){ if(!HG||HG.phase!=='plan') return; const i=HG.sel; HG.plans[i]=[]; HG.segs[i]=[]; hPreview(); hRender(); }
function hAuto(){ if(!HG||HG.phase!=='plan') return; const r=hRobotDay(HG.P,HG.day,HG.roads,HG.teams[0],3); HG.plans=r.acts.map(a=>{ const c=a.slice(); while(c.length&&c[c.length-1]==='w') c.pop(); return c; }); HG.segs=HG.plans.map(p=>p.length?[p.length]:[]); hPreview(); HG.hintKey='h_hint_auto'; hRender(); }
function hToggleType(i){ if(HG.phase!=='types') return; HG.types[i]=HG.types[i]==='p'?'s':'p'; if(!HG.types.includes('p')) HG.types[i]='p'; HG.board.set({teams:[{agents:HG.types.map((ty,j)=>({type:ty,pos:HG.P.starts[j]})),color:HTEAMC[0]}]}); hRender(); }
const hElapsed=()=>Math.floor((Date.now()-HG.planStart)/1000);
function hTick(){
  if(!HG||HG.ended) return;
  if(HG.phase!=='plan'){ return; }
  const e=hElapsed();
  if(HG.limit){ const r=Math.max(0,HG.limit-e); $('hTimeL').innerHTML=t('st_left'); $('hTime').textContent=fmt(r); $('hTime').style.color=r<=15?'var(--shu)':''; if(r<=0){ toast(t('h_toast_timeup')); hStartDay(); } }
  else { $('hTimeL').innerHTML=t('st_elapsed'); $('hTime').textContent=fmt(e); $('hTime').style.color=''; }
}
function hStartDay(){
  if(!HG||HG.phase!=='plan') return;
  const P=HG.P, d=HG.day;
  // 無効な ところから あとは 消す
  const pr=hPreview(); pr.invalid.forEach((b,i)=>{ if(b>=0) HG.plans[i].length=b; });
  const time=Math.min(HG.limit||9999,hElapsed()); HG.times.push(time);
  const res=[hRunPlan(P,d,HG.roads,HG.teams[0],HG.plans),...HG.robotRes.slice(1)];
  const rec={roads:HG.roads,start:HG.start,res,time:[time,...res.slice(1).map(()=>30)],plans:HG.plans.map(p=>p.slice())};
  HG.days.push(rec); HG.phase='run'; HG.hintKey='h_hint_run'; HG.runGot=0; HG.runKinds=new Set();
  HG.board.set({plans:[],marks:[]}); hRender();
  HG.anim=new HAnim(HG.board,rec,hLook,{onEvent:e=>{ if(e.k===0){ HG.runGot++; HG.runKinds.add(e.kind); hStats(); } }});
  HG.anim.run(()=>HG.fast?25:180,()=>hEndDay(rec));
}
function hEndDay(rec){
  const P=HG.P; HG.fast=false;
  rec.res.forEach((r,k)=>HG.teams[k]=r.st);
  const sum=new Array(P.N).fill(0); rec.res.forEach(r=>r.stays.forEach((v,i)=>sum[i]+=v)); HG.stays.push(sum);
  const r0=rec.res[0]; HG.lastMsg=[['h_day_sum',{d:HG.day+1,k:r0.todayKinds,u:r0.udon}]];
  if(HG.day+1<P.days){
    const nr=hRoadStates(P,HG.stays,HG.nT), c1=nr.filter(v=>v===1).length, c2=nr.filter(v=>v===2).length;
    HG.lastMsg.push((c1||c2)? ['h_day_jam',{a:c1,b:c2}] : ['h_day_nojam',{}]);
    toast(t('h_toast_day',{d:HG.day+1,k:r0.todayKinds,u:r0.udon}));
    hBeginDay(HG.day+1);
  } else { HG.phase='end'; hRender(); setTimeout(()=>hFinish(false),600); }
}
// 表示の 更新
function hStats(){
  if(!HG) return; const P=HG.P, sc=HG.days.length? hScore(HG.days,0) : {kinds:0,udon:0};
  let kinds=sc.kinds, udon=sc.udon;
  if(HG.phase==='run'){ const ks=new Set(); HG.days.slice(0,-1).forEach(d=>d.res[0].events.forEach(e=>ks.add(e.kind))); HG.runKinds.forEach(k=>ks.add(k)); kinds=ks.size; udon=hScore(HG.days.slice(0,-1),0).udon+HG.runGot; }
  $('hDay').textContent=t('h_day_of',{d:Math.min(HG.day+1,P.days),n:P.days}); $('hKinds').textContent=`${kinds} / ${P.kinds}`; $('hUdon').textContent=udon;
  const got=new Set(); HG.days.forEach((d,j)=>{ if(HG.phase==='run'&&j===HG.days.length-1) return; d.res[0].events.forEach(e=>got.add(e.kind)); }); if(HG.phase==='run') HG.runKinds.forEach(k=>got.add(k));
  const plan=new Set(HG.phase==='plan'&&HG.prev? HG.prev.events.map(e=>e.kind) : []), today=HG.phase==='run'? HG.runKinds : plan;
  $('hKindRow').innerHTML=Array.from({length:P.kinds},(_,k)=>`<span class="hk${got.has(k)?' got':''}${today.has(k)?' today':''}">${hKindChip(k)}<small>${hKindName(k)}</small></span>`).join('');
}
function hRender(){
  if(!HG) return; const P=HG.P, ph=HG.phase;
  hStats();
  $('hHint').innerHTML=(HG.lastMsg&&ph==='plan'?`<b>${HG.lastMsg.map(([k,p])=>t(k,p)).join('')}</b><br>`:'')+t(HG.hintKey);
  $('hTypesBox').style.display=ph==='types'?'':'none'; $('hPlanBox').style.display=ph==='plan'?'':'none'; $('hRunBox').style.display=ph==='run'?'':'none';
  $('hAuto').style.display=HG.mode==='robot'?'none':'';
  if(ph==='types'){
    $('hTypeCards').innerHTML=HG.types.map((ty,i)=>`<button class="hcard" data-i="${i}">${hAgentIcon(ty,HTEAMC[0],30)}<b>${i+1}</b><span>${t(ty==='p'?'h_patrol':'h_supply')}</span><em>${t('h_tap_change')}</em></button>`).join('');
    $('hTypeCards').querySelectorAll('.hcard').forEach(b=>b.onclick=()=>hToggleType(+b.dataset.i));
    $('hTypeNote').innerHTML=t('h_types_note',{p:HG.types.filter(x=>x==='p').length,s:HG.types.filter(x=>x==='s').length});
    return;
  }
  const S=P.steps[HG.day]||P.steps[0];
  if(ph==='plan'){
    const pr=HG.prev;
    $('hAgents').innerHTML=HG.teams[0].agents.map((a,i)=>{
      const used=pr.endT[i], fuel=pr.st.agents[i].fuel, bad=pr.invalid[i]>=0;
      return `<button class="hcard ag${i===HG.sel?' on':''}${bad?' bad':''}" data-i="${i}" style="--agc:${HAGC[i%4]}">
        <span class="hagn">${i+1}</span>${hAgentIcon(a.type,HTEAMC[0],26)}<span class="hty">${t(a.type==='p'?'h_patrol':'h_supply')}</span>
        <span class="hbars"><small>${t('h_steps')}</small><span class="trk"><i style="width:${Math.min(100,used/S*100)}%"></i></span><b>${used}/${S}</b>
        <small>${t('h_fuel')}</small>${a.type==='p'?`<span class="trk fuel"><i style="width:${fuel/P.fuelMax*100}%"></i></span><b>${fuel}/${P.fuelMax}</b>`:`<b class="inf">${t('h_fuel_inf')}</b>`}</span>
      </button>`; }).join('');
    $('hAgents').querySelectorAll('.hcard').forEach(b=>b.onclick=()=>{ HG.sel=+b.dataset.i; hRender(); });
    $('hPlanSum').innerHTML=t('h_plan_sum',{k:new Set(pr.events.map(e=>e.kind)).size,u:pr.events.length});
    const gets=HG.plans.map(()=>[]); pr.events.forEach(e=>gets[e.a].push(e.c));
    const plans=HG.plans.map((pl,i)=>({cells:hPlanCells(i),waits:pl.includes('w'),bad:pr.invalid[i]>=0? HG.plans[i].slice(0,pr.invalid[i]).filter(a=>a!=='w').length : -1,gets:gets[i],dim:i!==HG.sel&&false}));
    const teams=HG.start.map((s,k)=>({agents:s.agents,...hLook(k)}));
    HG.board.set({roads:HG.roads,stock:HG.teams[0].stock,teams,plans,sel:HG.sel,marks:[]});
    $('hStart').textContent=t('h_start_day',{d:HG.day+1});
  }
  if(ph==='run'){ $('hFast').disabled=!!HG.fast; }
  hLegend();
  hScoreboard();
}
function hLegend(){
  const TC=HTERR[SETTINGS.theme]||HTERR.normal, RC=HROADC[SETTINGS.theme]||HROADC.normal;
  $('hLegend').innerHTML=[0,1,3].map(k=>`<span><i class="hsw" style="background:${TC[k]}"></i>${t('h_terr'+k)} ${t('h_leg_tf',{t:k===3?'1·2·4':H_TIME[k],f:H_FUEL[k]})}</span>`).join('')+
    `<span><i class="hsw" style="background:${TC[2]}"></i>${t('h_terr2')} ${t('h_noentry')}</span>`+
    [1,2].map(k=>`<span><i class="hsw" style="background:${RC[k]}"></i>${t('h_rs'+k)} ${k===1?'!':'!!'}</span>`).join('');
}
function hScoreboard(){
  if(!HG||HG.mode!=='robot'||!HG.days.length){ $('hTeams').innerHTML=''; return; }
  const done=HG.phase==='run'? HG.days.slice(0,-1) : HG.days; if(!done.length){ $('hTeams').innerHTML=''; return; }
  $('hTeams').innerHTML=`<table class="htbl"><tr><th></th><th>${t('h_c_kinds')}</th><th>${t('h_c_daily')}</th><th>${t('h_c_udon')}</th></tr>`+
    Array.from({length:HG.nT},(_,k)=>{ const s=hScore(done,k); return `<tr><td><i class="hteam" style="background:${HTEAMC[k]}"></i>${k?t('h_robot_n',{n:k}):t('you')}</td><td>${s.kinds}</td><td>${s.daily}</td><td>${s.udon}</td></tr>`; }).join('')+'</table>';
}
$('hTypesOk').onclick=hConfirmTypes;
$('hWaitBtn').onclick=hWait; $('hMeetBtn').onclick=hMeet; $('hUndoBtn').onclick=hUndo; $('hClearBtn').onclick=hClear; $('hAuto').onclick=hAuto;
$('hStart').onclick=hStartDay; $('hFast').onclick=()=>{ if(HG){ HG.fast=true; hRender(); } };
$('hQuit').onclick=()=>{
  if(!HG) return show('home');
  if(HG.phase==='types'||(HG.day===0&&HG.phase==='plan'&&!HG.plans.some(p=>p.length))){ clearInterval(HG.tick); HG.ended=true; show('home'); return; }
  if(HG.phase==='run'){ HG.anim.cancel(); hEndDaySilent(HG.days[HG.days.length-1]); }
  // 残りの 日は 自分の 車は 動かない ことに して、ロボットだけ 進める
  while(HG.phase==='plan'&&HG.day<HG.P.days){ HG.plans=HG.plans.map(()=>[]); hStartDayInstant(); }
  hFinish(false);
};
function hEndDaySilent(rec){ const P=HG.P; rec.res.forEach((r,k)=>HG.teams[k]=r.st); const sum=new Array(P.N).fill(0); rec.res.forEach(r=>r.stays.forEach((v,i)=>sum[i]+=v)); HG.stays.push(sum); if(HG.day+1<P.days) hBeginDay(HG.day+1); else HG.phase='end'; }
function hStartDayInstant(){ const P=HG.P, d=HG.day; HG.times.push(0); const res=[hRunPlan(P,d,HG.roads,HG.teams[0],HG.plans),...HG.robotRes.slice(1)]; const rec={roads:HG.roads,start:HG.start,res,time:[0,...res.slice(1).map(()=>30)],plans:HG.plans.map(p=>p.slice())}; HG.days.push(rec); hEndDaySilent(rec); }

/* ---- 結果 ---- */
function hActJSON(days){ return days.map((d,j)=>`// ${t('h_day_n',{d:j+1})}\n[\n`+d.res[0].out.map(a=>'  '+JSON.stringify(a)).join(',\n')+'\n]').join('\n\n'); }
function hFinish(){
  if(!HG||HG.ended) return; HG.ended=true; clearInterval(HG.tick);
  const P=HG.P, me=hScore(HG.days,0), all=Array.from({length:HG.nT},(_,k)=>({k,s:hScore(HG.days,k)}));
  const line=s=>`${t('h_c_kinds')} <b>${s.kinds}</b> / ${P.kinds}<br>${t('h_c_daily')} <b>${s.daily}</b><br>${t('h_c_udon')} <b>${s.udon}</b><br>${t('h_c_time')} ${fmt(s.time)}`;
  let html='';
  if(HG.mode==='robot'){
    const rank=all.slice().sort((a,b)=>hCompare(a.s,b.s)[0]||a.k-b.k), pos=rank.findIndex(o=>o.k===0);
    const other= pos===0? rank[1] : rank[0], [cmp,why]=hCompare(me,other.s), win=cmp<0? true : cmp>0? false : null;
    html=`<div class="big">${win===null?'🤝':pos===0?'🏆':pos===1?'🥈':pos===2?'🥉':'🍜'}</div><h3>${t(win===null?'r_draw':win?'r_win':'h_rank',{n:pos+1})}</h3>
      <table class="htbl big"><tr><th>${t('h_c_rank')}</th><th></th><th>${t('h_c_kinds')}</th><th>${t('h_c_daily')}</th><th>${t('h_c_udon')}</th><th>${t('h_c_time')}</th></tr>`+
      rank.map((o,j)=>`<tr class="${o.k===0?'me':''}"><td>${j+1}</td><td><i class="hteam" style="background:${HTEAMC[o.k]}"></i>${o.k?t('h_robot_n',{n:o.k}):t('you')}</td><td>${o.s.kinds}</td><td>${o.s.daily}</td><td>${o.s.udon}</td><td>${fmt(o.s.time)}</td></tr>`).join('')+`</table>
      <p class="why">${why===5?t('why4'):t('h_why'+why,{who:other.k?t('h_robot_n',{n:other.k}):t('you')})}</p>`;
  } else {
    const ok=me.kinds===P.kinds;
    html=`<div class="big">${ok?'🎉':'🌱'}</div><h3>${t(ok?'h_perfect':'good')}</h3>
      <div class="vs" style="grid-template-columns:1fr"><div class="side"><div style="font-size:17px;line-height:1.9">${line(me)}</div></div></div>
      <p class="why">${t(ok?'h_msg_perfect':'h_msg_tip')}</p>`;
  }
  html+=`<table class="htbl"><tr><th>${t('h_c_day')}</th><th>${t('h_c_kinds')}</th><th>${t('h_c_udon')}</th></tr>`+HG.days.map((d,j)=>`<tr><td>${t('h_day_n',{d:j+1})}</td><td>${d.res[0].todayKinds}</td><td>${d.res[0].udon}</td></tr>`).join('')+'</table>';
  html+=`<div id="hReplayArea"></div>`;
  if(HG.mode!=='robot') html+=`<button class="btn sub modelbtn" id="hShowModel">${t('h_show_model')}</button><div id="hModelArea"></div>`;
  html+=`<details><summary>${t('h_json_mine')}</summary><p class="why" style="font-size:13px">${t('h_json_note')}</p><pre class="json" style="margin-top:8px">${hActJSON(HG.days)}</pre></details>
    <div class="mbtns"><button class="btn main" id="againBtn">${t('again')}</button><button class="btn sub" id="homeBtn">${t('home')}</button></div>`;
  $('modalBox').innerHTML=html; $('modal').classList.add('on'); $('modalBox').scrollTop=0;
  stopPlayers();
  new HPlayer($('hReplayArea'),{P,days:HG.days,nT:HG.nT,titleKey:HG.mode==='robot'?'h_replay_all':'h_replay_me',desc:()=>t(HG.mode==='robot'?'h_replay_all_d':'h_replay_me_d')});
  if($('hShowModel')) $('hShowModel').onclick=()=>{ $('hShowModel').remove(); const M=hRobotMatch(P,[3]), s=hScore(M.days,0);
    new HPlayer($('hModelArea'),{P,days:M.days.map(d=>({...d,plans:d.res.map(r=>r.acts)})),nT:1,titleKey:'h_model_title',desc:()=>t('h_model_d',{k:s.kinds,d:s.daily,u:s.udon,me:me.daily,mu:me.udon}),auto:true}); };
  $('againBtn').onclick=()=>{ stopPlayers(); $('modal').classList.remove('on'); startHexa(); };
  $('homeBtn').onclick=()=>{ stopPlayers(); $('modal').classList.remove('on'); show('home'); };
}

/* ---- 試合の 再生（日ごと） ---- */
function HPlayer(host,{P,days,nT,titleKey,desc,auto}){
  this.P=P; this.days=days; this.nT=nT; this.titleKey=titleKey; this.desc=desc; this.d=0; this.playing=false; this.speed='mid'; this.el=host;
  host.innerHTML=`<div class="model"><h4 class="pt"></h4><p class="pd"></p><div class="hpb"></div><div class="prog"></div>
    <div class="play"><button class="btn sub" data-a="first">⏮</button><button class="btn sub" data-a="prev">◀</button><button class="btn main" data-a="play"></button><button class="btn sub" data-a="next">▶</button></div>
    <div class="play"><div class="seg"><button data-v="slow"></button><button data-v="mid" class="on"></button><button data-v="fast"></button></div></div></div>`;
  this.progEl=host.querySelector('.prog'); this.playBtn=host.querySelector('[data-a=play]');
  this.board=new HBoard(host.querySelector('.hpb'),{P,maxW:Math.min(520,window.innerWidth-120),maxH:420});
  const A=a=>host.querySelector(`[data-a=${a}]`);
  A('first').onclick=()=>{ this.stop(); this.load(0); };
  A('prev').onclick=()=>{ this.stop(); this.load(Math.max(0,this.d-1)); };
  A('next').onclick=()=>{ this.stop(); if(this.d<days.length-1) this.load(this.d+1); else this.load(days.length-1,true); };
  this.playBtn.onclick=()=>{ if(this.playing) this.stop(); else { if(this.done) this.load(0); this.playing=true; this.btn(); this.play(); } };
  host.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{ host.querySelectorAll('.seg button').forEach(x=>x.classList.toggle('on',x===b)); this.speed=b.dataset.v; });
  PLAYERS.push(this); this.load(0); this.relabel();
  if(auto) setTimeout(()=>{ if(!this.playing) this.playBtn.onclick(); },700);
}
HPlayer.prototype.load=function(d,end){
  if(this.anim) this.anim.cancel(); this.d=d; this.done=false;
  const rec=this.days[d]; this.board.state.roads=rec.roads;
  this.anim=new HAnim(this.board,rec,k=>({color:HTEAMC[k%4],ghost:k>0}),{onEvent:()=>this.prog()});
  if(end){ this.anim.tau=rec.res[0].S; this.done=d===this.days.length-1; }
  this.anim.frame(); this.board.render(); this.prog();
};
HPlayer.prototype.play=function(){
  if(!this.playing) return;
  const ms={slow:420,mid:160,fast:40}[this.speed];
  this.anim.stop=false;
  this.anim.run(()=>({slow:420,mid:160,fast:40}[this.speed]),()=>{ if(!this.playing) return;
    if(this.d<this.days.length-1){ this.timer=setTimeout(()=>{ if(this.playing){ this.load(this.d+1); this.play(); } },700); }
    else { this.done=true; this.stop(); } });
};
HPlayer.prototype.prog=function(){ if(!this.anim) return; const rec=this.days[this.d], s=hScore(this.days.slice(0,this.d),0), got=this.anim.evs.slice(0,this.anim.fired).filter(e=>e.k===0);
  this.progEl.innerHTML=t('h_p_prog',{d:this.d+1,n:this.days.length,t:Math.floor(this.anim.tau),s:rec.res[0].S,u:s.udon+got.length}); };
HPlayer.prototype.relabel=function(){ const h=this.el; h.querySelector('.pt').innerHTML=t(this.titleKey); h.querySelector('.pd').innerHTML=this.desc();
  h.querySelector('.seg [data-v=slow]').textContent=t('p_slow'); h.querySelector('.seg [data-v=mid]').textContent=t('p_mid'); h.querySelector('.seg [data-v=fast]').textContent=t('p_fast'); this.btn(); this.prog(); };
HPlayer.prototype.btn=function(){ this.playBtn.textContent=t(this.playing?'p_pause':'p_play'); };
HPlayer.prototype.stop=function(){ clearTimeout(this.timer); this.playing=false; if(this.anim){ this.anim.stop=true; cancelAnimationFrame(this.anim.raf); this.board.busy=false; } this.btn(); };
function hRelabel(){
  if($('s-hrules').classList.contains('on')||hrulesReady) hRulesText();
  if(HG&&!HG.ended&&$('s-hgame').classList.contains('on')){ $('hProbNo').textContent=t('h_prob_no',{n:HG.P.seed}); hRender(); }
}
