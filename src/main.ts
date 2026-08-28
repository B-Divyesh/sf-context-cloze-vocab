import './styles.css';
import { answerMatches, clozeSentence, confusionPairs, containsWord, newItem, parseBulk, schedule } from './model';
import { VocabularyStore } from './storage';
import { cachedLicense, captureLicense, checkoutUrl, clearLicense, isPro, saveLicense, verifyLicense } from './license';
import type { Review, VocabItem } from './types';

type AppRoute = 'home' | 'demo' | 'privacy' | 'terms' | 'offline' | 'not-found';

const app = document.querySelector<HTMLDivElement>('#app')!;
let route = routeFor(location.pathname);
let store = new VocabularyStore(route === 'demo');
let items: VocabItem[] = [];
let reviews: Review[] = [];
let practice: VocabItem[] = [];
let practiceIndex = 0;
let feedback: { correct: boolean; typed: string; answer: string } | null = null;
let notice = '';
let noticeKind: 'info' | 'error' | 'success' = 'info';
let isLoading = true;

captureLicense();

function routeFor(path: string): AppRoute {
  if (path === '/') return 'home';
  if (path === '/demo') return 'demo';
  if (path === '/privacy') return 'privacy';
  if (path === '/terms') return 'terms';
  if (path === '/offline') return 'offline';
  return 'not-found';
}

const escapeHtml = (value: string): string => value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]!);

function pageMeta(current: AppRoute): { title: string; description: string } {
  switch (current) {
    case 'demo': return { title: 'Demo — Context Cloze', description: 'Practise eight sample words in an isolated Context Cloze workspace.' };
    case 'privacy': return { title: 'Privacy — Context Cloze', description: 'How Context Cloze stores vocabulary and handles license checks.' };
    case 'terms': return { title: 'Terms — Context Cloze', description: 'Terms for using Context Cloze and its one-time paid license.' };
    case 'offline': return { title: 'Offline — Context Cloze', description: 'Context Cloze is ready to work without a connection.' };
    case 'not-found': return { title: 'Page not found — Context Cloze', description: 'This Context Cloze page does not exist.' };
    default: return { title: 'Context Cloze — practise words in sentences', description: 'Paste your own words and sentences, then practise retrieving each word in context. Your vocabulary stays on your device.' };
  }
}

function updateMeta(): void {
  const meta = pageMeta(route);
  document.title = meta.title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content = meta.description;
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href = `https://context-cloze-vocab.sociobot.in${location.pathname}`;
}

function header(): string {
  return `
    <a class="skip-link" href="#main">Skip to main content</a>
    ${route === 'demo' ? `<aside class="demo-banner" aria-label="Demo status"><span><strong>Demo</strong> — sample data, nothing is saved to your vocabulary</span><span class="demo-actions"><button class="text-button" data-action="reset-demo">Reset demo</button><button class="text-button" data-action="leave-demo">Start for real</button></span></aside>` : ''}
    <header class="site-header">
      <a class="wordmark spa-link" href="/" aria-label="Context Cloze home"><span aria-hidden="true" class="wordmark-mark">C_</span><span>Context Cloze</span></a>
      <nav aria-label="Main navigation">
        <a class="spa-link" href="/demo" ${route === 'demo' ? 'aria-current="page"' : ''}>Demo</a>
        <a class="spa-link" href="/#how">How it works</a>
        <a class="spa-link" href="/privacy" ${route === 'privacy' ? 'aria-current="page"' : ''}>Privacy</a>
      </nav>
    </header>`;
}

function footer(): string {
  return `<footer class="site-footer">
    <p>Type the missing word in sentences you chose.</p>
    <nav aria-label="Footer navigation"><a class="spa-link" href="/privacy">Privacy</a><a class="spa-link" href="/terms">Terms</a><a href="https://hello-factory.sociobot.in" rel="external">Built by Param Factory</a></nav>
    <p class="build">Version 1.0.0 · Original generated scene</p>
  </footer>`;
}

function statusRegion(): string {
  return `<div class="announcer" aria-live="polite" aria-atomic="true">${escapeHtml(notice)}</div>${notice ? `<div class="toast toast-${noticeKind}" role="status">${escapeHtml(notice)}</div>` : ''}`;
}

