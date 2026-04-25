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

## 36-Phase Course of Action

| Phase | Name | Status | Primary Output |
|---:|---|---|---|
| 1 | Fork Baseline, Governance, and Product Charter | Complete | `docs/asym-product-charter.md`, `docs/research-basis.md` |
| 2 | Monorepo Inventory and Isolation Map | Complete | `docs/monorepo-inventory.md`, `docs/editor-dependency-graph.md` |
| 3 | Package Boundary for @asym/pdf-editor and Related Packages | Complete | `packages/pdf-editor`, `packages/pdf-renderer` |
| 4 | Editor Boundary Isolation, Baseline Fixtures, and Regression Harness | Complete | `packages/pdf-editor/test/fixtures`, `packages/pdf-renderer/test/fixtures` |
| 5 | Package Names, Export Strategy, and Compatibility Policy | Complete | `docs/package-strategy.md`, `scripts/asym-package-strategy-smoke.ts` |
| 6 | Create the PDF Template Schema Foundation | Next | `packages/pdf-template-schema/src`, `packages/pdf-template-schema/test` |
| 7 | Add Compatibility Fixtures and Regression Harness | Not started | `packages/editor/src`, `packages/editor/test` |
| 8 | Rename Public Concepts Safely from Email to Document | Not started | `@asym/pdf-editor` compatibility exports, editor docs |
| 9 | Build the Document Serializer Foundation | Not started | `packages/pdf-renderer/src/compose-pdf-document-html.ts` |
| 10 | Build the Print HTML Shell and Page Model | Not started | `packages/pdf-renderer/src/print-shell.ts` |
| 11 | Build the DocRaptor Client Package | Not started | `packages/docraptor-client/src` |
| 12 | Build Browser Preview and DocRaptor Preview Strategy | Not started | `packages/pdf-renderer/src/preview`, `packages/pdf-editor/src/preview` |
| 13 | Build the Variable Registry | Not started | `packages/pdf-template-schema/src/variables` |
| 14 | Build the Variable Chip Extension | Not started | `packages/pdf-editor/src/extensions/variable` |
| 15 | Build Formatter and Fallback System | Not started | `packages/pdf-template-schema/src/formatters`, `packages/pdf-renderer/src/formatters` |
| 16 | Build Conditional Section Extension | Not started | `packages/pdf-editor/src/extensions/conditional-section`, `packages/pdf-renderer/src/conditions` |
| 17 | Build Repeater Extension | Not started | `packages/pdf-editor/src/extensions/repeater`, `packages/pdf-renderer/src/repeaters` |
| 18 | Build Financial Data Table Block | Not started | `packages/pdf-editor/src/extensions/data-table`, `packages/pdf-renderer/src/data-table` |
| 19 | Build Totals, Subtotals, Grouping, and Summary Blocks | Not started | `packages/pdf-renderer/src/calculations`, `packages/pdf-template-schema/src/calculations` |
| 20 | Build Page Break and Keep-Together Controls | Not started | `packages/pdf-editor/src/extensions/page-flow`, `packages/pdf-renderer/src/page-flow` |
| 21 | Build Header and Footer System | Not started | `packages/pdf-editor/src/extensions/header-footer`, `packages/pdf-renderer/src/header-footer` |
| 22 | Build Image and Asset Pipeline | Not started | `packages/pdf-editor/src/extensions/media`, `packages/pdf-renderer/src/assets` |
| 23 | Build Branding and Theme System | Not started | `packages/pdf-template-schema/src/brand`, `packages/pdf-renderer/src/theme` |
| 24 | Build Starter Templates and Golden Fixtures | Not started | `test/golden-fixtures`, `packages/pdf-template-schema/test/fixtures` |
| 25 | Build Preflight Validation | Not started | `packages/pdf-renderer/src/preflight` |
| 26 | Build Render Logs, Artifact Metadata, and Audit Contracts | Not started | `packages/pdf-template-schema/src/audit`, `packages/pdf-renderer/src/artifacts` |
| 27 | Build Batch Generation Framework | Not started | `packages/pdf-renderer/src/batch`, `packages/pdf-template-schema/src/batch` |
| 28 | Build Async DocRaptor Rendering and Retry System | Not started | `packages/docraptor-client/src/async`, `packages/pdf-renderer/src/batch` |
| 29 | Build Puppeteer or Playwright Local Fallback and Test Renderer | Not started | `packages/pdf-renderer/src/local-renderer` |
| 30 | Build Accessibility, Metadata, and PDF Profile Support | Not started | `packages/pdf-template-schema/src/metadata`, `packages/docraptor-client/src/pdf-options` |
| 31 | Build Security and Tenant Integration Contracts | Not started | `packages/pdf-template-schema/src/security`, adapter interfaces |
| 32 | Build Unlayer Migration and Coexistence Path | Not started | `packages/pdf-editor/src/migration/unlayer`, `docs/unlayer-migration.md` |
| 33 | Build Asymmetric Core Adapter Package and Feature Flag Contract | Not started | future adapter package or `packages/pdf-editor/src/core-adapter` |
| 34 | Build Documentation, Playground, and Developer Examples | Not started | `docs`, `examples/pdf-editor`, playground updates |
| 35 | Build Performance, Load, and Large Document Tests | Not started | `benchmarks`, opt-in performance tests |
| 36 | Production Hardening, Release Readiness, and Cutover Plan | Not started | `docs/release-candidate-checklist.md`, `docs/core-cutover-plan.md` |

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

