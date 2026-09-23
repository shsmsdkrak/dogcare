// 앱 화면을 기기에 저장해 두어 인터넷이 약해도 빨리 열리게 합니다.
// (기록 데이터 자체는 Firebase가 오프라인 저장/동기화를 처리)
const CACHE = 'carenote-v11';
const SHELL = ['./', 'index.html', 'app.js', 'style.css', 'firebase-config.js', 'manifest.webmanifest', 'icon.svg', 'icon-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Firebase 통신(데이터/로그인)은 절대 가로채지 않음
  if (/googleapis\.com|firebaseio|identitytoolkit|securetoken/.test(url.host)) return;
  const sameOrigin = url.origin === location.origin;
  const isLib = url.host === 'www.gstatic.com' || url.host.startsWith('fonts.');
  if (!sameOrigin && !isLib) return;
  // 네트워크 우선, 실패하면 저장본
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: sameOrigin && req.mode === 'navigate' }))
  );
});
