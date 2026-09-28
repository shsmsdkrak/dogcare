// 설정 파일에 문제가 있어도 앱 화면은 뜨도록 동적으로 불러옴
let firebaseConfig = null, cfgError = '';
async function loadConfig(){
  try{
    const m = await import('./firebase-config.js?v=' + Date.now());
    firebaseConfig = m.firebaseConfig || m.default || null;
    if(!firebaseConfig) cfgError = 'firebase-config.js에 "export const firebaseConfig = {...}" 형태로 값이 있어야 해요.';
  }catch(e){
    console.error(e);
    cfgError = 'firebase-config.js를 읽지 못했어요: ' + (e && e.message || e);
  }
}

const FB = 'https://www.gstatic.com/firebasejs/12.19.0';

/* ================= 기본 정의 ================= */
const ICONS = {
  food:'<path d="M3 12h18l-1.6 6.2a2 2 0 0 1-1.9 1.5H6.5a2 2 0 0 1-1.9-1.5z"/><circle cx="9" cy="9" r="1.3"/><circle cx="13" cy="8" r="1.3"/><circle cx="15.5" cy="10.3" r="1.1"/>',
  water:'<path d="M12 3.5s6 6.6 6 10.7a6 6 0 0 1-12 0C6 10.1 12 3.5 12 3.5z"/><path d="M9.3 14.5a2.8 2.8 0 0 0 2.4 2.6"/>',
  teeth:'<path d="M7.5 4C5 4 4 6 4 8.3c0 2.3 1 3.7 1.5 6.2.5 2.8 1 5.5 2.4 5.5 1.5 0 1.6-4.5 4.1-4.5s2.6 4.5 4.1 4.5c1.4 0 1.9-2.7 2.4-5.5.5-2.5 1.5-3.9 1.5-6.2C20 6 19 4 16.5 4c-2 0-2.8 1.2-4.5 1.2S9.5 4 7.5 4z"/>',
  walk:'<ellipse cx="12" cy="16" rx="4" ry="3.4"/><ellipse cx="6" cy="10.5" rx="1.8" ry="2.3"/><ellipse cx="18" cy="10.5" rx="1.8" ry="2.3"/><ellipse cx="9.3" cy="6.2" rx="1.7" ry="2.2"/><ellipse cx="14.7" cy="6.2" rx="1.7" ry="2.2"/>',
  poop:'<path d="M6 19.5h12a2.5 2.5 0 0 0 .6-4.9A2.5 2.5 0 0 0 16 11.3 3 3 0 0 0 13 7.5c0-1.5-.8-3-2.5-4 .3 1.8-1 3.2-2.5 3.5A2.8 2.8 0 0 0 8 11.3a2.5 2.5 0 0 0-2.6 3.3A2.5 2.5 0 0 0 6 19.5z"/>',
  meds:'<rect x="3.2" y="8.5" width="17.6" height="7" rx="3.5" transform="rotate(-35 12 12)"/><path d="M9.3 8.1l5.4 7.8"/>',
  snack:'<path d="M7.2 8.4a2.3 2.3 0 1 1 1.4-4.2 2.3 2.3 0 1 1 3.2 3.2l4.8 4.8a2.3 2.3 0 1 1 3.2 3.2 2.3 2.3 0 1 1-4.2 1.4 2.3 2.3 0 0 1-1.4-1.4l-4.8-4.8a2.3 2.3 0 0 1-2.2-2.2z"/>',
  bath:'<path d="M3 12h18v1.5a5.5 5.5 0 0 1-5.5 5.5h-7A5.5 5.5 0 0 1 3 13.5z"/><path d="M6 12V6.5a2.2 2.2 0 0 1 4-1.2"/><path d="M7 19l-1 2M17 19l1 2"/>',
  brush:'<rect x="3" y="4" width="18" height="6" rx="2"/><path d="M6 10v9M9 10v7M12 10v9M15 10v7M18 10v9"/>',
  scissors:'<circle cx="6" cy="7" r="2.6"/><circle cx="6" cy="17" r="2.6"/><path d="M8.2 8.6L20 18M8.2 15.4L20 6"/>',
  scale:'<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M8.3 9.5a5.2 5.2 0 0 1 7.4 0"/><path d="M12 10.5l1.4-2"/>',
  vaccine:'<path d="M17.5 3l3.5 3.5M19.25 4.75l-3 3M14.5 6l3.5 3.5M16.2 7.8l-8.7 8.7-2.9.9.9-2.9 8.7-8.7M9.5 10.5l1.5 1.5M7.5 12.5l1.5 1.5M4.6 19.4L3 21"/>',
  hospital:'<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 8v8M8 12h8"/>',
  heart:'<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
  ball:'<circle cx="12" cy="12" r="8.5"/><path d="M4.4 9c4.2 1.3 11 1.3 15.2 0M4.4 15c4.2-1.3 11-1.3 15.2 0"/>',
  eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
  bell:'<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  home:'<path d="M3.5 11L12 4l8.5 7"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/>',
  star:'<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>'
};
const ICON_KEYS = Object.keys(ICONS);
const icon = (k,s=22)=>{ if(!ICONS[k]) k='star'; return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg>`; };

const TYPES = [
  {k:'food',  name:'사료',      options:['전부 먹음','조금 남김','많이 남김']},
  {k:'water', name:'물 교체',   stale:24},
  {k:'teeth', name:'양치질',    streak:true},
  {k:'walk',  name:'산책',      options:['15분','30분','1시간 이상']},
  {k:'poop',  name:'배변',      options:['정상','묽음','딱딱함','설사','소변만']},
  {k:'meds',  name:'약·영양제'},
  {k:'snack', name:'간식'}
];
const DEFAULT_TARGETS = {food:2,water:1,teeth:1,walk:2,poop:0,meds:0,snack:0};
const DEFAULT_PROFILE = {breed:'',sex:'',neutered:false,birth:'',weight:'',adopted:'',memo:''};
// 케어 항목: {k, name, icon, target, options[], stale(시간, 0=끔), streak, hidden}
function normItem(i){
  i=i||{};
  return { k:String(i.k||('c'+Date.now().toString(36))), name:String(i.name||'새 항목').slice(0,12),
    icon:ICONS[i.icon]?i.icon:'star', target:Math.max(0,Math.min(10,parseInt(i.target)||0)),
    options:Array.isArray(i.options)?i.options.map(o=>String(o).trim().slice(0,12)).filter(Boolean).slice(0,8):[],
    stale:Math.max(0,Math.min(240,parseInt(i.stale)||0)), streak:!!i.streak, hidden:!!i.hidden,
    when:['am','noon','pm'].includes(i.when)?i.when:'',
    pick:(i.pick==='chip'||i.pick==='select')?i.pick:'',
    cycle:Math.max(0,Math.min(400,parseInt(i.cycle)||0)) };
}
function defaultItems(targets){
  const tg={...DEFAULT_TARGETS,...(targets||{})};
  return TYPES.map(t=>normItem({...t, icon:t.k, target:tg[t.k]}));
}
function normDog(d,i){
  d=d||{};
  return {id:String(d.id||('d'+i)), name:String(d.name||'우리 강아지').slice(0,14), profile:{...DEFAULT_PROFILE,...(d.profile||{})}};
}
function normMember(m){
  m=m||{};
  return {name:String(m.name||'').trim().slice(0,12), color:/^#[0-9A-Fa-f]{6}$/.test(m.color||'')?m.color:''};
}
function normSupply(x){
  x=x||{};
  return {id:String(x.id||('s'+Date.now().toString(36))), name:String(x.name||'사료').slice(0,16),
    unit:['g','kg','개','포','캔'].includes(x.unit)?x.unit:'g',
    remain:Math.max(0,Number(x.remain)||0), perDay:Math.max(0,Number(x.perDay)||0),
    updated:/^\d{4}-\d{2}-\d{2}$/.test(x.updated||'')?x.updated:todayKey()};
}
function normCfg(c){ c=c||{};
  const dogs = Array.isArray(c.dogs)&&c.dogs.length ? c.dogs.map(normDog) : [normDog({id:'main',name:c.dogName,profile:c.profile},0)];
  return {dogs,
    dogName:dogs[0].name, profile:dogs[0].profile,
    members: Array.isArray(c.members)?c.members.map(normMember).filter(m=>m.name):[],
    supplies: Array.isArray(c.supplies)?c.supplies.map(normSupply):[],
    items: Array.isArray(c.items)&&c.items.length ? c.items.map(normItem) : defaultItems(c.targets)};
}
function curDog(){ return (S.cfg&&(S.cfg.dogs.find(d=>d.id===S.dog)||S.cfg.dogs[0]))||normDog({},0); }
const curPhoto = ()=>(S.photos&&S.photos[curDog().id])||'';
let T = {};
function setCfg(c){
  S.cfg=normCfg(c); T=Object.fromEntries(S.cfg.items.map(i=>[i.k,i]));
  if(!S.cfg.dogs.some(d=>d.id===S.dog)){ S.dog=S.cfg.dogs[0].id; ls.set('dogcare.dog',S.dog); }
}
const activeItems = ()=>S.cfg.items.filter(i=>!i.hidden);
// 선택지가 많으면 드롭다운, 적으면 칩 버튼 (항목별로 바꿀 수 있음)
const pickMode = it=>it.pick || ((it.options||[]).length>3?'select':'chip');
// 반복 주기가 있는 항목의 다음 예정일 계산
function dueInfo(it){
  if(!it.cycle) return null;
  const last=lastOf(it.k); if(!last) return {never:true, item:it};
  const due=shiftKey(keyOf(new Date(last.t)), it.cycle);
  const days=Math.round((parseKey(due)-parseKey(todayKey()))/864e5);
  return {item:it, due, days, lastKey:keyOf(new Date(last.t))};
}
function upcoming(){
  return activeItems().map(dueInfo).filter(d=>d&&!d.never&&d.days<=7).sort((a,b)=>a.days-b.days);
}
function ageText(birth){
  if(!birth) return '';
  const b=parseKey(birth), n=new Date();
  let m=(n.getFullYear()-b.getFullYear())*12+(n.getMonth()-b.getMonth()); if(n.getDate()<b.getDate()) m--;
  if(m<0) return '';
  const y=Math.floor(m/12), r=m%12;
  return y?`${y}살${r?` ${r}개월`:''}`:`${r}개월`;
}
function daysSince(k){ if(!k) return 0; return Math.floor((parseKey(todayKey())-parseKey(k))/864e5)+1; }

const pad = n=>String(n).padStart(2,'0');
const keyOf = d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const todayKey = ()=>keyOf(new Date());
const parseKey = k=>{const [y,m,d]=k.split('-').map(Number);return new Date(y,m-1,d)};
const shiftKey = (k,n)=>{const d=parseKey(k);d.setDate(d.getDate()+n);return keyOf(d)};
const hm = t=>{const d=new Date(t);return `${pad(d.getHours())}:${pad(d.getMinutes())}`};
const WD = ['일','월','화','수','목','금','토'];
const esc = s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $ = id=>document.getElementById(id);

const ls = {
  get(k){try{return localStorage.getItem(k)}catch(e){return null}},
  set(k,v){try{localStorage.setItem(k,v)}catch(e){}}
};

const S = {days:{}, cfg:null, photos:{}, dog:ls.get('dogcare.dog')||'main', showDone:ls.get('dogcare.showDone')==='1', view:todayKey(), me:ls.get('dogcare.me')||'', status:'connecting', fid:null};
let store = null;
setCfg({});

/* ================= 가족 코드 ================= */
const FID_RE = /^[A-Za-z0-9]{20,40}$/;
function makeFid(){
  const abc='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const a=new Uint8Array(24); crypto.getRandomValues(a);
  return Array.from(a,x=>abc[x%abc.length]).join('');
}
function fidFromText(txt){
  txt=(txt||'').trim();
  try{ const u=new URL(txt); const f=u.searchParams.get('f'); if(f&&FID_RE.test(f)) return f; }catch(e){}
  return FID_RE.test(txt)?txt:null;
}
function inviteUrl(name){ const u=new URL(location.href); u.search=''; u.hash=''; u.searchParams.set('f',S.fid); if(name) u.searchParams.set('me',name); return u.toString(); }
const cleanName = v=>String(v||'').trim().slice(0,12);
// 이름을 기기 저장소 + 주소(URL)에 함께 저장 → 저장소가 지워지는 브라우저(카톡 등)에서도 다시 묻지 않음
function setMe(v){
  v=cleanName(v); if(!v) return;
  S.me=v; ls.set('dogcare.me',v);
  const u=new URL(location.href);
  if(u.searchParams.get('me')!==v){ u.searchParams.set('me',v); history.replaceState(null,'',u); }
}
const IS_KAKAO = /KAKAOTALK/i.test(navigator.userAgent);
function setFid(f){
  S.fid=f; ls.set('dogcare.fid',f);
  const u=new URL(location.href);
  if(u.searchParams.get('f')!==f){ u.searchParams.set('f',f); history.replaceState(null,'',u); }
}

/* ================= 저장소: Firebase ================= */
async function firebaseStore(fid){
  const [{initializeApp},{getAuth,signInAnonymously,onAuthStateChanged},fs] = await Promise.all([
    import(`${FB}/firebase-app.js`), import(`${FB}/firebase-auth.js`), import(`${FB}/firebase-firestore.js`)
  ]);
  const app = initializeApp(firebaseConfig);
  let db;
  try{ db = fs.initializeFirestore(app,{localCache:fs.persistentLocalCache({tabManager:fs.persistentMultipleTabManager()})}); }
  catch(e){ db = fs.getFirestore(app); }
  const auth = getAuth(app);
  const user = await new Promise(res=>{const un=onAuthStateChanged(auth,u=>{un();res(u)})});
  if(!user) await signInAnonymously(auth);   // 화면에 보이지 않는 익명 로그인(가족은 아무것도 안 해도 됨)

  const base = ['families',fid];
  const dayRef = k=>fs.doc(db,...base,'days',k);
  const cfgRef = fs.doc(db,...base,'meta','config');
  const photoRef = fs.doc(db,...base,'meta','photo');
  const fail = e=>{ console.error(e); toast(e.code==='permission-denied'?'저장 권한이 없어요. 보안 규칙을 확인해 주세요':'저장하지 못했어요. 연결을 확인해 주세요'); };

  return {
    subscribeDays(cb){
      const q = fs.query(fs.collection(db,...base,'days'), fs.orderBy('date','desc'), fs.limit(120));
      return fs.onSnapshot(q,{includeMetadataChanges:true},snap=>{
        const out={}; snap.forEach(d=>out[d.id]=d.data());
        cb(out, snap.metadata.fromCache);
      }, e=>{ console.error(e); setStatus('error'); });
    },
    subscribeConfig(cb){ return fs.onSnapshot(cfgRef, s=>{ if(s.exists()) cb(s.data()); }, ()=>{}); },
    // 오프라인에서도 바로 화면에 반영되도록 await 하지 않음
    addEntry(k,id,entry){ fs.setDoc(dayRef(k),{date:k,entries:{[id]:entry}},{merge:true}).catch(fail); },
    removeEntry(k,id){ fs.updateDoc(dayRef(k),{[`entries.${id}`]:fs.deleteField()}).catch(fail); },
    updateEntry(k,id,entry){ fs.setDoc(dayRef(k),{date:k,entries:{[id]:entry}},{merge:true}).catch(fail); },
    saveConfig(cfg){ fs.setDoc(cfgRef,cfg).catch(fail); },
    subscribePhoto(cb){ return fs.onSnapshot(photoRef, s2=>{
      if(!s2.exists()) return cb(null);
      const v=s2.data(); cb(v.byDog||{main:v.data||''});
    }, ()=>{}); },
    savePhoto(byDog){ fs.setDoc(photoRef,{byDog,updatedAt:Date.now(),by:S.me||''}).catch(fail); },
    // 가끔 여는 화면(사진 일지·지출)은 구독 대신 1회 조회로 읽기 횟수를 아껴요
    async getDocData(path){ try{ const d2=await fs.getDoc(fs.doc(db,...base,...path.split('/'))); return d2.exists()?d2.data():null; }catch(e){ console.error(e); return null; } },
    async setDocData(path,data,merge){ try{ await fs.setDoc(fs.doc(db,...base,...path.split('/')),data,{merge:merge!==false}); return true; }catch(e){ fail(e); return false; } }
  };
}

/* ================= 저장소: 체험(이 기기 메모리) ================= */
function memoryStore(){
  let days={}, cfg=null, dcb=()=>{}, ccb=()=>{};
  const emit=()=>dcb(structuredClone(days),false);
  return {
    subscribeDays(cb){ dcb=cb; emit(); },
    subscribeConfig(cb){ ccb=cb; if(cfg) cb(cfg); },
    addEntry(k,id,e){ days[k]=days[k]||{date:k,entries:{}}; days[k].entries[id]=e; emit(); },
    removeEntry(k,id){ if(days[k]) delete days[k].entries[id]; emit(); },
    updateEntry(k,id,e){ days[k]=days[k]||{date:k,entries:{}}; days[k].entries[id]=e; emit(); },
    saveConfig(c){ cfg=c; ccb(c); },
    subscribePhoto(cb){ this._pcb=cb; },
    savePhoto(d){ this._pcb&&this._pcb(d); },
    _docs:{},
    async getDocData(path){ return this._docs[path]||null; },
    async setDocData(path,data,merge){ this._docs[path]=merge===false?data:Object.assign({},this._docs[path]||{},data); return true; }
  };
}

/* ================= 데이터 헬퍼 ================= */
function entriesOf(key){
  const e=(S.days[key]&&S.days[key].entries)||{};
  const first=S.cfg?S.cfg.dogs[0].id:'main';
  return Object.entries(e).map(([id,v])=>({id,...v}))
    .filter(x=>x&&T[x.type]&&((x.dog||first)===(S.dog||first)))
    .sort((a,b)=>b.t-a.t);
}
function lastOf(type){
  let best=null;
  for(const k of Object.keys(S.days)) for(const e of entriesOf(k)) if(e.type===type&&(!best||e.t>best.t)) best=e;
  return best;
}
function streakOf(type){
  let k=todayKey(), n=0;
  if(!entriesOf(k).some(e=>e.type===type)) k=shiftKey(k,-1);
  while(entriesOf(k).some(e=>e.type===type)){n++;k=shiftKey(k,-1)}
  return n;
}
function knownNames(){
  const s=new Set(((S.cfg&&S.cfg.members)||[]).map(m=>m.name));
  if(!s.size) ['엄마','아빠','언니','오빠','누나','형','나'].forEach(x=>s.add(x));
  for(const k of Object.keys(S.days)) for(const e of entriesOf(k)) if(e.by) s.add(e.by);
  return [...s].slice(0,12);
}
const SLOTS=[{k:'am',name:'아침'},{k:'noon',name:'낮'},{k:'pm',name:'저녁'},{k:'',name:'아무 때나'}];
const nowSlot = ()=>{ const h=new Date().getHours(); return h<11?'am':h<17?'noon':'pm'; };
const slotName = k=>(SLOTS.find(x=>x.k===k)||SLOTS[3]).name;
// 기록자별 색 (이름에서 고정적으로 뽑아요)
const WHO_COLORS=['#0E6B5C','#C2761B','#2F6FB5','#9B4DA8','#1F8A4C','#C0453B','#7A6B1E','#3E7F8E'];
function whoColor(name){
  const m=S.cfg&&S.cfg.members.find(x=>x.name===name);
  if(m&&m.color) return m.color;
  const n=String(name||''); let h=0;
  for(let i=0;i<n.length;i++) h=(h*31+n.charCodeAt(i))>>>0;
  return WHO_COLORS[h%WHO_COLORS.length];
}
const whoDot = name=>name?`<span class="who"><i style="background:${whoColor(name)}"></i>${esc(name)}</span>`:'';
const newId=()=>'e'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);

function setStatus(s){ S.status=s; render(); }

/* ================= 렌더 ================= */
function render(){
  const onboarding=!S.fid;
  $('onboard').hidden=!onboarding;
  $('main').hidden=onboarding;
  $('menuBtn').hidden=onboarding;
  if(onboarding){ $('dogName').textContent='멍멍 케어노트'; return; }

  const cfg=S.cfg, isToday=S.view===todayKey();
  $('dogName').textContent=curDog().name;
  $('dogName').className=S.cfg.dogs.length>1?'switchable':'';
  const ph=curPhoto();
  const fi=$('faceImg'); if(ph){ if(fi.src!==ph) fi.src=ph; fi.hidden=false; $('faceSvg').hidden=true; } else { fi.hidden=true; fi.removeAttribute('src'); $('faceSvg').hidden=false; }
  $('faceBtn').setAttribute('aria-label', ph?`${curDog().name} 사진 크게 보기`:`${curDog().name} 사진 추가`);
  renderProfile();
  document.title=`${curDog().name} 케어노트`;
  const d=parseKey(S.view);
  const rel=isToday?'오늘':S.view===shiftKey(todayKey(),-1)?'어제':'';
  const md=`${d.getMonth()+1}월 ${d.getDate()}일`;
  $('dateLabel').innerHTML=`${rel||md}<small>${d.getFullYear()}. ${d.getMonth()+1}. ${d.getDate()} (${WD[d.getDay()]})</small>`;
  $('nextDay').disabled=isToday;
  $('tlTitle').textContent=(rel||md)+' 기록';

  const list=entriesOf(S.view);
  const count=k=>list.filter(e=>e.type===k).length;

  const items=activeItems();
  const goals=items.filter(t=>t.target>0);
  const need=goals.reduce((a,t)=>a+t.target,0);
  const got=goals.reduce((a,t)=>a+Math.min(count(t.k),t.target),0);
  const pct=need?got/need:0, C=2*Math.PI*20;
  const left=goals.filter(t=>count(t.k)<t.target).map(t=>t.name);
  $('summary').innerHTML=`
    <svg class="ring" width="54" height="54" viewBox="0 0 54 54" aria-hidden="true">
      <circle cx="27" cy="27" r="20" fill="none" stroke="currentColor" stroke-opacity=".25" stroke-width="6"/>
      <circle cx="27" cy="27" r="20" fill="none" stroke="var(--ball)" stroke-width="6" stroke-linecap="round" stroke-dasharray="${C*pct} ${C}" transform="rotate(-90 27 27)"/>
      <text x="27" y="31.5" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor" class="num">${Math.round(pct*100)}%</text>
    </svg>
    <div><div class="t">${need===0?'목표를 설정해 보세요':left.length===0?(isToday?'오늘 할 일 모두 완료!':'이 날 할 일 모두 완료'):`남은 케어 ${left.length}가지`}</div>
    <div class="s">${left.length?esc(left.join(' · ')):`${got}/${need} 완료`}</div></div>`;

  const tileHtml=t=>{
    const n=count(t.k), goal=t.target, done=goal>0&&n>=goal, last=lastOf(t.k);
    let lastTxt='아직 기록 없음', warn=false;
    if(last){
      const hrs=(Date.now()-last.t)/36e5;
      const when=keyOf(new Date(last.t))===todayKey()?hm(last.t):hrs<48?`어제 ${hm(last.t)}`:`${Math.floor(hrs/24)}일 전`;
      lastTxt=`마지막 ${when}${last.by?` · ${esc(last.by)}`:''}`;
      if(t.cycle){ const d=dueInfo(t); if(d&&!d.never){ lastTxt=d.days<0?`${-d.days}일 지났어요`:d.days===0?'오늘 할 차례예요':`다음 D-${d.days} · ${d.due.slice(5).replace('-','/')}`; if(d.days<=0) warn=true; } }
      if(t.stale&&hrs>=t.stale){warn=true;lastTxt=`마지막 기록 후 ${Math.floor(hrs)}시간 지났어요`;}
    }
    const partial=goal>1&&n>0&&n<goal;
    const logged=!goal&&n>0;
    const dots=goal>0&&goal<=4?`<div class="dots">${Array.from({length:goal},(_,i)=>`<i class="${i<n?'on':''}"></i>`).join('')}</div>`:'';
    const streak=t.streak?streakOf(t.k):0;
    const badge=streak>=2?`<span class="badge">${streak}일 연속</span>`:'';
    const cnt=`<span class="cnt num ${done?'done':''}">${n}${goal?`<small style="font-size:14px">/${goal}</small>`:''}</span>`;
    return `<button class="tile ${done?'complete':''} ${partial?'partial':''} ${logged?'logged':''} ${warn&&isToday?'alert':''}" type="button" data-type="${t.k}">
      <div class="top"><span class="ic">${icon(t.icon)}</span>${partial?`<span class="partmark num">${goal-n}회 남음</span>`:''}${logged?`<span class="logmark num">${n}회 기록</span>`:''}${done?'<span class="donemark"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>완료</span>':(badge||cnt)}</div>
      <div class="name">${esc(t.name)}${(badge||done)?` ${cnt.replace('font-size:14px','font-size:12px')}`:''}</div>
      ${dots}
      <div class="last ${warn&&isToday?'warn':''}">${lastTxt}</div>
    </button>`;
  };
  const isDone=t=>t.target>0&&count(t.k)>=t.target;
  const pending=items.filter(t=>!isDone(t)), finished=items.filter(isDone);
  const grouped=items.some(t=>t.when);
  let html='';
  if(grouped){
    const cur=nowSlot();
    SLOTS.forEach(sl=>{
      const g=pending.filter(t=>(t.when||'')===sl.k);
      if(!g.length) return;
      html+=`<h3 class="slot-head${isToday&&sl.k===cur?' now':''}">${sl.name}${isToday&&sl.k===cur?'<span>지금</span>':''}</h3>
        <div class="tiles-grid">${g.map(tileHtml).join('')}</div>`;
    });
  } else {
    html+=`<div class="tiles-grid">${pending.map(tileHtml).join('')}</div>`;
  }
  if(finished.length){
    html+=`<button type="button" class="done-toggle" id="doneToggle" aria-expanded="${S.showDone}">
      <span>완료한 케어 ${finished.length}개</span><b>${S.showDone?'접기':'보기'}</b></button>
      ${S.showDone?`<div class="tiles-grid">${finished.map(tileHtml).join('')}</div>`:''}`;
  }
  $('tiles').innerHTML=html;

  const up=upcoming();
  $('upcoming').innerHTML=up.length?`<div class="up-strip">${up.map(d=>`
    <button type="button" class="up-chip ${d.days<0?'over':d.days<=1?'soon':''}" data-due="${esc(d.item.k)}">
      <span class="ic">${icon(d.item.icon,16)}</span>${esc(d.item.name)}
      <b>${d.days<0?`${-d.days}일 지남`:d.days===0?'오늘':`D-${d.days}`}</b></button>`).join('')}</div>`:'';
  $('upcoming').hidden=!up.length;

  $('timeline').innerHTML=list.length?list.map(e=>`
    <div class="row" data-edit-entry="${e.id}">
      <span class="time num">${hm(e.t)}</span>
      <span class="ic">${icon(T[e.type].icon,20)}</span>
      <span class="what"><b>${esc(T[e.type].name)}</b>${e.status?` <span>· ${esc(e.status)}</span>`:''}${e.note?` <span>· ${esc(e.note)}</span>`:''}<br>${whoDot(e.by)}</span>
      <button class="del" type="button" data-del="${e.id}" aria-label="${esc(T[e.type].name)} 기록 삭제">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>`).join(''):`<div class="empty">${isToday?'위 카드를 눌러 첫 기록을 남겨 보세요':'이 날은 기록이 없어요'}</div>`;
  if(!items.length) $('tiles').innerHTML='<button class="profile-empty" type="button" id="noItems">+ 케어 목록 추가하기</button>';

  const kt=$('kakaoTip'); if(kt) kt.hidden=!IS_KAKAO;
  const b=$('banner');
  const msg={demo:'체험 모드예요. 기록이 이 화면에만 있고 새로고침하면 사라져요.',
             nocfg:'아직 Firebase 설정이 없어요. firebase-config.js에 설정값을 넣어 주세요. (지금은 체험 모드)',
             cfgerr:'설정 파일 오류 — '+cfgError+' (지금은 체험 모드)',
             error:'서버에 연결하지 못했어요. 인터넷 연결과 Firebase 설정(익명 로그인, 보안 규칙)을 확인해 주세요.'}[S.status];
  b.hidden=!msg; if(msg) b.textContent=msg;
  $('syncNote').textContent={live:'가족과 실시간 공유 중',offline:'오프라인 — 연결되면 자동으로 올라가요',connecting:'연결 중…',demo:'체험 모드',nocfg:'체험 모드',cfgerr:'설정 파일 오류',error:'연결 오류'}[S.status]||'';
}

function renderProfile(){
  const p=curDog().profile||DEFAULT_PROFILE;
  const bits=[p.breed, p.sex?(p.sex+(p.neutered?' · 중성화':'')):'', ageText(p.birth), p.weight?`${p.weight}kg`:''].filter(Boolean);
  const together=daysSince(p.adopted);
  const el=$('profile');
  if(!bits.length && !together && !p.memo){
    el.innerHTML=`<button class="profile-empty" type="button" data-open="settings">+ ${esc(curDog().name)} 정보 입력하기 <span>품종 · 생일 · 몸무게</span></button>`;
    return;
  }
  const bday = p.birth && p.birth.slice(5)===todayKey().slice(5) ? '<span class="badge">오늘 생일!</span>' : '';
  el.innerHTML=`<button class="profile" type="button" data-open="settings" aria-label="강아지 정보 수정">
    <div class="p-main">${bits.map(b=>`<span>${esc(b)}</span>`).join('')}${bday}</div>
    ${together>0?`<div class="p-days">함께한 지 <b class="num">${together.toLocaleString()}</b>일째</div>`:''}
    ${p.memo?`<div class="p-memo">${esc(p.memo)}</div>`:''}
  </button>`;
}

/* ================= 시트 ================= */
// 시트가 열려 있는 동안 뒤 화면이 스크롤되지 않도록 고정
let scrollLockY=0, scrollLocked=false;
function lockScroll(){
  if(scrollLocked) return;
  scrollLockY=window.scrollY||0; scrollLocked=true;
  document.body.style.position='fixed';
  document.body.style.top=`-${scrollLockY}px`;
  document.body.style.left='0'; document.body.style.right='0';
  document.body.style.width='100%';
}
function unlockScroll(){
  if(!scrollLocked) return;
  scrollLocked=false;
  document.body.style.position=''; document.body.style.top='';
  document.body.style.left=''; document.body.style.right=''; document.body.style.width='';
  window.scrollTo(0,scrollLockY);
}
function openSheet(html,onMount,opts){
  const full=!!(opts&&opts.full), title=(opts&&opts.title)||'';
  lockScroll();
  $('sheetHost').innerHTML=`<div class="scrim${full?' full':''}" id="scrim"><div class="sheet${full?' full':''}" role="dialog" aria-modal="true">
    ${full?`<div class="panel-bar"><span>${esc(title)}</span>
      <button type="button" class="panel-x" id="panelX" aria-label="닫기">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button></div>`:''}
    <div class="sheet-body">${html}</div></div></div>`;
  $('scrim').addEventListener('click',e=>{if(e.target.id==='scrim')closeSheet()});
  if($('panelX')) $('panelX').onclick=closeSheet;
  onMount&&onMount($('sheetHost').querySelector('.sheet'));
}
function closeSheet(){ $('sheetHost').innerHTML=''; unlockScroll(); }
function confirmSheet(title, desc, onYes){
  openSheet(`
    <h3>${esc(title)}</h3>
    ${desc?`<p style="margin:0;color:var(--muted)">${esc(desc)}</p>`:''}
    <button type="button" class="primary danger-btn" id="cfYes">삭제</button>
    <button type="button" class="secondary" id="cfNo">취소</button>`,
  ()=>{ $('cfYes').onclick=()=>{ closeSheet(); onYes(); }; $('cfNo').onclick=closeSheet; });
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});

function logSheet(type){
  if(!S.me){ nameSheet(()=>logSheet(type)); return; }
  const t=T[type], isToday=S.view===todayKey(), defTime=isToday?hm(Date.now()):'09:00';
  openSheet(`
    <h3><span style="color:var(--accent)">${icon(t.icon,26)}</span>${esc(t.name)} 기록</h3>
    ${t.options&&t.options.length?(pickMode(t)==='select'
      ? `<div class="field"><label for="optSel">선택</label><select id="optSel">${t.options.map((o,i)=>`<option value="${esc(o)}"${i===0?' selected':''}>${esc(o)}</option>`).join('')}<option value="__etc">직접 입력…</option></select>
         <input id="optEtc" type="text" maxlength="20" placeholder="직접 입력" hidden></div>`
      : `<div class="field"><label>상태</label><div class="chips" id="opts">${t.options.map((o,i)=>`<button type="button" class="chip" aria-pressed="${i===0}" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div></div>`):''}
    <div class="field"><label for="logTime">시간</label><input id="logTime" type="time" value="${defTime}"></div>
    <div class="field"><label for="logNote">메모 (선택)</label><input id="logNote" type="text" maxlength="60" placeholder="${type==='meds'?'예: 심장사상충약':type==='snack'?'예: 개껌 1개':'남길 말이 있으면 적어 주세요'}"></div>
    <button class="primary" id="logSave" type="button">${esc(S.me)} 이름으로 기록</button>`,
  sheet=>{
    sheet.querySelectorAll('#opts .chip').forEach(c=>c.onclick=()=>{
      sheet.querySelectorAll('#opts .chip').forEach(x=>x.setAttribute('aria-pressed','false'));
      c.setAttribute('aria-pressed','true');
    });
    if($('optSel')) $('optSel').onchange=()=>{
      const etc=$('optSel').value==='__etc'; $('optEtc').hidden=!etc; if(etc) $('optEtc').focus();
    };
    $('logSave').onclick=()=>{
      const [h,m]=($('logTime').value||defTime).split(':').map(Number);
      const d=parseKey(S.view); d.setHours(h,m,0,0);
      const sel=sheet.querySelector('#opts .chip[aria-pressed="true"]');
      const entry={type,t:d.getTime(),by:S.me,dog:curDog().id};
      if(sel) entry.status=sel.dataset.o;
      else if($('optSel')){
        const v=$('optSel').value;
        const status=(v==='__etc'?$('optEtc').value.trim():v).slice(0,20);
        if(status) entry.status=status;
      }
      const note=$('logNote').value.trim(); if(note) entry.note=note;
      const id=newId(), day=S.view;
      store.addEntry(day,id,entry);
      closeSheet(); toast(`${t.name} 기록했어요`, ()=>{ store.removeEntry(day,id); toast('되돌렸어요'); });
    };
  });
}

function nameSheet(then){
  openSheet(`
    <h3>누가 기록하나요?</h3>
    <div class="chips" id="nameChips">${knownNames().map(n=>`<button type="button" class="chip" aria-pressed="${n===S.me}" data-n="${esc(n)}">${esc(n)}</button>`).join('')}</div>
    <div class="field"><label for="nameInput">직접 입력</label><input id="nameInput" type="text" maxlength="12" value="${esc(S.me)}" placeholder="이름을 입력하세요"></div>
    <button class="primary" id="nameSave" type="button">저장</button>
    <p class="note" style="margin:0">이 휴대폰에서만 기억해요. 기록마다 이 이름이 함께 남아요.</p>`,
  sheet=>{
    sheet.querySelectorAll('#nameChips .chip').forEach(c=>c.onclick=()=>{$('nameInput').value=c.dataset.n;
      sheet.querySelectorAll('#nameChips .chip').forEach(x=>x.setAttribute('aria-pressed',String(x===c)));});
    $('nameSave').onclick=()=>{
      const v=$('nameInput').value.trim(); if(!v){$('nameInput').focus();return}
      setMe(v);
      if(S.cfg && !S.cfg.members.some(m=>m.name===v)) saveCfg({...S.cfg, members:[...S.cfg.members,{name:v,color:''}]});
      closeSheet(); render(); then&&then();
    };
  });
}

function settingsSheet(){
  const pf={...DEFAULT_PROFILE,...(curDog().profile||{})};
  openSheet(`
    <h3>강아지 정보</h3>
    <div class="photo-row">
      <button type="button" class="photo-prev" id="photoPrev" aria-label="사진 선택">${curPhoto()?`<img src="${curPhoto()}" alt="">`:icon('heart',26)}</button>
      <div class="photo-actions">
        <button type="button" class="secondary" id="photoPick">${curPhoto()?'사진 바꾸기':'사진 추가'}</button>
        ${curPhoto()?'<button type="button" class="linkbtn" id="photoDel">사진 삭제</button>':''}
      </div>
    </div>
    <div class="field"><label for="dogInput">강아지 이름</label><input id="dogInput" type="text" maxlength="14" value="${esc(curDog().name)}"></div>
    <div class="grid2">
      <div class="field"><label for="pBreed">품종</label><input id="pBreed" type="text" maxlength="20" value="${esc(pf.breed)}" placeholder="예: 말티즈"></div>
      <div class="field"><label for="pWeight">몸무게 (kg)</label><input id="pWeight" type="number" inputmode="decimal" step="0.1" min="0" max="99" value="${esc(pf.weight)}" placeholder="0.0"></div>
      <div class="field"><label for="pBirth">생일</label><input id="pBirth" type="date" value="${esc(pf.birth)}"></div>
      <div class="field"><label for="pAdopted">가족이 된 날</label><input id="pAdopted" type="date" value="${esc(pf.adopted)}"></div>
    </div>
    <div class="field"><label>성별</label><div class="chips" id="pSex">
      ${['남아','여아'].map(x=>`<button type="button" class="chip" aria-pressed="${pf.sex===x}" data-v="${x}">${x}</button>`).join('')}
      <button type="button" class="chip" id="pNeut" aria-pressed="${!!pf.neutered}">중성화 했어요</button>
    </div></div>
    <div class="field"><label for="pMemo">메모</label><input id="pMemo" type="text" maxlength="60" value="${esc(pf.memo)}" placeholder="예: 닭고기 알레르기, 다니는 병원"></div>
    <button class="primary" id="cfgSave" type="button">모두에게 적용</button>`,
  sheet=>{
    $('photoPick').onclick=$('photoPrev').onclick=()=>pickPhoto();
    if($('photoDel')) $('photoDel').onclick=()=>{ S.photos={...S.photos,[curDog().id]:''}; store.savePhoto(S.photos); render(); settingsSheet(); toast('사진을 삭제했어요'); };
    sheet.querySelectorAll('#pSex .chip[data-v]').forEach(c=>c.onclick=()=>{
      const on=c.getAttribute('aria-pressed')!=='true';
      sheet.querySelectorAll('#pSex .chip[data-v]').forEach(x=>x.setAttribute('aria-pressed','false'));
      c.setAttribute('aria-pressed',String(on));
    });
    $('pNeut').onclick=()=>$('pNeut').setAttribute('aria-pressed',String($('pNeut').getAttribute('aria-pressed')!=='true'));
    $('cfgSave').onclick=()=>{
      const sexEl=sheet.querySelector('#pSex .chip[data-v][aria-pressed="true"]');
      const w=$('pWeight').value.trim();
      const profile={breed:$('pBreed').value.trim(), sex:sexEl?sexEl.dataset.v:'', neutered:$('pNeut').getAttribute('aria-pressed')==='true',
        birth:$('pBirth').value, weight:w?String(Math.round(parseFloat(w)*10)/10):'', adopted:$('pAdopted').value, memo:$('pMemo').value.trim()};
      const name=$('dogInput').value.trim()||'우리 강아지';
      const dogs=S.cfg.dogs.map(d=>d.id===curDog().id?{...d,name,profile}:d);
      saveCfg({...S.cfg, dogs}); closeSheet(); toast('설정을 저장했어요');
    };
  });
}

/* ---------- 알림 ---------- */
// 앱이 열려 있을 때 가족의 새 기록을 알려줘요.
// (앱을 완전히 닫은 상태로도 받는 푸시 알림은 발송 서버가 필요해 Firebase 유료 요금제가 있어야 해요)
let seenIds=new Set(), seeded=false;
const notifyOn = ()=>ls.get('dogcare.notify')==='on';
function notify(title, body){
  if(document.hidden && notifyOn() && 'Notification' in window && Notification.permission==='granted'){
    try{
      if(navigator.serviceWorker && navigator.serviceWorker.ready)
        navigator.serviceWorker.ready.then(r=>r.showNotification(title,{body,icon:'icon-192.png',badge:'icon-192.png',tag:'dogcare'})).catch(()=>new Notification(title,{body}));
      else new Notification(title,{body});
      return;
    }catch(e){}
  }
  toast(body?`${title} — ${body}`:title);
}
function notifyChanges(days){
  const ids=new Set();
  Object.keys(days).forEach(k=>{
    const es=(days[k]&&days[k].entries)||{};
    Object.keys(es).forEach(id=>{ if(es[id]) ids.add(id+'@'+k); });
  });
  if(!seeded){ seenIds=ids; seeded=true; return; }
  const fresh=[];
  ids.forEach(key=>{ if(!seenIds.has(key)) fresh.push(key); });
  seenIds=ids;
  fresh.forEach(key=>{
    const [id,k]=key.split('@');
    const e=days[k].entries[id];
    if(!e || e.by===S.me) return;                    // 내가 남긴 기록은 알리지 않음
    if(Date.now()-(e.t||0) > 12*36e5) return;        // 오래된 기록 정리 중 생긴 변화는 무시
    const nm=T[e.type]?T[e.type].name:'케어';
    notify(`${e.by||'가족'}님이 ${nm} 기록했어요`, `${hm(e.t)}${e.status?` · ${e.status}`:''}${e.note?` · ${e.note}`:''}`);
  });
}
async function toggleNotify(){
  if(notifyOn()){ ls.set('dogcare.notify','off'); toast('알림을 껐어요'); return; }
  if(!('Notification' in window)){ toast('이 브라우저는 알림을 지원하지 않아요'); return; }
  let perm=Notification.permission;
  if(perm==='default'){ try{ perm=await Notification.requestPermission(); }catch(e){} }
  if(perm!=='granted'){ toast('브라우저 설정에서 알림을 허용해 주세요'); return; }
  ls.set('dogcare.notify','on'); toast('알림을 켰어요');
}

/* ---------- 빠른 기록 (길게 누르기) ---------- */
function quickLog(type){
  const t=T[type]; if(!t) return;
  if(!S.me){ nameSheet(()=>quickLog(type)); return; }
  const d=S.view===todayKey()?new Date():(()=>{const x=parseKey(S.view);x.setHours(9,0,0,0);return x})();
  const id=newId(), day=S.view;
  store.addEntry(day,id,{type,t:d.getTime(),by:S.me,dog:curDog().id});
  if(navigator.vibrate) try{navigator.vibrate(12)}catch(e){}
  toast(`${t.name} 바로 기록했어요`, ()=>{ store.removeEntry(day,id); toast('되돌렸어요'); });
}

/* ---------- 기록 수정 ---------- */
function entryEditSheet(id){
  const e=entriesOf(S.view).find(x=>x.id===id); if(!e) return;
  const t=T[e.type]||{name:'기록',icon:'star',options:[]};
  const opts=t.options||[];
  openSheet(`
    <h3><span style="color:var(--accent)">${icon(t.icon,26)}</span>${esc(t.name)} 기록 수정</h3>
    ${opts.length?`<div class="field"><label for="eeSel">선택</label><select id="eeSel">
      <option value="">선택 안 함</option>
      ${opts.map(o=>`<option value="${esc(o)}"${o===e.status?' selected':''}>${esc(o)}</option>`).join('')}
      <option value="__etc"${e.status&&!opts.includes(e.status)?' selected':''}>직접 입력…</option></select>
      <input id="eeEtc" type="text" maxlength="20" value="${esc(e.status&&!opts.includes(e.status)?e.status:'')}" placeholder="직접 입력" ${e.status&&!opts.includes(e.status)?'':'hidden'}></div>`
      :`<div class="field"><label for="eeEtc">상태 (선택)</label><input id="eeEtc" type="text" maxlength="20" value="${esc(e.status||'')}"></div>`}
    <div class="field"><label for="eeTime">시간</label><input id="eeTime" type="time" value="${hm(e.t)}"></div>
    <div class="field"><label for="eeNote">메모</label><input id="eeNote" type="text" maxlength="60" value="${esc(e.note||'')}"></div>
    <p class="note" style="margin:0;text-align:left">${esc(e.by||'')} 기록</p>
    <button type="button" class="primary" id="eeSave">저장</button>
    <button type="button" class="secondary danger" id="eeDel">이 기록 삭제</button>`,
  sheet=>{
    if($('eeSel')) $('eeSel').onchange=()=>{ const etc=$('eeSel').value==='__etc'; $('eeEtc').hidden=!etc; if(etc)$('eeEtc').focus(); };
    $('eeSave').onclick=()=>{
      const [h,m]=($('eeTime').value||hm(e.t)).split(':').map(Number);
      const d=parseKey(S.view); d.setHours(h,m,0,0);
      let status='';
      if($('eeSel')) status=$('eeSel').value==='__etc'?$('eeEtc').value.trim():$('eeSel').value;
      else status=$('eeEtc').value.trim();
      const next={type:e.type,t:d.getTime(),by:e.by||S.me,dog:e.dog||curDog().id};
      if(status) next.status=status.slice(0,20);
      const note=$('eeNote').value.trim(); if(note) next.note=note;
      store.updateEntry(S.view,id,next); closeSheet(); toast('기록을 고쳤어요');
    };
    $('eeDel').onclick=()=>{
      const day=S.view, backup={type:e.type,t:e.t,by:e.by,status:e.status,note:e.note};
      store.removeEntry(day,id); closeSheet();
      toast('기록을 지웠어요', ()=>{ store.updateEntry(day,id,backup); toast('되돌렸어요'); });
    };
  });
}

/* ---------- 돌아보기: 달력 · 달성률 ---------- */
function statsSheet(range){
  const days=(typeof range==='number'&&range>0)?range:30;
  const keys=Array.from({length:days},(_,i)=>shiftKey(todayKey(),-(days-1-i)));
  const items=activeItems();
  const goalItems=items.filter(i=>i.target>0);
  const dayStat=k=>{
    const es=entriesOf(k);
    if(!goalItems.length) return {rate:es.length?1:0, n:es.length};
    let need=0,got=0;
    goalItems.forEach(it=>{ need+=it.target; got+=Math.min(es.filter(e=>e.type===it.k).length,it.target); });
    return {rate:need?got/need:0, n:es.length};
  };
  // 달력(주 단위, 월요일 시작)
  const first=parseKey(keys[0]); const pad0=(first.getDay()+6)%7;
  const cells=[...Array(pad0).fill(null),...keys];
  const cal=cells.map(k=>{
    if(!k) return '<span class="cell empty"></span>';
    const {rate,n}=dayStat(k), d=parseKey(k);
    const lv=n===0?0:rate>=1?4:rate>=.66?3:rate>=.33?2:1;
    return `<button type="button" class="cell lv${lv}${k===todayKey()?' today':''}" data-day="${k}" aria-label="${d.getMonth()+1}월 ${d.getDate()}일 ${Math.round(rate*100)}%"><span>${d.getDate()}</span></button>`;
  }).join('');
  // 항목별 달성률
  const rows=items.map(it=>{
    let done=0, total=0, cnt=0;
    keys.forEach(k=>{ const c=entriesOf(k).filter(e=>e.type===it.k).length; cnt+=c;
      if(it.target){ total++; if(c>=it.target) done++; } });
    const pct=total?Math.round(done/total*100):0;
    return {it,cnt,done,total,pct};
  }).sort((a,b)=>(b.total?b.pct:-1)-(a.total?a.pct:-1));
  // 가족별 기여
  const by={}; keys.forEach(k=>entriesOf(k).forEach(e=>{ if(e.by) by[e.by]=(by[e.by]||0)+1; }));
  const byList=Object.entries(by).sort((a,b)=>b[1]-a[1]);
  const byMax=byList.length?byList[0][1]:1;
  const total=Object.values(by).reduce((a,b)=>a+b,0);
  const bestStreak=items.filter(i=>i.streak||i.target).map(i=>({name:i.name,n:streakOf(i.k)})).sort((a,b)=>b.n-a.n)[0];
  const avg=Math.round(keys.reduce((a,k)=>a+dayStat(k).rate,0)/keys.length*100);

  openSheet(`
    <h3>기록 돌아보기</h3>
    <div class="chips" id="rangeChips">
      ${[7,30,90].map(n=>`<button type="button" class="chip" aria-pressed="${n===days}" data-r="${n}">최근 ${n}일</button>`).join('')}
    </div>
    <div class="statgrid">
      <div class="stat"><b class="num">${avg}%</b><span>평균 달성률</span></div>
      <div class="stat"><b class="num">${total}</b><span>전체 기록</span></div>
      <div class="stat"><b class="num">${bestStreak&&bestStreak.n?bestStreak.n+'일':'—'}</b><span>${bestStreak&&bestStreak.n?esc(bestStreak.name)+' 연속':'연속 기록'}</span></div>
    </div>
    <div class="field"><label>달력 <span style="font-weight:400">(진할수록 목표를 잘 지킨 날)</span></label>
      <div class="calwrap"><div class="calhead">${['월','화','수','목','금','토','일'].map(w=>`<span>${w}</span>`).join('')}</div>
      <div class="cal" id="cal">${cal}</div></div>
    </div>
    <div class="field"><label>항목별</label>
      <div class="bars">${rows.map(r=>`<div class="bar">
        <span class="bar-ic">${icon(r.it.icon,18)}</span>
        <span class="bar-name">${esc(r.it.name)}</span>
        <span class="bar-track"><i style="width:${r.total?r.pct:Math.min(100,r.cnt?100:0)}%"></i></span>
        <span class="bar-val num">${r.total?`${r.pct}%`:`${r.cnt}회`}</span>
      </div>`).join('')}</div>
      <p class="note" style="margin:6px 0 0;text-align:left">목표가 있는 항목은 목표를 채운 날의 비율, 없는 항목은 기록 횟수예요.</p>
    </div>
    ${byList.length?`<div class="field"><label>가족별 기록</label>
      <div class="bars">${byList.map(([n,c])=>`<div class="bar">
        <span class="bar-name" style="flex:none;width:72px">${esc(n)}</span>
        <span class="bar-track"><i class="alt" style="width:${Math.round(c/byMax*100)}%"></i></span>
        <span class="bar-val num">${c}회</span></div>`).join('')}</div></div>`:''}
    <button type="button" class="primary" id="statsClose">닫기</button>`,
  sheet=>{
    sheet.querySelectorAll('#rangeChips .chip').forEach(c=>c.onclick=()=>statsSheet(+c.dataset.r));
    sheet.querySelectorAll('#cal .cell[data-day]').forEach(c=>c.onclick=()=>{ S.view=c.dataset.day; closeSheet(); render(); });
    $('statsClose').onclick=closeSheet;
  });
}

/* ---------- 케어 항목 · 목표 편집 ---------- */
function saveCfg(next){ setCfg(next); store.saveConfig(S.cfg); render(); }
function saveItems(items){ saveCfg({...S.cfg, items}); }
function itemsSheet(){
  const items=S.cfg.items.map(i=>({...i}));
  const shown=items.filter(i=>!i.hidden), hidden=items.filter(i=>i.hidden);
  const row=i=>`<div class="irow" data-k="${esc(i.k)}">
      <span class="grip" data-grip="${esc(i.k)}" aria-label="${esc(i.name)} 순서 바꾸기" role="button" tabindex="0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 7h8M8 12h8M8 17h8"/></svg>
      </span>
      <button type="button" class="irow-main" data-edit="${esc(i.k)}">
        <span class="ic">${icon(i.icon,20)}</span>
        <span class="irow-name">${esc(i.name)}</span>
        <span class="irow-goal">${i.target?`하루 ${i.target}회`:'기록만'}${i.cycle?` · ${i.cycle}일 주기`:''}${i.when?` · ${slotName(i.when)}`:''}</span>
      </button>
      <button type="button" class="irow-del" data-remove="${esc(i.k)}" aria-label="${esc(i.name)} 삭제">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13"/></svg>
      </button>
    </div>`;
  openSheet(`
    <h3>케어 목록 편집</h3>
    <p style="margin:0;color:var(--muted);font-size:13px">항목을 누르면 이름, 아이콘, 하루 목표, 선택지를 바꿀 수 있어요. 왼쪽 손잡이를 잡고 끌면 순서가 바뀌고, 오른쪽 휴지통으로 삭제해요. 바꾼 내용은 가족 모두에게 바로 적용돼요.</p>
    <div class="ilist" id="ilist">${shown.map(row).join('')||'<div class="empty">보이는 항목이 없어요</div>'}</div>
    <button type="button" class="secondary" id="addItem">+ 새 항목 추가하기</button>
    ${hidden.length?`<div class="field"><label>숨긴 항목</label><div class="chips">${hidden.map(i=>`<button type="button" class="chip" data-unhide="${esc(i.k)}">${icon(i.icon,16)} ${esc(i.name)} 다시 보이기</button>`).join('')}</div></div>`:''}
    <button type="button" class="primary" id="itemsDone">완료</button>`,
  sheet=>{
    initDragSort($('ilist'), order=>{
      const hiddenItems=items.filter(i=>i.hidden);
      const next=order.map(k=>items.find(i=>i.k===k)).filter(Boolean).concat(hiddenItems);
      saveItems(next); itemsSheet(); toast('순서를 바꿨어요');
    });
    sheet.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>itemEditSheet(b.dataset.edit));
    sheet.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>itemDeleteSheet(b.dataset.remove));
    sheet.querySelectorAll('[data-unhide]').forEach(b=>b.onclick=()=>{ items.find(i=>i.k===b.dataset.unhide).hidden=false; saveItems(items); itemsSheet(); toast('항목을 다시 보이게 했어요'); });
    $('addItem').onclick=()=>itemEditSheet(null);
    $('itemsDone').onclick=closeSheet;
  });
}
function itemDeleteSheet(k){
  const it=T[k]; if(!it) return;
  let n=0; for(const d of Object.keys(S.days)) n+=entriesOf(d).filter(e=>e.type===k).length;
  const apply=items=>{ saveItems(items); itemsSheet(); };
  openSheet(`
    <h3><span style="color:var(--accent)">${icon(it.icon,26)}</span>${esc(it.name)}</h3>
    <p style="margin:0;color:var(--muted)">${n?`최근 기록이 <b>${n}건</b> 있어요. 어떻게 할까요?`:'기록이 없는 항목이에요. 바로 삭제해도 괜찮아요.'}</p>
    ${n?`<button type="button" class="secondary" id="idHide">숨기기 <span style="font-weight:400;color:var(--muted)">— 지난 기록은 그대로 남아요</span></button>`:''}
    <button type="button" class="primary danger-btn" id="idDel">완전 삭제</button>
    <p class="note" style="margin:0;text-align:left">완전 삭제하면 목록에서 사라지고, 이 항목으로 남긴 지난 기록도 화면에 보이지 않게 돼요.</p>
    <button type="button" class="secondary" id="idNo">취소</button>`,
  ()=>{
    if($('idHide')) $('idHide').onclick=()=>{ apply(S.cfg.items.map(i=>i.k===k?{...i,hidden:true}:{...i})); toast('숨겼어요'); };
    $('idDel').onclick=()=>{ apply(S.cfg.items.filter(i=>i.k!==k)); toast(`${it.name} 항목을 삭제했어요`); };
    $('idNo').onclick=itemsSheet;
  });
}

