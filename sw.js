self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('app-static').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/css/estilos.css',
        '/manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
