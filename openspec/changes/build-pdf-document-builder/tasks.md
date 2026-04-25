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
- [ ] Leave handoff notes that state scope completed, checks run, known gaps,
      and the next phase entry point.

## 32-Phase Course of Action

| Phase | Name | Status | Primary Output |
|---:|---|---|---|
| 1 | Fork Baseline, Governance, and Product Charter | Complete | docs/asym-product-charter.md, docs/research-basis.md |
| 2 | Monorepo Inventory and Isolation Map | Complete | docs/monorepo-inventory.md, docs/editor-dependency-graph.md |
| 3 | Package Boundary for @asym/pdf-editor and Related Packages | Complete | packages/pdf-editor, packages/pdf-renderer |
| 4 | Editor Baseline Fixtures and Regression Harness | Next | packages/pdf-editor/test/fixtures, packages/pdf-renderer/test/fixtures |
| 5 | PDF Template Schema and Domain Model | Not started | packages/pdf-template-schema/src, packages/pdf-template-schema/test |
| 6 | PDF Serialization Core: DocumentNode, DocumentMark, and composePdfDocumentHtml | Not started | packages/pdf-renderer/src/compose-pdf-document-html.ts, packages/pdf-renderer/src/document-node.ts |
| 7 | Print HTML Shell and Paged-Media CSS Engine | Not started | packages/pdf-renderer/src/print-shell.ts, packages/pdf-renderer/src/paged-media-css.ts |
| 8 | DocRaptor Client and Rendering API Layer | Not started | packages/docraptor-client/src, packages/docraptor-client/test |
| 9 | PdfEditor Shell, Layout, Toolbar, Inspector, and Event Bus | Not started | packages/pdf-editor/src/components/PdfEditor.tsx, packages/pdf-editor/src/ui |
| 10 | Base Document Blocks and Marks | Not started | packages/pdf-editor/src/extensions/base, packages/pdf-editor/src/ui/slash-commands |
| 11 | Images, Assets, Buttons, Callouts, and Visual Blocks | Not started | packages/pdf-editor/src/extensions/media, packages/pdf-renderer/src/assets |
| 12 | Page Setup UI and Page Settings Renderer | Not started | packages/pdf-editor/src/ui/page-setup, packages/pdf-template-schema/src/page-settings.ts |
| 13 | Brand Kit, Document Theming, and Style Tokens | Not started | packages/pdf-editor/src/plugins/document-theming, packages/pdf-template-schema/src/brand.ts |
| 14 | Variable Registry and Merge Tag Domain Model | Not started | packages/pdf-template-schema/src/variables, packages/pdf-renderer/src/variables |
| 15 | Variable Chip Extension and Sample Data Preview | Not started | packages/pdf-editor/src/extensions/variable, packages/pdf-editor/src/ui/variable-picker |
| 16 | Conditional Section Extension | Not started | packages/pdf-editor/src/extensions/conditional-section, packages/pdf-renderer/src/conditions |
| 17 | Repeater Extension and Collection Data Model | Not started | packages/pdf-editor/src/extensions/repeater, packages/pdf-renderer/src/repeaters |
| 18 | Data Table Block for Financial Reports and Statements | Not started | packages/pdf-editor/src/extensions/data-table, packages/pdf-renderer/src/data-table |
| 19 | Headers, Footers, Page Numbers, and Running Content | Not started | packages/pdf-editor/src/extensions/header-footer, packages/pdf-renderer/src/header-footer |
| 20 | Page Breaks, Keep-Together Rules, Named Pages, and Section Flow | Not started | packages/pdf-editor/src/extensions/page-flow, packages/pdf-renderer/src/page-flow |
| 21 | Financial Report Templates and Data Adapters | Not started | packages/pdf-template-schema/src/report-data, packages/pdf-editor/src/templates/financial |
| 22 | Donation Receipts, Tax Receipts, Annual Statements, and Donor Letters | Not started | packages/pdf-editor/src/templates/donations, packages/pdf-template-schema/src/donor-documents |
| 23 | Template Library, Saved Blocks, and Reusable Sections | Not started | packages/pdf-editor/src/template-library, packages/pdf-template-schema/src/template-library.ts |
| 24 | Preview System: Editor Preview, Print Preview, DocRaptor Test Preview, and Render Diffing | Not started | packages/pdf-editor/src/preview, packages/pdf-renderer/src/preview |
| 25 | Preflight Validation, Render Warnings, and Unsupported Feature Scanner | Not started | packages/pdf-renderer/src/preflight, packages/pdf-editor/src/ui/preflight-panel |
| 26 | Batch Generation Engine and Job Model | Not started | packages/pdf-renderer/src/batch, packages/docraptor-client/src/async-batch-helpers.ts |
| 27 | Storage, Security, Tenant Boundaries, PII, and Audit Logging | Not started | packages/pdf-renderer/src/storage, packages/pdf-template-schema/src/security.ts |
| 28 | Asymmetric Core Integration Adapter | Not started | packages/pdf-editor/src/core-adapter, docs/asymmetric-core-integration.md |
| 29 | Unlayer Migration, Legacy Coexistence, and Dual-Run Strategy | Not started | packages/pdf-editor/src/migration/unlayer, docs/unlayer-migration.md |
| 30 | Full Testing Strategy, Golden Fixtures, Visual Checks, and Quality Gates | Not started | test/golden-fixtures, docs/testing-strategy.md |
| 31 | Documentation, Examples, Developer Experience, and Internal Training Material | Not started | docs, examples/pdf-editor |
| 32 | Production Hardening, Release Candidate, and Core Cutover Readiness | Not started | docs/release-candidate-checklist.md, docs/core-cutover-plan.md |

