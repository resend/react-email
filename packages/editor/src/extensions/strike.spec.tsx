import { describe, it } from 'vitest';
import { snapshotExtensionRender } from './__tests__/extension-test-helpers';
import { Strike } from './strike';

describe('Strike Mark', () => {
  it('renders the snapshot', async () => {
    await snapshotExtensionRender({
      extension: Strike as unknown as Parameters<
        typeof snapshotExtensionRender
      >[0]['extension'],
      node: { type: 'text' },
      style: { textDecoration: 'line-through' },
      children: 'crossed',
    });
  });
});
