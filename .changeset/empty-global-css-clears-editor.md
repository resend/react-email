---
"@react-email/editor": patch
---

Clear the injected global CSS `<style>` element when the user empties global CSS in the editor. Previously, deleting all global CSS at once left the previously injected rules in the DOM, so the email editor preview kept showing stale styles.
