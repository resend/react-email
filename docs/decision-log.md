# Decision Log

This log records durable product and technical decisions for the Asym PDF
Document Builder fork. OpenSpec remains the behavior contract; this file records
phase-level choices and tradeoffs found during implementation.

## 2026-04-25: Freeze Upstream Baseline

- Decision: Phase 1 freezes upstream React Email canary at
  `d064012cd5a3b4817dbe03a932a6d68e83e07abb`.
- Reason: Later phases need a known React Email baseline before isolating and
  refactoring the editor.
- Tradeoff: The fork may lag upstream React Email until a later sync policy is
  defined.

## 2026-04-25: DocRaptor Is Primary PDF Engine

- Decision: DocRaptor is the production PDF rendering engine and fidelity
  contract.
- Reason: The target documents need paged-media behavior such as `@page`,
  margin boxes, page counters, running headers and footers, named pages, and
  reliable multi-page output.
- Tradeoff: Production rendering depends on an external service and server-only
  credentials.

## 2026-04-25: Puppeteer Is Local Or Debug Fallback Only

- Decision: Puppeteer may be used later for local preview, debugging, or
  emergency fallback, but not as the production fidelity reference.
- Reason: Browser PDF engines do not provide the same paged-media support as
  DocRaptor/Prince.
- Tradeoff: Browser preview can be faster but must be labeled as
  non-authoritative.

## 2026-04-25: TipTap And ProseMirror Remain Authoring Foundation

- Decision: The PDF builder evolves from the current React Email editor
  foundation built on TipTap and ProseMirror.
- Reason: The fork already has structured editor JSON, extensions, menus,
  inspector patterns, image upload flow, theming, and serializer conventions.
- Tradeoff: Future phases must carefully separate email assumptions from
  document assumptions without breaking the upstream baseline.

## 2026-04-25: Structured JSON Is Source Of Truth

- Decision: Official templates use structured, versioned document JSON as the
  editable source of truth.
- Reason: Donor, financial, batch, and audit workflows require typed data
  binding, validation, versioning, and deterministic rendering.
- Tradeoff: Raw HTML import from Unlayer can only be partial or manual because
  exported HTML is not a complete editable template model.

## 2026-04-25: ds.shadcn Is Not In The First Build

- Decision: `ds.shadcn` is excluded from the initial foundation.
- Reason: The React Email fork is a better fit for flowing documents, reports,
  and data-bound templates.
- Tradeoff: Exact-position canvas documents, such as complex certificates or
  cover pages, may need later evaluation under a new OpenSpec decision.

## 2026-04-25: Public Repo Docs Are PDF-First

- Decision: Root README, contribution, security, and GitHub community files
  describe this repository as the Asym PDF Document Builder fork. Retained
  upstream package readmes are marked with fork-status notices instead of being
  rewritten as PDF package docs before package-boundary phases.
- Reason: Future agents and contributors should enter through the product
  charter, OpenSpec, roadmap, and PDF builder safety rules.
- Tradeoff: Current package names and examples still retain upstream naming
  until later package-boundary phases explicitly change them. App source,
  package metadata, generated distributions, and example fixtures may still
  contain upstream React Email references until the roadmap phases that own
  those surfaces.

## 2026-04-25: Upstream React Email Skill Is Legacy Reference Only

- Decision: `skills/react-email` remains in the repo but is explicitly marked
  as retained upstream reference material, not PDF builder product guidance.
- Reason: The fork still needs compatibility context while current package
  names and package boundaries remain upstream-shaped.
- Tradeoff: Detailed skill reference files still contain upstream email
  examples until later phases decide whether to remove, replace, or archive
  them.

## 2026-04-25: GitHub Checks Use Fork-Owned Baseline Gates

- Decision: Pull-request checks run on GitHub-hosted Ubuntu runners and validate
  the fork baseline with lint, baseline smoke, editor unit tests, OpenSpec
  validation, pinned dependency checks, title format checks, and local skills
  ownership.
