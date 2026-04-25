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
