---
"@react-email/editor": patch
---

scrub `javascript:`, `vbscript:`, and non-image `data:` URLs from pasted HTML and drop `script`, `iframe`, `object`, `embed`, `meta`, and `base` elements. This pass now runs on every paste; previously, content carrying the editor's `node-*` class marker took a fast-path that skipped sanitization entirely and could be spoofed by hosting attacker HTML with the same class name. Legitimate intra-editor copy/paste still round-trips `class`, `style`, and `data-*` attributes as before.
