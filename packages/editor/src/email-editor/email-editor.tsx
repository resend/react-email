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
  useImperativeHandle,
  useMemo,
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
  getJSON: () => JSONContent;
  getHTML: () => string;
  editor: Editor | null;
}

export interface EmailEditorProps {
  content?: Content;
  onChange?: (editor: Editor) => void;
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

function RefBridge({ editorRef }: { editorRef: Ref<EmailEditorRef> }) {
  const { editor } = useCurrentEditor();

  useImperativeHandle(
    editorRef,
    () => ({
      export: async () => {
        if (!editor) {
          return { html: '', text: '' };
        }
        return composeReactEmail({ editor });
      },
      getJSON: () => editor?.getJSON() ?? { type: 'doc', content: [] },
      getHTML: () => editor?.getHTML() ?? '',
      editor,
    }),
    [editor],
  );

  return null;
}

export const EmailEditor = forwardRef<EmailEditorRef, EmailEditorProps>(
  (
    {
      content,
      onChange,
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
        onUpdate={({ editor }) => onChange?.(editor)}
      >
        <RefBridge editorRef={ref} />
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
