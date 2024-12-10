# @react-email/tailwind

## 1.0.4

### Patch Changes

- 9540fc5: Fix issue with types due to improper build

## 1.0.3

### Patch Changes

- 467af4e: Use peerDependencies for react and react-dom
- b34aa90: Move react and react-dom to just dependencies for better DX

## 1.0.3-canary.1

### Patch Changes

- 467af4e: Use peerDependencies for react and react-dom

## 1.0.3-canary.0

### Patch Changes

- f7833da: Move react and react-dom to just dependencies for better DX

## 1.0.2

### Patch Changes

- 93de4ce: Fix TailwindConfig's type broken when tailwindcss is not installed on the user's project

## 1.0.1

### Patch Changes

- 6bd37a7: Fix duplicate media query styles
- 6bd37a7: Fix Promise being returned as a React Node

## 1.0.0

### Major Changes

- 60db705: Updates `tailwindcss` to latest version, but requires use of `@react-email/render@>=1.0.0`

### Minor Changes

- d8b4630: Refactored internally to have a much smaller bundle size

### Patch Changes

- 9ea6073: Fixes CSS variables being replaced with `undefined`
- 453229a: Fix `css-float` being used for utilities such as `float-left`

## 1.0.0-canary.2

### Minor Changes

- 4520ca8: Refactored internally to have a much smaller bundle size

## 1.0.0-canary.1

### Patch Changes

- 15e95c7: Fixes CSS variables being replaced with `undefined`
- 6c20067: Fix `css-float` being used for utilities such as `float-left`

## 1.0.0-canary.0

### Major Changes

- a4adb29: Updates `tailwindcss` to latest version, but requires use of `@react-email/render@>=1.0.0`

## 0.1.0

### Minor Changes

- 5018ce8: - Add support for proper `className` manipulation
  - Make inline styles override Tailwind styles.

### Patch Changes

- 3caaf53: Updated peer dependencies to allow for React 19 release candidated and React 19 itself
- 6d27a20: Fixes generation of unecessary styles (ex: including `container` as text somehwere in your template)

## 0.1.0-canary.1

### Minor Changes

- 4d492d3: Add support for proper `className` manipulation
- Make inline styles override Tailwind styles.

### Patch Changes

- 9052c17: Fixes generation of unecessary styles (ex: including `container` as text somehwere in your template)

## 0.0.20-canary.0

### Patch Changes

- a1c016b: Updated peer dependencies to allow for React 19 release candidated and React 19 itself

## 0.0.19

### Patch Changes

- dfb55ce: Changed it so children of a component are only processed after the component is done with them
- Add forward ref

## 0.0.19-canary.2

### Patch Changes

- 3b4b362: Changed it so children of a component are only processed after the component is done with them
- Add forward ref

## 0.0.19-canary.1

### Patch changes

- Add forward ref
