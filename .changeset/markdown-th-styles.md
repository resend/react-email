---
"react-email": patch
---

`<Markdown>` now applies `markdownCustomStyles.th` to table header cells. Header cells were previously styled with `td`, so any `th` styles were ignored.
