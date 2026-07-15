# react-email

## 6.9.0

## 6.8.1

## 6.8.0

### Minor Changes

- 9605c04: Add a Props tab to the preview toolbar for live-editing the props a template is rendered with. Edits re-render the preview without changing the template's `PreviewProps`, invalid JSON is flagged inline, and a reset restores the template defaults.

### Patch Changes

- d7743bc: Ship per-module build output with `sideEffects: false` so bundlers can tree-shake unused components. Importing a component no longer pulls prismjs, marked, and tailwindcss into the bundle unless `CodeBlock`, `Markdown`, or `Tailwind` is actually used.
- 7b32bf6: Fixed toolbar tabs not responding on statically built previews when the page was opened with a `toolbar-panel` query param in the URL.

## 6.7.0

### Minor Changes

- b448c3b: Enable custom export extensions via --extension/-e (e.g. .blade.php).

### Patch Changes

- Updated dependencies [ba96cfa]
- Updated dependencies [58d8c08]
  - @react-email/render@2.1.0

## 6.6.9

### Patch Changes

- bc2f7e3: Fix `group` utilities including bad rules that don't work

## 6.6.8

### Patch Changes

- dca3c01: Fix `email build` computing the wrong output file tracing root in nested-workspace monorepos (e.g. a package one or more directories below the true repo root), which caused Vercel deploys to fail with an ENOENT error on the routes manifest.

## 6.6.7

### Patch Changes

- 6a5ff2a: Escape double quotes in `Markdown` link `href`/`title` and image `title` attributes, matching the escaping already applied to image `src`/`alt`. A markdown title like `'The "Complete" Guide'` no longer breaks out of the attribute in the rendered HTML.
- 4cf4c72: Fix two-value logical shorthands whose values aren't all numeric (e.g. `margin-inline: 1rem auto`, `padding-inline: 10px calc(1rem + 2px)`) producing invalid duplicated longhands. They are now split into the correct per-side declarations.
- fa77d55: Merge declarations when the same class is defined by multiple Tailwind rules (e.g. a preset and a child config override).
- fa52a04: Convert Tailwind's `rgba(r g b / a)` syntax to `rgb(r,g,b,a)` syntax for better email client support.
- fc8318c: Fix Tailwind classes not being inlined into styles for `<Section>`, `<Column>` and `<Row>`.

## 6.6.6

### Patch Changes

- b4ac0d5: Fix `Button` emitting `mso-text-raise` without a unit on its Outlook padding spacer (e.g. `mso-text-raise:18`), which Outlook treats as invalid. The value now carries `px`, matching the unit React already adds on the button label.
- cb3c468: Fix `email build` so the generated preview app deploys on Vercel by tracing files from the user's project root instead of the `.react-email` subfolder.
- Updated dependencies [c300cfb]
  - @react-email/render@2.0.10

## 6.6.5

## 6.6.4

### Patch Changes

- f8279be: Fix Tailwind pill utilities like `rounded-t-full` and `rounded-e-full` leaving an unrenderable `calc(infinity * 1px)` in the inlined email CSS (previously only `rounded-full` was converted to `9999px`).

## 6.6.3

## 6.6.2

### Patch Changes

- 437c414: Fix Tailwind opacity modifiers (e.g. `bg-blue-600/50`) rendering an invalid percentage alpha that breaks in some email clients.

## 6.6.1

### Patch Changes

- 21bac49: Fix `Markdown` corrupting double quotes in `markdownCustomStyles`. Inline style values containing a `"` (e.g. `fontFamily: '"Times New Roman", serif'`) were escaped to the apostrophe entity `&#x27;` instead of `&quot;`, silently rewriting the quoted value. Double quotes are now escaped as `&quot;`.
- Updated dependencies [60a5b09]
  - @react-email/render@2.0.9

## 6.6.0

### Minor Changes

- 16ff94c: add a useTitleTag in Preview component so users can disable it if they want to

## 6.5.0

### Minor Changes

- 3875d2a: add a `--clients` option to `email dev` and a `COMPATIBILITY_EMAIL_CLIENTS` environment variable to narrow which email clients trigger compatibility warnings. By default the preview still warns for `gmail`, `apple-mail`, `outlook`, and `yahoo`. Teams that only target one or two clients can now skip the noise: `email dev --clients outlook,apple-mail`. The CLI flag wins over the env var; an empty or fully-invalid list falls back to the defaults so warnings can't be silently switched off. Builds on #2797 by @ReemX.