- [ ] Use Zod by default for runtime validation and inferred TypeScript types
      because it is already in the workspace catalog and supports JSON Schema
      conversion; document any measured reason before choosing Valibot.
- [ ] Define runtime schemas and aligned TypeScript types for
      `DocumentTemplateV1`, `DocumentPageSettings`, `DocumentTheme`,
      `VariableDefinition`, `VariableReference`, `DataBinding`,
      `ConditionalRule`, `RepeaterBinding`, `TableBinding`, `AssetReference`,
      `RenderRequest`, `RenderResult`, `RenderWarning`, `RenderError`,
      `RenderJobV1`, `BatchRunV1`, `DocumentArtifact`, and `AuditEvent`.
- [ ] Add schema version behavior, page setting defaults, nonprofit document
      categories, and first product fixtures.
- [ ] Keep the package free of React UI, browser-only code, DocRaptor secrets,
      and app-specific dependencies.

### Validation

- [ ] Run `pnpm --filter @asym/pdf-template-schema typecheck`.
- [ ] Run `pnpm --filter @asym/pdf-template-schema test`.
- [ ] Run `pnpm --filter @asym/pdf-template-schema build`.
- [ ] Run `pnpm lint`.
- [ ] Tests cover valid template parsing, invalid template rejection, page
      setting defaults, variable validation, version field behavior, and
      schema fixtures.

### Handoff output

- [ ] Schema API docs, fixtures, validation-library decision note, and Phase
      07 compatibility-harness entry point.

## Phase 07: Add Compatibility Fixtures and Regression Harness

### Purpose

Protect current React Email editor behavior before changing names,
serializers, or core extensions.

### Primary output

- Expanded `@react-email/editor` compatibility fixtures and snapshots.

### Tasks

- [ ] Add fixtures for paragraph, heading, link, image, button, two-column
      layout, table, themed document, and current custom extension examples.
- [ ] Test editor JSON shape, current HTML export, `composeReactEmail`,
      extension registration, package exports, and CSS/theme import
      availability.
- [ ] Avoid changing output unless the harness reveals a bug that OpenSpec
      allows fixing.

### Validation

- [ ] Run `pnpm --filter @react-email/editor test`.
- [ ] Run `pnpm --filter @react-email/editor typecheck`.
- [ ] Run `pnpm --filter @react-email/editor build`.
- [ ] Run `pnpm lint`.

### Handoff output

- [ ] Compatibility fixture update notes and refactor safety summary.

## Phase 08: Rename Public Concepts Safely from Email to Document

### Purpose

Introduce document/PDF-first names as wrappers or aliases without breaking
current imports.

### Primary output

- Compatibility aliases or wrappers in the chosen package surfaces.

### Tasks

- [ ] Add safe document/PDF-first names, such as `PdfEditor` or
      `DocumentEditor`, only beside existing names.
- [ ] Keep `EmailEditor`, `composeReactEmail`, `EmailNode`, `EmailMark`, UI
      exports, and CSS exports working.
- [ ] Document every compatibility decision and the migration window.

### Validation

- [ ] Tests prove old imports still work, new imports work, generated types are
      correct, and build output contains intended exports.
- [ ] Run `pnpm --filter @react-email/editor test`.
- [ ] Run `pnpm --filter @react-email/editor typecheck`.
- [ ] Run `pnpm --filter @react-email/editor build`.
- [ ] Run `pnpm lint`.

### Handoff output

- [ ] Compatibility alias docs and import-path migration notes.

## Phase 09: Build the Document Serializer Foundation

### Purpose

Create a PDF document serializer path separate from `composeReactEmail`.

### Primary output

- `packages/pdf-renderer/src/compose-pdf-document-html.ts`

### Tasks

