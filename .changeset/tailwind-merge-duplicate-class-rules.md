---
"react-email": patch
---

Merge declarations when the same class is defined by multiple Tailwind rules (e.g. a preset and a child config override) instead of keeping only the last rule, so the CSS cascade is preserved when inlining.
