
/* ============ プログラムでとく（ブロック型プログラミング） ============ */
// ブロックの種類：label はことばのキー、fields は {名前:種類}
const EN_BLOCKS={
  rotate:{kind:'act',  label:'b_rotate', fields:{x:'pos',y:'pos',n:'size'}},
  try:   {kind:'act',  label:'b_try',    fields:{x:'pos',y:'pos',n:'size'}},
  best:  {kind:'act',  label:'b_best',   fields:{}},
  repeat:{kind:'ctrl', label:'b_repeat', fields:{n:'count'}, body:true},
  until: {kind:'ctrl', label:'b_until',  fields:{}, body:true},
  forxy: {kind:'ctrl', label:'b_forxy',  fields:{n:'size'}, body:true},
  if:    {kind:'cond', label:'b_if',     fields:{c:'cond'}, body:true},
  stop:  {kind:'cond', label:'b_stop',   fields:{}}
};
const EN_DEFAULTS={rotate:{x:'0',y:'0',n:'2'},try:{x:'x',y:'y',n:'2'},repeat:{n:'3'},forxy:{n:'2'},if:{c:'notpaired'}};
const EN_FIELD_OPTS={
  pos:()=>['x','y',...Array.from({length:12},(_,i)=>String(i))],
  size:()=>Array.from({length:11},(_,i)=>String(i+2)),
  count:()=>['1','2','3','4','5','10','20','50'],
  cond:()=>['all','improved','notpaired']
};
let BLOCKS=EN_BLOCKS, DEFAULTS=EN_DEFAULTS, FIELD_OPTS=EN_FIELD_OPTS, SAMPLES;
let nextBid=1;
function mkBlock(type,params){ return {id:'b'+(nextBid++),type,p:{...(DEFAULTS[type]||{}),...(params||{})},body:BLOCKS[type].body?[]:undefined}; }
const EN_SAMPLES={
  smp1:()=>{ const u=mkBlock('until'); u.body.push(mkBlock('best')); return [u]; },
  smp2:()=>{ const r=mkBlock('repeat',{n:'5'}), f=mkBlock('forxy',{n:'2'}), i=mkBlock('if',{c:'notpaired'}); i.body.push(mkBlock('try',{x:'x',y:'y',n:'2'})); f.body.push(i); r.body.push(f); return [r]; },
  smp3:()=>[mkBlock('rotate',{x:'0',y:'0',n:'2'}),mkBlock('rotate',{x:'2',y:'2',n:'2'})]
};

SAMPLES=EN_SAMPLES;
const CODE={game:'en',prog:[],cursor:null,S:6,field0:null,runner:null,result:null,loaded:{},progs:{},probs:{}};
function saveProg(){ try{ localStorage.setItem('enmusubi-program'+(CODE.game==='en'?'':'-'+CODE.game),JSON.stringify(CODE.prog)); }catch(e){} }
function loadProg(){
  try{ const p=JSON.parse(localStorage.getItem('enmusubi-program'+(CODE.game==='en'?'':'-'+CODE.game))||'null'); if(Array.isArray(p)){ const fix=l=>l.forEach(b=>{ b.id='b'+(nextBid++); if(b.body) fix(b.body); }); fix(p); return p; } }catch(e){}
  return SAMPLES.smp1();
}
function validProg(p){ const ok=l=>l.every(b=>BLOCKS[b.type]&&(!b.body||ok(b.body))); return ok(p); }

/* ---- ブロックの文字（えらぶ欄つき） ---- */
function optLabel(kind,v){
  if(kind==='pos' && CODE.game==='kata') return v;
  if(kind==='cond') return t(({kata:'kc_',hexa:'hc_'}[CODE.game]||'c_')+v);
  if(kind==='hdir') return t('h_d'+v);
  if(kind==='carno') return v;
  if(kind==='dir') return t('k_d'+v);
  if(kind==='die'){ const d=CODE.prob&&CODE.prob.dies? dieByP(CODE.prob.dies,+v):null; return d? dieName(d) : v; }
  return v;
}
function blockLabelHTML(b,editable){
  const def=BLOCKS[b.type];
  return t(def.label).replace(/\{(\w)\}/g,(m,k)=>{
    const kind=def.fields[k]; if(!kind) return m;
    const val=b? b.p[k] : (DEFAULTS[b.type]||{})[k];
    if(kind==='die'){ const d=codeDie(val); const pic=d? dieThumb(d,editable?24:18) : '';
      return editable? `<button type="button" class="diepick" data-f="${k}" aria-label="${t('k_pick_die')}">${pic}<b>${val}</b><em>▾</em></button>` : `<i class="chip chipdie">${pic}${val}</i>`; }
    if(!editable) return `<i class="chip">${optLabel(kind,val)}</i>`;
    return `<select data-f="${k}">${FIELD_OPTS[kind]().map(o=>`<option value="${o}" ${o===val?'selected':''}>${optLabel(kind,o)}</option>`).join('')}</select>`;
  });
}

