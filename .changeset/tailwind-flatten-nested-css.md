---
'react-email': patch
---

`<Tailwind>` no longer leaves nested CSS in the `<style>` it generates. Variants like `hover:`, `focus:`, `first:` and stacked ones like `sm:dark:` produced rules nested inside other rules, and Gmail drops the whole `<style>` when it sees that, so every non-inline style in the email was lost there. Nested rules are now flattened, and stacked media queries are combined with `and` when that keeps their meaning (`@media (min-width:40rem) and (prefers-color-scheme:dark)`).
