import {
  type PdfTemplateSchemaBoundary,
  pdfTemplateSchemaBoundary,
} from '@asym/pdf-template-schema';
import { describe, expect, it } from 'vitest';

describe('@asym/pdf-template-schema public entry', () => {
  it('exposes the Phase 3 package boundary', () => {
    const boundary: PdfTemplateSchemaBoundary = pdfTemplateSchemaBoundary;

    expect(boundary).toEqual({
      packageName: '@asym/pdf-template-schema',
      maturity: 'phase-3-boundary',
      owns: 'template-schema',
      runtime: 'shared',
    });
  });
});
