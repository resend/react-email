---
'react-email': patch
---

The preview server no longer leaves a file handle open when a file under `static/` can't be read (for example a request for a directory on Linux or macOS, or a file locked by another program on Windows). On Node.js 25 and later, that leaked handle crashed `email dev` with `ERR_INVALID_STATE` the next time the garbage collector ran.
