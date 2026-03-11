import {
  BubbleMenu,
  ButtonBubbleMenu,
  coreExtensions,
  ImageBubbleMenu,
  LinkBubbleMenu,
} from '@react-email/editor';
import { EditorProvider } from '@tiptap/react';

const content = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Select this text to see the bubble menu. Try ' },
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
      <p
        style={{ fontSize: '0.875rem', color: '#6b6b6b', marginBottom: '1rem' }}
      >
        Minimal setup with coreExtensions and all default bubble menus. Select
        text to see the bubble menu.
      </p>
      <div
        style={{
          border: '1px solid #e5e5e5',
          borderRadius: '0.5rem',
          padding: '1rem',
          minHeight: 300,
        }}
      >
        <EditorProvider extensions={coreExtensions} content={content}>
          <BubbleMenu.Default />
          <LinkBubbleMenu.Default />
          <ButtonBubbleMenu.Default />
          <ImageBubbleMenu.Default />
        </EditorProvider>
      </div>
    </div>
  );
}
