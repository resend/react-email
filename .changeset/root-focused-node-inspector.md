---
"@react-email/editor": patch
---

Inspector breadcrumb segments now always carry a `FocusedNode` — the `body` node is the root segment. `InspectorBreadcrumbSegment.node` is no longer nullable. Exports `getNodeMeta` so custom breadcrumb renderers can reuse the default nodeType → label/icon mapping.
