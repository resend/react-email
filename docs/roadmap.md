# PDF Document Builder Roadmap

The canonical phase list lives in
`openspec/changes/build-pdf-document-builder/tasks.md`. This document mirrors
that list with current phase status for handoff visibility.

| Phase | Name | Status | Primary Output |
|---:|---|---|---|
| 1 | Fork Baseline, Governance, and Product Charter | Complete; validation gaps recorded | `docs/asym-product-charter.md`, `docs/research-basis.md` |
| 2 | Monorepo Inventory and Isolation Map | Complete; validation recorded | `docs/monorepo-inventory.md`, `docs/editor-dependency-graph.md` |
| 3 | Package Boundary for @asym/pdf-editor and Related Packages | Complete; validation recorded | `packages/pdf-editor`, `packages/pdf-renderer` |
| 4 | Editor Boundary Isolation, Baseline Fixtures, and Regression Harness | Complete; validation recorded | `packages/editor/src/boundary`, baseline fixtures |
| 5 | Package Names, Export Strategy, and Compatibility Policy | Complete; validation recorded | `docs/package-strategy.md`, `scripts/asym-package-strategy-smoke.ts` |
| 6 | Create the PDF Template Schema Foundation | Complete; validation recorded | `packages/pdf-template-schema/src`, schema fixtures |
| 7 | Add Compatibility Fixtures and Regression Harness | Complete; validation recorded | Expanded `@react-email/editor` compatibility fixtures |
| 8 | Rename Public Concepts Safely from Email to Document | Complete; validation recorded | Compatibility aliases and migration docs |
| 9 | Build the Document Serializer Foundation | Complete; validation recorded | `packages/pdf-renderer/src/compose-pdf-document-html.ts` |
| 10 | Build the Print HTML Shell and Page Model | Next | `packages/pdf-renderer/src/print-shell.ts` |
| 11 | Build the DocRaptor Client Package | Not started | `packages/docraptor-client/src` |
| 12 | Build Browser Preview and DocRaptor Preview Strategy | Not started | Preview package APIs |
| 13 | Build the Variable Registry | Not started | `packages/pdf-template-schema/src/variables` |
| 14 | Build the Variable Chip Extension | Not started | `packages/pdf-editor/src/extensions/variable` |
| 15 | Build Formatter and Fallback System | Not started | Shared formatter modules |
| 16 | Build Conditional Section Extension | Not started | Conditional editor and renderer support |
| 17 | Build Repeater Extension | Not started | Repeater editor and renderer support |
| 18 | Build Financial Data Table Block | Not started | Financial table node and renderer support |
| 19 | Build Totals, Subtotals, Grouping, and Summary Blocks | Not started | Safe calculation contracts |
| 20 | Build Page Break and Keep-Together Controls | Not started | Page-flow controls and print CSS |
| 21 | Build Header and Footer System | Not started | Header/footer schema and serializer |
| 22 | Build Image and Asset Pipeline | Not started | PDF image model and asset adapters |
| 23 | Build Branding and Theme System | Not started | Document theme model and print tokens |
| 24 | Build Starter Templates and Golden Fixtures | Not started | Starter templates and golden fixtures |
| 25 | Build Preflight Validation | Not started | `packages/pdf-renderer/src/preflight` |
| 26 | Build Render Logs, Artifact Metadata, and Audit Contracts | Not started | Render metadata and audit schemas |
| 27 | Build Batch Generation Framework | Not started | Queue-agnostic batch framework |
| 28 | Build Async DocRaptor Rendering and Retry System | Not started | Async render and retry helpers |
| 29 | Build Puppeteer or Playwright Local Fallback and Test Renderer | Not started | Local development/test renderer |
| 30 | Build Accessibility, Metadata, and PDF Profile Support | Not started | Metadata and PDF profile contracts |
| 31 | Build Security and Tenant Integration Contracts | Not started | Security and tenant adapter contracts |
| 32 | Build Unlayer Migration and Coexistence Path | Not started | Migration/coexistence contracts |
| 33 | Build `Asymmetric-al/core` Adapter Package and Feature Flag Contract | Not started | Core adapter contract |
| 34 | Build Documentation, Playground, and Developer Examples | Not started | PDF-first docs, examples, playground |
| 35 | Build Performance, Load, and Large Document Tests | Not started | Performance smoke and opt-in load tests |
| 36 | Production Hardening, Release Readiness, and Cutover Plan | Not started | Release checklist and core cutover plan |

## Phase 10 Entry Point

Phase 10 should start from the Phase 9 document serializer foundation, Phase 8
naming compatibility aliases, Phase 7 compatibility harness, Phase 6 schema
foundation, Phase 5 package strategy, and Phase 4 editor boundary artifacts:

- `docs/package-strategy.md`
- `docs/package-boundaries.md`
- `docs/editor-package-isolation.md`
- `docs/phase-8-completion-notes.md`
- `docs/phase-9-completion-notes.md`
- `docs/phase-7-completion-notes.md`
- `docs/phase-6-completion-notes.md`
- `openspec/changes/build-pdf-document-builder/tasks.md`
- `packages/pdf-renderer/src/compose-pdf-document-html.ts`
- `packages/pdf-renderer/test/compose-pdf-document-html.spec.ts`
- `packages/pdf-editor/src/index.ts`
- `packages/pdf-editor/test/document-naming-compatibility.spec.tsx`
- `packages/editor/src/compatibility`
- `packages/pdf-template-schema`
- `packages/pdf-editor`
- `packages/pdf-renderer`
- `packages/docraptor-client`
- `packages/editor/package.json`

Phase 10 should wrap `composePdfDocumentHtml` output in a deterministic print
HTML shell with schema-driven page settings and print CSS. It must keep
`composeReactEmail`, the Phase 7 compatibility fixtures, Phase 8 document/PDF
alias checks, and Phase 9 serializer tests working during the compatibility
window.