### Patch Changes

- d47825a: Add accessibility defaults to components: `dir`/`lang` on `Body`, an empty `alt` fallback on `Img`, `role="presentation"` on the `Markdown` table, and a `<title>` from `Preview`.

## 6.4.0

### Minor Changes

- ba99365: resolve and strip unresolved `--tw-*` CSS variables in non-inlinable rules so Tailwind media query utilities no longer break Gmail

## 6.3.3

## 6.3.2

### Patch Changes

- fbda5c8: increase whitespace padding to 200 characters for better Gmail preview text rendering

## 6.3.1

### Patch Changes

- c610dc0: fix: padding in Container/Section failing on Klaviyo and Outlook desktop

## 6.3.0

## 6.2.0

### Minor Changes

- 192d82a: Add `theme` and `utility` props to `<Tailwind>` for Tailwind v4 CSS-first configuration. Both accept a CSS string and can be combined with the existing `config` prop.

  ```tsx
  import themeCss from "./theme.css?inline";

  <Tailwind theme={themeCss}>
    <div className="bg-brand font-display">Custom themed content</div>
  </Tailwind>;
  ```

  Empty strings are no-ops. The base Tailwind theme and utilities are still loaded — `theme` and `utility` layer on top.

  The preview server, `email export`, and the caniemail compatibility check all understand the Vite-style `?inline` and `?raw` suffixes on CSS imports, so the pattern above works the same in your project and inside the preview UI. The compatibility check also extracts the `theme` and `utility` props (in addition to `config`) when analyzing your template, so any caniemail incompatibilities in CSS produced by those props will surface as warnings.

  Internal note: the exported `setupTailwind` helper now takes `{ config, cssConfigs }` instead of a positional `TailwindConfig`. Calling it with the old shape throws with a migration hint.

### Patch Changes

- 06f1d05: Watch directories targeted by dynamic `import()` template literals so changes to runtime-resolved files trigger preview reloads.

## 6.1.5

### Patch Changes

- 1a61cb0: Avoid OOM when running `email export` on projects with many templates. esbuild builds now run in batches of 10 entry points, and the render phase runs each batch of 25 templates inside a `worker_threads` worker so V8 isolate memory is reclaimed between batches.

## 6.1.4

### Patch Changes

- 1c386ce: Avoid spamming each spinner frame as a new line on non-TTY streams (CI logs, pipes, dumb terminals). The spinner now logs each status text once instead of redrawing animated frames when the output is not a TTY.
- ad6a9de: - deprecate packageManager CLI option for `email build`, only supporting npm
  - ensure `email build` dependency installation includes dev dependencies

## 6.1.3

## 6.1.2

## 6.1.1

### Patch Changes

- 3c62bd0: fix divider with extra borders around other corners

## 6.1.0

### Patch Changes

- 47eeece: Tailwind: clearer error when `<Head>` is outside `<Tailwind>`

## 6.0.8

### Patch Changes

- 65525e0: Tailwind: parse non inline configuration variables

## 6.0.7

### Patch Changes

- 87a2486: undo nesting of all media queries, and replace >= <= exxpressions with min-width/max-width on the Tailwind component

## 6.0.6

### Patch Changes

- 84bb7ab: collapse empty-fallback var() refs in inline styles

## 6.0.5

## 6.0.4

### Patch Changes

- 96af3a7: Replace ora with picospinner for CLI and preview spinner output.
- 5cf57ae: unpin esbuild
- Updated dependencies [e0e896f]
  - @react-email/render@2.0.8

## 6.0.3

### Patch Changes

- bb51e5e: fix missing react and react-dom peer dependencies

## 6.0.2

### Patch Changes

- 63b6e71: Fix Markdown component crashing on CommonMark loose lists with paragraph continuations

## 6.0.1

### Patch Changes

- 599b8c5: fix type issues in starter template and in react-email

## 6.0.0

### Major Changes

