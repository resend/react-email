---
"@react-email/editor": minor
---

expose the unformatted (non-prettified) HTML from `composeReactEmail` as a new `unformattedHtml` field on the result. The existing `html` field is unchanged and still Prettier-formatted. Consumers that persist or send the email should prefer `unformattedHtml`, since `pretty()` indentation can inflate the byte size by 5–10× on deeply-nested table layouts (e.g. exports from Stripo or Mailchimp) and pushes the output past Gmail's 102 KB clipping threshold.
