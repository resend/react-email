import { Slice } from '@tiptap/pm/model';
import { describe, expect, it, vi } from 'vitest';
import { createDropHandler } from './create-drop-handler';
import { createPasteHandler } from './create-paste-handler';

vi.mock('@tiptap/html', () => ({
  generateJSON: vi.fn(() => ({ type: 'doc', content: [] })),
}));

vi.mock('../utils/paste-sanitizer', () => ({
  sanitizePastedHtml: vi.fn((html: string) => html),
}));

describe('createDropHandler', () => {
  it('uploads dropped images when auto-import declines synchronously', () => {
    const onUploadImage = vi.fn();
    const handler = createDropHandler({
      onPaste: () => false,
      onUploadImage,
    });
    const file = new File(['image'], 'photo.png', { type: 'image/png' });
    const preventDefault = vi.fn();
    const posAtCoords = vi.fn().mockReturnValue({ pos: 5 });
    const handled = handler(
      {
        state: { doc: { textContent: '' } },
        posAtCoords,
      } as never,
      {
        dataTransfer: { files: [file] },
        preventDefault,
        clientX: 10,
        clientY: 20,
      } as unknown as DragEvent,
      null,
      false,
    );

    expect(handled).toBe(true);
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(posAtCoords).toHaveBeenCalledWith({ left: 10, top: 20 });
    expect(onUploadImage).toHaveBeenCalledWith(file, expect.anything(), 4);
  });

  it('consumes the drop when auto-import accepts it', () => {
    const onUploadImage = vi.fn();
    const handler = createDropHandler({
      onPaste: () => true,
      onUploadImage,
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
    expect(onUploadImage).not.toHaveBeenCalled();
  });
});

describe('createPasteHandler', () => {
  it('lets plain text fall through when the caller explicitly declines it', () => {
    const preventDefault = vi.fn();
    const handler = createPasteHandler({
      onPaste: () => false,
      onUploadImage: vi.fn(),
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

  it('inserts doc content as a slice for multi-block HTML paste', async () => {
    const { generateJSON } = await import('@tiptap/html');
    const mockedGenerateJSON = vi.mocked(generateJSON);

    const fakeContent = {
      size: 2,
      childCount: 2,
    };

    mockedGenerateJSON.mockReturnValueOnce({
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'One' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Two' }] },
      ],
    });

    const replaceSelection = vi
      .fn()
      .mockReturnValue({ scrollIntoView: vi.fn() });
    const replaceSelectionWith = vi.fn();
    const dispatch = vi.fn();
    const preventDefault = vi.fn();

    const handler = createPasteHandler({
      onPaste: () => false,
      onUploadImage: vi.fn(),
      extensions: [],
    });

    const handled = handler(
      {
        state: {
          schema: {
            nodeFromJSON: vi.fn().mockReturnValue({
              type: { name: 'doc' },
              content: fakeContent,
            }),
          },
          tr: { replaceSelection, replaceSelectionWith },
          selection: { from: 0 },
        },
        dispatch,
      } as never,
      {
        clipboardData: {
          getData: (type: string) =>
            type === 'text/html'
              ? '<p>One</p><p>Two</p>'
              : type === 'text/plain'
                ? 'One\nTwo'
                : '',
          files: [],
        },
        preventDefault,
      } as unknown as ClipboardEvent,
      { content: { childCount: 2 } } as never,
    );

    expect(handled).toBe(true);
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(replaceSelection).toHaveBeenCalledTimes(1);
    expect(replaceSelection).toHaveBeenCalledWith(expect.any(Slice));
    expect(replaceSelectionWith).not.toHaveBeenCalled();
  });

  it('inserts non-doc node with replaceSelectionWith', async () => {
    const { generateJSON } = await import('@tiptap/html');
    const mockedGenerateJSON = vi.mocked(generateJSON);

    mockedGenerateJSON.mockReturnValueOnce({
      type: 'paragraph',
      content: [{ type: 'text', text: 'Hello' }],
    });

    const fakeNode = { type: { name: 'paragraph' } };
    const replaceSelection = vi.fn();
    const replaceSelectionWith = vi
      .fn()
      .mockReturnValue({ scrollIntoView: vi.fn() });
    const dispatch = vi.fn();
    const preventDefault = vi.fn();

    const handler = createPasteHandler({
      onPaste: () => false,
      onUploadImage: vi.fn(),
      extensions: [],
    });

    const handled = handler(
      {
        state: {
          schema: {
            nodeFromJSON: vi.fn().mockReturnValue(fakeNode),
          },
          tr: { replaceSelection, replaceSelectionWith },
          selection: { from: 0 },
        },
        dispatch,
      } as never,
      {
        clipboardData: {
          getData: (type: string) =>
            type === 'text/html'
              ? '<p>Hello</p>'
              : type === 'text/plain'
                ? 'Hello'
                : '',
          files: [],
        },
        preventDefault,
      } as unknown as ClipboardEvent,
      { content: { childCount: 2 } } as never,
    );

    expect(handled).toBe(true);
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(replaceSelectionWith).toHaveBeenCalledWith(fakeNode, false);
    expect(replaceSelection).not.toHaveBeenCalled();
  });
});