/* ---- 抜き型を 絵で えらぶ ---- */
function codeDies(){ return CODE.prob&&CODE.prob.dies? CODE.prob.dies : kDiesFor(K_SAMPLE.general); }
function codeDie(v){ return dieByP(codeDies(),+v); }
function closeDiePop(){ const p=document.getElementById('diePop'); if(p) p.remove(); document.removeEventListener('pointerdown',diePopOutside,true); document.removeEventListener('keydown',diePopKey); }
function diePopOutside(e){ const p=document.getElementById('diePop'); if(p && !p.contains(e.target) && !e.target.closest('.diepick')) closeDiePop(); }
function diePopKey(e){ if(e.key==='Escape') closeDiePop(); }
function openDiePop(btn,cur,onPick){
  closeDiePop();
  const P=CODE.prob, dies=codeDies(), W=P?P.W:99, H=P?P.H:99;
  const usable=dies.filter(d=>d.p>=25 || d.w<=Math.max(W,H) || String(d.p)===String(cur));
  const pop=document.createElement('div'); pop.id='diePop'; pop.className='diepop'; pop.setAttribute('role','dialog');
  const curD=codeDie(cur);
  pop.innerHTML=`<div class="dph"><b>${t('k_pick_die')}</b><button type="button" class="dpx" aria-label="close">✕</button></div>
    <div class="dpgrid">${usable.map(d=>`<button type="button" class="kdb${String(d.p)===String(cur)?' on':''}" data-p="${d.p}">${dieThumb(d,34)}<span>${d.p}</span></button>`).join('')}</div>
    <div class="dpname">${curD? dieName(curD):''}</div>`;
  document.body.appendChild(pop);
  const name=pop.querySelector('.dpname');
  pop.querySelectorAll('.kdb').forEach(k=>{
    const d=codeDie(k.dataset.p);
    k.onpointerenter=()=>{ name.textContent=dieName(d); };
    k.onclick=()=>{ closeDiePop(); onPick(k.dataset.p); };
  });
  pop.querySelector('.dpx').onclick=closeDiePop;
  // 位置：ボタンの下（はみ出すときは 上）
  const r=btn.getBoundingClientRect(), pw=pop.offsetWidth, ph=pop.offsetHeight, vw=window.innerWidth, vh=window.innerHeight;
  let x=Math.min(Math.max(8,r.left), vw-pw-8), y=r.bottom+6;
  if(y+ph>vh-8) y=Math.max(8, r.top-ph-6);
  pop.style.left=x+'px'; pop.style.top=y+'px';
  setTimeout(()=>{ document.addEventListener('pointerdown',diePopOutside,true); document.addEventListener('keydown',diePopKey); },0);
}

/* ---- プログラムの表示 ---- */
let SLOTS=[];
function findParent(list,id){ for(let i=0;i<list.length;i++){ const b=list[i]; if(b.id===id) return {list,i}; if(b.body){ const r=findParent(b.body,id); if(r) return r; } } return null; }
function renderProg(){
  SLOTS=[]; closeDiePop();
  const ws=$('prog'); ws.innerHTML='';
  if(!CODE.cursor || !listAlive(CODE.cursor.list)) CODE.cursor={list:CODE.prog,index:CODE.prog.length};
  ws.appendChild(renderList(CODE.prog));
  saveProg();
}
function listAlive(l){ if(l===CODE.prog) return true; const walk=list=>list.some(b=>b.body&&(b.body===l||walk(b.body))); return walk(CODE.prog); }
function slotEl(list,index){
  const s=document.createElement('div'); s.className='slot'; s.dataset.k=SLOTS.length; SLOTS.push({list,index});
  if(CODE.cursor && CODE.cursor.list===list && CODE.cursor.index===index) s.classList.add('cur');
  s.innerHTML=`<span>${t('slot')}</span>`;
  s.onclick=e=>{ e.stopPropagation(); CODE.cursor={list,index}; renderProg(); };
  return s;
}
function renderList(list){
  const wrap=document.createElement('div'); wrap.className='blist';
  list.forEach((b,i)=>{ wrap.appendChild(slotEl(list,i)); wrap.appendChild(renderBlock(b,list,i)); });
  wrap.appendChild(slotEl(list,list.length));
  return wrap;
}
function renderBlock(b,list,i){
  const def=BLOCKS[b.type];
  const el=document.createElement('div'); el.className='blk k-'+def.kind+(def.body?' has-body':''); el.dataset.id=b.id;
  el.innerHTML=`<div class="brow"><span class="blab">${blockLabelHTML(b,true)}</span><span class="btools"><button data-t="up" aria-label="up">▲</button><button data-t="down" aria-label="down">▼</button><button data-t="del" aria-label="delete">✕</button></span></div>`;
  el.querySelectorAll('select').forEach(s=>s.onchange=()=>{ b.p[s.dataset.f]=s.value; saveProg(); });
  el.querySelectorAll('.diepick').forEach(btn=>btn.onclick=e=>{ e.stopPropagation(); openDiePop(btn,b.p[btn.dataset.f],v=>{ b.p[btn.dataset.f]=v; renderProg(); }); });
  el.querySelector('[data-t=up]').onclick=()=>{ if(i>0){ [list[i-1],list[i]]=[list[i],list[i-1]]; renderProg(); } };
  el.querySelector('[data-t=down]').onclick=()=>{ if(i<list.length-1){ [list[i+1],list[i]]=[list[i],list[i+1]]; renderProg(); } };
  el.querySelector('[data-t=del]').onclick=()=>{ list.splice(i,1); CODE.cursor={list,index:Math.min(i,list.length)}; renderProg(); };
  if(def.body){ const inner=document.createElement('div'); inner.className='bbody'; inner.appendChild(renderList(b.body)); el.appendChild(inner); const foot=document.createElement('div'); foot.className='bfoot'; el.appendChild(foot); }
  return el;
}
function insertBlock(type,slot){
  const tgt=slot||CODE.cursor||{list:CODE.prog,index:CODE.prog.length};
  const b=mkBlock(type);
  tgt.list.splice(tgt.index,0,b);
  CODE.cursor = b.body ? {list:b.body,index:0} : {list:tgt.list,index:tgt.index+1};
  renderProg();
  const el=document.querySelector(`#prog [data-id="${b.id}"]`); if(el){ el.classList.add('pop'); el.scrollIntoView({block:'nearest',behavior:'smooth'}); }
}