- d0a7a52: Move all components and utilities into the `react-email` package

  All components (previously in `@react-email/components` or individual packages like `@react-email/button`) and rendering utilities (previously in `@react-email/render`) are now exported directly from `react-email`. This unifies the install and import experience into a single package.

  We're going to deprecate all packages except `@react-email/render` and `@react-email/ui`, and they will not be updated anymore.

  ### Breaking change

  Imports from `@react-email/components`, `@react-email/render`, or individual component packages (e.g. `@react-email/button`) are no longer the recommended path and they will all be deprecated with the exception of `@react-email/render` and `@react-email/editor`, and `render` will remain exported from `react-email`. Consumers should import everything from `react-email`.

  ### Why

  Having separate packages for components (`@react-email/components`), and the CLI (`react-email`) created unnecessary confusion, and a maintenance burden for us.

  ### How to migrate
  1. Remove `@react-email/components`:

     ```diff
     npm remove @react-email/components
     ```

  2. Update `react-email`, and move it over to `dependencies`:

     ```diff
     npm install react-email@latest
     ```

  3. **Update your imports**:

     ```diff
     - import { Button, Html, Head, render } from "@react-email/components";
     + import { Button, Html, Head, render } from "react-email";
     ```

### Patch Changes

- a3a15ea: replace deprecated `url.parse()` with WHATWG URL API in the preview dev server.
- Updated dependencies [7fc539d]
  - @react-email/render@2.0.7

## 6.0.0-canary.2

## 6.0.0-canary.1

### Patch Changes

- Updated dependencies [7fc539d]
  - @react-email/render@2.0.7-canary.0

## 6.0.0-canary.0

### Major Changes

- d0a7a52: Move all components and utilities into the `react-email` package

  All components (previously in `@react-email/components` or individual packages like `@react-email/button`) and rendering utilities (previously in `@react-email/render`) are now exported directly from `react-email`. This unifies the install and import experience into a single package.

  We're going to deprecate all packages except `@react-email/render` and `@react-email/preview-server`, and they will not be updated anymore.

  ### Breaking change

  Imports from `@react-email/components`, `@react-email/render`, or individual component packages (e.g. `@react-email/button`) are no longer the recommended path and they will all be deprecated with the exception of `@react-email/render` and `@react-email/editor`, and `render` will remain exported from `react-email`. Consumers should import everything from `react-email`.

  ### Why

  Having separate packages for components (`@react-email/components`), and the CLI (`react-email`) created unnecessary confusion, and a maintenance burden for us.

  ### How to migrate
  1. **Update your dependencies** -- remove `@react-email/components`, keep `react-email`:

     ```diff
     - npm install @react-email/components react-email @react-email/preview-server
     + npm install react-email @react-email/preview-server
     ```

  2. **Update your imports**:

     ```diff
     - import { Button, Html, Head, render } from "@react-email/components";
     + import { Button, Html, Head, render } from "react-email";
     ```

  3. The `@react-email/preview-server` and `@react-email/editor` packages are not included in `react-email`

### Patch Changes

- a3a15ea: replace deprecated `url.parse()` with WHATWG URL API in the preview dev server.

## 5.2.10

## 5.2.9

### Patch Changes

- 79bb7cc: manually determine esbuild binary path to avoid forcing a host version

## 5.2.8

## 5.2.7

## 5.2.6

### Patch Changes

- 11f56c5: fix RESEND_API_KEY being overwritten in email preview

## 5.3.0-canary.2

### Patch Changes

- 1b9df29: ensure that installed preview server also has dev dependencies

## 5.3.0-canary.1

### Patch Changes

- 0289914: fix random errors due to root directory not being the preview's path

## 5.3.0-canary.0

### Minor Changes

- 7c18bd3: don't require installing @react-email/preview-server in the project, pack it into `$HOME/.react-email`

## 5.2.5

### Patch Changes

- 81aea00: revert changes to fix compatibility with alpine

## 5.2.4

### Patch Changes

- 26283f9: fix support for alpine

## 5.2.3

### Patch Changes

- 800c960: `email build` always failing

## 5.2.2

## 5.2.1

## 5.2.0

### Patch Changes

- 16cc7d1: increase timeout to 10 minutes by default, disable build workers

## 5.2.0-canary.3

### Patch Changes

