# Tasks

## Working Rules For Every Phase

- [ ] Inspect the repo before editing. Do not assume file paths.
- [ ] Identify the current roadmap phase before changing files.
- [ ] Keep changes scoped to the phase and its stated primary output.
- [ ] Do not delete upstream React Email code until the phase explicitly says
      to do so.
- [ ] Use TypeScript with strict types. Avoid `any` unless the phase requires a
      compatibility boundary and the value is narrowed immediately.
- [ ] Add or update tests in every implementation phase.
- [ ] Run the smallest useful test set first, then run broader tests before
      completion.
- [ ] Write docs for public APIs and cross-phase decisions.
- [ ] Treat DocRaptor API keys as server-only secrets.
- [ ] Treat donor and financial data as private by default.
- [ ] Keep output deterministic. Rendering snapshots should not change due to
      object key order, timestamps, or random IDs.
- [ ] Prefer small composable packages and adapter interfaces over
      app-specific imports.
- [ ] Do not introduce `ds.shadcn` unless a phase explicitly reopens the
      canvas-mode decision.
- [ ] Do not treat browser preview as production PDF fidelity.
- [ ] Do not use arbitrary JavaScript in template logic.
- [ ] Do not store raw HTML as the only template source of truth.
- [ ] Leave handoff notes that state scope completed, checks run, known gaps,
      and the next phase entry point.

## 42-Phase Course of Action

| Phase | Name | Status | Primary Output |
|---:|---|---|---|
| 1 | Fork Baseline, Governance, and Product Charter | Complete | `docs/asym-product-charter.md`, `docs/research-basis.md` |
| 2 | Monorepo Inventory and Isolation Map | Complete | `docs/monorepo-inventory.md`, `docs/editor-dependency-graph.md` |
| 3 | Package Boundary for @asym/pdf-editor and Related Packages | Complete | `packages/pdf-editor`, `packages/pdf-renderer` |
| 4 | Editor Boundary Isolation, Baseline Fixtures, and Regression Harness | Complete | `packages/pdf-editor/test/fixtures`, `packages/pdf-renderer/test/fixtures` |
| 5 | Package Names, Export Strategy, and Compatibility Policy | Complete | `docs/package-strategy.md`, `scripts/asym-package-strategy-smoke.ts` |
| 6 | Create the PDF Template Schema Foundation | Complete | `packages/pdf-template-schema/src`, `packages/pdf-template-schema/test` |
| 7 | Add Compatibility Fixtures and Regression Harness | Complete | `packages/editor/src`, `packages/editor/test` |
| 8 | Rename Public Concepts Safely from Email to Document | Complete | `@asym/pdf-editor` compatibility exports, editor docs |
| 9 | Build the Document Serializer Foundation | Complete | `packages/pdf-renderer/src/compose-pdf-document-html.ts` |
| 10 | Build the Print HTML Shell and Page Model | Complete | `packages/pdf-renderer/src/print-shell.ts` |
| 11 | Build the DocRaptor Client Package | Complete | `packages/docraptor-client/src` |
| 12 | Build Browser Preview and DocRaptor Preview Strategy | Next | `packages/pdf-renderer/src/preview`, `packages/pdf-editor/src/preview` |
| 13 | Build the Typed Variable Registry | Not started | `packages/pdf-template-schema/src/variables` |
| 14 | Build Variable Resolution, Formatter, and Fallback System | Not started | `packages/pdf-template-schema/src/formatters`, `packages/pdf-renderer/src/variables` |
| 15 | Build the Variable Chip Editor Extension | Not started | `packages/pdf-editor/src/extensions/variable` |
| 16 | Build Conditional Section Engine and Editor Extension | Not started | `packages/pdf-editor/src/extensions/conditional-section`, `packages/pdf-renderer/src/conditions` |
| 17 | Build Repeater Extension and Scoped Data Resolver | Not started | `packages/pdf-editor/src/extensions/repeater`, `packages/pdf-renderer/src/repeaters` |
| 18 | Build Financial Data Table Block | Not started | `packages/pdf-editor/src/extensions/data-table`, `packages/pdf-renderer/src/data-table` |
| 19 | Build Totals, Subtotals, Grouping, and Summary Blocks | Not started | `packages/pdf-renderer/src/calculations`, `packages/pdf-template-schema/src/calculations` |
| 20 | Build Page Break and Keep-Together Controls | Not started | `packages/pdf-editor/src/extensions/page-flow`, `packages/pdf-renderer/src/page-flow` |
| 21 | Build Header and Footer System | Not started | `packages/pdf-editor/src/extensions/header-footer`, `packages/pdf-renderer/src/header-footer` |
| 22 | Build Image and Asset Pipeline | Not started | `packages/pdf-editor/src/extensions/media`, `packages/pdf-renderer/src/assets` |
| 23 | Build Branding and Theme System | Not started | `packages/pdf-template-schema/src/brand`, `packages/pdf-renderer/src/theme` |
| 24 | Build Starter Templates and Golden Fixtures | Not started | `test/golden-fixtures`, `packages/pdf-template-schema/test/fixtures` |
| 25 | Build Preflight Validation | Not started | `packages/pdf-renderer/src/preflight` |
| 26 | Build Render Logs, Artifact Metadata, and Audit Contracts | Not started | `packages/pdf-template-schema/src/audit`, `packages/pdf-renderer/src/artifacts` |
| 27 | Build Template Lifecycle, Versioning, and Publishing Contracts | Not started | `packages/pdf-template-schema/src/template-lifecycle`, adapter contracts |
| 28 | Build Batch Generation Framework | Not started | `packages/pdf-renderer/src/batch`, `packages/pdf-template-schema/src/batch` |
| 29 | Build Async DocRaptor Rendering and Retry System | Not started | `packages/docraptor-client/src/async`, `packages/pdf-renderer/src/batch` |
| 30 | Build Playwright Local Fallback and Test Renderer | Not started | `packages/pdf-renderer/src/local-renderer` |
| 31 | Build Accessibility, Metadata, and PDF Profile Support | Not started | `packages/pdf-template-schema/src/metadata`, `packages/docraptor-client/src/pdf-options` |
| 32 | Build Security and Tenant Integration Contracts | Not started | `packages/pdf-template-schema/src/security`, adapter interfaces |
| 33 | Build Unlayer Migration and Coexistence Path | Not started | `packages/pdf-editor/src/migration/unlayer`, `docs/unlayer-migration.md` |
| 34 | Build `Asymmetric-al/core` Adapter Package and Feature Flag Contract | Not started | future adapter package or `packages/pdf-editor/src/core-adapter` |
| 35 | Build Documentation, Playground, and Developer Examples | Not started | `docs`, `examples/pdf-editor`, playground updates |
| 36 | Build Performance, Load, and Large Document Tests | Not started | `benchmarks`, opt-in performance tests |
| 37 | Build Release, Versioning, and API Stability Review | Not started | release notes, API/export review, schema version policy |
| 38 | Run Security, Secret, and Browser Bundle Audit | Not started | browser/server boundary and secret-safety checks |
| 39 | OpenSpec Current-State Reconciliation and Archive Readiness | Not started | aligned OpenSpec docs and archive-readiness notes |
| 40 | End-to-End Package Validation with Mocked Production Flows | Not started | mocked package-level production-flow tests |
| 41 | `Asymmetric-al/core` Cutover Playbook and Integration PR Plan | Not started | `docs/core-cutover-playbook.md` |
| 42 | Production Hardening, Launch Readiness, and Final Package Sign-Off | Not started | `docs/final-package-readiness.md` |

