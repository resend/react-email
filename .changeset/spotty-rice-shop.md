---
"react-email": major
---

Move all components and utilities into the `react-email` package

All components (previously in `@react-email/components` or individual packages like `@react-email/button`) and rendering utilities (previously in `@react-email/render`) are now exported directly from `react-email`. This unifies the install and import experience into a single package.

We're going to deprecate all packages except `@react-email/render` and `@react-email/preview-server`, and they will not be updated anymore.

### Breaking change

Imports from `@react-email/components`, `@react-email/render`, or individual component packages (e.g. `@react-email/button`) are no longer the recommended path and they will all be deprecated with the exception of `@react-email/render`, but it will remain exported from `react-email`. Users should import everything from `react-email`.

### Why

Having separate packages for components (`@react-email/components`), rendering (`@react-email/render`), and the CLI (`react-email`) created unnecessary confusion, and a maintenance burden for us.

### How to migrate

1. **Update your dependencies** -- remove `@react-email/components` and `@react-email/render`, keep `react-email`:

   ```diff
   - npm install @react-email/components @react-email/render react-email @react-email/preview-server
   + npm install react-email @react-email/preview-server
   ```

2. **Update your imports**:

   ```diff
   - import { Button, Html, Head, render } from "@react-email/components";
   + import { Button, Html, Head, render } from "react-email";
   ```

3. The `@react-email/preview-server` and `@react-email/editor` packages are unchanged and should continue to be imported separately.
