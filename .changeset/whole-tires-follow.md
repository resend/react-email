---
"@react-email/ui": major
---

Rename @react-email/preview-server -> @react-email/ui.

Same exact code, but with a different name. The equivalent `react-email` version has also been udpated accordingly. The old @react-email/preview-server will be deprecated.

### How to migrate

**Update your dependencies** -- remove `@react-email/preview-server`, install `@react-email/ui`:

   ```diff
   - npm install @react-email/preview-server
   + npm install @react-email/ui
   ```

