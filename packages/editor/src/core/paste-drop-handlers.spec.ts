import { describe, expect, it, vi } from 'vitest';
import { createDropHandler } from './create-drop-handler';
import { createPasteHandler } from './create-paste-handler';

// Stub out generateJSON: it needs a real schema that includes a `doc` node.
// We're testing the handler's control flow, not JSON generation.
vi.mock('@tiptap/html', () => ({
  generateJSON: vi.fn().mockReturnValue({ type: 'doc', content: [] }),
}));

describe('createDropHandler', () => {
  function makeView(spy: ReturnType<typeof vi.fn>) {
    return {
      state: {
        doc: { textContent: '' },
        selection: { from: 0 },
        schema: {
          nodeFromJSON: vi.fn().mockReturnValue({ type: 'paragraph' }),
        },
        tr: { replaceSelectionWith: vi.fn().mockReturnThis() },
      },
      dispatch: spy,
    } as never;
  }

  function makeDataTransfer({
    files = [] as File[],
    html = '',
    text = '',
  }: {
    files?: File[];
    html?: string;
    text?: string;
  } = {}) {
    return {
      files,
      getData: (type: string) =>
        type === 'text/html' ? html : type === 'text/plain' ? text : '',
    };
  }

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
        dataTransfer: makeDataTransfer({
          files: [
            new File(['<html></html>'], 'template.html', { type: 'text/html' }),
          ],
        }),
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
        dataTransfer: makeDataTransfer({
          files: [new File(['image'], 'photo.png', { type: 'image/png' })],
        }),
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

  it('sanitizes and inserts text/html drops when extensions are provided', () => {
    // Regression: HTML drops used to fall through to ProseMirror's default
    // path, bypassing sanitizePastedHtml — the seam behind MES-461
    // ("Dragging editor block removes callout styling") and the open P0
    // for drag content blocks.
    const dispatch = vi.fn();
    const view = makeView(dispatch);
    const preventDefault = vi.fn();
    const handler = createDropHandler({ extensions: [] });
    const handled = handler(
      view,
      {
        dataTransfer: makeDataTransfer({
          html: '<p>dropped html</p>',
        }),
        preventDefault,
      } as unknown as DragEvent,
      null,
      false,
    );

    expect(handled).toBe(true);
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(dispatch).toHaveBeenCalledOnce();
  });

  it('sanitizes and inserts plain-text drops as a paragraph', () => {
    const dispatch = vi.fn();
    const view = makeView(dispatch);
    const handler = createDropHandler({ extensions: [] });
    const handled = handler(
      view,
      {
        dataTransfer: makeDataTransfer({ text: 'hello world' }),
        preventDefault: vi.fn(),
      } as unknown as DragEvent,
      null,
      false,
    );

    expect(handled).toBe(true);
    expect(dispatch).toHaveBeenCalledOnce();
  });

  it('does not call onPaste on internal block reorders (moved=true)', () => {
    const onPaste = vi.fn();
    const handler = createDropHandler({ onPaste, extensions: [] });
    const handled = handler(
      {} as never,
      {
        dataTransfer: makeDataTransfer({ html: '<p>x</p>' }),
        preventDefault: vi.fn(),
      } as unknown as DragEvent,
      null,
      true,
    );

    expect(handled).toBe(false);
    expect(onPaste).not.toHaveBeenCalled();
  });

  it('returns false when dataTransfer is missing', () => {
    const handler = createDropHandler({ extensions: [] });
    const handled = handler(
      {} as never,
      {
        dataTransfer: null,
        preventDefault: vi.fn(),
      } as unknown as DragEvent,
      null,
      false,
    );

    expect(handled).toBe(false);
  });

  it('falls back to legacy behavior when extensions are omitted', () => {
    // Backward compat: existing call sites that only configured file drops
    // should still work without sanitizing HTML drops.
    const handler = createDropHandler({});
    const handled = handler(
      {} as never,
      {
        dataTransfer: makeDataTransfer({ html: '<p>x</p>' }),
        preventDefault: vi.fn(),
      } as unknown as DragEvent,
      null,
      false,
    );

    expect(handled).toBe(false);
  });
});

