---
"react-email": patch
---

Fix `email build` computing the wrong output file tracing root in nested-workspace monorepos (e.g. a package one or more directories below the true repo root), which caused Vercel deploys to fail with an ENOENT error on the routes manifest.
