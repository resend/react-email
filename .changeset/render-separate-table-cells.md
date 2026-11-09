---
"@react-email/render": minor
---

Put each table cell on its own line in plain text output. Cells used to run together with no separator, so side-by-side content from `Row`/`Column` became one word or one long URL (`LeftRight`, `https://a.example/xhttps://b.example/y`). This applies to `toPlainText` (and `render(..., { plainText: true })`) and to `unstableToPlainText`.

To keep the previous output with `toPlainText`, pass `htmlToTextOptions: { selectors: [{ selector: 'td', format: 'inline' }, { selector: 'th', format: 'inline' }] }`.
