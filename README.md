# Context Cloze

Practice your own words by typing them into sentences.

Context Cloze is for independent language learners who recognise a word but
struggle to retrieve it while writing or speaking. Add a word with a sentence,
then answer scheduled cloze prompts. Incorrect guesses become confusion pairs.

Live site: <https://context-cloze-vocab.sociobot.in>

One-click demo: <https://context-cloze-vocab.sociobot.in/demo>

## What it does

- Saves words, sentences, due dates, and answers in IndexedDB.
- Matches typed answers with Unicode normalisation and case folding.
- Updates each word's due date after an answer.
- Shows repeated wrong guesses beside the intended words.
- Imports and exports a versioned JSON file with practice history.
- Reloads offline after the service worker finishes the first visit.
- Keeps demo data in a separate `context-cloze-demo` database.

The free tier holds 50 words. A $12 one-time personal license removes that
limit and shows the full confusion history. Checkout and license verification
use the Sociobot billing API. Practice and exports do not need a license.

## Run locally

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

Open <http://localhost:5173>. Use <http://localhost:5173/demo> for the isolated
sample workspace.

## Test and build

```sh
npm test
npm run build
```

`npm test` runs model tests, every claim test, accessibility checks, and the
390 px layout check in Chromium. The reproducible production command is
`npm run build`. It writes the static deploy to `dist/`, with `dist/index.html`
at its root.

To inspect the production build:

```sh
npm run preview
```

## Data and privacy

Real and demo vocabulary use separate IndexedDB databases. No analytics,
third-party font, or runtime script is included. A license token is kept in
localStorage and sent only to `api.sociobot.in` for verification. Read the
in-app `/privacy` and `/terms` pages for the full policy.

Keep regular JSON exports if the vocabulary matters to you. Clearing browser
site data also clears the local vocabulary.

## Project notes

- Product brief: [`.factory/brief.json`](.factory/brief.json)
- Visual system and asset provenance: [`.factory/design.md`](.factory/design.md)
- Testable claims: [`.factory/claims.json`](.factory/claims.json)
- Demo contract: [`.factory/demo.md`](.factory/demo.md)
- Build handoff: [`.factory/handoff.md`](.factory/handoff.md)

MIT licensed. The generated environmental artwork is original to this product.
