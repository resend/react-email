import type { Editor } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';
import type { UseEditorImageOptions } from './types';

interface ExecuteUploadFlowParams {
  editor: Editor;
  file: File;
  uploadImage: UseEditorImageOptions['uploadImage'];
}

/**
 * Returns the attributes of the currently selected image node, or `undefined`
 * when the selection isn't a single image. Used to carry custom styling (e.g.
 * border radius, width/height/alignment/href/alt) over when replacing an image.
 */
function getSelectedImageAttrs(
  editor: Editor,
): Record<string, unknown> | undefined {
  const { selection } = editor.state;
  if (
    selection instanceof NodeSelection &&
    selection.node.type.name === 'image'
  ) {
    return selection.node.attrs;
  }
  return undefined;
}

export async function executeUploadFlow({
  editor,
  file,
  uploadImage,
}: ExecuteUploadFlowParams): Promise<void> {
  const blobUrl = URL.createObjectURL(file);

  // When replacing a selected image, preserve its existing attributes (custom
  // styling like border radius, etc.) and only override the src.
  const selectedImageAttrs = getSelectedImageAttrs(editor);

  editor
    .chain()
    .focus()
    .setImage({ ...selectedImageAttrs, src: blobUrl })
    .run();

  try {
    const { url } = await uploadImage(file);
    swapImageSrc(editor, blobUrl, url);
  } catch (error) {
    removeImageBySrc(editor, blobUrl);
    console.error(
      `Failed to upload image "${file.name}":`,
      error instanceof Error ? error : new Error(String(error)),
    );
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

function swapImageSrc(editor: Editor, oldSrc: string, newSrc: string): void {
  const { state } = editor;
  const { tr } = state;
  let found = false;

  state.doc.descendants((node, pos) => {
    if (found) return false;
    if (node.type.name === 'image' && node.attrs.src === oldSrc) {
      tr.setNodeMarkup(pos, undefined, { ...node.attrs, src: newSrc });
      found = true;
      return false;
    }
  });

  if (found) {
    editor.view.dispatch(tr);
  }
}

function removeImageBySrc(editor: Editor, src: string): void {
  const { state } = editor;
  const { tr } = state;
  let found = false;

  state.doc.descendants((node, pos) => {
    if (found) return false;
    if (node.type.name === 'image' && node.attrs.src === src) {
      tr.delete(pos, pos + node.nodeSize);
      found = true;
      return false;
    }
  });

  if (found) {
    editor.view.dispatch(tr);
  }
}
