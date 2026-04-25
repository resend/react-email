# PDF Document Builder Roadmap

The canonical phase list lives in
`openspec/changes/build-pdf-document-builder/tasks.md`. This document mirrors
that list with current phase status for handoff visibility.

| Phase | Name | Status | Primary Output |
|---:|---|---|---|
| 1 | Fork Baseline, Governance, and Product Charter | Complete; validation gaps recorded | `docs/asym-product-charter.md`, `docs/research-basis.md` |
| 2 | Monorepo Inventory and Isolation Map | Complete; validation recorded | `docs/monorepo-inventory.md`, `docs/editor-dependency-graph.md` |
| 3 | Package Boundary for @asym/pdf-editor and Related Packages | Complete; validation recorded | `packages/pdf-editor`, `packages/pdf-renderer` |
| 4 | Editor Baseline Fixtures and Regression Harness | Next | `packages/pdf-editor/test/fixtures`, `packages/pdf-renderer/test/fixtures` |
| 5 | PDF Template Schema and Domain Model | Not started | `packages/pdf-template-schema/src`, `packages/pdf-template-schema/test` |
| 6 | PDF Serialization Core: DocumentNode, DocumentMark, and composePdfDocumentHtml | Not started | `packages/pdf-renderer/src/compose-pdf-document-html.ts`, `packages/pdf-renderer/src/document-node.ts` |
| 7 | Print HTML Shell and Paged-Media CSS Engine | Not started | `packages/pdf-renderer/src/print-shell.ts`, `packages/pdf-renderer/src/paged-media-css.ts` |
| 8 | DocRaptor Client and Rendering API Layer | Not started | `packages/docraptor-client/src`, `packages/docraptor-client/test` |
| 9 | PdfEditor Shell, Layout, Toolbar, Inspector, and Event Bus | Not started | `packages/pdf-editor/src/components/PdfEditor.tsx`, `packages/pdf-editor/src/ui` |
| 10 | Base Document Blocks and Marks | Not started | `packages/pdf-editor/src/extensions/base`, `packages/pdf-editor/src/ui/slash-commands` |
| 11 | Images, Assets, Buttons, Callouts, and Visual Blocks | Not started | `packages/pdf-editor/src/extensions/media`, `packages/pdf-renderer/src/assets` |
| 12 | Page Setup UI and Page Settings Renderer | Not started | `packages/pdf-editor/src/ui/page-setup`, `packages/pdf-template-schema/src/page-settings.ts` |
| 13 | Brand Kit, Document Theming, and Style Tokens | Not started | `packages/pdf-editor/src/plugins/document-theming`, `packages/pdf-template-schema/src/brand.ts` |
| 14 | Variable Registry and Merge Tag Domain Model | Not started | `packages/pdf-template-schema/src/variables`, `packages/pdf-renderer/src/variables` |
| 15 | Variable Chip Extension and Sample Data Preview | Not started | `packages/pdf-editor/src/extensions/variable`, `packages/pdf-editor/src/ui/variable-picker` |
| 16 | Conditional Section Extension | Not started | `packages/pdf-editor/src/extensions/conditional-section`, `packages/pdf-renderer/src/conditions` |
| 17 | Repeater Extension and Collection Data Model | Not started | `packages/pdf-editor/src/extensions/repeater`, `packages/pdf-renderer/src/repeaters` |
| 18 | Data Table Block for Financial Reports and Statements | Not started | `packages/pdf-editor/src/extensions/data-table`, `packages/pdf-renderer/src/data-table` |
| 19 | Headers, Footers, Page Numbers, and Running Content | Not started | `packages/pdf-editor/src/extensions/header-footer`, `packages/pdf-renderer/src/header-footer` |
| 20 | Page Breaks, Keep-Together Rules, Named Pages, and Section Flow | Not started | `packages/pdf-editor/src/extensions/page-flow`, `packages/pdf-renderer/src/page-flow` |
| 21 | Financial Report Templates and Data Adapters | Not started | `packages/pdf-template-schema/src/report-data`, `packages/pdf-editor/src/templates/financial` |
| 22 | Donation Receipts, Tax Receipts, Annual Statements, and Donor Letters | Not started | `packages/pdf-editor/src/templates/donations`, `packages/pdf-template-schema/src/donor-documents` |
| 23 | Template Library, Saved Blocks, and Reusable Sections | Not started | `packages/pdf-editor/src/template-library`, `packages/pdf-template-schema/src/template-library.ts` |
| 24 | Preview System: Editor Preview, Print Preview, DocRaptor Test Preview, and Render Diffing | Not started | `packages/pdf-editor/src/preview`, `packages/pdf-renderer/src/preview` |
| 25 | Preflight Validation, Render Warnings, and Unsupported Feature Scanner | Not started | `packages/pdf-renderer/src/preflight`, `packages/pdf-editor/src/ui/preflight-panel` |
| 26 | Batch Generation Engine and Job Model | Not started | `packages/pdf-renderer/src/batch`, `packages/docraptor-client/src/async-batch-helpers.ts` |
| 27 | Storage, Security, Tenant Boundaries, PII, and Audit Logging | Not started | `packages/pdf-renderer/src/storage`, `packages/pdf-template-schema/src/security.ts` |
| 28 | Asymmetric Core Integration Adapter | Not started | `packages/pdf-editor/src/core-adapter`, `docs/asymmetric-core-integration.md` |
| 29 | Unlayer Migration, Legacy Coexistence, and Dual-Run Strategy | Not started | `packages/pdf-editor/src/migration/unlayer`, `docs/unlayer-migration.md` |
| 30 | Full Testing Strategy, Golden Fixtures, Visual Checks, and Quality Gates | Not started | `test/golden-fixtures`, `docs/testing-strategy.md` |
| 31 | Documentation, Examples, Developer Experience, and Internal Training Material | Not started | `docs`, `examples/pdf-editor` |
| 32 | Production Hardening, Release Candidate, and Core Cutover Readiness | Not started | `docs/release-candidate-checklist.md`, `docs/core-cutover-plan.md` |

## Phase 3 Entry Point

Phase 3 should start from the Phase 2 inventory and dependency map:

- `docs/monorepo-inventory.md`
- `docs/editor-dependency-graph.md`
- `docs/public-export-map.md`
- `docs/term-migration-map.md`
- `docs/dep-map.json`

It should create new package boundaries while leaving the original
`@react-email/editor` package intact.
