const VERSION = 'context-cloze-v3';
const STATIC = `${VERSION}-static`;
const PAGES = `${VERSION}-pages`;
const SHELL = [
  '/', '/demo', '/privacy', '/terms', '/offline',
  '/assets/app.js', '/assets/app.css', '/assets/night-archive-1200.webp',
  '/favicon.svg', '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC).then((cache) => Promise.all(SHELL.map(async (url) => {
    const response = await fetch(new Request(url, { cache: 'reload' }));
    if (!response.ok) throw new Error(`Could not cache ${url}`);
    await cache.put(url, response);
  }))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((clients) => clients.forEach((client) => client.postMessage({ type: 'SW_UPDATED' })))
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(PAGES).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => (await caches.match(request, { ignoreVary: true })) || (await caches.match('/offline', { ignoreVary: true })) || (await caches.match('/', { ignoreVary: true })))
    );
    return;
  }

  event.respondWith(
    caches.match(request, { ignoreVary: true }).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) caches.open(STATIC).then((cache) => cache.put(request, response.clone()));
      return response;
    }))
  );
});
