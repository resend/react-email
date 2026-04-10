'use client';

import { StarterKit } from '@react-email/editor/extensions';
import { BubbleMenu } from '@react-email/editor/ui';
import { EditorProvider } from '@tiptap/react';
import { ExampleShell } from '../example-shell';

const extensions = [StarterKit];

const content = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Select text to see a custom bubble menu built from primitives — only bold, italic, underline, and alignment.',
        },
      ],
    },
  ],
};

export function CustomBubbleMenu() {
  return (
    <ExampleShell
      title="Custom Bubble Menu"
      description="Building bubble menus from primitives."
    >
      <EditorProvider
        extensions={extensions}
        content={content}
        immediatelyRender={false}
      >
        <BubbleMenu>
          <BubbleMenu.ItemGroup>
            <BubbleMenu.Bold />
            <BubbleMenu.Italic />
            <BubbleMenu.Underline />
          </BubbleMenu.ItemGroup>
          <BubbleMenu.ItemGroup>
            <BubbleMenu.AlignLeft />
            <BubbleMenu.AlignCenter />
            <BubbleMenu.AlignRight />
          </BubbleMenu.ItemGroup>
        </BubbleMenu>
      </EditorProvider>
    </ExampleShell>
  );
}
