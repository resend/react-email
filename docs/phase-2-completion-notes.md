# Phase 2 Completion Notes

Status: complete.

## Scope Completed

- Added deterministic editor dependency map tooling.
- Added editor public export smoke tooling.
- Added `docs/dep-map.json` as the checked dependency fixture.
- Added compatibility CSS wrapper files for declared editor CSS export subpaths
  that did not previously build to files.
- Added monorepo inventory, editor dependency graph, public export map, and
  term migration map.
- No packages were renamed, deleted, or moved.
- No runtime package APIs were changed.

## Machine Details

- Date: 2026-04-25
- OS: Microsoft Windows 10.0.26200
- Architecture: X64
- Node: `v24.11.1`
- pnpm: `10.33.0`
- Branch: `codex/phase-2-monorepo-inventory`
- Baseline HEAD before Phase 2 edits:
  `a14f6908db118b05d6f50d73017a945e56b43085`

## Baseline Facts

- Fork branch at phase start: `canary`
- Working phase branch: `codex/phase-2-monorepo-inventory`
- Upstream React Email baseline from Phase 1:
  `d064012cd5a3b4817dbe03a932a6d68e83e07abb`
- Editor package: `@react-email/editor@1.1.1`
- Package manager: `pnpm@10.33.0`
- Local Node in Phase 1: `v24.11.1`
- CI target from Phase 1: Node 22
- Editor engine: `>=20.0.0`

## Validation Results

### `pnpm install --frozen-lockfile --prefer-offline`

Result: passed.

Key output:

```text
Scope: all 14 workspace projects
Lockfile is up to date, resolution step is skipped
Already up to date
Done in 3.2s using pnpm v10.33.0
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
status=ok
```

### `pnpm asym:dep-map:check`

Result: passed.

Key output:

```text
docs/dep-map.json is current.
```

### `pnpm --filter @react-email/render build`

Result: passed.

Key output:

```text
> @react-email/render@2.0.7 build
> tsdown
Build complete in 2864ms
```

Observed warnings: Node `MODULE_TYPELESS_PACKAGE_JSON` warning for
`packages/render/tsdown.config.ts`.

### `pnpm --filter react-email build`

Result: passed.

Key output:

```text
> react-email@6.0.0 build
> tsdown
Build complete in 2624ms
```

Observed warnings: tsdown dependency bundling hints.

### `pnpm --filter @react-email/editor build`

Result: passed after adding CSS compatibility wrappers.

Key output:

```text
> @react-email/editor@1.1.1 build
> tsdown
Build complete in 5130ms
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

Observed warnings: Node `MODULE_TYPELESS_PACKAGE_JSON`, relative dts module
declaration warnings for `./event-bus`, and tsdown/rolldown plugin timing
warnings.

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

Implementation iterations:

- First run failed because top-level await is not supported when `tsx` compiles
  the root script as CJS. Fixed by wrapping the smoke logic in `main()`.
- Second run imported all JS subpaths but failed resolving
  `button-bubble-menu.css`. Fixed by adding wrapper CSS files for the declared
  button, image, and link bubble menu CSS exports.

### `pnpm --filter @react-email/editor test:unit`

Result: passed.

Key output:

```text
Test Files  45 passed (45)
Tests       434 passed | 1 skipped (435)
Duration    10.45s
```

### `pnpm lint`

Result: passed with one warning.

Key output:

```text
Checked 1123 files in 660ms. No fixes applied.
Found 1 warning.
```

Warning:

```text
apps\web\src\app\editor\editor-overrides.css:7:21 lint/complexity/noImportantStyles
Avoid the use of the !important style.
```

The generated `docs/dep-map.json` is excluded from Biome formatting so
`scripts/asym-editor-dep-map.ts` owns deterministic fixture output.

### `pnpm test`

Result: passed.

Key output:

```text
Tasks:    10 successful, 10 total
Cached:   0 cached, 10 total
Time:     56.108s
```

Selected package summaries:

```text
@react-email/render:test  Test Files 7 passed; Tests 51 passed
@react-email/editor:test  Test Files 48 passed; Tests 447 passed | 1 skipped
web:test                  Test Files 3 passed | 2 skipped; Tests 6 passed | 68 skipped
create-email:test         Test Files 1 skipped; Tests 4 skipped
```

Observed warnings: existing Vitest mock-hoisting warnings in render tests,
Vite dynamic import warnings in editor/web tests, expected test stderr for
event-bus async error handling, React key warnings in serializer tests, and
tsdown plugin timing warnings.

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
change/build-pdf-document-builder
Totals: 1 passed, 0 failed (1 items)
- Validating...
```

## Skipped Or Failed Checks

No required command was skipped.

The test suites contain existing skipped cases:

- `pnpm --filter @react-email/editor test:unit`: 1 skipped test.
- `pnpm test`: skipped cases in `create-email:test`, `web:test`, and
  `@react-email/editor:test`.

## Known Risks

- Phase 1 documented Windows baseline build/typecheck caveats. Phase 2 does
  not resolve those caveats.
- `apps/docs/editor/**` still documents email-oriented editor APIs. Phase 2
  maps those terms but does not rewrite upstream docs.
- `react-email` remains a direct dependency of `@react-email/editor`; Phase 3
  and Phase 6 must introduce package and serializer boundaries before removal.
- `pnpm lint` still reports one warning in the upstream web app CSS for an
  `!important` style.

## Phase 3 Handoff

Phase 3 should start from:

- `docs/monorepo-inventory.md`
- `docs/editor-dependency-graph.md`
- `docs/public-export-map.md`
- `docs/term-migration-map.md`
- `docs/dep-map.json`

Next phase goal: create new package boundaries while leaving the original
`@react-email/editor` package intact.
