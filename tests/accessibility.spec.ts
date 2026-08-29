import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const path of ['/', '/demo', '/privacy', '/terms', '/offline', '/404.html']) {
  test(`accessibility smoke ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
  });
}

test('mobile layout keeps controls within a 390px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?demo=1');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  for (const target of [
    page.getByRole('heading', { name: 'Type the missing word' }),
    page.locator('.review-sheet blockquote'),
    page.getByLabel('Your answer'),
    page.getByRole('button', { name: 'Check answer' })
  ]) {
    await expect(target).toBeVisible();
    const box = await target.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y + box!.height).toBeLessThanOrEqual(844);
  }
});

test('mobile landing keeps its sample action in the first view', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const action = page.getByRole('link', { name: 'Try it with sample data' });
  await expect(action).toBeVisible();
  const box = await action.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y + box!.height).toBeLessThanOrEqual(844);
});

test('mobile demo banner and compact wordmark keep 44px touch targets', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  for (const target of [
    page.getByRole('button', { name: 'Reset demo' }),
    page.getByRole('button', { name: 'Start for real' }),
    page.getByRole('link', { name: 'Context Cloze home' })
  ]) {
    await expect(target).toBeVisible();
    const box = await target.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});

test('keyboard users can skip to the demo workspace and answer a review', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveAttribute('href', '#main');
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Type the missing word' })).toBeVisible();
  await page.getByLabel('Your answer').focus();
  await expect(page.getByLabel('Your answer')).toBeFocused();
});

test('keyboard focus is visible on Restore backup', async ({ page }) => {
  await page.goto('/');
  const input = page.locator('#import-file');
  await input.focus();
  await expect(input).toBeFocused();
  await expect(page.locator('.file-label')).toHaveCSS('outline-style', 'solid');
});

test('pasted-word sentence queue is accessible at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?demo=1');
  await page.getByText('Paste a word list', { exact: true }).click();
  await page.getByLabel('One word per line').fill('zealous\nresilient\nwhimsical');
  await page.getByRole('button', { name: 'Save words and add sentences' }).click();
  await expect(page.getByLabel('Sentence using zealous')).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
});

test('back navigation restores the prior scroll position', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Your practice desk' })).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  const before = await page.evaluate(() => window.scrollY);
  expect(before).toBeGreaterThan(300);
  await page.getByRole('link', { name: 'Privacy', exact: true }).last().click();
  await expect(page).toHaveURL('/privacy');
  await page.goBack();
  await expect(page).toHaveURL('/');
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(300);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
});

test('every app route updates its share metadata', async ({ page }) => {
  const expected = new Map([
    ['/', 'Context Cloze — practise words in sentences'],
    ['/demo', 'Demo — Context Cloze'],
    ['/privacy', 'Privacy — Context Cloze'],
    ['/terms', 'Terms — Context Cloze'],
    ['/offline', 'Offline — Context Cloze']
  ]);
  for (const [path, title] of expected) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `https://context-cloze-vocab.sociobot.in${path}`);
  }
});

test('SPA navigation focuses each page heading and keeps legal links available', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  await expect(page).toHaveURL('/privacy');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.getByRole('link', { name: 'Privacy', exact: true }).last()).toHaveAttribute('href', '/privacy');
  await expect(page.getByRole('link', { name: 'Terms', exact: true })).toHaveAttribute('href', '/terms');
});

test('paid panel links to license terms and a plain support address', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'license terms' })).toHaveAttribute('href', '/terms');
  await expect(page.getByRole('link', { name: 'support@sociobot.in' })).toHaveAttribute('href', 'mailto:support@sociobot.in');
});
