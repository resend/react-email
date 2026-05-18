---
"react-email": patch
---

Avoid OOM when running `email export` on projects with many templates. esbuild builds now run in batches of 10 entry points, and the render phase runs each batch of 25 templates inside a `worker_threads` worker so V8 isolate memory is reclaimed between batches.