function render(): void {
  updateMeta();
  const content = route === 'home' ? homePage() : route === 'demo' ? demoPage() : route === 'privacy' ? privacyPage() : route === 'terms' ? termsPage() : route === 'offline' ? offlinePage() : notFoundPage();
  app.innerHTML = `${header()}${content}${footer()}${statusRegion()}<div id="route-announcer" class="sr-only" aria-live="polite"></div>`;
  bindEvents();
}

function homePage(): string {
  return `<main id="main" tabindex="-1">
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Your words · your sentences</p>
        <h1 tabindex="-1">Recall words inside sentences</h1>
        <p class="lede">For independent learners who recognise words but cannot retrieve them while writing or speaking.</p>
        <div class="hero-actions">
          <a class="button primary spa-link" href="/demo">Try it with sample data</a>
          <a class="button secondary" href="#practice">Add your words</a>
          <p>Opens eight sample words. Your vocabulary stays untouched.</p>
        </div>
        <ul class="plain-facts" aria-label="Product facts">
          <li><span aria-hidden="true">●</span> Stored on this device</li>
          <li><span aria-hidden="true">●</span> Works offline after your first visit</li>
          <li><span aria-hidden="true">●</span> Free for 50 words</li>
        </ul>
      </div>
      <figure class="hero-art">
        <picture>
          <source media="(max-width: 720px)" srcset="/assets/night-archive-720.webp" />
          <img src="/assets/night-archive-1200.webp" width="1200" height="800" fetchpriority="high" alt="A blank notebook waits under a lamp beside a rainy night window." />
        </picture>
        <figcaption>Bring the sentence. Context Cloze supplies the blank.</figcaption>
      </figure>
    </section>
    ${workspace('Your practice desk')}
    <section id="how" class="editorial-section">
      <p class="eyebrow">A small daily loop</p>
      <h2>How sentence practice works</h2>
      <ol class="steps">
        <li><span>01</span><div><h3>Add words in context</h3><p>Paste a word and a sentence you trust. The word becomes the blank.</p></div></li>
        <li><span>02</span><div><h3>Type what belongs</h3><p>Due words return as open questions. Capitalisation does not affect marking.</p></div></li>
        <li><span>03</span><div><h3>Notice close calls</h3><p>Wrong guesses become confusion pairs. Use them to sharpen word choice.</p></div></li>
      </ol>
    </section>
    <section class="limits-section">
      <div><p class="eyebrow">A quiet tool, not a course</p><h2>You choose every sentence</h2></div>
      <div><p>Context Cloze has no dictionary, generated text, public decks, social feed, or streak.</p><p>Only add text you may store. Your vocabulary remains in this browser unless you export it.</p></div>
    </section>
    ${paidSection()}
  </main>`;
}

function demoPage(): string {
  return `<main id="main" class="demo-main" tabindex="-1">
    <section class="page-lead demo-lead"><p class="eyebrow">Eight words are ready</p><h1 tabindex="-1">Practise sample words in context</h1><p>Answer a due sentence, inspect the confusion pairs, or add a temporary word.</p></section>
    ${workspace('Sample practice desk')}
  </main>`;
}

function workspace(title: string): string {
  const now = Date.now();
  const due = items.filter((item) => item.dueAt <= now).sort((a, b) => a.dueAt - b.dueAt);
  const pairs = confusionPairs(items, reviews);
  return `<section id="practice" class="workspace" aria-labelledby="desk-title">
    <div class="workspace-head"><div><p class="eyebrow">Local practice</p><h2 id="desk-title">${title}</h2></div>
      <div class="stats" aria-label="Vocabulary status"><span><strong>${items.length}</strong> words</span><span><strong>${due.length}</strong> due now</span><span><strong>${reviews.length}</strong> answers</span></div>
    </div>
    ${isLoading ? `<div class="loading" role="status"><span></span>Opening your vocabulary…</div>` : items.length === 0 ? emptyWorkspace() : practicePanel(due)}
    <div class="desk-grid">
      ${addPanel()}
      ${libraryPanel()}
    </div>
    ${items.length ? confusionPanel(pairs) : ''}
    ${dataPanel()}
  </section>`;
}

