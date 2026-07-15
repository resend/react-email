---
"react-email": patch
---

`<Body>` now inherits `lang` and `dir` from `<Html>` instead of always defaulting to `lang="en" dir="ltr"`. Explicit values on `<Body>` still take precedence.
