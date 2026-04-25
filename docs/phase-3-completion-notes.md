# Phase 3 Completion Notes

Status: complete with one known Windows root-build caveat.

## Scope Completed

- Added private package shells for `@asym/pdf-editor`,
  `@asym/pdf-renderer`, `@asym/pdf-template-schema`, and
  `@asym/docraptor-client`.
- Added typed boundary exports and public-entry smoke tests for each package.
- Added the temporary `@asym/pdf-editor/react-email-compat` adapter over public
  `@react-email/editor` exports.
- Added package readmes and `docs/package-boundaries.md`.
- Updated the dependency-map generator and regenerated `docs/dep-map.json`.
- Updated the roadmap and decision log.
- Preserved `packages/editor` and all upstream React Email packages.

## Machine Details

- Date: 2026-04-25
- OS: Microsoft Windows NT 10.0.26200.0
- Node: `v24.11.1`
- pnpm: `10.33.0`
- Working branch: `codex/phase-3-package-boundaries`
- Phase 3 base commit before cleanup:
  `65e7a9e1f21ab8cebcdbd4e4b28b374ab66945a2`

## Validation Results

### `pnpm install --frozen-lockfile --prefer-offline`

Result: passed.

Key output:

```text
Scope: all 18 workspace projects
Lockfile is up to date, resolution step is skipped
Packages: +6
Done in 2.7s using pnpm v10.33.0
```

### `pnpm asym:baseline-smoke`

Result: passed.

Key output:

```text
asym-baseline-smoke
branch=codex/phase-2-monorepo-inventory
upstreamCanarySha=d064012cd5a3b4817dbe03a932a6d68e83e07abb
editorPackagePath=packages/editor/package.json
editorPackageName=@react-email/editor
editorPackageVersion=1.1.1
packageManager=pnpm@10.33.0+sha512.10568bb4a6afb58c9eb3630da90cc9516417abebd3fabbe6739f0ae795728da1491e9db5a544c76ad8eb7570f5c4bb3d6c637b2cb41bfdcdb47fa823c8649319
status=ok
```

The smoke command ran before the branch was renamed for PR cleanup, so it
reports the prior local branch name.

### `pnpm asym:dep-map`

Result: passed.

Key output:

```text
wrote docs/dep-map.json
```

### `pnpm asym:dep-map:check`

Result: passed.

Key output:

```text
docs/dep-map.json is current.
```

### `pnpm --filter @react-email/editor build`

Result: passed.

Key output:

```text
> @react-email/editor@1.1.1 build
> tsdown
Build complete in 6633ms
> @react-email/editor@1.1.1 build:css
> tsx scripts/copy-css.ts
copied ui/bubble-menu/bubble-menu.css
copied ui/button-bubble-menu/button-bubble-menu.css
copied ui/image-bubble-menu/image-bubble-menu.css
copied ui/inspector/inspector.css
copied ui/link-bubble-menu/link-bubble-menu.css
copied ui/slash-command/slash-command.css
processed ui\themes\default.css
```

Observed warnings: existing Node `MODULE_TYPELESS_PACKAGE_JSON`, relative dts
module declaration, and tsdown plugin timing warnings.

### New package builds

Commands:

```sh
pnpm --filter @asym/pdf-template-schema build
pnpm --filter @asym/pdf-renderer build
pnpm --filter @asym/docraptor-client build
pnpm --filter @asym/pdf-editor build
```

Result: passed.

Key output:

```text
@asym/pdf-template-schema build: Build complete in 3004ms
@asym/pdf-renderer build: Build complete in 3017ms
@asym/docraptor-client build: Build complete in 2995ms
@asym/pdf-editor build: Build complete in 4220ms
```

### New package typechecks

Commands:

```sh
pnpm --filter @asym/pdf-template-schema typecheck
pnpm --filter @asym/pdf-renderer typecheck
pnpm --filter @asym/docraptor-client typecheck
pnpm --filter @asym/pdf-editor typecheck
```

Result: passed.

Key output:

```text
> tsc --noEmit
```

### New package tests

Commands:

```sh
pnpm --filter @asym/pdf-template-schema test
pnpm --filter @asym/pdf-renderer test
pnpm --filter @asym/docraptor-client test
pnpm --filter @asym/pdf-editor test
```

Result: passed.

Key output:

```text
@asym/pdf-template-schema: Test Files 1 passed; Tests 1 passed
@asym/pdf-renderer: Test Files 1 passed; Tests 1 passed
@asym/docraptor-client: Test Files 1 passed; Tests 1 passed
@asym/pdf-editor: Test Files 1 passed; Tests 2 passed
```

Implementation note: the first `@asym/pdf-editor` test run failed because
Vite matched the root package alias before the `react-email-compat` subpath
alias. The package Vitest config now uses ordered alias entries and the test
passes.

### `pnpm --filter @react-email/editor test:unit`

Result: passed.

Key output:

```text
Test Files 45 passed (45)
Tests 434 passed | 1 skipped (435)
Duration 8.35s
```

### `pnpm asym:editor-export-smoke`