function emptyWorkspace(): string {
  return `<div class="empty-state"><p class="empty-mark" aria-hidden="true">_____</p><h3>Your first blank will appear here</h3><p>Add a word and a sentence that uses it. You can then start a typed review.</p><a class="button primary" href="#add-words">Add your first word</a></div>`;
}

function practicePanel(due: VocabItem[]): string {
  if (practice.length && practiceIndex < practice.length) {
    const item = practice[practiceIndex];
    return `<section class="review-sheet" aria-labelledby="review-heading">
      <div class="review-progress"><span>Sentence ${practiceIndex + 1} of ${practice.length}</span><progress value="${practiceIndex + 1}" max="${practice.length}">${practiceIndex + 1} of ${practice.length}</progress></div>
      <h3 id="review-heading">Type the missing word</h3>
      <blockquote dir="auto">${escapeHtml(clozeSentence(item.sentence, item.word))}</blockquote>
      ${item.note ? `<p class="hint" dir="auto"><strong>Meaning:</strong> ${escapeHtml(item.note)}</p>` : ''}
      <form id="answer-form" novalidate>
        <label for="answer">Your answer</label>
        <div class="answer-row"><input id="answer" name="answer" dir="auto" autocomplete="off" autocapitalize="off" spellcheck="false" ${feedback ? 'disabled' : ''} required /><button class="button primary" type="submit" ${feedback ? 'disabled' : ''}>Check answer</button></div>
      </form>
      ${feedback ? `<div class="feedback ${feedback.correct ? 'correct' : 'incorrect'}" role="status"><strong>${feedback.correct ? 'Correct.' : 'Not this time.'}</strong> The answer is <bdi>${escapeHtml(feedback.answer)}</bdi>.${!feedback.correct ? ` You typed <bdi>${escapeHtml(feedback.typed || 'nothing')}</bdi>.` : ''}</div><button class="button primary" data-action="next-review">${practiceIndex + 1 === practice.length ? 'Finish session' : 'Next sentence'}</button>` : ''}
    </section>`;
  }
  if (practice.length && practiceIndex >= practice.length) {
    return `<div class="session-done"><p class="eyebrow">Session complete</p><h3>You answered ${practice.length} sentence${practice.length === 1 ? '' : 's'}.</h3><p>Your next due dates are saved on this device.</p><button class="button primary" data-action="close-session">Return to your words</button></div>`;
  }
  return `<div class="due-strip"><div><h3>${due.length ? `${due.length} ${due.length === 1 ? 'word is' : 'words are'} ready` : 'Nothing is due now'}</h3><p>${due.length ? 'A short session uses only the words due today.' : 'You can practise every word or add another sentence.'}</p></div><div>${due.length ? `<button class="button primary" data-action="start-due">Practise due words</button>` : ''}<button class="button secondary dark" data-action="start-all">Practise all words</button></div></div>`;
}

function addPanel(): string {
  return `<section id="add-words" class="desk-panel"><p class="eyebrow">Build your list</p><h3>Add words and sentences</h3>
    <form id="add-form" novalidate>
      <label for="word">Word</label><input id="word" name="word" dir="auto" maxlength="80" required />
      <label for="sentence">Sentence containing that word</label><textarea id="sentence" name="sentence" dir="auto" rows="3" maxlength="500" required></textarea>
      <label for="note">Meaning or hint <span>(optional)</span></label><input id="note" name="note" dir="auto" maxlength="160" />
      <p id="add-error" class="form-error" role="alert"></p>
      <button class="button primary" type="submit">Save word</button>
    </form>
    <details class="bulk-add"><summary>Paste several words</summary><form id="bulk-form" novalidate><label for="bulk">One per line: word | sentence</label><textarea id="bulk" name="bulk" dir="auto" rows="6" placeholder="scarce | Clean water becomes scarce in summer."></textarea><p class="field-help">A tab works instead of the | mark.</p><p id="bulk-error" class="form-error" role="alert"></p><button class="button secondary dark" type="submit" aria-label="Save pasted words">Save pasted words</button></form></details>
  </section>`;
}