/* ---- パレット（タップ または ドラッグで入れる） ---- */
function renderPalette(){
  const groups=CODE.game==='hexa'? [['pal_act',['hgo','hnear','hmeet','hmove','hwait']],['h_pal_if',['hif','hifcar']]] : CODE.game==='kata'? [['pal_act',['kcut','kfix','kbest']],['pal_ctrl',['repeat','kuntil','kforxy','kif','stop']]] : [['pal_act',['rotate','try','best']],['pal_ctrl',['repeat','until','forxy','if','stop']]];
  $('palette').innerHTML=groups.map(([h,types])=>`<h5>${t(h)}</h5>`+types.map(ty=>`<div class="pblk blk k-${BLOCKS[ty].kind}" data-type="${ty}"><span class="blab">${blockLabelHTML({type:ty,p:DEFAULTS[ty]||{}},false)}</span></div>`).join('')).join('')+`<p class="ptip">${t({kata:'k_code_tip',hexa:'h_code_tip'}[CODE.game]||'code_tip')}</p>`;
  $('palette').querySelectorAll('.pblk').forEach(bindPaletteDrag);
}
function bindPaletteDrag(el){
  let st=null, ghost=null;
  el.addEventListener('pointerdown',e=>{ e.preventDefault(); st={x:e.clientX,y:e.clientY}; el.setPointerCapture(e.pointerId); });
  el.addEventListener('pointermove',e=>{
    if(!st) return;
    if(!ghost && Math.hypot(e.clientX-st.x,e.clientY-st.y)>8){
      ghost=el.cloneNode(true); ghost.classList.add('ghost'); document.body.appendChild(ghost); $('prog').classList.add('dragging');
    }
    if(ghost){
      ghost.style.left=(e.clientX+8)+'px'; ghost.style.top=(e.clientY+8)+'px';
      document.querySelectorAll('#prog .slot.hover').forEach(s=>s.classList.remove('hover'));
      const s=slotAt(e.clientX,e.clientY); if(s) s.classList.add('hover');
    }
  });
  const end=e=>{
    if(!st) return;
    if(ghost){ const s=slotAt(e.clientX,e.clientY); ghost.remove(); ghost=null; $('prog').classList.remove('dragging'); if(s) insertBlock(el.dataset.type,SLOTS[+s.dataset.k]); }
    else insertBlock(el.dataset.type);
    st=null;
  };
  el.addEventListener('pointerup',end);
  el.addEventListener('pointercancel',()=>{ if(ghost){ghost.remove();ghost=null;} $('prog').classList.remove('dragging'); st=null; });
}
function slotAt(x,y){
  const el=document.elementFromPoint(x,y); if(!el) return null;
  const s=el.closest && el.closest('#prog .slot'); if(s) return s;
  // いちばん近い スロットに 吸いつける
  let best=null,bd=40;
  document.querySelectorAll('#prog .slot').forEach(sl=>{ const r=sl.getBoundingClientRect(); if(x<r.left-20||x>r.right+20) return; const d=Math.abs(y-(r.top+r.height/2)); if(d<bd){bd=d;best=sl;} });
  return best;
}

/* ---- じっこう（インタプリタ） ---- */
function execProgram(prog,field0){
  const S=field0.length, max=S*S/2;
  const ctx={f:clone(field0),ops:[],trace:[],vars:{x:0,y:0},improved:false,steps:0,stopped:false,err:null,errId:null,notes:new Set()};
  const pairs=()=>pairSet(ctx.f).cnt;
  const val=v=> v==='x'?ctx.vars.x : v==='y'?ctx.vars.y : +v;
  const fits=(x,y,n)=> n>=2 && n<=S && x>=0 && y>=0 && x+n<=S && y+n<=S;
  const push=(x,y,n,id)=>{ ctx.f=rotate(ctx.f,x,y,n); ctx.ops.push({x,y,n}); ctx.trace.push({id,op:{x,y,n}}); if(ctx.ops.length>=3000){ctx.err='err_many';ctx.errId=id;ctx.stopped=true;} };
  const fail=(key,id)=>{ ctx.err=key; ctx.errId=id; ctx.stopped=true; };
  function run(list){
    for(const b of list){
      if(ctx.stopped) return;
      if(++ctx.steps>200000){ fail('err_limit',b.id); return; }
      const p=b.p||{};
      switch(b.type){
        case 'rotate': { const x=val(p.x),y=val(p.y),n=val(p.n); if(!fits(x,y,n)) return fail('err_out',b.id);
          const before=pairs(); push(x,y,n,b.id); ctx.improved=pairs()>before; break; }
        case 'try': { const x=val(p.x),y=val(p.y),n=val(p.n); if(!fits(x,y,n)) return fail('err_out',b.id);
          const before=pairs(); let g=ctx.f,bestK=0,bestP=before;
          for(let k=1;k<=3;k++){ g=rotate(g,x,y,n); const pp=pairSet(g).cnt; if(pp>bestP){bestP=pp;bestK=k;} }
          for(let k=0;k<bestK&&!ctx.stopped;k++) push(x,y,n,b.id);
          ctx.improved=bestK>0; break; }
        case 'best': { const score=g=>pairSet(g).cnt*1000-distSum(g); const cur=score(ctx.f), before=pairs(); let best=null,bs=cur;
          for(let n=2;n<=S;n++) for(let y=0;y+n<=S;y++) for(let x=0;x+n<=S;x++){ const sc=score(rotate(ctx.f,x,y,n)); if(sc>bs){bs=sc;best={x,y,n};} }
          if(best){ push(best.x,best.y,best.n,b.id); ctx.improved=pairs()>before; } else { ctx.improved=false; ctx.noBest=true; }
          break; }
        case 'repeat': for(let i=0;i<+p.n&&!ctx.stopped;i++) run(b.body); break;
        case 'until': { let guard=0;
          while(pairs()<max && !ctx.stopped){ const k=ctx.ops.length, nb=ctx.noBest; ctx.noBest=false; run(b.body);
            if(ctx.ops.length===k){ if(pairs()<max) ctx.notes.add('note_stuck'); break; }
            if(++guard>1000){ fail('err_limit',b.id); break; } }
          break; }
        case 'forxy': { const n=val(p.n); if(n<2||n>S) return fail('err_out',b.id); const sv={...ctx.vars};
          for(let y=0;y+n<=S&&!ctx.stopped;y++) for(let x=0;x+n<=S&&!ctx.stopped;x++){ ctx.vars={x,y}; run(b.body); }
          ctx.vars=sv; break; }
        case 'if': { let ok=false;
          if(p.c==='all') ok=pairs()===max;
          else if(p.c==='improved') ok=ctx.improved;
          else if(p.c==='notpaired'){ const {x,y}=ctx.vars; ok=!pairSet(ctx.f).set.has(x+','+y); }
          if(ok) run(b.body); break; }
        case 'stop': ctx.stopped=true; return;
      }
    }
  }
  run(prog);
  return {ops:ctx.ops,trace:ctx.trace,field:ctx.f,pairs:pairSet(ctx.f).cnt,err:ctx.err,errId:ctx.errId,notes:[...ctx.notes]};
}

