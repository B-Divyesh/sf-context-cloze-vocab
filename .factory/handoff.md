# Context Cloze v1 handoff

## What was built

- A Vite and TypeScript offline PWA for learner-owned contextual vocabulary.
- Single and bulk word entry with exact-sentence validation, editing, deletion,
  Unicode normalisation, and right-to-left input support.
- Typed cloze sessions for due words or the full list. Correct answers move
  forward; missed answers return after 10 minutes.
- Review history and confusion-pair counts from wrong guesses.
- Versioned JSON import/export covering words, schedules, and answer history.
- IndexedDB storage with completely separate real and demo databases.
- A one-click `/demo` with eight words, due material, and confusion history.
- A $12 one-time Sociobot license path: hosted checkout, return-token capture,
  daily cached verification, offline optimistic state, paste-to-restore, and
  revocation handling. The free tier holds 50 words.
- Install manifest, 192/512/maskable icons, versioned service worker cache,
  offline fallback, and an update notice.
- Real SPA routes for `/`, `/demo`, `/privacy`, `/terms`, `/offline`, and the
  designed 404 state. History, heading focus, canonical metadata, sitemap,
  robots, CSP, and deploy fallback are included.
- Original cinematic environmental art, responsive WebP derivatives, social
  image, and documented provenance.

## How to run and verify

```sh
npm install
npm test
npm run build
npm run preview
```

The exact deploy build command is `npm run build`. Output lands in `dist/`, and
`dist/index.html` is at its root.

Verification on 2026-08-28:

- `npm test`: 4 unit tests and 15 Playwright tests passed.
- Every `.factory/claims.json` command uses the isolated demo and passes.
- Axe: no serious or critical findings on home, demo, privacy, terms, or 404.
- 390×844 browser check: no horizontal overflow; primary practice control is visible.
- Offline: `/demo` reloaded with eight sample words after network disable.
- `verify-url.sh`: 200 response, no console errors, one h1, main present, lang
  present, and no image missing alt text.
- Lighthouse 12.8.2 mobile: Performance 99, Accessibility 100, Best Practices
  100, SEO 100. FCP 0.97 s, LCP 1.28 s, CLS 0, TBT 98 ms.
- Production payload: JS 30.99 KB raw / 10.86 KB gzip; CSS 15.43 KB raw /
  4.40 KB gzip; hero WebP 40 KB desktop / 16 KB mobile.
- `npm audit`: zero known vulnerabilities.

Machine-readable measurements are in `.factory/verification.json`. The copy
review is in `.factory/copy-audit.md`.

## Known gaps and release notes

- The factory must register `context-cloze-vocab` with the Sociobot billing API
  before the live checkout can sell licenses. No product ID or secret is stored
  in this repository.
- Vocabulary does not sync between devices. JSON export/import is the explicit
  ownership and transfer path for v1.
- Browser storage can be cleared by the browser or user. The product explains
  this and provides export; it cannot create automatic cloud backups.
- The app intentionally includes no dictionary or generated sentence source.
  Learners must supply text they may store.

## Next steps

Register the billing product, deploy `dist/`, run the claim suite against the
production URL, and smoke-test a real purchase return before announcing sales.
