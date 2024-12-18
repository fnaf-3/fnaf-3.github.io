const cacheName = "Tearforge Studios-Plane Crash Ragdoll Simulator-0.1.0";
const contentToCache = [
    "Build/82392042a08421dafb4ccebc4e45e57c.loader.js",
    "Build/601cd58087f43419a42cb2290042e381.framework.js.unityweb",
    "Build/549764637c3328c0b06f380193809af4.data.unityweb",
    "Build/1f70a0f573e8b83f2ed2f6aee3411f7c.wasm.unityweb",
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
