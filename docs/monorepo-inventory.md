# Monorepo Inventory

Phase 2 inventories the current React Email fork before package isolation. This
is an isolation map only: no packages are renamed, deleted, or moved in this
phase.

## Baseline

- Fork branch at phase start: `canary`
- Working phase branch: `codex/phase-2-monorepo-inventory`
- Package manager: `pnpm@10.33.0`
- Root package: `react-email-monorepo`
- Editor package: `@react-email/editor@1.1.1`
- Editor engine: `>=20.0.0`
- Dependency fixture: `docs/dep-map.json`
- Generator: `pnpm asym:dep-map`
- Drift check: `pnpm asym:dep-map:check`

## Workspace Shape

`pnpm-workspace.yaml` includes these workspace globs:

| Glob | Role |
|---|---|
| `.github/actions/*` | Local GitHub action packages |
| `apps/*` | Upstream demo, docs, and web apps |
| `benchmarks/*` | Performance benchmarks |
| `packages/*` | Published and support packages |
| `packages/react-email/dev` | React Email dev server package |
| `playground` | Upstream playground app |

The repo also contains email examples under `examples/*`. They are not listed
in the pnpm workspace globs, but Phase 2 inventories them because they are
important email-oriented references that later docs and examples phases must
replace or archive deliberately.

## Package And App Inventory

Classification terms match `docs/editor-dependency-graph.md`:

| Path | Package | Classification | Key scripts |
|---|---|---|---|
| `.` | `react-email-monorepo` | keep | `asym:baseline-smoke`, `asym:dep-map`, `asym:dep-map:check`, `asym:editor-export-smoke`, `build`, `lint`, `test` |
| `apps/demo` | `demo` | replace-later | `build`, `dev`, `export`, `start` |
| `apps/docs` | `docs` | replace-later | `dev` |
| `apps/web` | `web` | replace-later | `build`, `components:build`, `components:dev`, `dev`, `start`, `test`, `typecheck` |
| `benchmarks/tailwind` | `@benchmarks/tailwind-component` | keep | `flamegraph-render-tailwind`, `with-vs-without` |
| `benchmarks/ui` | `@benchmarks/ui` | keep | `cold-email-previews`, `email-previews` |
| `examples/aws-ses` | `react-email-with-aws-ses` | replace-later | `build`, `clean`, `dev` |
| `examples/mailersend` | `react-email-with-mailersend` | replace-later | `build`, `clean`, `dev` |
| `examples/nodemailer` | `react-email-with-nodemailer` | replace-later | `build`, `clean`, `dev` |
| `examples/plunk` | `react-email-with-plunk` | replace-later | `build`, `clean`, `dev` |
| `examples/postmark` | `react-email-with-postmark` | replace-later | `build`, `clean`, `dev` |
| `examples/resend` | `react-email-with-resend` | replace-later | `build`, `dev`, `start` |
| `examples/scaleway/next` | `react-email-with-next-scaleway` | replace-later | `build`, `dev`, `start` |
| `examples/scaleway/node` | `react-email-with-node-scaleway` | replace-later | `build`, `dev` |
| `examples/sendgrid` | `react-email-with-sendgrid` | replace-later | `build`, `clean`, `dev` |
| `packages/create-email` | `create-email` | replace-later | `test` |
| `packages/create-email/template` | `react-email-starter` | replace-later | `build`, `dev`, `export` |
| `packages/editor` | `@react-email/editor` | fork | `build`, `build:css`, `test`, `test:browser`, `test:unit`, `typecheck` |
| `packages/react-email` | `react-email` | wrap | `build`, `test`, `test:e2e`, `typecheck` |
| `packages/react-email/dev` | `email-dev` | keep | `start` |
| `packages/react-email/src/components/tailwind/e2e/nextjs` | `nextjs-with-tailwind` | keep | `build`, `dev`, `preinstall`, `start` |
| `packages/react-email/src/components/tailwind/e2e/vite` | `vite-with-tailwind` | keep | `build`, `dev`, `preinstall`, `preview` |
| `packages/render` | `@react-email/render` | wrap | `build`, `test` |
| `packages/tsconfig` | `tsconfig` | keep | none |
| `packages/ui` | `@react-email/ui` | replace-later | `build`, `dev`, `test`, `caniemail:fetch` |
| `playground` | `playground` | replace-later | `build`, `dev`, `export`, `start` |

## Root Scripts

Root `package.json` now exposes Phase 1 and Phase 2 fork commands:

