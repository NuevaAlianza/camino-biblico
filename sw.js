const CACHE_NAME = 'app-static-v9.4';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './citas.html',
  './config.html',
  './progreso.html',
  './quiz.html',
  './reflexion.html',
  './css/estilos.css',
  './manifest.json',
  './coleccionables.html',

  // JS
  './js/app/citas.js',
  './js/app/quiz.js',
  './js/app/reflexion.js',
  './js/app/progreso.js',
  './js/app/coleccionables.js',

  // Imágenes
  './assets/img/icon-192.png',
  './assets/img/icon-512.png',

  // Sonidos
  './assets/sonidos/click.mp3',
  './assets/sonidos/correcto.mp3',
  './assets/sonidos/incorrecto.mp3',

  // Fallback
  './offline.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting()) // activa SW al instante
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim()) // toma control inmediato
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./offline.html');
        }
      });
    })
  );
});
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
