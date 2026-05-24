import { describe, it } from 'vitest';
import { snapshotExtensionRender } from './__tests__/extension-test-helpers';
import { Italic } from './italic';

describe('Italic Mark', () => {
  it('renders the snapshot', async () => {
    await snapshotExtensionRender({
      extension: Italic as unknown as Parameters<
        typeof snapshotExtensionRender
      >[0]['extension'],
      node: { type: 'text' },
      style: { fontStyle: 'italic' },
      children: 'italic text',
    });
  });
});
