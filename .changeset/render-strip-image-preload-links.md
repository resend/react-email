---
"@react-email/render": patch
---

Strip React's auto-injected `<link rel="preload" as="image">` resource hints from rendered email HTML. React adds one to the document `<head>` for every `<img>` during SSR, but email clients ignore preload hints, so they were just noise in the output. Other `<link>` tags (stylesheets, fonts, user-authored non-image preloads) are left untouched.
