import type { Editor, JSONContent } from '@tiptap/core';
import { useCurrentEditor } from '@tiptap/react';
import {
  type Ref,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
} from 'react';
import { composeReactEmail } from '../core/serializer/compose-react-email';

export interface EmailEditorRef {
  getEmail: () => Promise<{ html: string; text: string }>;
  getEmailHTML: () => Promise<string>;
  getEmailText: () => Promise<string>;
  getJSON: () => JSONContent;
  editor: Editor | null;
}

export function buildRef(editor: Editor | null): EmailEditorRef {
  return {
    getEmail: async () => {
      if (!editor) return { html: '', text: '' };
      return composeReactEmail({ editor });
    },
    getEmailHTML: async () => {
      if (!editor) return '';
      const result = await composeReactEmail({ editor });
      return result.html;
    },
    getEmailText: async () => {
      if (!editor) return '';
      const result = await composeReactEmail({ editor });
      return result.text;
    },
    getJSON: () => editor?.getJSON() ?? { type: 'doc', content: [] },
    editor,
  };
}

export function RefBridge({
  editorRef,
  onUpdateRef,
}: {
  editorRef: Ref<EmailEditorRef>;
  onUpdateRef?: React.RefObject<((ref: EmailEditorRef) => void) | undefined>;
}) {
  const { editor } = useCurrentEditor();

  const emailEditorRef = useMemo(() => buildRef(editor), [editor]);

  useImperativeHandle(editorRef, () => emailEditorRef, [emailEditorRef]);

  useEffect(() => {
    if (!editor || !onUpdateRef) return;

    const handler = () => {
      onUpdateRef.current?.(emailEditorRef);
    };

    editor.on('update', handler);
    return () => {
      editor.off('update', handler);
    };
  }, [editor, emailEditorRef, onUpdateRef]);

  return null;
}

export function ReadyBridge({
  onReadyRef,
}: {
  onReadyRef: React.RefObject<((ref: EmailEditorRef) => void) | undefined>;
}) {
  const { editor } = useCurrentEditor();

  useLayoutEffect(() => {
    if (!editor) return;
    onReadyRef.current?.(buildRef(editor));
  }, [editor, onReadyRef]);

  return null;
}
