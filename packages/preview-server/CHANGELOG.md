# @react-email/preview-server

## 5.2.4-canary.0

## 5.2.3

### Patch Changes

- 7950b96: fix `email dev` not working

## 5.2.2

### Patch Changes

- 93964a7: fix intermittent (void 0) is not a function errors

## 5.2.1

### Patch Changes

- a6aed9e: fix toolbar loading spinner in the opposite direction
- 462f60b: fix(preview-server): hot reloading on Windows

## 5.2.0

### Minor Changes

- ccd6f05: bundle emails for preview to ESM

### Patch Changes

- 2d1d3a0: fix property access on null during dark mode inversion
- 5ea5d84: fix compatibility checking for styles nested in other objects
- d2d46c7: fix instanceof not working with regexes

## 5.2.0-canary.3

## 5.2.0-canary.2

### Patch Changes

- d2d46c7: fix instanceof not working with regexes

## 5.2.0-canary.1

### Patch Changes

- 5ea5d84: fix compatibility checking for styles nested in other objects

## 5.2.0-canary.0

### Minor Changes

- ccd6f05: bundle emails for preview to ESM

### Patch Changes

- 2d1d3a0: fix property access on null during dark mode inversion

## 5.1.1

### Patch Changes

- 8b7a660: remove use of devEngines which npm detects

## 5.1.0

### Minor Changes

- 3c2aa37: use turbo for `email build`

### Patch Changes

- ff89ad8: Buffer logs written to console.log,info,warn,error until spinner is done

## 5.0.8

### Patch Changes

- 1ca1c1d: add better feedback for when test sending is rate limited

## 5.0.7

### Patch Changes

- 92f8afd: broken links to html code view tab
- 6f5cb91: use tailwindcss v4 in the UI

## 5.0.6

### Patch Changes

- f2bb9e9: add missing favicon
- 1d14411: fix multiple lockfile warning during email build

## 5.0.5

### Patch Changes

- d89af46: Broken links to React lines of code in the toolbar

## 5.0.4

### Patch Changes

- 1d35e37: fix file names and extensions not being used in download

## 5.0.3

### Patch Changes

- 4861354: move most dependencies to devDependencies
- 7ab924c: fix unwanted dependency installation when typescript's not installed

## 5.0.2

### Patch Changes

- e0b7efa: fix sidebar misalignment with the topbar
- 872f33b: fix scrolling not working on email frame right after resizing

## 5.0.1

### Patch Changes

- 37b405b: Update link for Resend
- 56a696f: Increases the sleep time between bulk templates import to avoid exceeding the default API rate limit of 2 requests per second

## 5.0.0

### Major Changes

- 442f5b6: only check compatibility with tailwindcss@4

### Minor Changes

- 161083a: Integrate with Templates API so users can easily turn React Email templates into actual Resend templates
- 95c7417: Dark mode switcher emulating email client color inversion

### Patch Changes

- c6fa03e: improve color inversion code, don't remount iframe
- b6b027c: advise `npx` to run email setup command
- 18bc11a: fix compatibility checking not woring with inline object styles, and not working on properties such as `justifyContent`/`justify-content`
- e1ef323: improve reading flow for resend integration setup instructions
- 1b3176e: fallback to not text coloring for Node.js < 20
- f43f1ce: show separate timings for bundling/rendering an email template
- 397e98c: darken the canvas background when dark mode is enabled
- ef8702b: ui improvements
- 75d651b: reduce margins bellow buttons
- Updated dependencies [1e76981]
- Updated dependencies [442f5b6]
- Updated dependencies [2452b7d]
  - @react-email/tailwind@2.0.0

## 5.0.0-canary.12

### Patch Changes

- ef8702b: ui improvements

## 5.0.0-canary.11

### Patch Changes

- 75d651b: reduce margins bellow buttons

## 5.0.0-canary.10

### Patch Changes

- 397e98c: darken the canvas background when dark mode is enabled

