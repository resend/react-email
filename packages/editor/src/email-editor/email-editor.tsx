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
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { createPasteHandler } from '../core/create-paste-handler';
import { composeReactEmail } from '../core/serializer/compose-react-email';
import { StarterKit } from '../extensions';
import { EmailTheming } from '../plugins/email-theming/extension';
import type { EditorThemeInput } from '../plugins/email-theming/types';
import { createImageExtension } from '../plugins/image/extension';
import { BubbleMenu } from '../ui/bubble-menu';
import { SlashCommandRoot } from '../ui/slash-command/root';
import '../ui/themes/default.css';
import { Placeholder } from '@tiptap/extension-placeholder';

export interface EmailEditorRef {
  getEmail: () => Promise<{ html: string; text: string }>;
  getEmailHTML: () => Promise<string>;
  getEmailText: () => Promise<string>;
  getJSON: () => JSONContent;
  editor: Editor | null;
}

export interface EmailEditorProps {
  content?: Content;
  onUpdate?: (ref: EmailEditorRef) => void;
  onReady?: (ref: EmailEditorRef) => void;
  theme?: EditorThemeInput;
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

function EmailEditorReadyBridge({
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

    const onReadyRef = useRef(onReady);
    onReadyRef.current = onReady;

    const imageExtension = useMemo(() => {
      if (!onUploadImage) return null;
      return createImageExtension({ uploadImage: onUploadImage });
    }, [onUploadImage]);

    const extensions = useMemo(() => {
      const base = extensionsProp ?? [
        StarterKit.configure(),
        Placeholder.configure({
          placeholder:
            placeholder ??
            (({ node }) => {
              // TODO: this heading placeholder is not working,
              // in part because styles are only targetting paragraphs,
              // but in part because of the way the content is rendered
              if (node.type.name === 'heading') {
                return `Heading ${node.attrs.level}`;
              }
              return "Press '/' for commands";
            }),
          includeChildren: true,
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
        key={typeof theme === 'string' ? theme : JSON.stringify(theme)}
        extensions={extensions}
        content={content}
        editable={editable}
        immediatelyRender={false}
        editorProps={editorProps}
        editorContainerProps={{ className }}
      >
        <RefBridge editorRef={ref} onUpdateRef={onUpdateRef} />
        <EmailEditorReadyBridge onReadyRef={onReadyRef} />
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
