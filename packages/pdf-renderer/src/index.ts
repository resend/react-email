import type { PdfTemplateSchemaBoundary } from '@asym/pdf-template-schema';

export type PdfRendererPackageName = '@asym/pdf-renderer';
export type PdfRendererMaturity = 'phase-10-print-shell';
export type PdfRendererRuntime = 'server-or-build-time';
export type PdfRendererOwnership = 'print-renderer';

export interface PdfRendererBoundary {
  readonly packageName: PdfRendererPackageName;
  readonly maturity: PdfRendererMaturity;
  readonly owns: PdfRendererOwnership;
  readonly runtime: PdfRendererRuntime;
  readonly consumes: readonly [PdfTemplateSchemaBoundary['packageName']];
}

export const pdfRendererBoundary: PdfRendererBoundary = {
  packageName: '@asym/pdf-renderer',
  maturity: 'phase-10-print-shell',
  owns: 'print-renderer',
  runtime: 'server-or-build-time',
  consumes: ['@asym/pdf-template-schema'],
};

export {
  type ComposePdfDocumentHtmlInput,
  type ComposePdfDocumentHtmlResult,
  composePdfDocumentHtml,
  type PdfDocumentAssetReference,
  type PdfDocumentCssMedia,
  type PdfDocumentCssRequirement,
  type PdfDocumentMark,
  type PdfDocumentMarkRenderer,
  type PdfDocumentMarkRendererContext,
  type PdfDocumentNodeRenderer,
  type PdfDocumentNodeRendererContext,
  type PdfDocumentRenderWarning,
  type PdfDocumentRenderWarningCode,
  type PdfDocumentRenderWarningSeverity,
  type PdfDocumentVariableUsage,
} from './compose-pdf-document-html';

export {
  type ComposePrintDocumentHtmlInput,
  type ComposePrintDocumentHtmlResult,
  composePrintDocumentHtml,
  type PrintDocumentPageBox,
} from './print-shell';
