
/* ============ 第35回「シン・よみがえれ世界遺産」：ルール ============ */
// 型抜き：抜き型の 1 のセルのピースを抜く → 残りを指定方向に寄せる → 空いた所に抜いたピースを元の並びで戻す
// s: 0=上, 1=下, 2=左, 3=右。抜き型ははみ出してもよい（はみ出た部分は何もしない）
function katanuki(board,cells,px,py,s){
  const H=board.length, W=board[0].length, b=board.map(r=>r.slice());
  const dh=cells.length, dw=cells[0].length;
  const hit=(x,y)=>{ const dx=x-px, dy=y-py; return dy>=0&&dy<dh&&dx>=0&&dx<dw&&cells[dy][dx]===1; };
  if(s>=2){
    for(let y=0;y<H;y++){ if(y<py||y>=py+dh) continue; const keep=[],out=[]; for(let x=0;x<W;x++) (hit(x,y)?out:keep).push(b[y][x]); if(!out.length) continue; b[y]= s===2? keep.concat(out) : out.concat(keep); }
  } else {
    for(let x=0;x<W;x++){ if(x<px||x>=px+dw) continue; const keep=[],out=[]; for(let y=0;y<H;y++) (hit(x,y)?out:keep).push(b[y][x]); if(!out.length) continue; const col= s===0? keep.concat(out) : out.concat(keep); for(let y=0;y<H;y++) b[y][x]=col[y]; }
  }
  return b;
}
// 抜き型がボードに1マスでも重なっているか
function dieOverlaps(W,H,die,x,y){ return x+die.w>0 && y+die.h>0 && x<W && y<H; }

/* ---- 抜き型（定型抜き型は公式の番号づけ：0=1×1、以後 大きさ2,4,8,… の Ⅰ・Ⅱ・Ⅲ） ---- */
function makeFixedDie(p){
  if(p===0) return {p:0,w:1,h:1,type:1,cells:[[1]]};
  const k=Math.floor((p-1)/3)+1, t=(p-1)%3+1, n=2**k;
  const cells=Array.from({length:n},(_,y)=>Array.from({length:n},(_,x)=> t===1?1 : t===2?(y%2===0?1:0) : (x%2===0?1:0)));
  return {p,w:n,h:n,type:t,cells};
}
const KFIXED_MAX=9;                 // 体験版は 大きさ 8（7〜9番）まで
function kDiesFor(general){ const d=[]; for(let p=0;p<=KFIXED_MAX;p++) d.push(makeFixedDie(p)); (general||[]).forEach(g=>d.push(g)); return d; }
function dieByP(dies,p){ return dies.find(d=>d.p===p); }
function typeIdie(k){ return k===0?0:1+3*(k-1); }   // 大きさ 2^k の タイプⅠ

/* ---- 問題 ---- */
// 募集要項 図4 の例（6×4、一般抜き型 25・26）
const K_SAMPLE={W:6,H:4,
  start:['220103','213033','022103','322033'].map(r=>[...r].map(Number)),
  goal:['000000','111222','222233','333333'].map(r=>[...r].map(Number)),
  general:[{p:25,w:4,h:2,type:0,cells:[[0,1,1,1],[1,0,0,1]]},{p:26,w:2,h:2,type:0,cells:[[1,0],[0,1]]}]};
// 募集要項 図1・図2 のボードと抜き型（型抜きのデモ用）
const K_FIG1={board:[[1,0,1,1,2,2,1],[2,3,1,1,0,0,2],[3,0,2,1,1,1,1],[3,0,0,2,2,3,1],[2,2,3,2,0,2,2],[3,3,1,0,3,2,3]],
  die:{p:25,w:3,h:3,type:0,cells:[[0,1,0],[1,0,1],[1,1,0]]}};
