---
"react-email": patch
---

Ship per-module build output with `sideEffects: false` so bundlers can tree-shake unused components. Importing a component no longer pulls prismjs, marked, and tailwindcss into the bundle unless `CodeBlock`, `Markdown`, or `Tailwind` is actually used.