function libraryPanel(): string {
  const sorted = [...items].sort((a, b) => a.word.localeCompare(b.word));
  return `<section class="desk-panel library"><div class="panel-heading"><div><p class="eyebrow">Your material</p><h3>Word list</h3></div><span>${items.length}${!isPro() && route !== 'demo' ? ' / 50 free' : ''}</span></div>
    ${sorted.length ? `<ul class="word-list">${sorted.map((item) => `<li data-item-id="${item.id}"><div class="word-row"><div><strong dir="auto">${escapeHtml(item.word)}</strong><p dir="auto">${escapeHtml(item.sentence)}</p><small>${dueLabel(item.dueAt)}</small></div><details><summary aria-label="Edit ${escapeHtml(item.word)}">Edit</summary><form class="edit-form"><label>Word<input name="word" value="${escapeHtml(item.word)}" dir="auto" required /></label><label>Sentence<textarea name="sentence" dir="auto" required>${escapeHtml(item.sentence)}</textarea></label><label>Meaning or hint<input name="note" value="${escapeHtml(item.note)}" dir="auto" /></label><p class="form-error" role="alert"></p><div><button class="button small primary" type="submit">Save changes</button><button class="text-button danger" type="button" data-action="delete-item">Delete word</button></div></form></details></div></li>`).join('')}</ul>` : `<p class="muted">Saved words will appear here.</p>`}
  </section>`;
}

function confusionPanel(pairs: ReturnType<typeof confusionPairs>): string {
  return `<section class="confusions"><div><p class="eyebrow">Close calls</p><h3>Confusion pairs</h3><p>These pairs come from your incorrect answers.</p></div>${pairs.length ? `<ol>${pairs.slice(0, isPro() || route === 'demo' ? 12 : 3).map((pair) => `<li><span><bdi>${escapeHtml(pair.typed)}</bdi> <span aria-hidden="true">→</span> <bdi>${escapeHtml(pair.answer)}</bdi></span><small>${pair.count} ${pair.count === 1 ? 'mix-up' : 'mix-ups'}</small></li>`).join('')}</ol>` : `<p class="muted">Wrong guesses will appear here beside the intended word.</p>`}${pairs.length > 3 && !isPro() && route !== 'demo' ? `<p class="pro-note">The free view shows three pairs. The one-time license shows the full list.</p>` : ''}</section>`;
}

function dataPanel(): string {
  return `<section class="data-panel"><div><p class="eyebrow">Keep your copy</p><h3>Move or back up your vocabulary</h3><p>Export includes your sentences, schedule, and answer history.</p></div><div class="data-actions"><button class="button secondary dark" data-action="export">Export JSON</button><label class="button secondary dark file-label">Import JSON<input id="import-file" type="file" accept="application/json,.json" /></label></div></section>`;
}

function paidSection(): string {
  const state = cachedLicense();
  return `<section class="paid-section" id="paid"><div><p class="eyebrow">Optional one-time license</p><h2>Keep a larger word archive</h2><p>Pay $12 once for unlimited words and the full confusion-pair history. Practice, 50 words, and exports remain free.</p></div><div class="license-card">${isPro() ? `<p class="license-active"><span aria-hidden="true">✓</span> Personal license active</p><button class="text-button" data-action="remove-license">Remove this license</button>` : `<a class="button primary" href="${checkoutUrl}">Buy for $12 once</a><details><summary>Have a license?</summary><form id="license-form"><label for="license-token">Paste your license</label><input id="license-token" name="license" value="${escapeHtml(state?.token || '')}" autocomplete="off" required /><button class="button secondary dark" type="submit" aria-label="Verify license">Verify license</button></form></details>${state?.token && !state.valid ? `<p class="license-warning">This license is not active. Check it or buy a new one.</p>` : ''}<p class="merchant">Checkout and refunds are handled by Sociobot/Dodo.</p>`}</div></section>`;
}

