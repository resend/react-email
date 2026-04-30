---
"@react-email/editor": patch
---

Drive editor node defaults from the email theming reset. Headings, paragraphs, lists, blockquotes, buttons, code, and `<hr>` styling have moved out of `themes/default.css` into the basic and minimal reset themes so the live editor, exported email, and theme panel inputs share a single source of truth. List nodes now render with `node-list`, `node-listItem`, and dedicated `bulletList` / `orderedList` reset entries, so disc and decimal markers come from the theme rather than user-agent defaults.
