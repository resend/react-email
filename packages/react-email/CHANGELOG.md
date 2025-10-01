# react-email

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