function privacyPage(): string {
  return `<main id="main" class="legal-page" tabindex="-1"><p class="eyebrow">Last updated 28 August 2026</p><h1 tabindex="-1">Your vocabulary stays in your browser</h1><p class="lede">Context Cloze stores words, sentences, schedules, and answers in IndexedDB on this device.</p><h2>What stays local</h2><p>Your practice data does not leave this browser. Demo data uses a separate database and never reads your real vocabulary.</p><h2>Exports and deletion</h2><p>Exports are files you ask the browser to create. Delete browser site data to remove all local records.</p><h2>License checks</h2><p>If you paste or buy a license, the token is stored locally. The app sends it only to the Sociobot billing API for verification.</p><h2>Analytics</h2><p>This app includes no advertising, behavioural analytics, or third-party scripts.</p><h2>Contact</h2><p>Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a> with a privacy question.</p></main>`;
}

function termsPage(): string {
  return `<main id="main" class="legal-page" tabindex="-1"><p class="eyebrow">Last updated 28 August 2026</p><h1 tabindex="-1">Use Context Cloze for your own material</h1><p class="lede">These terms cover the local app and its one-time personal license.</p><h2>Your sentences</h2><p>Only add text you have the right to store. You remain responsible for your vocabulary and example sentences.</p><h2>The service</h2><p>The app is provided as available. Keep JSON exports if losing browser storage would cause harm.</p><h2>One-time license</h2><p>A $12 purchase unlocks unlimited words and full confusion history for one person. Sociobot/Dodo is the merchant of record and handles refunds. A refunded or disputed purchase may revoke its license.</p><h2>Acceptable use</h2><p>Do not interfere with the site, billing API, or other users. The app is not a language course or professional translation service.</p><h2>Contact</h2><p>Email <a href="mailto:support@sociobot.in">support@sociobot.in</a> with a terms question.</p></main>`;
}

function offlinePage(): string {
  return `<main id="main" class="state-page" tabindex="-1"><div class="horizon-mark" aria-hidden="true">C_____</div><p class="eyebrow">No connection needed</p><h1 tabindex="-1">Keep practising while offline</h1><p>Your saved words and due sessions are available. License checks wait until your connection returns.</p><a class="button primary spa-link" href="/">Open your practice desk</a></main>`;
}

function notFoundPage(): string {
  return `<main id="main" class="state-page" tabindex="-1"><div class="horizon-mark" aria-hidden="true">_____?</div><p class="eyebrow">404 · Missing page</p><h1 tabindex="-1">This sentence has no ending</h1><p>The address does not match a page in Context Cloze.</p><a class="button primary spa-link" href="/">Return to your words</a></main>`;
}

function dueLabel(dueAt: number): string {
  const diff = dueAt - Date.now();
  if (diff <= 0) return 'Due now';
  const days = Math.ceil(diff / 86_400_000);
  return `Due in ${days} ${days === 1 ? 'day' : 'days'}`;
}

function showNotice(message: string, kind: 'info' | 'error' | 'success' = 'info'): void {
  notice = message;
  noticeKind = kind;
  render();
  window.setTimeout(() => { if (notice === message) { notice = ''; render(); } }, 3500);
}

async function loadData(): Promise<void> {
  isLoading = true;
  render();
  try {
    if (route === 'demo') await store.seedDemo();
    [items, reviews] = await Promise.all([store.getItems(), store.getReviews()]);
  } catch {
    notice = 'Your vocabulary could not open. Check browser storage, then reload.';
    noticeKind = 'error';
  }
  isLoading = false;
  render();
}

async function navigate(path: string, push = true): Promise<void> {
  const url = new URL(path, location.origin);
  if (push) history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
  const next = routeFor(url.pathname);
  const modeChanged = (next === 'demo') !== (route === 'demo');
  route = next;
  practice = [];
  feedback = null;
  if (modeChanged) store = new VocabularyStore(route === 'demo');
  if (route === 'home' || route === 'demo') await loadData(); else render();
  window.scrollTo({ top: 0, behavior: 'auto' });
  requestAnimationFrame(() => {
    document.querySelector<HTMLElement>('main h1')?.focus();
    const announcer = document.querySelector('#route-announcer');
    if (announcer) announcer.textContent = document.title;
    if (url.hash) document.querySelector(url.hash)?.scrollIntoView();
  });
}

