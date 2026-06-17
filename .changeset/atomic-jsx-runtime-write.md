---
"@react-email/ui": patch
---

Fix flaky `email build` crash on multi-core builds (e.g. Vercel) where static prerendering failed with `(void 0) is not a function` on a random template. `createJsxRuntime` wrote the shared `jsx-dev-runtime.js` in place; under `next build`'s multi-process static generation, one process could read a half-written runtime produced by another (its `jsxDEV` export `undefined`). The runtime is now written to a unique temp file and atomically renamed into place, complementing the existing in-process build cache.
