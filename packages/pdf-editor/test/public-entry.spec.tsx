import {
  type PdfEditorBoundary,
  pdfEditorBoundary,
  ReactEmailEditorReference,
} from '@asym/pdf-editor';
import { ReactEmailEditorReference as SubpathEditorReference } from '@asym/pdf-editor/react-email-compat';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

function BoundaryLabel() {
  return <output>{pdfEditorBoundary.packageName}</output>;
}

describe('@asym/pdf-editor public entry', () => {
  it('exposes the Phase 3 package boundary in a React environment', () => {
    const boundary: PdfEditorBoundary = pdfEditorBoundary;

    render(<BoundaryLabel />);

    expect(boundary).toEqual({
      packageName: '@asym/pdf-editor',
      maturity: 'phase-3-boundary',
      owns: 'pdf-editor',
      runtime: 'browser-react',
      compatibility: 'react-email-reference-adapter',
      consumes: ['@asym/pdf-template-schema', '@react-email/editor'],
    });
    expect(screen.getByText('@asym/pdf-editor')).toBeDefined();
  });

  it('exposes the temporary React Email compatibility adapter', () => {
    expect(ReactEmailEditorReference).toBeDefined();
    expect(SubpathEditorReference).toBe(ReactEmailEditorReference);
  });
});
