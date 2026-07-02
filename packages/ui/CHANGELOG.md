# @react-email/ui

## 6.6.6

### Patch Changes

- b68009f: Stop failing `email build` when the spam check API errors or times out — the build now logs a warning and continues without a baked-in spam score.

## 6.6.5

### Patch Changes

- 1213e82: fix mismatch between motion dependencies causing problems in build for some users

## 6.6.4

## 6.6.3

### Patch Changes

- 5ad1d79: Update the existing Resend template on upload instead of always creating a new one. The "Upload to Resend" and "Bulk Upload" actions now look the template up by name and update it in place when exactly one matches, so re-uploading no longer produces duplicates (`welcome`, `welcome (1)`, ...).

## 6.6.2

## 6.6.1

### Patch Changes

- 1dd2bff: Fix line and column calculation for CRLF line endings in the email validation diagnostics. A `\r\n` was being counted as two line breaks, so line and column numbers reported for templates authored with Windows line endings were off.

## 6.6.0

## 6.5.0

### Minor Changes

- 3875d2a: add a `--clients` option to `email dev` and a `COMPATIBILITY_EMAIL_CLIENTS` environment variable to narrow which email clients trigger compatibility warnings. By default the preview still warns for `gmail`, `apple-mail`, `outlook`, and `yahoo`. Teams that only target one or two clients can now skip the noise: `email dev --clients outlook,apple-mail`. The CLI flag wins over the env var; an empty or fully-invalid list falls back to the defaults so warnings can't be silently switched off. Builds on #2797 by @ReemX.

## 6.4.0

## 6.3.3

### Patch Changes

- 86745ec: reject paths that resolve outside the configured emails directory in `renderEmailByPath` and `getEmailPathFromSlug` to close a path-traversal vector in the preview server

## 6.3.2

## 6.3.1

### Patch Changes

- 27587f1: stop accepting the emails directory path as a server-action argument

  The `getEmailsDirectoryMetadataAction` server action used to take an
  absolute filesystem path from the client and walk that directory on the
  server, which allowed any caller of the endpoint to enumerate arbitrary
  directories on the host. The action now reads the path from the server-only
  `REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH` env variable and ignores
  client input.

## 6.3.0

### Minor Changes

- 99cadf3: support previewing HTML email templates

### Patch Changes

- fd140fc: quality of life improvements to the send email flow:
  - infer a proper title based on the file name
  - store preferred subject per email when modified
  - store recipient for testing in local storage as well

## 6.2.0

## 6.1.5

## 6.1.4

## 6.1.3

### Patch Changes

- 62417f5: bump nextjs version

## 6.1.2

### Patch Changes

- 8cabf52: fix fs constants warnings on every fs warning

## 6.1.1

## 6.1.0

### Minor Changes

- dee7254: add hsl/hsla compatibility detection

## 6.0.8

## 6.0.7

## 6.0.6

## 6.0.5

### Patch Changes

- 61df218: Fix the preview server package build so Turbopack's externalized esbuild alias is included in the published tarball.

## 6.0.4

### Patch Changes

- 96af3a7: Replace ora with picospinner for CLI and preview spinner output.

## 6.0.3

## 6.0.2

### Patch Changes

- 6b24228: fallback behavior for prompt copying when too long

## 6.0.1

## 6.0.0

### Major Changes

- 3ca799d: Rename @react-email/preview-server -> @react-email/ui.

  Same exact code, but with a different name. The equivalent `react-email` version has also been udpated accordingly. The old @react-email/preview-server will be deprecated.

  ### How to migrate

  **Update your dependencies** -- remove `@react-email/preview-server`, install `@react-email/ui`:

  ```diff
  - npm install @react-email/preview-server
  + npm install @react-email/ui
  ```

### Patch Changes

- 5bd0d43: copy toolbar insights for AI
- 91ca688: remove extra margin from sending button

## 6.0.0-canary.2

### Patch Changes

- 91ca688: remove extra margin from sending button

## 6.0.0-canary.1

### Major Changes

- 3ca799d: Rename @react-email/preview-server -> @react-email/ui.

  Same exact code, but with a different name. The equivalent `react-email` version has also been udpated accordingly. The old @react-email/preview-server will be deprecated.

  ### How to migrate

  **Update your dependencies** -- remove `@react-email/preview-server`, install `@react-email/ui`:

  ```diff
  - npm install @react-email/preview-server
  + npm install @react-email/ui
  ```

### Patch Changes

- 5bd0d43: copy toolbar insights for AI

## 6.0.0-canary.0

## 5.2.10

### Patch Changes

- e3269cb: fix fragment prop usage warnings

## 5.2.9

## 5.2.8

### Patch Changes

- bdf0f1b: update to latest Next.js

## 5.2.7

### Patch Changes

- d47d37e: fix default imports of node modules breaking

## 5.2.6

### Patch Changes

- b019159: improve error messages for when an email template is missing
- 11f56c5: fix RESEND_API_KEY being overwritten in email preview

## 5.3.0-canary.2

## 5.3.0-canary.1

## 5.3.0-canary.0

### Patch Changes

- Updated dependencies [a8764ee]
  - @react-email/tailwind@2.0.4-canary.0

## 5.2.5

## 5.2.4

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