## Phase 01: Fork Baseline, Governance, and Product Charter

### Purpose

Establish the durable product charter, research basis, governance rules, and
baseline facts before product implementation begins.

### Primary output

- `docs/asym-product-charter.md`
- `docs/research-basis.md`

### Tasks

- [x] Read `AGENTS.md`, `openspec/project.md`, and the active OpenSpec change.
- [x] Record branch, package manager, scripts, package names, editor exports,
      and upstream React Email fork state.
- [x] Write the product charter and research basis without claiming
      implementation exists.
- [x] Add governance docs, maintainers/CODEOWNERS, and baseline validation
      notes.

### Validation

- [x] Confirm charter and research notes cite real repo files and current
      OpenSpec docs.
- [x] Run safe documentation checks available in the repo.

### Handoff output

- [x] Governance and charter notes with the next phase entry point.

## Phase 02: Monorepo Inventory and Isolation Map

### Purpose

Map the current React Email monorepo and identify how PDF builder work can be
isolated without breaking upstream package behavior.

### Primary output

- `docs/monorepo-inventory.md`
- `docs/editor-dependency-graph.md`
- `docs/public-export-map.md`
- `docs/term-migration-map.md`
- `docs/dep-map.json`

### Tasks

- [x] Inventory workspaces, apps, packages, scripts, build tooling, docs,
      tests, and examples.
- [x] Map `packages/editor` imports, exports, dependencies, UI boundaries,
      plugins, theming, image upload, and serializer paths.
- [x] Classify email-only assumptions as keep, wrap, fork, replace later,
      remove later, or unknown.

### Validation

- [x] Confirm dependency graph distinguishes browser, server, shared, and test
      concerns.
- [x] Add deterministic dependency-map and export-smoke tooling.

### Handoff output

- [x] Monorepo isolation map and dependency graph for package-boundary work.

## Phase 03: Package Boundary for @asym/pdf-editor and Related Packages

### Purpose

Create the first `@asym/*` package shells while preserving the current fork.

### Primary output

- `packages/pdf-editor`
- `packages/pdf-renderer`
- `packages/pdf-template-schema`
- `packages/docraptor-client`
- `docs/package-boundaries.md`

### Tasks

- [x] Define package ownership, runtime boundaries, and allowed dependency
      direction.
- [x] Create private package shells with typed boundary exports and package
      readmes.
- [x] Preserve existing `@react-email/editor` exports and compatibility paths.

### Validation

- [x] Package builds and workspace discovery still work after package shells
      are added.
- [x] Dependency directions remain acyclic and documented.

### Handoff output

- [x] Package boundary notes and initial package ownership map.

## Phase 04: Editor Boundary Isolation, Baseline Fixtures, and Regression Harness

### Purpose

Capture and isolate editor and renderer baseline behavior before deeper
PDF-first changes.

### Primary output

- `docs/editor-package-isolation.md`
- `packages/editor/src/boundary`
- `packages/pdf-editor/test/fixtures`
- `packages/pdf-renderer/test/fixtures`

### Tasks

- [x] Add internal legacy editor boundary metadata without public package
      exports.
- [x] Add package boundary tests that guard selected current editor surfaces.
- [x] Add deterministic baseline fixtures for current editor JSON and render
      expectations.

### Validation

- [x] Fixture tests pass and fail on intentional serializer changes.
- [x] Snapshot outputs are deterministic across repeated runs.

### Handoff output

- [x] Baseline regression harness and fixture update notes.

## Phase 05: Package Names, Export Strategy, and Compatibility Policy

### Purpose

Define how the repo moves from React Email package names to PDF-first package
names without a dangerous big-bang rename.

### Primary output

- `docs/package-strategy.md`
- `scripts/asym-package-strategy-smoke.ts`

### Tasks

