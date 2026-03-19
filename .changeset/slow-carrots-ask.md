---
"@react-email/render": patch
---

fix: await stream.allReady before reading renderToReadableStream output

When using the edge/Bun render path, Suspense boundaries were not fully resolved before the HTML stream was read. This produced streaming HTML markers (`<!--$?-->`, `$RC` hydration scripts) instead of resolved HTML, causing blank emails in clients that don't execute JavaScript.