## Phase 01: Fork Baseline, Governance, and Product Charter

### Purpose

Establish the durable product charter, research basis, governance rules, and
baseline facts before product implementation begins.

### Primary output

- `docs/asym-product-charter.md`
- `docs/research-basis.md`

### Tasks

- [x] Read `AGENTS.md`, `openspec/project.md`, and the active OpenSpec change.
- [x] Record current branch, package manager, scripts, package names, editor
      exports, and upstream React Email fork state.
- [x] Identify existing repo, package, test, docs, and OpenSpec patterns.
- [x] Record which patterns this project will follow.
- [x] Write the product charter from the OpenSpec intent without claiming
      implementation exists.
- [x] Write research-basis notes for React Email Editor, `composeReactEmail`,
      Unlayer Document Builder, DocRaptor, and existing PDF Studio concepts.
- [x] Avoid creating duplicate OpenSpec changes or competing spec names.

### Validation

- [x] Confirm charter and research notes cite real repo files, source anchors,
      and current OpenSpec docs.
- [x] Run safe documentation checks available in the repo.

### Handoff output

- [x] Governance and charter notes with the next phase entry point.

## Phase 02: Monorepo Inventory and Isolation Map

### Purpose

Map the current React Email monorepo and identify how the PDF builder work can
be isolated without breaking upstream package behavior.

### Primary output

- `docs/monorepo-inventory.md`
- `docs/editor-dependency-graph.md`

### Tasks

- [x] Inventory workspaces, apps, packages, scripts, catalogs, build tooling,
      docs, tests, and examples.
- [x] Map `packages/editor` imports, exports, dependencies, extension points,
      UI boundaries, plugins, theming, image upload, and serializer paths.
- [x] Identify email-only assumptions that must be retained temporarily or
      replaced later.
- [x] Mark candidate package boundaries for editor, renderer, schema,
      DocRaptor client, and core adapter.
- [x] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [x] Confirm inventory references exact repo paths and package exports.
- [x] Confirm dependency graph distinguishes browser, server, shared, and test
      concerns.

### Handoff output

- [x] Monorepo isolation map and dependency graph for package-boundary work.

## Phase 03: Package Boundary for @asym/pdf-editor and Related Packages

### Purpose

Create the package boundary plan and first package shells for the PDF editor and
renderer while preserving the current fork.

### Primary output

- `packages/pdf-editor`
- `packages/pdf-renderer`

### Tasks

- [x] Define package ownership for `@asym/pdf-editor`, `@asym/pdf-renderer`,
      `@asym/pdf-template-schema`, `@asym/docraptor-client`, and the future
      core adapter.