- Reason: The upstream workflows depended on Depot runners, release secrets,
  and preview package publishing that are not part of this fork's foundation
  phase.
- Tradeoff: Full builds, recursive typecheck, broad e2e, automated version
  PRs, and package publishing remain deferred until later OpenSpec phases define
  release scope and resolve known baseline caveats.

## 2026-04-25: React Email Runtime Dependencies Are Wrapped For Phase 2

- Decision: `react-email` and React Email render/runtime assumptions are
  classified as `wrap` for Phase 2, not removed.
- Reason: `@react-email/editor` still serializes through `composeReactEmail`,
  `EmailNode`, `EmailMark`, `renderToReactEmail`, and a base template that
  imports React Email components. Removing those dependencies before package
  and serializer boundaries exist would break the frozen baseline.
- Tradeoff: The editor remains visibly email-shaped for another phase. Phase 3
  owns package boundaries, and Phase 9 owns PDF-first serializer contracts.

## 2026-04-25: Phase 2 Dependency Map Is A Checked Fixture

- Decision: `docs/dep-map.json` is generated by
  `scripts/asym-editor-dep-map.ts` and checked by `pnpm asym:dep-map:check`.
- Reason: Later package-boundary work needs deterministic drift detection for
  editor imports, public exports, package dependencies, CSS/theme edges, tests,
  docs, examples, and app references.
- Tradeoff: The fixture is intentionally review-oriented and not a runtime API.
  Biome excludes the generated JSON so the generator owns deterministic
  formatting.

## 2026-04-25: Declared Editor CSS Exports Must Resolve

- Decision: Phase 2 adds compatibility wrapper CSS files for the declared
  `button-bubble-menu.css`, `image-bubble-menu.css`, and
  `link-bubble-menu.css` editor style exports.
- Reason: The new export smoke check found those public package subpaths
  pointed to missing built files. Wrapping the existing bubble menu CSS keeps
  the declared package exports usable without changing JavaScript behavior.
- Tradeoff: These wrappers preserve an email-era public surface until a later
  UI/package phase decides whether distinct PDF-first menu styles are needed.

## 2026-04-25: Phase 3 Packages Are Private Boundary Shells

- Decision: `@asym/pdf-editor`, `@asym/pdf-renderer`,
  `@asym/pdf-template-schema`, and `@asym/docraptor-client` are created as
  private package shells with typed boundary exports only.
- Reason: Later phases need stable package names and dependency direction
  before moving behavior out of the React Email editor baseline.
- Tradeoff: The packages are importable in the workspace but are not release
  candidates and do not yet implement PDF editor, schema, renderer, or
  DocRaptor behavior.

## 2026-04-25: PDF Editor Uses A React Email Reference Adapter

- Decision: `@asym/pdf-editor` exposes
  `@asym/pdf-editor/react-email-compat` with explicit `Reference` aliases for
  public `@react-email/editor` primitives.
- Reason: Phase 3 needs a package boundary without duplicating or renaming the
  known-working editor implementation.
- Tradeoff: The new editor package intentionally depends on
  `@react-email/editor` until later phases fork editor shell, extension, and
  serializer behavior into PDF-first names.

## 2026-04-25: Email Docs And Examples Are Deferred

- Decision: Email-oriented docs, demos, playgrounds, package UI, starter
  flows, and sending examples remain in place and are documented as
  `replace-later`.
- Reason: Phase 3 owns package boundaries only. Removing or rewriting those
  surfaces before PDF package behavior exists would make the fork harder to
  validate against the React Email baseline.
- Tradeoff: The repository still contains legacy email-oriented guidance until
  Phase 34 or earlier feature-specific docs phases replace those surfaces.

## 2026-04-25: Editor Boundary Is Internal Before PDF Behavior

- Decision: Phase 4 adds `packages/editor/src/boundary` as an internal-only
  legacy editor boundary and does not add public `@react-email/editor` exports.