- 16cc7d1: increase timeout to 10 minutes by default, disable build workers

## 5.2.0-canary.2

## 5.2.0-canary.1

## 5.2.0-canary.0

## 5.1.1

### Patch Changes

- 8b7a660: remove use of devEngines which npm detects

## 5.1.0

### Minor Changes

- 3c2aa37: use turbo for `email build`

## 5.0.8

## 5.0.7

## 5.0.6

## 5.0.5

## 5.0.4

## 5.0.3

## 5.0.2

## 5.0.1

## 5.0.0

### Minor Changes

- 95c7417: Dark mode switcher emulating email client color inversion

### Patch Changes

- b6b027c: improved integration setup flow
- 1b3176e: fallback to not text coloring for Node.js < 20

## 5.0.0-canary.12

## 5.0.0-canary.11

## 5.0.0-canary.10

## 5.0.0-canary.9

## 5.0.0-canary.8

### Patch Changes

- b6b027c: improved integration setup flow

## 5.0.0-canary.7

## 5.0.0-canary.6

## 5.0.0-canary.5

## 5.0.0-canary.4

## 5.0.0-canary.3

### Minor Changes

- 95c7417: Dark mode switcher emulating email client color inversion

## 5.0.0-canary.2

### Patch Changes

- 1b3176e: fallback to not text coloring for Node.js < 20

## 5.0.0-canary.1

## 5.0.0-canary.0

## 4.3.2

## 4.3.1

### Patch Changes

- 1e13d15: hot reloading errors when importing .json and other file extensions

## 4.3.0

## 4.2.12

### Patch Changes

- 90f39d5: Normalize Windows paths in generated Next.js config

## 4.2.11

## 4.2.10

## 4.2.9

### Patch Changes

- 1e53b4c: use `styleText` from `node:util` instead of `chalk`

## 4.2.8

### Patch Changes

- 64cd6ec: fix hot reloading with circular dependencies

## 4.2.7

## 4.2.6

## 4.2.5

### Patch Changes

- 8719082: fix errors in `export` when without manual React import

## 4.2.4

## 4.2.3

### Patch Changes

- 8259eeb: fix files with extension-like suffixes (i.e. config, .spec) breaking dependency graph

## 4.2.2

### Patch Changes

- eb7f0ac: dev server erroring when trying to startup with port already being used

## 4.2.1

## 4.2.0

### Minor Changes

- e52818c: add custom error handling for prettier's syntax errors

## 4.1.3

## 4.1.2

## 4.1.1

### Patch Changes

- ef77691: fix path resolution done wrong breaking `email dev` on Windows

## 4.1.0

### Minor Changes

- abf8599: use a separate package for storing the preview server (@react-email/preview-server)

### Patch Changes

- e173b44: Use the same version for the preview-server and react-email

## 4.1.0-canary.12

## 4.1.0-canary.11

### Patch Changes

- 19d4b45: fix static file serving security issue with logging

## 4.1.0-canary.10

## 4.1.0-canary.9

### Patch Changes

- 40fb596: Use the same version for the preview-server and react-email

## 4.1.0-canary.8

### Minor Changes

- ed2f46a: use a separate package for storing the preview server (@react-email/preview-server)

## 4.1.0-canary.7

### Patch Changes

- f00aff6: Fix prettier errors causing NextJS serialization error

## 4.1.0-canary.6

### Patch Changes

- 11c4600: Add support for hot reloading with tsconfig path aliases

## 4.1.0-canary.5

### Patch Changes

- b947f98: Pre-render email templates on hover

## 4.1.0-canary.4

### Patch Changes

- 5c6150d: Add .json import support for hot reloading
- aae2f59: Ensure dependencies outside emails directory are completely resolved
- b4b2373: Fix non-email files being rendered during hot reloading

## 4.1.0-canary.3

### Patch Changes

- 681d4ed: fix backwards compatibility with `render` versions

## 4.1.0-canary.2

### Patch Changes

- 9b1adb0: Use range of versions for dependencies

## 4.1.0-canary.1

### Patch Changes

- a587e17: Fix dependent of dependents not causing hot reloads
- dbf3a64: Add error message for when an email template does not have a default export

## 4.1.0-canary.0

### Minor Changes