function itemEditSheet(k){
  const isNew=!k;
  const it=isNew?normItem({k:'c'+Date.now().toString(36),name:'',icon:'star',target:1}):{...T[k]};
  let ic=it.icon, tg=it.target, streak=it.streak, opts=[...it.options], pick=it.pick, when=it.when||'';
  openSheet(`
    <h3><span style="color:var(--accent)" id="ieIcon">${icon(ic,26)}</span>${isNew?'새 항목':'항목 편집'}</h3>
    <div class="field"><label for="ieName">이름</label><input id="ieName" type="text" maxlength="12" value="${esc(it.name)}" placeholder="예: 목욕, 발톱 깎기"></div>
    <div class="field"><label>아이콘</label><div class="icongrid" id="ieIcons">${ICON_KEYS.map(x=>`<button type="button" data-ic="${x}" aria-pressed="${x===ic}" aria-label="아이콘 ${x}">${icon(x,22)}</button>`).join('')}</div></div>
    <div class="steps" style="border:0"><span><b style="font-weight:600">하루 목표</b><br><span style="font-size:12px;color:var(--muted)">0이면 목표 없이 기록만 해요</span></span>
      <div class="stepper"><button type="button" id="ieMinus" aria-label="목표 줄이기">−</button><span class="num" id="ieTarget">${tg}</span><button type="button" id="iePlus" aria-label="목표 늘리기">+</button></div></div>
    <div class="field"><label>선택지 <span style="font-weight:400">(간식 종류, 영양제 이름처럼 고를 목록)</span></label>
      <div class="optlist" id="ieOptList"></div>
      <button type="button" class="secondary" id="ieOptAdd">+ 선택지 추가</button>
    </div>
    <div class="field"><label>시간대</label><div class="chips" id="ieWhen">
      ${SLOTS.map(sl=>`<button type="button" class="chip" data-w="${sl.k}" aria-pressed="false">${sl.name}</button>`).join('')}
    </div></div>
    <div class="field" id="iePickWrap"><label>선택 방식</label><div class="chips" id="iePick">
      <button type="button" class="chip" data-p="chip">버튼</button>
      <button type="button" class="chip" data-p="select">드롭다운</button>
    </div></div>
    <div class="field"><label for="ieCycle">반복 주기 (일) <span style="font-weight:400">— 예방접종, 심장사상충약처럼 주기가 긴 일</span></label>
      <input id="ieCycle" type="number" inputmode="numeric" min="0" max="400" value="${it.cycle||''}" placeholder="사용 안 함">
      <p class="note" style="margin:4px 0 0;text-align:left">적어두면 마지막 기록일 기준으로 다음 예정일(D-7)을 위에 보여줘요.</p></div>
    <div class="grid2">
      <div class="field"><label for="ieStale">알림 (시간)</label><input id="ieStale" type="number" inputmode="numeric" min="0" max="240" value="${it.stale||''}" placeholder="끔"></div>
      <div class="field"><label>연속 기록</label><button type="button" class="chip" id="ieStreak" aria-pressed="${streak}">연속 일수 표시</button></div>
    </div>
    <p class="note" style="margin:-6px 0 0;text-align:left">알림: 마지막 기록 후 이 시간이 지나면 카드가 주황색으로 바뀌어요.</p>
    <button type="button" class="primary" id="ieSave">${isNew?'추가하기':'저장'}</button>
    <div class="row2">
      <button type="button" class="secondary" id="ieBack">목록으로</button>
      ${isNew?'<span></span>':'<button type="button" class="secondary danger" id="ieHide">이 항목 삭제</button>'}
    </div>`,
  sheet=>{
    const drawOpts=()=>{
      $('ieOptList').innerHTML=opts.map((o,i)=>`<div class="optrow">
        <input type="text" maxlength="20" value="${esc(o)}" data-i="${i}" placeholder="예: 개껌">
        <button type="button" data-del-opt="${i}" aria-label="선택지 삭제">✕</button></div>`).join('')
        ||'<p class="note" style="margin:0;text-align:left">선택지가 없으면 기록할 때 바로 저장돼요.</p>';
      $('ieOptList').querySelectorAll('input').forEach(inp=>inp.oninput=()=>{ opts[+inp.dataset.i]=inp.value; });
      $('ieOptList').querySelectorAll('[data-del-opt]').forEach(b=>b.onclick=()=>{ opts.splice(+b.dataset.delOpt,1); drawOpts(); });
      $('iePickWrap').hidden=opts.length<2;
      const eff=pick||(opts.length>3?'select':'chip');
      sheet.querySelectorAll('#iePick .chip').forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.p===eff)));
    };
    drawOpts();
    $('ieOptAdd').onclick=()=>{ if(opts.length>=8){toast('선택지는 8개까지예요');return;} opts.push(''); drawOpts();
      const last=$('ieOptList').querySelector('.optrow:last-child input'); last&&last.focus(); };
    sheet.querySelectorAll('#iePick .chip').forEach(c=>c.onclick=()=>{ pick=c.dataset.p; drawOpts(); });
    sheet.querySelectorAll('#ieIcons button').forEach(b=>b.onclick=()=>{ ic=b.dataset.ic;
      sheet.querySelectorAll('#ieIcons button').forEach(x=>x.setAttribute('aria-pressed',String(x===b))); $('ieIcon').innerHTML=icon(ic,26); });
    const drawWhen=()=>sheet.querySelectorAll('#ieWhen .chip').forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.w===when)));
    drawWhen();
    sheet.querySelectorAll('#ieWhen .chip').forEach(c=>c.onclick=()=>{ when=c.dataset.w; drawWhen(); });
    $('ieMinus').onclick=()=>{ tg=Math.max(0,tg-1); $('ieTarget').textContent=tg; };
    $('iePlus').onclick=()=>{ tg=Math.min(10,tg+1); $('ieTarget').textContent=tg; };
    $('ieStreak').onclick=()=>{ streak=!streak; $('ieStreak').setAttribute('aria-pressed',String(streak)); };
    $('ieBack').onclick=itemsSheet;
    $('ieSave').onclick=()=>{
      const name=$('ieName').value.trim(); if(!name){ $('ieName').focus(); toast('이름을 입력해 주세요'); return; }
      const next=normItem({...it, name, icon:ic, target:tg, streak, options:opts, pick, when, stale:$('ieStale').value, cycle:$('ieCycle').value});
      const items=S.cfg.items.map(i=>({...i}));
      const at=items.findIndex(i=>i.k===next.k); if(at>=0) items[at]=next; else items.push(next);
      saveItems(items); toast(isNew?`${name} 항목을 추가했어요`:'저장했어요'); itemsSheet();
    };
    if($('ieHide')) $('ieHide').onclick=()=>itemDeleteSheet(it.k);
  });
}

