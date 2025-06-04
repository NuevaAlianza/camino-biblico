const CACHE_NAME = 'app-static-v1';
const URLS_TO_CACHE = [
  '/',
  '/camino-biblico/index.html',
  '/camino-biblico/citas.html',
  '/camino-biblico/config.html',
  '/camino-biblico/progreso.html',
  'quiz-comentado.html',
  '/camino-biblico/quiz.html',
  '/camino-biblico/reflexion.html',
  '/camino-biblico/css/estilos.css',
  '/camino-biblico/manifest.json',
  // JS
  '/camino-biblico/js/app/citas.js',
  '/camino-biblico/js/app/quiz.js',
  '/camino-biblico/js/app/reflexion.js',
  // Imágenes
  '/camino-biblico/assets/img/icon-192.png',
  '/camino-biblico/assets/img/icon-512.png',
  // Sonidos
  '/camino-biblico/assets/sonidos/click.mp3',
  '/camino-biblico/assets/sonidos/correcto.mp3',
  '/camino-biblico/assets/sonidos/incorrecto.mp3',
  // Datos JSON
  '/camino-biblico/datos/citas.json',
  '/camino-biblico/datos/reflexion.json',
  '/camino-biblico/datos/quiz.json',
  '/camino-biblico/offline.html', // <-- Importante para fallback
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
