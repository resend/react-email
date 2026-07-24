---
"react-email": patch
---

Make `<Body>` inherit `lang` and `dir` from `<Html>` instead of always defaulting to `lang="en" dir="ltr"`, so non-English emails no longer end up with contradictory language metadata
