# Baseline Test Results

Date: 2026-04-25

## Machine Details

- OS: Windows
- Shell: PowerShell
- Local Node observed during Phase 1: `v24.11.1`
- Local pnpm observed during Phase 1: `10.33.0`
- CI reference: Node 22 and Playwright containers in `.github/workflows`

## Baseline Facts

- Fork branch: `canary`
- Fork HEAD at planning time:
  `f53bb0e814f630efd0774240355d97d55046a6c3`
- Upstream React Email canary SHA:
  `d064012cd5a3b4817dbe03a932a6d68e83e07abb`
- Root package: `react-email-monorepo`
- Editor package: `@react-email/editor@1.1.1`
- Package manager: `pnpm@10.33.0`
- Editor Node engine: `>=20.0.0`

## Command Results

### `pnpm install --frozen-lockfile --prefer-offline`

Result: passed, exit code 0.

Relevant output:

```text
Scope: all 14 workspace projects
Lockfile is up to date, resolution step is skipped
Packages: +1572
Progress: resolved 1572, reused 851, downloaded 715, added 1572, done
WARN Failed to create bin at ...\apps\demo\node_modules\.bin\email.
ENOENT: no such file or directory, stat
'...\packages\react-email\dist\cli\index.mjs.EXE'
WARN Failed to create bin at ...\packages\editor\node_modules\.bin\email.
ENOENT: no such file or directory, stat
'...\packages\react-email\dist\cli\index.mjs.EXE'
Ignored build scripts: esbuild@0.27.5, esbuild@0.28.0, keytar@7.9.0,
puppeteer@22.14.0.
Done in 1m 32.4s using pnpm v10.33.0
```

Notes: the repeated `email` bin warnings occur before `react-email` has been
built. The install still exited successfully.

### `pnpm asym:baseline-smoke`

Result: passed, exit code 0.

Output:

```text
> react-email-monorepo@0.0.0 asym:baseline-smoke C:\Users\Conrad\Documents\GitHub\react-PDF
> tsx scripts/asym-baseline-smoke.ts

asym-baseline-smoke
branch=canary
upstreamCanarySha=d064012cd5a3b4817dbe03a932a6d68e83e07abb
editorPackagePath=packages/editor/package.json
editorPackageName=@react-email/editor
editorPackageVersion=1.1.1
packageManager=pnpm@10.33.0+sha512.10568bb4a6afb58c9eb3630da90cc9516417abebd3fabbe6739f0ae795728da1491e9db5a544c76ad8eb7570f5c4bb3d6c637b2cb41bfdcdb47fa823c8649319
status=ok
```

### `pnpm build`

Result: failed, exit code 1.

Relevant output:

```text
> react-email-monorepo@0.0.0 build
> turbo run build

Packages in scope: @benchmarks/tailwind-component, @benchmarks/ui,
@react-email/editor, @react-email/render, @react-email/ui, create-email, demo,
docs, email-dev, playground, react-email, tsconfig, web
Running build in 13 packages
Remote caching disabled

@react-email/render:build: Build complete
react-email:build: Build complete
@react-email/editor:build: Build complete
@react-email/ui:build: Compiled successfully

playground:build: Error: EPERM: operation not permitted, symlink
'C:\Users\Conrad\Documents\GitHub\react-PDF\node_modules\.pnpm\@babel+core@7.29.0\node_modules\@babel\core'
-> 'C:\Users\Conrad\Documents\GitHub\react-PDF\playground\.react-email\node_modules\@babel\core'

demo:build: Error: EPERM: operation not permitted, symlink
'C:\Users\Conrad\Documents\GitHub\react-PDF\node_modules\.pnpm\@babel+core@7.29.0\node_modules\@babel\core'
-> 'C:\Users\Conrad\Documents\GitHub\react-PDF\apps\demo\.react-email\node_modules\@babel\core'

Tasks: 4 successful, 7 total
Failed: playground#build
ELIFECYCLE Command failed with exit code 1.
```

Notes: this is a Windows symlink-permission failure in generated
`.react-email` directories for `playground` and `apps/demo`. The editor,
render, react-email, and UI builds completed before the blocked package.

### `pnpm -r --if-present typecheck`

Result: failed, exit code 1.

Output:

```text
Scope: 13 of 14 workspace projects
packages/react-email typecheck$ tsc --noEmit
packages/react-email typecheck:
src/components/tailwind/e2e/nextjs/emails/vercel-invite-user.tsx(17,8):
error TS2307: Cannot find module 'react-email' or its corresponding type
declarations.
packages/react-email typecheck:
src/components/tailwind/e2e/nextjs/src/app/page.tsx(1,24):
error TS2307: Cannot find module 'react-email' or its corresponding type
declarations.
packages/react-email typecheck:
src/components/tailwind/e2e/vite/emails/vercel-invite-user.tsx(17,8):
error TS2307: Cannot find module 'react-email' or its corresponding type
declarations.
packages/react-email typecheck:
src/components/tailwind/e2e/vite/src/App.tsx(1,24):
error TS2307: Cannot find module 'react-email' or its corresponding type
declarations.
packages/react-email typecheck:
src/components/tailwind/e2e/vite/src/main.tsx(3,17):
error TS5097: An import path can only end with a '.tsx' extension when
'allowImportingTsExtensions' is enabled.
packages/react-email typecheck:
src/components/tailwind/e2e/vite/vite.config.ts(1,19):
error TS2307: Cannot find module '@vitejs/plugin-react' or its corresponding
type declarations.
ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL react-email@6.0.0 typecheck:
`tsc --noEmit`
Exit status 2
```

