import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { executeUploadFlow } from './upload-flow';

const createMockEditor = () => {
  const state = {
    nodes: new Map<string, { pos: number; attrs: Record<string, string> }>(),
  };

  const editor = {
    chain: vi.fn().mockReturnThis(),
    focus: vi.fn().mockReturnThis(),
    setImage: vi.fn().mockImplementation((attrs: Record<string, string>) => {
      state.nodes.set(attrs.src, { pos: 0, attrs });
      return editor;
    }),
    run: vi.fn().mockReturnValue(true),
    state: {
      doc: {
        descendants: vi.fn(
          (cb: (node: any, pos: number) => boolean | void) => {
            for (const [src, data] of state.nodes) {
              cb({ type: { name: 'image' }, attrs: data.attrs }, data.pos);
            }
          },
        ),
      },
      tr: {
        setNodeMarkup: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
      },
    },
    view: {
      dispatch: vi.fn(),
    },
    _state: state,
  };
  return editor;
};

describe('executeUploadFlow', () => {
  const originalCreateObjectURL = globalThis.URL.createObjectURL;
  const originalRevokeObjectURL = globalThis.URL.revokeObjectURL;

  beforeEach(() => {
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    globalThis.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    globalThis.URL.createObjectURL = originalCreateObjectURL;
    globalThis.URL.revokeObjectURL = originalRevokeObjectURL;
  });

  it('inserts image with blob URL then swaps to final URL on success', async () => {
    const editor = createMockEditor();
    const file = new File([''], 'test.png', { type: 'image/png' });
    const uploadImage = vi.fn().mockResolvedValue({ url: 'https://cdn.example.com/test.png' });

    await executeUploadFlow({ editor: editor as any, file, uploadImage });

    expect(editor.chain).toHaveBeenCalled();
    expect(editor.setImage).toHaveBeenCalledWith(
      expect.objectContaining({ src: 'blob:mock-url' }),
    );
    expect(uploadImage).toHaveBeenCalledWith(file);
    expect(editor.state.tr.setNodeMarkup).toHaveBeenCalledWith(
      0,
      undefined,
      expect.objectContaining({ src: 'https://cdn.example.com/test.png' }),
    );
    expect(editor.view.dispatch).toHaveBeenCalled();
    expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('removes node and calls onUploadError on failure', async () => {
    const editor = createMockEditor();
    const file = new File([''], 'test.png', { type: 'image/png' });
    const error = new Error('Network error');
    const uploadImage = vi.fn().mockRejectedValue(error);
    const onUploadError = vi.fn();

    await executeUploadFlow({
      editor: editor as any,
      file,
      uploadImage,
      onUploadError,
    });

    expect(onUploadError).toHaveBeenCalledWith(error, file);
    expect(editor.state.tr.delete).toHaveBeenCalled();
    expect(editor.view.dispatch).toHaveBeenCalled();
    expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('removes node on failure even without onUploadError', async () => {
    const editor = createMockEditor();
    const file = new File([''], 'test.png', { type: 'image/png' });
    const uploadImage = vi.fn().mockRejectedValue(new Error('fail'));

    await expect(
      executeUploadFlow({ editor: editor as any, file, uploadImage }),
    ).resolves.not.toThrow();

    expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });
});
