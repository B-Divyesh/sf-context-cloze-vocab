import { test, expect } from '@playwright/test';

async function readExport(page: import('@playwright/test').Page): Promise<Record<string, unknown>> {
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download backup' }).click();
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

async function readStoredWords(page: import('@playwright/test').Page, databaseName: string): Promise<string[]> {
  return page.evaluate(async (name) => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(name);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const words = await new Promise<string[]>((resolve, reject) => {
      const transaction = database.transaction('items', 'readonly');
      const request = transaction.objectStore('items').getAll();
      request.onsuccess = () => resolve((request.result as Array<{ word: string }>).map(({ word }) => word).sort());
      request.onerror = () => reject(request.error);
    });
    database.close();
    return words;
  }, databaseName);
}

function backupFixture(items: Array<{ id: string; word: string; sentence: string; dueAt?: number }>, reviews: Array<{ id: string; itemId: string; answer: string; typed: string; correct: boolean }> = []): Buffer {
  const now = Date.now();
  return Buffer.from(JSON.stringify({
    product: 'context-cloze-vocab',
    version: 1,
    exportedAt: new Date(now).toISOString(),
    items: items.map((item, index) => ({
      ...item,
      note: '',
      createdAt: now - index,
      dueAt: item.dueAt ?? now,
      intervalDays: 0,
      ease: 2.3,
      lapses: 0,
      reviewCount: 0
    })),
    reviews: reviews.map((review, index) => ({ ...review, reviewedAt: now - index }))
  }));
}

test('@claim:demo-sample-count demo opens eight sample words', async ({ page, browser }) => {
  await page.goto('/');
  const sampleLink = page.getByRole('link', { name: 'Try it with sample data' });
  await expect(sampleLink).toHaveAttribute('href', '/?demo=1');
  await sampleLink.click();
  await expect(page).toHaveURL('/?demo=1');
  await expect(page).toHaveTitle('Demo — Context Cloze');
  await expect(page.getByLabel('Demo status')).toContainText('Demo — sample data, nothing is saved to your word list');
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start for real' })).toBeVisible();
  await expect(page.locator('.review-sheet').getByRole('heading', { name: 'Type the missing word' })).toBeVisible();
  await expect(page.getByText('8 words', { exact: true })).toBeVisible();

  const directContext = await browser.newContext({ baseURL: 'http://127.0.0.1:4173' });
  const directPage = await directContext.newPage();
  await directPage.goto('/?demo=1');
  await expect(directPage.getByRole('heading', { name: 'Type the missing word' })).toBeVisible();
  await expect.poll(() => directPage.evaluate(async () => (await indexedDB.databases()).map(({ name }) => name).filter(Boolean))).toEqual(['context-cloze-demo']);
  await directContext.close();
});

test('@claim:demo-isolation demo never reads or changes the real word list', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Word', { exact: true }).fill('keepsake');
  await page.getByLabel('Sentence containing that word').fill('This keepsake belongs in the real word list.');
  await page.getByRole('button', { name: 'Save word' }).click();
  await expect(page.getByText('1 words', { exact: true })).toBeVisible();
  const realBeforeDemo = await readStoredWords(page, 'context-cloze-real');
  expect(realBeforeDemo).toEqual(['keepsake']);

  await page.evaluate(() => {
    const state = window as unknown as { sawRealWordInDemo: boolean };
    state.sawRealWordInDemo = false;
    new MutationObserver(() => {
      if (new URL(location.href).searchParams.get('demo') === '1' && document.body.innerText.includes('keepsake')) {
        state.sawRealWordInDemo = true;
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  });
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Practise sample words in context');
  await expect(page.getByText('8 words', { exact: true })).toBeVisible();
  await expect(page.locator('body')).not.toContainText('keepsake');
  expect(await page.evaluate(() => (window as unknown as { sawRealWordInDemo: boolean }).sawRealWordInDemo)).toBe(false);
  expect(await readStoredWords(page, 'context-cloze-demo')).not.toContain('keepsake');
  expect(await readStoredWords(page, 'context-cloze-real')).toEqual(realBeforeDemo);

  const addForm = page.locator('#add-form');
  await addForm.getByLabel('Word', { exact: true }).fill('temporary');
  await addForm.getByLabel('Sentence containing that word').fill('This temporary word belongs only in the demo.');
  await addForm.getByRole('button', { name: 'Save word' }).click();
  await expect(page.getByText('9 words', { exact: true })).toBeVisible();
  expect(await readStoredWords(page, 'context-cloze-demo')).toContain('temporary');
  expect(await readStoredWords(page, 'context-cloze-real')).toEqual(realBeforeDemo);

  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('heading', { name: 'Type the missing word' })).toBeVisible();
  await expect(page.getByText('8 words', { exact: true })).toBeVisible();
  expect(await readStoredWords(page, 'context-cloze-demo')).not.toContain('temporary');
  expect(await readStoredWords(page, 'context-cloze-real')).toEqual(realBeforeDemo);

  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page.getByText('1 words', { exact: true })).toBeVisible();
  await expect(page.getByText('keepsake', { exact: true })).toBeVisible();
  expect(await readStoredWords(page, 'context-cloze-demo')).toEqual([]);
  expect(await readStoredWords(page, 'context-cloze-real')).toEqual(realBeforeDemo);
});