- 4a0d4e3: Theme switcher for email template

## 4.0.17

### Patch Changes

- e352a67: fix `<svg>` not being flagged as incompatible
- 8f64ebd: fix the forced `color-scheme: dark` for the preview
- 6de4e9f: fix static file serving security issue with logging
- b2e96d5: Add support for hot reloading with tsconfig path aliases
- 6b0cfd6: fix hot reloading with collapsed directories
- 8c93330: Fix prettier errors causing NextJS serialization error
- a07eebf: Pre-render email templates on hover

## 4.0.16

### Patch Changes

- 1340a0a: fix mobile's sidebar broken in the preview server

## 4.0.15

### Patch Changes

- 812c551: fix preview server's background gradient interferring with the user's colors

## 4.0.14

### Patch Changes

- b57f866: fix hot reloading with directories at least two levels deep

## 4.0.13

### Patch Changes

- 8e4afce: fix hot reloading support for users with `NodeNext`-style imports

## 4.0.12

### Patch Changes

- aa518a3: Add an explicit error when running Node <= 17

## 4.0.11

### Patch Changes

- 1a17219: fix improper `require` in `email export`
- 45ab698: update next to 15.3.1

## 4.0.10

### Patch Changes

- 5ef9fe8: fix support for `import ... = require(...)` syntax
- 4c7f597: fix `email dev` not working with `traversal` error

## 4.0.9

### Patch Changes

- 643d841: Add .json import support for hot reloading
- f21a983: fix Node 18 support
- cd02449: Ensure dependencies outside emails directory are completely resolved
- 73a31ed: Fix dependent of dependents not causing hot reloads
- bdffd8c: fix backwards compatibility with `render` versions
- e7fa043: Fix access to files outside `static` directory
- 9aa033c: Use range of versions for dependencies
- ab70556: Fix non-email files being rendered during hot reloading
- 9c9aa5d: Add error message for when an email template does not have a default export

## 4.0.8

### Patch Changes

- ea579b5: Log out errors that happen when `export`'s esbuild fails

## 4.0.7

### Patch Changes

- 403e415: Fix `deno` not working as an option for `email build`

## 4.0.6

### Patch Changes

- 809130e: `next@15.2.4`

## 4.0.5

### Patch Changes

- e1dc351: Add support for path aliases when linter runs tailwind config

## 4.0.4

### Patch Changes

- 1a7f9e6: Update dependencies: `next@15.2.3`
- 9832b5e: Fixed support for importing modules when linter loads Tailwind config

## 4.0.3

### Patch Changes

- 962f768: update esbuild to 0.25.0
- 2225fe6: Fix detection of files with various export patterns

## 4.0.2

### Patch Changes

- ddf9652: Fix crashing when the link or image does not exist

## 4.0.1

### Patch Changes

- 8fd7409: Fix static files regression
- 8448a0b: Improved classes, better borders on table, improved scollbar colors

## 4.0.0

### Major Changes

- 56ab5ab: Add toolbar with image/link validation, compatibility checking and a spam scoring system

## 3.0.7

### Patch Changes

- c61760e: use the `punycode` package for the static modules
- 382c305: Fixes active state for root email templats on file tree
- 519f0c6: Respect user's NODE_ENV when previewing templates
- e149816: Upgrade socket.io to 4.8.1

## 3.0.7-canary.1

### Patch Changes

- 57db6f7: Upgrade socket.io to 4.8.1

## 3.0.7-canary.0

### Patch Changes

- 98b434c: Fixes active state for root email templats on file tree
- 1c5c986: Respect user's NODE_ENV when previewing templates

## 3.0.6

### Patch Changes

- c6fcd94: Fix preview server crashing without React 19

## 3.0.5

### Patch Changes

- 7337d04: Fix emails being re-rendered each time there is navigation in the preview server

## 3.0.4

### Patch Changes

- 8f395d2: Update to React 19

## 3.0.3

### Patch Changes

- 1e82151: fix null byte characters being rendered in the preview server
- b34aa90: Move react and react-dom to just dependencies for better DX
- 6781316: Improve error messages for all CLI commands

## 3.0.3-canary.2

### Patch Changes

- 6781316: Improve error messages for all CLI commands

## 3.0.3-canary.1