- [ ] Implement a serializer that walks structured editor/template JSON,
      resolves registered document nodes and marks, and returns deterministic
      HTML fragments or body output.
- [ ] Return structured CSS requirements, render warnings, asset references,
      variable usage, and unsupported node warnings.
- [ ] Do not connect DocRaptor and do not implement a string-replacement
      engine.

### Validation

- [ ] Tests cover paragraph, heading, links, images, columns, table where
      supported, unknown node warning, style merge order, empty document, and
      invalid input.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Serializer API docs and fixture coverage summary.

## Phase 10: Build the Print HTML Shell and Page Model

### Purpose

Add page settings and deterministic print CSS generation that DocRaptor can
render.

### Primary output

- `packages/pdf-renderer/src/print-shell.ts`
- Page-model CSS helpers.

### Tasks

- [ ] Support Letter, A4, Legal, custom sizes, portrait, landscape, margins,
      document title, print media, base CSS variables, page breaks,
      keep-together classes, repeated table header CSS, and page number
      placeholders.
- [ ] Drive page settings from the schema and keep output deterministic.
- [ ] Do not call DocRaptor.

### Validation

- [ ] Tests cover page sizes, orientations, margins, invalid custom sizes,
      title escaping, print CSS snapshots, and page break output.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Print shell docs and DocRaptor compatibility notes.

## Phase 11: Build the DocRaptor Client Package

### Purpose

Add a server-only DocRaptor client with safe configuration, sync rendering,
async rendering, polling, and error normalization.

### Primary output

- `packages/docraptor-client/src`

### Tasks

- [ ] Implement server-only client APIs for test mode, production mode,
      document content, base URL, print media, sync render, async job creation,
      status polling, timeouts, abort signals, and normalized errors.
- [ ] Keep API keys out of browser bundles and tests.
- [ ] Support app-layer idempotency metadata without requiring DocRaptor to
      provide a first-class idempotency key.

### Validation

- [ ] Mock tests cover payloads, missing API key, test mode, base URL, sync
      success/error, async success/polling, timeout handling, and browser import
      guards where practical.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] DocRaptor client API docs and error taxonomy.

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

## Phase 13: Build the Variable Registry

### Purpose

Define typed variables for nonprofit documents and reports.

### Primary output

- `packages/pdf-template-schema/src/variables`

### Tasks

- [ ] Create registry domains for organization, recipient, donation,
      document, missionary, tax receipt, financial report, statement, invoice,
      asset, and computed values.
- [ ] Define key, label, group, description, type, sample value, required flag,
      fallback behavior, formatter hints, privacy classification, and future
      source-path metadata.
- [ ] Add fixtures for donation receipt, tax receipt, annual statement,
      financial report, invoice, and certificate.

### Validation

- [ ] Tests cover registry validation, duplicate rejection, required fields,
      sample data generation, group lookup, and unknown variable detection.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Variable registry exports and merge tag domain notes.

## Phase 14: Build the Variable Chip Extension

### Purpose

Represent variables inside the editor as protected structured inline nodes.

### Primary output

- `packages/pdf-editor/src/extensions/variable`

### Tasks

- [ ] Add structured inline variable nodes that reference registry keys,
      render visibly, serialize to JSON, and preview sample/fallback values.
- [ ] Add command/API insertion and slash command integration only if it fits
      current UI patterns.
- [ ] Detect missing or broken variable keys and prevent accidental key edits.

### Validation

- [ ] Tests cover insertion, serialization, deserialization, chip rendering,
      unknown key warnings, fallback display, and keyboard/copy-paste behavior
      where practical.
- [ ] Run `pnpm --filter @react-email/editor test`, `pnpm build`, and
      `pnpm lint`.

### Handoff output

- [ ] Variable chip extension docs and fixture notes.

## Phase 15: Build Formatter and Fallback System

### Purpose

Format variable values consistently for receipts, statements, invoices, and
reports without React dependencies.

### Primary output

- Shared formatter and fallback modules.

### Tasks

- [ ] Support currency, date, date range, number, percentage, address, receipt
      number, fiscal period, boolean labels, image URL validation, string
      fallback, required-value errors, and optional-value warnings.
- [ ] Design APIs for renderer consumption without UI dependencies.

### Validation

- [ ] Tests cover USD currency, date basics, fiscal year labels, address
      formatting, missing required values, optional fallbacks, invalid types,
      and unknown formatters.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Formatter API docs and fallback behavior notes.

## Phase 16: Build Conditional Section Extension

### Purpose

Allow sections to show or hide based on structured data rules without
arbitrary JavaScript.

### Primary output

