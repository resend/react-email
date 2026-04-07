'use client';

import { StarterKit } from '@react-email/editor/extensions';
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
          text: 'This is the simplest editor setup — just StarterKit with no UI overlays. Start typing or edit this text.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'The StarterKit includes all core extensions: paragraphs, headings, lists, tables, code blocks, and more.',
        },
      ],
    },
  ],
};

export function BasicEditor() {
  return (
    <ExampleShell
      title="Basic Editor"
      description="Minimal setup with StarterKit and no UI overlays."
    >
      <EditorProvider extensions={extensions} content={content} />
    </ExampleShell>
  );
}
