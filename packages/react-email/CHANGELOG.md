# react-email

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