### Patch Changes

- 6facd7c: fix null byte characters being rendered in the preview server

## 3.0.3-canary.0

### Patch Changes

- f7833da: Move react and react-dom to just dependencies for better DX

## 3.0.2

### Patch Changes

- dc72ca4: bump chokidar to v4
- 2a8675a: Add util/types as a module
- 4b174a4: Fix missing Request and Response globals
- 7eb68af: Fix NODE_ENV for emails as "PRODUCTION" instead of "DEVELOPMENT"
- 76183e0: Update socket.io and socket.io-client
- f295614: Add AbortSignal, Event and EventTarget
- bb79540: Add missing timers/promises Node module for `email dev`

## 3.0.2-canary.4

### Patch Changes

- 76183e0: Update socket.io and socket.io-client

## 3.0.2-canary.3

### Patch Changes

- ac01c91: bump chokidar to v4

## 3.0.2-canary.2

### Patch Changes

- 59e27bc: Add missing timers/promises Node module for `email dev`

## 3.0.2-canary.1

### Patch Changes

- 8ceb667: Add util/types as a module
- da82d77: Add AbortSignal, Event and EventTarget

## 3.0.2-canary.0

### Patch Changes

- 76bbf7b: Fix missing Request and Response globals
- 1af53fb: Fix NODE_ENV for emails as "PRODUCTION" instead of "DEVELOPMENT"

## 3.0.1

### Patch Changes

- a40904e: Fix hot reloading

## 3.0.0

### Major Changes

- 1a47335: Use a built version of preview app when running `email dev`

### Patch Changes

- 19cab7b: Fixes decorators causing dependency tree babel parsing to fail
- 14b7d1d: update socket.io/socket.io-client to 4.7.5
- b68e166: Fix sharp warning when running `email dev`
- 3caaf53: Updated peer dependencies to allow for React 19 release candidated and React 19 itself
- 9a5fd78: fix email template preview failing with emails having spaces
- d118a39: Fixes tooltip color being black for specific theming configurations
- 481e339: Fixes root directories being hidden when they are alone at their depth
- f9483ec: Deprecated `renderAsync` and made `render` itself always async

  ## Why

  Three reasons:
  1. Better support of NextJS's latest versions
  2. Being ready for future React API deprecations
  3. Support for Suspense which allows for using async inside components

  See https://github.com/resend/react-email/discussions/1144 for more info.

  ## How to upgrade

  If you are using the old `render`, you will need to now treat the Promise
  that comes out of it, as it is now async. If you are using `renderAsync`,
  you can replace it with `render` and things should work the same.

## 3.0.0-canary.1

### Patch Changes

- b87cbbf: Fix sharp warning when running `email dev`

## 3.0.0-canary.0

### Major Changes

- f552226: Use a built version of preview app when running `email dev`

### Patch Changes

- 2799bb4: fix email template preview failing with emails having spaces
- 3f67038: Deprecated `renderAsync` and made `render` itself always async

  ## Why

  Three reasons:
  1. Better support of NextJS's latest versions
  2. Being ready for future React API deprecations
  3. Support for Suspense which allows for using async inside components

  See https://github.com/resend/react-email/discussions/1144 for more info.

  ## How to upgrade

  If you are using the old `render`, you will need to now treat the Promise
  that comes out of it, as it is now async. If you are using `renderAsync`,
  you can replace it with `render` and things should work the same.

## 2.1.7-canary.2

### Patch Changes

- 349e5d5: Fixes decorators causing dependency tree babel parsing to fail
- 983626d: Fixes root directories being hidden when they are alone at their depth

## 2.1.7-canary.1

### Patch Changes

- 6f5204e: Fixes tooltip color being black for specific theming configurations

## 2.1.7-canary.0

### Patch Changes

- 27234ec: update socket.io/socket.io-client to 4.7.5
- a1c016b: Updated peer dependencies to allow for React 19 release candidated and React 19 itself

## 2.1.6

### Patch changes

- Fixes live refresh not working with files outside `emails` directory
- Fixes export failing when templates have different suffixes

## 2.1.6-canary.0

### Patch changes

- Fixes live refresh not working with files outside `emails` directory
- Fixes export failing when templates have different suffixes