- [x] Create package shells only after confirming workspace conventions.
- [x] Preserve existing `@react-email/editor` exports and compatibility paths.
- [x] Document allowed dependency directions between browser, shared, server,
      and adapter packages.
- [x] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [x] Package builds and workspace discovery still work after package shells are
      added.
- [x] Dependency directions remain acyclic and documented.

### Handoff output

- [x] Package boundary notes and initial package ownership map.

## Phase 04: Editor Baseline Fixtures and Regression Harness

### Purpose

Capture editor and renderer baseline behavior before deeper PDF-first changes.

### Primary output

- `packages/pdf-editor/test/fixtures`
- `packages/pdf-renderer/test/fixtures`

### Tasks

- [ ] Add baseline editor JSON fixtures that reflect current supported content.
- [ ] Add serializer/render fixtures for representative React Email editor
      output.
- [ ] Add deterministic snapshot helpers that avoid timestamps, random IDs, and
      unstable object key order.
- [ ] Document how to update fixtures intentionally.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Fixture tests pass and fail on intentional serializer changes.
- [ ] Snapshot outputs are deterministic across repeated runs.

### Handoff output

- [ ] Baseline regression harness and fixture update notes.

## Phase 05: PDF Template Schema and Domain Model

### Purpose

Define the versioned template, data binding, rendering, asset, theme, and batch
domain models that become the source of truth for PDF documents.

### Primary output

- `packages/pdf-template-schema/src`
- `packages/pdf-template-schema/test`

### Tasks

- [ ] Define `DocumentTemplateV1`, page settings, theme, variable definitions,
      data bindings, assets, render jobs, render artifacts, audit events, and
      batch runs.
- [ ] Add runtime validation and typed exports.
- [ ] Define schema versioning and migration hooks.
- [ ] Include nonprofit document categories and required variable groups.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Schema tests cover valid templates, invalid templates, missing required
      fields, and version handling.

### Handoff output

- [ ] Template schema API, fixtures, and domain model notes.

## Phase 06: PDF Serialization Core: DocumentNode, DocumentMark, and composePdfDocumentHtml

### Purpose

Create the PDF-first serializer core modeled after React Email's serializer
pattern but targeting print-ready HTML.

### Primary output

- `packages/pdf-renderer/src/compose-pdf-document-html.ts`
- `packages/pdf-renderer/src/document-node.ts`

### Tasks

- [ ] Define document node and mark render contracts.
- [ ] Implement `composePdfDocumentHtml` or equivalent serializer entry point.
- [ ] Return deterministic HTML, CSS, metadata, warnings, and optional text.
- [ ] Preserve a clear distinction between email serializer behavior and
      PDF-first document serializer behavior.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Serializer fixtures produce stable snapshots.
- [ ] Invalid node and mark inputs return structured errors or warnings.

### Handoff output

- [ ] Serializer API docs and fixture coverage summary.

## Phase 07: Print HTML Shell and Paged-Media CSS Engine

### Purpose

Build the print document shell and DocRaptor-compatible paged-media CSS output.

### Primary output

- `packages/pdf-renderer/src/print-shell.ts`
- `packages/pdf-renderer/src/paged-media-css.ts`

### Tasks

- [ ] Generate print media CSS, `@page` rules, page size, orientation, margins,
      page counters, and page-break classes.
- [ ] Add deterministic CSS ordering and supported page setting serialization.
- [ ] Add table continuation and print-safe layout helpers.
- [ ] Avoid browser-only CSS that DocRaptor cannot reliably render.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Snapshot tests cover Letter, A4, Legal, custom sizes, portrait,
      landscape, margins, counters, and page breaks.

### Handoff output

- [ ] Print shell and paged-media CSS behavior notes.

## Phase 08: DocRaptor Client and Rendering API Layer

### Purpose

Create the server-only DocRaptor integration layer for production and preview
PDF rendering.

### Primary output

- `packages/docraptor-client/src`
- `packages/docraptor-client/test`

### Tasks

- [ ] Implement sync render, async render, status polling, test mode, and error
      normalization.