- [x] Document current names, target names, compatibility exports, long-term
      APIs, and private internals.
- [x] Choose the wrapper-first path: keep `@react-email/editor` unchanged and
      use private `@asym/pdf-editor` as the future import target.
- [x] Document changeset, release, and future `Asymmetric-al/core`
      consumption policy.
- [x] Add deterministic package-strategy smoke coverage.

### Validation

- [x] `@react-email/editor` export surfaces remain unchanged.
- [x] `@asym/pdf-editor` wrapper and `react-email-compat` entry points remain
      discoverable.
- [x] All `@asym/*` package shells remain private.

### Handoff output

- [x] Package strategy policy, smoke command, and Phase 06 schema handoff
      notes.

## Phase 06: Create the PDF Template Schema Foundation

### Purpose

Create versioned template schema types that all later editor, renderer,
DocRaptor, batch, and adapter work can share.

### Primary output

- `packages/pdf-template-schema/src`
- `packages/pdf-template-schema/test`
- Schema fixtures for donation receipt, annual giving statement, financial
  report, invoice, and certificate.

### Tasks

- [x] Use Zod by default for runtime validation and inferred TypeScript types
      because it is already in the workspace catalog and supports JSON Schema
      conversion; document any measured reason before choosing Valibot.
- [x] Define runtime schemas and aligned TypeScript types for
      `DocumentTemplateV1`, `DocumentPageSettings`, `DocumentTheme`,
      `VariableDefinition`, `VariableReference`, `DataBinding`,
      `ConditionalRule`, `RepeaterBinding`, `TableBinding`, `AssetReference`,
      `RenderRequest`, `RenderResult`, `RenderWarning`, `RenderError`,
      `RenderJobV1`, `BatchRunV1`, `DocumentArtifact`, and `AuditEvent`.
- [x] Add schema version behavior, page setting defaults, nonprofit document
      categories, and first product fixtures.
- [x] Keep the package free of React UI, browser-only code, DocRaptor secrets,
      and app-specific dependencies.

### Validation

- [x] Run `pnpm --filter @asym/pdf-template-schema typecheck`.
- [x] Run `pnpm --filter @asym/pdf-template-schema test`.
- [x] Run `pnpm --filter @asym/pdf-template-schema build`.
- [x] Run `pnpm lint`.
- [x] Tests cover valid template parsing, invalid template rejection, page
      setting defaults, variable validation, version field behavior, and
      schema fixtures.

### Handoff output

- [x] Schema API docs, fixtures, validation-library decision note, and Phase
      07 compatibility-harness entry point.

## Phase 07: Add Compatibility Fixtures and Regression Harness

### Purpose

Protect current React Email editor behavior before changing names,
serializers, or core extensions.

### Primary output

- Expanded `@react-email/editor` compatibility fixtures and snapshots.

### Tasks

- [x] Add fixtures for paragraph, heading, link, image, button, two-column
      layout, table, themed document, and current custom extension examples.
- [x] Test editor JSON shape, current HTML export, `composeReactEmail`,
      extension registration, package exports, and CSS/theme import
      availability.
- [x] Avoid changing output unless the harness reveals a bug that OpenSpec
      allows fixing.

### Validation

- [x] Run `pnpm --filter @react-email/editor test`.
- [x] Run `pnpm --filter @react-email/editor typecheck`.
- [x] Run `pnpm --filter @react-email/editor build`.
- [x] Run `pnpm lint`.

### Handoff output

- [x] Compatibility fixture update notes and refactor safety summary.

## Phase 08: Rename Public Concepts Safely from Email to Document

### Purpose

Introduce document/PDF-first names as wrappers or aliases without breaking
current imports.

### Primary output

- Compatibility aliases or wrappers in the chosen package surfaces.

### Tasks

- [x] Add safe document/PDF-first names, such as `PdfEditor` or
      `DocumentEditor`, only beside existing names.
- [x] Keep `EmailEditor`, `composeReactEmail`, `EmailNode`, `EmailMark`, UI
      exports, and CSS exports working.
- [x] Document every compatibility decision and the migration window.

### Validation

- [x] Tests prove old imports still work, new imports work, generated types are
      correct, and build output contains intended exports.
- [x] Run `pnpm --filter @react-email/editor test`.
- [x] Run `pnpm --filter @react-email/editor typecheck`.
- [x] Run `pnpm --filter @react-email/editor build`.
- [x] Run `pnpm lint`.

### Handoff output

- [x] Compatibility alias docs and import-path migration notes.

## Phase 09: Build the Document Serializer Foundation

### Purpose

Create a PDF document serializer path separate from `composeReactEmail`.

### Primary output

- `packages/pdf-renderer/src/compose-pdf-document-html.ts`

### Tasks

- [x] Implement a serializer that walks structured editor/template JSON,
      resolves registered document nodes and marks, and returns deterministic
      HTML fragments or body output.
- [x] Return structured CSS requirements, render warnings, asset references,
      variable usage, and unsupported node warnings.
- [x] Do not connect DocRaptor and do not implement a string-replacement
      engine.

### Validation

- [x] Tests cover paragraph, heading, links, images, columns, table where
      supported, unknown node warning, style merge order, empty document, and
      invalid input.
- [x] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [x] Serializer API docs and fixture coverage summary.

## Phase 10: Build the Print HTML Shell and Page Model

### Purpose

Add page settings and deterministic print CSS generation that DocRaptor can
render.

### Primary output

- `packages/pdf-renderer/src/print-shell.ts`
- Page-model CSS helpers.

### Tasks

- [x] Support Letter, A4, Legal, custom sizes, portrait, landscape, margins,
      document title, print media, base CSS variables, page breaks,
      keep-together classes, repeated table header CSS, and page number
      placeholders.
