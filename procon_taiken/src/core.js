/* ============ core rules ============ */
const SAMPLE = [[6,3,4,0],[1,5,3,5],[2,7,0,6],[1,2,7,4]];
const clone = f => f.map(r => r.slice());
function genField(S){
  const vals=[]; for(let v=0; v<S*S/2; v++){vals.push(v,v);}
  for(let i=vals.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[vals[i],vals[j]]=[vals[j],vals[i]];}
  const f=[]; for(let y=0;y<S;y++) f.push(vals.slice(y*S,(y+1)*S));
  return f;
}
// 園を右(時計回り)に90度回転: new[r][c] = old[n-1-c][r]
function rotate(f,x,y,n){
  const g=clone(f);
  for(let r=0;r<n;r++) for(let c=0;c<n;c++) g[y+r][x+c]=f[y+n-1-c][x+r];
  return g;
}
function positions(f){
  const p={}; f.forEach((row,y)=>row.forEach((v,x)=>{(p[v]=p[v]||[]).push([x,y]);})); return p;
}
function pairSet(f){
  const p=positions(f), set=new Set(); let cnt=0;
  for(const v in p){const [a,b]=p[v]; if(Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])===1){cnt++; set.add(a+''); set.add(b+'');}}
  return {cnt,set};
}
function distSum(f){
  const p=positions(f); let d=0;
  for(const v in p){const [a,b]=p[v]; d+=Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);}
  return d;
}
// テーマごとのマスの色（彩度・明るさ）
const TILE={normal:{s:55,l:42,step:7},night:{s:42,l:34,step:6},eye:{s:26,l:44,step:5}};
// 色覚サポート：Okabe & Ito の配色（色覚の違いがあっても見分けやすい8色）＋ 形のしるし
const CUD_COLORS=['#E69F00','#56B4E9','#009E73','#F0E442','#0072B2','#D55E00','#CC79A7','#8C8C8C'];
const CUD_SHAPES=['●','▲','■','◆','★','✚','▼','◐','✖'].map(c=>c+'\uFE0E');
function cudOf(v){ return {bg:CUD_COLORS[v%8], shape:CUD_SHAPES[Math.floor(v/8)%9], dark:[0,1,3,6,7].includes(v%8)}; }
function colorOf(v,total,th){
  th=th||SETTINGS.theme;
  if(th==='cud') return cudOf(v).bg;
  const t=TILE[th]||TILE.normal;
  const h=(v*137.508)%360; const l= t.l + (v%3)*t.step;
  return `hsl(${h.toFixed(0)} ${t.s}% ${l}%)`;
}

/* ============ robot (greedy) ============ */
function robotSolver(f0,level){
  const S=f0.length, maxMoves={1:Math.round(S*S*0.15),2:Math.round(S*S*0.4),3:Math.round(S*S*1.5)}[level];
  const st={field:clone(f0),ops:[],done:false};
  const score=g=>pairSet(g).cnt*1000 - distSum(g)*(level===1?0:1);
  let cur=score(st.field);
  st.step=function(){
    if(st.done) return;
    let best=null,bs=cur;
    const nmax=Math.min(S, level===1?3:S);
    for(let n=2;n<=nmax;n++) for(let y=0;y+n<=S;y++) for(let x=0;x+n<=S;x++){
      const g=rotate(st.field,x,y,n), sc=score(g);
      if(sc>bs){bs=sc;best={x,y,n,g};}
    }
    if(!best){st.done=true;return;}
    st.field=best.g; cur=bs; st.ops.push({x:best.x,y:best.y,n:best.n});
    if(st.ops.length>=maxMoves || pairSet(st.field).cnt===S*S/2) st.done=true;
  };
  st.run=function(cb){ const t=Date.now(); while(!st.done && Date.now()-t<12) st.step(); if(st.done) cb&&cb(); else st.timer=setTimeout(()=>st.run(cb),16); };
  st.finishNow=function(){ clearTimeout(st.timer); while(!st.done) st.step(); };
  return st;
}

