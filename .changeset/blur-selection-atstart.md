---
"@react-email/editor": patch
---

Fix invalid `TextSelection` on blur. Clearing the selection on blur used `TextSelection.create(doc, 0)`, which resolves to the doc node (no inline content) and made ProseMirror log "TextSelection endpoint not pointing into a node with inline content (doc)". It now uses `Selection.atStart(doc)`, which resolves to the first valid cursor position.
