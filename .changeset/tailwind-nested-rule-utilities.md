---
"react-email": patch
---

Stop silently dropping Tailwind utilities that compile to a nested rule (`space-y-*`, `space-x-*`, `divide-y`, `divide-x`, `divide-<color>`). They were classified as inlinable, produced an empty inline style, and vanished from the output along with their class name; they are now emitted in the `<head>` `<style>` block and the class is kept.
