import { describe, expect, it } from 'vitest';
import {
  pdfRendererBoundary,
  type PdfRendererBoundary,
} from '@asym/pdf-renderer';

describe('@asym/pdf-renderer public entry', () => {
  it('exposes the Phase 3 package boundary', () => {
    const boundary: PdfRendererBoundary = pdfRendererBoundary;

    expect(boundary).toEqual({
      packageName: '@asym/pdf-renderer',
      maturity: 'phase-3-boundary',
      owns: 'print-renderer',
      runtime: 'server-or-build-time',
      consumes: ['@asym/pdf-template-schema'],
    });
  });
});
