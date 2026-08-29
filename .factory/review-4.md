# Adversarial first-read review 4 — Context Cloze

**Verdict: FAIL.** Reviewed 2026-08-29 against the live site and clean clone `4641519f0d7869e005cf4a5a89229efa9e3dbdb7`. One blocking claim-proof gap and four minor findings remain. PASS requires zero findings.

## Cold first read

Fresh no-storage contexts at 390 × 844 and 1440 × 900 answered all three questions before scrolling. The primary action ended at y=513 on phone and y=723 on desktop; neither run had console errors.

- What it does: lets independent language learners type missing words in their own sentences.
- For whom: learners who recognise words but cannot retrieve them while writing or speaking.
- First click: **Try it with sample data**.

The exact copy was **“Recall words inside sentences”**, **“For independent learners who recognise words but cannot retrieve them while writing or speaking.”**, and **“Try it with sample data”**. **“Opens eight sample words. Your word list stays untouched.”** makes the result clear. This gate passes.

## Findings

### Blocking

#### F-4-1 — The checkout claim test does not prove that checkout opens

- **Location/quote:** `claims.json` `checkout-link`: **“The purchase link opens Sociobot's secure checkout.”** Landing: **“Buy for $12 once — opens secure checkout.”**
- **Evidence:** `npm test -- --grep @claim:checkout-link` passes after checking only the anchor `href` is the Sociobot API endpoint. It neither follows that URL nor asserts a checkout response. `npm run test:live` separately sees a Dodo 303, but is not the tagged claim test.
- **Why blocking:** an endpoint that returns an error or a non-checkout redirect would keep the claim test green while breaking the promised outcome.
- **Fix:** make the tagged test follow/request the exact endpoint and assert a 303 `Location` at HTTPS `checkout.dodopayments.com/session/`; retain the visible-link assertion and update the claim sandbox description.

### Minor

#### F-4-2 — Tab-separated bulk entry is an unlisted functional claim

- **Location/quote:** landing help: **“A tab works instead of the | mark.”**
- **Evidence:** no claim/test pastes a tab-delimited row through bulk entry; `backup-roundtrip` imports a backup file instead.
- **Fix:** add `tab-bulk-entry` with an observable paste/save test, or remove this promise.

#### F-4-3 — The due-session exclusion promise is unlisted

- **Location/quote:** populated practice desk: **“A short session uses only the words due today.”**
- **Evidence:** `due-queue` proves one due word yields a question, not that a future word is excluded from a short session.
- **Fix:** add `due-session-only`, using one due and one future fixture and asserting prompt/count exclusion, or narrow the copy.

#### F-4-4 — The free three-pair limit is an unlisted quantitative claim

- **Location/quote:** **“The free view shows three pairs.”**
- **Evidence:** `paid-license` proves a licensed four-pair fixture is visible; neither it nor `free-limit` asserts an unlicensed workspace displays exactly three pairs.
- **Fix:** add an exact unlicensed four-pair/three-visible-pairs assertion, or remove this sentence.

#### F-4-5 — Two headings are unclear or metaphorical out of context

- **Location/quote:** landing step **“Type what belongs”**; live/static 404 h1 **“This sentence has no ending”**.
- **Why:** the first omits the missing-word task. The second is a metaphor rather than a page-not-found heading; its useful explanation appears later.
- **Fix:** use **“Type the missing word”** and **“Page not found”** in both SPA and `public/404.html`, then update the 404 regression assertion.

## Copy audit

Counts treat hyphenated terms, prices, URLs, product names, and JSON as one word. This lists sentence-like headings, visible state copy, and alt text; it excludes one-word navigation labels and user-entered examples. No item exceeds 22 words. Buttons name results. F-4-2–F-4-5 are the only copy flags.

### Landing page

| Copy | Words | Check |
| --- | ---: | --- |
| Your words · your sentences; Recall words inside sentences | 4; 4 | descriptor; h1 |
| For independent learners who recognise words but cannot retrieve them while writing or speaking. | 14 | audience |
| Try it with sample data; Add your words | 5; 3 | actions |
| Opens eight sample words. Your word list stays untouched. | 4; 5 | demo claims |
| Stored on this device; Works offline after your first visit; Free for 50 words | 4; 6; 4 | listed claims |
| A blank notebook waits under a lamp beside a rainy night window. | 12 | alt |
| Add a word and a sentence. Context Cloze hides the word. | 6; 5 | instruction; typed cloze |
| Local practice; Your practice desk; Opening your word list… | 2; 3; 4 | workspace/loading |
| Your first blank will appear here | 6 | empty heading |
| Add a word and a sentence that uses it. You can then start a typed review. Saved words will appear here. | 9; 7; 5 | state copy |
| A tab works instead of the | mark. | 8 | F-4-2 |
| Backups include your sentences, schedule, and answer history. Backup files use JSON format. | 8; 5 | backup; format note |
| Practice steps; How sentence practice works; Add words in context | 2; 4; 4 | headings |
| Paste a word and a sentence you trust. Each saved word becomes a blank. | 8; 7 | instruction; typed cloze |
| Type what belongs | 3 | F-4-5 |
| Due words return as questions. Capitalisation does not affect marking. | 5; 5 | listed claims |
| Review words you confuse. Wrong guesses become confusion pairs. Review the words you confused. | 4; 5; 6 | headings/claim |
| Your content and storage; You choose every sentence | 4; 4 | headings |
| Only add text you may store. Your word list remains in this browser unless you download a backup. | 6; 12 | scope/local claim |
| Optional one-time license; Remove the 50-word limit | 3; 4 | headings |
| Pay $12 once for unlimited words and the full confusion-pair history. The free list holds 50 words. | 11; 6 | listed claims |
| Buy for $12 once — opens secure checkout | 7 | F-4-1 |
| For license or refund questions, email support@sociobot.in. Read the license terms. | 7; 4 | contact/action |
| Type the missing word | 4 | practice heading |
| A short session uses only the words due today. | 9 | F-4-3 |
| You can practise every word or add another sentence. Your next due dates are saved on this device. | 9; 9 | full session/scheduling+storage |
| Wrong answers; Confusion pairs | 2; 2 | headings |
| These pairs come from your incorrect answers. Wrong guesses will appear here beside the intended word. | 7; 9 | confusion claim |
| The free view shows three pairs. | 6 | F-4-4 |
| The one-time license shows the full list. | 8 | paid license |
| Type the missing word in sentences you chose. Version 1.0.0 | 8; 2 | footer/build |

