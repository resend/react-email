---
"@react-email/editor": patch
---

Fix the Strikethrough button in the typography inspector throwing "There is no mark type named 'line-through'". The `FORMAT_ITEMS` entry now uses the tiptap mark name `strike` instead of the CSS `text-decoration` value `line-through`.
