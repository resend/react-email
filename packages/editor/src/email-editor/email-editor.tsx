import type { Content, Editor, Extensions, JSONContent } from '@tiptap/core';
import {
  EditorProvider,
  type UseEditorOptions,
  useCurrentEditor,
} from '@tiptap/react';
import {
  forwardRef,
  type ReactNode,
  type Ref,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { createPasteHandler } from '../core/create-paste-handler';
import { composeReactEmail } from '../core/serializer/compose-react-email';
import { StarterKit } from '../extensions';
import { EmailTheming } from '../plugins/email-theming/extension';
import { createImageExtension } from '../plugins/image/extension';
import { BubbleMenu } from '../ui/bubble-menu';
import { SlashCommandRoot } from '../ui/slash-command/root';
import '../ui/themes/default.css';

export interface EmailEditorRef {
  export: () => Promise<{ html: string; text: string }>;
  getEmailHTML: () => Promise<string>;
  getEmailText: () => Promise<string>;
  getJSON: () => JSONContent;
  editor: Editor | null;
}

export interface EmailEditorProps {
  content?: Content;
  onUpdate?: (ref: EmailEditorRef) => void;
  onReady?: (editor: Editor) => void;
  theme?: 'basic' | 'minimal';
  editable?: boolean;
  placeholder?: string;
  bubbleMenu?: {
    hideWhenActiveNodes?: string[];
    hideWhenActiveMarks?: string[];
  };
  extensions?: Extensions;
  onUploadImage?: (file: File) => Promise<{ url: string }>;
  className?: string;
  children?: ReactNode;
}

function buildRef(editor: Editor | null): EmailEditorRef {
  return {
    export: async () => {
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

function RefBridge({
  editorRef,
  onUpdateRef,
}: {
  editorRef: Ref<EmailEditorRef>;
  onUpdateRef: React.RefObject<((ref: EmailEditorRef) => void) | undefined>;
}) {
  const { editor } = useCurrentEditor();

  const emailEditorRef = useMemo(() => buildRef(editor), [editor]);

  useImperativeHandle(editorRef, () => emailEditorRef, [emailEditorRef]);

  useEffect(() => {
    if (!editor) return;

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

export const EmailEditor = forwardRef<EmailEditorRef, EmailEditorProps>(
  (
    {
      content,
      onUpdate,
      onReady,
      theme = 'basic',
      editable = true,
      placeholder,
      bubbleMenu,
      extensions: extensionsProp,
      onUploadImage,
      className,
      children,
    },
    ref,
  ) => {
    const onUpdateRef = useRef(onUpdate);
    onUpdateRef.current = onUpdate;

    const imageExtension = useMemo(() => {
      if (!onUploadImage) return null;
      return createImageExtension({ uploadImage: onUploadImage });
    }, [onUploadImage]);

    const extensions = useMemo(() => {
      const base = extensionsProp ?? [
        StarterKit.configure({
          Placeholder: placeholder ? { placeholder } : undefined,
        }),
        EmailTheming.configure({ theme }),
      ];

      return imageExtension ? [...base, imageExtension] : base;
    }, [extensionsProp, theme, placeholder, imageExtension]);

    const editorProps: UseEditorOptions['editorProps'] = useMemo(
      () => ({
        handlePaste: createPasteHandler({
          extensions,
        }),
      }),
      [extensions],
    );

    return (
      <EditorProvider
        key={theme}
        extensions={extensions}
        content={content}
        editable={editable}
        immediatelyRender={false}
        editorProps={editorProps}
        editorContainerProps={{ className }}
        onCreate={({ editor }) => onReady?.(editor)}
      >
        <RefBridge editorRef={ref} onUpdateRef={onUpdateRef} />
        <BubbleMenu
          hideWhenActiveNodes={bubbleMenu?.hideWhenActiveNodes ?? ['button']}
          hideWhenActiveMarks={bubbleMenu?.hideWhenActiveMarks ?? ['link']}
        />
        <BubbleMenu.LinkDefault />
        <BubbleMenu.ButtonDefault />
        <BubbleMenu.ImageDefault />
        <SlashCommandRoot />
        {children}
      </EditorProvider>
    );
  },
);

EmailEditor.displayName = 'EmailEditor';