describe('createPasteHandler', () => {
  function makeView(spy: ReturnType<typeof vi.fn>) {
    const fakeNode = { type: 'paragraph' };
    return {
      state: {
        doc: { textContent: '' },
        selection: { from: 2 },
        schema: { nodeFromJSON: vi.fn().mockReturnValue(fakeNode) },
        tr: { replaceSelectionWith: vi.fn().mockReturnThis() },
      },
      dispatch: spy,
    } as never;
  }

  function makeClipboardEvent({
    text = '',
    html = '',
    files = [] as File[],
    preventDefault = vi.fn(),
  }: {
    text?: string;
    html?: string;
    files?: File[];
    preventDefault?: ReturnType<typeof vi.fn>;
  } = {}) {
    return {
      clipboardData: {
        getData: (type: string) =>
          type === 'text/plain' ? text : type === 'text/html' ? html : '',
        files,
      },
      preventDefault,
    } as unknown as ClipboardEvent;
  }

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
      makeClipboardEvent({ text: 'hello world', preventDefault }),
      { content: { childCount: 1 } } as never,
    );

    expect(handled).toBe(false);
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it('short-circuits and prevents default when onPaste consumes plain text', () => {
    const preventDefault = vi.fn();
    const handler = createPasteHandler({
      onPaste: () => true,
      extensions: [],
    });
    const handled = handler(
      {} as never,
      makeClipboardEvent({ text: 'hello', preventDefault }),
      { content: { childCount: 1 } } as never,
    );

    expect(handled).toBe(true);
    expect(preventDefault).toHaveBeenCalledOnce();
  });

  it('routes file payloads through onPaste', () => {
    const preventDefault = vi.fn();
    const onPaste = vi.fn().mockReturnValue(true);
    const file = new File(['x'], 'x.png', { type: 'image/png' });
    const handler = createPasteHandler({ onPaste, extensions: [] });
    const handled = handler(
      {} as never,
      makeClipboardEvent({ files: [file], preventDefault }),
      { content: { childCount: 1 } } as never,
    );

    expect(handled).toBe(true);
    expect(onPaste).toHaveBeenCalledWith(file, expect.anything());
    expect(preventDefault).toHaveBeenCalledOnce();
  });

  it('sanitizes single-node text/html pastes (no childCount short-circuit)', () => {
    // Regression: previously, slice.content.childCount === 1 caused the
    // handler to return false and let ProseMirror's default paste run,
    // bypassing sanitizePastedHtml. This is the bug behind MES-490 and
    // MES-472.
    const preventDefault = vi.fn();
    const dispatch = vi.fn();
    const view = makeView(dispatch);
    const handler = createPasteHandler({ extensions: [] });
    const handled = handler(
      view,
      makeClipboardEvent({
        html: '<p style="color:red" onclick="alert(1)">x</p>',
        preventDefault,
      }),
      { content: { childCount: 1 } } as never,
    );

    expect(handled).toBe(true);
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(dispatch).toHaveBeenCalledOnce();
  });

  it('dispatches exactly one transaction per text/html paste', () => {
    const dispatch = vi.fn();
    const view = makeView(dispatch);
    const handler = createPasteHandler({ extensions: [] });
    handler(
      view,
      makeClipboardEvent({ html: '<p>hello</p>' }),
      { content: { childCount: 3 } } as never,
    );
    expect(dispatch).toHaveBeenCalledOnce();
  });

  it('returns false and does not preventDefault when clipboardData is missing', () => {
    const preventDefault = vi.fn();
    const handler = createPasteHandler({ extensions: [] });
    const handled = handler(
      {} as never,
      { clipboardData: undefined, preventDefault } as unknown as ClipboardEvent,
      { content: { childCount: 0 } } as never,
    );

    expect(handled).toBe(false);
    expect(preventDefault).not.toHaveBeenCalled();
  });
});