test('@claim:typed-cloze each saved word becomes a blank answered by typing', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Word', { exact: true }).fill('scarce');
  await page.getByLabel('Sentence containing that word').fill('Clean water becomes scarce in summer.');
  await page.getByRole('button', { name: 'Save word' }).click();
  await page.getByRole('button', { name: 'Practise due words' }).click();
  await expect(page.locator('.review-sheet blockquote')).toContainText('_____');
  await page.getByLabel('Your answer').fill('scarce');
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByText('Correct.', { exact: true })).toBeVisible();
});

test('@claim:typed-scheduling a typed answer updates the due queue', async ({ page }) => {
  await page.goto('/demo');
  const before = await readExport(page) as { items: Array<{ word: string; dueAt: number; intervalDays: number; reviewCount: number }> };
  const beforeElusive = before.items.find((item) => item.word === 'elusive')!;
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
  await page.getByLabel('Your answer').fill('ELUSIVE');
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByText('Correct.', { exact: true })).toBeVisible();
});

test('@claim:full-session a full session includes every saved word with a sentence', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Practise all 8 words with sentences' }).click();
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

test('@claim:unicode-normalisation accented answers accept composed and decomposed characters', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Word', { exact: true }).fill('Café');
  await page.getByLabel('Sentence containing that word').fill('We stopped at the Café after class.');
  await page.getByRole('button', { name: 'Save word' }).click();
  await page.getByRole('button', { name: 'Practise due words' }).click();
  await page.getByLabel('Your answer').fill('cafe\u0301');
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByText('Correct.', { exact: true })).toBeVisible();
});

test('@claim:due-queue due words return as questions', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Word', { exact: true }).fill('clear');
  await page.getByLabel('Sentence containing that word').fill('The instructions are clear to everyone.');
  await page.getByRole('button', { name: 'Save word' }).click();
  await page.getByRole('button', { name: 'Practise due words' }).click();
  await expect(page.locator('.review-sheet').getByRole('heading', { name: 'Type the missing word' })).toBeVisible();
  await expect(page.locator('.review-sheet blockquote')).toContainText('_____');
});

