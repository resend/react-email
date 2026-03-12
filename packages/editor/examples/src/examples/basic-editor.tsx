import { BubbleMenu, coreExtensions } from '@react-email/editor';
import Heading from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { EditorProvider } from '@tiptap/react';

const extensions = [
  ...coreExtensions,
  Heading.configure({ levels: [1, 2, 3] }),
  Underline,
  Link.configure({ openOnClick: false }),
];

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
