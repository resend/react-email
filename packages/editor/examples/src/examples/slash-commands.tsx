import {
  ColumnsColumn,
  coreExtensions,
  createSlashCommand,
  defaultSlashCommands,
  FourColumns,
  type SlashCommandItem,
  ThreeColumns,
  TwoColumns,
} from '@react-email/editor';
import '@react-email/editor/styles/slash-command.css';
import { EditorContent, useEditor } from '@tiptap/react';
import { Star } from 'lucide-react';

const CUSTOM_COMMAND: SlashCommandItem = {
  title: 'Greeting',
  description: 'Insert a greeting block',
  icon: Star,
  category: 'Custom',
  searchTerms: ['hello', 'greeting', 'welcome'],
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertContent({
        type: 'paragraph',
        content: [{ type: 'text', text: 'Hello! Welcome to our newsletter.' }],
      })
      .run();
  },
};

const MySlashCommand = createSlashCommand({
  items: [...defaultSlashCommands, CUSTOM_COMMAND],
});

const extensions = [
  ...coreExtensions,
  TwoColumns,
  ThreeColumns,
  FourColumns,
  ColumnsColumn,
  MySlashCommand,
];

export function SlashCommands() {
  const editor = useEditor({
    extensions,
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Type / to open the slash command menu. Try searching for "greeting" to find the custom command.',
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
        Type{' '}
        <code
          style={{
            background: '#f1f5f9',
            padding: '0.125rem 0.375rem',
            borderRadius: '0.25rem',
          }}
        >
          /
        </code>{' '}
        to open the command menu. This example extends the default commands with
        a custom "Greeting" command.
      </p>
      <div
        style={{
          border: '1px solid #e5e5e5',
          borderRadius: '0.5rem',
          padding: '1rem',
          minHeight: 300,
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
