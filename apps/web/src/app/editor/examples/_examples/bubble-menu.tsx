'use client';

import { StarterKit } from '@react-email/editor/extensions';
import { BubbleMenu } from '@react-email/editor/ui';
import { EditorProvider } from '@tiptap/react';
import { ExampleShell } from '../_components/example-shell';

const extensions = [StarterKit];

const content = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Select this text to see the bubble menu. Try ',
        },
        { type: 'text', marks: [{ type: 'bold' }], text: 'bold' },
        { type: 'text', text: ', ' },
        { type: 'text', marks: [{ type: 'italic' }], text: 'italic' },
        { type: 'text', text: ', and other formatting options.' },
      ],
    },
  ],
};

export function BubbleMenuExample() {
  return (
    <ExampleShell
      title="Bubble Menu"
      description="Select text to see the default bubble menu with formatting options."
    >
      <EditorProvider extensions={extensions} content={content}>
        <BubbleMenu.Default />
      </EditorProvider>
    </ExampleShell>
  );
}
