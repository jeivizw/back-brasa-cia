const CACHE_NAME = 'my-app-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './cozinha.html', 
  './manifest.json',
  './assets/logo.png',
  './assets/logopwa.png',
  './assets/logopwa512.png',
  './assets/banner.png',
  './assets/whatsapp.png',
];


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Assando a Carne no Cache!');
      return cache.addAll(ASSETS);
    })
  );
});

// Faz as requisições olharem pro cache primeiro
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })  
  );
});

//remove caches antigos quando atualizar
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((keys) => {          // ✅ caches
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)) // ✅
      );
    })
  );
});