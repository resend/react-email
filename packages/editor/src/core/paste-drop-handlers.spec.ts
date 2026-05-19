import { describe, expect, it, vi } from 'vitest';
import { createDropHandler } from './create-drop-handler';
import { createPasteHandler } from './create-paste-handler';

describe('createDropHandler', () => {
  it('consumes the drop when onPaste accepts it', () => {
    const handler = createDropHandler({
      onPaste: () => true,
    });
    const preventDefault = vi.fn();
    const handled = handler(
      {
        state: { doc: { textContent: '' } },
      } as never,
      {
        dataTransfer: {
          files: [
            new File(['<html></html>'], 'template.html', { type: 'text/html' }),
          ],
        },
        preventDefault,
      } as unknown as DragEvent,
      null,
      false,
    );

    expect(handled).toBe(true);
    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it('returns false when onPaste declines the drop', () => {
    const handler = createDropHandler({
      onPaste: () => false,
    });
    const preventDefault = vi.fn();
    const handled = handler(
      {
        state: { doc: { textContent: '' } },
        posAtCoords: vi.fn().mockReturnValue({ pos: 5 }),
      } as never,
      {
        dataTransfer: {
          files: [new File(['image'], 'photo.png', { type: 'image/png' })],
        },
        preventDefault,
        clientX: 10,
        clientY: 20,
      } as unknown as DragEvent,
      null,
      false,
    );

    expect(handled).toBe(false);
    expect(preventDefault).toHaveBeenCalledTimes(1);
  });
});

describe('createPasteHandler', () => {
  it('lets plain text fall through when the caller explicitly declines it', () => {
    const preventDefault = vi.fn();
    const handler = createPasteHandler({
      onPaste: () => false,
      extensions: [],
    });
    const handled = handler(
      {
        state: {
          doc: { textContent: '' },
          selection: { from: 2 },
        },
      } as never,
      {
        clipboardData: {
          getData: (type: string) =>
            type === 'text/plain' ? 'hello world' : '',
          files: [],
        },
        preventDefault,
      } as unknown as ClipboardEvent,
      {
        content: { childCount: 1 },
      } as never,
    );

    expect(handled).toBe(false);
    expect(preventDefault).not.toHaveBeenCalled();
  });
});
