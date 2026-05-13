import { describe, it } from 'vitest';
import { snapshotExtensionRender } from './__tests__/extension-test-helpers';
import { Sup } from './sup';

describe('Sup Mark', () => {
  it('renders the snapshot', async () => {
    await snapshotExtensionRender({
      extension: Sup as unknown as Parameters<
        typeof snapshotExtensionRender
      >[0]['extension'],
      node: { type: 'text' },
      style: {},
      children: 'th',
    });
  });
});
