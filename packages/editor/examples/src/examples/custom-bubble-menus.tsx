import { BubbleMenu, coreExtensions } from '@react-email/editor';
import Underline from '@tiptap/extension-underline';
import { EditorProvider } from '@tiptap/react';

const extensions = [...coreExtensions, Underline];

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

export function CustomBubbleMenus() {
  return (
    <div>
      <p className="text-sm text-[var(--re-text-muted)] mb-4">
        Building menus from primitives instead of using .Default. Only bold,
        italic, underline, and alignment controls are shown.
      </p>
      <div className="border border-[var(--re-border)] rounded-xl p-4 min-h-[300px]">
        <EditorProvider extensions={extensions} content={content}>
          <BubbleMenu.Root>
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
          </BubbleMenu.Root>
        </EditorProvider>
      </div>
    </div>
  );
}
