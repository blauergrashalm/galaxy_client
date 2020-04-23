
var cacheName = 'galaxies-pwa';
var filesToCache = [
  '/',
  '/index.html',
  '/style/main.css',
  '/style/sky-828648.jpg',
  '/style/Orbitron-VariableFont_wght.ttf',
  '/bin/Dot.js',
  '/bin/Dot.js.map',
  '/bin/Field.js',
  '/bin/Field.js.map',
  '/bin/Galaxy.js',
  '/bin/Galaxy.js.map',
  '/bin/GameDialog.js',
  '/bin/GameDialog.js.map',
  '/bin/Player.js',
  '/bin/Player.js.map',
  '/bin/Websocket.js',
  '/bin/Websocket.js.map'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});