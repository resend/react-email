---
"@react-email/ui": patch
---

Fix out-of-memory crashes when saving a shared component during `email dev`. Hot reload now re-renders only the preview you have open and invalidates the cache for the other affected templates, instead of eagerly re-rendering every dependent template on each save.
