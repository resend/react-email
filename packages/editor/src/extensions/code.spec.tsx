import { describe, it } from 'vitest';
import { snapshotExtensionRender } from './__tests__/extension-test-helpers';
import { Code } from './code';

describe('Code Mark', () => {
  it('wraps inline code with the inherited style', async () => {
    await snapshotExtensionRender({
      extension: Code as unknown as Parameters<
        typeof snapshotExtensionRender
      >[0]['extension'],
      node: { type: 'text' },
      style: { fontFamily: 'monospace' },
      children: 'inline()',
    });
  });
});