function bindEvents(): void {
  document.querySelector<HTMLAnchorElement>('.skip-link')?.addEventListener('click', (event) => {
    event.preventDefault();
    const main = document.querySelector<HTMLElement>('#main');
    main?.focus();
    main?.scrollIntoView();
  });
  document.querySelectorAll<HTMLAnchorElement>('a.spa-link').forEach((link) => link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || link.target) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin) return;
    event.preventDefault();
    if (url.pathname === location.pathname && url.hash) {
      history.pushState({}, '', url);
      document.querySelector(url.hash)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    } else void navigate(`${url.pathname}${url.search}${url.hash}`);
  }));

  document.querySelector('#add-form')?.addEventListener('submit', onAdd);
  document.querySelector('#bulk-form')?.addEventListener('submit', onBulkAdd);
  document.querySelector('#answer-form')?.addEventListener('submit', onAnswer);
  document.querySelectorAll<HTMLFormElement>('.edit-form').forEach((form) => form.addEventListener('submit', onEdit));
  document.querySelector('#import-file')?.addEventListener('change', onImport);
  document.querySelector('#license-form')?.addEventListener('submit', onLicense);
  document.querySelectorAll<HTMLElement>('[data-action]').forEach((target) => target.addEventListener('click', onAction));
  if (practice.length && !feedback) requestAnimationFrame(() => document.querySelector<HTMLInputElement>('#answer')?.focus());
}

async function onAdd(event: Event): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const data = new FormData(form);
  const word = String(data.get('word') || '').trim();
  const sentence = String(data.get('sentence') || '').trim();
  const error = form.querySelector<HTMLElement>('#add-error')!;
  if (!word || !sentence) { error.textContent = 'Add both a word and its sentence.'; return; }
  if (!containsWord(sentence, word)) { error.textContent = 'The sentence must include the exact word. Add it, then save again.'; return; }
  if (!isPro() && route !== 'demo' && items.length >= 50) { error.textContent = 'The free list holds 50 words. Export your data or add a one-time license.'; return; }
  await store.putItem(newItem(word, sentence, String(data.get('note') || '')));
  form.reset();
  await refresh(`Saved “${word}”.`, 'success');
}

async function onBulkAdd(event: Event): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const parsed = parseBulk(String(new FormData(form).get('bulk') || ''));
  const error = form.querySelector<HTMLElement>('#bulk-error')!;
  if (parsed.errors.length) { error.textContent = parsed.errors.join(' '); return; }
  if (!parsed.rows.length) { error.textContent = 'Paste at least one word and sentence.'; return; }
  if (!isPro() && route !== 'demo' && items.length + parsed.rows.length > 50) { error.textContent = `Only ${50 - items.length} free word spaces remain. Paste fewer lines or add a license.`; return; }
  await Promise.all(parsed.rows.map((row) => store.putItem(newItem(row.word, row.sentence))));
  form.reset();
  await refresh(`Saved ${parsed.rows.length} ${parsed.rows.length === 1 ? 'word' : 'words'}.`, 'success');
}

async function onEdit(event: Event): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const id = form.closest<HTMLElement>('[data-item-id]')?.dataset.itemId;
  const item = items.find((candidate) => candidate.id === id);
  if (!item) return;
  const data = new FormData(form);
  const word = String(data.get('word') || '').trim();
  const sentence = String(data.get('sentence') || '').trim();
  const error = form.querySelector<HTMLElement>('.form-error')!;
  if (!word || !sentence || !containsWord(sentence, word)) { error.textContent = 'The sentence must include the exact word.'; return; }
  await store.putItem({ ...item, word, sentence, note: String(data.get('note') || '').trim() });
  await refresh(`Saved changes to “${word}”.`, 'success');
}

async function onAnswer(event: Event): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const item = practice[practiceIndex];
  const typed = String(new FormData(form).get('answer') || '');
  if (!typed.trim()) { showNotice('Type a word before checking your answer.', 'error'); return; }
  const correct = answerMatches(typed, item.word);
  const review: Review = { id: crypto.randomUUID(), itemId: item.id, answer: item.word, typed: typed.normalize('NFC').trim(), correct, reviewedAt: Date.now() };
  await Promise.all([store.addReview(review), store.putItem(schedule(item, correct))]);
  reviews.push(review);
  feedback = { correct, typed: typed.trim(), answer: item.word };
  render();
  requestAnimationFrame(() => document.querySelector<HTMLElement>('[data-action="next-review"]')?.focus());
}