/* ---- 第35回 用の ブロック ---- */
const K_BLOCKS={
  kcut:  {kind:'act',  label:'kb_cut',  fields:{p:'die',x:'pos',y:'pos',d:'dir'}},
  kfix:  {kind:'act',  label:'kb_fix',  fields:{x:'pos',y:'pos'}},
  kbest: {kind:'act',  label:'kb_best', fields:{}},
  repeat:{kind:'ctrl', label:'b_repeat',fields:{n:'count'}, body:true},
  kuntil:{kind:'ctrl', label:'kb_until',fields:{}, body:true},
  kforxy:{kind:'ctrl', label:'kb_forxy',fields:{}, body:true},
  kif:   {kind:'cond', label:'b_if',    fields:{c:'cond'}, body:true},
  stop:  {kind:'cond', label:'b_stop',  fields:{}}
};
const K_DEFAULTS={kcut:{p:'0',x:'0',y:'0',d:'2'},kfix:{x:'x',y:'y'},repeat:{n:'3'},kif:{c:'diff'}};
const K_FIELD_OPTS={
  die:()=> (CODE.prob&&CODE.prob.dies? CODE.prob.dies : kDiesFor(K_SAMPLE.general)).map(d=>String(d.p)),
  pos:()=>['x','y',...Array.from({length:15},(_,i)=>String(i-3))],
  dir:()=>['0','1','2','3'],
  count:EN_FIELD_OPTS.count,
  cond:()=>['all','improved','diff']
};
const K_SAMPLES={
  smp1:()=>{ const u=mkBlock('kuntil'); u.body.push(mkBlock('kbest')); return [u]; },
  smp2:()=>{ const f=mkBlock('kforxy'), i=mkBlock('kif',{c:'diff'}); i.body.push(mkBlock('kfix',{x:'x',y:'y'})); f.body.push(i); return [f]; },
  smp3:()=>[mkBlock('kcut',{p:'0',x:'0',y:'0',d:'2'})]
};
function execKata(prog,P){
  const {W,H,goal,dies}=P;
  const ctx={b:clone(P.start),ops:[],trace:[],vars:{x:0,y:0},improved:false,steps:0,stopped:false,err:null,errId:null,notes:new Set()};
  const miss=()=>kMiss(ctx.b,goal);
  const val=v=> v==='x'?ctx.vars.x : v==='y'?ctx.vars.y : +v;
  const fail=(k,id)=>{ ctx.err=k; ctx.errId=id; ctx.stopped=true; };
  const push=(o,id)=>{ ctx.b=kApply(ctx.b,dies,o); ctx.ops.push(o); ctx.trace.push({id,op:o}); if(ctx.ops.length>=3000) fail('err_many',id); };
  const useDies=dies.filter(d=>d.p>=25||d.w<=Math.max(W,H));
  function run(list){
    for(const bl of list){
      if(ctx.stopped) return;
      if(++ctx.steps>200000) return fail('err_limit',bl.id);
      const p=bl.p||{};
      switch(bl.type){
        case 'kcut': { const d=dieByP(dies,+p.p); if(!d) return fail('k_err_die',bl.id); const x=val(p.x),y=val(p.y);
          if(!dieOverlaps(W,H,d,x,y)) return fail('k_err_out',bl.id);
          const before=miss(); push({p:d.p,x,y,s:+p.d},bl.id); ctx.improved=miss()<before; break; }
        case 'kfix': { const x=val(p.x),y=val(p.y); if(x<0||y<0||x>=W||y>=H) return fail('k_err_out',bl.id);
          const before=miss(); kFixCell(clone(ctx.b),goal,x,y,dies,(o)=>{ if(!ctx.stopped) push(o,bl.id); }); ctx.improved=miss()<before; break; }
        case 'kbest': { const sc=b=>kMiss(b,goal)*1000-kPrefix(b,goal); let best=null,bs=sc(ctx.b); const before=miss();
          for(const d of useDies) for(let y=-(d.h-1);y<H;y++) for(let x=-(d.w-1);x<W;x++) for(let s=0;s<4;s++){ const v=sc(katanuki(ctx.b,d.cells,x,y,s)); if(v<bs){bs=v;best={p:d.p,x,y,s};} }
          if(best){ push(best,bl.id); ctx.improved=miss()<before; } else ctx.improved=false; break; }
        case 'repeat': for(let i=0;i<+p.n&&!ctx.stopped;i++) run(bl.body); break;
        case 'kuntil': { let guard=0; while(miss()>0&&!ctx.stopped){ const k=ctx.ops.length; run(bl.body); if(ctx.ops.length===k){ if(miss()>0) ctx.notes.add('k_note_stuck'); break; } if(++guard>1000){ fail('err_limit',bl.id); break; } } break; }
        case 'kforxy': { const sv={...ctx.vars}; for(let y=0;y<H&&!ctx.stopped;y++) for(let x=0;x<W&&!ctx.stopped;x++){ ctx.vars={x,y}; run(bl.body); } ctx.vars=sv; break; }
        case 'kif': { let ok=false; if(p.c==='all') ok=miss()===0; else if(p.c==='improved') ok=ctx.improved; else if(p.c==='diff'){ const {x,y}=ctx.vars; ok=x>=0&&y>=0&&x<W&&y<H&&ctx.b[y][x]!==goal[y][x]; } if(ok) run(bl.body); break; }
        case 'stop': ctx.stopped=true; return;
      }
    }
  }
  run(prog);
  return {ops:ctx.ops,trace:ctx.trace,board:ctx.b,miss:kMiss(ctx.b,goal),err:ctx.err,errId:ctx.errId,notes:[...ctx.notes]};
}

