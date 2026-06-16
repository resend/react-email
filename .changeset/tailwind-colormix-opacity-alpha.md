---
"react-email": patch
---

Fix the Tailwind opacity modifier (e.g. `bg-blue-600/50`, `text-black/25`) producing an invalid percentage alpha. Tailwind v4 emits these as `color-mix(in oklab, <color> 50%, transparent)`, and that `50%` was being copied straight into the comma-based `rgb()` we downlevel to, giving `rgb(21,93,252,50%)`. A percentage alpha is invalid in the legacy `rgb()` syntax and is dropped or ignored by several email clients, so the opacity now normalizes to a unitless decimal (`rgb(21,93,252,0.5)`), matching how the existing `rgb()` handling already converts percentage alphas.
