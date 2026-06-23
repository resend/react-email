---
"react-email": patch
---

Fix `group`/`peer` marker classes injecting a duplicate, malformed parentless `&:is(...)` rule into the `<head>` `<style>` when used with `group-*`/`peer-*` variants. The nested rule is no longer extracted as a standalone utility.
