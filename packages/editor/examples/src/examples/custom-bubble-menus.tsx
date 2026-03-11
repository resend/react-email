import { BubbleMenu, coreExtensions } from '@react-email/editor';
import { EditorContent, useEditor } from '@tiptap/react';

export function CustomBubbleMenus() {
  const editor = useEditor({
    extensions: coreExtensions,
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Select text to see a custom bubble menu built from primitives — only bold, italic, and alignment.',
            },
          ],
        },
      ],
    },
  });

  if (!editor) return null;

  return (
    <div>
      <p
        style={{ fontSize: '0.875rem', color: '#6b6b6b', marginBottom: '1rem' }}
      >
        Building menus from primitives instead of using .Default. Only bold,
        italic, and alignment controls are shown.
      </p>
      <div
        style={{
          border: '1px solid #e5e5e5',
          borderRadius: '0.5rem',
          padding: '1rem',
          minHeight: 300,
        }}
      >
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
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
