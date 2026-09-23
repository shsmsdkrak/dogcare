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
    pick:(i.pick==='chip'||i.pick==='select')?i.pick:'',
    cycle:Math.max(0,Math.min(400,parseInt(i.cycle)||0)) };
}
function defaultItems(targets){
  const tg={...DEFAULT_TARGETS,...(targets||{})};
  return TYPES.map(t=>normItem({...t, icon:t.k, target:tg[t.k]}));
}
function normCfg(c){ c=c||{};
  return {dogName:c.dogName||'우리 강아지', profile:{...DEFAULT_PROFILE,...(c.profile||{})},
    items: Array.isArray(c.items)&&c.items.length ? c.items.map(normItem) : defaultItems(c.targets)};
}
let T = {};
function setCfg(c){ S.cfg=normCfg(c); T=Object.fromEntries(S.cfg.items.map(i=>[i.k,i])); }
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

const S = {days:{}, cfg:null, photo:'', view:todayKey(), me:ls.get('dogcare.me')||'', status:'connecting', fid:null};
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
    subscribePhoto(cb){ return fs.onSnapshot(photoRef, s=>cb(s.exists()?s.data().data:''), ()=>{}); },
    savePhoto(data){ fs.setDoc(photoRef,{data:data||'',updatedAt:Date.now(),by:S.me||''}).catch(fail); }
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
    savePhoto(d){ this._pcb&&this._pcb(d); }
  };
}

/* ================= 데이터 헬퍼 ================= */
function entriesOf(key){
  const e=(S.days[key]&&S.days[key].entries)||{};
  return Object.entries(e).map(([id,v])=>({id,...v})).filter(x=>x&&T[x.type]).sort((a,b)=>b.t-a.t);
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
  const s=new Set(['엄마','아빠','언니','오빠','누나','형','나']);
  for(const k of Object.keys(S.days)) for(const e of entriesOf(k)) if(e.by) s.add(e.by);
  return [...s].slice(0,12);
}
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
  $('dogName').textContent=cfg.dogName||'우리 강아지';
  const fi=$('faceImg'); if(S.photo){ if(fi.src!==S.photo) fi.src=S.photo; fi.hidden=false; $('faceSvg').hidden=true; } else { fi.hidden=true; fi.removeAttribute('src'); $('faceSvg').hidden=false; }
  $('faceBtn').setAttribute('aria-label', S.photo?`${cfg.dogName} 사진 크게 보기`:`${cfg.dogName} 사진 추가`);
  renderProfile();
  document.title=`${cfg.dogName||'우리 강아지'} 케어노트`;
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

  $('tiles').innerHTML=items.map(t=>{
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
    const dots=goal>0&&goal<=4?`<div class="dots">${Array.from({length:goal},(_,i)=>`<i class="${i<n?'on':''}"></i>`).join('')}</div>`:'';
    const streak=t.streak?streakOf(t.k):0;
    const badge=streak>=2?`<span class="badge">${streak}일 연속</span>`:'';
    const cnt=`<span class="cnt num ${done?'done':''}">${n}${goal?`<small style="font-size:14px">/${goal}</small>`:''}</span>`;
    return `<button class="tile ${done?'complete':''} ${partial?'partial':''} ${warn&&isToday?'alert':''}" type="button" data-type="${t.k}">
      <div class="top"><span class="ic">${icon(t.icon)}</span>${partial?`<span class="partmark num">${goal-n}회 남음</span>`:''}${done?'<span class="donemark"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>완료</span>':(badge||cnt)}</div>
      <div class="name">${esc(t.name)}${(badge||done)?` ${cnt.replace('font-size:14px','font-size:12px')}`:''}</div>
      ${dots}
      <div class="last ${warn&&isToday?'warn':''}">${lastTxt}</div>
    </button>`;
  }).join('');

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
      <span class="what"><b>${esc(T[e.type].name)}</b>${e.status?` <span>· ${esc(e.status)}</span>`:''}${e.note?` <span>· ${esc(e.note)}</span>`:''}<br><span>${esc(e.by||'')}</span></span>
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
  const p=S.cfg.profile||DEFAULT_PROFILE;
  const bits=[p.breed, p.sex?(p.sex+(p.neutered?' · 중성화':'')):'', ageText(p.birth), p.weight?`${p.weight}kg`:''].filter(Boolean);
  const together=daysSince(p.adopted);
  const el=$('profile');
  if(!bits.length && !together && !p.memo){
    el.innerHTML=`<button class="profile-empty" type="button" data-open="settings">+ ${esc(S.cfg.dogName)} 정보 입력하기 <span>품종 · 생일 · 몸무게</span></button>`;
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
function openSheet(html,onMount){
  $('sheetHost').innerHTML=`<div class="scrim" id="scrim"><div class="sheet" role="dialog" aria-modal="true">${html}</div></div>`;
  $('scrim').addEventListener('click',e=>{if(e.target.id==='scrim')closeSheet()});
  onMount&&onMount($('sheetHost').querySelector('.sheet'));
}
function closeSheet(){$('sheetHost').innerHTML=''}
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
      const entry={type,t:d.getTime(),by:S.me};
      if(sel) entry.status=sel.dataset.o;
      else if($('optSel')){
        const v=$('optSel').value;
        const status=(v==='__etc'?$('optEtc').value.trim():v).slice(0,20);
        if(status) entry.status=status;
      }
      const note=$('logNote').value.trim(); if(note) entry.note=note;
      store.addEntry(S.view,newId(),entry);
      closeSheet(); toast(`${t.name} 기록했어요`);
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
      setMe(v); closeSheet(); render(); then&&then();
    };
  });
}

