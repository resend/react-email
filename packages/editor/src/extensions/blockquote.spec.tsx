import { describe, it } from 'vitest';
import { snapshotExtensionRender } from './__tests__/extension-test-helpers';
import { Blockquote } from './blockquote';

describe('Blockquote Node', () => {
  it('renders the snapshot', async () => {
    await snapshotExtensionRender({
      extension: Blockquote as unknown as Parameters<
        typeof snapshotExtensionRender
      >[0]['extension'],
      node: {
        type: 'blockquote',
        attrs: { class: 'node-blockquote', style: '' },
        content: [{}],
      },
      style: { borderLeft: '3px solid' },
      children: 'a quote',
    });
  });
});
