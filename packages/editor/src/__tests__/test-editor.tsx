/**
 * Lightweight editor wrapper for browser component tests.
 *
 * This mirrors the production `EmailEditor` but skips the `composeReactEmail`
 * serializer import, which pulls in heavy Node-only transitive dependencies
 * (`@react-email/render` → `prettier`, `@react-email/markdown` → `md-to-react-email`)
 * that cannot be resolved in the Vite browser environment.
 *
 * Keep this in sync with `email-editor/email-editor.tsx` — any new extensions,
 * bubble menus, or editor configuration added there should be reflected here.
 */

import type { Content, Extensions } from '@tiptap/core';
import { UndoRedo } from '@tiptap/extensions';
import { EditorProvider } from '@tiptap/react';
import { useMemo } from 'react';
import { createDropHandler } from '../core/create-drop-handler';
import {
  createPasteHandler,
  type UploadImageHandler,
} from '../core/create-paste-handler';
import { StarterKit } from '../extensions';
import { EmailTheming } from '../plugins/email-theming/extension';
import { BubbleMenuDefault } from '../ui/bubble-menu/default';
import { ButtonBubbleMenuDefault } from '../ui/button-bubble-menu/default';
import { ImageBubbleMenuDefault } from '../ui/image-bubble-menu/default';
import { LinkBubbleMenuDefault } from '../ui/link-bubble-menu/default';
import { SlashCommandRoot } from '../ui/slash-command/root';
import '../ui/themes/default.css';

interface TestEditorProps {
  content?: Content;
  onUploadImage?: UploadImageHandler;
  extensions?: Extensions;
}

export function TestEditor({
  content,
  onUploadImage,
  extensions: extensionsProp,
}: TestEditorProps) {
  const extensions = useMemo(() => {
    if (extensionsProp) {
      return extensionsProp;
    }
    return [StarterKit, UndoRedo, EmailTheming.configure({ theme: 'basic' })];
  }, [extensionsProp]);

  const editorProps = useMemo(
    () => ({
      handlePaste: createPasteHandler({ onUploadImage, extensions }),
      handleDrop: createDropHandler({ onUploadImage }),
    }),
    [onUploadImage, extensions],
  );

  return (
    <EditorProvider
      extensions={extensions}
      content={content}
      immediatelyRender={false}
      editorProps={editorProps}
    >
      <BubbleMenuDefault excludeNodes={['button']} excludeMarks={['link']} />
      <LinkBubbleMenuDefault />
      <ButtonBubbleMenuDefault />
      <ImageBubbleMenuDefault />
      <SlashCommandRoot />
    </EditorProvider>
  );
}
