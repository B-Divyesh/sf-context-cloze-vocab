import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from '@playwright/test';

const base = new URL(process.env.LIVE_URL || 'https://context-cloze-vocab.sociobot.in');
const evidenceDirectory = process.env.LIVE_EVIDENCE_DIR;
if (evidenceDirectory) mkdirSync(evidenceDirectory, { recursive: true });

const browser = await chromium.launch();
const result = {
  routes: {}, axeSeriousOrCritical: {}, consoleErrors: [], externalRequests: [],
  mobile: {}, isolation: {}, offline: false, focusAndHistory: false,
  clearSiteData: false, restoreBackupFocus: null, destinations: {},
  zoomOverflow: null, reducedMotion: null, wordListPaste: {}
};

function evidencePath(name) {
  return evidenceDirectory ? join(evidenceDirectory, name) : undefined;
}

async function screenshot(page, name, fullPage = false) {
  const path = evidencePath(name);
  if (path) await page.screenshot({ path, fullPage });
}

async function readWords(page, databaseName) {
  return page.evaluate(async (name) => {
    const database = await new Promise((resolve, reject) => {
      const request = indexedDB.open(name);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const words = await new Promise((resolve, reject) => {
      const request = database.transaction('items', 'readonly').objectStore('items').getAll();
      request.onsuccess = () => resolve(request.result.map((item) => item.word).sort());
      request.onerror = () => reject(request.error);
    });
    database.close();
    return words;
  }, databaseName);
}

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  let testingExpected404 = false;
  page.on('pageerror', (error) => result.consoleErrors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error' && !(testingExpected404 && message.text().includes('404'))) result.consoleErrors.push(message.text());
  });
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== base.origin) result.externalRequests.push(url.href);
  });

  await page.goto(new URL('/', base).href, { waitUntil: 'networkidle' });
  assert.equal(await page.title(), 'Context Cloze — practise words in sentences');
  assert.equal(await page.locator('h1').innerText(), 'Recall words inside sentences');
  const sample = page.getByRole('link', { name: 'Try it with sample data' });
  const sampleBox = await sample.boundingBox();
  assert(sampleBox && sampleBox.y + sampleBox.height <= 844);
  result.mobile.homeActionBottom = Math.round(sampleBox.y + sampleBox.height);
  const firstHomeCopy = await page.locator('body').innerText();
  assert(firstHomeCopy.includes('Add a word and a sentence. Context Cloze hides the word.'));
  assert(firstHomeCopy.toLowerCase().includes('practice steps'));
  assert(firstHomeCopy.toLowerCase().includes('your content and storage'));
  assert.equal(await page.locator('#how h3').nth(1).innerText(), 'Type the missing word');
  assert(!firstHomeCopy.includes('Backup files use JSON format.'));
  result.destinations.checkout = await page.getByRole('link', { name: /Buy for \$12 once/u }).getAttribute('href');
  result.destinations.factory = await page.getByRole('link', { name: /Built by Param Factory/u }).getAttribute('href');
  assert.equal(result.destinations.checkout, 'https://api.sociobot.in/api/v1/products/context-cloze-vocab/checkout');
  assert.equal(result.destinations.factory, 'https://hello-factory.sociobot.in');
  const restoreInput = page.locator('#import-file');
  await restoreInput.focus();
  result.restoreBackupFocus = await page.locator('.file-label').evaluate((element) => {
    const style = getComputedStyle(element);
    return { style: style.outlineStyle, width: style.outlineWidth, color: style.outlineColor };
  });
  assert.equal(result.restoreBackupFocus.style, 'solid');
  assert(Number.parseFloat(result.restoreBackupFocus.width) >= 3);
  await screenshot(page, 'polish-5-live-home-390.png');
  await page.getByLabel('Word', { exact: true }).fill('keepsake');
  await page.getByLabel('Sentence containing that word').fill('This keepsake stays in the real word list.');
  await page.getByRole('button', { name: 'Save word' }).click();
  const realBefore = await readWords(page, 'context-cloze-real');
  assert.deepEqual(realBefore, ['keepsake']);

  await page.evaluate(() => {
    window.sawRealWordInDemo = false;
    new MutationObserver(() => {
      if (new URL(location.href).searchParams.get('demo') === '1' && document.body.innerText.includes('keepsake')) {
        window.sawRealWordInDemo = true;
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  });
  await sample.click();
  assert.equal(page.url(), new URL('/?demo=1', base).href);
  assert.match(await page.getByLabel('Demo status').innerText(), /sample data, nothing is saved to your word list/u);
  let lowestDemoControl = 0;
  for (const target of [
    page.getByRole('heading', { name: 'Type the missing word' }),
    page.locator('.review-sheet blockquote'),
    page.getByLabel('Your answer'),
    page.getByRole('button', { name: 'Check answer' })
  ]) {
    const box = await target.boundingBox();
    assert(box && box.y + box.height <= 844);
    lowestDemoControl = Math.max(lowestDemoControl, box.y + box.height);
  }
  result.mobile.demoLastControlBottom = Math.round(lowestDemoControl);
  for (const target of [
    page.getByRole('button', { name: 'Reset demo' }),
    page.getByRole('button', { name: 'Start for real' }),
    page.getByRole('link', { name: 'Context Cloze home' })
  ]) {
    const box = await target.boundingBox();
    assert(box && box.width >= 44 && box.height >= 44);
  }
  await screenshot(page, 'polish-5-live-demo-390.png');
  const demoCopy = await page.locator('body').innerText();
  assert(!demoCopy.includes('keepsake'));
  assert(!demoCopy.includes('Close calls'));
  assert(demoCopy.toLowerCase().includes('wrong answers'));
  assert.equal(await page.evaluate(() => window.sawRealWordInDemo), false);
  assert(!(await readWords(page, 'context-cloze-demo')).includes('keepsake'));

  await page.getByText('Paste a word list', { exact: true }).click();
  await page.getByLabel('One word per line').fill('zealous\nresilient\nwhimsical');
  await page.getByRole('button', { name: 'Save words and add sentences' }).click();
  assert.equal(await page.getByRole('heading', { name: 'Add a sentence for “zealous”' }).innerText(), 'Add a sentence for “zealous”');
  assert(await page.getByLabel('Sentence using zealous').evaluate((element) => element === document.activeElement));
  assert.deepEqual(await readWords(page, 'context-cloze-real'), realBefore);
  const demoAfterWordPaste = await readWords(page, 'context-cloze-demo');
  for (const word of ['zealous', 'resilient', 'whimsical']) assert(demoAfterWordPaste.includes(word));
  await page.getByLabel('Sentence using zealous').fill('A zealous student reviewed every morning.');
  await page.getByRole('button', { name: 'Save sentence and continue' }).click();
  assert.equal(await page.getByRole('heading', { name: 'Add a sentence for “resilient”' }).innerText(), 'Add a sentence for “resilient”');
  const dynamicSerious = (await new AxeBuilder({ page }).analyze()).violations
    .filter((violation) => ['serious', 'critical'].includes(violation.impact || ''));
  assert.equal(dynamicSerious.length, 0);
  assert((await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)) <= 1);
  await page.locator('#sentence-queue-heading').scrollIntoViewIfNeeded();
  await screenshot(page, 'polish-5-live-word-list-390.png');
  result.wordListPaste = { demoWords: demoAfterWordPaste.length, nextWord: 'resilient', axeSeriousOrCritical: dynamicSerious.length };

  const add = page.locator('#add-form');
  await add.getByLabel('Word', { exact: true }).fill('temporary');
  await add.getByLabel('Sentence containing that word').fill('This temporary word stays inside the demo.');
  await add.getByRole('button', { name: 'Save word' }).click();
  assert((await readWords(page, 'context-cloze-demo')).includes('temporary'));
  assert.deepEqual(await readWords(page, 'context-cloze-real'), realBefore);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await page.getByText('8 words', { exact: true }).waitFor();
  await page.getByRole('heading', { name: 'Type the missing word' }).waitFor();
  assert(!(await readWords(page, 'context-cloze-demo')).includes('temporary'));
  assert.deepEqual(await readWords(page, 'context-cloze-real'), realBefore);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.getByText('keepsake', { exact: true }).waitFor();
  assert.deepEqual(await readWords(page, 'context-cloze-demo'), []);
  result.isolation = {
    realWordsAfterDemo: await readWords(page, 'context-cloze-real'),
    demoWordsAfterExit: await readWords(page, 'context-cloze-demo')
  };

  const routeExpectations = new Map([
    ['/', 'Context Cloze — practise words in sentences'],
    ['/demo', 'Demo — Context Cloze'],
    ['/privacy', 'Privacy — Context Cloze'],
    ['/terms', 'Terms — Context Cloze'],
    ['/offline', 'Offline — Context Cloze'],
    ['/polish-5-missing', 'Page not found — Context Cloze']
  ]);
  for (const [path, title] of routeExpectations) {
    testingExpected404 = path.includes('missing');
    const response = await page.goto(new URL(path, base).href, { waitUntil: 'networkidle' });
    const expectedStatus = path.includes('missing') ? 404 : 200;
    assert.equal(response.status(), expectedStatus);
    assert.equal(await page.title(), title);
    assert.equal(await page.locator('h1').count(), 1);
    if (path.includes('missing')) assert.equal(await page.locator('h1').innerText(), 'Page not found');
    assert.equal(await page.locator('main').count(), 1);
    assert.equal(await page.locator('link[rel="canonical"]').count(), 1);
    assert.equal(await page.locator('meta[property="og:title"]').getAttribute('content'), title);
    const serious = (await new AxeBuilder({ page }).analyze()).violations
      .filter((violation) => ['serious', 'critical'].includes(violation.impact || ''));
    assert.equal(serious.length, 0);
    result.routes[path] = expectedStatus;
    result.axeSeriousOrCritical[path] = serious.length;
    if (path === '/privacy') await screenshot(page, 'polish-5-live-privacy.png', true);
    if (path === '/terms') await screenshot(page, 'polish-5-live-terms.png', true);
    if (path.includes('missing')) await screenshot(page, 'polish-5-live-404.png', true);
    testingExpected404 = false;
  }

  await page.goto(new URL('/', base).href, { waitUntil: 'networkidle' });
  assert.equal(await page.getByRole('link', { name: 'license terms' }).getAttribute('href'), '/terms');
  assert.equal(await page.getByRole('link', { name: 'support@sociobot.in' }).getAttribute('href'), 'mailto:support@sociobot.in');
  const homeCopy = await page.locator('body').innerText();
  for (const phrase of ['A small daily loop', 'Bring the sentence', 'Original generated scene', 'merchant of record', 'A quiet tool, not a course']) {
    assert(!homeCopy.includes(phrase));
  }
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  const priorScroll = await page.evaluate(() => scrollY);
  await page.getByRole('link', { name: 'Privacy', exact: true }).last().click();
  assert(await page.getByRole('heading', { level: 1 }).evaluate((element) => element === document.activeElement));
  await page.goBack();
  await page.waitForTimeout(550);
  assert(priorScroll > 300 && (await page.evaluate(() => scrollY)) > 300);
  assert(await page.getByRole('heading', { level: 1 }).evaluate((element) => element === document.activeElement));
  result.focusAndHistory = true;
  await page.goto(new URL('/?demo=1', base).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  result.zoomOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(result.zoomOverflow <= 1);
  assert.deepEqual(result.consoleErrors, []);
  assert.deepEqual(result.externalRequests, []);
  await context.close();

  const clearContext = await browser.newContext();
  const clearPage = await clearContext.newPage();
  await clearPage.goto(new URL('/', base).href);
  await clearPage.getByLabel('Word', { exact: true }).fill('erase-real');
  await clearPage.getByLabel('Sentence containing that word').fill('This erase-real entry should disappear.');
  await clearPage.getByRole('button', { name: 'Save word' }).click();
  await clearPage.goto(new URL('/?demo=1', base).href);
  const clearAdd = clearPage.locator('#add-form');
  await clearAdd.getByLabel('Word', { exact: true }).fill('erase-demo');
  await clearAdd.getByLabel('Sentence containing that word').fill('This erase-demo entry should disappear.');
  await clearAdd.getByRole('button', { name: 'Save word' }).click();
  await clearPage.evaluate(() => localStorage.setItem('sb_license:context-cloze-vocab', 'erase-license'));
  const devtools = await clearContext.newCDPSession(clearPage);
  await devtools.send('Storage.clearDataForOrigin', { origin: base.origin, storageTypes: 'indexeddb,local_storage' });
  await clearPage.waitForFunction(async () => (await indexedDB.databases()).every(({ name }) => !name?.startsWith('context-cloze-')));
  assert.equal(await clearPage.evaluate(() => localStorage.getItem('sb_license:context-cloze-vocab')), null);
  await clearPage.goto(new URL('/', base).href);
  await clearPage.getByText('0 words', { exact: true }).waitFor();
  assert(!(await clearPage.locator('body').innerText()).includes('erase-real'));
  await clearPage.goto(new URL('/?demo=1', base).href);
  await clearPage.getByText('8 words', { exact: true }).waitFor();
  assert(!(await clearPage.locator('body').innerText()).includes('erase-demo'));
  result.clearSiteData = true;
  await clearContext.close();

  const offlineContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const offlinePage = await offlineContext.newPage();
  await offlinePage.goto(new URL('/?demo=1', base).href, { waitUntil: 'networkidle' });
  await offlinePage.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await offlinePage.waitForFunction(async () => (await Promise.all((await caches.keys()).map(async (name) => (await caches.open(name)).keys())))
    .flat().some((request) => new URL(request.url).searchParams.get('demo') === '1'));
  await offlineContext.setOffline(true);
  await offlinePage.reload();
  await offlinePage.getByText('8 words', { exact: true }).waitFor();
  assert.equal(await offlinePage.title(), 'Demo — Context Cloze');
  result.offline = true;
  await offlineContext.close();

  const motionContext = await browser.newContext({ reducedMotion: 'reduce' });
  const motionPage = await motionContext.newPage();
  await motionPage.goto(new URL('/', base).href);
  result.reducedMotion = await motionPage.locator('.hero-art').evaluate((element) => getComputedStyle(element).animationDuration);
  assert(Number.parseFloat(result.reducedMotion) <= 0.00001);
  await motionContext.close();
} finally {
  await browser.close();
}

console.log(JSON.stringify(result, null, 2));