- [x] Drive page settings from the schema and keep output deterministic.
- [x] Do not call DocRaptor.

### Validation

- [x] Tests cover page sizes, orientations, margins, invalid custom sizes,
      title escaping, print CSS snapshots, and page break output.
- [x] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [x] Print shell docs and DocRaptor compatibility notes.

## Phase 11: Build the DocRaptor Client Package

### Purpose

Add a server-only DocRaptor client with safe configuration, sync rendering,
async rendering, polling, and error normalization.

### Primary output

- `packages/docraptor-client/src`

### Tasks

- [x] Implement server-only client APIs for test mode, production mode,
      document content, base URL, print media, sync render, async job creation,
      status polling, timeouts, abort signals, and normalized errors.
- [x] Keep API keys out of browser bundles and tests.
- [x] Support app-layer idempotency metadata without requiring DocRaptor to
      provide a first-class idempotency key.

### Validation

- [x] Mock tests cover payloads, missing API key, test mode, base URL, sync
      success/error, async success/polling, timeout handling, and browser import
      guards where practical.
- [x] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [x] DocRaptor client API docs and error taxonomy.

## Pre-Phase 12: Post-Phase-11 Reconciliation, OpenSpec Alignment, and Phase Plan Update

### Purpose

Verify the repository after the Phase 11 merge before any Phase 12 preview
implementation begins.

### Primary output

- `docs/pre-phase-12-reconciliation.md`
- Updated README, roadmap, package strategy, package boundary, decision log,
  term migration, historical phase notes, AGENTS routing, and OpenSpec
  proposal/design/task notes.

### Tasks

- [x] Confirm the active phase is Pre-Phase 12.
- [x] Re-read `AGENTS.md`, `openspec/project.md`, the active OpenSpec change,
      and prior phase notes.
- [x] Inspect local merge history after Phase 11.
- [x] Record that `gh` was unavailable, so live PR body/comment/review
      inspection was not claimed.
- [x] Identify documentation drift after Phase 11.
- [x] Update documentation and OpenSpec tracker without implementing Phase 12
      product code.
- [x] Expand the remaining phase plan to the current 42-phase roadmap.
- [x] Keep Phase 12 marked as `Next`.

### Validation

- [x] Run available non-mutating validation.
- [x] Record blocked validation honestly when local package-manager tooling is
      unavailable.

### Handoff output

- [x] Reconciliation note with active phase, scope completed, checks run,
      known gaps, and Phase 12 guardrails.

## Phase 12: Build Browser Preview and DocRaptor Preview Strategy

### Purpose

Create preview infrastructure for fast browser preview and true DocRaptor test
preview.

### Primary output

- Preview package-layer APIs in renderer/editor boundaries.

### Tasks

- [ ] Add browser preview from generated print HTML/CSS and DocRaptor preview
      through server-side test mode.
- [ ] Return preview result types with success, warnings, errors, render ID,
      generated HTML/CSS snapshots, PDF bytes or URL, and render timing.
- [ ] Mark browser preview as non-final fidelity and ensure preview cannot
      mutate templates.

### Validation

- [ ] Tests cover browser preview generation, DocRaptor preview payload,
      warning/error flow, no API key exposure, and read-only preview behavior.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Preview architecture docs and caveats.

## Phase 13: Build the Typed Variable Registry

### Purpose

Define typed variables for nonprofit, ministry, donor, receipt, invoice, and
financial-report document workflows.

### Primary output

- `packages/pdf-template-schema/src/variables`

### Tasks

- [ ] Create registry domains for organization, recipient, donation,
      document, missionary, tax receipt, financial report, statement, invoice,
      asset, and computed values.
- [ ] Define key, label, group, description, type, sample value, required flag,
      fallback behavior, formatter hints, privacy classification, and future
      source-path metadata.
- [ ] Add deterministic sample-data generation and fixtures for donation
      receipt, tax receipt, annual statement, financial report, invoice, and
      certificate.
- [ ] Keep the registry React-free so schema, renderer, preview, preflight,
      and future core adapters can import it safely.

### Validation

- [ ] Tests cover registry validation, duplicate rejection, required fields,
      sample data generation, group lookup, and unknown variable detection.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Variable registry exports, sample-data behavior, and merge tag domain
      notes.

## Phase 14: Build Variable Resolution, Formatter, and Fallback System

### Purpose

Resolve variable values from data contexts and format them consistently for
receipts, statements, invoices, and reports without React dependencies.

### Primary output

- Shared resolver, formatter, and fallback modules.

### Tasks

- [ ] Support variable lookup from data contexts, nested source paths,
      required/optional behavior, fallback values, missing value diagnostics,
      and type validation.
- [ ] Support currency, date, date range, number, percentage, address, receipt
      number, fiscal period, boolean labels, image URL validation, and
      deterministic output.
- [ ] Do not evaluate arbitrary JavaScript from templates. Computed behavior
      must remain structured and deterministic.

### Validation

- [ ] Tests cover string resolution, nested source paths, optional fallback,
      missing required errors, USD currency, dates/ranges, fiscal years,
      addresses, percentages, booleans, image URLs, invalid types, unknown
      formatters, and React-free imports.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Resolver, formatter, and fallback behavior docs.

## Phase 15: Build the Variable Chip Editor Extension

### Purpose

Represent variables inside the editor as protected structured inline nodes
backed by the registry and resolver.

### Primary output

- `packages/pdf-editor/src/extensions/variable`

### Tasks

- [ ] Add structured inline variable nodes that reference registry keys,
      render visibly, serialize to JSON, deserialize from JSON, and preview
      sample/fallback values.
- [ ] Add command/API insertion and slash command integration only if it fits
      current UI patterns.