- [ ] Ensure DocRaptor API keys stay server-only and never enter templates or
      browser bundles.
- [ ] Capture request IDs and render metadata when available.
- [ ] Define retryable versus permanent error categories.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Client tests mock success, timeout, validation error, async status,
      retryable failure, and permanent failure flows.

### Handoff output

- [ ] DocRaptor client API docs and error taxonomy.

## Phase 09: PdfEditor Shell, Layout, Toolbar, Inspector, and Event Bus

### Purpose

Introduce the PDF editor shell while preserving useful React Email editor
patterns.

### Primary output

- `packages/pdf-editor/src/components/PdfEditor.tsx`
- `packages/pdf-editor/src/ui`

### Tasks

- [ ] Build the PDF editor shell around existing editor architecture and event
      patterns.
- [ ] Add layout, toolbar, inspector, and event bus boundaries for PDF document
      authoring.
- [ ] Keep current editor behavior available during the transition.
- [ ] Document public editor props and extension registration points.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Editor shell tests cover render, extension registration, event dispatch,
      and no-regression import paths.

### Handoff output

- [ ] PDF editor shell API and extension surface notes.

## Phase 10: Base Document Blocks and Marks

### Purpose

Port and define base document editing primitives for PDF output.

### Primary output

- `packages/pdf-editor/src/extensions/base`
- `packages/pdf-editor/src/ui/slash-commands`

### Tasks

- [ ] Add document-first blocks and marks for text, headings, lists, links,
      buttons, sections, columns, dividers, and tables.
- [ ] Wire slash commands and inspector controls for base blocks.
- [ ] Ensure each block serializes through the PDF renderer contract.
- [ ] Preserve compatibility with current editor extension patterns.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Editor and serializer tests cover insertion, editing, serialization, and
      invalid block handling.

### Handoff output

- [ ] Base block and mark extension documentation.

## Phase 11: Images, Assets, Buttons, Callouts, and Visual Blocks

### Purpose

Support visual document content with render-safe asset references.

### Primary output

- `packages/pdf-editor/src/extensions/media`
- `packages/pdf-renderer/src/assets`

### Tasks

- [ ] Add image, button, callout, and visual block extensions where relevant to
      PDF documents.
- [ ] Store asset references rather than browser blob URLs.
- [ ] Add alt text, sizing, alignment, and render-safe URL metadata.
- [ ] Add asset serialization and reachability preflight hooks.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Tests cover valid assets, missing assets, private URLs, invalid MIME
      types, and successful render-safe URLs.

### Handoff output

- [ ] Media extension and asset rendering contract.

## Phase 12: Page Setup UI and Page Settings Renderer

### Purpose

Expose page settings in the editor and serialize them for print rendering.

### Primary output

- `packages/pdf-editor/src/ui/page-setup`
- `packages/pdf-template-schema/src/page-settings.ts`

### Tasks

- [ ] Add page setup UI for Letter, A4, Legal, custom size, portrait,
      landscape, margins, and future bleed settings.
- [ ] Persist page settings in the schema.
- [ ] Serialize page settings into print shell CSS.
- [ ] Validate unsupported or impossible page settings before render.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Tests cover page setup persistence, serializer output, and invalid custom
      dimensions.

### Handoff output

- [ ] Page settings schema, UI, and renderer behavior notes.

## Phase 13: Brand Kit, Document Theming, and Style Tokens

### Purpose

Support tenant brand defaults and controlled template-level overrides.

### Primary output

- `packages/pdf-editor/src/plugins/document-theming`
- `packages/pdf-template-schema/src/brand.ts`

### Tasks

- [ ] Define brand logo, colors, fonts, footer text, and organization identity.
- [ ] Add document theming plugin and style token handling.
- [ ] Support template-level overrides with auditable inheritance.
- [ ] Ensure fonts and brand assets can be made reachable by DocRaptor.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Tests cover default inheritance, template overrides, unavailable fonts,
      and deterministic theme serialization.

### Handoff output

- [ ] Brand kit schema and document theming docs.

## Phase 14: Variable Registry and Merge Tag Domain Model