- Reason: Future PDF-first wrappers need a clear map of the current root, core,
  extension, plugin, UI, utility, CSS, and theme surfaces before behavior is
  moved or renamed.
- Tradeoff: The boundary still references email-era names and
  `composeReactEmail`; this is intentional until later phases define
  `DocumentNode`, `DocumentMark`, and PDF serialization behavior.

## 2026-04-25: Phase 4 Fixtures Are Plain Test Data

- Decision: Phase 4 stores baseline editor JSON and legacy render expectation
  fixtures under package test folders, not public package exports.
- Reason: The fixtures provide deterministic regression anchors without
  claiming a stable template schema or renderer API before Phase 6 and Phase 9.
- Tradeoff: Later schema and renderer phases may replace these fixture shapes
  with formal model types after the public contracts exist.

## 2026-04-26: Package Migration Is Wrapper-First

- Decision: Phase 5 keeps `@react-email/editor` unchanged and treats private
  `@asym/pdf-editor` as the stable future import target that wraps public React
  Email editor exports through `@asym/pdf-editor/react-email-compat`.
- Reason: A wrapper-first path avoids a dangerous big-bang rename while letting
  new PDF-first code depend on `@asym/*` package names.
- Tradeoff: The fork carries React Email names and compatibility adapters until
  later phases add document-native editor, schema, and serializer behavior.

## 2026-04-26: Private Boundary Packages Do Not Get Changesets

- Decision: Phase 5 does not add a changeset for package strategy or private
  `@asym/*` boundary checks.
- Reason: The `@asym/*` packages remain `private: true`, and
  `@react-email/editor` public exports do not change.
- Tradeoff: Release policy is documented now but actual versioning and
  publication rules remain deferred until a later release-readiness phase.

## 2026-04-26: Roadmap Uses 36 Phases

- Decision: The canonical OpenSpec tracker now uses the 36-phase course of
  action, with Phase 6 as schema foundation and Phase 9 as document serializer
  foundation.
- Reason: The expanded roadmap separates compatibility fixtures, safe naming,
  serializer, print shell, preview, security, migration, adapter, docs,
  performance, and release readiness into smaller reviewable phases.
- Tradeoff: Some earlier completion notes mention the previous 33-phase
  tracker as historical validation output; current planning docs should follow
  the 36-phase tracker.

## 2026-04-26: Phase 6 Schema Foundation Uses Zod

- Decision: `@asym/pdf-template-schema` uses Zod for runtime validation and
  inferred TypeScript types.
- Reason: Zod is already present in the workspace catalog and was selected in
  Phase 5 planning as the default for cross-package schema contracts and
  future JSON Schema conversion.
- Tradeoff: The schema package now has a runtime dependency on Zod while it
  remains private. Valibot can be reconsidered only if a later phase records
  measured bundle-size or runtime reasons to add another validation library.

## 2026-04-26: Phase 6 Fixtures Are Test Data, Not Starter Templates

- Decision: Donation receipt, annual giving statement, financial report,
  invoice, and certificate fixtures live under
  `packages/pdf-template-schema/test/fixtures`.
- Reason: Phase 6 needs realistic product-shape schema coverage, but Phase 24
  owns starter templates and golden fixtures.
- Tradeoff: Consumers get schema APIs now, not packaged starter templates.

## 2026-04-26: Phase 7 Harness Preserves Current Editor Output

- Decision: Phase 7 adds internal compatibility fixtures and regression tests
  for the current `@react-email/editor` JSON normalization, `composeReactEmail`
  output, custom extension registration, and public export groups.
- Reason: Later naming and serializer phases need a focused harness that fails
  when current email-first behavior changes unexpectedly.
- Tradeoff: The harness intentionally records current email-era behavior such
  as `StarterKit` container wrapping, trailing paragraph insertion, and
  heading uppercase plain-text output instead of normalizing those behaviors
  into PDF-first terms.

## 2026-04-26: Image Fixture Uses Internal Image Extension Helper

