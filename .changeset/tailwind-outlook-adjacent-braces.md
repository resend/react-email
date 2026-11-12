---
'react-email': patch
---

Fix `<Tailwind>` responsive and `dark:` rules after the first being dropped by Outlook.com, by never writing adjacent closing braces in the generated `<style>`