function rnd(n){ return Math.floor(Math.random()*n); }
function countsOK(g){ const W=g[0].length,H=g.length,c=[0,0,0,0]; g.flat().forEach(v=>c[v]++); return c.every(n=>n>=Math.ceil(W*H*0.1)); }
function kGoalPattern(W,H){
  const pats=[
    ()=>{ const vals=[]; const c=[0,0,0,0]; for(let i=0;i<W*H;i++) vals.push(rnd(4)); vals.sort((a,b)=>a-b); return Array.from({length:H},(_,y)=>vals.slice(y*W,(y+1)*W)); },   // 図4 のような だんだん
    ()=>Array.from({length:H},(_,y)=>Array.from({length:W},(_,x)=> Math.min(3,Math.floor((x+y)*4/(W+H-1))))),   // ななめ
    ()=>Array.from({length:H},(_,y)=>Array.from({length:W},(_,x)=> (Math.floor(x/2)+2*Math.floor(y/2))%4)),        // 2×2 の もよう
    ()=>Array.from({length:H},(_,y)=>Array.from({length:W},(_,x)=> Math.min(x,y,W-1-x,H-1-y)%4 ))                     // わく
  ];
  for(let tries=0;tries<40;tries++){ const g=pats[rnd(pats.length)](); if(countsOK(g)) return g; }
  return pats[2]();
}
function kRandomGeneral(){
  const make=(p)=>{ for(;;){ const w=2+rnd(2),h=2+rnd(2); const cells=Array.from({length:h},()=>Array.from({length:w},()=>rnd(2))); if(cells.flat().some(v=>v)) return {p,w,h,type:0,cells}; } };
  return [make(25),make(26)];
}
function kMakeProblem(S,level){
  if(level==='sample') return {W:K_SAMPLE.W,H:K_SAMPLE.H,start:clone(K_SAMPLE.start),goal:clone(K_SAMPLE.goal),dies:kDiesFor(K_SAMPLE.general)};
  const W=S,H=S, goal=kGoalPattern(W,H), general=kRandomGeneral(), dies=kDiesFor(general);
  let start;
  if(level==='hard'){ const v=goal.flat(); for(let i=v.length-1;i>0;i--){const j=rnd(i+1);[v[i],v[j]]=[v[j],v[i]];} start=Array.from({length:H},(_,y)=>v.slice(y*W,(y+1)*W)); }
  else {
    const k= level==='easy'?2:5;
    do{ start=clone(goal); for(let i=0;i<k;i++){ const d=dies[rnd(Math.min(dies.length,7))]; const x=rnd(W+d.w-1)-(d.w-1), y=rnd(H+d.h-1)-(d.h-1); start=katanuki(start,d.cells,x,y,rnd(4)); } }
    while(kMiss(start,goal)<Math.min(4,W*H/4));
  }
  return {W,H,start,goal,dies};
}
function kMiss(a,g){ let m=0; for(let y=0;y<g.length;y++) for(let x=0;x<g[0].length;x++) if(a[y][x]!==g[y][x]) m++; return m; }
function kPrefix(a,g){ let n=0; for(let y=0;y<g.length;y++) for(let x=0;x<g[0].length;x++){ if(a[y][x]!==g[y][x]) return n; n++; } return n; }
function kApply(board,dies,op){ return katanuki(board,dieByP(dies,op.p).cells,op.x,op.y,op.s); }
function kReplay(start,dies,ops){ let b=clone(start); ops.forEach(o=>b=kApply(b,dies,o)); return b; }