- Decision: The Phase 7 image fixture imports `createImageExtension` from the
  internal image extension module and does not add it to the public plugin
  barrel.
- Reason: The current public `@react-email/editor/plugins` subpath exposes
  `useEditorImage`, not `createImageExtension`; adding a new public export
  would exceed the regression-only scope.
- Tradeoff: The compatibility harness can exercise image serialization, but
  future consumers must still use existing public image APIs until a later
  phase defines PDF-first media exports.

## 2026-04-26: Phase 8 Adds Document Names As Aliases Only

- Decision: Phase 8 adds `PdfEditor`, `DocumentEditor`, `DocumentNode`, and
  `DocumentMark` as root `@asym/pdf-editor` aliases for the current React Email
  editor component and serializer classes.
- Reason: Future PDF builder code needs document/PDF-first import names before
  internals are renamed, but existing `@react-email/editor` imports and the
  Phase 7 compatibility harness must keep working.
- Tradeoff: These names still point at email-era behavior. `composeReactEmail`
  intentionally keeps its name until Phase 9 implements a real print/PDF
  serializer, and document theming remains deferred until the branding/theme
  phase owns PDF-specific semantics.

## 2026-04-26: Phase 9 Adds A Separate Document Serializer

- Decision: Phase 9 introduces `composePdfDocumentHtml` in
  `@asym/pdf-renderer` as the first print/PDF serializer foundation.
- Reason: PDF document output must be separate from `composeReactEmail` because
  email-client-compatible HTML is not the final print/PDF contract.
- Tradeoff: Phase 9 intentionally emits only serializer-level HTML fragments,
  foundational CSS requirements, structured warnings, asset references, and
  variable usage. The full print shell, page model, DocRaptor client,
  formatter system, and data resolution remain later phases.
- Constraint: The serializer walks structured document JSON and does not parse
  raw merge-tag text as a string replacement engine.

## 2026-04-26: Phase 10 Wraps Serializer Output In A Print Shell

- Decision: Phase 10 introduces `composePrintDocumentHtml` in
  `@asym/pdf-renderer` as the schema-driven print shell around Phase 9
  serializer output.
- Reason: DocRaptor-ready documents need deterministic full HTML, escaped
  titles, `@page` CSS, page dimensions, margins, print media helpers, page-flow
  classes, and page-counter placeholders before the DocRaptor client phase.
- Tradeoff: Phase 10 emits print HTML/CSS only. It does not call DocRaptor,
  implement browser preview fidelity, or integrate full headers and footers.
- Constraint: Page settings are validated through
  `DocumentPageSettingsSchema`; invalid settings return structured render
  warnings instead of throwing.

## 2026-04-26: Phase 11 Uses A Server-Only Direct DocRaptor REST Client

- Decision: `@asym/docraptor-client` now owns `createDocRaptorClient` and the
  server-only DocRaptor REST calls for sync render, async render creation,
  one-shot status reads, and polling.
- Reason: Official DocRaptor REST behavior is simple enough to call directly
  with modern Node `fetch`: JSON `POST /docs`, Basic auth with API key as the
  username and blank password, PDF `document_content`, `test`, `tag`, and
  `prince_options` payloads, plus `/status/{status_id}` polling for async
  jobs.
- Decision: Client mode defaults to `test`; production mode must be explicit.
- Reason: Preview and local work should not accidentally create billable
  production renders.
- Decision: API keys are constructor input only. The package does not read
  environment variables, commit secrets, or expose browser exports.
- Decision: App-layer idempotency metadata is retained in result metadata and
  may populate DocRaptor `tag` for log correlation, but no fake idempotency
  header is sent.
- Tradeoff: Phase 11 classifies retryable errors but does not implement retry
  or backoff policy. Phase 28 owns async retry behavior at the batch/render job
  layer.
- Constraint: The client is not wired into editor UI, preview UI, or renderer
  orchestration in Phase 11.
