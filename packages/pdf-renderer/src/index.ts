import type { PdfTemplateSchemaBoundary } from '@asym/pdf-template-schema';

export type PdfRendererPackageName = '@asym/pdf-renderer';
export type PdfRendererMaturity = 'phase-3-boundary';
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
  maturity: 'phase-3-boundary',
  owns: 'print-renderer',
  runtime: 'server-or-build-time',
  consumes: ['@asym/pdf-template-schema'],
};
