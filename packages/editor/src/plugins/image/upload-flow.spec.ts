import type { Editor } from '@tiptap/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { editorEventBus } from '../../core/event-bus';
import { executeUploadFlow } from './upload-flow';

interface FakeImageNode {
  type: { name: 'image' };
  attrs: { src: string };
  nodeSize: number;
}

function makeFakeEditor(images: FakeImageNode[]) {
  const setNodeMarkup = vi.fn(
    (pos: number, _type: unknown, attrs: { src: string }) => {
      const idx = images.findIndex(
        (img) => img.attrs.src && pos === images.indexOf(img),
      );
      if (idx !== -1) images[idx] = { ...images[idx], attrs };
      return tr;
    },
  );
  const trDelete = vi.fn((pos: number, _end: number) => {
    images.splice(pos, 1);
    return tr;
  });

  const tr = { setNodeMarkup, delete: trDelete };

  const dispatch = vi.fn();

  const doc = {
    descendants: (
      cb: (node: FakeImageNode, pos: number) => undefined | boolean,
    ) => {
      images.forEach((node, pos) => {
        cb(node, pos);
      });
    },
  };

  const view = {
    dispatch,
    isDestroyed: false,
  };

  const setImage = vi.fn((attrs: { src: string }) => {
    images.push({
      type: { name: 'image' },
      attrs: { src: attrs.src },
      nodeSize: 1,
    });
    return chain;
  });

  const chain = {
    focus: () => chain,
    setImage,
    run: vi.fn(() => true),
  };

  const editor: Editor = {
    chain: () => chain,
    state: { doc, tr },
    view,
    isDestroyed: false,
  } as unknown as Editor;

  return { editor, dispatch, view, setImage, images };
}

describe('executeUploadFlow', () => {
  let originalCreate: typeof URL.createObjectURL;
  let originalRevoke: typeof URL.revokeObjectURL;
  const createObjectURL = vi.fn();
  const revokeObjectURL = vi.fn();

  beforeEach(() => {
    originalCreate = URL.createObjectURL;
    originalRevoke = URL.revokeObjectURL;
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = revokeObjectURL;
    createObjectURL.mockImplementation(() => 'blob:fake-url');
    revokeObjectURL.mockReset();
  });
  afterEach(() => {
    URL.createObjectURL = originalCreate;
    URL.revokeObjectURL = originalRevoke;
    vi.restoreAllMocks();
  });

  it('inserts an image with a blob src synchronously', async () => {
    const { editor, setImage } = makeFakeEditor([]);
    const file = new File(['x'], 'x.png', { type: 'image/png' });
    const uploadImage = vi.fn().mockResolvedValue({ url: 'https://cdn/x.png' });

    const promise = executeUploadFlow({ editor, file, uploadImage });

    expect(setImage).toHaveBeenCalledWith({ src: 'blob:fake-url' });
    await promise;
  });

  it('swaps blob src to remote URL on success', async () => {
    const { editor, dispatch, images } = makeFakeEditor([]);
    const file = new File(['x'], 'x.png', { type: 'image/png' });

    await executeUploadFlow({
      editor,
      file,
      uploadImage: () => Promise.resolve({ url: 'https://cdn/x.png' }),
    });

    expect(dispatch).toHaveBeenCalled();
    expect(images[0].attrs.src).toBe('https://cdn/x.png');
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:fake-url');
  });

  it('removes the inserted node when upload rejects', async () => {
    const { editor, images } = makeFakeEditor([]);
    const file = new File(['x'], 'x.png', { type: 'image/png' });

    await executeUploadFlow({
      editor,
      file,
      uploadImage: () => Promise.reject(new Error('boom')),
    });

    // The blob image should have been deleted by removeImageBySrc.
    expect(
      images.find((img) => img.attrs.src === 'blob:fake-url'),
    ).toBeUndefined();
  });

  it('dispatches image-upload-error on the editor event bus on failure', async () => {
    const handler = vi.fn();
    const sub = editorEventBus.on('image-upload-error', handler);
    const { editor } = makeFakeEditor([]);
    const file = new File(['x'], 'x.png', { type: 'image/png' });

    await executeUploadFlow({
      editor,
      file,
      uploadImage: () => Promise.reject(new Error('upload failed')),
    });

    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].fileName).toBe('x.png');
    expect(handler.mock.calls[0][0].error.message).toBe('upload failed');
    sub.unsubscribe();
  });

  it('does not dispatch when the editor is destroyed mid-flight', async () => {
    const { editor, dispatch, view } = makeFakeEditor([]);
    const file = new File(['x'], 'x.png', { type: 'image/png' });

    const uploadImage = () =>
      new Promise<{ url: string }>((resolve) => {
        setTimeout(() => {
          // Simulate destroy before resolution lands.
          (editor as unknown as { isDestroyed: boolean }).isDestroyed = true;
          (view as unknown as { isDestroyed: boolean }).isDestroyed = true;
          resolve({ url: 'https://cdn/x.png' });
        }, 0);
      });

    dispatch.mockClear(); // ignore the initial setImage chain
    await executeUploadFlow({ editor, file, uploadImage });

    // No dispatch should occur after destroy: the swap path was skipped.
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('aborts before the upload starts when signal is already aborted', async () => {
    const { editor, images } = makeFakeEditor([]);
    const file = new File(['x'], 'x.png', { type: 'image/png' });
    const controller = new AbortController();
    controller.abort();
    const uploadImage = vi.fn().mockResolvedValue({ url: 'https://cdn/x.png' });

    await executeUploadFlow({
      editor,
      file,
      uploadImage,
      signal: controller.signal,
    });

    expect(
      images.find((img) => img.attrs.src === 'blob:fake-url'),
    ).toBeUndefined();
  });

  it('does not dispatch image-upload-error when upload rejects after abort', async () => {
    const handler = vi.fn();
    const sub = editorEventBus.on('image-upload-error', handler);
    const { editor } = makeFakeEditor([]);
    const file = new File(['x'], 'x.png', { type: 'image/png' });
    const controller = new AbortController();

    const uploadImage = () =>
      new Promise<{ url: string }>((_, reject) => {
        controller.abort();
        reject(new Error('aborted'));
      });

    await executeUploadFlow({
      editor,
      file,
      uploadImage,
      signal: controller.signal,
    });

    expect(handler).not.toHaveBeenCalled();
    sub.unsubscribe();
  });

  it('removes all matching nodes (regression for the "first match" bug)', async () => {
    // Previously the descendant scan returned false after finding the
    // first match, so duplicated images sharing one blob src lost only
    // the first one when the upload failed.
    const { editor, images } = makeFakeEditor([
      { type: { name: 'image' }, attrs: { src: 'blob:dup' }, nodeSize: 1 },
      { type: { name: 'image' }, attrs: { src: 'blob:dup' }, nodeSize: 1 },
    ]);

    // Simulate the same blob URL: createObjectURL returns the duplicated id.
    createObjectURL.mockReturnValueOnce('blob:dup');

    await executeUploadFlow({
      editor,
      file: new File(['x'], 'x.png', { type: 'image/png' }),
      uploadImage: () => Promise.reject(new Error('boom')),
    });

    // None of the dup blob images should remain.
    expect(images.filter((img) => img.attrs.src === 'blob:dup')).toEqual([]);
  });
});
