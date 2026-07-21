---
"react-email": patch
---

Fix `<Tailwind>` dropping `dark:` and other media-query variants with `tailwindcss@4.3.3`+, where the conditional value was inlined as the base style and the `@media` rule never reached the `<head>`