### README

| Sentence | Words | Check |
| --- | ---: | --- |
| Practise your word list with typed sentence blanks. | 8 | summary |
| Context Cloze is for independent language learners who recognise a word but cannot retrieve it while writing or speaking. | 19 | audience |
| Add a word and its sentence, then type the missing word when it is due. Wrong guesses become confusion pairs. | 15; 5 | listed claims |
| Turns each saved word into a blank that you answer by typing. | 12 | typed cloze |
| Keeps your word list in this browser during practice. | 9 | local storage |
| Accepts right-to-left words and accented answers typed in either common form. | 11 | Unicode claims |
| Updates each word’s next due date after an answer. Counts repeated wrong guesses beside the intended word. | 9; 8 | listed claims |
| Downloads and restores backups with word, schedule, and answer history. Works offline after the first visit. | 10; 6 | listed claims |
| Keeps the sample word list separate and never reads or changes your real word list. | 13 | demo isolation |
| The free list holds 50 words. | 6 | free limit |
| A $12 one-time personal license removes that limit and shows the full confusion history. | 14 | paid license |
| The purchase link opens Sociobot’s secure checkout. | 7 | F-4-1 |
| A license token stays in browser storage and is sent only to Sociobot to check the license. | 17 | listed claim |
| Requires Node.js 20 or newer. Open http://localhost:5173. | 6; 1 | run instructions |
| Use http://localhost:5173/?demo=1 for the isolated sample word list. | 4 | run instruction |
| npm test runs model tests, claim tests, accessibility checks, and the 390 px layout check in Chromium. | 17 | run instruction |
| npm run build writes the static deploy to dist/, with dist/index.html at its root. Inspect it with npm run preview. | 16; 6 | build instruction |
| After deployment, run npm run test:live for routing and billing checks. | 10 | verification instruction |
| Run npm run test:live:browser for the cold demo, offline, Axe, focus, privacy, mobile, and storage-isolation checks. | 17 | verification instruction |
| Publish the contents of dist/ as a static site. | 9 | deploy instruction |
| Keep staticwebapp.config.json at the site root so real routes, headers, caching, and the designed 404 response remain active. | 19 | deploy instruction |
| The Param Factory manages the production deployment and DNS. | 8 | scope |
| This app includes no advertising, behavioural analytics, third-party fonts, or third-party scripts. | 12 | tracking claim |
| Use your browser’s site-data controls to remove stored app data. | 10 | deletion claim |
| Read the in-app /privacy and /terms pages for the full policy. | 10 | link instruction |
| Real and sample word lists use separate IndexedDB databases. Backups use JSON format. | 9; 4 | developer notes |
| MIT licensed. | 2 | license |

## Demo, claims, history, and structure

One click opens `/?demo=1` with a sample missing-word sentence, answer input, and Check answer in the first phone viewport (lowest control y=564). The persistent banner, Reset demo, and Start for real are present. Live testing created real `keepsake` and demo-only `temporary`: no demo DOM mutation exposed the real word, reset removed temporary, exit restored the real list, and the demo database ended empty.

In `/tmp/context-cloze-review4.Hhc2xq/repo`, `npm ci`, each of the 19 exact claim commands, `npm test` (9 Vitest/35 Chromium), and `npm run build` passed; `dist/` was produced. Live request logging on home/demo/privacy/terms found no cross-origin normal app/resource requests. Direct demo offline reload passed.

The live browser route/Axe check found 200s for home/demo/privacy/terms/offline, a designed unknown-route 404, one h1/main per page, correct metadata, no serious/critical Axe issue, route focus/Back scroll restoration, and no console errors. The link crawl found valid internal links, explicit mail links, and the checkout endpoint’s 303; this does not close F-4-1 because it is outside its tagged test.

I checked every earlier review/polish/handoff finding. F-1-1–F-1-20, F-2-1, and F-3-1–F-3-7 remain fixed in live code: immediate isolated demo, focus and contrast, storage deletion, metadata/routing, prior claim tests, plain backup copy, and removal of earlier slogans/provenance/billing wording. The site has a distinct night-archive visual identity rather than a generic template. The brief does not imply an AI feature; offline practice plus backup import/export covers the obvious leverage, and no provider key was found.

## What would make this perfect

Put checkout redirect evidence in its tagged claim test; list/test or remove the three unlisted functional/limit statements; and replace the two headings. Then repeat the clean-clone claim inventory and cold review.
