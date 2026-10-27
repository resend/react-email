---
"react-email": patch
---

Remove the `normalize-path` dependency. `email export` now finds built templates when `--outDir` contains glob characters such as `[1]`, `{a,b}` or `*`. Previously, such an `--outDir` rendered nothing or picked up templates from sibling directories.
