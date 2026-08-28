import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');

describe('static-host release configuration', () => {
  it('@regression:real-404 rewrites missing static-host routes to the designed 404 document', () => {
    const config = JSON.parse(readFileSync(resolve(root, 'public/staticwebapp.config.json'), 'utf8')) as {
      responseOverrides?: Record<string, { rewrite?: string }>;
      navigationFallback?: { exclude?: string[] };
      routes?: Array<{ route?: string; rewrite?: string; headers?: Record<string, string> }>;
    };
    const page = readFileSync(resolve(root, 'public/404.html'), 'utf8');
    expect(config.responseOverrides?.['404']?.rewrite).toBe('/404.html');
    expect(config.navigationFallback?.exclude).toContain('/*');
    expect(config.routes).toEqual(expect.arrayContaining([
      { route: '/demo', rewrite: '/demo/index.html' },
      { route: '/privacy', rewrite: '/privacy/index.html' },
      { route: '/terms', rewrite: '/terms/index.html' },
      { route: '/offline', rewrite: '/offline/index.html' }
    ]));
    expect(page).toContain('<main id="main"');
    expect(page).toContain('<h1>This sentence has no ending</h1>');
    expect(page).toContain('property="og:title"');
    expect(page).toContain('apple-touch-icon');
  });

  it('@regression:hashed-assets-use-immutable-cache-policy', () => {
    const config = JSON.parse(readFileSync(resolve(root, 'public/staticwebapp.config.json'), 'utf8')) as {
      routes?: Array<{ route?: string; headers?: Record<string, string> }>;
    };
    const vite = readFileSync(resolve(root, 'vite.config.ts'), 'utf8');
    expect(vite).toContain("entryFileNames: 'assets/[name]-[hash].js'");
    expect(vite).toContain("assetFileNames: 'assets/[name]-[hash][extname]'");
    expect(vite).toContain('offlineWorker()');
    expect(config.routes).toContainEqual({
      route: '/assets/*',
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' }
    });
  });
});
