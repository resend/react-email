import { describe, it } from 'vitest';
import { snapshotExtensionRender } from './__tests__/extension-test-helpers';
import { Underline } from './underline';

describe('Underline Mark', () => {
  it('wraps children in the underline element with style', async () => {
    await snapshotExtensionRender({
      extension: Underline as unknown as Parameters<
        typeof snapshotExtensionRender
      >[0]['extension'],
      node: { type: 'text' },
      style: { textDecoration: 'underline' },
      children: 'underlined',
    });
  });
});
