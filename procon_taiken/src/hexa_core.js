/* ============ 第37回「ヘキサうどん」：しくみ ============ */
// 地形 0:平地 1:山地 2:池 3:道路 ／ 道路の状態 0:順調 1:混雑 2:渋滞
const H_TIME=[2,3,99,1], H_ROADT=[1,2,4], H_FUEL=[1,2,0,2];
function hTime(terr,rs){ return terr===3? H_ROADT[rs||0] : H_TIME[terr]; }
// 方向の 番号は 公式と 同じ：0 左上 1 右上 2 右 3 右下 4 左下 5 左
const HDIR=['NW','NE','E','SE','SW','W'];
// 偶数行（0,2,4…）が 半分 右に ずれた 並び（募集要項 図1・Q&A Q1）
function hNb(W,H,c,d){
  const x=c%W, y=(c-x)/W, ev=y%2===0; let nx=x, ny=y;
  if(d===2) nx=x+1; else if(d===5) nx=x-1;
  else if(d===0){ ny=y-1; nx=ev?x:x-1; } else if(d===1){ ny=y-1; nx=ev?x+1:x; }
  else if(d===3){ ny=y+1; nx=ev?x+1:x; } else { ny=y+1; nx=ev?x:x-1; }
  return (nx<0||ny<0||nx>=W||ny>=H)? -1 : ny*W+nx;
}
function hDirTo(W,H,a,b){ for(let d=0;d<6;d++) if(hNb(W,H,a,d)===b) return d; return -1; }
function hCube(W,c){ const x=c%W, y=(c-x)/W, q=x-(y+(y&1))/2; return [q,y,-q-y]; }
function hDist(W,a,b){ const A=hCube(W,a),B=hCube(W,b); return Math.max(Math.abs(A[0]-B[0]),Math.abs(A[1]-B[1]),Math.abs(A[2]-B[2])); }
function hRng(seed){ let a=seed>>>0; return ()=>{ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }

const H_LEVEL={easy:{kinds:3,days:3,agents:3},mid:{kinds:4,days:3,agents:4},hard:{kinds:5,days:4,agents:4}};
const H_SIZE={8:{steps:20,per:2},10:{steps:24,per:2},12:{steps:28,per:2}};

/* ---- 問題（マップ）を つくる ---- */
function hMakeProblem(S,lv,seed){
  seed=seed||(1000+Math.floor(Math.random()*9000));
  const L=H_LEVEL[lv]||H_LEVEL.mid, Z=H_SIZE[S]||H_SIZE[10];
  const R=hRng(seed*7919+S*131+({easy:1,mid:2,hard:3}[lv]||2));
  const W=S,H=S,N=W*H, terr=new Array(N).fill(0), ri=n=>Math.floor(R()*n);
  const blob=(type,count,size)=>{ for(let k=0;k<count;k++){ let c=ri(N); for(let i=0;i<size;i++){ terr[c]=type; const n=hNb(W,H,c,ri(6)); if(n>=0) c=n; } } };
  blob(1,Math.round(N/26),5); blob(2,Math.round(N/36),4);
  // 道路：横に 1〜2本、たてに 1本（まっすぐ）
  const rows=[1+ri(Math.floor(H/2)-1)]; if(S>=10) rows.push(Math.floor(H/2)+1+ri(Math.floor(H/2)-2));
  rows.forEach(r=>{ for(let x=0;x<W;x++) terr[r*W+x]=3; });
  let c=Math.floor(W/3)+ri(Math.ceil(W/3)); for(let y=0;y<H;y++){ terr[y*W+(c%W)]=3; }
  // 通れる セルを ぜんぶ つなげる
  for(let guard=0;guard<50;guard++){
    const start=terr.findIndex(v=>v!==2), seen=new Uint8Array(N), q=[start]; seen[start]=1;
    while(q.length){ const a=q.pop(); for(let d=0;d<6;d++){ const b=hNb(W,H,a,d); if(b>=0&&!seen[b]&&terr[b]!==2){ seen[b]=1; q.push(b); } } }
    const lost=[]; for(let i=0;i<N;i++) if(terr[i]!==2&&!seen[i]) lost.push(i);
    if(!lost.length) break;
    let fixed=false;
    for(let i=0;i<N&&!fixed;i++) if(terr[i]===2){ let toSeen=false,toLost=false; for(let d=0;d<6;d++){ const b=hNb(W,H,i,d); if(b<0) continue; if(seen[b]) toSeen=true; else if(terr[b]!==2) toLost=true; } if(toSeen&&toLost){ terr[i]=0; fixed=true; } }
    if(!fixed) lost.forEach(i=>terr[i]=2);
  }
  // スタート地点：まんなかに 近い 平地
  const mid=Math.floor(H/2)*W+Math.floor(W/2), plains=[]; for(let i=0;i<N;i++) if(terr[i]===0) plains.push(i);
  plains.sort((a,b)=>hDist(W,a,mid)-hDist(W,b,mid));
  const starts=plains.slice(0,L.agents);
  // スポット：平地に、なるべく はなして
  const cand=plains.filter(i=>!starts.includes(i)&&hDist(W,i,mid)>=2).sort(()=>R()-0.5);
  const spots=[], nSpot=Math.max(L.agents,Math.min(L.kinds*Z.per,Math.max(W,H)));
  for(const minD of [3,2,1]){ for(const i of cand){ if(spots.length>=nSpot) break; if(spots.some(s=>hDist(W,s.c,i)<minD)) continue; spots.push({c:i}); } if(spots.length>=nSpot) break; }
  spots.forEach((s,k)=>{ s.kind=k%L.kinds; s.max=Math.min(L.agents,1+(R()<0.35?1:0)); });
  const steps=Array.from({length:L.days},(_,d)=>Z.steps+[0,2,-2,0][d%4]);
  return {seed,lv,S,W,H,N,terr,spots,starts,kinds:L.kinds,days:L.days,agents:L.agents,steps,fuelMax:steps[0],congest:3,jam:6};
}
function hSpotAt(P){ if(!P._sa){ P._sa=new Array(P.N).fill(-1); P.spots.forEach((s,i)=>P._sa[s.c]=i); } return P._sa; }

/* ---- いちばん 早く 着く 道（出発する セルの 地形で 時間が きまる） ---- */
function hDijkstra(P,roads,from){
  const N=P.N, dist=new Array(N).fill(Infinity), fuel=new Array(N).fill(0), prev=new Array(N).fill(-1), done=new Uint8Array(N);
  dist[from]=0;
  for(;;){
    let a=-1,best=Infinity; for(let i=0;i<N;i++) if(!done[i]&&dist[i]<best){ best=dist[i]; a=i; }
    if(a<0) break; done[a]=1;
    const tt=hTime(P.terr[a],roads[a]), ff=H_FUEL[P.terr[a]];
    for(let d=0;d<6;d++){ const b=hNb(P.W,P.H,a,d); if(b<0||P.terr[b]===2) continue;
      const nd=dist[a]+tt+ (fuel[a]+ff)*0.001;
      if(nd<dist[b]){ dist[b]=nd; fuel[b]=fuel[a]+ff; prev[b]=a; } }
  }
  for(let i=0;i<N;i++) if(dist[i]<Infinity) dist[i]=Math.round(dist[i]-fuel[i]*0.001);
  return {dist,fuel,prev};
}
function hPath(D,to){ const p=[]; let c=to; while(c>=0&&D.prev[c]>=0){ p.push(c); c=D.prev[c]; } return p.reverse(); }

/* ---- 1チームの 1日を 動かす（decide が 行動を きめる） ---- */
// st = {agents:[{type:'p'|'s',pos,fuel}], stock:[], kinds:Set(試合で とった 種類)}
// 公式の 順番：0ステップ目は アクションのみ。1〜N ステップ目は 反映フェーズ
//   （燃料の消費 → 移動の反映 → うどんの獲得 → 燃料の補給 → 交通量の更新）の あと アクション。最終ステップは 反映のみ。
function hRunTeam(P,day,roads,st,decide){
  const S=P.steps[day], sa=hSpotAt(P), A=st.agents.map(a=>({...a,cur:a.pos,res:null,busy:0,stop:false}));
  const stock=st.stock.slice(), taken=A.map(()=>new Set()), acts=A.map(()=>[]), invalid=A.map(()=>-1);
  const moves=[], events=[], stays=new Array(P.N).fill(0), todayKinds=new Set();
  const ctx={P,day,roads,S,A,stock,taken,todayKinds,kinds:st.kinds,t:0,mem:{}};
  for(let t=0;t<=S;t++){
    ctx.t=t;
    if(t>=1){
      A.forEach((a,i)=>{ if(a.res&&a.res.at===t){                                                             // 消費 → 移動
        if(a.type==='p'&&a.fuel<a.res.need){ a.stop=true; a.why='fuel'; invalid[i]=a.res.k; acts[i].length=a.res.k; moves.splice(moves.indexOf(a.res.mv),1); a.res=null; return; }
        if(a.type==='p') a.fuel-=a.res.need; a.cur=a.res.to; a.res=null; } });
      A.forEach((a,i)=>{ const s=sa[a.cur]; if(a.type==='p'&&s>=0&&!taken[i].has(s)&&stock[s]>0){ stock[s]--; taken[i].add(s); todayKinds.add(P.spots[s].kind); events.push({t,a:i,s,kind:P.spots[s].kind,c:a.cur}); } }); // 獲得（若い番号から）
      A.forEach(a=>{ if(a.type==='p'&&A.some(b=>b.type==='s'&&b.cur===a.cur)) a.fuel=P.fuelMax; });            // 補給
      A.forEach(a=>{ if(P.terr[a.cur]===3) stays[a.cur]++; });                                                 // 交通量
    }
    if(t===S) break;
    A.forEach((a,i)=>{
      if(a.stop||a.busy>t||a.res) return;
      const act=decide(ctx,i);
      if(act===null||act===undefined){ a.stop=true; return; }
      if(act==='w'){ acts[i].push('w'); a.busy=t+1; return; }
      const n=hNb(P.W,P.H,a.cur,act), tt=hTime(P.terr[a.cur],roads[a.cur]), need=a.type==='p'?H_FUEL[P.terr[a.cur]]:0;
      let why=null; if(n<0||P.terr[n]===2) why='pond'; else if(t+tt>S) why='steps';
      if(why){ a.stop=true; invalid[i]=acts[i].length; a.why=why; return; }
      const mv={a:i,from:a.cur,to:n,t0:t,t1:t+tt}; a.res={to:n,at:t+tt,need,k:acts[i].length,mv}; acts[i].push(act); a.busy=t+tt; moves.push(mv);
    });
  }
  const kinds=new Set(st.kinds); todayKinds.forEach(k=>kinds.add(k));
  // 本番の 回答の 形（移動は 0〜5、待機は −n、1日の ステップ数ちょうどに そろえる）
  const out=A.map((a,i)=>{ const r=[]; let w=0, used=0; const mv=moves.filter(m=>m.a===i); let k=0;
    acts[i].forEach(x=>{ if(x==='w'){ w++; used++; } else { if(w){ r.push(-w); w=0; } r.push(x); used+=mv[k].t1-mv[k].t0; k++; } });
    w+=S-used; if(w) r.push(-w); return r; });
  return {st:{agents:A.map(a=>({type:a.type,pos:a.cur,fuel:a.fuel})),stock,kinds},endT:A.map(a=>Math.min(a.busy,S)),acts,out,invalid,why:A.map(a=>a.why||null),moves,events,stays,todayKinds:todayKinds.size,udon:events.length,S};
}
// きまった 行動の ならび（プレイヤーの 計画）で 動かす
function hRunPlan(P,day,roads,st,plans){
  const k=plans.map(()=>0);
  return hRunTeam(P,day,roads,st,(ctx,i)=>{ const p=plans[i]||[]; return k[i]<p.length? p[k[i]++] : null; });
}

/* ---- ロボットの 作戦 ---- */
// 1:よわい（種類を 気にしない・道路の 混み具合を 見ない・補給車なし） 2:ふつう 3:つよい（2つ先まで 考える）
function hRobotTypes(P,level){ const n=P.agents; return Array.from({length:n},(_,i)=> i===n-1?'s':'p'); }
function hRobotDecide(level,jit){
  jit=jit||0;
  if(level===3) return (ctx,i)=>hActGo(ctx,i,true,jit);   // つよい：種類を 分担して いちばん 早く 着く ところへ（道路の 混み具合も 計算）
  return (ctx,i)=>{
    const {P,A,stock,taken,t,S}=ctx, a=A[i], left=S-t, roads=level<3? ZERO_ROADS(P) : ctx.roads;
    const mem=ctx.mem; mem.claim=mem.claim||{}; mem.D=mem.D||{};
    const G=c=>mem.D[c]||(mem.D[c]=hDijkstra(P,roads,c)), D=G(a.cur), sup=A.filter(b=>b.type==='s');
    const value=s=>{ const k=P.spots[s].kind; if(level===1) return 1;
      if(level===3&&P.S<=8&&!ctx.todayKinds.has(k)&&Object.entries(mem.claim).some(([j,v])=>+j!==i&&P.spots[v].kind===k)) return 2; return !ctx.kinds.has(k)&&!ctx.todayKinds.has(k)? 10 : !ctx.todayKinds.has(k)? 5 : 1; };
    const freeStock=s=>level===1? stock[s] : stock[s]-Object.entries(mem.claim).filter(([j,v])=>+j!==i&&v===s).length; // よわい：仲間と 行き先を 分けない
    const real=(D2,c)=>D2.dist[c];
    const step=c=>{ const p=hPath(D,c); return p.length? hDirTo(P.W,P.H,a.cur,p[0]) : 'w'; };
    if(a.type==='p'){
      delete mem.claim[i];
      let best=null,bs=-1e9;
      P.spots.forEach((sp,s)=>{
        if(taken[i].has(s)||freeStock(s)<=0) return;
        const tm=real(D,sp.c), fu=D.fuel[sp.c]; if(tm>left||fu>a.fuel||tm===Infinity) return;
        let sc=value(s)*12-tm+(jit? ((s*37+jit*101+i*13)%7)*0.7 : 0);
        if(level===3&&P.S<=8){ const D2=G(sp.c); let b2=0; P.spots.forEach((s2,j)=>{ if(j===s||taken[i].has(j)||freeStock(j)<=0) return; const t2=D2.dist[s2.c]; if(tm+t2<=left&&fu+D2.fuel[s2.c]<=a.fuel+ (sup.length?P.fuelMax:0)) b2=Math.max(b2,value(j)*12-t2); }); sc+=b2*0.5; }
        if(sc>bs){ bs=sc; best=s; }
      });
      // 燃料が へってきたら 補給車へ（ふつう・つよい）
      const near=sup.length? sup.reduce((m,b)=>D.dist[b.cur]<D.dist[m.cur]?b:m) : null;
      const low= level>1 && near && a.fuel<=Math.max(2,Math.round(P.fuelMax*0.2)) && D.dist[near.cur]<=6;
      if(best!==null && !low){ mem.claim[i]=best; return step(P.spots[best].c); }
      if(near){ if(near.cur===a.cur) return a.fuel<P.fuelMax? 'w' : (best!==null? step(P.spots[best].c) : 'w');
        const need=H_FUEL[P.terr[a.cur]], tt=hTime(P.terr[a.cur],ctx.roads[a.cur]); if(a.fuel>=need&&t+tt<=S) return step(near.cur); return 'w'; }
      return null;
    }
    // 補給車：燃料の 少ない 巡回車に むかう
    const pats=A.map((b,j)=>({b,j})).filter(o=>o.b.type==='p');
    if(!pats.length) return null;
    const tgt=pats.reduce((m,o)=>{ const sc=o.b.fuel*4+D.dist[o.b.cur]; return sc<m.sc?{o,sc}:m; },{o:null,sc:Infinity}).o;
    if(!tgt) return null;
    let goal=tgt.b.cur;
    if(level===9 && tgt.b.fuel>3 && mem.claim[tgt.j]!==undefined) goal=P.spots[mem.claim[tgt.j]].c;
    if(goal===a.cur) return 'w';
    const tt=hTime(P.terr[a.cur],ctx.roads[a.cur]); if(t+tt>S) return 'w';
    return step(goal);
  };
}
// 共通の 動き：まだ 取っていない 種類の いちばん 早く 着く スポットへ（仲間と 種類・スポットを 分ける）／仲間と 合流
function hActMeet(ctx,i){
  const {P,A,t,S}=ctx, a=A[i], mem=ctx.mem; mem.D=mem.D||{};
  const G=c=>mem.D[c]||(mem.D[c]=hDijkstra(P,ctx.roads,c)), D=G(a.cur);
  const others=A.map((b,j)=>j).filter(j=>j!==i&&A[j].type!==a.type); if(!others.length) return 'w';
  const j= a.type==='p'? others.reduce((m,k)=>D.dist[A[k].cur]<D.dist[A[m].cur]?k:m) : others.reduce((m,k)=>A[k].fuel<A[m].fuel?k:m);
  return hStepTo(ctx,i,A[j].cur);
}
function hStepTo(ctx,i,c){
  const {P,A,t,S}=ctx, a=A[i], mem=ctx.mem; mem.D=mem.D||{};
  if(c===a.cur) return 'w';
  if(t+hTime(P.terr[a.cur],ctx.roads[a.cur])>S || (a.type==='p'&&a.fuel<H_FUEL[P.terr[a.cur]])) return 'w';
  const D=mem.D[a.cur]||(mem.D[a.cur]=hDijkstra(P,ctx.roads,a.cur)), p=hPath(D,c);
  return p.length? hDirTo(P.W,P.H,a.cur,p[0]) : 'w';
}
function hActGo(ctx,i,onlyNew,jit){
  const {P,A,stock,taken,t,S}=ctx, a=A[i], mem=ctx.mem; mem.claim=mem.claim||{}; mem.D=mem.D||{};
  if(a.type!=='p') return hActMeet(ctx,i);
  const D=mem.D[a.cur]||(mem.D[a.cur]=hDijkstra(P,ctx.roads,a.cur));
  delete mem.claim[i];
  const claimedKind=new Set(Object.entries(mem.claim).filter(([j])=>+j!==i).map(([,s])=>P.spots[s].kind));
  const free=s=>stock[s]-Object.entries(mem.claim).filter(([j,v])=>+j!==i&&v===s).length;
  let best=null,bs=Infinity;
  for(const pass of onlyNew?[0,1]:[1]){
    P.spots.forEach((sp,s)=>{ if(taken[i].has(s)||free(s)<=0) return; const tm=D.dist[sp.c];
      if(tm===Infinity||tm>S-t||D.fuel[sp.c]>a.fuel) return;
      if(pass===0&&(ctx.todayKinds.has(sp.kind)||claimedKind.has(sp.kind))) return;
      const sc=tm+(jit? ((s*37+jit*101+i*13)%7)*0.45 : 0); if(sc<bs){ bs=sc; best=s; } });
    if(best!==null) break;
  }
  if(best===null) return 'w';
  mem.claim[i]=best; return hStepTo(ctx,i,P.spots[best].c);
}
function ZERO_ROADS(P){ if(!P._z) P._z=new Array(P.N).fill(0); return P._z; }
function hRobotDay(P,day,roads,st,level,jit){ return hRunTeam(P,day,roads,st,hRobotDecide(level,jit)); }

/* ---- 試合ぜんたい ---- */
function hInitTeam(P,types){ return {agents:types.map((ty,i)=>({type:ty,pos:P.starts[i],fuel:P.fuelMax})),stock:P.spots.map(s=>s.max),kinds:new Set()}; }
function hRoadStates(P,stayHist,nTeams){
  const r=new Array(P.N).fill(0); if(!stayHist.length) return r;
  const a=stayHist[stayHist.length-1], b=stayHist.length>1? stayHist[stayHist.length-2] : null;
  for(let i=0;i<P.N;i++) if(P.terr[i]===3){ const v=(a[i]+(b?b[i]:0))/nTeams; r[i]= v>=P.jam?2 : v>=P.congest?1 : 0; }
  return r;
}
function hNewDayStock(P,st){ return {...st,stock:P.spots.map(s=>s.max)}; }
// 成績：①種類数 ②日ごとの種類数の合計 ③玉数 ④回答時間の合計
function hScore(days,teamIdx){ const ks=new Set(); let daily=0,udon=0,time=0;
  days.forEach(d=>{ const r=d.res[teamIdx]; r.events.forEach(e=>ks.add(e.kind)); daily+=r.todayKinds; udon+=r.udon; time+=d.time[teamIdx]||0; });
  return {kinds:ks.size,daily,udon,time}; }
function hCompare(a,b){ if(a.kinds!==b.kinds) return [b.kinds-a.kinds,1]; if(a.daily!==b.daily) return [b.daily-a.daily,2]; if(a.udon!==b.udon) return [b.udon-a.udon,3]; if(a.time!==b.time) return [a.time-b.time,4]; return [0,5]; }
// ロボットだけで 1試合（お手本チーム・テスト用）
function hRobotMatch(P,levels){
  const teams=levels.map(l=>hInitTeam(P,hRobotTypes(P,l))), stays=[], days=[];
  for(let d=0;d<P.days;d++){
    const roads=hRoadStates(P,stays,teams.length), start=teams.map(s=>JSON.parse(JSON.stringify({agents:s.agents})));
    const res=teams.map((s,k)=>hRobotDay(P,d,roads,hNewDayStock(P,s),levels[k],k));
    res.forEach((r,k)=>teams[k]=r.st);
    const sum=new Array(P.N).fill(0); res.forEach(r=>r.stays.forEach((v,i)=>sum[i]+=v)); stays.push(sum);
    days.push({roads,start,res,time:levels.map(()=>30)});
  }
  return {days,teams};
}
