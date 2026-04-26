import {
  composePdfDocumentHtml,
  type PdfRendererBoundary,
  pdfRendererBoundary,
} from '@asym/pdf-renderer';
import { describe, expect, it } from 'vitest';

describe('@asym/pdf-renderer public entry', () => {
  it('exposes the Phase 3 package boundary', () => {
    const boundary: PdfRendererBoundary = pdfRendererBoundary;

    expect(boundary).toEqual({
      packageName: '@asym/pdf-renderer',
      maturity: 'phase-09-serializer-foundation',
      owns: 'print-renderer',
      runtime: 'server-or-build-time',
      consumes: ['@asym/pdf-template-schema'],
    });
  });

  it('exposes the Phase 09 document serializer foundation', () => {
    expect(composePdfDocumentHtml).toBeDefined();
  });
});
