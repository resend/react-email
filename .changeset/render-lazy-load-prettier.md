---
"@react-email/render": patch
---

`render` now only loads `prettier` when `pretty: true` is used, so rendering without it no longer fails with "Failed to load external module prettier" in Next.js dev with Turbopack on Bun
