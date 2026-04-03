---
"@react-email/render": patch
---

fix: decode HTML entities in href attributes and style tags

React's SSR escapes special characters to HTML entities which breaks:
- URLs with query parameters (`&` → `&amp;`) causing issues with email click tracking services
- CSS media queries in style tags (`>` → `&gt;`) breaking Tailwind responsive utilities

This fix adds post-processing to decode entities in:
- `href` attribute values (`&amp;` → `&`)
- `<style>` tag contents (`&gt;`, `&lt;`, `&amp;`)

Fixes #1767
Fixes #2841