/* ---- 第37回 用の ブロック（車が 次の 行動を きめる たびに 上から 実行） ---- */
const H_BLOCKS={
  hgo:   {kind:'act',  label:'hb_go',    fields:{}},
  hnear: {kind:'act',  label:'hb_near',  fields:{}},
  hmeet: {kind:'act',  label:'hb_meet',  fields:{}},
  hmove: {kind:'act',  label:'hb_move',  fields:{d:'hdir'}},
  hwait: {kind:'act',  label:'hb_wait',  fields:{}},
  hif:   {kind:'cond', label:'b_if',     fields:{c:'cond'}, body:true},
  hifcar:{kind:'cond', label:'hb_ifcar', fields:{n:'carno'}, body:true}
};
const H_DEFAULTS={hmove:{d:'2'},hif:{c:'lowfuel'},hifcar:{n:'1'}};
const H_FIELD_OPTS={ hdir:()=>['0','1','2','3','4','5'], carno:()=>['1','2','3','4'], cond:()=>['patrol','supply','lowfuel','halffuel','together','allkinds'] };
const H_SAMPLES={
  smp1:()=>[mkBlock('hgo')],
  smp2:()=>{ const a=mkBlock('hif',{c:'lowfuel'}); a.body.push(mkBlock('hmeet')); const b=mkBlock('hif',{c:'supply'}); b.body.push(mkBlock('hmeet')); return [a,b,mkBlock('hgo')]; },
  smp3:()=>{ const a=mkBlock('hif',{c:'allkinds'}); a.body.push(mkBlock('hnear')); const b=mkBlock('hif',{c:'lowfuel'}); b.body.push(mkBlock('hmeet')); const c=mkBlock('hif',{c:'supply'}); c.body.push(mkBlock('hmeet')); return [b,c,a,mkBlock('hgo')]; }
};
// 1台の 車の 次の 行動を プログラムで きめる
function hProgDecide(prog,ctx,i,E){
  const {P,A,stock,taken,t,S}=ctx, a=A[i], mem=ctx.mem; mem.claim=mem.claim||{}; mem.D=mem.D||{};
  const canMove=()=> t+hTime(P.terr[a.cur],ctx.roads[a.cur])<=S && (a.type!=='p'||a.fuel>=H_FUEL[P.terr[a.cur]]);
  const go=onlyNew=>hActGo(ctx,i,onlyNew), meet=()=>hActMeet(ctx,i);
  const cond=c=>{ switch(c){
    case 'patrol': return a.type==='p'; case 'supply': return a.type==='s';
    case 'lowfuel': return a.type==='p'&&a.fuel<=P.fuelMax/4; case 'halffuel': return a.type==='p'&&a.fuel<=P.fuelMax/2;
    case 'together': return A.some((b,j)=>j!==i&&b.type!==a.type&&b.cur===a.cur);
    case 'allkinds': return ctx.todayKinds.size>=P.kinds; } return false; };
  let out=null, n=0;
  const run=list=>{ for(const b of list){ if(out||E.err) return; if(++n>2000){ E.err='err_limit'; E.errId=b.id; return; }
    const p=b.p||{};
    switch(b.type){
      case 'hgo': out={act:go(true),id:b.id}; break;
      case 'hnear': out={act:go(false),id:b.id}; break;
      case 'hmeet': out={act:meet(),id:b.id}; break;
      case 'hwait': out={act:'w',id:b.id}; break;
      case 'hmove': { const nb=hNb(P.W,P.H,a.cur,+p.d); if(nb<0||P.terr[nb]===2){ E.err='h_err_pond'; E.errId=b.id; return; }
        if(!canMove()){ E.notes.add('h_note_wait'); out={act:'w',id:b.id}; } else out={act:+p.d,id:b.id}; break; }
      case 'hif': if(cond(p.c)) run(b.body); break;
      case 'hifcar': if(i+1===+p.n) run(b.body); break;
    } } };
  run(prog);
  return out||{act:'w',id:null};
}
function execHexa(prog,P){
  const E={err:null,errId:null,notes:new Set()}, types=hRobotTypes(P,2); let team=hInitTeam(P,types); const stays=[], days=[], trace=[];
  for(let d=0;d<P.days&&!E.err;d++){
    const roads=hRoadStates(P,stays,1); team=hNewDayStock(P,team); const start=[JSON.parse(JSON.stringify({agents:team.agents}))], ids={};
    const r=hRunTeam(P,d,roads,team,(ctx,i)=>{ if(E.err) return null; const o=hProgDecide(prog,ctx,i,E); if(o.id&&ids[ctx.t]===undefined) ids[ctx.t]=o.id; return E.err? null : o.act; });
    team=r.st; stays.push(r.stays.slice());
    days.push({roads,start,res:[r],time:[0],plans:[r.acts]});
    for(let tt=1;tt<=r.S;tt++){ let id=null; for(let q=tt-1;q>=0;q--){ if(ids[q]!==undefined){ id=ids[q]; break; } } trace.push({day:d,tau:tt,id}); }
  }
  const sc=hScore(days,0);
  // お手本チームを 同じ マップに かさねて 見せる（自分=こい色、お手本=うすい色）
  const MM=hModelMatch(P), view=days.map((d,j)=>({roads:d.roads,start:[d.start[0],MM.days[j].start[0]],res:[d.res[0],MM.days[j].res[0]]}));
  let me0=0,mo0=0; const base=days.map((d,j)=>{ const b=[me0,mo0]; me0+=d.res[0].udon; mo0+=MM.days[j].res[0].udon; return b; });
  trace.forEach(tr=>{ const b=base[tr.day]; tr.me=b[0]+days[tr.day].res[0].events.filter(e=>e.t<=tr.tau).length; tr.mo=b[1]+MM.days[tr.day].res[0].events.filter(e=>e.t<=tr.tau).length; });
  return {days,view,trace,ops:trace,score:sc,err:E.err,errId:E.errId,notes:[...E.notes]};
}
function hModelMatch(P){ if(!P._mm) P._mm=hRobotMatch(P,[3]); return P._mm; }
function hModel(P){ if(!P._model) P._model=hScore(hModelMatch(P).days,0); return P._model; }

