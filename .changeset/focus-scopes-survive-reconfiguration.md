---
"@react-email/editor": patch
---

Fix bubble menus and the Inspector losing the editor selection on click. The `FocusScopes` registry was wiped on every plugin reconfiguration; it now persists until the plugin is removed or the editor is destroyed.
