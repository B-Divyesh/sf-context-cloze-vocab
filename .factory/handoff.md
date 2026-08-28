# Context Cloze adversarial review 1 handoff

## Status

**FAIL — review completed 2026-08-28.** The detailed report is
`.factory/review-1.md`. Product code was not modified.

## What was done

- Recorded cold first views of the live site at 390 × 844 and 1440 × 900.
- Exercised the one-click demo, reset, exit, existing-real-data preservation,
  separate IndexedDB stores, same-origin network behaviour, and offline reload.
- Audited every landing/README sentence, headings, actions, terminology, and
  claim-like statement.
- Ran all 11 exact `.factory/claims.json` commands from a clean clone.
- Rechecked all earlier verification defects against both live behaviour and
  current source.
- Checked titles, descriptions, canonicals, social metadata, 404 response,
  header/footer, links, route focus/history, mobile targets, and visual identity.
- Ran the full suite, production build, live verifier, factory URL verifier,
  and Axe across every route.

## Verification commands

```sh
npm ci
npm test -- --grep @claim:<each-id>
npm test
npm run build
npm run test:live
VERIFY_NODE_MODULES=/work/repo/node_modules /opt/fleet/lib/verify-url.sh \
  https://context-cloze-vocab.sociobot.in /tmp/context-cloze-review1-evidence
```

All declared claims, the full 6-unit/20-browser suite, build, and live verifier
pass. `dist/` is produced at 10.97 KB gzip JavaScript and 4.41 KB gzip CSS.

## Findings left

The release remains blocked because `/demo` does not show an actual sample
exercise in the first post-click viewport. Major findings also cover invisible
Import JSON keyboard focus, `/offline` contrast, lost back-navigation scroll,
stale/incomplete route metadata, and unlisted claims. Minor copy and external
link issues are itemised as F-1-17 through F-1-20 in the review.

Earlier checkout, touch-target, real-404, malformed-import, claim-test depth,
and asset-caching defects remain fixed. No product source, tests, dependencies,
or deployment configuration were changed during this review.
