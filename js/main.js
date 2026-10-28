/* MATE & HomeChef showcase — main script */
const SITE_URL=''; // optional: put your hosted site URL here (e.g. https://name.github.io/site/) so the QR codes work
const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const cl=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),lp=(a,b,t)=>a+(b-a)*t,ss=t=>t*t*(3-2*t),TAU=Math.PI*2;

/* ---------- loader ---------- */
let ready=false,prog=0,appearT=0;
const L=$('#loader'),lc=$('#lc');
const lt=setInterval(()=>{prog=Math.min(ready?100:92,prog+(ready?7:Math.random()*4));lc.textContent=Math.round(prog);
  if(prog>=100){clearInterval(lt);setTimeout(()=>{L.classList.add('done');document.body.classList.remove('loading');appearT=1},250)}},50);
setTimeout(()=>ready=true,10000);

/* ---------- menu ---------- */
const mb=$('#menuB'),mn=$('#menu');
$$('a',mn).forEach((a,i)=>{a.style.setProperty('--i',i);a.onclick=()=>tg(false)});
function tg(s){mn.classList.toggle('on',s);mb.classList.toggle('x',s)}
mb.onclick=()=>tg(!mn.classList.contains('on'));

/* ---------- headline words, themes, reveals ---------- */
$$('.copy h2,.meet h2,.vid h2,.aud h2,.apps h2,.more h2,.about h2,.faq h2,.dl h2,.tech h2').forEach(h=>{let i=0;
  const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w))f.append(' ');else{const o=document.createElement('span');o.className='w';o.innerHTML=`<span style="--wi:${i++}">${w}</span>`;f.append(o)}});c.replaceWith(f)}else if(c.nodeType===1&&c.tagName!=='BR')walk(c)})};walk(h)});
const th=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;document.body.classList.remove('t-mate','t-hc');document.body.classList.add('t-'+e.target.dataset.theme)}),{rootMargin:'-45% 0px -45% 0px'});
$$('[data-theme]').forEach(s=>th.observe(s));
const io=new IntersectionObserver(es=>es.forEach(en=>{
  if(!en.isIntersecting)return;en.target.classList.add('in');io.unobserve(en.target);
  const ns=en.target.classList.contains('num')?[en.target]:$$('.num',en.target);
  ns.forEach(n=>{if(n._d)return;n._d=1;const to=+n.dataset.to,dec=+n.dataset.dec,t0=performance.now();
    (function f(t){const p=Math.min((t-t0)/1700,1);n.textContent=(to*(1-Math.pow(1-p,3))).toFixed(dec);if(p<1)requestAnimationFrame(f)})(t0)});
}),{threshold:.2});
$$('.rv').forEach((e,i)=>{e.style.transitionDelay=(i%3)*90+'ms';io.observe(e)});$$('.num').forEach(n=>io.observe(n));

/* ---------- tilt + magnetic + glow ---------- */
$$('.tilt').forEach(c=>{c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  c.style.transition='transform .1s';c.style.transform=`perspective(900px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-6px)`});
  c.addEventListener('pointerleave',()=>{c.style.transition='transform .6s';c.style.transform=''})});
