---
"react-email": patch
---

Fix `email build` setting `outputFileTracingRoot` to the `.react-email` subfolder instead of the user's project root. Pointing the tracing root at a subfolder broke `vercel build` with `ENOENT` on traced server-function paths (e.g. `jsx-runtime/jsx-dev-runtime.js`), since `@vercel/next` resolves traces from the project root. The generated `next.config.mjs` now uses `userProjectLocation` for `outputFileTracingRoot` and `turbopack.root`, mirroring the monorepo layout that already deploys.