/* ============ model answer (constructive, 手数少なめ版) ============ */
// 作戦：上の行から1組ずつペアを完成させ、できたペアは動かさない。
//   ・毎回「いちばん少ない手数で作れるペア」をえらぶ
//   ・フィールドを 0/90/180/270度 まわした4通りで解いて、いちばん手数が少ないものを採用
function modelSolveOnce(f0){
  const S=f0.length; let f=clone(f0); const ops=[];
  const locked=Array.from({length:S},()=>Array(S).fill(false));
  const apply=(x,y,n)=>{f=rotate(f,x,y,n); ops.push({x,y,n});};
  const squares=(forbid)=>{
    const free=(x,y)=>!locked[y][x] && !(forbid&&forbid(x,y)), sq=[];
    for(let n=2;n<=S;n++) for(let y=0;y+n<=S;y++) for(let x=0;x+n<=S;x++){
      let ok=true; for(let r=0;r<n&&ok;r++) for(let c=0;c<n&&ok;c++) if(!free(x+c,y+r)) ok=false;
      if(ok) sq.push([x,y,n]);
    }
    return sq;
  };
  // ゴールまでの手数を全マスについて求める（逆向きBFS）
  function distMap(tx,ty,sq){
    const d=new Int16Array(S*S).fill(-1); d[ty*S+tx]=0; const q=[[tx,ty]];
    while(q.length){ const [cx,cy]=q.shift();
      for(const [x,y,n] of sq){ if(cx<x||cx>=x+n||cy<y||cy>=y+n) continue;
        const r2=cy-y, c2=cx-x, ox=x+r2, oy=y+n-1-c2, k=oy*S+ox;   // まわす前の位置
        if(d[k]<0){ d[k]=d[cy*S+cx]+1; q.push([ox,oy]); } } }
    return d;
  }
  function path(sx,sy,tx,ty,sq){
    if(sx===tx&&sy===ty) return [];
    const key=(x,y)=>y*S+x, prev=new Map([[key(sx,sy),null]]), q=[[sx,sy]];
    while(q.length){ const [cx,cy]=q.shift(); if(cx===tx&&cy===ty) break;
      for(const [x,y,n] of sq){ if(cx<x||cx>=x+n||cy<y||cy>=y+n) continue;
        const r=cy-y, c=cx-x, nx=x+(n-1-r), ny=y+c, k=key(nx,ny);
        if(!prev.has(k)){prev.set(k,[cx,cy,x,y,n]); q.push([nx,ny]);} } }
    if(!prev.has(key(tx,ty))) return null;
    const p=[]; let k=key(tx,ty); while(prev.get(k)){const e=prev.get(k); p.push([e[2],e[3],e[4]]); k=key(e[0],e[1]);}
    return p.reverse();
  }
  const run=p=>p.forEach(([x,y,n])=>apply(x,y,n));
  const where=(v)=>{const r=[]; for(let y=0;y<S;y++)for(let x=0;x<S;x++) if(f[y][x]===v&&!locked[y][x]) r.push([x,y]); return r;};
  const freeVals=()=>{const s=new Set(); for(let y=0;y<S;y++)for(let x=0;x<S;x++) if(!locked[y][x]) s.add(f[y][x]); return [...s];};
  const INF=9999, dv=(d,p)=>d[p[1]*S+p[0]]<0?INF:d[p[1]*S+p[0]];

  // ---- 上の S-2 行：横ペア (x,y)(x+1,y)
  for(let y=0;y<=S-3;y++) for(let x=0;x<S;x+=2){
    const notXY=(cx,cy)=>cx===x&&cy===y;
    const sqA=squares(null), sqB=squares(notXY);
    const d0=distMap(x,y,sqA), d1=distMap(x,y+1,sqB), d2=(x+2<S)?distMap(x+1,y,sqB):null;
    let best=null;
    for(const v of freeVals()){ const [a,b]=where(v);
      for(const [P,Q] of [[a,b],[b,a]]){
        let c;
        if(P[0]===x&&P[1]===y&&Q[0]===x+1&&Q[1]===y) c=0;
        else { const m1=dv(d1,Q)+1, m2=(Q[0]===x+1&&Q[1]===y)?0:(d2?dv(d2,Q):INF); c=dv(d0,P)+Math.min(m1,m2); }
        if(!best||c<best.c) best={c,v,P};
      } }
    run(path(best.P[0],best.P[1],x,y,sqA));
    const Q=where(best.v).find(p=>!(p[0]===x&&p[1]===y));
    if(!(Q[0]===x+1&&Q[1]===y)){
      const p1=path(Q[0],Q[1],x,y+1,sqB), p2=(x+2<S)?path(Q[0],Q[1],x+1,y,sqB):null;
      if(p2 && (!p1 || p2.length<=p1.length+1)) run(p2); else { run(p1); apply(x,y,2); }
    }
    locked[y][x]=locked[y][x+1]=true;
  }
  // ---- 最後の2行：たてペア（右の4列は残す）
  const y0=S-2;
  for(let x=0;x<=S-5;x++){
    const sqA=squares(null), sqB=squares((cx,cy)=>cx===x&&cy===y0+1);
    const d0=distMap(x,y0+1,sqA), d1=distMap(x+1,y0+1,sqB);
    let best=null;
    for(const v of freeVals()){ const [a,b]=where(v);
      for(const [P,Q] of [[a,b],[b,a]]){
        let c;
        if(Q[0]===x&&Q[1]===y0&&P[0]===x&&P[1]===y0+1) c=0;
        else c=dv(d0,P)+dv(d1,Q)+1;
        if(!best||c<best.c) best={c,v,P};
      } }
    run(path(best.P[0],best.P[1],x,y0+1,sqA));
    const Q=where(best.v).find(p=>!(p[0]===x&&p[1]===y0+1));
    if(!(Q[0]===x&&Q[1]===y0)){ run(path(Q[0],Q[1],x+1,y0+1,sqB)); apply(x,y0,2); }
    locked[y0][x]=locked[y0+1][x]=true;
  }
  // ---- 右下 2×4：全探索で最短
  const X=S-4, cells=[]; for(let c=0;c<4;c++) cells.push([X+c,y0]); for(let c=0;c<4;c++) cells.push([X+c,y0+1]);
  const enc=g=>cells.map(([x,y])=>g[y][x]).join(',');
  const okPairs=g=>{let p=0; const pos={}; cells.forEach(([x,y])=>{(pos[g[y][x]]=pos[g[y][x]]||[]).push([x,y]);});
    for(const v in pos){const [a,b]=pos[v]; if(Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])===1)p++;} return p;};
  const seen=new Map([[enc(f),null]]), q=[f]; let best=f, bp=okPairs(f);
  while(q.length && bp<4){
    const g=q.shift();
    for(let k=0;k<3;k++){
      const h=rotate(g,X+k,y0,2), e=enc(h);
      if(seen.has(e)) continue; seen.set(e,[enc(g),k]); q.push(h);
      const p=okPairs(h); if(p>bp){bp=p;best=h; if(p===4) break;}
    }
  }
  const tail=[]; let e=enc(best);
  while(seen.get(e)){const [pe,k]=seen.get(e); tail.push(k); e=pe;}
  tail.reverse().forEach(k=>apply(X+k,y0,2));
  const out=[]; for(const o of ops){ out.push(o); const L=out.length;
    if(L>=4 && out.slice(L-4).every(p=>p.x===o.x&&p.y===o.y&&p.n===o.n)) out.length=L-4; }
  return out;
}
function turnField(f){ const S=f.length; return f.map((row,r)=>row.map((_,c)=>f[S-1-c][r])); } // フィールド全体を時計回り
function modelSolve(f0){
  const S=f0.length; let best=null, g=clone(f0);
  for(let k=0;k<4;k++){
    let ops=modelSolveOnce(g);
    for(let t=0;t<k;t++) ops=ops.map(o=>({x:o.y, y:S-o.x-o.n, n:o.n}));   // 向きをもとにもどす
    let h=clone(f0); ops.forEach(o=>h=rotate(h,o.x,o.y,o.n));
    const pr=pairSet(h).cnt;
    if(!best || pr>best.pairs || (pr===best.pairs && ops.length<best.ops.length)) best={ops,field:h,pairs:pr};
    g=turnField(g);
  }
  return best;
}

