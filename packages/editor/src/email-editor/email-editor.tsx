import type { Content, Editor, Extensions, JSONContent } from '@tiptap/core';
import {
  EditorProvider,
  type UseEditorOptions,
  useCurrentEditor,
} from '@tiptap/react';
import { forwardRef, type Ref, useImperativeHandle, useMemo } from 'react';
import { createDropHandler } from '../core/create-drop-handler';
import {
  createPasteHandler,
  type UploadImageHandler,
} from '../core/create-paste-handler';
import { composeReactEmail } from '../core/serializer/compose-react-email';
import { StarterKit } from '../extensions';
import { EmailTheming } from '../plugins/email-theming/extension';
import { BubbleMenuButtonDefault } from '../ui/bubble-menu/button-default';
import { BubbleMenuImageDefault } from '../ui/bubble-menu/image-default';
import { BubbleMenuLinkDefault } from '../ui/bubble-menu/link-default';
import { BubbleMenuRoot } from '../ui/bubble-menu/root';
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
  onUploadImage?: UploadImageHandler;
  onReady?: (editor: Editor) => void;
  theme?: 'basic' | 'minimal';
  editable?: boolean;
  placeholder?: string;
  bubbleMenu?: {
    hideWhenActiveNodes?: string[];
    hideWhenActiveMarks?: string[];
  };
  extensions?: Extensions;
  className?: string;
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
      onUploadImage,
      onReady,
      theme = 'basic',
      editable = true,
      placeholder,
      bubbleMenu,
      extensions: extensionsProp,
      className,
    },
    ref,
  ) => {
    const extensions = useMemo(() => {
      if (extensionsProp) {
        return extensionsProp;
      }

      return [
        StarterKit.configure({
          Placeholder: placeholder ? { placeholder } : undefined,
        }),
        EmailTheming.configure({ theme }),
      ];
    }, [extensionsProp, theme, placeholder]);

    const editorProps: UseEditorOptions['editorProps'] = useMemo(
      () => ({
        handlePaste: createPasteHandler({
          onUploadImage,
          extensions,
        }),
        handleDrop: createDropHandler({
          onUploadImage,
        }),
      }),
      [onUploadImage, extensions],
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
        <BubbleMenuRoot
          hideWhenActiveNodes={bubbleMenu?.hideWhenActiveNodes ?? ['button']}
          hideWhenActiveMarks={bubbleMenu?.hideWhenActiveMarks ?? ['link']}
        />
        <BubbleMenuLinkDefault />
        <BubbleMenuButtonDefault />
        <BubbleMenuImageDefault />
        <SlashCommandRoot />
      </EditorProvider>
    );
  },
);

EmailEditor.displayName = 'EmailEditor';
