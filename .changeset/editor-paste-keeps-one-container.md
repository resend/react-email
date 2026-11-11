---
"@react-email/editor": patch
---

Pasting no longer puts a second container or a second theme node inside the body: the `container` div and `globalContent` parse rules match only directly under the doc, and the container is no longer `defining`. A custom paste handler that parses clipboard HTML with `generateJSON` should pass the paste position as `context`.