/* ============ board component ============ */
const BOARDS=[];
function Board(host,opts){
  this.host=host; this.opts=opts||{};
  this.field=clone(opts.field); this.S=this.field.length;
  this.sel=opts.sel||null; this.showCoord=!!opts.coord; this.busy=false;
  BOARDS.push(this);
  this.mount();
}
Board.prototype.size=function(){
  const max=this.opts.maxPx || Math.min(window.innerWidth-48, window.innerHeight-170, 720);
  const gap=this.S>10?3:5;
  const cs=Math.floor((max-gap*(this.S+1))/this.S);
  return {cs,gap};
};
Board.prototype.mount=function(){
  const {cs,gap}=this.size(); this.cs=cs; this.gap=gap;
  this.host.innerHTML='';
  const wrap=document.createElement('div'); wrap.className='board-wrap';
  wrap.style.setProperty('--cs',cs+'px'); wrap.style.setProperty('--gap',gap+'px');
  wrap.dataset.th=this.opts.theme||SETTINGS.theme;
  wrap.style.width=(cs*this.S+gap*(this.S+1))+'px';
  const b=document.createElement('div'); b.className='board';
  b.style.gridTemplateColumns=`repeat(${this.S},${cs}px)`;
  wrap.appendChild(b); this.host.appendChild(wrap);
  this.wrap=wrap; this.boardEl=b;
  this.selEl=document.createElement('div'); this.selEl.className='sel'; this.selEl.innerHTML='<span class="lbl"></span>';
  wrap.appendChild(this.selEl);
  if(this.opts.interactive) this.bindInput();
  this.render();
};
Board.prototype.cellPos=function(x,y){const g=this.gap,c=this.cs; return {left:g+x*(c+g), top:g+y*(c+g)};};
Board.prototype.render=function(){
  if(this.wrap) this.wrap.dataset.th=this.opts.theme||SETTINGS.theme;
  const ps=pairSet(this.field), total=this.S*this.S/2;
  this.boardEl.innerHTML='';
  this.cells=[];
  for(let y=0;y<this.S;y++){ const row=[]; for(let x=0;x<this.S;x++){
    const v=this.field[y][x], d=document.createElement('div');
    d.className='cell'+(ps.set.has(x+','+y)?' pair':'');
    const th=this.opts.theme||SETTINGS.theme;
    d.style.background=colorOf(v,total,th);
    let extra='';
    if(th==='cud'){ const c=cudOf(v); if(c.dark) d.classList.add('dk'); extra=`<span class="shp">${c.shape}</span>`; }
    d.innerHTML=v+extra+(this.showCoord?`<span class="coord">${x},${y}</span>`:'');
    this.boardEl.appendChild(d); row.push(d);
  } this.cells.push(row); }
  this.drawSel();
  this.pairs=ps.cnt;
  if(this.opts.onChange) this.opts.onChange(this);
};
Board.prototype.drawSel=function(){
  const s=this.sel;
  if(!s){this.selEl.style.display='none';return;}
  const p=this.cellPos(s.x,s.y), w=s.n*this.cs+(s.n-1)*this.gap;
  Object.assign(this.selEl.style,{display:'block',left:(p.left-4)+'px',top:(p.top-4)+'px',width:(w+8)+'px',height:(w+8)+'px'});
  this.selEl.querySelector('.lbl').textContent=t('sel_label',{n:s.n,x:s.x,y:s.y});
  this.selEl.querySelector('.lbl').style.display=this.opts.hideLabel?'none':'';
};
Board.prototype.setSel=function(x,y,n){
  n=Math.max(2,Math.min(this.S,n));
  x=Math.max(0,Math.min(this.S-n,x)); y=Math.max(0,Math.min(this.S-n,y));
  this.sel={x,y,n}; this.drawSel();
  if(this.opts.onSel) this.opts.onSel(this.sel);
};
Board.prototype.hit=function(e){
  const r=this.boardEl.getBoundingClientRect();
  const x=Math.floor((e.clientX-r.left-this.gap/2)/(this.cs+this.gap));
  const y=Math.floor((e.clientY-r.top-this.gap/2)/(this.cs+this.gap));
  return [Math.max(0,Math.min(this.S-1,x)),Math.max(0,Math.min(this.S-1,y))];
};
Board.prototype.bindInput=function(){
  let start=null, moved=false;
  this.wrap.addEventListener('pointerdown',e=>{
    if(this.busy) return; e.preventDefault();
    this.wrap.setPointerCapture(e.pointerId);
    start=this.hit(e); moved=false;
  });
  this.wrap.addEventListener('pointermove',e=>{
    if(!start||this.busy) return;
    const [x,y]=this.hit(e);
    if(x===start[0]&&y===start[1]&&!moved) return;
    moved=true;
    const dx=x-start[0], dy=y-start[1];
    const n=Math.max(2,Math.max(Math.abs(dx),Math.abs(dy))+1);
    const ox= dx<0? start[0]-n+1 : start[0];
    const oy= dy<0? start[1]-n+1 : start[1];
    this.setSel(ox,oy,n);
  });
  const end=e=>{
    if(!start) return;
    if(!moved){
      const n=this.sel?this.sel.n:2;
      this.setSel(start[0],start[1],n);
      this.blinkPartner(start[0],start[1]);
    }
    start=null;
  };
  this.wrap.addEventListener('pointerup',end);
  this.wrap.addEventListener('pointercancel',()=>{start=null;});
};
Board.prototype.blinkPartner=function(x,y){
  const v=this.field[y][x];
  for(let yy=0;yy<this.S;yy++)for(let xx=0;xx<this.S;xx++)
    if(this.field[yy][xx]===v){const c=this.cells[yy][xx]; c.classList.remove('blink'); void c.offsetWidth; c.classList.add('blink');}
};
Board.prototype.doRotate=function(cb){
  if(!this.sel||this.busy) return;
  this.busy=true; const gen=this.gen=(this.gen||0)+1;
  const {x,y,n}=this.sel, before=pairSet(this.field).cnt;
  const p=this.cellPos(x,y), w=n*this.cs+(n-1)*this.gap;
  const ov=document.createElement('div'); ov.className='rot';
  Object.assign(ov.style,{left:p.left+'px',top:p.top+'px',width:w+'px',height:w+'px',gridTemplateColumns:`repeat(${n},${this.cs}px)`});
  for(let r=0;r<n;r++)for(let c=0;c<n;c++){
    const src=this.cells[y+r][x+c], d=src.cloneNode(true); d.classList.remove('blink'); ov.appendChild(d);
    src.style.visibility='hidden';
  }
  this.wrap.appendChild(ov);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ov.style.transform='rotate(90deg)';}));
  setTimeout(()=>{
    ov.remove(); this.busy=false;
    if(gen!==this.gen) return;          // とちゅうで 盤面が かわった
    this.field=rotate(this.field,x,y,n); this.render();
    const after=this.pairs;
    if(after>before) this.fx('💞 +'+(after-before));
    else if(after<before) this.fx('💔 −'+(before-after));
    cb&&cb(before,after);
  },480);
};
Board.prototype.fx=function(t){
  const s=this.sel; if(!s) return;
  const p=this.cellPos(s.x,s.y);
  const d=document.createElement('div'); d.className='pairfx'; d.textContent=t;
  d.style.left=(p.left+(s.n*this.cs)/2-24)+'px'; d.style.top=(p.top-10)+'px';
  this.wrap.appendChild(d); setTimeout(()=>d.remove(),900);
};
Board.prototype.setField=function(f){this.gen=(this.gen||0)+1; this.busy=false; this.wrap.querySelectorAll('.rot').forEach(e=>e.remove()); this.field=clone(f); this.render();};

