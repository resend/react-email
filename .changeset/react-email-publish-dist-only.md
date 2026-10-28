---
"react-email": patch
---

Only publish `dist/` in the `react-email` npm package. The tarball no longer ships `src/`, tests, `dev/`, and build configs, which also stops editors on TypeScript 6 from reading the published `tsconfig.json`.
