# Design: PDF-first Document Builder Foundation

## 1. Current state

`Asymmetric-al/react-PDF` is currently still close to upstream React Email.

Observed repo facts:

- The default branch is `canary`.
- `origin` points to `https://github.com/Asymmetric-al/react-PDF.git`.
- `upstream` points to `https://github.com/resend/react-email.git`.
- The root package in `package.json` is still named `react-email-monorepo`.
- The package manager is `pnpm@10.33.0`.
- Root scripts include `pnpm build` through Turbo, `pnpm lint` through
  `biome check`, `pnpm lint:fix` through `biome check --write .`, and
  `pnpm test` through Turbo.
- The workspace in `pnpm-workspace.yaml` includes `.github/actions/*`,
  `apps/*`, `benchmarks/*`, `packages/*`, `packages/react-email/dev`, and
  `playground`.
- The repo uses Turbo, Biome, TypeScript, Vitest, tsdown, React 19 overrides,
  and pnpm workspace catalogs.
- `packages/editor/package.json` still names the editor package
  `@react-email/editor`.
- `packages/editor` exports `.`, `./core`, `./extensions`, `./ui`,
  `./plugins`, `./utils`, editor styles, and themes.
- `packages/editor` depends on TipTap, ProseMirror, React, React Email, Radix
  Popover/Slot, Vitest, Playwright browser tests, and tsdown.
- `packages/editor/src/core/serializer/compose-react-email.tsx` walks TipTap
  JSON, maps extensions, calls email-aware renderers, wraps the result in a
  base email template, and returns email-ready HTML plus plain text.
- The root README and governance docs are now PDF-builder-first, while many
  retained package docs, apps, examples, and generated assets remain
  email-oriented reference surfaces.
- Phase 3 introduced private PDF-first package shells for
  `@asym/pdf-editor`, `@asym/pdf-renderer`,
  `@asym/pdf-template-schema`, and `@asym/docraptor-client`.
  These shells define package boundaries only and do not yet implement PDF
  editor, schema, renderer, or DocRaptor behavior.
- Phase 5 defines the package migration strategy as wrapper-first:
  `@react-email/editor` remains unchanged, and private `@asym/pdf-editor`
  is the future import target that consumes public React Email editor exports
  through `@asym/pdf-editor/react-email-compat` until PDF-first behavior
  exists.
- Phase 8 introduces `PdfEditor`, `DocumentEditor`, `DocumentNode`, and
  `DocumentMark` as root `@asym/pdf-editor` aliases. These names are a
  compatibility bridge only; `composeReactEmail` remains the legacy serializer
  and Phase 9 owns the real print/PDF serializer foundation.
- Phase 11 fills the private `@asym/docraptor-client` package with a
  server-only direct REST client for DocRaptor sync renders, async render job
  creation, status polling, timeouts, abort signals, normalized errors, and
  app-layer idempotency metadata. It remains unwired from editor UI and
  preview orchestration.

The broader Asymmetric.al platform currently uses Unlayer document mode for
PDF Studio. That platform shape includes or expects template CRUD, Unlayer
design JSON, HTML export, PDF export, categories, page size, orientation,
margins, merge tags, tenant storage, and future batch generation, PDF storage,
and versioning. This repo will own the future replacement packages; the broader
platform will consume them later through an adapter.

## 2. Research basis

This design is based on the following project research:

- React Email Editor is an embeddable visual editor built on TipTap and
  ProseMirror. It provides rich text editing, bubble menus, slash commands,
  multi-column layouts, theming, HTML export, image upload, and custom
  extension points.
- React Email's `composeReactEmail` serializer walks the editor document tree,
  calls node and mark renderers, applies theme styles, wraps content in a base
  template, and returns HTML plus text. That is the model for a future
  `composePdfDocumentHtml`, but the output target changes from email HTML to
  print HTML for DocRaptor.
- Unlayer Document Builder value is not just a visual editor. It includes
  dynamic templates, data fields, PDF/HTML export, brand customization,
  forms/input fields, document automation, templates, and white-label
  embedding.
- DocRaptor is the target rendering engine because it supports CSS paged media
  through Prince: `@page`, page size, margins, page margin boxes, page
  counters, running headers/footers, named pages, page breaks, metadata, PDF
  profiles, strict mode, test mode, sync jobs, and async jobs.