### Purpose

Define typed variable and merge tag domains for Asymmetric.al documents.

### Primary output

- `packages/pdf-template-schema/src/variables`
- `packages/pdf-renderer/src/variables`

### Tasks

- [ ] Port organization, recipient, donation, document, missionary, and tax
      receipt domains.
- [ ] Add financial report, statement, invoice, and future document domains.
- [ ] Define type, label, sample value, required status, fallback, and formatter
      metadata.
- [ ] Reject duplicate keys and unsupported formatter combinations.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Registry tests cover required groups, duplicate rejection, sample data,
      required fields, and formatter metadata.

### Handoff output

- [ ] Variable registry exports and merge tag domain notes.

## Phase 15: Variable Chip Extension and Sample Data Preview

### Purpose

Represent variables safely in the editor and preview them with sample data.

### Primary output

- `packages/pdf-editor/src/extensions/variable`
- `packages/pdf-editor/src/ui/variable-picker`

### Tasks

- [ ] Add protected inline variable chips.
- [ ] Add variable picker UI grouped by domain.
- [ ] Add inspector controls for fallback and formatter settings.
- [ ] Prevent normal text editing from corrupting variable keys.
- [ ] Render sample data previews in editor and browser preview.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Editor tests cover insertion, deletion, copy/paste, serialization,
      fallback editing, and sample preview rendering.

### Handoff output

- [ ] Variable chip extension and variable picker documentation.

## Phase 16: Conditional Section Extension

### Purpose

Support structured conditional content without executable template logic.

### Primary output

- `packages/pdf-editor/src/extensions/conditional-section`
- `packages/pdf-renderer/src/conditions`

### Tasks

- [ ] Add conditional section node and editor controls.
- [ ] Support safe presence, equality, boolean, enum, and numeric comparisons.
- [ ] Reject arbitrary executable conditions.
- [ ] Support conditions for goods/services language, donor country language,
      empty donation periods, fund-specific copy, and optional missionary
      sections.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Tests cover true, false, missing data, invalid rules, and nonprofit
      document conditional scenarios.

### Handoff output

- [ ] Conditional rule schema, renderer behavior, and editor docs.

## Phase 17: Repeater Extension and Collection Data Model

### Purpose

Support repeated document sections from array data.

### Primary output

- `packages/pdf-editor/src/extensions/repeater`
- `packages/pdf-renderer/src/repeaters`

### Tasks

- [ ] Add repeater node for donations, invoice line items, financial rows,
      missionaries, funds, and future collections.
- [ ] Support sorting, grouping hooks, empty states, limits, and item-scoped
      variables.
- [ ] Add page-safe rendering hints for repeated content.
- [ ] Validate missing or incorrectly typed collections before publish.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Tests cover empty, single-item, multi-item, invalid collection, sorting,
      empty state, and serialization scenarios.

### Handoff output

- [ ] Repeater schema, collection resolver behavior, and fixtures.

## Phase 18: Data Table Block for Financial Reports and Statements

### Purpose

Support report-grade, data-bound tables for financial reports and statements.

### Primary output

- `packages/pdf-editor/src/extensions/data-table`
- `packages/pdf-renderer/src/data-table`

### Tasks

- [ ] Add data-bound table block with columns, grouping, sorting, repeated
      headers, empty states, and page-safe hints.
- [ ] Support annual giving statement donation tables and financial report
      tables.
- [ ] Serialize tables to DocRaptor-compatible HTML and CSS.
- [ ] Validate missing columns, missing bindings, and unsupported table options.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Fixtures cover annual giving statements, financial reports, empty tables,
      grouped rows, repeated headers, and multi-page output.

### Handoff output

- [ ] Data table block contract and financial table fixtures.

## Phase 19: Headers, Footers, Page Numbers, and Running Content

### Purpose

Support first-page and repeating page regions with DocRaptor-compatible page
counters and running content.

### Primary output

- `packages/pdf-editor/src/extensions/header-footer`
- `packages/pdf-renderer/src/header-footer`

### Tasks

- [ ] Add first-page and repeating header/footer editing surfaces.
- [ ] Support current page number, total page count, Page X of Y, report title,
      document metadata, and footer text.
