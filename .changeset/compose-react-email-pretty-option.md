---
"@react-email/editor": minor
---

add a `pretty` option to `composeReactEmail` (defaults to `true`). Pass `pretty: false` to skip the Prettier pass when only `unformattedHtml` is needed; `html` then equals `unformattedHtml`. Prettier is slow on large emails and overflows the call stack on very deeply nested layouts (e.g. Stripo or Mailchimp imports), which made the whole compose reject even though the caller never used the formatted output.
