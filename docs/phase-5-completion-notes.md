# Phase 5 Completion Notes

Status: complete with known broad build caveat recorded.

## Scope Completed

- Added `docs/package-strategy.md` with the wrapper-first package migration
  policy.
- Added `pnpm asym:package-strategy-smoke` through
  `scripts/asym-package-strategy-smoke.ts`.
- Added focused `@asym/pdf-editor` test assertions for the Phase 5 wrapper
  compatibility policy.
- Updated `docs/package-boundaries.md`, `docs/decision-log.md`,
  `docs/roadmap.md`, `AGENTS.md`, and OpenSpec planning docs for the
  33-phase tracker. Later roadmap cleanup superseded that tracker with the
  36-phase course of action, and the current canonical tracker now uses 42
  phases.
- Preserved `@react-email/editor` package exports and runtime behavior.
- Did not add a changeset because all `@asym/*` packages remain private and no
  publishable runtime API changed.

## Machine Details

- Date: 2026-04-26 00:34:16 +07:00
- OS: Microsoft Windows NT 10.0.26200.0
- Node: `v24.11.1`
- pnpm: `10.33.0`
- Working branch: `codex/phase-05-package-strategy`
- Base commit: `c60a25fc`

## Validation Results

### `pnpm asym:baseline-smoke`

Result: passed.

```text
asym-baseline-smoke
branch=codex/phase-05-package-strategy
upstreamCanarySha=d064012cd5a3b4817dbe03a932a6d68e83e07abb
editorPackagePath=packages/editor/package.json
editorPackageName=@react-email/editor
editorPackageVersion=1.1.1
packageManager=pnpm@10.33.0+sha512.10568bb4a6afb58c9eb3630da90cc9516417abebd3fabbe6739f0ae795728da1491e9db5a544c76ad8eb7570f5c4bb3d6c637b2cb41bfdcdb47fa823c8649319
status=ok
```

### `pnpm asym:editor-export-smoke`

Result: passed.

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

### `pnpm asym:package-strategy-smoke`

Result: passed.

```text
asym-package-strategy-smoke
verified @react-email/editor version=1.1.1 exports=.,./core,./extensions,./plugins,./ui,./utils,./styles/bubble-menu.css,./styles/button-bubble-menu.css,./styles/image-bubble-menu.css,./styles/inspector.css,./styles/link-bubble-menu.css,./styles/slash-command.css,./themes/default.css
verified @asym/pdf-editor wrapper strategy exports=.,./react-email-compat
verified @asym/pdf-editor private=true
verified @asym/pdf-renderer private=true
verified @asym/pdf-template-schema private=true
verified @asym/docraptor-client private=true
status=ok
```

### `pnpm --filter @react-email/editor build`

Result: passed.

```text
> @react-email/editor@1.1.1 build C:\Users\Conrad\Documents\GitHub\react-PDF\packages\editor
> tsdown

✔ Build complete in 3699ms
✔ Build complete in 3759ms

> @react-email/editor@1.1.1 build:css C:\Users\Conrad\Documents\GitHub\react-PDF\packages\editor
> tsx scripts/copy-css.ts

copied ui/bubble-menu/bubble-menu.css
copied ui/button-bubble-menu/button-bubble-menu.css
copied ui/image-bubble-menu/image-bubble-menu.css
copied ui/inspector/inspector.css
copied ui/link-bubble-menu/link-bubble-menu.css
copied ui/slash-command/slash-command.css
processed ui\themes\default.css
```

Observed existing warnings: `MODULE_TYPELESS_PACKAGE_JSON`, relative dts module
declaration, and tsdown plugin timing warnings.

### `pnpm --filter @react-email/editor test`

Result: passed.

```text
> @react-email/editor@1.1.1 test C:\Users\Conrad\Documents\GitHub\react-PDF\packages\editor
> vitest run

Test Files  49 passed (49)
Tests  450 passed | 1 skipped (451)
Duration  11.49s
```

Observed existing warning: Vite cannot statically analyze the dynamic Prism
language import in `packages/editor/src/extensions/prism-plugin.ts`.

### `pnpm --filter @asym/pdf-editor build`

Result: passed.

```text
> @asym/pdf-editor@0.0.0 build C:\Users\Conrad\Documents\GitHub\react-PDF\packages\pdf-editor
> tsdown

ℹ entry: src/index.ts, src/react-email-compat.ts
✔ Build complete in 1459ms
✔ Build complete in 1465ms
```

### `pnpm --filter @asym/pdf-editor test`

Result: passed after formatting cleanup.

```text
> @asym/pdf-editor@0.0.0 test C:\Users\Conrad\Documents\GitHub\react-PDF\packages\pdf-editor
> vitest run

Test Files  2 passed (2)
Tests  5 passed (5)
Duration  2.67s
```

### `pnpm --filter @asym/pdf-template-schema build`

Result: passed.

