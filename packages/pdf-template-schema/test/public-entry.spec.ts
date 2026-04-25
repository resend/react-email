import {
  DocumentPageSettingsSchema,
  DocumentTemplateV1Schema,
  type PdfTemplateSchemaBoundary,
  pdfTemplateSchemaBoundary,
  RenderRequestSchema,
} from '@asym/pdf-template-schema';
import { describe, expect, it } from 'vitest';

describe('@asym/pdf-template-schema public entry', () => {
  it('exposes the Phase 6 package boundary', () => {
    const boundary: PdfTemplateSchemaBoundary = pdfTemplateSchemaBoundary;

    expect(boundary).toEqual({
      packageName: '@asym/pdf-template-schema',
      maturity: 'phase-6-schema-foundation',
      owns: 'template-schema',
      runtime: 'shared',
    });
  });

  it('exposes runtime schemas from the root entry point', () => {
    expect(DocumentTemplateV1Schema).toBeDefined();
    expect(DocumentPageSettingsSchema).toBeDefined();
    expect(RenderRequestSchema).toBeDefined();
  });
});
