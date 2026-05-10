import { describe, it } from 'vitest';
import { snapshotExtensionRender } from './__tests__/extension-test-helpers';
import { Paragraph } from './paragraph';

describe('Paragraph Node', () => {
  it('renders empty paragraph with a <br> placeholder', async () => {
    await snapshotExtensionRender({
      extension: Paragraph as unknown as Parameters<
        typeof snapshotExtensionRender
      >[0]['extension'],
      node: { type: 'paragraph', attrs: { class: '', style: '' } },
    });
  });

  it('renders class attribute when present', async () => {
    await snapshotExtensionRender({
      extension: Paragraph as unknown as Parameters<
        typeof snapshotExtensionRender
      >[0]['extension'],
      node: {
        type: 'paragraph',
        attrs: { class: 'node-paragraph', style: '' },
        content: [{}],
      },
      children: 'hello',
    });
  });

  it('applies inline style and alignment', async () => {
    await snapshotExtensionRender({
      extension: Paragraph as unknown as Parameters<
        typeof snapshotExtensionRender
      >[0]['extension'],
      node: {
        type: 'paragraph',
        attrs: { style: 'color: red', alignment: 'center' },
        content: [{}],
      },
      children: 'centered',
    });
  });
});