Result: passed.

Key output:

```text
asym-editor-export-smoke
imported @react-email/editor exports=EmailEditor
imported @react-email/editor/core exports=EmailMark,EmailNode,composeReactEmail,editorEventBus,isDocumentVisuallyEmpty
imported @react-email/editor/extensions exports=Body,Bold,Button,Container,Heading,Link,Paragraph,Section,StarterKit,Table,Text
imported @react-email/editor/plugins exports=EmailTheming,useEditorImage
imported @react-email/editor/ui exports=BubbleMenu,Inspector,SlashCommand
imported @react-email/editor/utils exports=setTextAlignment
resolved @react-email/editor/styles/bubble-menu.css
resolved @react-email/editor/styles/button-bubble-menu.css
resolved @react-email/editor/styles/image-bubble-menu.css
resolved @react-email/editor/styles/inspector.css
resolved @react-email/editor/styles/link-bubble-menu.css
resolved @react-email/editor/styles/slash-command.css
resolved @react-email/editor/themes/default.css
status=ok
```

### `pnpm build`

Result: failed for the known Windows upstream demo/playground symlink issue.

Targeted new package builds and upstream editor build completed before the
root build failed.

Failure output:

```text
playground:build: Error: EPERM: operation not permitted, symlink
'C:\Users\Conrad\Documents\GitHub\react-PDF\node_modules\.pnpm\@babel+core@7.29.0\node_modules\@babel\core'
-> 'C:\Users\Conrad\Documents\GitHub\react-PDF\playground\.react-email\node_modules\@babel\core'
demo:build: Error: EPERM: operation not permitted, symlink
'C:\Users\Conrad\Documents\GitHub\react-PDF\node_modules\.pnpm\@babel+core@7.29.0\node_modules\@babel\core'
-> 'C:\Users\Conrad\Documents\GitHub\react-PDF\apps\demo\.react-email\node_modules\@babel\core'
Tasks: 8 successful, 11 total
Failed: playground#build
```

This matches the Windows baseline caveat recorded in earlier phase notes.

### `pnpm lint`

Result: passed with one existing warning.

Key output:

```text
Checked 1148 files in 995ms. No fixes applied.
Found 1 warning.
apps\web\src\app\editor\editor-overrides.css:7:21 lint/complexity/noImportantStyles
```

### `pnpm test`

Result: passed.

Key output:

```text
Tasks: 15 successful, 15 total
Cached: 4 cached, 15 total
Time: 26.446s
```

Selected package summaries:

```text
@asym/pdf-template-schema:test  Test Files 1 passed; Tests 1 passed
@asym/pdf-renderer:test         Test Files 1 passed; Tests 1 passed
@asym/docraptor-client:test     Test Files 1 passed; Tests 1 passed
@asym/pdf-editor:test           Test Files 1 passed; Tests 2 passed
@react-email/editor:test        Test Files 48 passed; Tests 447 passed | 1 skipped
react-email:test                Test Files 37 passed; Tests 215 passed
web:test                        Test Files 3 passed | 2 skipped; Tests 6 passed | 68 skipped
```

### `pnpm dlx @fission-ai/openspec@latest validate build-pdf-document-builder`

Result: passed.

Output:

```text
Change 'build-pdf-document-builder' is valid
```

### `pnpm dlx @fission-ai/openspec@latest validate --all`

Result: passed.

Output:

```text
✓ change/build-pdf-document-builder
Totals: 1 passed, 0 failed (1 items)
- Validating...
```

## Skipped Or Failed Checks

No required targeted package test was skipped.

`pnpm build` failed for the known Windows symlink behavior in upstream
demo/playground `.react-email` builds. Targeted package builds passed and root
`pnpm test` passed.

The test suites include existing skipped cases:

- `pnpm --filter @react-email/editor test:unit`: 1 skipped test.
- `pnpm test`: skipped cases in editor and web test suites.

## Decisions And Tradeoffs Added

- Phase 3 `@asym/*` packages are private boundary shells.
- `@asym/pdf-editor` temporarily wraps public `@react-email/editor` exports
  through explicit `Reference` adapter names.
- Email-oriented docs, demos, playgrounds, starter flows, and sending examples
  remain retained reference surfaces until a later docs/examples phase owns
  replacement.

## Remaining Risks

- The new packages intentionally do not implement PDF schema, renderer,
  DocRaptor, or editor behavior yet.
- `@asym/pdf-editor` depends on `@react-email/editor` until later phases fork
  editor behavior into PDF-first APIs.
- Root `pnpm build` remains blocked on Windows without symlink permissions for
  upstream demo/playground builds.
- Email-oriented docs and examples still exist and remain classified as
  `replace-later`.

## Phase 4 Handoff

Phase 4 can start from:

- `packages/pdf-editor`
- `packages/pdf-renderer`
- `packages/pdf-template-schema`
- `packages/docraptor-client`
- `docs/package-boundaries.md`
- `docs/dep-map.json`

Next phase goal: lock editor fixtures and regression tests while preserving the
original `@react-email/editor` package.
