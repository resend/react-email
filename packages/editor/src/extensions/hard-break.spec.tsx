import { describe, it } from 'vitest';
import { snapshotExtensionRender } from './__tests__/extension-test-helpers';
import { HardBreak } from './hard-break';

describe('HardBreak Node', () => {
  it('renders a self-closing <br>', async () => {
    await snapshotExtensionRender({
      extension: HardBreak as unknown as Parameters<
        typeof snapshotExtensionRender
      >[0]['extension'],
      node: { type: 'hardBreak' },
      style: {},
    });
  });
});
