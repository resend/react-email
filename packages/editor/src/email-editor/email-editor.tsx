import type { Content, Extensions } from '@tiptap/core';
import { EditorProvider, type UseEditorOptions } from '@tiptap/react';
import { forwardRef, type ReactNode, useMemo, useRef } from 'react';
import { createPasteHandler } from '../core/create-paste-handler';
import {
  type EmailEditorRef,
  ReadyBridge,
  RefBridge,
} from '../editor-provider/ref-bridge';
import { StarterKit } from '../extensions';
import { EmailTheming } from '../plugins/email-theming/extension';
import type { EditorThemeInput } from '../plugins/email-theming/types';
import { createImageExtension } from '../plugins/image/extension';
import { BubbleMenu } from '../ui/bubble-menu';
import { SlashCommandRoot } from '../ui/slash-command/root';
import '../ui/themes/default.css';
import { Placeholder } from '@tiptap/extension-placeholder';

export type { EmailEditorRef } from '../editor-provider/ref-bridge';

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
        <ReadyBridge onReadyRef={onReadyRef} />
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
