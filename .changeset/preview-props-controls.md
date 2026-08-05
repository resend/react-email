---
"react-email": minor
---

Add a controls tab to the preview props panel. Templates can declare per-prop controls through a static `PreviewControls` property (text, bounded number, boolean, select, and raw JSON), mirroring how `PreviewProps` is declared; props without a declaration get a control inferred from their value. Edits merge into a single debounced props override, and the JSON editor remains available as an escape hatch.
