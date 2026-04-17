import {
  EditorProvider as TiptapEditorProvider,
  type EditorProviderProps as TiptapEditorProviderProps,
} from '@tiptap/react';
import { forwardRef, useRef } from 'react';
import { ReadyBridge, RefBridge, type EmailEditorRef } from './ref-bridge';

export type EditorProviderProps = TiptapEditorProviderProps & {
  /**
   * Called once when the editor has finished initializing,
   * with an `EmailEditorRef` for email export and JSON access.
   */
  onReady?: (ref: EmailEditorRef) => void;
};

/**
 * A drop-in replacement for tiptap's `EditorProvider` that supports a `ref`
 * exposing `EmailEditorRef` methods (`getEmail`, `getEmailHTML`, `getEmailText`,
 * `getJSON`, and `editor`).
 */
export const EditorProvider = forwardRef<EmailEditorRef, EditorProviderProps>(
  ({ children, onReady, ...editorOptions }, ref) => {
    const onReadyRef = useRef(onReady);
    onReadyRef.current = onReady;

    return (
      <TiptapEditorProvider {...editorOptions}>
        <RefBridge editorRef={ref} />
        <ReadyBridge onReadyRef={onReadyRef} />
        {children}
      </TiptapEditorProvider>
    );
  },
);

EditorProvider.displayName = 'EditorProvider';
