import { test, expect } from '@playwright/test';

async function readExport(page: import('@playwright/test').Page): Promise<Record<string, unknown>> {
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const stream = await (await downloadPromise).createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as Record<string, unknown>;
}

async function clearDemoStore(page: import('@playwright/test').Page): Promise<void> {
  await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('context-cloze-demo');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(['items', 'reviews'], 'readwrite');
      transaction.objectStore('items').clear();
      transaction.objectStore('reviews').clear();
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
    database.close();
  });
}

test('@claim:demo-isolation demo opens with sample data and never enters real storage', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Practise sample words in context');
  await expect(page.getByText('8 words', { exact: true })).toBeVisible();
  const addForm = page.locator('#add-form');
  await addForm.getByLabel('Word', { exact: true }).fill('tenacious');
  await addForm.getByLabel('Sentence containing that word').fill('She remained tenacious during the long repair.');
  await addForm.getByRole('button', { name: 'Save word' }).click();
  await expect(page.getByText('9 words', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page.getByText('0 words', { exact: true })).toBeVisible();
});

test('@claim:typed-scheduling a typed answer updates the due queue', async ({ page }) => {
  await page.goto('/demo');
  const before = await readExport(page) as { items: Array<{ word: string; dueAt: number; intervalDays: number; reviewCount: number }> };
  const beforeElusive = before.items.find((item) => item.word === 'elusive')!;
  await page.getByRole('button', { name: 'Practise due words' }).click();
  await expect(page.getByRole('heading', { name: 'Type the missing word' })).toBeVisible();
  await page.getByLabel('Your answer').fill('ELUSIVE');
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByText('Correct.', { exact: true })).toBeVisible();
  await expect(page.getByText(/The answer is elusive/)).toBeVisible();
  const after = await readExport(page) as { items: Array<{ word: string; dueAt: number; intervalDays: number; reviewCount: number }> };
  const afterElusive = after.items.find((item) => item.word === 'elusive')!;
  expect(afterElusive.reviewCount).toBe(beforeElusive.reviewCount + 1);
  expect(afterElusive.intervalDays).toBeGreaterThan(beforeElusive.intervalDays);
  expect(afterElusive.dueAt).toBeGreaterThan(Date.now() + 2 * 86_400_000);
});

test('@claim:case-insensitive-marking capitalisation does not affect marking', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Practise due words' }).click();
  await page.getByLabel('Your answer').fill('ELUSIVE');
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByText('Correct.', { exact: true })).toBeVisible();
});

test('@claim:full-session a full session includes every saved word', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Practise all words' }).click();
  await expect(page.getByText('Sentence 1 of 8', { exact: true })).toBeVisible();
  for (let index = 0; index < 8; index += 1) {
    await page.getByLabel('Your answer').fill('not the answer');
    await page.getByRole('button', { name: 'Check answer' }).click();
    await page.getByRole('button', { name: index === 7 ? 'Finish session' : 'Next sentence' }).click();
  }
  await expect(page.getByText('You answered 8 sentences.')).toBeVisible();
});

test('@claim:unicode-rtl Unicode and right-to-left words can be saved and answered', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Word', { exact: true }).fill('مُثابر');
  await page.getByLabel('Sentence containing that word').fill('كان الطالب مُثابرًا طوال العام.');
  await page.getByRole('button', { name: 'Save word' }).click();
  await expect(page.locator('.word-list').getByText('مُثابر', { exact: true })).toBeVisible();
  await expect(page.locator('.word-list p[dir="auto"]')).toContainText('كان الطالب');
  await page.getByRole('button', { name: 'Practise due words' }).click();
  await page.getByLabel('Your answer').fill('مُثابر');
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByText('Correct.', { exact: true })).toBeVisible();
});

