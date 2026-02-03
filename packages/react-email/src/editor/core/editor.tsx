/**
 * -> Don't skip this section. <-
 *
 * Important: this file mounts the Editor component which used in multiple
 * places in the app (homepage, broadcast editor and unsubscribe editor).
 *
 * Implementing new features, making changes to this file can have
 * unexpected side effects. So, make sure test the all the mentioned
 * pages before merging to production.
 */

import { useLiveblocksExtension } from '@liveblocks/react-tiptap';
import type { Content, Editor as EditorClass } from '@tiptap/core';
import { generateJSON } from '@tiptap/html';
import {
  EditorContent,
  EditorContext,
  useEditor,
  useEditorState,
} from '@tiptap/react';
import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from '@/ui/button';
import * as Dialog from '@/ui/dialog';
import { Text } from '@/ui/text';
import { removePrismTheme } from '@/utils/prism-utils';
import { useEditorStyles } from '../plugins/theming/context';
import './editor.css';
import { useErrorListener } from '@liveblocks/react/suspense';
import Link from 'next/link';
import type { ContextProperties } from '@/types/editor/styles';
import { showToast } from '@/ui/toast';
import {
  getFileExtension,
  inferFileTypeFromContent,
  isSupportedFileExtension,
} from '@/utils/templates/import-helpers';
import { coreExtensions } from '../extensions';
import {
  SlashCommand,
  SlashCommandTemplate,
} from '../extensions/slash-command';
import { startImageUpload } from '../extensions/upload-image';
import { Conditional } from '../plugins/templating/conditional';
import { Loop } from '../plugins/templating/loop';
import { PREVIEW_THEME_OVERWRITE } from '../plugins/theming/themes';
import { Variable } from '../plugins/variables/extension';
import type { ImportPayload } from '../ui/dialogs/import-template';
import {
  EditorEmptyStateBroadcast,
  EditorEmptyStateTemplate,
} from '../ui/empty-state';

export type EditorRef = {
  getEditor: () => EditorClass | null;
};

export const EDITOR_CONTENT_ID = 'editor-content';
const EDITOR_CONTENT_CONTAINER_ID = 'editor-content-container';

