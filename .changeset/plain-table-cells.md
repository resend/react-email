---
"@react-email/render": patch
---

Put each table cell on its own line in plain text output. Adjacent `td`/`th` cells used to run together, so a layout table holding two links (a `Row` with two `Column`s) came out as one glued line.