- [ ] Detect missing or broken variable keys and prevent accidental key edits
      inside the chip.

### Validation

- [ ] Tests cover insertion, serialization, deserialization, chip rendering,
      sample preview value rendering, unknown key warnings, fallback display,
      keyboard behavior, copy/paste behavior where practical, and stable
      package exports.
- [ ] Run `pnpm --filter @react-email/editor test`, `pnpm build`, and
      `pnpm lint`.

### Handoff output

- [ ] Variable chip extension docs and fixture notes.

## Phase 16: Build Conditional Section Engine and Editor Extension

### Purpose

Allow sections to show or hide based on structured data rules without
arbitrary JavaScript.

### Primary output

- `packages/pdf-editor/src/extensions/conditional-section`
- `packages/pdf-renderer/src/conditions`

### Tasks

- [ ] Support structured operators: exists, not_exists, equals, not_equals,
      greater_than, greater_than_or_equal, less_than, less_than_or_equal,
      contains, not_contains, is_empty, is_not_empty, in, and not_in.
- [ ] Cover receipt language, country-specific language, empty donation table
      messages, missionary sections, and financial report sections.

### Validation

- [ ] Tests cover schema validation, condition evaluation, nested content,
      true/false preview, invalid fields, and missing data behavior.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Conditional rule schema, renderer behavior, and editor docs.

## Phase 17: Build Repeater Extension and Scoped Data Resolver

### Purpose

Support repeatable sections for arrays of data and introduce safe scoped data
resolution for item aliases and nested variables.

### Primary output

- `packages/pdf-editor/src/extensions/repeater`
- `packages/pdf-renderer/src/repeaters`

### Tasks

- [ ] Support source array key/path, item alias, index alias where useful,
      empty state, structured sorting, safe structured filtering where useful,
      maximum row guard, scoped variables, nested conditionals, warnings for
      missing sources, warnings for non-array sources, and deterministic render
      order.
- [ ] Cover donations, invoice line items, missionary lists, financial row
      groups, and funds.

### Validation

- [ ] Tests cover repeated rows, empty state, missing source warnings, scoped
      variable resolution, sorting where included, nested variables, and
      invalid source type.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Repeater schema, collection resolver behavior, and fixtures.

## Phase 18: Build Financial Data Table Block

### Purpose

Create a report-grade data table block for financial statements and annual
giving statements.

### Primary output

- `packages/pdf-editor/src/extensions/data-table`
- `packages/pdf-renderer/src/data-table`

### Tasks

- [ ] Support data source binding, columns, labels, widths, alignment,
      formatters, grouping, totals, empty state, repeated headers, page-safe
      classes, unsupported-column warnings, and deterministic order.
- [ ] Cover annual giving statements, invoices, financial reports, and fund
      activity reports.

### Validation

- [ ] Tests cover table schema, donation table render, invoice table render,
      financial report table render, empty state, invalid binding, totals row
      placeholder, and repeated header markup.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Data table block contract and financial table fixtures.

## Phase 19: Build Totals, Subtotals, Grouping, and Summary Blocks

### Purpose

Add safe computations needed for donor statements and financial reports.

### Primary output

- Calculation schemas and renderer helpers.

### Tasks

- [ ] Support sum, count, useful averages, grouped subtotals, report totals,
      currency formatting, empty result behavior, precision rules, and
      audit-friendly calculation metadata.
- [ ] Avoid arbitrary JavaScript.

### Validation

- [ ] Tests cover donation sums, grouped subtotals, empty sets, currency
      precision, invalid fields, non-number errors, and deterministic results.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Calculation behavior docs and audit metadata notes.

## Phase 20: Build Page Break and Keep-Together Controls

### Purpose

Allow users to control PDF pagination without editing CSS.

### Primary output

- Page-flow editor nodes and print CSS output.

### Tasks

- [ ] Support explicit page breaks, keep section together, avoid break after
      heading, avoid row split where possible, start section on new page, print
      CSS output, and warnings for non-guaranteed controls.

### Validation

- [ ] Tests cover page break serialization, print HTML output,
      keep-together classes, invalid placement, preview output, and table row
      avoid-break classes.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Page behavior docs and renderer limitation notes.

## Phase 21: Build Header and Footer System

### Purpose

Support first-page and repeating headers/footers with page numbers.

### Primary output

- Header/footer schema, serializer, and editor support.

### Tasks

- [ ] Support no header/footer, first-page and repeating variants, page
      number, total pages, document title, organization footer, margin
      requirements, and small-margin warnings.
- [ ] Keep DocRaptor-specific output isolated in renderer code.

### Validation

- [ ] Tests cover header/footer schema, page number output, first-page
      variant, margin warning, and serializer snapshots.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Header/footer schema and serializer contract.

## Phase 22: Build Image and Asset Pipeline

### Purpose

Support images, logos, signatures, and render-safe asset URLs.

### Primary output

- PDF image model and asset adapter interfaces.

### Tasks

- [ ] Support image metadata, alt text, width/height, alignment, optional
      links, logo/signature roles, render-safe URL, asset ID, tenant/source
      metadata, preflight hooks, and no blob URLs in production render.
- [ ] Define adapters instead of building a storage backend unless one already
      exists in this repo.

### Validation

- [ ] Tests cover image schema, node serialization, alt text warnings, blob
      URL rejection, render-safe URL acceptance, missing image warnings, and
      signature fixtures.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Asset rendering contract and preflight adapter docs.

## Phase 23: Build Branding and Theme System

### Purpose

Support tenant brand defaults and document-level overrides without hardcoding
tenant values.

### Primary output

- Document theme model and serializer support.

### Tasks

