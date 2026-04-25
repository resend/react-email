import { describe, expect, it } from 'vitest';
import {
  docraptorClientBoundary,
  type DocRaptorClientBoundary,
} from '@asym/docraptor-client';

describe('@asym/docraptor-client public entry', () => {
  it('exposes the Phase 3 package boundary', () => {
    const boundary: DocRaptorClientBoundary = docraptorClientBoundary;

    expect(boundary).toEqual({
      packageName: '@asym/docraptor-client',
      maturity: 'phase-3-boundary',
      owns: 'docraptor-client',
      runtime: 'server-only',
      secretPolicy: 'credentials-stay-server-side',
    });
  });
});
