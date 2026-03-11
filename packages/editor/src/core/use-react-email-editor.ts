import type { Content, Editor as EditorClass, Extensions } from '@tiptap/core';
import { UndoRedo } from '@tiptap/extensions';

import { useEditor, useEditorState } from '@tiptap/react';
import * as React from 'react';
import { coreExtensions } from '../extensions/index.js';
import { createDropHandler } from './create-drop-handler.js';
import {
  createPasteHandler,
  type PasteHandler,
  type UploadImageHandler,
} from './create-paste-handler.js';
import { isDocumentVisuallyEmpty } from './is-document-visually-empty.js';

const COLLABORATION_EXTENSION_NAMES = new Set([
  'liveblocksExtension',
  'collaboration',
]);

function hasCollaborationExtension(exts: Extensions): boolean {
  return exts.some((ext) => COLLABORATION_EXTENSION_NAMES.has(ext.name));
}

export function useReactEmailEditor({
  content,
  extensions = [],
  onUpdate,
  onPaste,
  onUploadImage,
  onReady,
  editable = true,
}: {
  content: Content;
  extensions?: Extensions;
  onUpdate?: (
    editor: EditorClass,
    transaction: { getMeta: (key: string) => unknown },
  ) => void;
  onPaste: PasteHandler;
  onUploadImage: UploadImageHandler;
  onReady?: (editor: EditorClass | null) => void;
  editable?: boolean;
}) {
  const [contentError, setContentError] = React.useState<Error | null>(null);

  const isCollaborative = hasCollaborationExtension(extensions);

  const effectiveExtension = React.useMemo(
    () => [
      ...coreExtensions,
      // Collaboration extensions handle their own undo/redo history,
      // so we only add TipTap's History extension for non-collaborative editors.
      ...(isCollaborative ? [] : [UndoRedo]),
      ...extensions,
    ],
    [extensions, isCollaborative],
  );

  const editor = useEditor({
    content: isCollaborative ? undefined : content,
    extensions: effectiveExtension,
    immediatelyRender: false,
    enableContentCheck: true,
    onContentError({ editor, error, disableCollaboration }) {
      disableCollaboration();
      setContentError(error);
      console.error(error);
      editor.setEditable(false);
    },
    editable,
    onCreate({ editor }) {
      onReady?.(editor);
    },
    onUpdate({ editor, transaction }) {
      onUpdate?.(editor, transaction);
    },
    editorProps: {
      handleDOMEvents: {
        // Keep link behavior interception for view mode only.
        click: (view, event) => {
          if (!view.editable) {
            const target = event.target as HTMLElement;
            const link = target.closest('a');
            if (link) {
              event.preventDefault();
              return true;
            }
          }
          return false;
        },
      },
      handlePaste: createPasteHandler({
        onPaste,
        onUploadImage,
        extensions,
      }),
      handleDrop: createDropHandler({
        onPaste,
        onUploadImage,
      }),
    },
  });

  const isEditorEmpty = useEditorState({
    editor,
    selector: (context) => {
      if (!context.editor) {
        return true;
      }

      return isDocumentVisuallyEmpty(context.editor.state.doc);
    },
  });

  return {
    editor,
    isEditorEmpty: isEditorEmpty ?? true,
    extensions: effectiveExtension,
    contentError,
    isCollaborative,
  };
}