test('@claim:backup-roundtrip round-trips every word schedule and answer history through a fresh demo store', async ({ page }) => {
  await page.goto('/demo');
  await page.getByText('Paste a word list', { exact: true }).click();
  await page.getByLabel('One word per line').fill('unfinished');
  await page.getByRole('button', { name: 'Save words and add sentences' }).click();
  const data = await readExport(page) as { product: string; items: unknown[]; reviews: unknown[] };
  expect(data.product).toBe('context-cloze-vocab');
  expect(data.items).toHaveLength(9);
  expect(data.reviews).toHaveLength(5);
  await clearDemoStore(page);
  await page.locator('#import-file').setInputFiles({ name: 'context-cloze.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data)) });
  await expect(page.getByRole('status')).toHaveText('Imported 9 words.');
  const restored = await readExport(page) as { items: unknown[]; reviews: unknown[] };
  expect(restored.items).toEqual(data.items);
  expect(restored.reviews).toEqual(data.reviews);
});

test('@claim:tab-bulk-entry saves a tab-separated word and sentence', async ({ page }) => {
  await page.goto('/?demo=1');
  await page.getByText('Paste words with sentences').click();
  await page.getByLabel('One per line: word | sentence').fill('tenacious\tA tenacious learner keeps practising.');
  await page.getByRole('button', { name: 'Save pasted words' }).click();
  await expect(page.getByRole('status')).toHaveText('Saved 1 word.');
  await expect(page.getByText('9 words', { exact: true })).toBeVisible();
  await expect(page.locator('.word-list').getByText('tenacious', { exact: true })).toBeVisible();
  expect(await readStoredWords(page, 'context-cloze-demo')).toContain('tenacious');
});

test('@claim:word-list-paste saves bare words in demo storage and opens the ordered sentence step', async ({ page }) => {
  await page.goto('/?demo=1');
  await page.getByText('Paste a word list', { exact: true }).click();
  await page.getByLabel('One word per line').fill('zealous\nresilient\nwhimsical');
  await page.getByRole('button', { name: 'Save words and add sentences' }).click();
  await expect(page.getByRole('status')).toHaveText('Saved 3 words. Add their sentences next.');
  await expect(page.getByRole('heading', { name: 'Add a sentence for “zealous”' })).toBeVisible();
  await expect(page.getByLabel('Sentence using zealous')).toBeFocused();
  await expect(page.getByText('11 words', { exact: true })).toBeVisible();
  expect(await page.evaluate(async () => (await indexedDB.databases()).map(({ name }) => name).filter(Boolean))).toEqual(['context-cloze-demo']);
  expect(await readStoredWords(page, 'context-cloze-demo')).toEqual(expect.arrayContaining(['zealous', 'resilient', 'whimsical']));

  await page.getByLabel('Sentence using zealous').fill('A zealous student reviewed every morning.');
  await page.getByRole('button', { name: 'Save sentence and continue' }).click();
  await expect(page.getByRole('heading', { name: 'Add a sentence for “resilient”' })).toBeVisible();
  await expect(page.getByLabel('Sentence using resilient')).toBeFocused();
  const stored = await readExport(page) as { items: Array<{ word: string; sentence: string }> };
  expect(stored.items.find((item) => item.word === 'zealous')?.sentence).toBe('A zealous student reviewed every morning.');
  expect(stored.items.find((item) => item.word === 'resilient')?.sentence).toBe('');
});

test('@claim:due-session-only a short session excludes future words', async ({ page }) => {
  const now = Date.now();
  await page.goto('/');
  await page.locator('#import-file').setInputFiles({
    name: 'due-session-fixture.json',
    mimeType: 'application/json',
    buffer: backupFixture([
      { id: 'due-now', word: 'urgent', sentence: 'The urgent message needs an answer.', dueAt: now - 1_000 },
      { id: 'future-word', word: 'later', sentence: 'The later train leaves tomorrow.', dueAt: now + 86_400_000 }
    ])
  });
  await expect(page.getByRole('status')).toHaveText('Imported 2 words.');
  await expect(page.getByText('1 due now', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Practise due words' }).click();
  await expect(page.getByText('Sentence 1 of 1', { exact: true })).toBeVisible();
  await expect(page.locator('.review-sheet blockquote')).toContainText('The _____ message needs an answer.');
  await expect(page.locator('.review-sheet blockquote')).not.toContainText('later');
  await page.getByLabel('Your answer').fill('urgent');
  await page.getByRole('button', { name: 'Check answer' }).click();
  await page.getByRole('button', { name: 'Finish session' }).click();
  await expect(page.getByText('You answered 1 sentence.')).toBeVisible();
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
  await page.getByLabel('Your answer').fill('elusive');
  await page.getByRole('button', { name: 'Check answer' }).click();
  expect(crossOrigin).toEqual([]);
});

test('@claim:no-tracking-resources loads no third-party resources across public routes', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== 'http://127.0.0.1:4173') external.push(url.href);
  });
  for (const path of ['/', '/demo', '/privacy', '/terms']) await page.goto(path);
  expect(external).toEqual([]);
});

test('@claim:offline-reload demo reloads offline after the first visit', async ({ page, context }) => {
  await page.goto('/?demo=1');
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await page.waitForFunction(async () => (await Promise.all((await caches.keys()).map(async (name) => (await caches.open(name)).keys())))
    .flat().some((request) => /\/assets\/[^/]+-[a-z0-9]+\.js$/u.test(new URL(request.url).pathname)));
  await context.setOffline(true);
  await page.reload();
  await expect(page).toHaveURL('/?demo=1');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Practise sample words in context');
  await expect(page.getByText('8 words', { exact: true })).toBeVisible();
});

