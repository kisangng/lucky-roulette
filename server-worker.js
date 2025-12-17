const CACHE_NAME = 'lucky-roulette-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // 여기에 아이콘 파일 경로도 추가하세요.
  '/icons/icon-192x192.png', 
  '/icons/icon-512x512.png'
  // 추가적으로 필요한 CSS, JS 파일이 있다면 여기에 포함
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 캐시 히트 시 캐시에서 반환
        if (response) {
          return response;
        }
        // 캐시 미스 시 네트워크에서 가져오기
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // 오래된 캐시 삭제
          }
        })
      );
    })
  );
});