export function Editor({
  content,
  onUpdate,
  onDebouncedUpdate,
  onPasteCapture,
  onImport,
  onEditorReady,
  ref,
  metadata,
  editable = true,
  hasLiveblocks = true,
  children,
}: {
  content: Content;
  onUpdate?: (editor: EditorClass, context: ContextProperties) => void;
  onDebouncedUpdate: (
    editor: EditorClass,
    context: ContextProperties,
  ) => void | Promise<void>;
  onPasteCapture: (text: string) => Promise<boolean> | boolean;
  onImport?: (props: ImportPayload) => void;
  onEditorReady?: (editor: EditorClass | null) => void;
  ref?: React.Ref<EditorRef>;
  metadata?: {
    objectType: 'broadcast' | 'template';
    objectId: string;
    config?: {
      enableTemplateLanguage?: boolean;
    };
  };
  editable?: boolean;
  hasLiveblocks?: boolean;
  /** Children rendered inside EditorContext.Provider (e.g., sidebars) */
  children?: React.ReactNode;
}) {
  const editorStyles = useEditorStyles();
  const [error, setError] = React.useState<Error | null>(null);

  // Always call the hook unconditionally to follow React's rules of hooks
  const liveblocks = useLiveblocksExtension({
    initialContent: content,
    comments: false,
    mentions: false,
    ai: false,
  });

  useErrorListener((error) => {
    switch (error.context.type) {
      case 'LARGE_MESSAGE_ERROR': {
        showToast({
          title: 'Large Message Error',
          description: 'The message you are trying to send is too large.',
          appearance: 'red',
        });
      }

      default:
        // Ignore any error from the future
        break;
    }
  });

  const editor = useEditor({
    content: undefined,
    extensions: coreExtensions([
      // TODO: move extended extensions to the next layer
      // the app consumer must provide their own extensions
      ...(hasLiveblocks ? [liveblocks] : []),
      ...((metadata?.config?.enableTemplateLanguage ?? false)
        ? [Variable, Loop, Conditional, SlashCommandTemplate]
        : [Variable, SlashCommand]),
    ]),
    immediatelyRender: false,
    enableContentCheck: true,
    onContentError({ editor, error, disableCollaboration }) {
      disableCollaboration();
      setError(error);
      console.error(error);
      editor.setEditable(false);
    },
    editorProps: {
      handleDOMEvents: {
        keydown: (_view, event) => {
          // prevent default event listeners from firing when slash command is active
          if (['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
            const slashCommand = document.querySelector('#slash-command');
            if (slashCommand) {
              return true;
            }
          }
        },
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
      handlePaste: (view, event, slice) => {
        const isEmpty = view.state.doc.textContent === '';

        // If document is empty, try to import React-email or HTML
        if (onPasteCapture && isEmpty) {
          const text = event.clipboardData?.getData('text/plain');

          if (text) {
            const fileType = inferFileTypeFromContent(text);
            if (fileType) {
              event.preventDefault();

              // Kick off async import in background
              // (don't await because `handlePaste` cannot be async)
              Promise.resolve(onPasteCapture(text)).catch((error) => {
                console.error('Paste text capture error:', error);
              });

              return true;
            }
          }
        }

        if (event.clipboardData?.files?.[0]) {
          event.preventDefault();

          const file = event.clipboardData.files[0];
          const extension = getFileExtension(file.name);

          // Import React-email or HTML
          if (isSupportedFileExtension(extension) && onPasteCapture) {
            Promise.resolve(
              (async () => {
                const text = await file.text();
                return onPasteCapture(text);
              })(),
            ).catch((error) => {
              console.error('Paste file capture error:', error);
            });

            return true;
          }

          // Upload image
          if (file.type.includes('image/')) {
            const pos = view.state.selection.from;
            startImageUpload(file, view, pos, undefined, metadata);

            return true;
          }
        }

        /**
         * If the coming content has a single child, we can assume
         * it's a plain text and doesn't need to be parsed and
         * be introduced in a new line
         */
        if (slice.content.childCount === 1) {
          return false;
        }

        if (event.clipboardData?.getData?.('text/html')) {
          event.preventDefault();
          const html = event.clipboardData.getData('text/html');

          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');

          const elements = doc.body.querySelectorAll('*');
          elements.forEach((el) => {
            if (el instanceof HTMLElement) {
              const style = el.style;
              // List of styles that editor don't support
              style.removeProperty('margin');
              style.removeProperty('white-space');

              if (el.tagName.toLowerCase() === 'a') {
                style.removeProperty('color');
              }
            }
          });

          // Convert the sanitized HTML back into a format that the editor can handle
          const sanitizedHtml = doc.body.innerHTML;
          const jsonContent = generateJSON(
            sanitizedHtml,
            coreExtensions([
              ...((metadata?.config?.enableTemplateLanguage ?? false)
                ? // TODO: move extended extensions to the next layer
                  // the app consumer must provide their own extensions
                  [Variable, Loop, Conditional, SlashCommandTemplate]
                : [Variable, SlashCommand]),
            ]),
          );
          const node = view.state.schema.nodeFromJSON(jsonContent);

          // Insert the parsed content into the editor at the current selection
          const transaction = view.state.tr.replaceSelectionWith(node, false);
          view.dispatch(transaction);

          return true;
        }
        return false;
      },
      handleDrop: (view, event, _slice, moved) => {
        if (
          !moved &&
          event.dataTransfer &&
          event.dataTransfer.files &&
          event.dataTransfer.files[0]
        ) {
          event.preventDefault();
          const file = event.dataTransfer.files[0];
          const extension = getFileExtension(file.name);

          // If the file can be imported as a template, import it
          if (isSupportedFileExtension(extension) && onPasteCapture) {
            Promise.resolve(
              (async () => {
                const text = await file.text();
                return onPasteCapture(text);
              })(),
            ).catch((error) => {
              console.error('Paste file capture error:', error);
            });
            return true;
          }

          // If it is not a supported file to be imported, consider it as an image
          const coordinates = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });

          // here we deduct 1 from the pos or else the image will create an extra node
          startImageUpload(
            file,
            view,
            (coordinates?.pos || 0) - 1,
            undefined,
            metadata,
          );

          return true;
        }
        return false;
      },
    },
  });

  const isEditorEmpty = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) {
        return true;
      }

      if (!ctx.editor.isEmpty) {
        return false;
      }

      // Check only top-level nodes for non-paragraph blocks
      // This handles cases like when typing '#' creates a heading node
      const doc = ctx.editor.state.doc;

      // Iterate through top-level content only (direct children of document)
      for (let i = 0; i < doc.content.childCount; i++) {
        const node = doc.content.child(i);
        if (node.isBlock && node.type.name !== 'paragraph') {
          return false;
        }
      }

      return true;
    },
  });

  React.useEffect(() => {
    if (editor && metadata) {
      editor.storage.metadata = metadata;
    }
  }, [editor, metadata]);

  React.useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  const editorRef = React.useRef<HTMLDivElement>(null);
  const debouncedUpdates = useDebouncedCallback(onDebouncedUpdate, 500);

  React.useImperativeHandle(ref, () => {
    return {
      getEditor: () => editor,
    };
  }, [editor]);

  React.useEffect(() => {
    if (!editor) {
      return;
    }

    const updateCallback = ({
      editor,
      transaction,
    }: {
      editor: EditorClass;
      transaction: { getMeta: (key: string) => unknown };
    }) => {
      // Check if this update came from a remote source (Liveblocks/Yjs sync)
      // Remote transactions have 'y-sync$' metadata set by Yjs
      const isRemoteChange = transaction.getMeta('y-sync$');

      editorStyles.subscribe(editor, (context) => {
        // Always call onUpdate for UI updates (both local and remote)
        onUpdate?.(editor, context);

        // Only trigger debounced save for local changes to prevent duplicate saves
        // when multiple users are editing simultaneously
        if (!isRemoteChange) {
          debouncedUpdates(editor, context);
        }
      });
    };

    editor.once('create', () => {
      editorStyles.subscribe(editor);
      onEditorReady?.(editor);
    });

    editor.on('update', updateCallback);

    return () => {
      editor.off('update', updateCallback);
      onEditorReady?.(null);
    };
  }, [editor, debouncedUpdates, editorStyles, onEditorReady, onUpdate]);

  React.useEffect(() => {
    return () => {
      removePrismTheme();
      editor?.destroy();
    };
  }, []);

  // Memoize the provider value to avoid unnecessary re-renders (TipTap recommended pattern)
  const providerValue = React.useMemo(() => ({ editor }), [editor]);

  if (!editor) {
    return null;
  }

  return (
    <EditorContext.Provider value={providerValue}>
      <div
        id={EDITOR_CONTENT_ID}
        ref={editorRef}
        className="relative z-10 mx-auto w-full grow min-h-auto!"
        style={{
          ...PREVIEW_THEME_OVERWRITE.body,
          ...editorStyles.styles.toCss().body,
          fontSize: '13px',
        }}
      >
        <Dialog.Root open={!!error}>
          <Dialog.Content includeCloseButton={false}>
            <Dialog.Title>Something went wrong</Dialog.Title>
            <Text className="mt-6 block text-balance" size="2">
              An error occurred while trying to save your changes to this
              document. Your recent edits may not have been saved. If the
              problem persists, please contact support.
            </Text>

            <Text className="mt-6 block text-balance font-mono" size="2">
              {JSON.stringify(error?.message, null, 2)}
            </Text>

            <div className="mt-6 flex items-center gap-2">
              <Button
                onClick={() => window.location.reload()}
                appearance="white"
              >
                Reload page
              </Button>

              <Button asChild appearance="fade-gray">
                <Link href="/broadcasts">Go back to broadcasts</Link>
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Root>

        <div
          id={EDITOR_CONTENT_CONTAINER_ID}
          className="mx-auto h-full pb-4 pt-2 relative"
          style={{
            ...PREVIEW_THEME_OVERWRITE.container,
            ...editorStyles.styles.toCss().container,
            fontSize: editorStyles.styles.toCss().body.fontSize,
          }}
        >
          <EditorContent editor={editor} spellCheck={false} />

          {isEditorEmpty && metadata && (
            <>
              {metadata.objectType === 'template' && (
                <EditorEmptyStateTemplate key="editor-empty-state" />
              )}

              {metadata.objectType === 'broadcast' && (
                <EditorEmptyStateBroadcast
                  onImportTemplate={onImport}
                  key="editor-empty-state"
                />
              )}
            </>
          )}
        </div>
      </div>

      {children}
    </EditorContext.Provider>
  );
}
