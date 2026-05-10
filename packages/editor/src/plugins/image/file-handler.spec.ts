import type { Editor } from '@tiptap/core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createImageFileHandlerPlugin } from './file-handler';

const executeUploadFlowMock = vi.fn();
vi.mock('./upload-flow', () => ({
  executeUploadFlow: (...args: unknown[]) => executeUploadFlowMock(...args),
}));

describe('createImageFileHandlerPlugin', () => {
  const fakeEditor = {} as Editor;
  const uploadImage = vi.fn();

  afterEach(() => {
    executeUploadFlowMock.mockClear();
    uploadImage.mockClear();
  });

  function getProps() {
    const plugin = createImageFileHandlerPlugin(fakeEditor, uploadImage);
    // Plugin internals are private; we exercise the props directly.
    return (plugin as unknown as { props: { handlePaste: Function; handleDrop: Function } }).props;
  }

  describe('handlePaste', () => {
    it('triggers the upload flow for image files', () => {
      const file = new File(['x'], 'pic.png', { type: 'image/png' });
      const preventDefault = vi.fn();
      const handled = getProps().handlePaste(
        {} as never,
        {
          clipboardData: { files: [file] },
          preventDefault,
        },
      );

      expect(handled).toBe(true);
      expect(preventDefault).toHaveBeenCalledOnce();
      expect(executeUploadFlowMock).toHaveBeenCalledWith(
        expect.objectContaining({ editor: fakeEditor, file, uploadImage }),
      );
    });

    it('skips non-image MIME types', () => {
      const file = new File(['x'], 'doc.pdf', { type: 'application/pdf' });
      const handled = getProps().handlePaste(
        {} as never,
        { clipboardData: { files: [file] }, preventDefault: vi.fn() },
      );
      expect(handled).toBe(false);
      expect(executeUploadFlowMock).not.toHaveBeenCalled();
    });

    it('skips when clipboardData is missing', () => {
      const handled = getProps().handlePaste(
        {} as never,
        { clipboardData: null, preventDefault: vi.fn() },
      );
      expect(handled).toBe(false);
    });

    it('skips when there are no files', () => {
      const handled = getProps().handlePaste(
        {} as never,
        { clipboardData: { files: [] }, preventDefault: vi.fn() },
      );
      expect(handled).toBe(false);
    });
  });

  describe('handleDrop', () => {
    it('triggers the upload flow for image drops', () => {
      const file = new File(['x'], 'pic.png', { type: 'image/png' });
      const handled = getProps().handleDrop(
        {} as never,
        { dataTransfer: { files: [file] }, preventDefault: vi.fn() },
        null,
        false,
      );
      expect(handled).toBe(true);
      expect(executeUploadFlowMock).toHaveBeenCalledOnce();
    });

    it('skips internal block reorders (moved=true)', () => {
      const file = new File(['x'], 'pic.png', { type: 'image/png' });
      const handled = getProps().handleDrop(
        {} as never,
        { dataTransfer: { files: [file] }, preventDefault: vi.fn() },
        null,
        true,
      );
      expect(handled).toBe(false);
      expect(executeUploadFlowMock).not.toHaveBeenCalled();
    });

    it('skips non-image MIME types on drop', () => {
      const file = new File(['x'], 'doc.pdf', { type: 'application/pdf' });
      const handled = getProps().handleDrop(
        {} as never,
        { dataTransfer: { files: [file] }, preventDefault: vi.fn() },
        null,
        false,
      );
      expect(handled).toBe(false);
    });

    it('skips when dataTransfer is missing', () => {
      const handled = getProps().handleDrop(
        {} as never,
        { dataTransfer: null, preventDefault: vi.fn() },
        null,
        false,
      );
      expect(handled).toBe(false);
    });
  });
});