- `packages/pdf-editor/src/extensions/conditional-section`
- `packages/pdf-renderer/src/conditions`

### Tasks

- [ ] Support structured operators such as exists, not_exists, equals,
      not_equals, greater_than, less_than, contains, is_empty, and
      is_not_empty.
- [ ] Cover receipt language, country-specific language, empty donation table
      messages, missionary sections, and financial report sections.

### Validation

- [ ] Tests cover schema validation, condition evaluation, nested content,
      true/false preview, invalid fields, and missing data behavior.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Conditional rule schema, renderer behavior, and editor docs.

## Phase 17: Build Repeater Extension

### Purpose

Support repeatable sections for arrays of data.

### Primary output

- `packages/pdf-editor/src/extensions/repeater`
- `packages/pdf-renderer/src/repeaters`

### Tasks

- [ ] Support source array key, item alias, empty state, optional sorting or
      safe filtering, maximum row guard, scoped variables, warnings for missing
      sources, and deterministic render order.
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

## Phase 27: Build Batch Generation Framework

### Purpose

Define batch generation at the package layer before tying it to platform
queues.

### Primary output

- Queue-library-agnostic batch framework.

### Tasks

- [ ] Support batch definition, template snapshot reference, dataset
      reference, per-document jobs, status transitions, progress summary,
      cancellation, retry, partial success, result manifest, and download
      manifest shape.
- [ ] Define adapters instead of requiring a queue library.

### Validation

- [ ] Tests cover batch creation, job creation, transitions, partial failure,
      retry, cancellation, progress, and manifest generation.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Batch job model, state transitions, and adapter docs.

## Phase 28: Build Async DocRaptor Rendering and Retry System

### Purpose

Connect batch jobs to async DocRaptor behavior with retry-safe logic.

### Primary output

- Async DocRaptor and batch retry helpers.

### Tasks

- [ ] Support async render creation, status ID storage, polling, transient and
      permanent error classification, retry limits, backoff, timeouts,
      cancellation handling where possible, partial completion, idempotency
      metadata, and structured logs.

### Validation

- [ ] Mocked tests cover async job creation, polling success/failure, transient
      retry, permanent failure without retry, partial success, max retries, and
      status summaries.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Async render flow docs and retry policy.

## Phase 29: Build Puppeteer or Playwright Local Fallback and Test Renderer

### Purpose

Create a local render path for development and test snapshots without making
it the production contract.

### Primary output

- Local renderer helper or explicit deferral note.

### Tasks

- [ ] Prefer Playwright because the repo already uses it; use Puppeteer only
      if already present or clearly better after inspection.
- [ ] Support developer preview, CI smoke tests, HTML-to-PDF sanity checks,
      screenshot/PDF snapshots, and development fallback only.
- [ ] Document DocRaptor as production fidelity.

### Validation

- [ ] Tests cover print HTML input, page size handling, failures, graceful skip
      when browser binaries are unavailable, and no production dependency on
      local renderer.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Local renderer docs and production-fidelity caveat.

## Phase 30: Build Accessibility, Metadata, and PDF Profile Support

### Purpose

Add metadata and accessibility-related contracts before production hardening.

### Primary output

- Metadata and PDF profile schema/request support.

### Tasks

- [ ] Support title, subject, author/organization, language, keywords, PDF/A
      option, PDF/UA option where feasible, alt text validation, heading order
      warnings, table header warnings, and link text warnings.
- [ ] Implement only options that can be represented safely in schema and
      DocRaptor request layers.

### Validation

- [ ] Tests cover metadata schema, DocRaptor request metadata, missing title
      warning, missing alt text warning, PDF profile serialization, and invalid
      profile rejection.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Metadata model docs and accessibility warning notes.

## Phase 31: Build Security and Tenant Integration Contracts

### Purpose

Prepare for `Asymmetric-al/core` integration without app-specific code.

### Primary output

- Security and tenant adapter contracts.

### Tasks

- [ ] Define contracts for tenant ID, user ID, permissions, asset access,
      render authorization, edit/publish authorization, batch authorization,
      audit identity, signed/public render URLs, PII classification, no secrets
      in templates, and no API key in browser bundles.
- [ ] Use interfaces and fake adapters if the repo has no auth system.

### Validation

- [ ] Tests cover unauthorized render, unauthorized publish, secret-like
      template metadata rejection, tenant mismatch, and API key client-export
      checks where testable.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Security contract docs and fake adapter notes.

## Phase 32: Build Unlayer Migration and Coexistence Path

### Purpose

Support safe migration from Unlayer without pretending automatic conversion is
easy.

### Primary output