- [ ] Validate header and footer height against page margins.
- [ ] Serialize headers and footers through DocRaptor-compatible structures.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] DocRaptor preview fixtures cover multi-page annual statements, financial
      reports, hidden first-page header, and Page X of Y.

### Handoff output

- [ ] Header/footer schema and serializer contract.

## Phase 20: Page Breaks, Keep-Together Rules, Named Pages, and Section Flow

### Purpose

Give document authors controlled page flow for receipts, reports, statements,
and certificates.

### Primary output

- `packages/pdf-editor/src/extensions/page-flow`
- `packages/pdf-renderer/src/page-flow`

### Tasks

- [ ] Add explicit page break node.
- [ ] Add keep-together, avoid-split, section flow, and named page controls.
- [ ] Add certificate one-page validation hints.
- [ ] Serialize flow controls to print-safe and DocRaptor-compatible CSS.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Snapshot tests cover appendix breaks, table section headings, named pages,
      avoid-split behavior, and certificate layout constraints.

### Handoff output

- [ ] Page flow behavior notes and renderer fixture summary.

## Phase 21: Financial Report Templates and Data Adapters

### Purpose

Make financial reports a first-class advanced use case.

### Primary output

- `packages/pdf-template-schema/src/report-data`
- `packages/pdf-editor/src/templates/financial`

### Tasks

- [ ] Define report data adapter interfaces for report title, period, account
      groups, funds, income rows, expense rows, totals, subtotals, and summary
      rows.
- [ ] Add starter financial report templates and sample data.
- [ ] Support multi-page tables, repeated headers, grouped sections, and
      audit-friendly export metadata.
- [ ] Validate financial report bindings before publish and render.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Fixtures cover income and expense reports, fund grouping, empty reports,
      totals, subtotals, page breaks, export logs, and audit trail metadata.

### Handoff output

- [ ] Financial report adapter docs and starter template fixtures.

## Phase 22: Donation Receipts, Tax Receipts, Annual Statements, and Donor Letters

### Purpose

Provide core donor document templates and data adapters.

### Primary output

- `packages/pdf-editor/src/templates/donations`
- `packages/pdf-template-schema/src/donor-documents`

### Tasks

- [ ] Add templates and data models for donation receipts, tax receipts, annual
      giving statements, and donor letters.
- [ ] Include organization identity, donor identity, donation fields, tax
      language, goods/services language, receipt numbers, signatures, logos,
      footers, and page setup.
- [ ] Support annual statement line-item tables, grouping, totals, empty states,
      multi-page output, page numbers, and batch rendering readiness.
- [ ] Add sample data and preflight-safe defaults for each donor document type.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Fixtures cover receipt, tax receipt, annual statement, donor letter, empty
      period, missing required donor field, and multi-page statement scenarios.

### Handoff output

- [ ] Donor document template fixtures and data adapter notes.

## Phase 23: Template Library, Saved Blocks, and Reusable Sections

### Purpose

Support reusable template assets and safer authoring starts.

### Primary output

- `packages/pdf-editor/src/template-library`
- `packages/pdf-template-schema/src/template-library.ts`

### Tasks

- [ ] Define template library metadata, starter templates, saved blocks, and
      reusable sections.
- [ ] Support categories for donation receipts, tax receipts, annual giving
      statements, donor letters, missionary reports, financial reports,
      invoices, certificates, and custom documents.
- [ ] Add preflight-safe library items and sample data links.
- [ ] Keep saved blocks versioned and tenant-safe after platform integration.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Tests cover category filtering, starter selection, saved block
      serialization, and invalid reusable section data.

### Handoff output

- [ ] Template library schema and starter/saved block contract.

## Phase 24: Preview System: Editor Preview, Print Preview, DocRaptor Test Preview, and Render Diffing

### Purpose

Provide fast authoring previews and production-fidelity PDF previews.

### Primary output

- `packages/pdf-editor/src/preview`
- `packages/pdf-renderer/src/preview`

### Tasks

- [ ] Add editor preview and browser print preview for fast sample-data
      feedback.