```text
> @asym/pdf-template-schema@0.0.0 build C:\Users\Conrad\Documents\GitHub\react-PDF\packages\pdf-template-schema
> tsdown

✔ Build complete in 1006ms
✔ Build complete in 1010ms
```

### `pnpm --filter @asym/pdf-renderer build`

Result: passed.

```text
> @asym/pdf-renderer@0.0.0 build C:\Users\Conrad\Documents\GitHub\react-PDF\packages\pdf-renderer
> tsdown

✔ Build complete in 1029ms
✔ Build complete in 1034ms
```

### `pnpm --filter @asym/docraptor-client build`

Result: passed.

```text
> @asym/docraptor-client@0.0.0 build C:\Users\Conrad\Documents\GitHub\react-PDF\packages\docraptor-client
> tsdown

✔ Build complete in 1000ms
✔ Build complete in 1004ms
```

### `pnpm build`

Result: failed with the known Windows symlink caveat in retained upstream demo
and playground builds.

```text
> react-email-monorepo@0.0.0 build C:\Users\Conrad\Documents\GitHub\react-PDF
> turbo run build

Tasks:    8 successful, 11 total
Cached:    7 cached, 11 total
Time:    5.402s
Failed:    demo#build

demo:build: Error: EPERM: operation not permitted, symlink 'C:\Users\Conrad\Documents\GitHub\react-PDF\node_modules\.pnpm\@babel+core@7.29.0\node_modules\@babel\core' -> 'C:\Users\Conrad\Documents\GitHub\react-PDF\apps\demo\.react-email\node_modules\@babel\core'
playground:build: Error: EPERM: operation not permitted, symlink 'C:\Users\Conrad\Documents\GitHub\react-PDF\node_modules\.pnpm\@babel+core@7.29.0\node_modules\@babel\core' -> 'C:\Users\Conrad\Documents\GitHub\react-PDF\playground\.react-email\node_modules\@babel\core'
```

Targeted editor and `@asym/*` package builds passed before and outside this
broad build failure.

### `pnpm test`

Result: passed.

```text
> react-email-monorepo@0.0.0 test C:\Users\Conrad\Documents\GitHub\react-PDF
> turbo run test

Tasks:    15 successful, 15 total
Cached:    14 cached, 15 total
Time:    5.317s
```

Observed existing warnings include React key warnings in serializer tests, a
Vite dynamic import warning, and expected test stderr from event bus error
handling coverage.

### `pnpm lint`

Result: passed after formatting cleanup.

Cleanup command:

```text
pnpm biome check --write package.json scripts/asym-package-strategy-smoke.ts packages/pdf-editor/test/public-entry.spec.tsx
```

Final output:

```text
> react-email-monorepo@0.0.0 lint C:\Users\Conrad\Documents\GitHub\react-PDF
> biome check

Checked 1155 files in 387ms. No fixes applied.
Found 1 warning.
apps\web\src\app\editor\editor-overrides.css:7:21 lint/complexity/noImportantStyles
```

The lint warning is the known existing `!important` warning and is
non-blocking.

### `pnpm dlx @fission-ai/openspec@latest validate build-pdf-document-builder`

Result: passed.

```text
Change 'build-pdf-document-builder' is valid
```

### `pnpm dlx @fission-ai/openspec@latest validate --all`

Result: passed.

```text
✓ change/build-pdf-document-builder
Totals: 1 passed, 0 failed (1 items)
- Validating...
```

## Skipped Or Failed Checks

No targeted Phase 5 package check was skipped.

`pnpm build` failed because retained upstream `apps/demo` and `playground`
builds attempted to create symlinks under `.react-email` and Windows returned
`EPERM`. This is the previously documented Windows/upstream baseline caveat,
not a Phase 5 package strategy regression.

## Decisions And Tradeoffs Added

- Package migration is wrapper-first.
- `@react-email/editor` remains unchanged during the compatibility window.
- `@asym/pdf-editor` is the future PDF editor import target and currently
  wraps public React Email editor exports.
- No changeset is added while all `@asym/*` packages remain private.
- The Phase 5 package strategy remains valid under the current 42-phase
  tracker; schema foundation is Phase 6.

## Remaining Risks

- `@asym/pdf-editor` still depends on `@react-email/editor` until future
  phases add PDF-native editor behavior.
- Broad `pnpm build` remains blocked on Windows by upstream demo/playground
  symlink behavior.
- Package release policy is documented but not operational until packages
  become publishable.

## Phase 6 Handoff

Phase 6 should create the first real PDF template schema foundation inside
`@asym/pdf-template-schema`.

Source-of-truth files for Phase 6:

- `docs/package-strategy.md`
- `docs/package-boundaries.md`
- `docs/editor-package-isolation.md`
- `docs/phase-5-completion-notes.md`
- `openspec/changes/build-pdf-document-builder/tasks.md`
- `packages/pdf-template-schema`
- `packages/pdf-editor`
- `packages/editor/package.json`