Notes: this failure is in existing `react-email` Tailwind e2e fixtures, not in
Phase 1 docs or the smoke script.

### `pnpm lint`

Result: passed, exit code 0, with one existing warning.

Output:

```text
> react-email-monorepo@0.0.0 lint
> biome check

Checked 1118 files in 503ms. No fixes applied.
Found 1 warning.
apps\web\src\app\editor\editor-overrides.css:7:21
lint/complexity/noImportantStyles FIXABLE

Avoid the use of the !important style.
6 | .example-shell-content .tiptap {
7 |   min-height: 350px !important;
```

Notes: the warning is in an existing app CSS file and was not changed in Phase
1.

### `pnpm --filter @react-email/editor typecheck`

Result: failed, exit code 1.

Output:

```text
> @react-email/editor@1.1.1 typecheck
> tsc --noEmit

src/extensions/trailing-node.spec.ts(230,20): error TS2339: Property 'content'
does not exist on type 'NodeType<any, any, any, any> |
TextType<MarkType<any, any>>'.
src/plugins/image/extension.spec.tsx(60,56): error TS2345: Argument of type
'EmailNode<Record<string, never>, Record<string, never>>' is not assignable.
src/plugins/image/extension.spec.tsx(81,57): error TS2345: Argument of type
'EmailNode<Record<string, never>, Record<string, never>>' is not assignable.
src/plugins/image/extension.spec.tsx(93,66): error TS2345: Argument of type
... is not assignable.
vitest.config.ts(29,19): error TS2554: Expected 1 arguments, but got 0.
ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL @react-email/editor@1.1.1 typecheck:
`tsc --noEmit`
Exit status 2
```

Notes: this targeted typecheck was added after the recursive typecheck failed.
Failures are in existing editor test/config typing and are not caused by Phase
1 docs or the smoke script.

### `pnpm --filter @react-email/editor test:unit`

Result: passed, exit code 0.

Output:

```text
> @react-email/editor@1.1.1 test:unit
> vitest run --project unit

RUN v4.1.4 C:/Users/Conrad/Documents/GitHub/react-PDF/packages/editor

Test Files 45 passed (45)
Tests 434 passed | 1 skipped (435)
Start at 19:08:33
Duration 8.19s
```

### `pnpm test`

Result: passed, exit code 0.

Relevant output:

```text
> react-email-monorepo@0.0.0 test
> turbo run test

Packages in scope: @benchmarks/tailwind-component, @benchmarks/ui,
@react-email/editor, @react-email/render, @react-email/ui, create-email, demo,
docs, email-dev, playground, react-email, tsconfig, web
Running test in 13 packages
Remote caching disabled

web:test:
Test Files 3 passed | 2 skipped (5)
Tests 6 passed | 68 skipped (74)

react-email:test:
Test Files 37 passed (37)
Tests 215 passed (215)

@react-email/ui:test:
Test Files 11 passed (11)
Tests 27 passed (27)

@react-email/editor:test:
Test Files 48 passed (48)
Tests 447 passed | 1 skipped (448)

Tasks: 10 successful, 10 total
Cached: 4 cached, 10 total
Time: 28.137s
```

Notes: the full test run emitted existing React key warnings, a Vite dynamic
import warning, and an intentional async error-handler log from existing tests.
The command still exited successfully.

### `pnpm dlx @fission-ai/openspec@latest validate build-pdf-document-builder`

Result: passed, exit code 0.

Output:

```text
Change 'build-pdf-document-builder' is valid
```

### `pnpm dlx @fission-ai/openspec@latest validate --all`

Result: passed, exit code 0.

Output:

```text
change/build-pdf-document-builder
Totals: 1 passed, 0 failed (1 items)
Validating...
```

## Skipped Tests

No requested command was skipped. Some existing test suites reported skipped
test cases as part of normal execution:

- `pnpm --filter @react-email/editor test:unit`: 1 skipped case
- `pnpm test`: skipped cases in `web:test` and `@react-email/editor:test`

## Known Risks And Follow-Up Tasks

- Root `pnpm build` is blocked on this Windows machine by symlink permission
  errors in generated `.react-email` directories for `playground` and
  `apps/demo`.
- Recursive typecheck fails in existing `packages/react-email` Tailwind e2e
  fixtures.
- Targeted editor typecheck fails in existing editor specs and Vitest config
  typings.
- `pnpm lint` passes, but reports one existing warning for `!important` in
  `apps/web/src/app/editor/editor-overrides.css`.

## Phase 1 Handoff

Phase 1 produced the baseline docs, research notes, decision log, roadmap,
governance files, and smoke script. The next phase should start with
`docs/roadmap.md` Phase 2 and map the monorepo plus editor dependency graph.
Do not delete upstream React Email packages in Phase 2.