- [ ] Support organization name, logo asset, colors, heading/body fonts,
      fallback fonts, footer text, receipt defaults where appropriate,
      template overrides, and brand token use in print CSS.

### Validation

- [ ] Tests cover theme schema, defaults, overrides, CSS variable output,
      missing font fallback, receipt brand fixture, and financial report brand
      fixture.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Brand/theme model docs and token serialization notes.

## Phase 24: Build Starter Templates and Golden Fixtures

### Purpose

Create realistic templates that drive development and regression tests.

### Primary output

- Starter template fixtures and golden fixtures.

### Tasks

- [ ] Add fixtures for donation receipt, tax receipt, annual giving statement,
      donor letter, missionary support report, financial report, invoice, and
      certificate.
- [ ] Include metadata, page settings, theme, variables, sample data, expected
      warnings, and output snapshots where practical.

### Validation

- [ ] Tests validate every fixture, render every fixture to print HTML, confirm
      sample data, reject unexpected warnings, and keep snapshots
      deterministic.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Starter fixture catalog and golden fixture update policy.

## Phase 25: Build Preflight Validation

### Purpose

Catch broken templates before publishing or rendering.

### Primary output

- `packages/pdf-renderer/src/preflight`

### Tasks

- [ ] Validate schema, required variables, unknown keys, formatters,
      conditionals, repeaters, tables, assets, blob URLs, header/footer margin
      risk, unsupported nodes, required sections, and batch unsafe conditions.
- [ ] Return structured errors, warnings, info, affected node IDs, and
      suggested fixes where practical.

### Validation

- [ ] Tests cover valid receipt, missing donor field, broken image, invalid
      table column, conditional missing source, batch unsafe template, and
      result shape snapshots.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Preflight API, warning catalog, and unsupported feature scanner notes.

## Phase 26: Build Render Logs, Artifact Metadata, and Audit Contracts

### Purpose

Define metadata contracts for renders and generated PDFs.

### Primary output

- Render metadata, artifact, and audit contracts.

### Tasks

- [ ] Capture render ID, template ID/version, data snapshot hash, renderer
      mode, DocRaptor metadata, timing, page settings, warnings, errors,
      artifact MIME/size/location, actor, and batch ID where applicable.
- [ ] Define audit event types for template lifecycle, render lifecycle, batch
      lifecycle, and artifact download.
- [ ] Use package-level types and in-memory test adapters only if no backend
      storage exists.

### Validation

- [ ] Tests cover metadata schema, artifact schema, audit schema, successful
      render with warnings, failed render, and deterministic data snapshot
      hashes.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Render/audit contracts and future core data-shape notes.

## Phase 27: Build Template Lifecycle, Versioning, and Publishing Contracts

### Purpose

Define template lifecycle behavior before batch generation depends on
published immutable versions.

### Primary output

- Template lifecycle, versioning, and publishing contracts.

### Tasks

- [ ] Support draft, published, and archived template states, version numbers,
      immutable published snapshots, current draft pointers, timestamps,
      engine metadata, validation status, preflight status, duplicate/archive/
      restore behavior, and changelog metadata.
- [ ] Do not add a database. Use contracts, pure helpers, and in-memory test
      adapters if needed.

### Validation

- [ ] Tests cover draft metadata, publish immutability, draft updates that do
      not mutate published versions, duplicate/archive/restore behavior,
      preflight-blocked publish, engine metadata, and adapter behavior if
      added.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Template lifecycle contracts and publishing invariants.

## Phase 28: Build Batch Generation Framework

### Purpose

Define queue-agnostic batch generation at the package layer before tying it to
platform queues.

### Primary output

- Queue-library-agnostic batch framework.

### Tasks

- [ ] Support batch definition, batch ID, immutable template snapshot
      reference, dataset reference, per-document jobs, status transitions,
      progress summary, cancellation, retry, partial success, result manifest,
      zip/download manifest shape, batch safety preflight, and structured
      failure reasons.
- [ ] Define adapters instead of requiring a queue library.

### Validation

- [ ] Tests cover batch creation from a published snapshot, job creation,
      transitions, partial failure, retry, cancellation, progress, manifest
      generation, rejection of mutable drafts, and preflight-blocked starts.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Batch job model, state transitions, and adapter docs.

## Phase 29: Build Async DocRaptor Rendering and Retry System

### Purpose

Connect batch jobs and long documents to async DocRaptor behavior with
retry-safe logic.

### Primary output

- Async DocRaptor and batch retry helpers.

### Tasks

- [ ] Support async render creation, status ID storage, polling, callback
      contract where useful, transient and permanent error classification,
      retry limits, backoff, timeouts, cancellation handling where possible,
      partial completion, idempotency metadata, structured logs, and no
      secrets in logs.
- [ ] Preserve Phase 11 sync client compatibility where practical.

### Validation

- [ ] Mocked tests cover async job creation, polling success/failure,
      transient retry, permanent failure without retry, max retries, partial
      success, cancellation request, status summaries, and no real network
      calls.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Async render flow docs and retry policy.

## Phase 30: Build Playwright Local Fallback and Test Renderer

### Purpose

Create a local render path for development and regression tests without making
it the production contract.

### Primary output

- Playwright local renderer helper or explicit deferral note.

### Tasks

- [ ] Prefer Playwright because the repo already uses it. Do not introduce a
      production dependency on the local renderer.
- [ ] Support developer preview, CI smoke tests, HTML-to-PDF sanity checks,
      screenshot/PDF snapshots, page size input where practical, print HTML/CSS
      input, failure reporting, and graceful skips when browser binaries are
      unavailable.
- [ ] Document DocRaptor as the production-fidelity renderer.

### Validation

