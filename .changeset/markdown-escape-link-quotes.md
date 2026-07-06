---
"react-email": patch
---

Escape double quotes in `Markdown` link `href`/`title` and image `title` attributes, matching the escaping already applied to image `src`/`alt`. A markdown title like `'The "Complete" Guide'` no longer breaks out of the attribute in the rendered HTML.
