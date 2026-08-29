import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');
const read = (path: string): string => readFileSync(resolve(root, path), 'utf8');

describe('release copy', () => {
  it('keeps the catalog line verb-first and within 120 characters', () => {
    const description = read('.factory/catalog-description.txt').trim();
    expect(description.length).toBeLessThanOrEqual(120);
    expect(description).toMatch(/^Paste\b/u);
  });

  it('removes every residual review-3 slogan and unproved public statement', () => {
    const publicCopy = [read('src/main.ts'), read('README.md'), read('public/404.html')].join('\n');
    for (const phrase of [
      'A small daily loop',
      'Close calls',
      'Bring the sentence',
      'Original generated scene',
      'The generated environmental artwork is original to this product',
      'merchant of record',
      'handles refunds',
      'A quiet tool, not a course'
    ]) expect(publicCopy).not.toContain(phrase);
  });

  it('uses plain headings for the missing-word step and missing page', () => {
    const publicCopy = [read('src/main.ts'), read('public/404.html')].join('\n');
    expect(publicCopy).toContain('Type the missing word');
    expect(publicCopy).toContain('Page not found');
    expect(publicCopy).not.toContain('Type what belongs');
    expect(publicCopy).not.toContain('This sentence has no ending');
  });

  it('keeps file-format jargon out of the public product panel', () => {
    expect(read('src/main.ts')).not.toContain('Backup files use JSON format.');
    expect(read('README.md')).toContain('Backup files use\nJSON format.');
  });

  it('lists exactly one browser test for every visitor-facing claim', () => {
    const claims = JSON.parse(read('.factory/claims.json')) as Array<{ id: string; test: string }>;
    const browserTests = read('tests/claims.spec.ts');
    for (const claim of claims) {
      expect(claim.test).toBe(`npm test -- --grep @claim:${claim.id}`);
      expect(browserTests.split(`@claim:${claim.id}`).length - 1).toBe(1);
    }
  });
});
