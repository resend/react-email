---
'@react-email/ui': patch
---

Bump `next` to 16.4.1 so the prebuilt preview server works in projects on Next.js 16.4. Next 16.4 loads a `server/preview-props.json` manifest that a 16.3 build doesn't emit, so `email dev` failed with `ENOENT` when `next` was deduped to 16.4.
