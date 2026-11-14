---
'react-email': patch
---

Preserve template directories during export so separate build batches cannot overwrite emails with the same filename. Exports containing only one nested directory now retain that directory in the output. Directories ending in `.cjs` also keep their names and export correctly.
