# Phase 04 Readiness

Status: Go for Phase 4.

This reconciliation was run after Phase 3 merged into `canary`. It is a
planning and documentation alignment pass only. No package source, public
exports, generated dependency-map behavior, CI configuration, or lockfile
content was changed.

## 1. Current Branch And Recent Commit Summary

Implementation branch:

```text
codex/phase-04-readiness
```

Current base:

```text
origin/canary -> 147ee31e04f7163e391c156bd848fe78e7172b56
```

`git status --short`:

```text
 M docs/roadmap.md
 M openspec/changes/build-pdf-document-builder/design.md
 M openspec/changes/build-pdf-document-builder/tasks.md
?? docs/phase-04-readiness.md
```

`git branch --show-current`:

```text
codex/phase-04-readiness
```

`git log --oneline -20`:

```text
147ee31e Merge pull request #3 from Asymmetric-al/codex/phase-3-package-boundaries
65500889 chore: finish phase 3 package boundaries
65e7a9e1 Add Phase 3 package boundaries
a4292677 Record Phase 2 inventory and dependency map
a14f6908 Merge pull request #2 from Asymmetric-al/codex/pdf-builder-docs-governance
a5d03ee3 chore: build editor test dependencies in ci
db2e794c chore: align ci checks with pdf fork
8c528ad6 Document PDF builder fork baseline
f53bb0e8 Merge pull request #1 from Asymmetric-al/codex/openspec-pdf-document-builder
83621b79 Add OpenSpec foundation for PDF document builder
d064012c chore(root): version packages (#3419)
2377e89e fix(editor): emit theme link styles in renderHTML (#3418)
51411758 fix(web): editor text color when the browser's in light mode (#3405)
b36dc3d9 chore(ci): use a github app's token to create bump pull request (#3388)
f990bb21 fix: remaining references to @react-email/components (#3392)
57b8b7aa fix(react-email): e2e tests not running (#3391)
c8243d60 feat: agent discovery (#3387)
a18f07f9 fix(deps): update dependency mintlify to v4.2.521 (#3382)
c9af2678 chore(deps): update dev dependency updates (#3377)
03041048 chore(deps): update tooling updates (#3385)
```

## 2. Recent PRs Reviewed

The bare GitHub CLI command resolves this checkout to upstream
`resend/react-email`, not the fork:

```text
{"nameWithOwner":"resend/react-email","url":"https://github.com/resend/react-email"}
```

`gh pr list --state merged --limit 10`:

```text
3419	chore(root): version packages	changeset-release/canary	MERGED	2026-04-24T16:00:41Z
3418	fix(editor): emit theme link styles in renderHTML	fix/theme-aware-link-mark	MERGED	2026-04-24T14:44:55Z
3405	fix(web): editor text color when the browser's in light mode	fix/text-color-light-mode	MERGED	2026-04-19T21:22:36Z
3392	fix: remaining references to @react-email/components	fix/components-imports	MERGED	2026-04-17T20:29:51Z
3391	fix(react-email): e2e tests not running	chore/remove-components-usage	MERGED	2026-04-17T20:20:21Z
3388	chore(ci): use a github app's token to create bump pull request	chore/github-app-for-version-bump	MERGED	2026-04-17T20:09:05Z
3387	feat: agent discovery	feat/agent-skills-discovery	MERGED	2026-04-17T19:41:58Z
3385	chore(deps): update tooling updates	renovate/tooling-updates	MERGED	2026-04-17T19:10:41Z
3384	feat(docs): allow light theme	feat/light-theme-docs	MERGED	2026-04-17T19:00:29Z
3383	chore(deps): update pnpm to v10.33.0	renovate/pnpm-10.x	MERGED	2026-04-17T18:43:19Z
```

`gh pr list --state open --limit 10`:

