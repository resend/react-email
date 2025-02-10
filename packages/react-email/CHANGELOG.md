# react-email

## 4.0.0-alpha.3

### Patch Changes

- df0940a: Fix code view contrast

## 4.0.0-alpha.2

### Minor Changes

- e4eeb18: Make the width and height for the preview of the email customizable

## 4.0.0-alpha.1

### Minor Changes

- c77f635: Add image validation checking

### Patch Changes

- 498e816: Fix padding on the file tree

## 4.0.0-alpha.0

### Major Changes

- f7d352e: Added toolbar with a link checker

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
