# Context Cloze

Practise your word list with typed sentence blanks.

Context Cloze is for independent language learners who recognise a word but
cannot retrieve it while writing or speaking. Add a word and its sentence, then
type the missing word when it is due. Wrong guesses become confusion pairs.

Live site: <https://context-cloze-vocab.sociobot.in>

One-click sample: <https://context-cloze-vocab.sociobot.in/?demo=1>

## What it does

- Turns each saved word into a blank that you answer by typing.
- Keeps your word list in this browser during practice.
- Accepts right-to-left words and accented answers typed in either common form.
- Updates each word’s next due date after an answer.
- Counts repeated wrong guesses beside the intended word.
- Downloads and restores backups with word, schedule, and answer history.
- Works offline after the first visit.
- Keeps the sample word list separate and never reads or changes your real word list.

The free list holds 50 words. A $12 one-time personal license removes that
limit and shows the full confusion history. The purchase link opens Sociobot’s
secure checkout. A license token stays in browser storage and is sent only to
Sociobot to check the license.

## Run locally

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

Open <http://localhost:5173>. Use <http://localhost:5173/?demo=1> for the
isolated sample word list.

## Test and build

```sh
npm test
npm run build
```

`npm test` runs model tests, claim tests, accessibility checks, and the 390 px
layout check in Chromium. `npm run build` writes the static deploy to `dist/`,
with `dist/index.html` at its root. Inspect it with `npm run preview`.

After deployment, run `npm run test:live` for routing and billing checks. Run
`npm run test:live:browser` for the cold demo, offline, Axe, focus, privacy,
mobile, and storage-isolation checks.

## Deploy

Publish the contents of `dist/` as a static site. Keep
`staticwebapp.config.json` at the site root so real routes, headers, caching,
and the designed 404 response remain active. The Param Factory manages the
production deployment and DNS.

## Data and privacy

This app includes no advertising, behavioural analytics, third-party fonts, or
third-party scripts. Use your browser’s site-data controls to remove stored app
data. Read the in-app [/privacy](/privacy) and [/terms](/terms) pages for the
full policy.

## Developer notes

Real and sample word lists use separate IndexedDB databases. Backups use JSON
format.

- Product brief: [`.factory/brief.json`](.factory/brief.json)
- Visual system and asset provenance: [`.factory/design.md`](.factory/design.md)
- Testable claims: [`.factory/claims.json`](.factory/claims.json)
- Demo contract: [`.factory/demo.md`](.factory/demo.md)
- Build handoff: [`.factory/handoff.md`](.factory/handoff.md)

MIT licensed.