function settingsSheet(){
  const pf={...DEFAULT_PROFILE,...(S.cfg.profile||{})};
  openSheet(`
    <h3>강아지 정보</h3>
    <div class="photo-row">
      <button type="button" class="photo-prev" id="photoPrev" aria-label="사진 선택">${S.photo?`<img src="${S.photo}" alt="">`:icon('heart',26)}</button>
      <div class="photo-actions">
        <button type="button" class="secondary" id="photoPick">${S.photo?'사진 바꾸기':'사진 추가'}</button>
        ${S.photo?'<button type="button" class="linkbtn" id="photoDel">사진 삭제</button>':''}
      </div>
    </div>
    <div class="field"><label for="dogInput">강아지 이름</label><input id="dogInput" type="text" maxlength="14" value="${esc(S.cfg.dogName)}"></div>
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
    if($('photoDel')) $('photoDel').onclick=()=>{ S.photo=''; store.savePhoto(''); render(); settingsSheet(); toast('사진을 삭제했어요'); };
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
      const cfg={...S.cfg, dogName:$('dogInput').value.trim()||'우리 강아지', profile};
      setCfg(cfg); store.saveConfig(S.cfg); render(); closeSheet(); toast('설정을 저장했어요');
    };
  });
}

/* ---------- 빠른 기록 (길게 누르기) ---------- */
function quickLog(type){
  const t=T[type]; if(!t) return;
  if(!S.me){ nameSheet(()=>quickLog(type)); return; }
  const d=S.view===todayKey()?new Date():(()=>{const x=parseKey(S.view);x.setHours(9,0,0,0);return x})();
  store.addEntry(S.view,newId(),{type,t:d.getTime(),by:S.me});
  if(navigator.vibrate) try{navigator.vibrate(12)}catch(e){}
  toast(`${t.name} 바로 기록했어요`);
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
      const next={type:e.type,t:d.getTime(),by:e.by||S.me};
      if(status) next.status=status.slice(0,20);
      const note=$('eeNote').value.trim(); if(note) next.note=note;
      store.updateEntry(S.view,id,next); closeSheet(); toast('기록을 고쳤어요');
    };
    $('eeDel').onclick=()=>{ store.removeEntry(S.view,id); closeSheet(); toast('기록을 지웠어요'); };
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
function saveItems(items){ setCfg({...S.cfg, items}); store.saveConfig(S.cfg); render(); }
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
        <span class="irow-goal">${i.target?`하루 ${i.target}회`:'기록만'}${i.cycle?` · ${i.cycle}일 주기`:''}</span>
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
  let ic=it.icon, tg=it.target, streak=it.streak, opts=[...it.options], pick=it.pick;
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
    $('ieMinus').onclick=()=>{ tg=Math.max(0,tg-1); $('ieTarget').textContent=tg; };
    $('iePlus').onclick=()=>{ tg=Math.min(10,tg+1); $('ieTarget').textContent=tg; };
    $('ieStreak').onclick=()=>{ streak=!streak; $('ieStreak').setAttribute('aria-pressed',String(streak)); };
    $('ieBack').onclick=itemsSheet;
    $('ieSave').onclick=()=>{
      const name=$('ieName').value.trim(); if(!name){ $('ieName').focus(); toast('이름을 입력해 주세요'); return; }
      const next=normItem({...it, name, icon:ic, target:tg, streak, options:opts, pick, stale:$('ieStale').value, cycle:$('ieCycle').value});
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

/* ---------- 강아지 사진 ---------- */
function pickPhoto(){
  const inp=document.createElement('input'); inp.type='file'; inp.accept='image/*';
  inp.onchange=async()=>{
    const f=inp.files&&inp.files[0]; if(!f) return;
    toast('사진을 준비하는 중…');
    try{
      const data=await shrinkImage(f);
      S.photo=data; store.savePhoto(data); render();
      if($('sheetHost').innerHTML && $('photoPrev')) settingsSheet();
      toast('사진을 저장했어요');
    }catch(e){ console.error(e); toast('이 사진은 쓸 수 없어요. 다른 사진을 골라 주세요'); }
  };
  inp.click();
}
// 사진을 줄여 Firestore 문서 한 개(최대 1MB)에 담기. (Firebase Storage는 유료 요금제가 필요해서 사용하지 않음)
async function shrinkImage(file){
  const url=URL.createObjectURL(file);
  try{
    const img=await new Promise((res,rej)=>{ const i=new Image(); i.onload=()=>res(i); i.onerror=rej; i.src=url; });
    for(const [max,q] of [[1280,.82],[1024,.78],[800,.72],[640,.65]]){
      const r=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));
      const c=document.createElement('canvas'); c.width=Math.round(img.naturalWidth*r); c.height=Math.round(img.naturalHeight*r);
      c.getContext('2d').drawImage(img,0,0,c.width,c.height);
      const d=c.toDataURL('image/jpeg',q);
      if(d.length<700000) return d;
    }
    throw new Error('too large');
  } finally { URL.revokeObjectURL(url); }
}
function openLightbox(){
  if(!S.photo) return;
  const lb=$('lightbox'); $('lbImg').src=S.photo; $('lbCap').textContent=S.cfg.dogName; lb.hidden=false;
}
function closeLightbox(){ $('lightbox').hidden=true; }

function menuSheet(){
  const rows=[
    {ic:'star',  t:'기록 돌아보기', d:'달력 · 항목별 달성률 · 가족별 기록', fn:()=>statsSheet()},
    {ic:'heart', t:'강아지 정보',   d:`사진 · 품종 · 생일 · 몸무게`, fn:settingsSheet},
    {ic:'brush', t:'케어 목록 편집', d:'항목 추가 · 아이콘 · 목표 · 선택지', fn:itemsSheet},
    {ic:'home',  t:'가족 초대',     d:'초대 링크 만들어 보내기', fn:inviteSheet}
  ];
  openSheet(`
    <h3>메뉴</h3>
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
  });
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
      if(navigator.share){ try{ await navigator.share({title:`${S.cfg.dogName} 케어노트`,text:`${who?who+'님, ':''}${S.cfg.dogName} 케어 기록 같이 써요!`,url}); }catch(e){} }
      else $('copyBtn').click();
    };
  });
}

let toastTimer;
function toast(msg){
  $('toastHost').innerHTML=`<div class="toast" role="status">${esc(msg)}</div>`;
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('toastHost').innerHTML='',2200);
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
    store.removeEntry(S.view,b.dataset.del); toast('기록을 지웠어요');
  });
});
$('prevDay').onclick=()=>goDay(-1);
$('nextDay').onclick=()=>goDay(1);
$('kakaoOpen').onclick=()=>{ location.href='kakaotalk://web/openExternal?url='+encodeURIComponent(location.href); };
$('menuBtn').onclick=menuSheet;
$('tiles').addEventListener('click',e=>{ if(e.target.closest('#noItems')) itemsSheet(); });
$('faceBtn').onclick=()=>{ if(!S.fid) return; if(S.photo) openLightbox(); else pickPhoto(); };
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
    S.days=days;
    if(S.status==='connecting'||S.status==='live'||S.status==='offline') S.status=fromCache&&!navigator.onLine?'offline':'live';
    render();
  });
  store.subscribeConfig(c=>{ setCfg(c); render(); });
  store.subscribePhoto(d=>{ S.photo=d||''; render(); });
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