/* ---- 競技ごとの ちがい ---- */
const GDEF={
  en:{
    blocks:EN_BLOCKS, defaults:EN_DEFAULTS, opts:EN_FIELD_OPTS, samples:EN_SAMPLES, smpKeys:['smp1','smp2','smp3'],
    newProblem:S=>({field0:genField(S)}),
    mount(P,w){ const bd=new Board($('codeBoard'),{field:P.field0,maxPx:Math.min(w-8,400)}); bd.sel=null; bd.drawSel(); return bd; },
    reset(bd,P){ bd.sel=null; bd.setField(P.field0); },
    final(bd,res){ bd.setField(res.field); },
    step(bd,tr,anim,cb){ bd.setSel(tr.op.x,tr.op.y,tr.op.n); if(anim) bd.doRotate(()=>cb()); else { bd.field=rotate(bd.field,tr.op.x,tr.op.y,tr.op.n); bd.render(); cb(); } },
    exec:(prog,P)=>execProgram(prog,P.field0),
    done(res,P){ const max=P.field0.length**2/2; return {html:t('st_done',{p:res.pairs,max,m:res.ops.length}),good:res.pairs===max}; },
    compare(res,P){ const max=P.field0.length**2/2, model=modelSolve(P.field0); const win=!res.err&&(res.pairs>model.pairs||(res.pairs===model.pairs&&res.ops.length<=model.ops.length));
      return {win,me:`${t('l_pairs')} <b>${res.pairs}</b> / ${max}<br>${t('l_moves')} <b>${res.ops.length}</b>`, model:`${t('l_pairs')} <b>${model.pairs}</b> / ${max}<br>${t('l_moves')} <b>${model.ops.length}</b>`, json:JSON.stringify({ops:res.ops})}; }
  },
  kata:{
    blocks:K_BLOCKS, defaults:K_DEFAULTS, opts:K_FIELD_OPTS, samples:K_SAMPLES, smpKeys:['k_smp1','k_smp2','k_smp3'],
    newProblem:S=>kMakeProblem(S,'mid'),
    mount(P,w){ $('codeBoard').innerHTML='<div class="kpb" style="padding-top:0"><div id="codeKB"></div><div class="kgoalmini"><small>'+t('k_goal_short')+'</small><div id="codeKG"></div></div></div>';
      const bd=new KBoard($('codeKB'),{vals:P.start,goal:P.goal,maxPx:Math.min(w-130,320),hideLabel:true}); new KBoard($('codeKG'),{vals:P.goal,maxPx:90,showMiss:false}); return bd; },
    reset(bd,P){ bd.die=null; bd.setGrid(P.start); },
    final(bd,res){ bd.die=null; bd.setGrid(res.board); },
    step(bd,tr,anim,cb){ const d=dieByP(CODE.prob.dies,tr.op.p); bd.die=d; bd.pos={x:tr.op.x,y:tr.op.y}; bd.drawDie(); bd.cut(d,tr.op.x,tr.op.y,tr.op.s,anim,cb); },
    exec:(prog,P)=>execKata(prog,P),
    done(res,P){ return {html:t('k_st_done',{d:res.miss,all:P.W*P.H,m:res.ops.length}),good:res.miss===0}; },
    compare(res,P){ const all=P.W*P.H, model=kModelSolve(P.start,P.goal,P.dies,400); const win=!res.err&&(res.miss<model.miss||(res.miss===model.miss&&res.ops.length<=model.ops.length));
      return {win,me:`${t('k_l_miss')} <b>${res.miss}</b> / ${all}<br>${t('l_moves')} <b>${res.ops.length}</b>`, model:`${t('k_l_miss')} <b>${model.miss}</b> / ${all}<br>${t('l_moves')} <b>${model.ops.length}</b>`, json:kAnswerJSON(res.ops)}; }
  }
};
GDEF.hexa={
  blocks:H_BLOCKS, defaults:H_DEFAULTS, opts:H_FIELD_OPTS, samples:H_SAMPLES, smpKeys:['h_smp1','h_smp2','h_smp3'], sizes:[8,10,12],
  newProblem:S=>hMakeProblem(S,'mid'),
  mount(P,w){ const bd=new HBoard($('codeBoard'),{P,maxW:Math.min(w-8,440),maxH:380});
    $('codeBoard').insertAdjacentHTML('afterend',`<div class="hcleg" id="hcLeg"><span><i class="hteam" style="background:${HTEAMC[0]}"></i><b data-i18n="h_leg_me">${t('h_leg_me')}</b></span><span><i class="hteam" style="background:${HTEAMC[1]};opacity:.5"></i><b data-i18n="h_leg_model">${t('h_leg_model')}</b></span></div>`);
    this.reset(bd,P); return bd; },
  look:k=>k? {color:HTEAMC[1],ghost:true} : {color:HTEAMC[0],ghost:false},
  reset(bd,P){ bd.curDay=null; if(bd.anim){ bd.anim=null; } const ag=hRobotTypes(P,2).map((ty,i)=>({type:ty,pos:P.starts[i]}));
    bd.set({roads:new Array(P.N).fill(0),stock:null,plans:[],teams:[{agents:ag,...this.look(0)},{agents:ag,...this.look(1)}]}); },
  final(bd,res){ const d=res.view[res.view.length-1]; if(!d) return; bd.curDay=null; bd.state.roads=d.roads; const A=new HAnim(bd,d,this.look); A.tau=d.res[0].S; A.frame(); bd.render(); },
  step(bd,tr,anim,cb){ const rec=CODE.result.view[tr.day];
    if(bd.curDay!==tr.day){ bd.curDay=tr.day; bd.state.roads=rec.roads; bd.anim=new HAnim(bd,rec,this.look,{popAll:true}); bd.anim.tau=tr.tau-1; bd.anim.frame(); bd.render(); }
    const A=bd.anim, from=tr.tau-1, to=tr.tau;
    if(!anim){ A.tau=to; A.frame(); cb(); return; }
    const t0=performance.now(), dur=260; const go=now=>{ const f=Math.min(1,(now-t0)/dur); A.tau=from+(to-from)*f; A.frame(); if(f<1) requestAnimationFrame(go); else cb(); }; requestAnimationFrame(go); },
  exec:(prog,P)=>execHexa(prog,P),
  done(res,P){ const s=res.score; return {html:t('h_st_done',{k:s.kinds,n:P.kinds,d:s.daily,u:s.udon}),good:s.kinds===P.kinds}; },
  compare(res,P){ const s=res.score, m=hModel(P), win=!res.err&&hCompare(s,{...m,time:0})[0]<=0;
    const L=x=>`${t('h_c_kinds')} <b>${x.kinds}</b> / ${P.kinds}<br>${t('h_c_daily')} <b>${x.daily}</b><br>${t('h_c_udon')} <b>${x.udon}</b>`;
    return {win,me:L(s),model:L(m),modelKey:'h_model_title',json:res.days.map((d,j)=>`// ${t('h_day_n',{d:j+1})}\n[\n`+d.res[0].out.map(a=>'  '+JSON.stringify(a)).join(',\n')+'\n]').join('\n\n')}; }
};
const D=()=>GDEF[CODE.game];

