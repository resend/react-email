/* @vitest-environment jsdom */

import { describe, expect, it } from 'vitest';
import { compressImage } from './upload-image';

vi.mock('@/db/main', () => ({
  db: {
    query: {},
  },
}));

vi.mock('@/actions/ai', () => ({
  uploadImageViaAI: vi.fn(),
}));

describe('compressImage', () => {
  it('returns null for GIF to preserve animation and format', async () => {
    const file = new File([new Uint8Array([71, 73, 70])], 'big.gif', {
      type: 'image/gif',
      lastModified: Date.now(),
    });

    const result = await compressImage(file);
    expect(result).toBeNull();
  });
});
