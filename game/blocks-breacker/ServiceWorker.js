const cacheName = "Rike Games-Blocks Breaker-0.1.1";
const contentToCache = [
    "Build/152ababea672c28ad2b552d3f3254697.loader.js",
    "Build/1ba902384a7a91a983f73cf1328c8405.framework.js",
    "Build/76801223d548824634a33afac16996ae.data",
    "Build/213942ebafc206339ee892f39eb86dab.wasm",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