- Existing Asymmetric core PDF Studio already uses Unlayer document mode,
  templates, categories, merge tags, page settings, HTML export, and PDF
  export. The new builder must match those concepts so it can be ported into
  core with a controlled adapter.

## 3. Source anchors

Future implementation agents should revisit these sources when working on
phase-specific details:

- React Email repository: https://github.com/resend/react-email
- React Email Editor docs: https://react.email/docs/editor/overview
- React Email `composeReactEmail` docs:
  https://react.email/docs/editor/api-reference/compose-react-email
- React Email event bus, UI, theming, image upload, and custom extension docs:
  https://react.email/docs/editor
- Unlayer Document Builder page: https://unlayer.com/document-builder/
- Unlayer builder docs: https://docs.unlayer.com/builder/document-builder
- DocRaptor PDF reference:
  https://docraptor.com/documentation/pdf_generation/reference
- DocRaptor API parameters: https://docraptor.com/documentation/api
- DocRaptor async docs:
  https://docraptor.com/documentation/article/1070755-asynchronous-document-creation
- DocRaptor headers/footers docs:
  https://docraptor.com/documentation/article/1067094-headers-footers
- DocRaptor CSS paged media guide: https://docraptor.com/css-paged-media
- TipTap TableKit:
  https://tiptap.dev/docs/editor/extensions/functionality/table-kit
- Paged.js for browser-side print preview experiments:
  https://github.com/pagedjs/pagedjs
- Vivliostyle as optional research for browser-side paged preview or
  comparison: https://docs.vivliostyle.org/en/
- `ds.shadcn` Designer as optional later research for canvas-mode
  certificates or exact-position cover pages:
  https://ds.shadcn.com/docs/designer

## 4. Modern implementation practices

Future implementation phases should follow these practices:

- Use TypeScript with strict types. Avoid `any` unless it is a compatibility
  boundary and the value is narrowed immediately.
- Keep output deterministic. Rendering snapshots should not change due to
  object key order, timestamps, or random IDs.
- Treat DocRaptor API keys as server-only secrets.
- Treat donor and financial data as private by default.
- Prefer small composable packages and adapter interfaces over app-specific
  imports.
- Add or update tests in every implementation phase.
- Run the smallest useful test set first, then broader tests before handoff.
- Write docs for public APIs and cross-phase decisions.
- Do not introduce `ds.shadcn` unless a later OpenSpec change explicitly
  reopens the canvas-mode decision.

## 4.1 Runtime schema validation choice

Phase 06 should use Zod by default for the PDF template schema foundation.
This repo already catalogs `zod` through `pnpm-workspace.yaml` and
`packages/ui`, while Valibot is not currently a workspace dependency. Zod's
official docs describe it as TypeScript-first runtime validation with static
type inference and built-in JSON Schema conversion:
https://zod.dev/.

Valibot remains a reasonable future option if bundle-size measurements justify
introducing another validation library. Its official docs emphasize type
safety, a modular API, and small tree-shaken bundles:
https://valibot.dev/. Valibot's JSON Schema guide also notes that Valibot does
not output JSON Schema natively and uses a separate conversion package:
https://valibot.dev/guides/json-schema/.

Until a later phase records a measured reason to switch, using Zod avoids
adding a second schema validation dependency and gives the shared schema
package a direct path to JSON Schema output for docs, adapters, and future
core integration.

## 5. Repo pattern and evolution rule

The project SHALL evolve from the existing React Email fork structure rather
than replacing it with an unrelated architecture. New PDF-first packages,
exports, specs, tests, and docs SHALL follow the repo's current pnpm, Turbo,
Biome, TypeScript, Vitest, Playwright, tsdown, package export, and
editor-extension patterns unless a later OpenSpec change documents a reason to
diverge.

Future implementation should start from the current `packages/editor` package
and its established entry points: `.`, `./core`, `./extensions`, `./ui`,
`./plugins`, `./utils`, styles, and themes. PDF-first APIs may add new package
names and exports, but they should respect the existing editor boundaries and
test patterns while compatibility shims exist.