- [ ] Tests cover print HTML input, page size handling, failures, graceful skip
      when browser binaries are unavailable, no production dependency on local
      renderer, and documentation that DocRaptor remains production fidelity.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Local renderer docs and production-fidelity caveat.

## Phase 31: Build Accessibility, Metadata, and PDF Profile Support

### Purpose

Add document metadata, accessibility checks, and DocRaptor PDF profile support
before production hardening.

### Primary output

- Metadata, accessibility warning, and PDF profile schema/request support.

### Tasks

- [ ] Support title, subject, author/organization, language, keywords, PDF/A
      profile options, PDF/UA profile options where feasible, alt text
      validation, heading order warnings where practical, table header
      warnings, link text warnings, DocRaptor request metadata mapping, and
      invalid profile rejection.
- [ ] Do not overclaim accessibility guarantees. Provide structured warnings
      and supported profile options.

### Validation

- [ ] Tests cover metadata schema, DocRaptor request metadata mapping, missing
      title warning, missing alt text warning, heading/table/link warnings
      where implemented, PDF profile serialization, and invalid profile
      rejection.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Metadata model docs and accessibility warning notes.

## Phase 32: Build Security and Tenant Integration Contracts

### Purpose

Prepare for `Asymmetric-al/core` integration without app-specific code.

### Primary output

- Security and tenant adapter contracts.

### Tasks

- [ ] Define contracts for tenant ID, user ID, permissions, asset access,
      render authorization, preview authorization, edit/publish authorization,
      batch authorization, audit identity, signed/public render URLs, PII
      classification, secret-like value rejection in templates, no API key in
      browser bundles, and redacted logs.
- [ ] Use interfaces and fake adapters if the repo has no auth system.

### Validation

- [ ] Tests cover unauthorized render, unauthorized publish, unauthorized
      batch, tenant mismatch, secret-like template metadata rejection, PII
      classification, API key client-export checks where testable, and log
      redaction.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Security contract docs and fake adapter notes.

## Phase 33: Build Unlayer Migration and Coexistence Path

### Purpose

Support safe migration from Unlayer without promising automatic perfect
conversion.

### Primary output

- `packages/pdf-editor/src/migration/unlayer`
- `docs/unlayer-migration.md`

### Tasks

- [ ] Support engine metadata, `unlayer`,
      `asym_pdf_document_builder`, legacy template references, manual
      migration workflow, optional HTML import shape, migration report,
      unsupported feature list, side-by-side comparison hooks, feature flag
      contract, legacy PDF artifact references, and safe fallback behavior.
- [ ] Do not attempt full Unlayer JSON conversion unless a later spec narrows
      the scope.

### Validation

- [ ] Tests cover engine metadata, legacy/new template metadata, migration
      reports, unsupported features, feature flag contract shape, comparison
      hooks, and legacy template pass-through.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Unlayer coexistence, migration, and dual-run guide.

## Phase 34: Build `Asymmetric-al/core` Adapter Package and Feature Flag Contract

### Purpose

Create the package contract that lets the broader platform consume the PDF
builder later.

### Primary output

- Future adapter package or adapter contract.

### Tasks

- [ ] Expose integration points for editor component/factory, template
      load/save, lifecycle/versioning, preview, render, variable registry
      injection, asset adapter, auth/permission adapter, DocRaptor client
      injection, feature flags, legacy engine metadata, preflight, and batch
      generation.
- [ ] Do not require editing `Asymmetric-al/core` in this repo.

### Validation

- [ ] Tests cover adapter exports, type-level integration fixture, fake core
      adapter preview, fake core adapter render through mocked DocRaptor path,
      feature flag selection, legacy engine pass-through, and injectable auth/
      asset adapters.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Core adapter contract and feature flag docs.

## Phase 35: Build Documentation, Playground, and Developer Examples

### Purpose

Make the package usable by humans before production rollout.

### Primary output

- PDF-first docs, examples, and playground updates.

### Tasks

- [ ] Add examples for donation receipt, annual giving statement, financial
      report, invoice, certificate, browser preview, mocked DocRaptor preview,
      variable chips, conditionals, repeaters, data tables, preflight
      validation, and batch planning.
- [ ] Document workspace package installation, exports, editor usage,
      serializer usage, preview usage, DocRaptor setup, environment variables,
      tests, known limitations, migration notes, and core adapter notes.

### Validation

- [ ] Docs examples typecheck where supported, playground builds where
      supported, export smoke tests pass, example templates validate, and
      mocked DocRaptor examples require no real network or API key.
- [ ] Run `pnpm build`, `pnpm test`, and `pnpm lint`.

### Handoff output

- [ ] Developer documentation and training material.

## Phase 36: Build Performance, Load, and Large Document Tests

### Purpose

Prove the system can handle long reports and large batches before platform
integration.

### Primary output

- Lightweight performance smoke tests and opt-in heavy tests.

### Tasks

- [ ] Measure one-page receipts, ten-page annual statements, fifty-page
      financial reports, 500 donation line items, 1,000 financial rows, 1,000
      recipient batch manifests, asset-heavy documents, repeated
      header/footer output, large-template preflight, and variable resolver
      behavior on large datasets.
- [ ] Track serializer time, preflight time, resolver time, memory where
      practical, output size, warning count, and batch planning time.
- [ ] Keep heavy tests opt-in so CI stays stable.

### Validation

- [ ] Lightweight performance smoke tests run in normal CI and heavy tests are
      behind an env flag or separate script with documented broad thresholds.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Performance findings and load-test guidance.

## Phase 37: Build Release, Versioning, and API Stability Review

### Purpose

Stabilize package exports, schema versions, and release practices before
production integration.

### Primary output

- Release notes draft, API/export review, and schema versioning policy.

### Tasks

