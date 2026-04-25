export type PdfTemplateSchemaPackageName = '@asym/pdf-template-schema';
export type PdfTemplateSchemaMaturity = 'phase-3-boundary';
export type PdfTemplateSchemaRuntime = 'shared';
export type PdfTemplateSchemaOwnership = 'template-schema';

export interface PdfTemplateSchemaBoundary {
  readonly packageName: PdfTemplateSchemaPackageName;
  readonly maturity: PdfTemplateSchemaMaturity;
  readonly owns: PdfTemplateSchemaOwnership;
  readonly runtime: PdfTemplateSchemaRuntime;
}

export const pdfTemplateSchemaBoundary: PdfTemplateSchemaBoundary = {
  packageName: '@asym/pdf-template-schema',
  maturity: 'phase-3-boundary',
  owns: 'template-schema',
  runtime: 'shared',
};