/* ---------- 드래그로 순서 바꾸기 (마우스 · 터치 공용) ---------- */
function initDragSort(list, onDone){
  if(!list) return;
  let drag=null;
  const rowsOf=()=>[...list.querySelectorAll('.irow')];
  const start=(grip,e)=>{
    const row=grip.closest('.irow'); if(!row) return;
    const rows=rowsOf(), h=row.offsetHeight+parseFloat(getComputedStyle(rows[0]).marginBottom||0);
    drag={row,rows,h,from:rows.indexOf(row),to:rows.indexOf(row),y0:e.clientY};
    row.classList.add('dragging'); list.classList.add('sorting');
    grip.setPointerCapture&&grip.setPointerCapture(e.pointerId);
    if(navigator.vibrate) try{navigator.vibrate(8)}catch(_){}
  };
  const move=e=>{
    if(!drag) return;
    e.preventDefault();
    const dy=e.clientY-drag.y0;
    drag.row.style.transform=`translateY(${dy}px)`;
    const to=Math.max(0,Math.min(drag.rows.length-1, drag.from+Math.round(dy/drag.h)));
    if(to!==drag.to){
      drag.to=to;
      drag.rows.forEach((r,i)=>{
        if(r===drag.row) return;
        let shift=0;
        if(drag.from<to && i>drag.from && i<=to) shift=-drag.h;
        else if(drag.from>to && i<drag.from && i>=to) shift=drag.h;
        r.style.transform=shift?`translateY(${shift}px)`:'';
      });
    }
  };
  const end=()=>{
    if(!drag) return;
    const {rows,from,to}=drag;
    rows.forEach(r=>{ r.style.transform=''; r.classList.remove('dragging'); });
    list.classList.remove('sorting'); drag=null;
    if(from===to) return;
    const order=rows.map(r=>r.dataset.k);
    order.splice(to,0,order.splice(from,1)[0]);
    onDone(order);
  };
  list.querySelectorAll('[data-grip]').forEach(g=>{
    g.addEventListener('pointerdown',e=>{ e.preventDefault(); start(g,e); });
    g.addEventListener('pointermove',move);
    g.addEventListener('pointerup',end);
    g.addEventListener('pointercancel',end);
    g.addEventListener('keydown',e=>{ // 키보드 대체 수단
      if(e.key!=='ArrowUp'&&e.key!=='ArrowDown') return;
      e.preventDefault();
      const order=rowsOf().map(r=>r.dataset.k);
      const i=order.indexOf(g.dataset.grip), j=i+(e.key==='ArrowUp'?-1:1);
      if(j<0||j>=order.length) return;
      [order[i],order[j]]=[order[j],order[i]]; onDone(order);
    });
  });
}


