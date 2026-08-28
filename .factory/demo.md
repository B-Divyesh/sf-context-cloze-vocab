# Demo sandbox

- URL: `https://context-cloze-vocab.sociobot.in/?demo=1` (local: `http://localhost:5173/?demo=1`). It opens directly on a seeded missing-word question and answer field. `/demo` is an equivalent canonical route.
- Sample: eight learner-owned-style word entries, five due words, and five
  past incorrect answers that form four confusion pairs.
- Storage: sample and real word lists use separate browser databases. Demo mode
  never opens the real word list.
- Reset: choose **Reset demo** in the persistent demo banner.
- Exit: choose **Start for real**. This clears the demo stores before opening the
  real workspace.
- Offline: visit the demo once, wait for the service worker, then disconnect and
  reload `/demo`.
