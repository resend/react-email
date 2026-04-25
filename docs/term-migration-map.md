# Term Migration Map

Phase 2 maps email terms to document/PDF terms without renaming code. Later
phases should use this map to design compatibility shims before any public API
change.

## Migration Principles

- Do not rename `@react-email/editor` in Phase 2.
- Do not delete upstream React Email packages in Phase 2.
- Keep structured editor JSON as the source-of-truth principle.
- Prefer compatibility aliases before breaking public import paths.
- Treat raw exported HTML as a render artifact, not the editable template model.
- Keep DocRaptor production rendering server-side in later renderer phases.

## Primary API Terms

| Current email term/API | Future PDF/document term | Phase 2 action |
|---|---|---|
| `@react-email/editor` | `@asym/pdf-editor` | Map only; Phase 3 owns package boundary. |
| `EmailEditor` | `PdfEditor` or `DocumentEditor` | Map only; keep current export. |
| `EmailEditorProps` | `PdfEditorProps` or `DocumentEditorProps` | Map only. |
| `EmailEditorRef` | `PdfEditorRef` or `DocumentEditorRef` | Map only. |
| `getEmail` | `getDocumentRender` or `getPdfDocument` | Map only; future return type must include HTML/CSS/PDF metadata. |
| `getEmailHTML` | `getPrintHtml` | Map only. |
| `getEmailText` | `getPlainText` | Likely keep behavior under a document-oriented name. |
| `composeReactEmail` | `composePdfDocumentHtml` | Map only; Phase 6 owns serializer. |
| `EmailNode` | `DocumentNode` | Map only; keep current serializer class. |
| `EmailMark` | `DocumentMark` | Map only; keep current serializer class. |
| `renderToReactEmail` | `renderToPrintDocument` or `renderToPdfHtml` | Map only; needs compatibility strategy. |
| `SerializerPluginStorage.BaseTemplate` | `PrintDocumentShell` or `DocumentTemplateShell` | Map only; future shell should target DocRaptor print HTML. |
| `DefaultBaseTemplate` | `DefaultPrintDocumentShell` | Map only; current version wraps React Email components. |
| `EmailTheming` | `DocumentTheming` | Map only; Phase 13 owns brand/theme model. |
| `useEmailTheming` | `useDocumentTheming` | Map only. |
| `getEmailTheming` | `getDocumentTheming` | Map only. |

## Content Terms

| Current term/API | Future term | Notes |
|---|---|---|
| `PreviewText` | `DocumentMetadata`, `HiddenPreviewText`, or remove in PDF mode | Email preview text has no direct PDF equivalent; may become metadata only. |
| `Body` | `DocumentBody` | Structurally useful root/body concept. |
| `Container` | `DocumentContainer` or `PageContent` | Must account for page size and margins later. |
| `Section` | `DocumentSection` | Useful for keep-together, conditional sections, and repeaters. |
| `ColumnsColumn`, `TwoColumns`, `ThreeColumns`, `FourColumns` | `Columns`, `Column` | Useful but needs print preflight for page safety. |
| `Button` | `LinkButton` or `CallToAction` | Useful in donor letters and PDFs with links, but email button semantics should not leak. |
| `Divider` | `Rule` or `Divider` | Keep concept. |
| `Table`, `TableRow`, `TableCell`, `TableHeader` | `DocumentTable`, `DataTable` | Base table remains useful; financial data table is a later specialized block. |
| `Image` plugin | `DocumentImage` or `AssetImage` | Must store structured asset references for DocRaptor. |
| `GlobalContent` | `DocumentDefaults` or `GlobalDocumentContent` | Needs review during schema work. |

## Rendering Terms

| Current term | Future term | Notes |
|---|---|---|
| email HTML | print HTML | PDF renderer should emit DocRaptor-compatible print HTML. |
| email export | PDF render/export | Export must include render logs and artifact metadata after integration. |
| React Email components | print document elements | Wrap until renderer package exists. |
| `react-email` | React Email compatibility runtime | Wrapped, not removed, until Phase 3/6. |
| `@react-email/render` | compatibility renderer | Wrapped for now; future PDF renderer should own official output. |
| browser preview | browser print preview | Non-authoritative for production fidelity. |
| email preview server | local authoring preview | Replace later with PDF document preview. |
| Puppeteer render | local/debug fallback | Not production fidelity. |
| DocRaptor render | production PDF render | Future production contract. |

## Product Terms

| Current/upstream term | Future Asym term | Notes |
|---|---|---|
| email template | PDF document template | Versioned structured JSON is source of truth. |
| preview props | sample data | Must avoid exposing real donor data by default. |
| merge tags/placeholders | typed variables | Variable chips should reference a registry. |
| dynamic email content | data-bound document content | Needs typed validation. |
| email examples | PDF document examples | Replace later with receipts, statements, reports, invoices, and letters. |
| email docs | PDF builder docs | Current docs remain reference until docs phase owns replacement. |
| sending provider examples | render/batch examples | Email provider examples become irrelevant to PDF builder package docs. |

## Keep, Wrap, Fork, Replace

| Bucket | Terms/APIs |
|---|---|
| Keep | React, TipTap, ProseMirror, Radix/Floating UI primitives, deterministic HTML/CSS utilities, current test tools |
| Wrap | `react-email`, `@react-email/render`, React Email base template behavior, current React Email serializer output |
| Fork | `EmailEditor`, `EmailNode`, `EmailMark`, `EmailTheming`, `composeReactEmail`, `StarterKit`, editor UI, extension structure |
| Replace later | email CLI/demo/docs/examples/sending provider workflows, email preview server assumptions |
| Remove later | upstream-only release/publishing/sending surfaces after later phase approval |

## Handoff Notes For Renaming

The safest later sequence is:

1. Add PDF package shells and compatibility exports.
2. Add document/PDF names beside email names.
3. Move renderer contracts from React Email output to print document output.
4. Update docs and examples to use document names.
5. Keep compatibility shims long enough for `Asymmetric-al/core` adapter work.
6. Remove legacy names only when an OpenSpec phase explicitly owns removal.