The active package migration rule is wrapper-first. New PDF-first code should
target `@asym/*` package names, but `@react-email/editor` must continue to
build and export its existing public subpaths during the compatibility window.

The canonical implementation sequence is now the 36-phase tracker in
`openspec/changes/build-pdf-document-builder/tasks.md`. Phase 06 owns schema
foundation, Phase 07 owns broader compatibility fixtures, Phase 08 owns safe
document naming, Phase 09 owns the document serializer foundation, Phase 10
owns the print shell, and Phase 11 owns the DocRaptor client package. Later
phases add preview, variables, conditionals, repeaters, tables, calculations,
page flow, headers/footers, assets, branding, fixtures, preflight, audit,
batch, local fallback rendering, accessibility, security, Unlayer coexistence,
core adapter contracts, docs, performance, and production readiness.

## 6. Target state

The target system is:

```text
Asym PDF Document Builder
  -> PDF editor
  -> typed template schema
  -> data binding
  -> rendering pipeline
  -> DocRaptor
  -> storage and audit
  -> batch generation
  -> core adapter
```

The repo should evolve into the package home for a PDF-first document builder
that can eventually replace or compete with Unlayer Document Builder inside
Asymmetric.al PDF Studio.

## 7. Why fork React Email Editor

React Email Editor is a useful foundation because TipTap and ProseMirror give a
strong structured editor model. The package already has a mature extension
shape, custom nodes and marks, bubble menus, slash commands, inspector UI,
theming, image upload flow, serializer conventions, and package entry points.

Starting from this fork is faster and safer than building a full editor from
scratch. This repo already contains the fork, so editor transformation work
belongs here rather than in `Asymmetric-al/core`.

## 8. Why the fork must become PDF-first

Email HTML and print HTML have different goals. Email templates target many
email clients and inbox constraints. PDF documents need pages, page setup,
headers, footers, page breaks, page counters, table continuation, page-safe
layout, print CSS, and renderer-accessible assets.

Financial reports and annual statements require repeaters, tables, totals,
subtotals, grouped rows, and multi-page output. The product must store
structured, versioned template JSON and must not rely on raw exported HTML as
the only source of truth.

DocRaptor rendering requires print-safe HTML/CSS and reachable assets. The
existing `composeReactEmail` serializer is a useful pattern, but the PDF system
needs a document serializer such as `composePdfDocumentHtml`,
`composeReactDocument`, or `composePrintDocument`.

## 9. Package architecture

Phase 3 introduced private package shells for the first four package targets.
Phase 5 defines `@asym/pdf-editor` as the wrapper package that consumes the
legacy editor through public exports. Future implementation should fill these
package boundaries with behavior and introduce the core adapter only when the
integration phase owns it:

```text
packages/pdf-template-schema
packages/pdf-editor
packages/pdf-renderer
packages/docraptor-client
packages/pdf-studio-adapter (future)
```

The package descriptions below are target ownership statements, not proof that
the current Phase 3 shells already implement the final behavior.

### `packages/pdf-template-schema`

Owns versioned shared types and runtime schemas for templates, variables, page
settings, assets, themes, render jobs, batch runs, artifacts, and audit events.
This package should be independent of React UI and renderer-specific code.

### `packages/pdf-editor`

Owns the React editor package forked from React Email Editor and converted to
PDF-first document editing. It should carry the TipTap/ProseMirror editor
surface, document extensions, editor UI, slash commands, inspector controls,
and compatibility shims during the migration from email naming to document
naming.

### `packages/pdf-renderer`

Owns document serialization, print HTML generation, print CSS generation,
renderer preflight, local preview helpers, and golden fixture utilities. It
should not own tenant storage, platform permissions, or core app routes.

### `packages/docraptor-client`

Owns server-only DocRaptor API calls, sync and async render behavior, status
polling, callback handling, test mode support, error normalization, and
renderer metadata. The DocRaptor API key must remain server-only.

### `packages/pdf-studio-adapter`

Owns future integration with `Asymmetric-al/core` PDF Studio screens and
current template workflows. It should preserve app boundaries and translate
core platform data, storage, audit, and permissions into the builder packages.

## 10. Template schema

Intended models:

- `DocumentTemplateV1`: versioned source-of-truth template with category,
  metadata, editor JSON, page settings, theme, bindings, asset references,
  status, and engine metadata.
