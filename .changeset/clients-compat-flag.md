---
"@react-email/ui": minor
"react-email": minor
---

add a `--clients` option to `email dev` and a `COMPATIBILITY_EMAIL_CLIENTS` environment variable to narrow which email clients trigger compatibility warnings. By default the preview still warns for `gmail`, `apple-mail`, `outlook`, and `yahoo`. Teams that only target one or two clients can now skip the noise: `email dev --clients outlook,apple-mail`. The CLI flag wins over the env var; an empty or fully-invalid list falls back to the defaults so warnings can't be silently switched off. Builds on #2797 by @ReemX.