- [ ] Add DocRaptor test preview as the production-fidelity preview path.
- [ ] Label browser previews as non-authoritative for production fidelity.
- [ ] Add render diffing or comparison hooks for regression checks.
- [ ] Support sample data and authorized real-record preview after core
      integration.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Preview tests cover sample data, missing data, browser preview warning,
      DocRaptor preview, and render diff output.

### Handoff output

- [ ] Preview system contract and comparison fixture notes.

## Phase 25: Preflight Validation, Render Warnings, and Unsupported Feature Scanner

### Purpose

Block unsafe publishing and rendering before donor or financial documents are
generated.

### Primary output

- `packages/pdf-renderer/src/preflight`
- `packages/pdf-editor/src/ui/preflight-panel`

### Tasks

- [ ] Validate schema, required variables, bindings, conditionals, repeaters,
      tables, assets, fonts, page setup, headers, footers, and renderer support.
- [ ] Return structured blocking errors and non-blocking warnings.
- [ ] Scan for unsupported or browser-only features before DocRaptor rendering.
- [ ] Require successful DocRaptor preview for production-bound templates.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Failure fixtures cover missing data, bad asset, private URL, invalid CSS,
      unsupported binding, missing font, and failed DocRaptor preview.

### Handoff output

- [ ] Preflight API, warning catalog, and unsupported feature scanner notes.

## Phase 26: Batch Generation Engine and Job Model

### Purpose

Support large document runs with safe progress tracking and retry behavior.

### Primary output

- `packages/pdf-renderer/src/batch`
- `packages/docraptor-client/src/async-batch-helpers.ts`

### Tasks

- [ ] Add batch run model, template snapshot, dataset context, and per-document
      job model.
- [ ] Support queue-backed processing or platform job framework adapters.
- [ ] Track total, pending, rendering, complete, failed, retried, skipped, and
      canceled counts.
- [ ] Support partial success, resumable runs, cancellation, and batch download
      readiness.
- [ ] Prevent silent generation of incorrect donor or financial documents.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Tests cover queueing, template snapshot, progress, retry, partial
      success, resume, cancellation, failed preflight, and donor-trust safety.

### Handoff output

- [ ] Batch job model, state transitions, and async helper docs.

## Phase 27: Storage, Security, Tenant Boundaries, PII, and Audit Logging

### Purpose

Make generated documents, assets, and audit records tenant-safe and traceable.

### Primary output

- `packages/pdf-renderer/src/storage`
- `packages/pdf-template-schema/src/security.ts`

### Tasks

- [ ] Define storage adapter interfaces for generated PDFs, previews, assets,
      logs, and batch artifacts.
- [ ] Track tenant-safe paths, template version, data snapshot hash, renderer
      metadata, warnings, and errors.
- [ ] Emit audit events for template edits, publishes, renders, failures,
      retries, batch starts, cancellations, and downloads.
- [ ] Treat donor and financial data as private by default.
- [ ] Ensure templates, assets, rendered documents, and logs respect tenant
      boundaries.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Tests cover tenant isolation, artifact metadata, data snapshot references,
      audit events, and PII-safe logs.

### Handoff output

- [ ] Storage, security, tenant boundary, and audit contracts.

## Phase 28: Asymmetric Core Integration Adapter

### Purpose

Prepare the package boundary that will integrate the PDF builder into
`Asymmetric-al/core` without coupling this repo to the app internals.

### Primary output

- `packages/pdf-editor/src/core-adapter`
- `docs/asymmetric-core-integration.md`

### Tasks

- [ ] Define adapter interfaces for core templates, data sources, assets,
      permissions, storage, audit, feature flags, and render jobs.
- [ ] Preserve `Asymmetric-al/core` app boundaries and avoid direct app imports.
- [ ] Map current PDF Studio concepts to the native builder model.
- [ ] Document feature flag expectations and engine metadata handoff.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Adapter tests cover enabled and disabled feature flag states, permission
      checks, storage adapters, and missing data.

### Handoff output

- [ ] Core adapter API and integration guide.

## Phase 29: Unlayer Migration, Legacy Coexistence, and Dual-Run Strategy

