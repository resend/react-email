---
"react-email": patch
---

Avoid spamming each spinner frame as a new line on non-TTY streams (CI logs, pipes, dumb terminals). The spinner now logs each status text once instead of redrawing animated frames when the output is not a TTY.
