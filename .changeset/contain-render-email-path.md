---
"@react-email/ui": patch
---

reject paths that resolve outside the configured emails directory in `renderEmailByPath` and `getEmailPathFromSlug` to close a path-traversal vector in the preview server