### Purpose

Keep legacy Unlayer templates usable while native PDF builder templates roll
out.

### Primary output

- `packages/pdf-editor/src/migration/unlayer`
- `docs/unlayer-migration.md`

### Tasks

- [ ] Add engine metadata and migration status concepts.
- [ ] Support manual rebuild workflow for legacy templates.
- [ ] Evaluate optional partial import from exported Unlayer HTML where
      practical.
- [ ] Reject any claim of perfect automatic Unlayer design JSON conversion.
- [ ] Support dual-run or comparison flows where useful for cutover confidence.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Tests cover legacy template opening, native template opening, manual
      migration state, feature flag disabled path, and partial import failure
      reporting.

### Handoff output

- [ ] Unlayer coexistence, migration, and dual-run guide.

## Phase 30: Full Testing Strategy, Golden Fixtures, Visual Checks, and Quality Gates

### Purpose

Build the regression system that keeps the PDF builder reliable across schema,
editor, serializer, rendering, and batch behavior.

### Primary output

- `test/golden-fixtures`
- `docs/testing-strategy.md`

### Tasks

- [ ] Add golden fixtures for donation receipts, tax receipts, annual
      statements, donor letters, missionary reports, financial reports,
      invoices, certificates, and branded documents.
- [ ] Add schema, resolver, editor, serializer, print HTML/CSS, DocRaptor test
      render, local render, visual diff, batch, permission, migration, and
      package export tests.
- [ ] Track page count and major layout expectations where practical.
- [ ] Define quality gates for future pull requests and release candidates.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Regression suite fails on unintended schema, serializer, layout,
      permission, migration, or batch behavior changes.

### Handoff output

- [ ] Golden fixture suite and testing strategy documentation.

## Phase 31: Documentation, Examples, Developer Experience, and Internal Training Material

### Purpose

Make the builder understandable for future developers, implementation agents,
and internal users.

### Primary output

- `docs`
- `examples/pdf-editor`

### Tasks

- [ ] Add public API docs, package usage examples, editor examples, renderer
      examples, DocRaptor setup notes, and adapter examples.
- [ ] Add internal training material for the 32-phase roadmap and handoff
      expectations.
- [ ] Document starter templates, variables, repeaters, conditionals, financial
      tables, previews, preflight, and batch generation.
- [ ] Keep docs aligned with OpenSpec behavior contracts.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Documentation examples compile or run where the repo supports executable
      docs.
- [ ] Docs link to current OpenSpec, package APIs, and examples.

### Handoff output

- [ ] Developer experience and training documentation set.

## Phase 32: Production Hardening, Release Candidate, and Core Cutover Readiness

### Purpose

Prepare for controlled production integration and gradual cutover from Unlayer.

### Primary output

- `docs/release-candidate-checklist.md`
- `docs/core-cutover-plan.md`

### Tasks

- [ ] Harden permissions, security, observability, error reporting, cost
      controls, rate limits, and support documentation.
- [ ] Define rollout by tenant, template type, and feature flag state.
- [ ] Define rollback, incident response, and final Unlayer retirement criteria.
- [ ] Confirm render fidelity, auditability, batch safety, and donor-trust
      requirements are met before production cutover.
- [ ] Follow the existing package, export, test, and documentation patterns for this repo.

### Validation

- [ ] Release candidate checklist confirms security, rendering fidelity, audit,
      batch safety, migration readiness, support readiness, and rollback paths.

### Handoff output

- [ ] Release candidate checklist and core cutover plan.

## OpenSpec validation

- [ ] Run `pnpm dlx @fission-ai/openspec@latest validate build-pdf-document-builder`
- [ ] Run `pnpm dlx @fission-ai/openspec@latest validate --all`
- [ ] Confirm `AGENTS.md` exists and routes agents to OpenSpec
- [ ] Confirm `tasks.md` is the canonical 32-phase process tracker
- [ ] Confirm no product implementation code was added in this OpenSpec task
- [ ] Confirm no migrations were added
- [ ] Confirm no secrets were added
- [ ] Run `pnpm lint` if dependencies are installed and the command is safe