/* ---- ためす（盤面での 再生と ブロックの 光） ---- */
function codeSetup(game){
  game=game||CODE.game;
  if(game!==CODE.game || !CODE.loaded[game]){
    codeStop();
    if(CODE.loaded[CODE.game]){ CODE.progs[CODE.game]=CODE.prog; CODE.probs[CODE.game]=CODE.prob; }
    CODE.game=game; const g=D(); BLOCKS=g.blocks; DEFAULTS=g.defaults; FIELD_OPTS=g.opts; SAMPLES=g.samples;
    CODE.prob=CODE.probs[game]||null; CODE.cursor=null; CODE.result=null; $('codeResult').innerHTML='';
    if(CODE.progs[game]) CODE.prog=CODE.progs[game];
    else { CODE.prog=loadProg(); if(!validProg(CODE.prog)) CODE.prog=SAMPLES.smp1(); }
    CODE.loaded[game]=true;
    const sizes=g.sizes||[4,6,8]; CODE.sz=CODE.sz||{}; CODE.S=CODE.sz[game]||(game==='hexa'?8:6);
    $('codeSize').innerHTML=sizes.map(s=>`<button data-v="${s}" class="${s===CODE.S?'on':''}">${s}×${s}</button>`).join('');
    $('codeSize').querySelectorAll('button').forEach(b=>b.onclick=()=>{ setSeg('codeSize',b.dataset.v); CODE.S=+b.dataset.v; CODE.sz[CODE.game]=CODE.S; newCodeProblem(); });
    if(!CODE.prob) CODE.prob=g.newProblem(CODE.S);
    mountCodeBoard();
  } else if(!CODE.board||!CODE.board.wrap.isConnected) mountCodeBoard();
  relabelCode();
}
function newCodeProblem(){ codeStop(); CODE.prob=D().newProblem(CODE.S); CODE.result=null; mountCodeBoard(); $('codeResult').innerHTML=''; renderProg(); codeStatus(t({kata:'k_st_ready',hexa:'h_st_ready'}[CODE.game]||'st_ready')); }
function mountCodeBoard(){ const w=$('codeBoardWrap').clientWidth||340; const lg=$('hcLeg'); if(lg) lg.remove(); CODE.board=D().mount(CODE.prob,w); }
function codeStatus(html,cls){ const s=$('codeStatus'); s.innerHTML=html; s.className='hint'+(cls?' '+cls:''); }
function hlBlock(id){ document.querySelectorAll('#prog .blk.run').forEach(e=>e.classList.remove('run')); if(id){ const el=document.querySelector(`#prog [data-id="${id}"]`); if(el){ el.classList.add('run'); el.scrollIntoView({block:'nearest'}); } } }
function errBlock(id){ document.querySelectorAll('#prog .blk.err').forEach(e=>e.classList.remove('err')); if(id){ const el=document.querySelector(`#prog [data-id="${id}"]`); if(el) el.classList.add('err'); } }
function codeStop(){ if(CODE.runner){ clearTimeout(CODE.runner.timer); CODE.runner=null; } hlBlock(null); const r=$('codeRun'); if(r) r.disabled=false; }
function codeRun(animated){
  codeStop(); errBlock(null);
  if(!CODE.prog.length){ codeStatus(t('empty_err'),'bad'); return; }
  const g=D(), res=g.exec(CODE.prog,CODE.prob); CODE.result=res;
  g.reset(CODE.board,CODE.prob);
  if(!animated){ g.final(CODE.board,res); finishCode(res); return; }
  const R=CODE.runner={k:0,timer:null}; $('codeRun').disabled=true;
  const stepMs=()=>({slow:900,mid:450,fast:60})[segVal('codeSpeed')];
  const tick=()=>{
    if(CODE.runner!==R) return;
    if(R.k>=res.trace.length){ hlBlock(null); CODE.runner=null; $('codeRun').disabled=false; finishCode(res); return; }
    const tr=res.trace[R.k++]; hlBlock(tr.id);
    codeStatus(t(CODE.game==='hexa'?'h_st_running':'st_running',{k:R.k,n:res.trace.length,d:(tr.day||0)+1,t:tr.tau||0,me:tr.me||0,mo:tr.mo||0}));
    const ms=stepMs(), anim=ms>=400;
    g.step(CODE.board,tr,anim,()=>{ if(CODE.runner===R) R.timer=setTimeout(tick, anim? Math.max(60,ms-480+120) : ms); });
  };
  tick();
}
function finishCode(res){
  const g=D();
  if(res.err){ errBlock(res.errId); codeStatus(t(res.err),'bad'); }
  else { const d=g.done(res,CODE.prob); codeStatus(d.html+(res.notes.length?'<br>'+res.notes.map(n=>t(n)).join(''):''), d.good?'good':''); }
  const c=g.compare(res,CODE.prob);
  $('codeResult').innerHTML=`<div class="vs" style="grid-template-columns:1fr 1fr;margin:10px 0"><div class="side ${c.win?'win':''}"><h5>${t('code_you')}</h5><div>${c.me}</div></div>
    <div class="side"><h5>${t(c.modelKey||'model_title')}</h5><div>${c.model}</div></div></div>
    <details><summary>${t('code_json')}</summary><pre class="json" style="margin-top:8px">${c.json}</pre></details>`;
}
document.querySelectorAll('#codeSpeed button').forEach(b=>b.addEventListener('click',()=>setSeg('codeSpeed',b.dataset.v)));
$('codeNew').onclick=newCodeProblem;
$('codeRun').onclick=()=>codeRun(true);
$('codeFast').onclick=()=>codeRun(false);
$('codeStopBtn').onclick=()=>{ codeStop(); codeStatus(t('st_ready')); };
$('codeReset').onclick=()=>{ codeStop(); errBlock(null); D().reset(CODE.board,CODE.prob); $('codeResult').innerHTML=''; codeStatus(t('st_ready')); };
$('codeClear').onclick=()=>{ codeStop(); CODE.prog.length=0; CODE.cursor=null; renderProg(); };
$('codeSample').onchange=e=>{ const k=e.target.value; if(!k) return; codeStop(); CODE.prog=SAMPLES[k](); CODE.cursor=null; renderProg(); e.target.value=''; };
function relabelCode(){
  if(!CODE.loaded[CODE.game]) return;
  renderPalette(); renderProg();
  const g=D();
  $('codeSample').innerHTML=`<option value="">${t('sample_pick')}</option>`+['smp1','smp2','smp3'].map((k,i)=>`<option value="${k}">${t(g.smpKeys[i])}</option>`).join('');
  if(!CODE.runner) codeStatus(t({kata:'k_st_ready',hexa:'h_st_ready'}[CODE.game]||'st_ready'));
  if(CODE.result && !CODE.runner) finishCode(CODE.result);
  if(CODE.board && CODE.board.drawDie) CODE.board.drawDie();
}