## 5.0.0-canary.9

### Patch Changes

- e1ef323: improve reading flow for resend integration setup instructions

## 5.0.0-canary.8

### Patch Changes

- b6b027c: advise `npx` to run email setup command

## 5.0.0-canary.7

### Minor Changes

- 161083a: Integrate with Templates API so users can easily turn React Email templates into actual Resend templates

### Patch Changes

- f43f1ce: show separate timings for bundling/rendering an email template

## 5.0.0-canary.6

### Patch Changes

- c6fa03e: improve color inversion code, don't remount iframe
  - @react-email/tailwind@2.0.0-canary.4

## 5.0.0-canary.5

### Patch Changes

- @react-email/tailwind@2.0.0-canary.3

## 5.0.0-canary.4

### Patch Changes

- Updated dependencies [1e76981]
  - @react-email/tailwind@2.0.0-canary.2

## 5.0.0-canary.3

### Minor Changes

- 95c7417: Dark mode switcher emulating email client color inversion

## 5.0.0-canary.2

### Patch Changes

- 1b3176e: fallback to not text coloring for Node.js < 20

## 5.0.0-canary.1

### Patch Changes

- 18bc11a: fix compatibility checking not woring with inline object styles, and not working on properties such as `justifyContent`/`justify-content`

## 5.0.0-canary.0

### Major Changes

- 442f5b6: only check compatibility with tailwindcss@4

### Patch Changes

- Updated dependencies [442f5b6]
  - @react-email/tailwind@2.0.0-canary.1

## 4.3.2

### Patch Changes

- f38ed50: fix imports of files with implicit extensions, and secondary segment like `.spec` failing to hot reload

## 4.3.1

### Patch Changes

- c4d149e: make everything in the global for the UI available to email contexts using a Proxy

## 4.3.0

### Minor Changes

- c0f6ec2: Added resize snapping, refined UI and improved presets

## 4.2.12

## 4.2.11

### Patch Changes

- 0700b91: fix data-source-\* attributes in the html code view

## 4.2.10

### Patch Changes

- ffdb3a0: Update nextjs to 15.5.2

## 4.2.9

### Patch Changes

- 1e53b4c: use `styleText` from `node:util` instead of `chalk`

## 4.2.8

## 4.2.7

### Patch Changes

- 6997a9e: fix broken file tree animation on built preview server

## 4.2.6

### Patch Changes

- d3cc64d: use unformmated markup to send emails, and to render into the iframe

## 4.2.5

## 4.2.4

### Patch Changes

- 57b8bb8: fix custom JSX runtime trying to be run as ESM on ESM projects

## 4.2.3

## 4.2.2

## 4.2.1

### Patch Changes

- c273405: pin all dependencies to avoid compatibility issues of the built preview server

## 4.2.0

### Minor Changes

- e52818c: add custom error handling for prettier's syntax errors

## 4.1.3

### Patch Changes

- 09d7d9d: improved method of resolving tailwind configs when checking compatibility

## 4.1.2

### Patch Changes

- a8f4796: fix rendering utilities exporter plugin not running for symlinks

## 4.1.1

## 4.1.0

### Patch Changes

- e173b44: Use the same version for the preview-server and react-email
- e33be94: fix range rounded borders, tearing when selecting different lines
- 87b9601: infinte fetches due to improper effect dependency

## 4.1.0-canary.12

### Patch Changes

- e33be94: fix range rounded borders, tearing when selecting different lines
- 87b9601: infinte fetches due to improper effect dependency

## 4.1.0-canary.11

### Patch Changes

- 272b21e: fix the forced `color-scheme: dark` for the preview

## 4.1.0-canary.10

### Patch Changes

- caa4a31: fix hot reloading with collapsed directories

## 4.1.0-canary.9

### Patch Changes

- 40fb596: Use the same version for the preview-server and react-email

## 1.0.0-canary.1

### Patch Changes

- efb4db2: fix `<svg>` not being flagged as incompatible