- `DocumentPageSettings`: page size, custom dimensions, orientation, margins,
  future bleed settings, header/footer options, and page numbering settings.
- `DocumentTheme`: tenant brand defaults plus template-level overrides for
  colors, fonts, logo, footer text, and typography.
- `VariableDefinition`: stable key, group, label, type, sample value, required
  status, formatter, fallback, and allowed contexts.
- `DataBinding`: link between document nodes and typed data sources.
- `ConditionalRule`: structured show/hide rule with safe comparisons and no
  arbitrary code.
- `RepeaterBinding`: array binding for donations, invoice line items,
  financial rows, missionaries, funds, and similar collections.
- `TableBinding`: data-bound table definition with columns, grouping, totals,
  subtotals, empty states, and page-safe hints.
- `RenderJobV1`: render request with template version, data snapshot hash,
  renderer, status, warnings, errors, and artifact references.
- `BatchRunV1`: batch metadata, template snapshot, dataset/query record,
  recipient selection, job counts, progress, cancellation, and download state.
- `AssetReference`: tenant-scoped reference with asset id, version/hash, MIME
  type, dimensions, alt text, and render URL policy.
- `RenderArtifact`: generated PDF or preview artifact metadata, storage path,
  renderer metadata, page count, and retention policy.
- `AuditEvent`: actor, action, tenant, template, render job, batch, artifact,
  and timestamp metadata for traceability.

## 11. Editor extension plan

Custom extensions needed for PDF-first editing:

- Variable chip node: protects variables from fragile raw text editing.
- Conditional section node: supports structured content that appears only when
  data rules match.
- Repeater node: repeats blocks for donations, invoice line items, financial
  rows, funds, and missionaries.
- Data table node: supports financial reports, statements, invoices, donation
  line items, repeated headers, and page-safe rendering hints.
- Totals block: renders totals, subtotals, balances, and grouped summaries.
- Page break node: provides explicit print breaks.
- Keep-together section attribute: prevents orphaned headings and important
  grouped content where possible.
- Header/footer editing surface: manages first-page and repeating
  headers/footers with page numbers.
- Image asset node: stores structured asset references instead of unsafe local
  URLs.
- Signature image node: supports donor letters, receipts, certificates, and
  future official document workflows.
- QR placeholder node: supports future verification or donor portal links.
- Page marker helper: may help authoring and preview understand page-sensitive
  regions.
- Brand locked block: may preserve tenant-controlled logos, legal text, and
  footer content in templates.

## 12. Rendering pipeline

The rendering pipeline should be:

```text
Template JSON
  -> validate schema
  -> collect variables
  -> resolve data
  -> run preflight
  -> serialize document
  -> wrap in print shell
  -> call DocRaptor
  -> store PDF
  -> log render
```

Production rendering must call DocRaptor from server-only code. Templates must
not contain secrets, DocRaptor credentials, private storage tokens, or raw
platform datasets.

## 13. Print HTML and CSS strategy

The renderer should produce deterministic print-ready HTML/CSS:

- Use print media.
- Use `@page` for size, orientation, and margins.
- Generate page counters for page number and Page X of Y behavior.
- Generate explicit page break classes.
- Generate table header repeat behavior.
- Avoid browser-only CSS when DocRaptor cannot support it.
- Keep CSS deterministic for snapshots and regression testing.
- Include a base URL or equivalent asset resolution strategy.
- Avoid blob URLs, local file paths, and private session URLs.

## 14. Preview strategy

The editor should support:

- Fast browser preview for authoring feedback.
- True DocRaptor preview for production fidelity.
- Sample data preview for safe template creation.
- Real record preview after integration with the broader platform and
  permission checks.
- Clear warning that browser preview is not final production fidelity.
- Preview logs where useful for troubleshooting asset, data, or layout issues.

## 15. DocRaptor strategy

DocRaptor should be used as the production rendering contract:

- Sync render for small documents.
- Async render for batch or long documents.
- Test mode for PDF preview.
- Production mode for final documents.
- Status polling or callback handling for async jobs.
- Retry rules for transient failures.
- Error classification for validation, asset, renderer, timeout, auth, and
  rate-limit failures.
