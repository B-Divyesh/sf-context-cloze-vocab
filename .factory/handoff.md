# Context Cloze — polish round 5 handoff

## Status

**PASS — all findings from review rounds 1–5 are closed.** The repaired PWA is
deployed at <https://context-cloze-vocab.sociobot.in>. Its night-archive visual
system, offline artifact class, local-first storage, and one-click isolated
demo are preserved.

## What changed

- Added a real **Paste a word list** path for one word per line.
- Stored pasted words immediately as pending local records, then focused an
  ordered sentence-entry step that advances after each save.
- Kept pending words out of due/full practice until their sentence contains the
  word, while keeping them visible, editable, deletable, and restorable from a
  backup.
- Proved the path through `/?demo=1` uses only `context-cloze-demo`; reset and
  exit still remove demo changes without reading or changing real records.
- Removed public **JSON format** jargon from the backup panel and retained the
  technical detail only in README developer notes.
- Added `word-list-paste` to `.factory/claims.json`, strengthened backup and
  full-session coverage for pending words, and extended live verification to
  exercise the round-5 workflow on production.
- Updated the verb-first 70-character catalog line, demo documentation, copy
  audit, cumulative polish record, and release evidence.

## Exact verification evidence

- Repair commit: `81594fd9b9a579fe143b410ea20a1e496b53b1ca`.
- Clean clone: `/tmp/context-cloze-polish5-claims.MqK0U3/repo`.
- `npm ci`: 61 packages, 0 vulnerabilities.
- Every one of the 23 exact claim commands from `.factory/claims.json`: PASS.
- Clean-clone `npm test`: 12 Vitest tests and 40 Chromium tests passed.
- Work-order build command `npm ci && npm test && npm run build`: PASS.
- `npm run build`: `dist/index.html`; JS 37.10 KB raw / 12.09 KB gzip; CSS
  16.32 KB raw / 4.57 KB gzip.
- Azure Static Web Apps deployment:
  `635145ec-46d1-4dc5-a57c-af7de116ba6a`; custom HTTPS origin returned 200.
- `npm run test:live`: home 200, unknown route 404, checkout 303 to
  `checkout.dodopayments.com`, invalid license rejected.
- `npm run test:live:browser`: all six routes had 0 serious/critical Axe
  findings; no console errors; no normal cross-origin requests; word-list paste
  created 11 demo records and advanced **zealous** to **resilient**; real
  `keepsake` remained unchanged; demo storage was empty after exit; offline,
  focus/history, storage clearing, 200% text, and reduced motion passed.
- `/opt/fleet/lib/verify-url.sh` passed the cold home and `/?demo=1` URLs with
  title, `lang`, one h1, main, image alt, and zero console/page errors.
- Link crawl: every internal route/fragment and required asset returned 200;
  the checkout returned 303; Param Factory returned 200; mail links were
  explicitly exempt.
- Live JavaScript equals the deployed local artifact at SHA-256
  `f2f1f3b90bce178f0edfec3aa60f79d62c035082383ea727d28031042545e639`.
- Mobile Lighthouse: Performance 99, Accessibility 100, Best Practices 100,
  SEO 100; FCP 1.0 s, LCP 1.1 s, TBT 90 ms, CLS 0.

Run locally with `npm install && npm run dev`. Run the complete local gate with
`npm test && npm run build`. Production checks are `npm run test:live` and
`LIVE_EVIDENCE_DIR=.factory/evidence npm run test:live:browser`.

## Evidence index

- Local 390 px: `.factory/evidence/polish-5-home-390.png`,
  `.factory/evidence/polish-5-demo-390.png`, and
  `.factory/evidence/polish-5-word-list-390.png`.
- Cold production: `.factory/evidence/polish-5-live-home-390.png`,
  `.factory/evidence/polish-5-live-demo-390.png`,
  `.factory/evidence/polish-5-live-word-list-390.png`,
  `.factory/evidence/polish-5-live-privacy.png`,
  `.factory/evidence/polish-5-live-terms.png`, and
  `.factory/evidence/polish-5-live-404.png`.
- Verifier reports and screenshots:
  `.factory/evidence/polish-5-verify-home/` and
  `.factory/evidence/polish-5-verify-demo/`.
- Lighthouse: `.factory/evidence/polish-5-lighthouse.json`.
- Finding-by-finding mapping: `.factory/polish-5.md`.

## Known gaps and next steps

None found. No TODOs, stubs, deferred minor findings, or deployment-class
changes remain.
