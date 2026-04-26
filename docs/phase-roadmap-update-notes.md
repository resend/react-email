# Phase Roadmap Update Notes

Status: complete.

Supersession note: this historical Phase 05 roadmap update expanded the plan
from 33 phases to 36 phases. The current canonical plan has since expanded to
42 phases in `openspec/changes/build-pdf-document-builder/tasks.md`.

## Scope Completed

- Updated the canonical OpenSpec task tracker from 33 phases to 36 phases.
- Preserved completed Phases 1-5.
- Set Phase 06, "Create the PDF Template Schema Foundation", as the next
  implementation phase.
- Updated `docs/roadmap.md`, `AGENTS.md`, OpenSpec proposal/design docs, and
  package strategy/boundary references to align with the 36-phase course of
  action.
- Recorded the validation-library research direction for Phase 06:
  - Zod is already present in this workspace through the package catalog and
    `packages/ui`.
  - Valibot is not currently a workspace dependency.
  - Zod should be the Phase 06 default unless a later phase records measured
    bundle-size or runtime reasons to introduce Valibot.
- No product runtime code, package exports, package source, lockfile entries,
  or dependency manifests were changed for this roadmap update.

## Research Notes

- Zod official docs describe Zod as TypeScript-first schema validation with
  static type inference, no external dependencies, browser/Node support, and
  built-in JSON Schema conversion: https://zod.dev/.
- Valibot official docs describe Valibot as a type-safe schema library with a
  modular API and small tree-shaken bundle size: https://valibot.dev/.
- Valibot's JSON Schema guide notes that Valibot does not output JSON Schema
  natively and uses a separate conversion package:
  https://valibot.dev/guides/json-schema/.

## Completed Phases Preserved

- Phase 1: Fork Baseline, Governance, and Product Charter.
- Phase 2: Monorepo Inventory and Isolation Map.
- Phase 3: Package Boundary for `@asym/pdf-editor` and related packages.
- Phase 4: Editor Boundary Isolation, Baseline Fixtures, and Regression
  Harness.
- Phase 5: Package Names, Export Strategy, and Compatibility Policy.

## Phase 06 Source Of Truth

Future Phase 06 agents should start from:

- `AGENTS.md`
- `openspec/project.md`
- `openspec/changes/build-pdf-document-builder/proposal.md`
- `openspec/changes/build-pdf-document-builder/design.md`
- `openspec/changes/build-pdf-document-builder/tasks.md`
- `docs/package-strategy.md`
- `docs/package-boundaries.md`
- `docs/roadmap.md`
- `packages/pdf-template-schema`

## Validation Results

### `git status --short --branch`

Result: passed; worktree contains the expected Phase 05 and roadmap alignment
changes.

```text
## codex/phase-05-package-strategy
 M AGENTS.md
 M docs/decision-log.md
 M docs/package-boundaries.md
 M docs/phase-04-readiness.md
 M docs/phase-4-completion-notes.md
 M docs/roadmap.md
 M openspec/changes/build-pdf-document-builder/design.md
 M openspec/changes/build-pdf-document-builder/proposal.md
 M openspec/changes/build-pdf-document-builder/tasks.md
 M package.json
 M packages/pdf-editor/test/public-entry.spec.tsx
?? docs/package-strategy.md
?? docs/phase-5-completion-notes.md
?? docs/phase-roadmap-update-notes.md
?? scripts/asym-package-strategy-smoke.ts
```

### `Select-String -Path AGENTS.md,docs/*.md,openspec/changes/build-pdf-document-builder/*.md -Pattern "32-phase|33-phase|Phase 31|Phase 33"`

Result at the time: passed; remaining hits were historical old-tracker notes
or then-valid Phase 31/Phase 33 headings in the 36-phase tracker.

```text
docs/decision-log.md:211: Some earlier completion notes mention the previous 33-phase tracker as historical validation output.
docs/phase-5-completion-notes.md:15: 33-phase tracker. A later roadmap cleanup superseded that tracker with the 36-phase course of action.
docs/phase-roadmap-update-notes.md:67: command heading for the reference scan
docs/phase-roadmap-update-notes.md:101: historical old-tracker note
docs/phase-roadmap-update-notes.md:103: then-current Phase 31/Phase 33 note
openspec/changes/build-pdf-document-builder/tasks.md:990: ## Phase 31: Build Security and Tenant Integration Contracts
openspec/changes/build-pdf-document-builder/tasks.md:1050: ## Phase 33: Build `Asymmetric-al/core` Adapter Package and Feature Flag Contract
```

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

### `pnpm lint`

Result: passed with the known existing CSS warning.

```text
> react-email-monorepo@0.0.0 lint C:\Users\Conrad\Documents\GitHub\react-PDF
> biome check

Checked 1155 files in 412ms. No fixes applied.
Found 1 warning.
apps\web\src\app\editor\editor-overrides.css:7:21 lint/complexity/noImportantStyles
```

## Remaining Notes

- Any remaining references to the old 33-phase tracker should be historical
  Phase 5 completion notes, not current planning guidance.
- Current planning references should use the 42-phase tracker. References in
  this file to the 36-phase tracker are preserved as historical Phase 05
  validation output.