- `packages/pdf-editor/src/migration/unlayer`
- `docs/unlayer-migration.md`

### Tasks

- [ ] Support engine metadata, `unlayer`,
      `asym_pdf_document_builder`, legacy template references, manual
      migration workflow, optional HTML import shape, migration report,
      unsupported feature list, comparison hooks, and feature flag contract.
- [ ] Do not attempt full Unlayer JSON conversion unless a later spec narrows
      the scope.

### Validation

- [ ] Tests cover engine metadata, legacy/new template metadata, migration
      reports, unsupported features, and feature flag contract shape.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Unlayer coexistence, migration, and dual-run guide.

## Phase 33: Build `Asymmetric-al/core` Adapter Package and Feature Flag Contract

### Purpose

Create the package contract that lets the broader platform consume the PDF
builder later.

### Primary output

- Future adapter package or adapter contract.

### Tasks

- [ ] Expose integration points for editor component/factory, template
      load/save, preview, render, variable registry injection, asset adapter,
      auth adapter, DocRaptor client injection, feature flags, and legacy
      engine metadata.
- [ ] Do not require editing `Asymmetric-al/core` in this repo.

### Validation

- [ ] Tests cover adapter exports, type-level integration fixture, fake core
      adapter render, feature flag selection, and legacy engine pass-through.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Core adapter contract and feature flag docs.

## Phase 34: Build Documentation, Playground, and Developer Examples

### Purpose

Make the package usable by humans before production rollout.

### Primary output

- PDF-first docs, examples, and playground updates.

### Tasks

- [ ] Add examples for donation receipt, annual giving statement, financial
      report, invoice, certificate, mocked DocRaptor preview, browser preview,
      variable chips, conditionals, repeaters, and data tables.
- [ ] Document package installation, exports, editor usage, serializer usage,
      DocRaptor setup, environment variables, tests, limitations, and migration
      notes.

### Validation

- [ ] Docs examples typecheck where supported, playground builds where
      supported, and export smoke tests pass.
- [ ] Run `pnpm build`, `pnpm test`, and `pnpm lint`.

### Handoff output

- [ ] Developer documentation and training material.

## Phase 35: Build Performance, Load, and Large Document Tests

### Purpose

Prove the system can handle long reports and large batches before production
integration.

### Primary output

- Lightweight performance smoke tests and opt-in heavy tests.

### Tasks

- [ ] Measure one-page receipts, ten-page annual statements, fifty-page
      financial reports, 500 donation line items, 1,000 financial rows, 1,000
      recipient batch manifests, asset-heavy documents, repeated
      header/footer output, and large-template preflight.
- [ ] Track serializer time, preflight time, memory where practical, output
      size, warning count, and batch planning time.
- [ ] Keep heavy tests opt-in so CI stays stable.

### Validation

- [ ] Lightweight performance smoke tests run in normal CI and heavy tests are
      behind an env flag or separate script with documented thresholds.
- [ ] Run `pnpm test`, `pnpm build`, and `pnpm lint`.

### Handoff output

- [ ] Performance findings and load-test guidance.

## Phase 36: Production Hardening, Release Readiness, and Cutover Plan

### Purpose

Prepare the package for real platform adoption and phased cutover.

### Primary output

- `docs/release-candidate-checklist.md`
- `docs/core-cutover-plan.md`

### Tasks

- [ ] Review API exports, compatibility, package names, schema versions,
      changesets/changelog, docs, tests, OpenSpec tasks/specs, security,
      client-bundle secrets, DocRaptor modes, core adapter, migration plan,
      launch plan, rollback plan, and limitations.
- [ ] Create a core cutover plan covering dependency install, feature flag,
      internal receipt, annual statement, financial report, Unlayer comparison,
      pilot, fallback, gradual migration, and final Unlayer removal criteria.

### Validation

- [ ] Run `pnpm build`, `pnpm test`, `pnpm lint`, and
      `pnpm dlx @fission-ai/openspec@latest validate --all`.

### Handoff output

- [ ] Release readiness checklist and core cutover plan.

## OpenSpec Validation

- [ ] Run `pnpm dlx @fission-ai/openspec@latest validate build-pdf-document-builder`
- [ ] Run `pnpm dlx @fission-ai/openspec@latest validate --all`
- [ ] Confirm `AGENTS.md` exists and routes agents to OpenSpec.
- [ ] Confirm `tasks.md` is the canonical 36-phase process tracker.
- [ ] Confirm no product implementation code was added in this OpenSpec task.
- [ ] Confirm no migrations were added.
- [ ] Confirm no secrets were added.
- [ ] Run `pnpm lint` if dependencies are installed and the command is safe.