function magnets(){$$('.magnet').forEach(b=>{if(b._m)return;b._m=1;
  b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px,${(e.clientY-r.top-r.height/2)*.28}px)`});
  b.addEventListener('pointerleave',()=>b.style.transform='')})}
magnets();
let PX=-999,PY=-999;
addEventListener('pointermove',e=>{PX=e.clientX;PY=e.clientY;const g=$('#glow');g.style.left=PX+'px';g.style.top=PY+'px'});

/* ---------- FAQ (fade + slide) ---------- */
const closeQ=q=>{q.classList.remove('show');setTimeout(()=>q.classList.remove('open'),380)};
$$('.q').forEach(q=>$('button',q).onclick=()=>{
  if(q.classList.contains('open')&&q.classList.contains('show'))return closeQ(q);
  $$('.q.open').forEach(o=>o!==q&&closeQ(o));
  q.classList.add('open');setTimeout(()=>q.classList.add('show'),140)});

/* ---------- language demo ---------- */
const T={en:'What should I cook today?',ms:'Apa yang saya patut masak hari ini?'},demo=$('#demo');
$$('.lang button').forEach(b=>b.onclick=()=>{$$('.lang button').forEach(x=>x.classList.toggle('on',x===b));demo.style.opacity=0;setTimeout(()=>{demo.textContent=T[b.dataset.l];demo.style.opacity=1},220)});

/* ---------- video frames (blank until videos exist) ---------- */
$$('.vframe').forEach(f=>{const v=$('video',f),b=$('.play',f);
  v.addEventListener('loadedmetadata',()=>f.classList.add('ready'));v.addEventListener('error',()=>f.classList.remove('ready'));
  b.onclick=()=>{f.classList.add('playing');v.controls=true;v.play().catch(()=>{})};
  v.addEventListener('ended',()=>{f.classList.remove('playing');v.controls=false})});
const vf=$$('.vframe');

/* ---------- geometry cache (document coordinates, so nothing is measured while scrolling) ---------- */
const G={vw:0,vh:0,ok:false};
const aud=$('#aud'),rail=$('#rail'),cards=$$('#rail article');
const docPos=el=>{let x=0,y=0,o=el;while(o){x+=o.offsetLeft;y+=o.offsetTop;o=o.offsetParent}return{x,y,w:el.offsetWidth,h:el.offsetHeight}};
const inPin=(el,root)=>{let x=0,y=0,o=el;while(o&&o!==root){x+=o.offsetLeft;y+=o.offsetTop;o=o.offsetParent}return{x,y}};
function measure(){
  const vw=innerWidth,vh=innerHeight;G.vw=vw;G.vh=vh;
  /* pinned horizontal scroll size */
  rail.style.transform='none';rail._t=null;
  const tw=Math.max(0,rail.scrollWidth-vw),hh=(vh+tw)+'px';if(aud.style.height!==hh)aud.style.height=hh;
  const ap=docPos(aud);G.aud={top:ap.y,h:aud.offsetHeight,tw,cx:cards.map(c=>{const r=c.getBoundingClientRect();return r.left+r.width/2})};
  const slot=n=>$(`[data-slot="${n}"]`),ctr=n=>{const p=docPos(slot(n));return{x:p.x+p.w/2,y:p.y+p.h/2,h:p.h}};
  G.meet=ctr('meet');G.viewer=ctr('viewer');G.o1=ctr('oMate');G.o2=ctr('oHc');
  /* pinned stops: s = scroll where the section locks, e = scroll where it lets go; x/y = phone centre while locked (viewport coords) */
  const pin=(id,n)=>{const sec=$('#'+id),inn=$('.pin-in',sec),sl=slot(n),rel=inPin(sl,inn);
    return{s:docPos(sec).y,e:docPos(sec).y+sec.offsetHeight-inn.offsetHeight,x:docPos(inn).x+rel.x+sl.offsetWidth/2,y:rel.y+sl.offsetHeight/2,h:sl.offsetHeight}};
  G.A=pin('mate-s','mate-s');G.B=pin('hc-s','hc-s');
  /* video frames are pinned too: s/e = scroll range where the frame stays put, x/y = its centre on screen while pinned */
  const vid=f=>{const vp=f.closest('.vpin'),vw=$('.vwrap',vp),wh=vw.offsetHeight,st=Math.max(40,(vh-wh)/2);vw.style.top=st+'px';
    const p=docPos(vp),s=p.y-st;return{s,e:s+(vp.offsetHeight-wh),x:p.x+p.w/2,y:st+wh/2,h:f.offsetHeight*.88,top:p.y}};
  G.V1=vid(vf[0]);G.V2=vid(vf[1]);G.ok=true;
}
let mq=0;const queueMeasure=()=>{if(mq)return;mq=requestAnimationFrame(()=>{mq=0;measure()})};
measure();
addEventListener('resize',queueMeasure);addEventListener('load',queueMeasure);if(document.fonts)document.fonts.ready.then(queueMeasure);
if(window.ResizeObserver)new ResizeObserver(queueMeasure).observe(document.body);

/* ---------- phone story: ONE pure function of scroll, so it scrubs forwards AND backwards ----------
   lock on a section (pin) -> spin to the next stop while scrolling -> lock again.
   Position is exact (glued to the page); only spin / fade are eased in the render loop. */
const eio=t=>{t=cl(t);return t*t*t*(t*(t*6-15)+10)};
function story(Y){
  const vh=G.vh,mid=vh/2,M=G.meet,A=G.A,V1=G.V1,B=G.B,V2=G.V2,m0=M.y-mid;
  const pr=(a,b)=>cl((Y-a)/Math.max(1,b-a));
  /* yaw is absolute (each stop adds one full turn) so scrolling back simply unwinds the spin */
  const pose=(S,ry)=>({x:S.x,y:S.y,h:S.h,ry});
  const PA0=pose(A,TAU-.46),PA1=pose(A,TAU-.16),PV1=pose(V1,2*TAU),PB0=pose(B,3*TAU+.46),PB1=pose(B,3*TAU+.16),PV2=pose(V2,4*TAU);
  const fly=(P,Q,p,xm)=>{const e=eio(p),ex=xm>0?eio((p-.4)/.6):xm<0?eio(p/.6):e;
    return{x:lp(P.x,Q.x,ex),y:lp(P.y,Q.y,e),h:lp(P.h,Q.h,e)*(1+.07*Math.sin(Math.PI*p)),ry:lp(P.ry,Q.ry,e),rx:Math.sin(Math.PI*p)*.12}};
  const u1=pr(V1.s,V1.e),u2=pr(V2.s,V2.e),r={op:1,app:'mate',k:0,k1:ss(cl(u1/.35)),k2:ss(cl(u2/.35))};let o,p;
  if(Y<=m0)o={x:M.x,y:M.y-Y,h:M.h,ry:lp(-.9,0,eio(pr(M.y-M.h/2-vh,m0))),rx:0};                         /* 1 rides on the stage, turning to face you */
  else if(Y<A.s){p=pr(m0,A.s);const d=(A.s-m0)*(1-Math.pow(1-p,4))/4;o=fly({x:M.x,y:mid-d,h:M.h,ry:0},PA0,p,0);r.k=p<.5?0:1}   /* 2 spins to Stop Overspending */
  else if(Y<=A.e){o={...PA0,ry:lp(PA0.ry,PA1.ry,pr(A.s,A.e)),rx:0};r.k=1}                              /* 3 LOCKED on Stop Overspending */
  else if(Y<V1.s){o=fly(PA1,PV1,pr(A.e,V1.s),1);r.k=1}                                                 /* 4 spins to the MATE video */
  else if(Y<=V1.e){o={...PV1,rx:0};r.k=1;                                                              /* 5 LOCKED on the video: dissolves, hides, comes back out */
    if(u1<.35)r.op=1-r.k1;else if(u1<.55)r.op=0;if(u1>=.45){r.app='hc';r.k=0}
    if(u1>=.55){const e=ss(cl((u1-.55)/.37));r.op=e;o.h*=.9+.1*e}}
  else if(Y<B.s){p=pr(V1.e,B.s);o=fly(PV1,PB0,p,-1);r.app='hc';r.k=p<.5?0:1}                           /* 6 spins to Never Wonder */
  else if(Y<=B.e){o={...PB0,ry:lp(PB0.ry,PB1.ry,pr(B.s,B.e)),rx:0};r.app='hc';r.k=1}                   /* 7 LOCKED on Never Wonder */
  else if(Y<V2.s){o=fly(PB1,PV2,pr(B.e,V2.s),1);r.app='hc';r.k=1}                                      /* 8 spins to the HomeChef video */
  else{o={...PV2,rx:0};r.app='hc';r.k=1;r.op=1-r.k2}                                                   /* 9 LOCKED on the video, dissolves into it */
  return Object.assign(r,{x:o.x,y:o.y,h:o.h,ry:o.ry,rx:o.rx||0});
}

/* ---------- DOM that follows scroll (cached geometry, writes only when a value changed) ---------- */
function domFrame(Y,st){
  vf.forEach((f,i)=>{const g=i?G.V2:G.V1,e=ss(cl((G.vh-(g.top-Y))/(G.vh*.75))),tr=`rotateX(${((1-e)*10).toFixed(2)}deg) scale(${(.82+.18*e).toFixed(4)})`;
    if(f._tr!==tr){f.style.transform=tr;f._tr=tr}
    const k=i?st.k2:st.k1,kk=k.toFixed(3);if(f._k!==kk){f.style.setProperty('--vo',kk);f._k=kk;f.classList.toggle('vis',k>.6)}});
  const a=G.aud;if(Y<a.top-G.vh||Y>a.top+a.h)return;
  const p=cl((Y-a.top)/Math.max(1,a.h-G.vh)),tx=-p*a.tw,t='translate3d('+tx.toFixed(2)+'px,0,0)';
  if(rail._t!==t){rail.style.transform=t;rail._t=t}
  cards.forEach((c,i)=>{const d=Math.abs(a.cx[i]+tx-G.vw/2)/G.vw,sc=1-cl(d*.3,0,.12),op=1-cl(d-.3,0,.5)*.9,v=sc.toFixed(3)+'|'+op.toFixed(3);
    if(c._v!==v){c._v=v;c.style.transform=`scale(${sc.toFixed(3)})`;c.style.opacity=op.toFixed(3)}});
}

/* ---------- single render loop ---------- */
let GLF=null,lastT=performance.now(),loopErr=0;
function loop(t){requestAnimationFrame(loop);const dt=Math.min(Math.max((t-lastT)/1000,0.001),.25);lastT=t;
  if(!G.ok)return;
  try{const Y=scrollY,st=story(Y);domFrame(Y,st);if(GLF)GLF(Y,dt,st)}
  catch(e){if(!loopErr++)console.error(e)}}
requestAnimationFrame(loop);

/* ---------- music ---------- */
(function(){
  const au=$('#aud-el'),mu=$('#music'),btn=$('#mbtn'),pp=$('#pp'),rw=$('#rw'),ff=$('#ff'),bar=$('#mbar'),pf=$('#pf'),tc=$('#tc'),td=$('#td');
  const fmt=s=>{s=Math.max(0,Math.floor(s||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
  let ht,pt='mouse';btn.addEventListener('pointerdown',e=>pt=e.pointerType);
  const toggle=()=>au.paused?au.play().catch(()=>{}):au.pause();
  btn.onclick=()=>{btn.classList.remove('pop');void btn.offsetWidth;btn.classList.add('pop');if(pt!=='mouse'&&!mu.classList.contains('open')){mu.classList.add('open');return}toggle()};
  pp.onclick=toggle;
  const nudge=(b,d)=>{b.classList.remove('spin');void b.offsetWidth;b.classList.add('spin');au.currentTime=cl(au.currentTime+d,0,(au.duration||1e9)-.2)};
  rw.onclick=()=>nudge(rw,-10);ff.onclick=()=>nudge(ff,10);
  au.addEventListener('play',()=>mu.classList.add('playing'));au.addEventListener('pause',()=>mu.classList.remove('playing'));
  const upd=()=>{const d=au.duration||0;pf.style.width=d?(au.currentTime/d*100)+'%':'0';tc.textContent=fmt(au.currentTime);td.textContent='-'+fmt(d-au.currentTime)};
  au.addEventListener('timeupdate',upd);au.addEventListener('loadedmetadata',upd);
  bar.onclick=e=>{const r=bar.getBoundingClientRect();if(au.duration)au.currentTime=cl((e.clientX-r.left)/r.width)*au.duration};
  mu.addEventListener('pointerenter',e=>{if(e.pointerType!=='mouse')return;clearTimeout(ht);mu.classList.add('open')});
  mu.addEventListener('pointerleave',e=>{if(e.pointerType!=='mouse')return;ht=setTimeout(()=>mu.classList.remove('open'),350)});
  document.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'&&!mu.contains(e.target))mu.classList.remove('open')});
})();

/* ---------- QR codes ---------- */
$$('.qrc').forEach(el=>{
  const base=SITE_URL||(location.protocol.startsWith('http')?location.href.split('#')[0].replace(/[^/]*$/,''):'');
  if(!base||typeof qrcode==='undefined'){el.classList.add('off');el.textContent='QR shows when hosted online';return}
  const q=qrcode(0,'M');q.addData(base+el.dataset.apk);q.make();el.innerHTML=q.createSvgTag({scalable:true,margin:0})});

/* ---------- showcase info ---------- */
const INFO={
mate:{ac:'#a78bfa',name:'MATE',tag:'Money Allocation & Tracking Engine',p:'Log what you spend in two taps, lock savings into goal buckets, and see your month in clear charts.',
 li:['Quick-add expenses with simple categories','Virtual Tabung for laptop, books or emergency funds','Pie charts, progress bars and spending alerts','Works offline. Your data stays on your phone'],dl:'apk/MATE.apk',cls:'violet'},
hc:{ac:'#f5b642',name:'HomeChef',tag:'Cook with what you already have',p:'Tap the ingredients in your kitchen and get recipes that fit, with videos and nutrition included.',
 li:['Smart recipe matches from your ingredients','Browse as a guest, log in only to save','English and Malay at the flip of a switch','Chef video tutorials and a friendly chat helper'],dl:'apk/HomeChef.apk',cls:'gold'}};
const info=$('#info'),tabs=$('#tabs'),dots=$$('#dots b');
function renderInfo(app){const d=INFO[app];info.style.setProperty('--ac',d.ac);info.classList.remove('swap');void info.offsetWidth;info.classList.add('swap');
  info.innerHTML=`<h3>${d.name}</h3><p class="tag">${d.tag}</p><p>${d.p}</p><ul>${d.li.map(l=>`<li>${l}</li>`).join('')}</ul><a class="btn ${d.cls} magnet" href="${d.dl}" download>Download ${d.name}</a>`;magnets()}
renderInfo('mate');
let onTab=()=>{},onDot=()=>{};
$$('button',tabs).forEach(b=>b.onclick=()=>{if(b.classList.contains('on'))return;$$('button',tabs).forEach(x=>x.classList.toggle('on',x===b));tabs.classList.toggle('hc',b.dataset.app==='hc');renderInfo(b.dataset.app);onTab(b.dataset.app)});
dots.forEach((d,k)=>d.onclick=()=>onDot(k));

/* ======================= 3D iPhone (WebGL) ======================= */
try{initGL()}catch(e){console.error(e);ready=true}
function initGL(){
  const cv=$('#gl'),R=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true,powerPreference:'high-performance'});
  R.outputEncoding=THREE.sRGBEncoding;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.15;R.setClearColor(0,0);
  const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(30,1,10,20000);let VW,VH;
  let PR=Math.min(devicePixelRatio||1,innerWidth<900?1.5:2);
  function size(){VW=innerWidth;VH=innerHeight;R.setPixelRatio(PR);R.setSize(VW,VH,false);cv.style.width=VW+'px';cv.style.height=VH+'px';
    cam.aspect=VW/VH;cam.position.z=(VH/2)/Math.tan(THREE.MathUtils.degToRad(cam.fov/2));cam.far=cam.position.z*4;cam.updateProjectionMatrix()}
  size();addEventListener('resize',size);
  /* studio environment for the titanium reflections */
  const es=new THREE.Scene(),panel=(c,i,w,h,x,y,z)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color(c).multiplyScalar(i),side:THREE.DoubleSide}));m.position.set(x,y,z);m.lookAt(0,0,0);es.add(m)};
  es.background=new THREE.Color(0x07060c);panel(0xffffff,7,14,3,0,9,6);panel(0x9b6bff,6,3,16,-10,0,3);panel(0xffb04a,6,3,16,10,0,2);panel(0xffffff,3,16,3,0,-9,5);panel(0xffffff,2.5,12,12,0,0,-10);panel(0xffffff,3,6,18,4,0,9);
  const pm=new THREE.PMREMGenerator(R);sc.environment=pm.fromScene(es,.03).texture;
  const dl=new THREE.DirectionalLight(0xffffff,1.4);dl.position.set(300,600,900);sc.add(dl,new THREE.AmbientLight(0xffffff,.3));

  /* screens: real screenshots (embedded so it works from file://) */
  const imgs={};
  const getImg=(app,i)=>imgs[app+i]||(imgs[app+i]=new Promise(res=>{
    const emb=()=>{const e=new Image();e.onload=()=>res(e);e.src=(window.SCREENS&&SCREENS[app][i])||''};
    if(location.protocol==='file:')return emb();
    const im=new Image();im.onload=()=>res(im);im.onerror=emb;im.src=`assets/${app==='hc'?'homechef':'mate'}-${i+1}.png`}));
  const topCol=new WeakMap(),tmp=document.createElement('canvas');tmp.width=tmp.height=1;const tx=tmp.getContext('2d');
  function edge(img){if(topCol.has(img))return topCol.get(img);let c='#101010';try{tx.drawImage(img,0,0,img.width,3,0,0,1,1);const d=tx.getImageData(0,0,1,1).data;c=`rgb(${d[0]},${d[1]},${d[2]})`}catch(e){}topCol.set(img,c);return c}
  function paint(ctx,W,H,a,b,k){
    ctx.globalAlpha=1;ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
    const one=(img,al)=>{if(!img||!img.width)return;const s=W/img.width,h=img.height*s,y=h<H?H-h:0;ctx.globalAlpha=al;
      if(y>0){ctx.fillStyle=edge(img);ctx.fillRect(0,0,W,y+2)}ctx.drawImage(img,0,y,W,h);ctx.globalAlpha=1};
    one(a,1);if(b)one(b,k);
    ctx.fillStyle='#fff';ctx.font=`700 ${W*.04}px Manrope,system-ui,sans-serif`;ctx.textBaseline='middle';ctx.textAlign='left';ctx.fillText('9:41',W*.1,H*.0285);
    ctx.fillStyle='#fff';ctx.globalAlpha=.95;[0,1,2,3].forEach(i=>{ctx.beginPath();ctx.roundRect?ctx.roundRect(W*.7+i*W*.017,H*.0285+W*.012-i*W*.006,W*.011,W*.012+i*W*.006,2):ctx.rect(W*.7+i*W*.017,H*.0285+W*.012-i*W*.006,W*.011,W*.012+i*W*.006);ctx.fill()});
    ctx.strokeStyle='#fff';ctx.globalAlpha=.6;ctx.lineWidth=2.5;ctx.beginPath();ctx.roundRect?ctx.roundRect(W*.805,H*.0285-W*.014,W*.075,W*.028,W*.008):ctx.rect(W*.805,H*.0285-W*.014,W*.075,W*.028);ctx.stroke();
    ctx.globalAlpha=1;ctx.fillStyle='#fff';ctx.beginPath();ctx.roundRect?ctx.roundRect(W*.81,H*.0285-W*.0095,W*.06,W*.019,W*.005):ctx.rect(W*.81,H*.0285-W*.0095,W*.06,W*.019);ctx.fill();
    ctx.fillStyle='#000';ctx.beginPath();const iw=W*.27,ih=H*.0245;ctx.roundRect?ctx.roundRect(W/2-iw/2,H*.0155,iw,ih,ih/2):ctx.rect(W/2-iw/2,H*.0155,iw,ih);ctx.fill()}

  /* ---------- model ---------- */
  const bin=atob(window.IPHONE_B64),u8=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u8[i]=bin.charCodeAt(i);window.IPHONE_B64=null;
  new THREE.GLTFLoader().parse(u8.buffer,'',gltf=>{
    const src=gltf.scene,box=new THREE.Box3().setFromObject(src),sz=box.getSize(new THREE.Vector3()),ctr=box.getCenter(new THREE.Vector3()),K=1/sz.y;
    const SW=16.05,SH=34.8,SR=2.1;
    function roundGeo(w,h,r){const s=new THREE.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);
      const g=new THREE.ShapeGeometry(s,14),p=g.attributes.position,uv=g.attributes.uv;for(let i=0;i<p.count;i++)uv.setXY(i,(p.getX(i)+w/2)/w,(p.getY(i)+h/2)/h);return g}
    const sgeo=roundGeo(SW,SH,SR);
    function makePhone(app,i){
      const root=new THREE.Group(),pivot=new THREE.Group(),holder=new THREE.Group(),inner=src.clone(true),mats=[];let body;
      pivot.rotation.order='YXZ';inner.position.sub(ctr);holder.add(inner);holder.scale.setScalar(K);holder.rotation.y=Math.PI;pivot.add(holder);root.add(pivot);
      inner.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.envMapIntensity=1.25;mats.push(o.material);body=o}});
      const c=document.createElement('canvas');c.width=768;c.height=1664;const ctx=c.getContext('2d'),tex=new THREE.CanvasTexture(c);tex.encoding=THREE.sRGBEncoding;tex.anisotropy=8;
      const sm=new THREE.MeshBasicMaterial({map:tex,toneMapped:false,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4});
      const scr=new THREE.Mesh(sgeo,sm);scr.rotation.y=Math.PI;scr.position.set(0,0,-0.93);body.add(scr);
      const ph={root,pivot,mats,sm,key:'',fade:null,cur:null,
        setOp(o){mats.forEach(m=>{m.opacity=o;m.transparent=o<.995});sm.opacity=o;sm.transparent=o<.995;root.visible=o>.01},
        set(a,k,instant){const key=a+k;if(key===ph.key)return;ph.key=key;getImg(a,k).then(img=>{if(ph.key!==key)return;
          if(instant||!ph.cur){paint(ctx,768,1664,img);tex.needsUpdate=true;ph.fade=null}else ph.fade={from:ph.cur,to:img,t:0};ph.cur=img})}};
      ph.paint=dt=>{if(!ph.fade)return;const f=ph.fade;f.t=Math.min(1,f.t+dt/.45);paint(ctx,768,1664,f.from,f.to,ss(f.t));tex.needsUpdate=true;if(f.t>=1){paint(ctx,768,1664,f.to);ph.fade=null}};
      ph.set(app,i,true);ph.setOp(0);sc.add(root);return ph}
    const place=(ph,x,y,h,rx,ry,rz,z)=>{ph.root.position.set(x-VW/2,-(y-VH/2),z||0);ph.root.scale.setScalar(h);ph.pivot.rotation.set(rx,ry,rz)};
    const PS=makePhone('mate',0),PV=makePhone('mate',1),PO1=makePhone('mate',0),PO2=makePhone('hc',0);PS.app='mate';
    const S={};$$('[data-slot]').forEach(e=>S[e.dataset.slot]=e);
    let DT=1/60;const KK=r=>1-Math.pow(1-r,DT*60);
    /* x / y / size are glued exactly to the page (they never lag); only angles and opacity are eased */
    const drive=(ph,c,g)=>{if(!c.i){Object.assign(c,g);c.i=1;return}
      c.x=g.x;c.y=g.y;c.h=g.h;c.ry=lp(c.ry,g.ry,KK(.14));c.rz=lp(c.rz,g.rz,KK(.14));c.rx=lp(c.rx,g.rx,KK(.14));c.z=lp(c.z||0,g.z||0,KK(.14));c.o=lp(c.o,g.o,KK(.2))};
    const apply=(ph,c)=>{place(ph,c.x,c.y,c.h,c.rx,c.ry,c.rz,c.z);ph.setOp(c.o)};
    const cv={},co1={},co2={},SM={i:0,ry:0,rx:0,op:0};let lastY=scrollY,vel=0,appear=0,fa=1/60,lastDown=-9,wasAny=false,T=0;
    /* viewer interaction */
    const V={ang:0,vel:0,drag:false,idle:0,flipT:1,flipSwap:true,app:'mate',i:1,last:0,moved:0};const vw=S.viewer;
    vw.addEventListener('pointerdown',e=>{V.drag=true;V.last=e.clientX;V.moved=0;V.vel=0;vw.setPointerCapture(e.pointerId)});
    vw.addEventListener('pointermove',e=>{if(!V.drag)return;const dx=e.clientX-V.last;V.last=e.clientX;V.moved+=Math.abs(dx);V.ang+=dx*.012;V.vel=dx*.012});
    vw.addEventListener('pointerup',e=>{V.drag=false;V.idle=0;if(V.moved<6){const r=vw.getBoundingClientRect(),f=(e.clientX-r.left)/r.width;if(f>.62)go(1);else if(f<.38)go(-1)}});
    vw.addEventListener('pointercancel',()=>V.drag=false);
    const setDots=()=>dots.forEach((d,k)=>d.classList.toggle('on',k===V.i));
    function go(d){V.i=(V.i+d+3)%3;PV.set(V.app,V.i);setDots();V.auto=0}
    onDot=k=>{V.i=k;PV.set(V.app,V.i);setDots();V.auto=0};
    onTab=a=>{V.app=a;V.flipT=0;V.flipSwap=false;V.i=0;V.auto=0};
    PV.set('mate',1,true);V.i=1;setDots();
    PO1.set('mate',0,true);PO2.set('hc',0,true);
    ready=true;
    GLF=(Y,dt,st)=>{
      DT=dt;T+=dt;vel=lp(vel,Y-lastY,KK(.2));lastY=Y;appear=lp(appear,appearT,KK(.035));const vh=G.vh;
      /* story phone: exact position, eased spin + fade (frame-rate independent) */
      if(!SM.i){SM.ry=st.ry;SM.rx=st.rx;SM.op=st.op;SM.i=1}
      else{const a=1-Math.exp(-dt*14),b=1-Math.exp(-dt*20);let d=st.ry-SM.ry;d-=Math.round(d/TAU)*TAU;SM.ry+=d*a;SM.rx+=(st.rx-SM.rx)*a;SM.op+=(st.op-SM.op)*b}
      place(PS,st.x,st.y,st.h,SM.rx,SM.ry,0,0);PS.setOp(SM.op*appear);
      if(st.y+st.h/2<-60||st.y-st.h/2>vh+60)PS.root.visible=false;
      PS.set(st.app,st.k,st.app!==PS.app);PS.app=st.app;
      /* companion viewer (hold & drag) */
      const gv=G.viewer,mv={x:gv.x,y:gv.y-Y,h:gv.h};mv.v=mv.y+mv.h/2>-300&&mv.y-mv.h/2<vh+300;
      if(!V.drag){V.ang+=V.vel;V.vel*=Math.pow(.94,dt*60);if(Math.abs(V.vel)<.003){V.idle+=dt;if(V.idle>1.6)V.ang+=(Math.round(V.ang/TAU)*TAU-V.ang)*KK(.05)}}
      let flip=0;if(V.flipT<1){V.flipT=Math.min(1,V.flipT+dt/1.1);flip=ss(V.flipT)*TAU;if(!V.flipSwap&&V.flipT>.5){V.flipSwap=true;PV.set(V.app,0,true);V.i=0;setDots()}}
      V.auto=(V.auto||0)+dt;if(V.auto>4.5&&!V.drag&&mv.v){go(1)}
      drive(PV,cv,{x:mv.x,y:mv.y,h:mv.h*.97,rx:cl(-vel*.008,-.2,.2),ry:V.ang+flip+Math.sin(T*.9)*.1,rz:0,o:mv.v?appear:0});cv.ry=V.drag?cv.ry+(V.ang+flip-cv.ry)*KK(.5):cv.ry;apply(PV,cv);
      /* orbit (Try them today) */
      const mo=g=>{const y=g.y-Y;return{x:g.x,y,h:g.h,v:y+g.h/2>-300&&y-g.h/2<vh+300}};
      const m1=mo(G.o1),m2=mo(G.o2),inR=(m,p)=>PX>m.x-p.w/2-30&&PX<m.x+p.w/2+30&&PY>m.y-m.h/2-30&&PY<m.y+m.h/2+30,w1={w:m1.h*.46},w2={w:m2.h*.46};
      const h1=inR(m1,w1)?1:0,h2=inR(m2,w2)?1:0;co1.hv=lp(co1.hv||0,h1,KK(.1));co2.hv=lp(co2.hv||0,h2,KK(.1));
      const px=cl((PX/G.vw-.5)*2,-1,1);
      drive(PO1,co1,{x:m1.x,y:m1.y,h:m1.h*(1+.1*co1.hv),rx:0,ry:-.45+Math.sin(T*.7)*.35+px*.25+co1.hv*.4,rz:.03,z:150*co1.hv,o:m1.v?appear*(1-.5*co2.hv):0});apply(PO1,co1);
      drive(PO2,co2,{x:m2.x,y:m2.y,h:m2.h*(1+.1*co2.hv),rx:0,ry:.45+Math.sin(T*.7+2)*.35+px*.25-co2.hv*.4,rz:-.03,z:150*co2.hv,o:m2.v?appear*(1-.5*co1.hv):0});apply(PO2,co2);
      [PS,PV,PO1,PO2].forEach(p=>p.paint(dt));
      /* draw only while a phone is on screen; drop resolution if the GPU struggles */
      const any=PS.root.visible||PV.root.visible||PO1.root.visible||PO2.root.visible;
      if(any||wasAny)R.render(sc,cam);wasAny=any;
      fa=lp(fa,dt,.04);if(any&&fa>.028&&PR>1&&T-lastDown>2){PR=Math.max(1,PR-.25);R.setPixelRatio(PR);lastDown=T;fa=1/60}
    };
  },err=>{console.error(err);ready=true});
}
