import { describe, it } from 'vitest';
import { snapshotExtensionRender } from './__tests__/extension-test-helpers';
import { ListItem } from './list-item';

describe('ListItem Node', () => {
  it('renders the snapshot', async () => {
    await snapshotExtensionRender({
      extension: ListItem as unknown as Parameters<
        typeof snapshotExtensionRender
      >[0]['extension'],
      node: {
        type: 'listItem',
        attrs: { class: 'node-listItem', style: '' },
        content: [{}],
      },
      style: { margin: '4px 0' },
      children: 'item',
    });
  });
});
