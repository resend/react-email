---
"@react-email/editor": patch
---

Pasting a whole-document copy into the body no longer nests a container and a theme node per paste. The `container` div and `globalContent` parse rules now only match directly under the doc, so inside the body a pasted container is unwrapped and a pasted theme is dropped.
