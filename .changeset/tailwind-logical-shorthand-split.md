---
"react-email": patch
---

Fix two-value logical shorthands whose values aren't all numeric (e.g. `margin-inline: 1rem auto`, `padding-inline: 10px calc(1rem + 2px)`) producing invalid duplicated longhands. They are now split into the correct per-side declarations.
