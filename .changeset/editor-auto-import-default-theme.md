---
"@react-email/editor": patch
---

Ship the default theme import inside `EmailEditor`'s published output. The `import '../ui/themes/default.css'` in the source was being extracted by the bundler into an orphan `dist/style.css` that nothing imported and that was not exported, so `EmailEditor` rendered its bubble menus and slash command menu unstyled unless consumers imported `@react-email/editor/themes/default.css` themselves. The published `dist/index.{mjs,cjs}` now imports `@react-email/editor/themes/default.css` directly, matching the documented behavior.
