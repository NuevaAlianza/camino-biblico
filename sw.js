const CACHE_NAME = 'app-static-v1';
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
  // JS
  './js/app/citas.js',
  './js/app/quiz.js',
  './js/app/reflexion.js',
  // Imágenes
  './assets/img/icon-192.png',
  './assets/img/icon-512.png',
  // Sonidos
  './assets/sonidos/click.mp3',
  './assets/sonidos/correcto.mp3',
  './assets/sonidos/incorrecto.mp3',
  // Datos JSON
  './datos/citas.json',
  './datos/reflexion.json',
  './datos/quiz.json',
  './offline.html', // <-- Importante para fallback
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting()) // activa inmediatamente el SW
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim()) // toma control de las pestañas abiertas
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request).catch(() => {
        // Si falla la red y es navegación, devuelve offline.html
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      });
    })
  );
});
