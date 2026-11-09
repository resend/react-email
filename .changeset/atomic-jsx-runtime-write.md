---
"@react-email/ui": patch
---

Fix `email build` failing at random with `(void 0) is not a function` when Next.js prerenders pages in several workers. Each worker now writes the JSX runtime to a temporary file and renames it into place, so no worker reads a half-written runtime.
