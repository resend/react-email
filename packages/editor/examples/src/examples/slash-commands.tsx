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
import { EditorProvider } from '@tiptap/react';
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

const content = {
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
};

export function SlashCommands() {
  return (
    <div>
      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--re-text-muted)',
          marginBottom: '1rem',
        }}
      >
        Type{' '}
        <code
          style={{
            background: 'var(--re-hover)',
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
          border: '1px solid var(--re-border)',
          borderRadius: 'var(--re-radius)',
          padding: '1rem',
          minHeight: 300,
        }}
      >
        <EditorProvider extensions={extensions} content={content} />
      </div>
    </div>
  );
}