/* ---------- 가족(기록자) 관리 ---------- */
function membersSheet(){
  const ms=S.cfg.members;
  openSheet(`
    <h3>가족 · 기록자</h3>
    <p style="margin:0;color:var(--muted);font-size:13px">이름과 색을 정해두면 기록마다 색으로 누가 했는지 보여요.</p>
    <div class="ilist">${ms.length?ms.map(m=>`<div class="irow">
        <button type="button" class="irow-main" data-mem="${esc(m.name)}">
          <span class="who-chip" style="background:${whoColor(m.name)}"></span>
          <span class="irow-name">${esc(m.name)}</span>
          ${m.name===S.me?'<span class="irow-goal">나</span>':''}
        </button>
        <button type="button" class="irow-del" data-memdel="${esc(m.name)}" aria-label="${esc(m.name)} 삭제">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13"/></svg>
        </button></div>`).join(''):'<div class="empty">아직 등록한 가족이 없어요</div>'}</div>
    ${(()=>{const found=new Set(); Object.keys(S.days).forEach(k=>entriesOf(k).forEach(e=>{ if(e.by&&!ms.some(m=>m.name===e.by)) found.add(e.by); }));
      if(S.me&&!ms.some(m=>m.name===S.me)) found.add(S.me);
      const arr=[...found].slice(0,8);
      return arr.length?`<div class="field"><label>기록에 있는 이름</label><div class="chips">${arr.map(n=>`<button type="button" class="chip" data-quick="${esc(n)}">+ ${esc(n)}</button>`).join('')}</div></div>`:'';})()}
    <button type="button" class="secondary" id="memAdd">+ 가족 추가하기</button>
    <button type="button" class="primary" id="memDone">완료</button>`,
  sheet=>{
    sheet.querySelectorAll('[data-mem]').forEach(b=>b.onclick=()=>memberEditSheet(b.dataset.mem));
    sheet.querySelectorAll('[data-memdel]').forEach(b=>b.onclick=()=>{
      const nm=b.dataset.memdel;
      confirmSheet(`${nm}님을 목록에서 뺄까요?`,'지난 기록은 그대로 남아요.',()=>{
        saveCfg({...S.cfg, members:S.cfg.members.filter(m=>m.name!==nm)}); membersSheet(); toast('뺐어요');
      });
    });
    sheet.querySelectorAll('[data-quick]').forEach(b=>b.onclick=()=>{
      const nm=b.dataset.quick;
      saveCfg({...S.cfg, members:[...S.cfg.members,{name:nm,color:''}]}); membersSheet(); toast(`${nm}님을 추가했어요`);
    });
    $('memAdd').onclick=()=>memberEditSheet(null);
    $('memDone').onclick=menuSheet;
  });
}
function memberEditSheet(name){
  const isNew=!name;
  const m=isNew?{name:'',color:''}:{...(S.cfg.members.find(x=>x.name===name)||{name,color:''})};
  let color=m.color||whoColor(m.name||'새 가족');
  openSheet(`
    <h3>${isNew?'가족 추가':'가족 수정'}</h3>
    <div class="field"><label for="memName">이름</label><input id="memName" type="text" maxlength="12" value="${esc(m.name)}" placeholder="예: 엄마"></div>
    <div class="field"><label>색</label><div class="colorgrid" id="memColors">
      ${WHO_COLORS.map(c=>`<button type="button" data-c="${c}" style="background:${c}" aria-pressed="${c===color}" aria-label="색 선택"></button>`).join('')}
    </div></div>
    <button type="button" class="primary" id="memSave">${isNew?'추가':'저장'}</button>
    ${isNew?'':'<p class="note" style="margin:0;text-align:left">이름을 바꾸면 지난 기록은 예전 이름으로 남아요.</p>'}
    <button type="button" class="secondary" id="memBack">목록으로</button>`,
  sheet=>{
    sheet.querySelectorAll('#memColors button').forEach(b=>b.onclick=()=>{
      color=b.dataset.c; sheet.querySelectorAll('#memColors button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    });
    $('memBack').onclick=membersSheet;
    $('memSave').onclick=()=>{
      const nm=$('memName').value.trim().slice(0,12);
      if(!nm){ $('memName').focus(); toast('이름을 입력해 주세요'); return; }
      const rest=S.cfg.members.filter(x=>x.name!==m.name && x.name!==nm);
      saveCfg({...S.cfg, members:[...rest,{name:nm,color}]});
      if(m.name && m.name===S.me) setMe(nm);
      membersSheet(); toast(isNew?`${nm}님을 추가했어요`:'저장했어요');
    };
  });
}

/* ---------- 강아지 전환 · 추가 ---------- */
function dogsSheet(){
  openSheet(`
    <h3>강아지</h3>
    <div class="ilist">${S.cfg.dogs.map(d=>`<div class="irow">
      <button type="button" class="irow-main" data-dog="${esc(d.id)}">
        <span class="dog-av">${S.photos[d.id]?`<img src="${S.photos[d.id]}" alt="">`:icon('heart',18)}</span>
        <span class="irow-name">${esc(d.name)}</span>
        ${d.id===curDog().id?'<span class="irow-goal">보는 중</span>':''}
      </button>
      ${S.cfg.dogs.length>1?`<button type="button" class="irow-del" data-dogdel="${esc(d.id)}" aria-label="${esc(d.name)} 삭제">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13"/></svg></button>`:''}
    </div>`).join('')}</div>
    <button type="button" class="secondary" id="dogAdd">+ 강아지 추가하기</button>
    <p class="note" style="margin:0;text-align:left">케어 목록과 가족은 함께 쓰고, 기록·사진·정보는 강아지마다 따로 남아요.</p>
    <button type="button" class="primary" id="dogDone">완료</button>`,
  sheet=>{
    sheet.querySelectorAll('[data-dog]').forEach(b=>b.onclick=()=>{
      S.dog=b.dataset.dog; ls.set('dogcare.dog',S.dog); closeSheet(); render(); toast(`${curDog().name} 기록을 보고 있어요`);
    });
    sheet.querySelectorAll('[data-dogdel]').forEach(b=>b.onclick=()=>{
      const d=S.cfg.dogs.find(x=>x.id===b.dataset.dogdel);
      confirmSheet(`${d.name}를 목록에서 뺄까요?`,'이 강아지의 기록은 화면에 보이지 않게 돼요.',()=>{
        saveCfg({...S.cfg, dogs:S.cfg.dogs.filter(x=>x.id!==d.id)}); dogsSheet(); toast('뺐어요');
      });
    });
    $('dogAdd').onclick=()=>{
      openSheet(`<h3>강아지 추가</h3>
        <div class="field"><label for="newDog">이름</label><input id="newDog" type="text" maxlength="14" placeholder="예: 두부"></div>
        <button type="button" class="primary" id="newDogSave">추가</button>
        <button type="button" class="secondary" id="newDogBack">뒤로</button>`,
      ()=>{
        $('newDogBack').onclick=dogsSheet;
        $('newDogSave').onclick=()=>{
          const nm=$('newDog').value.trim(); if(!nm){ $('newDog').focus(); return; }
          const id='d'+Date.now().toString(36);
          saveCfg({...S.cfg, dogs:[...S.cfg.dogs, {id, name:nm, profile:{...DEFAULT_PROFILE}}]});
          S.dog=id; ls.set('dogcare.dog',id); render(); dogsSheet(); toast(`${nm} 추가 완료`);
        };
      });
    };
    $('dogDone').onclick=menuSheet;
  });
}

/* ---------- 사료 · 간식 재고 ---------- */
function supplyState(x){
  const used=Math.max(0,daysBetween(x.updated,todayKey()))*x.perDay;
  const remain=Math.max(0,x.remain-used);
  const daysLeft=x.perDay>0?Math.floor(remain/x.perDay):null;
  return {remain:Math.round(remain*10)/10, daysLeft, outDate:daysLeft!==null?shiftKey(todayKey(),daysLeft):null};
}
const daysBetween=(a,b)=>Math.round((parseKey(b)-parseKey(a))/864e5);
function suppliesSheet(){
  const list=S.cfg.supplies;
  openSheet(`
    <h3>사료 · 간식 재고</h3>
    <p style="margin:0;color:var(--muted);font-size:13px">남은 양과 하루 사용량을 적어두면 언제 떨어질지 계산해 드려요.</p>
    <div class="ilist">${list.length?list.map(x=>{
      const st=supplyState(x), pct=x.remain>0?Math.round(st.remain/x.remain*100):0;
      const warn=st.daysLeft!==null&&st.daysLeft<=7;
      return `<div class="irow"><button type="button" class="irow-main" data-sup="${esc(x.id)}">
        <span class="ic">${icon('food',20)}</span>
        <span class="menu-txt"><b>${esc(x.name)}</b>
          <span>${st.remain}${x.unit} 남음${st.daysLeft!==null?` · ${st.daysLeft===0?'오늘 소진':`약 ${st.daysLeft}일치`}`:''}</span>
          <span class="bar-track" style="margin-top:6px"><i class="${warn?'warnbar':''}" style="width:${Math.max(2,Math.min(100,pct))}%"></i></span>
        </span></button>
        <button type="button" class="irow-del" data-supdel="${esc(x.id)}" aria-label="${esc(x.name)} 삭제">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13"/></svg></button></div>`;
    }).join(''):'<div class="empty">등록한 재고가 없어요</div>'}</div>
    <button type="button" class="secondary" id="supAdd">+ 재고 추가하기</button>
    <button type="button" class="primary" id="supDone">완료</button>`,
  sheet=>{
    sheet.querySelectorAll('[data-sup]').forEach(b=>b.onclick=()=>supplyEditSheet(b.dataset.sup));
    sheet.querySelectorAll('[data-supdel]').forEach(b=>b.onclick=()=>{
      const x=S.cfg.supplies.find(v=>v.id===b.dataset.supdel);
      confirmSheet(`${x.name} 재고를 삭제할까요?`,'',()=>{ saveCfg({...S.cfg, supplies:S.cfg.supplies.filter(v=>v.id!==x.id)}); suppliesSheet(); toast('삭제했어요'); });
    });
    $('supAdd').onclick=()=>supplyEditSheet(null);
    $('supDone').onclick=menuSheet;
  });
}
function supplyEditSheet(id){
  const isNew=!id;
  const x=isNew?normSupply({name:'',unit:'g'}):{...S.cfg.supplies.find(v=>v.id===id)};
  const st=isNew?null:supplyState(x);
  let unit=x.unit;
  openSheet(`
    <h3>${isNew?'재고 추가':'재고 수정'}</h3>
    <div class="field"><label for="supName">이름</label><input id="supName" type="text" maxlength="16" value="${esc(x.name)}" placeholder="예: 연어 사료"></div>
    <div class="field"><label>단위</label><div class="chips" id="supUnit">
      ${['g','kg','개','포','캔'].map(u=>`<button type="button" class="chip" data-u="${u}" aria-pressed="${u===unit}">${u}</button>`).join('')}</div></div>
    <div class="grid2">
      <div class="field"><label for="supRemain">남은 양</label><input id="supRemain" type="number" inputmode="decimal" step="0.1" min="0" value="${isNew?'':st.remain}" placeholder="0"></div>
      <div class="field"><label for="supPerDay">하루 사용량</label><input id="supPerDay" type="number" inputmode="decimal" step="0.1" min="0" value="${x.perDay||''}" placeholder="0"></div>
    </div>
    ${isNew?'':`<p class="note" style="margin:0;text-align:left">${st.daysLeft!==null?`지금 속도면 ${st.outDate.replace(/-/g,'.')}쯤 떨어져요.`:'하루 사용량을 적으면 소진 예상일을 알려드려요.'}</p>`}
    <button type="button" class="primary" id="supSave">${isNew?'추가':'저장'}</button>
    <button type="button" class="secondary" id="supBack">목록으로</button>`,
  sheet=>{
    sheet.querySelectorAll('#supUnit .chip').forEach(b=>b.onclick=()=>{
      unit=b.dataset.u; sheet.querySelectorAll('#supUnit .chip').forEach(c=>c.setAttribute('aria-pressed',String(c===b)));
    });
    $('supBack').onclick=suppliesSheet;
    $('supSave').onclick=()=>{
      const name=$('supName').value.trim(); if(!name){ $('supName').focus(); toast('이름을 입력해 주세요'); return; }
      const next=normSupply({...x, name, unit, remain:$('supRemain').value, perDay:$('supPerDay').value, updated:todayKey()});
      const rest=S.cfg.supplies.filter(v=>v.id!==next.id);
      saveCfg({...S.cfg, supplies:[...rest,next]});
      suppliesSheet(); toast(isNew?'추가했어요':'저장했어요');
    };
  });
}

/* ---------- 지출 기록 ---------- */
const EXP_CATS=['사료','간식','병원','미용','용품','기타'];
const wonFmt=n=>Number(n||0).toLocaleString('ko-KR');
async function expenseSheet(ym){
  const month=ym||todayKey().slice(0,7);
  openSheet('<h3>지출</h3><div class="empty">불러오는 중…</div>',null,{full:true,title:'지출'});
  const doc=await store.getDocData('expenses/'+month) || {};
  const items=Object.entries(doc.items||{}).map(([id,v])=>({id,...v})).sort((a,b)=>b.t-a.t);
  const total=items.reduce((a,b)=>a+(Number(b.amount)||0),0);
  const byCat={}; items.forEach(i=>{ byCat[i.cat||'기타']=(byCat[i.cat||'기타']||0)+(Number(i.amount)||0); });
  const [y,m]=month.split('-').map(Number);
  const prev=`${m===1?y-1:y}-${String(m===1?12:m-1).padStart(2,'0')}`;
  const next=`${m===12?y+1:y}-${String(m===12?1:m+1).padStart(2,'0')}`;
  openSheet(`
    <div class="datebar">
      <button class="navbtn" id="expPrev" type="button" aria-label="이전 달">‹</button>
      <div class="d">${y}년 ${m}월<small>총 ${wonFmt(total)}원</small></div>
      <button class="navbtn" id="expNext" type="button" aria-label="다음 달" ${next>todayKey().slice(0,7)?'disabled':''}>›</button>
    </div>
    ${Object.keys(byCat).length?`<div class="bars">${Object.entries(byCat).sort((a,b)=>b[1]-a[1]).map(([c,v])=>`
      <div class="bar"><span class="bar-name">${esc(c)}</span>
        <span class="bar-track"><i style="width:${total?Math.round(v/total*100):0}%"></i></span>
        <span class="bar-val num">${wonFmt(v)}</span></div>`).join('')}</div>`:''}
    <button type="button" class="secondary" id="expAdd">+ 지출 추가하기</button>
    <div class="timeline">${items.length?items.map(i=>`
      <div class="row exp-row">
        <span class="time num">${new Date(i.t).getDate()}일</span>
        <span class="what"><b>${esc(i.cat||'기타')}</b>${i.memo?` <span>· ${esc(i.memo)}</span>`:''}<br>${whoDot(i.by)}</span>
        <span class="num exp-amt">${wonFmt(i.amount)}원</span>
        <button class="del" type="button" data-expdel="${esc(i.id)}" aria-label="삭제">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      </div>`).join(''):'<div class="empty">이 달 지출 기록이 없어요</div>'}</div>`,
  sheet=>{
    $('expPrev').onclick=()=>expenseSheet(prev);
    $('expNext').onclick=()=>{ if(next<=todayKey().slice(0,7)) expenseSheet(next); };
    $('expAdd').onclick=()=>expenseAddSheet(month);
    sheet.querySelectorAll('[data-expdel]').forEach(b=>b.onclick=()=>{
      const it=items.find(x=>x.id===b.dataset.expdel);
      confirmSheet('이 지출을 삭제할까요?',`${it.cat} ${wonFmt(it.amount)}원`,async()=>{
        const rest={}; items.filter(x=>x.id!==it.id).forEach(x=>{ const {id,...v}=x; rest[id]=v; });
        await store.setDocData('expenses/'+month,{items:rest},false);
        expenseSheet(month); toast('삭제했어요');
      });
    });
  },{full:true,title:'지출'});
}
function expenseAddSheet(month){
  let cat=EXP_CATS[0];
  openSheet(`
    <h3>지출 추가</h3>
    <div class="field"><label>분류</label><div class="chips" id="expCats">
      ${EXP_CATS.map(c=>`<button type="button" class="chip" data-c="${c}" aria-pressed="${c===cat}">${c}</button>`).join('')}</div></div>
    <div class="field"><label for="expAmt">금액 (원)</label><input id="expAmt" type="number" inputmode="numeric" min="0" step="100" placeholder="0"></div>
    <div class="field"><label for="expDate">날짜</label><input id="expDate" type="date" value="${todayKey().slice(0,7)===month?todayKey():month+'-01'}"></div>
    <div class="field"><label for="expMemo">메모 (선택)</label><input id="expMemo" type="text" maxlength="40" placeholder="예: 정기 검진"></div>
    <button type="button" class="primary" id="expSave">저장</button>
    <button type="button" class="secondary" id="expBack">목록으로</button>`,
  sheet=>{
    sheet.querySelectorAll('#expCats .chip').forEach(b=>b.onclick=()=>{
      cat=b.dataset.c; sheet.querySelectorAll('#expCats .chip').forEach(c=>c.setAttribute('aria-pressed',String(c===b)));
    });
    $('expBack').onclick=()=>expenseSheet(month);
    $('expSave').onclick=async()=>{
      const amount=Math.round(Number($('expAmt').value)||0);
      if(amount<=0){ $('expAmt').focus(); toast('금액을 입력해 주세요'); return; }
      const dk=$('expDate').value||todayKey();
      const id='x'+Date.now().toString(36);
      await store.setDocData('expenses/'+dk.slice(0,7),{items:{[id]:{t:parseKey(dk).getTime(),amount,cat,memo:$('expMemo').value.trim(),by:S.me||'',dog:curDog().id}}},true);
      expenseSheet(dk.slice(0,7)); toast(`${cat} ${wonFmt(amount)}원 기록했어요`);
    };
  });
}

/* ---------- 사진 일지 ---------- */
const photoIndexPath = (ym)=>`photos/${ym}_${curDog().id}`;
const photoFullPath = (dk)=>`photofull/${dk}_${curDog().id}`;
async function diarySheet(ym){
  const month=ym||todayKey().slice(0,7);
  openSheet('<div class="empty">불러오는 중…</div>',null,{full:true,title:'사진 일지'});
  const doc=await store.getDocData(photoIndexPath(month)) || {};
  const days=doc.days||{};
  const keys=Object.keys(days).sort().reverse();
  const [y,m]=month.split('-').map(Number);
  const prev=`${m===1?y-1:y}-${String(m===1?12:m-1).padStart(2,'0')}`;
  const next=`${m===12?y+1:y}-${String(m===12?1:m+1).padStart(2,'0')}`;
  openSheet(`
    <div class="datebar">
      <button class="navbtn" id="diPrev" type="button" aria-label="이전 달">‹</button>
      <div class="d">${y}년 ${m}월<small>${curDog().name} · 사진 ${keys.length}장</small></div>
      <button class="navbtn" id="diNext" type="button" aria-label="다음 달" ${next>todayKey().slice(0,7)?'disabled':''}>›</button>
    </div>
    <button type="button" class="secondary" id="diAdd">+ 오늘 사진 추가</button>
    ${keys.length?`<div class="digrid">${keys.map(k=>`
      <button type="button" class="dicell" data-day="${k}">
        <img src="${days[k].thumb}" alt="${k}">
        <span>${Number(k.slice(8,10))}일</span>
      </button>`).join('')}</div>`:'<div class="empty">이 달 사진이 없어요</div>'}
    <p class="note" style="margin:0">하루에 한 장씩 남겨 보세요. 사진은 가족 모두가 볼 수 있어요.</p>`,
  sheet=>{
    $('diPrev').onclick=()=>diarySheet(prev);
    $('diNext').onclick=()=>{ if(next<=todayKey().slice(0,7)) diarySheet(next); };
    $('diAdd').onclick=()=>addDiaryPhoto(month);
    sheet.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>openDiaryPhoto(b.dataset.day, days[b.dataset.day]));
  },{full:true,title:'사진 일지'});
}
function addDiaryPhoto(month){
  const inp=document.createElement('input'); inp.type='file'; inp.accept='image/*';
  inp.onchange=async()=>{
    const f=inp.files&&inp.files[0]; if(!f) return;
    toast('사진을 준비하는 중…');
    try{
      const full=await shrinkImage(f);
      const thumb=await shrinkImage(f,{max:200,quality:.6});
      const dk=todayKey();
      await store.setDocData(photoFullPath(dk),{data:full,by:S.me||'',t:Date.now()},false);
      await store.setDocData(photoIndexPath(dk.slice(0,7)),{days:{[dk]:{thumb,by:S.me||'',t:Date.now()}}},true);
      toast('사진을 올렸어요');
      diarySheet(dk.slice(0,7));
    }catch(e){ console.error(e); toast('이 사진은 쓸 수 없어요. 다른 사진을 골라 주세요'); }
  };
  inp.click();
}
async function openDiaryPhoto(dk, meta){
  const lb=$('lightbox'); $('lbImg').src=meta.thumb; $('lbCap').textContent=`${dk.slice(5).replace('-','월 ')}일`; lb.hidden=false; lockScroll();
  const full=await store.getDocData(photoFullPath(dk));
  if(full&&full.data&&!lb.hidden) $('lbImg').src=full.data;
  if(meta.by&&!lb.hidden) $('lbCap').textContent=`${dk.slice(5).replace('-','월 ')}일 · ${meta.by}`;
}

/* ---------- 강아지 사진 ---------- */
function pickPhoto(){
  const inp=document.createElement('input'); inp.type='file'; inp.accept='image/*';
  inp.onchange=async()=>{
    const f=inp.files&&inp.files[0]; if(!f) return;
    toast('사진을 준비하는 중…');
    try{
      const data=await shrinkImage(f);
      S.photos={...S.photos,[curDog().id]:data}; store.savePhoto(S.photos); render();
      if($('sheetHost').innerHTML && $('photoPrev')) settingsSheet();
      toast('사진을 저장했어요');
    }catch(e){ console.error(e); toast('이 사진은 쓸 수 없어요. 다른 사진을 골라 주세요'); }
  };
  inp.click();
}
// 사진을 줄여 Firestore 문서 한 개(최대 1MB)에 담기. (Firebase Storage는 유료 요금제가 필요해서 사용하지 않음)
async function shrinkImage(file, opt){
  const url=URL.createObjectURL(file);
  try{
    const img=await new Promise((res,rej)=>{ const i=new Image(); i.onload=()=>res(i); i.onerror=rej; i.src=url; });
    const steps = opt&&opt.max ? [[opt.max,opt.quality||.7]] : [[1280,.82],[1024,.78],[800,.72],[640,.65]];
    for(const [max,q] of steps){
      const r=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));
      const c=document.createElement('canvas'); c.width=Math.round(img.naturalWidth*r); c.height=Math.round(img.naturalHeight*r);
      c.getContext('2d').drawImage(img,0,0,c.width,c.height);
      const d=c.toDataURL('image/jpeg',q);
      if(d.length<700000 || (opt&&opt.max)) return d;
    }
    throw new Error('too large');
  } finally { URL.revokeObjectURL(url); }
}
function openLightbox(){
  if(!curPhoto()) return;
  const lb=$('lightbox'); $('lbImg').src=curPhoto(); $('lbCap').textContent=curDog().name; lb.hidden=false; lockScroll();
}
function closeLightbox(){ if($('lightbox').hidden) return; $('lightbox').hidden=true; if(!$('sheetHost').innerHTML) unlockScroll(); }

function summaryText(){
  const list=entriesOf(S.view), count=k=>list.filter(e=>e.type===k).length;
  const items=activeItems(), d=parseKey(S.view);
  const done=[], left=[], extra=[];
  items.forEach(t=>{
    const n=count(t.k);
    if(t.target>0){ (n>=t.target?done:left).push(`${t.name} ${n}/${t.target}`); }
    else if(n) extra.push(`${t.name} ${n}회`);
  });
  const lines=[`[${curDog().name}] ${d.getMonth()+1}월 ${d.getDate()}일 케어`];
  if(done.length) lines.push(`완료: ${done.join(', ')}`);
  if(left.length) lines.push(`남음: ${left.join(', ')}`);
  if(extra.length) lines.push(`기록: ${extra.join(', ')}`);
  if(!done.length&&!left.length&&!extra.length) lines.push('아직 기록이 없어요');
  return lines.join('\n');
}
async function shareToday(){
  const text=summaryText();
  if(navigator.share){ try{ await navigator.share({title:`${curDog().name} 케어`,text}); return; }catch(e){ if(e&&e.name==='AbortError') return; } }
  try{ await navigator.clipboard.writeText(text); toast('요약을 복사했어요'); return; }catch(e){}
  openSheet(`<h3>오늘 요약</h3><div class="linkbox" style="white-space:pre-wrap">${esc(text)}</div>
    <button type="button" class="primary" id="sumClose">닫기</button>`, ()=>{ $('sumClose').onclick=closeSheet; });
}

function menuSheet(){
  const rows=[
    {ic:'star',  t:'기록 돌아보기', d:'달력 · 항목별 달성률 · 가족별 기록', fn:()=>statsSheet()},
    {ic:'heart', t:'강아지 정보',   d:`사진 · 품종 · 생일 · 몸무게`, fn:settingsSheet},
    {ic:'brush', t:'케어 목록 편집', d:'항목 추가 · 아이콘 · 목표 · 선택지', fn:itemsSheet},
    {ic:'eye',   t:'사진 일지',      d:'하루 한 장씩 모으는 앨범', fn:()=>diarySheet()},
    {ic:'food',  t:'사료 · 간식 재고', d:'남은 양과 소진 예상일', fn:suppliesSheet},
    {ic:'scale', t:'지출 기록',      d:'사료 · 병원비 · 미용비 월별 정리', fn:()=>expenseSheet()},
    {ic:'walk',  t:'가족 · 기록자',   d:'이름과 색 설정', fn:membersSheet},
    {ic:'heart', t:'강아지 전환 · 추가', d:S.cfg.dogs.map(d=>d.name).join(' · '), fn:dogsSheet},
    {ic:'home',  t:'가족 초대',     d:'초대 링크 만들어 보내기', fn:inviteSheet},
    {ic:'eye',   t:'오늘 요약 공유', d:'가족 단톡방에 오늘 상황 보내기', fn:shareToday},
    {ic:'bell',  t:'알림', d:(notifyOn()?'켜짐':'꺼짐')+' — 가족이 기록하면 알려줘요', fn:()=>toggleNotify().then(menuSheet)}
  ];
  openSheet(`
    <button type="button" class="menu-me" id="menuMe">
      <span class="menu-me-label">기록자</span>
      <b>${esc(S.me||'이름 선택하기')}</b>
      <span class="menu-me-go">바꾸기</span>
    </button>
    <div class="menu-list">
      ${rows.map((r,i)=>`<button type="button" class="menu-row" data-i="${i}">
        <span class="ic">${icon(r.ic,20)}</span>
        <span class="menu-txt"><b>${esc(r.t)}</b><span>${esc(r.d)}</span></span>
        <span class="menu-arrow">›</span>
      </button>`).join('')}
    </div>
    <p class="note" style="margin:0" id="menuNote"></p>`,
  sheet=>{
    $('menuMe').onclick=()=>nameSheet(menuSheet);
    sheet.querySelectorAll('.menu-row').forEach(b=>b.onclick=()=>rows[+b.dataset.i].fn());
    $('menuNote').textContent=$('syncNote').textContent;
  }, {full:true, title:'메뉴'});
}

function inviteSheet(){
  let who='', url=inviteUrl();
  const names=knownNames().filter(n=>n!=='나'&&n!==S.me);
  openSheet(`
    <h3>가족 초대</h3>
    <p style="margin:0;color:var(--muted)">받는 사람 이름을 고르면 그 사람 전용 링크가 만들어져요. 그 링크로 열면 이름을 따로 고를 필요가 없어요.</p>
    <div class="field"><label>받는 사람</label>
      <div class="chips" id="whoChips">${names.map(n=>`<button type="button" class="chip" aria-pressed="false" data-n="${esc(n)}">${esc(n)}</button>`).join('')}</div>
      <input id="whoInput" type="text" maxlength="12" placeholder="직접 입력 (비워 두면 공용 링크)">
    </div>
    <div class="linkbox" id="inviteLink">${esc(url)}</div>
    <p class="note" style="margin:0;text-align:left">링크를 받은 사람은 누구나 기록을 보고 남길 수 있어요. 가족에게만 보내 주세요.</p>
    <div class="row2">
      <button class="secondary" id="copyBtn" type="button">링크 복사</button>
      <button class="primary" id="shareBtn" type="button">공유하기</button>
    </div>
    <p class="note" style="margin:0">받은 사람은 링크를 연 뒤 공유 버튼 → '홈 화면에 추가'를 누르면 앱처럼 쓸 수 있어요.</p>`,
  sheet=>{
    const upd=()=>{ url=inviteUrl(who); $('inviteLink').textContent=url; };
    sheet.querySelectorAll('#whoChips .chip').forEach(c=>c.onclick=()=>{
      const on=c.getAttribute('aria-pressed')!=='true';
      sheet.querySelectorAll('#whoChips .chip').forEach(x=>x.setAttribute('aria-pressed','false'));
      c.setAttribute('aria-pressed',String(on)); who=on?c.dataset.n:''; $('whoInput').value=who; upd();
    });
    $('whoInput').oninput=()=>{ who=cleanName($('whoInput').value);
      sheet.querySelectorAll('#whoChips .chip').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.n===who))); upd(); };
    $('copyBtn').onclick=async()=>{
      try{ await navigator.clipboard.writeText(url); toast('링크를 복사했어요'); }
      catch(e){ const r=document.createRange(); r.selectNodeContents($('inviteLink')); const s=getSelection(); s.removeAllRanges(); s.addRange(r); toast('링크를 길게 눌러 복사해 주세요'); }
    };
    $('shareBtn').onclick=async()=>{
      if(navigator.share){ try{ await navigator.share({title:`${curDog().name} 케어노트`,text:`${who?who+'님, ':''}${curDog().name} 케어 기록 같이 써요!`,url}); }catch(e){} }
      else $('copyBtn').click();
    };
  });
}

let toastTimer;
function toast(msg, undo){
  $('toastHost').innerHTML=`<div class="toast" role="status"><span>${esc(msg)}</span>${undo?'<button type="button" id="toastUndo">취소</button>':''}</div>`;
  if(undo) $('toastUndo').onclick=()=>{ $('toastHost').innerHTML=''; clearTimeout(toastTimer); undo(); };
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('toastHost').innerHTML='', undo?5000:2200);
}

/* ================= 이벤트 ================= */
/* 탭 = 자세히 기록, 길게 누르기 = 지금 시각으로 바로 기록 */
let pressTimer=null, pressed=false;
$('tiles').addEventListener('pointerdown',e=>{
  const b=e.target.closest('.tile'); if(!b) return;
  pressed=false;
  pressTimer=setTimeout(()=>{ pressed=true; quickLog(b.dataset.type); },550);
});
['pointerup','pointercancel','pointerleave','pointermove'].forEach(ev=>
  $('tiles').addEventListener(ev,e=>{ if(ev==='pointermove'&&!pressTimer) return; clearTimeout(pressTimer); pressTimer=null; }));
$('tiles').addEventListener('click',e=>{
  const b=e.target.closest('.tile'); if(!b) return;
  if(pressed){ pressed=false; return; }
  logSheet(b.dataset.type);
});
$('upcoming').addEventListener('click',e=>{ const b=e.target.closest('[data-due]'); if(b) logSheet(b.dataset.due); });

$('timeline').addEventListener('click',e=>{
  const row=e.target.closest('[data-edit-entry]');
  if(row && !e.target.closest('[data-del]')){ entryEditSheet(row.dataset.editEntry); return; }
  const b=e.target.closest('[data-del]'); if(!b) return;
  const en=entriesOf(S.view).find(x=>x.id===b.dataset.del);
  const nm=en&&T[en.type]?T[en.type].name:'기록';
  confirmSheet(`${nm} 기록을 삭제할까요?`, en?`${hm(en.t)}${en.status?` · ${en.status}`:''}${en.by?` · ${en.by}`:''}`:'', ()=>{
    const day=S.view, id=b.dataset.del, backup=en&&{type:en.type,t:en.t,by:en.by,status:en.status,note:en.note};
    store.removeEntry(day,id);
    toast('기록을 지웠어요', backup?()=>{ store.updateEntry(day,id,backup); toast('되돌렸어요'); }:null);
  });
});
$('prevDay').onclick=()=>goDay(-1);
$('nextDay').onclick=()=>goDay(1);
$('kakaoOpen').onclick=()=>{ location.href='kakaotalk://web/openExternal?url='+encodeURIComponent(location.href); };
$('menuBtn').onclick=menuSheet;
$('dogName').onclick=()=>{ if(S.fid && S.cfg.dogs.length>1) dogsSheet(); };
$('tiles').addEventListener('click',e=>{
  if(e.target.closest('#doneToggle')){ S.showDone=!S.showDone; ls.set('dogcare.showDone',S.showDone?'1':'0'); render(); }
});
$('tiles').addEventListener('click',e=>{ if(e.target.closest('#noItems')) itemsSheet(); });
$('faceBtn').onclick=()=>{ if(!S.fid) return; if(curPhoto()) openLightbox(); else pickPhoto(); };
$('lightbox').onclick=e=>{ if(e.target.id==='lbChange'){ closeLightbox(); pickPhoto(); return; } closeLightbox(); };
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeLightbox(); });
$('profile').addEventListener('click',e=>{ if(e.target.closest('[data-open]')) settingsSheet(); });

/* 5. 테마 원클릭 전환 (이 기기에만 저장) */
const mqDark=matchMedia('(prefers-color-scheme: dark)');
function effTheme(){ return document.documentElement.dataset.theme || (mqDark.matches?'dark':'light'); }
function applyTheme(t){
  if(t) document.documentElement.dataset.theme=t; else delete document.documentElement.dataset.theme;
  const dark=effTheme()==='dark';
  $('themeBtn').innerHTML = dark
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>';
  $('themeBtn').setAttribute('aria-label', dark?'밝은 테마로 바꾸기':'어두운 테마로 바꾸기');
  const m=document.querySelector('meta[name="theme-color"]'); if(m) m.content=dark?'#101614':'#0E6B5C';
}
applyTheme(ls.get('dogcare.theme'));
mqDark.addEventListener?.('change',()=>applyTheme(document.documentElement.dataset.theme));
$('themeBtn').onclick=()=>{ const next=effTheme()==='dark'?'light':'dark'; ls.set('dogcare.theme',next); applyTheme(next); };

/* 6. 좌우 스와이프로 날짜 이동 */
function goDay(n){
  if(!S.fid) return;
  const next=shiftKey(S.view,n);
  if(n>0 && next>todayKey()){ toast('오늘 이후로는 갈 수 없어요'); return; }
  S.view=next; render();
  const m=$('dayArea'); m.classList.remove('slide-l','slide-r'); void m.offsetWidth; m.classList.add(n>0?'slide-l':'slide-r');
}
let sw=null;
document.addEventListener('touchstart',e=>{
  if($('sheetHost').innerHTML || !$('lightbox').hidden || !S.fid || e.touches.length!==1 || e.target.closest('input,textarea')) { sw=null; return; }
  const t=e.touches[0]; sw={x:t.clientX,y:t.clientY,t:Date.now()};
},{passive:true});
document.addEventListener('touchend',e=>{
  if(!sw) return; const t=e.changedTouches[0];
  const dx=t.clientX-sw.x, dy=t.clientY-sw.y, dt=Date.now()-sw.t; sw=null;
  if(Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)*1.6 && dt<700) goDay(dx<0?1:-1);
},{passive:true});
$('createBtn').onclick=()=>{ setFid(makeFid()); start(inviteSheet); };
$('joinBtn').onclick=()=>{ const f=fidFromText($('joinInput').value); if(!f){toast('초대 링크를 다시 확인해 주세요');return} setFid(f); start(); };
setInterval(render,60000);
// 스크롤하면 헤더에 경계선 표시
addEventListener('scroll',()=>{ const h=$('appHeader'); if(h) h.classList.toggle('stuck',(window.scrollY||0)>6); },{passive:true});
document.addEventListener('visibilitychange',()=>{ if(!document.hidden) render(); });

/* ================= 시작 ================= */
async function start(after){
  S.view=todayKey(); render();
  await loadConfig();
  const configured = firebaseConfig && firebaseConfig.apiKey && !String(firebaseConfig.apiKey).startsWith('YOUR');
  const demo = new URLSearchParams(location.search).has('demo');
  if(demo||!configured){
    store=memoryStore(); S.status=demo?'demo':(cfgError?'cfgerr':'nocfg');
  } else {
    try{ store=await firebaseStore(S.fid); S.status='connecting'; }
    catch(e){ console.error(e); store=memoryStore(); S.status='error'; }
  }
  store.subscribeDays((days,fromCache)=>{
    notifyChanges(days);
    S.days=days;
    if(S.status==='connecting'||S.status==='live'||S.status==='offline') S.status=fromCache&&!navigator.onLine?'offline':'live';
    render();
  });
  store.subscribeConfig(c=>{
    const before=S.cfg?S.cfg.items.map(i=>i.k+':'+i.name+':'+i.target+':'+i.hidden).join('|'):null;
    setCfg(c);
    const after=S.cfg.items.map(i=>i.k+':'+i.name+':'+i.target+':'+i.hidden).join('|');
    if(seeded && before!==null && before!==after) notify('케어 목록이 바뀌었어요','가족 중 누군가 항목이나 목표를 수정했어요');
    render();
  });
  store.subscribePhoto(d=>{ S.photos=d&&typeof d==='object'?{...d}:{}; render(); });
  render();
  if(after) setTimeout(()=>{ if($('sheetHost').innerHTML) return; if(!S.me) nameSheet(after); else after(); },300);
  try{ navigator.storage && navigator.storage.persist && navigator.storage.persist(); }catch(e){}
}
addEventListener('online',()=>{ if(S.status==='offline'){S.status='live';render();} });
addEventListener('offline',()=>{ if(S.status==='live'){S.status='offline';render();} });

(function boot(){
  const params=new URLSearchParams(location.search);
  if(params.get('me')) setMe(params.get('me'));
  else if(S.me) setMe(S.me);
  const f=params.get('f');
  if(params.has('demo')){ S.fid='demo'; start(); return; }
  if(f&&FID_RE.test(f)){ setFid(f); start(); return; }
  const saved=ls.get('dogcare.fid');
  if(saved&&FID_RE.test(saved)){ setFid(saved); start(); return; }
  render(); // 처음 화면
})();
window.__test={notifyChanges,setMeForTest:v=>{S.me=v},days:()=>S.days};