```text
3422	fix(cli): add --watch option for dynamic file watching in dev server	actuallyzefe:fix/3412-email-dev-not-watching-messages-files	OPEN	2026-04-25T15:56:54Z
3420	chore(deps): bump postcss from 8.4.31 to 8.5.10	dependabot/npm_and_yarn/postcss-8.5.10	OPEN	2026-04-24T16:08:09Z
3417	feat(editor): add Barebone, Matte, Protocol, Arcane, Studio themes	claude/abstract-email-themes-HOVY7	DRAFT	2026-04-24T10:28:47Z
3411	feat(react-email): add email config support	itsyoboieltr:feat/email-config	OPEN	2026-04-21T22:13:34Z
3410	feat(react-email): render PreviewProps during export	itsyoboieltr:fix/export-preview-props	OPEN	2026-04-21T21:44:41Z
3409	feat(react-email): auto-detect package manager for email build	itsyoboieltr:feat/detect-package-manager	OPEN	2026-04-21T21:19:52Z
3408	chore(docs): fix small typo in readme.md	dielduarte:patch-1	OPEN	2026-04-20T23:52:20Z
3406	fix(render): remove nul bytes when using React 18	rockingskier:patch-1	OPEN	2026-04-20T16:23:08Z
3404	fix(ui): avoid ChatGPT 431 for long Copy for AI prompts	ompathak2004:fix/chatgpt-long-prompt-copy-flow	OPEN	2026-04-19T21:21:00Z
3402	feat(demo): add ecommerce order email templates	imnotannamaria:annamaria/ecommerce-email-templates	OPEN	2026-04-19T18:42:25Z
```

Authoritative fork PR inspection used `--repo Asymmetric-al/react-PDF`.

`gh pr list --repo Asymmetric-al/react-PDF --state merged --limit 10`:

```text
3	chore: add phase 3 package boundaries	codex/phase-3-package-boundaries	MERGED	2026-04-25T15:39:52Z
2	chore: document pdf builder fork baseline	codex/pdf-builder-docs-governance	MERGED	2026-04-25T13:01:15Z
1	[codex] Add OpenSpec foundation for PDF document builder	codex/openspec-pdf-document-builder	MERGED	2026-04-25T11:39:38Z
```

`gh pr list --repo Asymmetric-al/react-PDF --state open --limit 10`:

```text
```

Reviewed fork PRs:

- PR #1, `[codex] Add OpenSpec foundation for PDF document builder`, merged
  2026-04-25 11:49:40 UTC. Added `AGENTS.md`, `openspec/project.md`, the
  active `build-pdf-document-builder` proposal, design, initial task tracker,
  and initial specs. The tracker has since been superseded by the current
  36-phase roadmap.
- PR #2, `chore: document pdf builder fork baseline`, merged
  2026-04-25 13:31:19 UTC. Added Phase 1 docs, governance, baseline smoke
  command, PDF-builder-first repo docs, and CI alignment.
- PR #3, `chore: add phase 3 package boundaries`, merged
  2026-04-25 15:48:41 UTC. Added Phase 2 inventory docs and Phase 3 private
  `@asym/*` package shells. Files changed included `docs/package-boundaries.md`,
  `docs/phase-3-completion-notes.md`, `docs/dep-map.json`,
  `scripts/asym-editor-dep-map.ts`, `scripts/asym-editor-export-smoke.ts`,
  `packages/pdf-editor`, `packages/pdf-renderer`,
  `packages/pdf-template-schema`, `packages/docraptor-client`, package
  readmes, tests, and package manifests.

There were no fork PRs merged after Phase 3 and no open fork PRs at the time of
this reconciliation.

## 3. Phase 3 Artifacts Found

- Private package shells exist for `@asym/pdf-editor`, `@asym/pdf-renderer`,
  `@asym/pdf-template-schema`, and `@asym/docraptor-client`.
- Each package has a root typed boundary export, package README, TypeScript
  config, `tsdown` config, Vitest config, and public-entry smoke test.
- `@asym/pdf-editor/react-email-compat` exists as a temporary adapter over
  public `@react-email/editor` exports.
- `docs/package-boundaries.md` documents package ownership, dependency
  direction, temporary adapters, build/test shape, retained email docs, and
  Phase 4 handoff.
- `docs/phase-3-completion-notes.md` records Phase 3 validation results and
  the known Windows root-build symlink caveat.
- `docs/dep-map.json` and the dependency-map tooling were updated for the new
  package manifests.

## 4. Phase 3 Gaps

- The Phase 3 packages are boundary shells only. They do not implement PDF
  schema, renderer, editor shell, DocRaptor API calls, or storage behavior.
- `@asym/pdf-editor` still depends on the public `@react-email/editor`
  compatibility reference surface.
- The future `@asym/pdf-studio-adapter` package was intentionally not created.
- Email-oriented apps, examples, playgrounds, and package surfaces remain
  retained reference material classified as `replace-later`.
