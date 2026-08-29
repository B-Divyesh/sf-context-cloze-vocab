import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';

/**
 * The worker itself stays at a stable URL so an installed app can discover an
 * update. Everything it precaches is fingerprinted by Vite, so it is safe for
 * the host to retain those files indefinitely.
 */
function offlineWorker(): Plugin {
  let outputDirectory = '';

  return {
    name: 'context-cloze-offline-worker',
    apply: 'build',
    configResolved(config) {
      outputDirectory = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const precache = readdirSync(resolve(outputDirectory, 'assets'))
        .filter((file) => /\.(?:js|css|webp)$/u.test(file))
        .map((file) => `/assets/${file}`)
        .sort();
      const version = `context-cloze-${precache.join('|').replaceAll(/[^a-z0-9]/giu, '').slice(-24)}`;
      const shell = ['/', '/?demo=1', '/demo', '/privacy', '/terms', '/offline', ...precache];
      const source = `const VERSION = ${JSON.stringify(version)};
const STATIC = \`${'${VERSION}'}-static\`;
const PAGES = \`${'${VERSION}'}-pages\`;
const SHELL = ${JSON.stringify(shell)};

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC).then((cache) => Promise.all(SHELL.map(async (url) => {
    const response = await fetch(new Request(url, { cache: 'reload' }));
    if (!response.ok) throw new Error(\`Could not cache \${url}\`);
    await cache.put(url, response);
  }))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key))))
    .then(() => self.clients.claim())
    .then(() => self.clients.matchAll({ type: 'window' }))
    .then((clients) => clients.forEach((client) => client.postMessage({ type: 'SW_UPDATED' }))));
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then((response) => {
      caches.open(PAGES).then((cache) => cache.put(request, response.clone()));
      return response;
    }).catch(async () => (await caches.match(request, { ignoreVary: true })) || (await caches.match('/offline', { ignoreVary: true })) || (await caches.match('/', { ignoreVary: true }))));
    return;
  }
  event.respondWith(caches.match(request, { ignoreVary: true }).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) caches.open(STATIC).then((cache) => cache.put(request, response.clone()));
    return response;
  })));
});
`;
      writeFileSync(resolve(outputDirectory, 'sw.js'), source);

      const css = precache.find((file) => file.endsWith('.css'));
      if (css) {
        const pagePath = resolve(outputDirectory, '404.html');
        writeFileSync(pagePath, readFileSync(pagePath, 'utf8').replace('/assets/app.css', css));
      }

      const home = readFileSync(resolve(outputDirectory, 'index.html'), 'utf8');
      const routes = [
        ['demo', 'Demo — Context Cloze', 'Practise eight sample words in a separate sample workspace.', 'Try a sample missing-word practice session.'],
        ['privacy', 'Privacy — Context Cloze', 'How Context Cloze stores your word list and checks a license.', 'See how Context Cloze handles your word list.'],
        ['terms', 'Terms — Context Cloze', 'Terms for Context Cloze and its one-time personal license.', 'Read the terms for Context Cloze.'],
        ['offline', 'Offline — Context Cloze', 'Continue practising saved words without a connection.', 'Context Cloze keeps saved practice available offline.']
      ];
      for (const [route, title, description, social] of routes) {
        const routeUrl = `https://context-cloze-vocab.sociobot.in/${route}`;
        const page = home
          .replaceAll('Context Cloze — practise words in sentences', title)
          .replaceAll('Paste your own words and sentences, then practise retrieving each word in context. Your word list stays on your device.', description)
          .replace('href="https://context-cloze-vocab.sociobot.in/"', `href="${routeUrl}"`)
          .replace('property="og:url" content="https://context-cloze-vocab.sociobot.in/"', `property="og:url" content="${routeUrl}"`)
          .replaceAll('Type the missing word in sentences you chose.', social);
        mkdirSync(resolve(outputDirectory, route), { recursive: true });
        writeFileSync(resolve(outputDirectory, route, 'index.html'), page);
      }
    }
  };
}

export default defineConfig({
  plugins: [offlineWorker()],
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }
});
