import { StarterKit } from '@react-email/editor/extensions';
import { BubbleMenu } from '@react-email/editor/ui';
import { EditorProvider } from '@tiptap/react';

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

export function BasicEditor() {
  return (
    <div>
      <p className="text-sm text-[var(--re-text-muted)] mb-4">
        Minimal setup with coreExtensions and all default bubble menus. Select
        text to see the bubble menu.
      </p>
      <div className="border border-[var(--re-border)] rounded-xl p-4 min-h-[300px]">
        <EditorProvider extensions={extensions} content={content}>
          <BubbleMenu.Default />
        </EditorProvider>
      </div>
    </div>
  );
}