| Script | Purpose |
|---|---|
| `asym:baseline-smoke` | Prints frozen fork baseline and verifies `packages/editor/package.json` |
| `asym:dep-map` | Writes deterministic `docs/dep-map.json` |
| `asym:dep-map:check` | Fails if `docs/dep-map.json` is stale |
| `asym:editor-export-smoke` | Imports editor JS subpaths and resolves CSS/theme exports after build |
| `build` | Runs `turbo run build` |
| `lint` | Runs `biome check` |
| `lint:fix` | Runs `biome check --write .` |
| `test` | Runs `turbo run test` |
| `test:watch` | Runs `turbo run test:watch` |
| `release`, `version`, `canary:*` | Upstream release/version workflows retained but not productized for this fork yet |

## Turbo Tasks

`turbo.json` defines these task names:

| Task | Notes |
|---|---|
| `build` | Default package build, depends on upstream package builds and postbuilds |
| `postbuild` | Non-cacheable postbuild task |
| `web#build` | Web app build with web env vars |
| `@react-email/ui#build` | Preview UI build |
| `playground#build` | Playground build output under `.react-email` |
| `demo#build` | Demo build, depends on UI and `react-email` |
| `react-email#build` | React Email package build |
| `lint` | Task shell for package-level lint when present |
| `test` | Package test task, depends on upstream builds |
| `test:e2e` | E2E task, depends on upstream builds |
| `test:watch` | Watch mode, not cached |
| `dev` | Persistent dev task |
| `//#format`, `//#format:check` | Root-scoped formatting placeholders retained from upstream |

## Test Entry Points

The editor package uses `packages/editor/vitest.config.ts`:

- Unit project: `vitest run --project unit`, `happy-dom`, includes
  `src/**/*.spec.ts` and `src/**/*.spec.tsx`, excludes browser specs.
- Browser project: `vitest run --project browser`, Playwright Chromium, includes
  `src/**/*.browser.spec.tsx`, and stubs `@react-email/render` because that
  package has Node-only dependencies.

Phase 2 records 59 editor test/snapshot entries in `docs/dep-map.json`. The
important groups are:

- Core serializer and utility specs under `packages/editor/src/core`.
- Extension serializer snapshots under `packages/editor/src/extensions`.
- Theming, image, inspector, bubble menu, slash command, and style utility
  specs under `packages/editor/src/plugins`, `packages/editor/src/ui`, and
  `packages/editor/src/utils`.
- Browser integration specs under `packages/editor/src/__tests__`.

Other workspace tests remain upstream-shaped:

- `packages/react-email` has package tests, e2e tests, and typecheck scripts.
- `packages/render` has build and test scripts.
- `packages/ui` has build, dev, and test scripts.
- `apps/web` has test and typecheck scripts.
- `packages/create-email` has a package test script.

## Docs, Examples, And Scripts

`docs/dep-map.json` found 139 repo references to the current editor names and
APIs. The most important areas are:

- `apps/docs/editor/**`: public docs for `EmailEditor`, `EmailNode`,
  `EmailMark`, `EmailTheming`, `composeReactEmail`, UI primitives, and editor
  CSS/theme imports.
- `packages/editor/src/**`: source and tests using the current email naming.
- `docs/**`: Phase 1 and Phase 2 fork docs explaining why those names are
  retained temporarily.
- `packages/react-email/CHANGELOG.md`: upstream release history that mentions
  `@react-email/editor`.
- `scripts/asym-baseline-smoke.ts`: Phase 1 baseline script that verifies the
  editor package name.

The `examples/*`, `apps/demo`, `apps/web`, `packages/create-email`,
`packages/ui`, and `playground` surfaces are email-oriented. They are retained
for now and classified as `replace-later`, not removed in Phase 2.

## Known Baseline Caveats

Phase 1 already recorded Windows baseline caveats in
`docs/baseline-test-results.md`:

- Root `pnpm build` can fail on Windows when upstream demo/playground
  `.react-email` symlink behavior hits `EPERM`.
- Recursive typecheck and targeted editor typecheck have existing upstream
  typing failures around editor serializer subclassing.
- Targeted editor unit tests, root tests, lint, and OpenSpec validation passed
  in the Phase 1 baseline notes.

Phase 2 does not fix those caveats. It adds deterministic inventory and export
checks so later package-boundary work can detect drift before moving code.

## Phase 3 Entry Point

Phase 3 should use this inventory to create package boundaries for
`@asym/pdf-editor`, `@asym/pdf-renderer`, and related packages while leaving
the existing `@react-email/editor` package intact until compatibility shims are
explicitly designed.
