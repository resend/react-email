---
'@react-email/render': patch
---

Make `render` smaller for edge runtimes such as Cloudflare Workers. It uses React's `prerender` when it can, and it loads the `unstableTextConversion` code only when you use it.
