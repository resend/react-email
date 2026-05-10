import { describe, it } from 'vitest';
import { snapshotExtensionRender } from './__tests__/extension-test-helpers';
import { BulletList } from './bullet-list';

describe('BulletList Node', () => {
  it('wraps children in <ul> with the inherited style', async () => {
    await snapshotExtensionRender({
      extension: BulletList as unknown as Parameters<
        typeof snapshotExtensionRender
      >[0]['extension'],
      node: {
        type: 'bulletList',
        attrs: { class: 'node-list node-bulletList', style: '' },
        content: [{}],
      },
      children: 'items',
    });
  });
});
