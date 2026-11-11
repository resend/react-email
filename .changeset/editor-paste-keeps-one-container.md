---
"@react-email/editor": patch
---

Pasting no longer puts a second container or a second theme node inside the body. The `container` div and `globalContent` parse rules now match only when a whole document is parsed, as for the initial content and `setContent`, so a whole-document copy pasted into the body arrives as its blocks. The one exception is the open container wrapper of a selection copied inside the body, which ProseMirror merges into the container under the cursor. The container is no longer `defining`, so ProseMirror does not keep it around content pasted or dropped at the start of a line. `createPasteHandler` parses clipboard HTML where the paste lands; a custom paste handler that parses clipboard HTML with `generateJSON` should pass the paste position as `context` and remove the `data-pm-slice` attribute from the HTML first.
