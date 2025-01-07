# @react-email/render

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