/* ---- 模範回答：左上から1ピースずつ、すべて1の抜き型で「上に寄せて運び、左に寄せて並べる」 ---- */
const pc=n=>{ let c=0; while(n){ c+=n&1; n>>=1; } return c; };
const pow2steps=d=>{ const r=[]; for(let k=4;k>=0;k--){ while(d>=2**k){ r.push(k); d-=2**k; } } return r; };
// 1マスぶんの手：(x,y) を goal[y][x] にする。そろえ済み（行優先で手前）のマスは動かさない
function kFixCell(b,goal,x,y,dies,push){
  const H=b.length,W=b[0].length, want=goal[y][x];
  if(b[y][x]===want) return true;
  let best=null;
  for(let r=y;r<H;r++) for(let c=0;c<W;c++){
    if(r===y && c<=x) continue; if(b[r][c]!==want) continue;
    const cost= r===y ? pc(c-x) : (c>=x ? pc(r-y)+pc(c-x) : pc(x-c)+pc(r-y));
    if(!best||cost<best.cost) best={c,r,cost};
  }
  if(!best) return false;
  let {c,r}=best;
  const op=(k,ox,oy,s)=>{ const o={p:typeIdie(k),x:ox,y:oy,s}; b=katanuki(b,dieByP(dies,o.p).cells,o.x,o.y,o.s); push(o,b); };
  if(r>y && c<x){ for(const k of pow2steps(x-c)){ op(k,c+1,r,3); c+=2**k; } }        // 右に寄せて 列 x へ
  if(r>y){ for(const k of pow2steps(r-y)){ op(k,c,y,0); r-=2**k; } }                  // 上に寄せて 行 y へ
  if(c>x){ for(const k of pow2steps(c-x)){ op(k,x,y,2); c-=2**k; } }                  // 左に寄せて x へ
  return true;
}
function kSolveRows(start,goal,dies){
  const H=start.length,W=start[0].length; let b=clone(start); const ops=[];
  for(let y=0;y<H;y++) for(let x=0;x<W;x++) kFixCell(b,goal,x,y,dies,(o,nb)=>{ ops.push(o); b=nb; });
  return ops;
}
const tr=m=>m[0].map((_,x)=>m.map(r=>r[x]));
function kModelSolve(start,goal,dies,timeBudget){
  const cands=[];
  cands.push(kSolveRows(start,goal,dies));
  // たて向きでも解いて（ボードを転置）、手数が少ないほうを使う
  const tops=kSolveRows(tr(start),tr(goal),dies).map(o=>({p:o.p,x:o.y,y:o.x,s:[2,3,0,1][o.s]}));
  cands.push(tops);
  // かんたんな問題では、ロボット作戦のほうが短いことがあるので ためす
  const rb=kRobotSolver(start,goal,dies,3); rb.finishNow(timeBudget||800);
  if(kMiss(rb.board,goal)===0) cands.push(rb.ops);
  let best=null;
  for(const ops of cands){ const f=kReplay(start,dies,ops); const m=kMiss(f,goal); if(!best||m<best.miss||(m===best.miss&&ops.length<best.ops.length)) best={ops,board:f,miss:m}; }
  return best;
}

/* ---- ロボット：1手で いちばん ゴールに近づく型抜きを くりかえす ---- */
function kRobotSolver(start,goal,dies,level){
  const H=start.length,W=start[0].length;
  const use=level===1? dies.filter(d=>d.p<=3) : level===2? dies.filter(d=>d.p<=6) : dies;
  const maxMoves={1:Math.round(W*H*0.3),2:Math.round(W*H*0.8),3:W*H*2}[level];
  const st={board:clone(start),ops:[],done:false};
  const score=b=>kMiss(b,goal)*1000-kPrefix(b,goal);
  let cur=score(st.board);
  st.step=function(){
    if(st.done) return;
    let best=null,bs=cur;
    for(const d of use) for(let y=-(d.h-1);y<H;y++) for(let x=-(d.w-1);x<W;x++) for(let s=0;s<4;s++){
      const nb=katanuki(st.board,d.cells,x,y,s), sc=score(nb);
      if(sc<bs){ bs=sc; best={op:{p:d.p,x,y,s},nb}; }
    }
    if(!best){ st.done=true; return; }
    st.board=best.nb; cur=bs; st.ops.push(best.op);
    if(st.ops.length>=maxMoves || kMiss(st.board,goal)===0) st.done=true;
  };
  st.run=function(cb){ const t=Date.now(); while(!st.done && Date.now()-t<12) st.step(); if(st.done) cb&&cb(); else st.timer=setTimeout(()=>st.run(cb),16); };
  st.finishNow=function(budget){ clearTimeout(st.timer); const t=Date.now(); while(!st.done){ st.step(); if(budget && Date.now()-t>budget) break; } };
  return st;
}
