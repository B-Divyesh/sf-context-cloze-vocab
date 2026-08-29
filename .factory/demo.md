# Demo sandbox

- URL: `https://context-cloze-vocab.sociobot.in/?demo=1` (local: `http://localhost:5173/?demo=1`). It opens directly on a seeded missing-word question and answer field. `/demo` is an equivalent canonical route.
- Sample: eight learner-owned-style word entries, five due words, and five
  past incorrect answers that form four confusion pairs.
- Word-list path: open **Paste a word list**, paste one word per line, and save.
  The first pending word is focused so each sentence can be added in order.
- Storage: sample and real word lists use separate browser databases. Demo mode
  never opens the real word list. Pasted words and their pending sentences use
  only `context-cloze-demo` while the demo banner is shown.
- Reset: choose **Reset demo** in the persistent demo banner. It restores the
  eight samples and opens the first missing-word question again.
- Exit: choose **Start for real**. Any route that leaves the demo clears its
  temporary words and answers before opening the next page.
- Offline: visit `/?demo=1` once, wait for the service worker, then disconnect
  and reload the same URL.
