---
"react-email": patch
---

Fix Tailwind pill utilities like `rounded-t-full` and `rounded-e-full` leaving an unrenderable `calc(infinity * 1px)` in the inlined email CSS (previously only `rounded-full` was converted to `9999px`).
