# @react-email/render

## 1.2.0

### Minor Changes

- fc2f407: add toPlainText utility and deprecate plainText option on `render`

## 1.1.4

### Patch Changes

- f5f35f1: fix hydration markers on React canary/Next.js latest when rendering large email templates

## 1.1.3

### Patch Changes

- 19cc59c: fix browser version including errors in the output instead of throwing them

## 1.1.3-canary.0

### Patch Changes

- e22cc83: fix browser version including errors in the output instead of throwing them

## 1.1.2

### Patch Changes

- c6c03a4: fix react-dom/server import for the browser and some bundlers
- e4598ab: Fixes `pretty` option breaking CJS projects
- faa6944: accept React.ReactNode instead of React.ReactElement

## 1.1.2-canary.0

### Patch Changes

- 0405e2b: fix react-dom/server import for the browser and some bundlers

## 1.1.1

### Patch Changes

- a77ef6f: fix preview being rendered in plain-text

## 1.1.1-canary.0

### Patch Changes

- 57ddfd9: fix react-dom/server import for the browser and some bundlers

## 1.1.0

### Minor Changes

- 5d153a3: Deprecate the `pretty` option for `render` in favor of standalone `pretty` function

### Patch Changes

- 9aa033c: Use range of versions for dependencies

## 1.1.0-canary.1

### Patch Changes

- 9b1adb0: Use range of versions for dependencies

## 1.1.0-canary.0

### Minor Changes

- 32372da: Deprecate the `pretty` option for `render` in favor of standalone `pretty` function

## 1.0.6

### Patch Changes

- f4c5456: Update dependencies: `prettier@3.5.3`

## 1.0.5

### Patch Changes

- caa49b3: Fix extra `<` characters being kept when rendering if mso comments under certain conditions
- 337ac4e: Fix pretty option breaking button components
- b44c937: Fix unstable rendering when prettifying with the Preview component

## 1.0.5-canary.1

### Patch Changes

- dfc49b5: Fix extra `<` characters being kept when rendering if mso comments under certain conditions
- 301f54b: Fix unstable rendering when prettifying with the Preview component

## 1.0.5-canary.0

### Patch Changes

- ed2fa33: Fix pretty option breaking button components

## 1.0.4

### Patch Changes

- 1ff196a: Update prettier dependency.

## 1.0.3

### Patch Changes

- 467af4e: Use peerDependencies for react and react-dom
- b34aa90: Move react and react-dom to just dependencies for better DX
- da3e719: Use prettier's stadalone API instead of js-beautify
- fd3b9de: Remove uncessary destructuring of react-dom/server

## 1.0.3-canary.3

### Patch Changes

- 467af4e: Use peerDependencies for react and react-dom

## 1.0.3-canary.2

### Patch Changes

- 2ebf17f: Use prettier's stadalone API instead of js-beautify

## 1.0.3-canary.1

### Patch Changes

- 0f32e50: Remove uncessary destructuring of react-dom/server

## 1.0.3-canary.0

### Patch Changes

- f7833da: Move react and react-dom to just dependencies for better DX

## 1.0.2

### Patch Changes

- 4627675: Fix null characters in between chunks when using high-density characters

## 1.0.2-canary.0

### Patch Changes

- 0fab161: Fix null characters in between chunks when using high-density characters

## 1.0.1

### Patch Changes

- 7481b12: Add a wrapping Suspense to all email templates before rendering

## 1.0.0

### Major Changes

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

### Patch Changes

- 3caaf53: Updated peer dependencies to allow for React 19 release candidated and React 19 itself

## 1.0.0-canary.1

### Major Changes

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

## 0.0.18-canary.0

### Patch Changes

- a1c016b: Updated peer dependencies to allow for React 19 release candidated and React 19 itself