- Root `pnpm build` still has the documented Windows upstream demo/playground
  `.react-email` symlink `EPERM` caveat.

## 5. OpenSpec Alignment Check

Alignment amendments made in this reconciliation:

- `openspec/changes/build-pdf-document-builder/design.md` now reflects that
  Phase 3 private package shells exist while no final PDF behavior exists yet.
- `openspec/changes/build-pdf-document-builder/tasks.md` now marks Phases 1-3
  complete in the canonical tracker and leaves Phase 4 as the next phase.
- `docs/roadmap.md` now points the footer at Phase 4 entry artifacts instead
  of the stale Phase 3 entry point.

`pnpm dlx @fission-ai/openspec@latest validate build-pdf-document-builder`:

```text
Change 'build-pdf-document-builder' is valid
```

`pnpm dlx @fission-ai/openspec@latest validate --all`:

```text
OK change/build-pdf-document-builder
Totals: 1 passed, 0 failed (1 items)
- Validating...
```

`pnpm lint`:

Biome emits styled warning output with Unicode box drawing. The content below
is normalized to ASCII while preserving the command result and warning details.

```text
> react-email-monorepo@0.0.0 lint C:\Users\Conrad\Documents\GitHub\react-PDF
> biome check

Checked 1148 files in 390ms. No fixes applied.
Found 1 warning.
apps\web\src\app\editor\editor-overrides.css:7:21 lint/complexity/noImportantStyles  FIXABLE

  ! Avoid the use of the !important style.

    6 | .example-shell-content .tiptap {
  > 7 |   min-height: 350px !important;
      |                     ^^^^^^^^^^
    8 | }
    9 |

  i This style reverses the cascade logic, and precedence is reversed. This could lead to having styles with higher specificity being overridden by styles with lower specificity.

  i Unsafe fix: Remove the style.

    7 |   min-height: 350px !important;
      |                    -----------
```

The lint warning is the known existing warning and is non-blocking for Phase 4.

## 6. Package And Test Patterns To Preserve

- Keep using `pnpm@10.33.0`, Turbo, Biome, TypeScript, Vitest, Playwright where
  already present, and `tsdown` package builds.
- Keep `packages/editor` and the `@react-email/editor` public exports intact
  while adding baseline fixture coverage.
- Keep Phase 3 `@asym/*` packages private until release policy and stable APIs
  are defined.
- Keep `@asym/pdf-template-schema` shared and free of React, browser UI,
  DocRaptor secrets, tenant storage, auth, queues, and app routes.
- Keep `@asym/docraptor-client` server-only and out of browser packages.
- Keep fixture and snapshot output deterministic: no timestamps, random IDs,
  absolute paths, or unstable object key ordering.
- Add the smallest useful package tests first, then broader checks before each
  phase handoff.

## 7. Phase 4 Go/No-Go Decision

Go.

Phase 4 can safely begin after this reconciliation because:

- Phase 3 is merged into `origin/canary`.
- The canonical OpenSpec tracker now reflects Phases 1-3 as complete and
  Phase 4 as next.
- OpenSpec validation passes for the active change and for all specs.
- Lint passes with only the known pre-existing CSS warning.
- The remaining risks are documented Phase 3 boundary-shell gaps, not blockers
  for adding fixtures and regression harnesses.

## 8. Amendments Needed Before Phase 4

No further amendments are required before Phase 4.

Phase 4 should not isolate packages, rename APIs, delete React Email files, or
implement PDF behavior. It should add baseline fixtures and regression tests
against the current editor and new package boundaries.

## 9. Exact Files Phase 4 Should Treat As Source Of Truth

- `AGENTS.md`
- `openspec/project.md`
- `openspec/changes/build-pdf-document-builder/proposal.md`
- `openspec/changes/build-pdf-document-builder/design.md`
- `openspec/changes/build-pdf-document-builder/tasks.md`
- `openspec/changes/build-pdf-document-builder/specs/**/spec.md`
- `docs/package-boundaries.md`
- `docs/phase-3-completion-notes.md`
- `docs/dep-map.json`
- `docs/editor-dependency-graph.md`
- `docs/public-export-map.md`
- `docs/term-migration-map.md`
- `packages/editor/package.json`
- `packages/pdf-editor`
- `packages/pdf-renderer`
- `packages/pdf-template-schema`
- `packages/docraptor-client`
