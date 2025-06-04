const CACHE_NAME = 'app-static-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './citas.html',
  './config.html',
  './progreso.html',
  './quiz-comentado.html',
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
  './datos/quiz.json'
];


self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
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

self.addEventListener('activate', e => {
  // Limpiar caches antiguas
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
});