test('@claim:free-limit landing states and enforces the 50-word free tier', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Free for 50 words')).toBeVisible();
  await expect(page.getByText('Pay $12 once for unlimited words and the full confusion-pair history. The free list holds 50 words.')).toBeVisible();
  const lines = Array.from({ length: 51 }, (_, index) => `word${index} | This sentence contains word${index}.`).join('\n');
  await page.getByText('Paste words with sentences').click();
  await page.getByLabel('One per line: word | sentence').fill(lines);
  await page.getByRole('button', { name: 'Save pasted words' }).click();
  await expect(page.getByText('Only 50 free word spaces remain. Paste fewer lines or add a license.')).toBeVisible();
});

test('@claim:checkout-link opens the visible Sociobot checkout destination', async ({ page, request }) => {
  await page.goto('/');
  const checkoutLink = page.getByRole('link', { name: /Buy for \$12 once — opens secure checkout/ });
  const checkoutUrl = 'https://api.sociobot.in/api/v1/products/context-cloze-vocab/checkout';
  await expect(checkoutLink).toHaveAttribute('href', checkoutUrl);
  const response = await request.get(checkoutUrl, { maxRedirects: 0, failOnStatusCode: false });
  expect(response.status()).toBe(303);
  expect(response.headers()['location']).toMatch(/^https:\/\/checkout\.dodopayments\.com\/session\//u);
});

test('@claim:license-token-privacy stores a returned token and sends it only to Sociobot', async ({ page }) => {
  const tokenRequests: string[] = [];
  await page.route('https://api.sociobot.in/**', (route) => {
    tokenRequests.push(route.request().url());
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok' }) });
  });
  await page.goto('/?license=private_token');
  await expect(page.getByText('Personal license active')).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('sb_license:context-cloze-vocab'))).toBe('private_token');
  expect(tokenRequests).toEqual(['https://api.sociobot.in/api/v1/products/context-cloze-vocab/verify?license=private_token']);
});

test('@claim:clear-site-data clearing browser storage removes real demo and license data', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Word', { exact: true }).fill('keepsake');
  await page.getByLabel('Sentence containing that word').fill('This keepsake belongs on the desk.');
  await page.getByRole('button', { name: 'Save word' }).click();
  await page.goto('/?demo=1');
  const addForm = page.locator('#add-form');
  await addForm.getByLabel('Word', { exact: true }).fill('discard-me');
  await addForm.getByLabel('Sentence containing that word').fill('Please discard-me when browser data is cleared.');
  await addForm.getByRole('button', { name: 'Save word' }).click();
  await expect(page.getByText('9 words', { exact: true })).toBeVisible();
  await page.evaluate(() => localStorage.setItem('sb_license:context-cloze-vocab', 'erase-me'));
  const session = await page.context().newCDPSession(page);
  await session.send('Storage.clearDataForOrigin', { origin: 'http://127.0.0.1:4173', storageTypes: 'indexeddb,local_storage' });
  await expect.poll(() => page.evaluate(async () => (await indexedDB.databases()).map(({ name }) => name).filter((name) => name?.startsWith('context-cloze-')))).toEqual([]);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('sb_license:context-cloze-vocab'))).toBeNull();
  await page.goto('/');
  await expect(page.getByText('0 words', { exact: true })).toBeVisible();
  await expect(page.getByText('keepsake', { exact: true })).toHaveCount(0);
  await page.goto('/?demo=1');
  await expect(page.getByText('8 words', { exact: true })).toBeVisible();
  await expect(page.getByText('discard-me', { exact: true })).toHaveCount(0);
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

test('@claim:free-confusion-limit shows exactly three pairs without a license', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Personal license active')).toHaveCount(0);
  const words = ['amber', 'birch', 'cinder', 'dawn'].map((word, index) => ({
    id: `free-pair-word-${index}`,
    word,
    sentence: `The ${word} marker belongs in this fixture.`
  }));
  const reviews = words.map((item, index) => ({
    id: `free-pair-review-${index}`,
    itemId: item.id,
    answer: item.word,
    typed: `guess${index}`,
    correct: false
  }));
  await page.locator('#import-file').setInputFiles({
    name: 'free-pairs-fixture.json',
    mimeType: 'application/json',
    buffer: backupFixture(words, reviews)
  });
  await expect(page.getByRole('status')).toHaveText('Imported 4 words.');
  const pairs = page.locator('.confusions ol li');
  await expect(pairs).toHaveCount(3);
  for (let index = 0; index < 3; index += 1) await expect(pairs.nth(index)).toContainText(`guess${index}`);
  await expect(page.getByText('The free view shows three pairs.')).toBeVisible();
  await expect(page.getByText('The one-time license shows the full list.')).toBeVisible();
});
