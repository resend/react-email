import { describe, it } from 'vitest';
import { snapshotExtensionRender } from './__tests__/extension-test-helpers';
import { OrderedList } from './ordered-list';

describe('OrderedList Node', () => {
  it('renders the snapshot', async () => {
    await snapshotExtensionRender({
      extension: OrderedList as unknown as Parameters<
        typeof snapshotExtensionRender
      >[0]['extension'],
      node: {
        type: 'orderedList',
        attrs: { class: 'node-list node-orderedList', style: '' },
        content: [{}],
      },
      children: 'items',
    });
  });
});
