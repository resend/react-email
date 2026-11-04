---
"@react-email/editor": patch
---

Load the Prism grammars a code block language depends on, and resolve language aliases, before highlighting it. `shell` code blocks now highlight as Bash, and a `php` block no longer loads PHP without `markup-templating`, which made every later highlight on the page throw.
