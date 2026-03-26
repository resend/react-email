import { StarterKit } from '@react-email/editor/extensions';
import { BubbleMenu } from '@react-email/editor/ui';
import { mergeAttributes, Node } from '@tiptap/core';
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import { Info } from 'lucide-react';
import { ExampleShell } from '../example-shell';

const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: 'div[data-callout]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-callout': '',
        style:
          'padding: 12px 16px; background: var(--re-hover); border-left: 3px solid var(--re-text); border-radius: 4px; margin: 8px 0;',
      }),
      0,
    ];
  },

  renderToReactEmail({ children, style }) {
    return (
      <div
        style={{
          ...style,
          padding: '12px 16px',
          backgroundColor: '#f4f4f5',
          borderLeft: '3px solid #1c1c1c',
          borderRadius: '4px',
          margin: '8px 0',
        }}
      >
        {children}
      </div>
    );
  },
});

const extensions = [StarterKit, Callout];

const content = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This example shows a custom "Callout" node created with Node.create and renderToReactEmail. Use the toolbar to insert one.',
        },
      ],
    },
    {
      type: 'callout',
      content: [
        {
          type: 'text',
          text: 'This is a callout block — a custom extension!',
        },
      ],
    },
  ],
};

function Toolbar() {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <div className="flex gap-2 mb-4">
      <button
        type="button"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertContent({
              type: 'callout',
              content: [{ type: 'text', text: 'New callout' }],
            })
            .run()
        }
        className="flex items-center gap-1.5 px-3 py-1.5 border border-(--re-border) rounded-lg bg-(--re-bg) text-(--re-text) cursor-pointer text-[0.8125rem] hover:bg-(--re-hover)"
      >
        <Info size={16} />
        Insert Callout
      </button>
    </div>
  );
}

export function CustomExtensions() {
  return (
    <ExampleShell
      title="Custom Extensions"
      description="A custom Callout node created with Node.create and renderToReactEmail — showing how to extend the editor with email-compatible nodes."
    >
      <EditorProvider
        extensions={extensions}
        content={content}
        slotBefore={<Toolbar />}
      >
        <BubbleMenu.Default />
      </EditorProvider>
    </ExampleShell>
  );
}
