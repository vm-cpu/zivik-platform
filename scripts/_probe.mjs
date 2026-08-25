import {geoMercator} from "d3-geo";
import fs from "node:fs";
const g=JSON.parse(fs.readFileSync("/private/tmp/claude-501/-Users-violamartyniuk-Zivik/c244870d-d47a-4ec8-b3cf-590542fca1de/scratchpad/ne10m_admin1.geojson","utf8"));
const ua=g.features.filter(f=>String(f.properties.iso_3166_2||"").startsWith("UA-"));
const W=1200,H=460;
const FRAME={type:"MultiPoint",coordinates:[[3,51.5],[19,59.6],[8,48],[40,49],[22,52],[33,44.5],[38.6,48]]};
const proj=geoMercator().fitExtent([[34,28],[W-34,H-30]],FRAME);

const rings=[];
for(const f of ua){
  const polys=f.geometry.type==="Polygon"?[f.geometry.coordinates]:f.geometry.coordinates;
  for(const poly of polys) for(const ring of poly) rings.push(ring);
}
const k=(p)=>p[0].toFixed(6)+","+p[1].toFixed(6);
const ekey=(a,b)=>a<b?a+"|"+b:b+"|"+a;
const count=new Map();
for(const ring of rings) for(let i=0;i+1<ring.length;i++) {const key=ekey(k(ring[i]),k(ring[i+1]));count.set(key,(count.get(key)||0)+1);}

// collect internal edges as adjacency, chain them
const nodes=new Map(); // key -> {pt, nbrs:Set}
const seen=new Set();
const addEdge=(a,b,pa,pb)=>{
  if(!nodes.has(a))nodes.set(a,{pt:pa,nbrs:new Set()});
  if(!nodes.has(b))nodes.set(b,{pt:pb,nbrs:new Set()});
  nodes.get(a).nbrs.add(b);nodes.get(b).nbrs.add(a);
};
for(const ring of rings) for(let i=0;i+1<ring.length;i++){
  const a=k(ring[i]),b=k(ring[i+1]);const key=ekey(a,b);
  if(count.get(key)!==2||seen.has(key))continue;
  seen.add(key);addEdge(a,b,ring[i],ring[i+1]);
}
console.log("internal edges",seen.size,"nodes",nodes.size);
const deg=new Map();for(const [key,n] of nodes) deg.set(key,n.nbrs.size);
let d1=0,d2=0,d3=0;for(const v of deg.values()){if(v===1)d1++;else if(v===2)d2++;else d3++;}
console.log("deg1",d1,"deg2",d2,"deg3+",d3);

// chain: walk from junction/endpoints (deg!=2) then remaining loops
const used=new Set();
const chains=[];
const walkFrom=(start)=>{
  for(const first of nodes.get(start).nbrs){
    const key=ekey(start,first);
    if(used.has(key))continue;
    used.add(key);
    const chain=[nodes.get(start).pt,nodes.get(first).pt];
    let prev=start,cur=first;
    while(nodes.get(cur).nbrs.size===2){
      const nxt=[...nodes.get(cur).nbrs].find(x=>x!==prev);
      if(nxt===undefined)break;
      const kk=ekey(cur,nxt);
      if(used.has(kk))break;
      used.add(kk);chain.push(nodes.get(nxt).pt);prev=cur;cur=nxt;
    }
    chains.push(chain);
  }
};
for(const [key,n] of nodes) if(n.nbrs.size!==2) walkFrom(key);
for(const [key,n] of nodes) walkFrom(key);
console.log("chains",chains.length,"points",chains.reduce((a,c)=>a+c.length,0));

// project
const pchains=chains.map(c=>c.map(p=>proj(p)));
// Douglas-Peucker
function dp(pts,tol){
  if(pts.length<3)return pts;
  const keep=new Uint8Array(pts.length);keep[0]=1;keep[pts.length-1]=1;
  const stack=[[0,pts.length-1]];
  while(stack.length){
    const [i,j]=stack.pop();
    if(j<=i+1)continue;
    const [x1,y1]=pts[i],[x2,y2]=pts[j];
    const dx=x2-x1,dy=y2-y1;const len2=dx*dx+dy*dy;
    let best=-1,bi=-1;
    for(let m=i+1;m<j;m++){
      const [px,py]=pts[m];
      let d;
      if(len2===0)d=Math.hypot(px-x1,py-y1);
      else{let t=((px-x1)*dx+(py-y1)*dy)/len2;t=Math.max(0,Math.min(1,t));d=Math.hypot(px-(x1+t*dx),py-(y1+t*dy));}
      if(d>best){best=d;bi=m;}
    }
    if(best>tol){keep[bi]=1;stack.push([i,bi],[bi,j]);}
  }
  return pts.filter((_,i)=>keep[i]);
}
const r=(n)=>Math.round(n*10)/10;
for(const tol of [0.2,0.3,0.4,0.5,0.7,1.0]){
  let d="",pts=0;
  for(const c of pchains){
    let s=dp(c,tol).map(p=>[r(p[0]),r(p[1])]);
    // dedupe consecutive
    s=s.filter((p,i)=>i===0||p[0]!==s[i-1][0]||p[1]!==s[i-1][1]);
    if(s.length<2)continue;
    pts+=s.length;
    d+="M"+s.map(p=>p[0]+","+p[1]).join("L");
  }
  console.log("tol",tol,"points",pts,"chars",d.length);
}
