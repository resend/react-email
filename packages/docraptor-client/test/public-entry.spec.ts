import {
  createDocRaptorClient,
  type DocRaptorClientBoundary,
  docraptorClientBoundary,
} from '@asym/docraptor-client';
import { describe, expect, it } from 'vitest';

describe('@asym/docraptor-client public entry', () => {
  it('exposes the Phase 11 package boundary and client factory', () => {
    const boundary: DocRaptorClientBoundary = docraptorClientBoundary;

    expect(boundary).toEqual({
      packageName: '@asym/docraptor-client',
      maturity: 'phase-11-client',
      owns: 'docraptor-client',
      runtime: 'server-only',
      secretPolicy: 'credentials-stay-server-side',
    });
    expect(createDocRaptorClient).toEqual(expect.any(Function));
  });
});
