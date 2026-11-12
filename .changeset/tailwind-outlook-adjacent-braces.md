---
'react-email': patch
---

`<Tailwind>` now writes `} }` instead of `}}` in the `<style>` it generates. Outlook.com drops everything in a `<style>` after a `}}`, so only the first responsive (`sm:`, `md:`, …) or `dark:` class in an email worked there.