async function onImport(event: Event): Promise<void> {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text()) as { items?: Array<{ id?: string }> };
    if (!isPro() && route !== 'demo' && Array.isArray(parsed.items)) {
      const currentIds = new Set(items.map((item) => item.id));
      const newIds = parsed.items.filter((item) => typeof item.id === 'string' && !currentIds.has(item.id));
      if (items.length + newIds.length > 50) throw new Error(`This import would pass the 50-word free limit. Add a license, then import again.`);
    }
    const count = await store.importData(parsed);
    await refresh(`Imported ${count} ${count === 1 ? 'word' : 'words'}.`, 'success');
  } catch (error) {
    const message = error instanceof SyntaxError
      ? 'This file is not valid JSON. Choose a Context Cloze JSON export.'
      : error instanceof Error ? error.message : 'The import failed. Choose a valid JSON export.';
    showNotice(message, 'error');
  }
}

async function onLicense(event: Event): Promise<void> {
  event.preventDefault();
  const token = String(new FormData(event.currentTarget as HTMLFormElement).get('license') || '').trim();
  if (!token) return;
  saveLicense(token);
  showNotice('Checking your license…');
  const result = await verifyLicense(true);
  showNotice(result?.valid ? 'Personal license active.' : 'This license is not active. Check the token and try again.', result?.valid ? 'success' : 'error');
}

async function onAction(event: Event): Promise<void> {
  const target = event.currentTarget as HTMLElement;
  switch (target.dataset.action) {
    case 'start-due': practice = items.filter((item) => item.dueAt <= Date.now()).sort((a, b) => a.dueAt - b.dueAt); practiceIndex = 0; feedback = null; render(); break;
    case 'start-all': practice = [...items].sort(() => Math.random() - 0.5); practiceIndex = 0; feedback = null; render(); break;
    case 'next-review': practiceIndex += 1; feedback = null; await reloadQuietly(); break;
    case 'close-session': practice = []; practiceIndex = 0; feedback = null; await reloadQuietly(); break;
    case 'export': await exportJson(); break;
    case 'reset-demo': await store.seedDemo(true); practice = []; await refresh('Demo reset to its original sample.', 'success'); break;
    case 'leave-demo': await Promise.all([store.clearItems(), store.clearReviews()]); await navigate('/'); break;
    case 'delete-item': await deleteItem(target); break;
    case 'remove-license': clearLicense(); showNotice('License removed from this device.'); break;
  }
}

async function deleteItem(target: HTMLElement): Promise<void> {
  const id = target.closest<HTMLElement>('[data-item-id]')?.dataset.itemId;
  const item = items.find((candidate) => candidate.id === id);
  if (!item || !confirm(`Delete “${item.word}” and remove it from future practice?`)) return;
  await store.deleteItem(item.id);
  await refresh(`Deleted “${item.word}”.`);
}

async function exportJson(): Promise<void> {
  const data = await store.exportData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `context-cloze-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showNotice(`Exported ${data.items.length} ${data.items.length === 1 ? 'word' : 'words'}.`, 'success');
}

async function reloadQuietly(): Promise<void> {
  [items, reviews] = await Promise.all([store.getItems(), store.getReviews()]);
  render();
}

async function refresh(message: string, kind: 'info' | 'error' | 'success' = 'info'): Promise<void> {
  [items, reviews] = await Promise.all([store.getItems(), store.getReviews()]);
  showNotice(message, kind);
}

window.addEventListener('popstate', () => void navigate(location.pathname + location.search + location.hash, false));
window.addEventListener('online', () => showNotice('Connection restored.', 'success'));
window.addEventListener('offline', () => showNotice('You are offline. Saved practice still works.'));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').then((registration) => {
    registration.addEventListener('updatefound', () => {
      if (registration.active) showNotice('An update is ready. Reload when you finish this session.');
    });
  }).catch(() => showNotice('Offline setup failed. Reload once while connected.', 'error')));
}

render();
if (route === 'home' || route === 'demo') void loadData();
if (route === 'home' && cachedLicense()?.token) void verifyLicense().then(() => { if (document.visibilityState === 'visible') render(); });
