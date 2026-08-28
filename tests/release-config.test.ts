import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');

describe('static-host release configuration', () => {
  it('@regression:real-404 rewrites missing static-host routes to the designed 404 document', () => {
    const config = JSON.parse(readFileSync(resolve(root, 'public/staticwebapp.config.json'), 'utf8')) as {
      responseOverrides?: Record<string, { rewrite?: string }>;
      navigationFallback?: { exclude?: string[] };
      routes?: Array<{ route?: string; rewrite?: string }>;
    };
    const page = readFileSync(resolve(root, 'public/404.html'), 'utf8');
    expect(config.responseOverrides?.['404']?.rewrite).toBe('/404.html');
    expect(config.navigationFallback?.exclude).toContain('/*');
    expect(config.routes).toEqual(expect.arrayContaining([
      { route: '/demo', rewrite: '/index.html' },
      { route: '/privacy', rewrite: '/index.html' },
      { route: '/terms', rewrite: '/index.html' },
      { route: '/offline', rewrite: '/index.html' }
    ]));
    expect(page).toContain('<main id="main"');
    expect(page).toContain('<h1>This sentence has no ending</h1>');
  });
});
