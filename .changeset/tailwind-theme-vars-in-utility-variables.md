---
"react-email": patch
---

`<Tailwind>` now resolves theme values that utilities pass through their own variables, so gradients (`from-red-500`), shadow and ring colors (`shadow-red-500`, `ring-blue-500`), `blur-*`, `drop-shadow-*` and `translate-*` no longer inline an unresolvable `var(--color-…)` or `var(--spacing)`.