- Capture request/status identifiers where available.
- Store generated artifacts through the platform adapter once integrated.

## 16. Batch generation strategy

Batch generation should include:

- Batch run model.
- Template snapshot at start.
- Dataset snapshot or query record sufficient for audit.
- Per-recipient or per-document jobs.
- Queue-backed worker or broader platform job framework.
- Concurrency limits.
- Retry policy.
- Partial success handling.
- Resumable runs.
- Cancellation of pending work.
- Zip download or equivalent package download.
- Future email delivery of PDFs.
- Audit logs for starts, failures, retries, cancellations, and downloads.

## 17. Assets and branding strategy

Assets and branding should include:

- Tenant-scoped asset library after core integration.
- Logos, brand colors, fonts, and organization identity.
- Image upload and selection.
- Render-safe URLs that DocRaptor can fetch.
- Asset and font preflight.
- Template-level brand overrides.
- No private render-inaccessible URLs.
- No reusable asset storage for private donor or missionary financial data.

## 18. Data binding strategy

Data binding should include:

- Typed variable registry.
- Variable groups for organization, recipient, donation, document, missionary,
  tax receipt, financial report, statement, and invoice.
- Variable chips.
- Fallbacks and required fields.
- Formatters for currency, date, number, percentage, address, receipt number,
  and fiscal period.
- Conditional sections.
- Repeaters.
- Financial tables.
- Sample data preview.
- Real data preview after integration.

## 19. Permissions and audit

Future integration must support:

- Edit permission.
- Publish permission.
- Render permission.
- Batch permission.
- Admin permission.
- Audit events for template edits, publishes, renders, batch starts, failures,
  retries, cancellations, downloads, and migration actions.

## 20. Migration from Unlayer

The broader platform must keep Unlayer working during the transition. New
templates may use the native PDF builder behind a feature flag after
integration into `Asymmetric-al/core`.

Legacy templates remain usable. Complex templates should be manually rebuilt.
Optional partial import from exported HTML may be explored, but the system must
not promise perfect conversion from Unlayer design JSON. Cutover should happen
by template type, tenant, or feature flag.

## 21. ds.shadcn position

`ds.shadcn` is not part of the first foundation. It may be evaluated later for
fixed-layout documents like certificates, covers, or exact-position forms. The
React Email fork remains the primary foundation for flowing documents, reports,
and data-bound templates.

## 22. Open-source tools to consider

These are evaluation candidates, not mandatory choices:

- TipTap TableKit or TipTap table extensions for table editing.
- ProseMirror utilities for custom schema and nodes.
- Zod or Valibot for runtime schema validation.
- Paged.js or Vivliostyle for local paged-media preview or test comparison.
- BullMQ, Graphile Worker, or the broader platform's existing job framework for
  batch processing if compatible.
- TanStack Table for admin UI previews, not necessarily for PDF rendering.
- Playwright or Puppeteer for local fallback and screenshot tests.
- pixelmatch or similar visual diff tools for render regression tests.
- jszip or archiver for batch PDF downloads.
- DOMPurify or sanitize-html where user-authored HTML enters the system.
- Existing repo telemetry, if present, for render diagnostics.

## 23. Risks

- Repeaters and financial tables are complex.
- Browser preview may not match DocRaptor output.
- Asset reachability can fail at render time.
- DocRaptor CSS compatibility must be treated carefully.
- Batch load and renderer rate limits can affect reliability.
- Unlayer migration may require manual rebuilds.
- Scope creep can turn the first foundation into a full SaaS clone.
- Users may be confused during transition between engines.
- Financial document data integrity failures can damage donor trust.
- Refactoring can lose upstream React Email stability.
- Renaming concepts can break package exports.
- pnpm, Turbo, Biome, Vitest, Playwright, and tsdown setup must remain healthy
  during package isolation.

## 24. Testing strategy

Future implementation should include:

- Schema unit tests.
- Variable resolver tests.
- Conditional rule tests.
- Repeater tests.
- Serializer snapshots.
- Print HTML snapshots.
- DocRaptor test renders.
- Page count expectations.
- Batch job tests.
- Permission tests.
- Migration tests.
- Golden document fixtures.
- Package export tests.
- Browser editor tests.
