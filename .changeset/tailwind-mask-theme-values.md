---
"react-email": patch
---

`<Tailwind>` now resolves theme values in mask utilities, so `mask-b-from-6` and `mask-t-from-red-600` no longer inline an unresolvable `var(--spacing)` or `var(--color-…)`.
