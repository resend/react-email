import type { Editor } from '@tiptap/core';
import { editorEventBus } from '../../core/event-bus';
import type { UseEditorImageOptions } from './types';

interface ExecuteUploadFlowParams {
  editor: Editor;
  file: File;
  uploadImage: UseEditorImageOptions['uploadImage'];
  /**
   * Optional abort signal. When aborted, the inserted blob image is
   * removed and no further dispatches happen. The editor's destroy
   * lifecycle should hook this up.
   */
  signal?: AbortSignal;
}

/**
 * Inserts an image with a temporary blob src, awaits the real upload,
 * then swaps every node carrying that blob to the uploaded URL.
 *
 * Failure modes routed through this function:
 *  - upload rejection: removes any nodes still pointing at the blob
 *  - editor destroyed mid-flight: skips dispatch (no throw)
 *  - abort signal fired: same as destroyed
 *
 * Errors are emitted on the editor event bus as `image-upload-error`,
 * not via console.error, so consumers can surface a toast.
 */
export async function executeUploadFlow({
  editor,
  file,
  uploadImage,
  signal,
}: ExecuteUploadFlowParams): Promise<void> {
  const blobUrl = URL.createObjectURL(file);

  editor.chain().focus().setImage({ src: blobUrl }).run();

  try {
    if (signal?.aborted) {
      removeImageBySrc(editor, blobUrl);
      return;
    }
    const { url } = await uploadImage(file);
    if (signal?.aborted) {
      removeImageBySrc(editor, blobUrl);
      return;
    }
    swapImageSrc(editor, blobUrl, url);
  } catch (error) {
    removeImageBySrc(editor, blobUrl);
    if (signal?.aborted) {
      // Aborted uploads aren't user-facing failures; don't surface a toast.
      return;
    }
    const wrapped = error instanceof Error ? error : new Error(String(error));
    editorEventBus.dispatch('image-upload-error', {
      fileName: file.name,
      error: wrapped,
    });
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

function isEditorAlive(editor: Editor): boolean {
  return (
    !editor.isDestroyed && Boolean(editor.view) && !editor.view.isDestroyed
  );
}

function swapImageSrc(editor: Editor, oldSrc: string, newSrc: string): void {
  if (!isEditorAlive(editor)) return;
  const { state } = editor;
  const { tr } = state;
  let found = false;

  state.doc.descendants((node, pos) => {
    if (node.type.name === 'image' && node.attrs.src === oldSrc) {
      tr.setNodeMarkup(pos, undefined, { ...node.attrs, src: newSrc });
      found = true;
    }
  });

  if (found) {
    editor.view.dispatch(tr);
  }
}

function removeImageBySrc(editor: Editor, src: string): void {
  if (!isEditorAlive(editor)) return;
  const { state } = editor;
  const { tr } = state;
  // Collect positions first so deletions don't invalidate the iteration.
  const positions: Array<{ pos: number; size: number }> = [];

  state.doc.descendants((node, pos) => {
    if (node.type.name === 'image' && node.attrs.src === src) {
      positions.push({ pos, size: node.nodeSize });
    }
  });

  if (positions.length === 0) return;

  // Delete from the end backwards so earlier positions stay valid.
  for (let i = positions.length - 1; i >= 0; i -= 1) {
    const { pos, size } = positions[i];
    tr.delete(pos, pos + size);
  }

  editor.view.dispatch(tr);
}
