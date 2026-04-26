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
| 10 | Build the Print HTML Shell and Page Model | Complete; validation recorded | `packages/pdf-renderer/src/print-shell.ts` |
| 11 | Build the DocRaptor Client Package | Complete; validation recorded | `packages/docraptor-client/src` |
| 12 | Build Browser Preview and DocRaptor Preview Strategy | Next | Preview package APIs |
| 13 | Build the Typed Variable Registry | Not started | `packages/pdf-template-schema/src/variables` |
| 14 | Build Variable Resolution, Formatter, and Fallback System | Not started | Shared resolver, formatter, and fallback modules |
| 15 | Build the Variable Chip Editor Extension | Not started | `packages/pdf-editor/src/extensions/variable` |
| 16 | Build Conditional Section Engine and Editor Extension | Not started | Conditional editor and renderer support |
| 17 | Build Repeater Extension and Scoped Data Resolver | Not started | Repeater editor and renderer support |
| 18 | Build Financial Data Table Block | Not started | Financial table node and renderer support |
| 19 | Build Totals, Subtotals, Grouping, and Summary Blocks | Not started | Safe calculation contracts |
| 20 | Build Page Break and Keep-Together Controls | Not started | Page-flow controls and print CSS |
| 21 | Build Header and Footer System | Not started | Header/footer schema and serializer |
| 22 | Build Image and Asset Pipeline | Not started | PDF image model and asset adapters |
| 23 | Build Branding and Theme System | Not started | Document theme model and print tokens |
| 24 | Build Starter Templates and Golden Fixtures | Not started | Starter templates and golden fixtures |
| 25 | Build Preflight Validation | Not started | `packages/pdf-renderer/src/preflight` |
| 26 | Build Render Logs, Artifact Metadata, and Audit Contracts | Not started | Render metadata and audit schemas |
| 27 | Build Template Lifecycle, Versioning, and Publishing Contracts | Not started | Template lifecycle and publishing contracts |
| 28 | Build Batch Generation Framework | Not started | Queue-agnostic batch framework |
| 29 | Build Async DocRaptor Rendering and Retry System | Not started | Async render and retry helpers |
| 30 | Build Playwright Local Fallback and Test Renderer | Not started | Local development/test renderer |
| 31 | Build Accessibility, Metadata, and PDF Profile Support | Not started | Metadata and PDF profile contracts |
| 32 | Build Security and Tenant Integration Contracts | Not started | Security and tenant adapter contracts |
| 33 | Build Unlayer Migration and Coexistence Path | Not started | Migration/coexistence contracts |
| 34 | Build `Asymmetric-al/core` Adapter Package and Feature Flag Contract | Not started | Core adapter contract |
| 35 | Build Documentation, Playground, and Developer Examples | Not started | PDF-first docs, examples, playground |
| 36 | Build Performance, Load, and Large Document Tests | Not started | Performance smoke and opt-in load tests |
| 37 | Build Release, Versioning, and API Stability Review | Not started | API stability and release readiness review |
| 38 | Run Security, Secret, and Browser Bundle Audit | Not started | Boundary and secret-safety audit |
| 39 | OpenSpec Current-State Reconciliation and Archive Readiness | Not started | OpenSpec alignment and archive-readiness notes |
| 40 | End-to-End Package Validation with Mocked Production Flows | Not started | Mocked package-level production-flow tests |
| 41 | `Asymmetric-al/core` Cutover Playbook and Integration PR Plan | Not started | Core cutover playbook |
| 42 | Production Hardening, Launch Readiness, and Final Package Sign-Off | Not started | Final package readiness report |

## Phase 12 Entry Point

Pre-Phase 12 reconciliation is complete. It confirmed that `canary` is at the
Phase 11 merge, local history contains no merge after PR #11, and the updated
42-phase plan still points to Phase 12 as the next implementation phase. The
full handoff is recorded in `docs/pre-phase-12-reconciliation.md`.

Phase 12 should start from the Phase 11 DocRaptor client, Phase 10 print shell
and page model, Phase 9 document serializer foundation, Phase 8 naming
compatibility aliases, Phase 7 compatibility harness, Phase 6 schema
foundation, Phase 5 package strategy, and Phase 4 editor boundary artifacts:

- `docs/package-strategy.md`
- `docs/package-boundaries.md`
- `docs/editor-package-isolation.md`
- `docs/phase-8-completion-notes.md`
- `docs/phase-9-completion-notes.md`
- `docs/phase-10-completion-notes.md`
- `docs/phase-11-completion-notes.md`
- `docs/phase-7-completion-notes.md`
- `docs/phase-6-completion-notes.md`
- `openspec/changes/build-pdf-document-builder/tasks.md`
- `packages/docraptor-client/src/client.ts`
- `packages/docraptor-client/test/docraptor-client.spec.ts`
- `packages/docraptor-client/readme.md`
- `packages/pdf-renderer/src/print-shell.ts`
- `packages/pdf-renderer/test/print-shell.spec.ts`
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

Phase 12 should build preview infrastructure on top of the existing print
HTML/CSS and server-only DocRaptor client. Browser preview must remain marked
as non-final fidelity, while true PDF preview should use DocRaptor test mode
from server-side code only. Phase 12 preview must not mutate templates, expose
DocRaptor credentials to browser code, treat browser output as production
fidelity, or resolve real donor and financial records before later data,
security, and core integration phases define those contracts.
