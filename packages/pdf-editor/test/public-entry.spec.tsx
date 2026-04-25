import { readFileSync } from 'node:fs';
import { join } from 'node:path';
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

function readPackageJson() {
  const packageJsonPath = join(process.cwd(), 'package.json');
  const packageJsonContent = readFileSync(packageJsonPath, 'utf8');
  return JSON.parse(packageJsonContent) as {
    dependencies: Record<string, string>;
    exports: Record<string, unknown>;
    private: boolean;
  };
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

  it('keeps the Phase 5 wrapper compatibility policy explicit', () => {
    const packageJson = readPackageJson();

    expect(packageJson.private).toBe(true);
    expect(packageJson.dependencies['@react-email/editor']).toBe('workspace:*');
    expect(Object.keys(packageJson.exports).sort()).toEqual([
      '.',
      './react-email-compat',
    ]);
    expect(pdfEditorBoundary.compatibility).toBe(
      'react-email-reference-adapter',
    );
    expect(pdfEditorBoundary.consumes).toEqual([
      '@asym/pdf-template-schema',
      '@react-email/editor',
    ]);
  });
});
