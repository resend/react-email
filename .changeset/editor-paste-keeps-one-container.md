---
"@react-email/editor": patch
---

Pasting no longer puts a second container or a second theme node inside the body. The `container` div and `globalContent` parse rules now match only directly under the doc, so a whole-document copy pasted into the body arrives as its blocks. The one exception is the open container wrapper of a selection copied inside the body, which ProseMirror merges into the container under the cursor. The container is no longer `defining`, so ProseMirror does not keep it around pasted content. `createPasteHandler` parses clipboard HTML where the paste lands; a custom paste handler that parses clipboard HTML with `generateJSON` should pass the paste position as `context` as well.