test('@claim:json-export round-trips every word schedule and answer history through a fresh demo store', async ({ page }) => {
  await page.goto('/demo');
  const data = await readExport(page) as { product: string; items: unknown[]; reviews: unknown[] };
  expect(data.product).toBe('context-cloze-vocab');
  expect(data.items).toHaveLength(8);
  expect(data.reviews).toHaveLength(5);
  await clearDemoStore(page);
  await page.locator('#import-file').setInputFiles({ name: 'context-cloze.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data)) });
  await expect(page.getByRole('status')).toHaveText('Imported 8 words.');
  const restored = await readExport(page) as { items: unknown[]; reviews: unknown[] };
  expect(restored.items).toEqual(data.items);
  expect(restored.reviews).toEqual(data.reviews);
});

test('@regression:malformed-json-import gives an actionable error', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('#import-file').setInputFiles({
    name: 'not-context-cloze.json', mimeType: 'application/json', buffer: Buffer.from('{not json')
  });
  await expect(page.getByRole('status')).toHaveText('This file is not valid JSON. Choose a Context Cloze JSON export.');
});

test('@claim:confusion-pairs repeated wrong guesses are counted beside the intended word', async ({ page }) => {
  await page.goto('/demo');
  const pair = page.locator('.confusions li').filter({ hasText: 'vague' });
  await expect(pair).toContainText('elusive');
  await expect(pair).toContainText('2 mix-ups');
});

test('@claim:local-storage demo flow makes no cross-origin requests', async ({ page }) => {
  const crossOrigin: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== 'http://127.0.0.1:4173') crossOrigin.push(url.href);
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Practise due words' }).click();
  await page.getByLabel('Your answer').fill('elusive');
  await page.getByRole('button', { name: 'Check answer' }).click();
  expect(crossOrigin).toEqual([]);
});

test('@claim:offline-reload demo reloads offline after the first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await page.waitForFunction(async () => (await Promise.all((await caches.keys()).map(async (name) => (await caches.open(name)).keys())))
    .flat().some((request) => /\/assets\/[^/]+-[a-z0-9]+\.js$/u.test(new URL(request.url).pathname)));
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Practise sample words in context');
  await expect(page.getByText('8 words', { exact: true })).toBeVisible();
});

test('@claim:free-limit landing states and enforces the 50-word free tier', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Free for 50 words')).toBeVisible();
  await expect(page.getByText('Pay $12 once for unlimited words and the full confusion-pair history. Practice, 50 words, and exports remain free.')).toBeVisible();
  const lines = Array.from({ length: 51 }, (_, index) => `word${index} | This sentence contains word${index}.`).join('\n');
  await page.getByText('Paste several words').click();
  await page.getByLabel('One per line: word | sentence').fill(lines);
  await page.getByRole('button', { name: 'Save pasted words' }).click();
  await expect(page.getByText('Only 50 free word spaces remain. Paste fewer lines or add a license.')).toBeVisible();
});

test('@claim:paid-license a returned license stores beyond 50 words and shows every confusion pair', async ({ page }) => {
  await page.route('https://api.sociobot.in/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }) }));
  await page.goto('/?license=test_personal_token');
  await expect(page.getByText('Personal license active')).toBeVisible();
  await expect(page).toHaveURL('/');
  await expect(page.getByText('/ 50 free', { exact: false })).toHaveCount(0);
  const items = Array.from({ length: 51 }, (_, index) => ({
    id: `licensed-word-${index}`, word: `word${index}`, sentence: `This sentence contains word${index}.`, note: '',
    createdAt: index, dueAt: index, intervalDays: 0, ease: 2.3, lapses: 0, reviewCount: 0
  }));
  const reviews = Array.from({ length: 4 }, (_, index) => ({
    id: `licensed-review-${index}`, itemId: `licensed-word-${index}`, answer: `word${index}`, typed: `guess${index}`, correct: false, reviewedAt: index
  }));
  const imported = { product: 'context-cloze-vocab', version: 1, exportedAt: new Date().toISOString(), items, reviews };
  await page.locator('#import-file').setInputFiles({ name: 'licensed-context-cloze.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(imported)) });
  await expect(page.getByRole('status')).toHaveText('Imported 51 words.');
  await expect(page.getByText('51 words', { exact: true })).toBeVisible();
  const pairs = page.locator('.confusions li');
  await expect(pairs).toHaveCount(4);
  for (let index = 0; index < 4; index += 1) await expect(pairs.nth(index)).toContainText(`guess${index}`);
});