- [ ] Review public exports, private/internal exports, backwards
      compatibility, schema versions, package names, changeset/changelog needs,
      generated type declarations, breaking-change policy, deprecated
      email-first aliases, package size impact, and release notes.
- [ ] Preserve compatibility shims unless OpenSpec and tests explicitly allow
      their removal.

### Validation

- [ ] Tests/checks cover public exports, type declarations, schema version
      compatibility, deprecated alias behavior where applicable, package build
      output, and changeset/release-note presence if the repo uses changesets.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] API stability review and release path notes.

## Phase 38: Run Security, Secret, and Browser Bundle Audit

### Purpose

Verify no server-only or sensitive rendering behavior leaks into browser
bundles before integration.

### Primary output

- Server/client boundary audit and automated secret-safety checks where
  practical.

### Tasks

- [ ] Audit DocRaptor API key usage, server-only exports, browser exports,
      logs, preview result serialization, render metadata, asset URLs, sample
      data, PII classifications, side effects, and dependency risks.
- [ ] Add automated checks where practical instead of relying on docs-only
      assurances.

### Validation

- [ ] Tests/checks cover browser-facing import boundaries, client bundle
      secret names where testable, redacted logs, secret-free preview results,
      redacted render metadata, asset URL classification, and PII variable
      classifications.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Security/bundle audit notes and redaction guarantees.

## Phase 39: OpenSpec Current-State Reconciliation and Archive Readiness

### Purpose

Bring OpenSpec docs in line with the built package before final launch
readiness.

### Primary output

- Aligned OpenSpec docs, completed/deferred task status, and archive-readiness
  notes.

### Tasks

- [ ] Review `openspec/project.md`, active proposal/design/tasks, all spec
      delta files, root specs if present, completed tasks through Phase 38,
      known deviations, deferred items, and current behavior versus proposed
      behavior.
- [ ] Update specs to actual chosen architecture without claiming unfinished
      items are complete.

### Validation

- [ ] Run OpenSpec validation for the active change and all specs, docs link
      checks if available, manual task consistency checks, and a contradiction
      scan if no tooling exists.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint` where relevant and safe.

### Handoff output

- [ ] OpenSpec reconciliation note and archive-readiness status.

## Phase 40: End-to-End Package Validation with Mocked Production Flows

### Purpose

Exercise complete package-level flows before platform integration.

### Primary output

- Mocked package-level production-flow tests.

### Tasks

- [ ] Cover donation receipt flow, annual statement flow, financial report
      flow, batch run flow, migration flow, and asset flow using deterministic
      fixtures and mocked external services.
- [ ] Do not require real DocRaptor or `Asymmetric-al/core`.

### Validation

- [ ] Tests cover template to preflight to preview to mocked DocRaptor render
      metadata, variables/repeaters/tables/totals, grouped financial reports,
      batch async partial success manifests, legacy pass-through feature flags,
      and render-safe asset preflight.
- [ ] Run `pnpm test`, `pnpm build`, `pnpm lint`, and OpenSpec validation.

### Handoff output

- [ ] End-to-end package validation report.

## Phase 41: `Asymmetric-al/core` Cutover Playbook and Integration PR Plan

### Purpose

Create the concrete integration plan for bringing the package into
`Asymmetric-al/core` safely.

### Primary output

- `docs/core-cutover-playbook.md`

### Tasks

- [ ] Document package dependency strategy, feature flag names and rollout
      modes, required env vars, server-only DocRaptor setup, asset adapter
      expectations, auth/permission adapter expectations, template storage
      mapping, Unlayer coexistence, pilot templates, side-by-side comparison,
      batch rollout, monitoring/logs, rollback, support/training, migration
      limits, and criteria for removing Unlayer fallback later.
- [ ] Do not edit `Asymmetric-al/core` in this repo or claim integration is
      complete.

### Validation

- [ ] Check that the playbook references current package exports accurately,
      includes no secrets, links to correct OpenSpec files, and compiles/
      typechecks examples if included.
- [ ] Run docs/type checks if the repo supports them.

### Handoff output

- [ ] Core cutover playbook and integration PR sequence.

## Phase 42: Production Hardening, Launch Readiness, and Final Package Sign-Off

### Purpose

Prepare the package for real platform adoption and phased cutover while
separating package readiness from future platform integration work.

### Primary output

- `docs/final-package-readiness.md`

### Tasks

- [ ] Review API exports, compatibility, package names, schema versions,
      changelog/changesets, docs, full test suite, OpenSpec tasks/specs,
      security checklist, client-bundle secrets, DocRaptor modes, core
      adapter docs, migration plan, launch plan, rollback plan, known
      limitations, first-class template fixtures, and batch safety.
- [ ] Create a final readiness report that makes remaining platform work
      explicit.

### Validation

- [ ] Run full test suite, full build, full lint, OpenSpec validate all,
      export smoke tests, fixture render tests, Phase 38 security/bundle
      checks, and Phase 40 mocked end-to-end flows.
- [ ] Document exact pre-existing failures if any command fails.

### Handoff output

- [ ] Final package readiness report, known limitations, rollback guidance,
      and sign-off notes.

## OpenSpec Validation

- [ ] Run `pnpm dlx @fission-ai/openspec@latest validate build-pdf-document-builder`
- [ ] Run `pnpm dlx @fission-ai/openspec@latest validate --all`
- [ ] Confirm `AGENTS.md` exists and routes agents to OpenSpec.
- [ ] Confirm `tasks.md` is the canonical 42-phase process tracker.
- [ ] Confirm no product implementation code was added in this OpenSpec task.
- [ ] Confirm no migrations were added.
- [ ] Confirm no secrets were added.
- [ ] Run `pnpm lint` if dependencies are installed and the command is safe.
