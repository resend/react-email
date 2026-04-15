---
"@react-email/editor": patch
---

Inspector breadcrumb segments now always carry a `FocusedNode` — the `body` node is the root segment. `InspectorBreadcrumbSegment.node` is no longer nullable.
