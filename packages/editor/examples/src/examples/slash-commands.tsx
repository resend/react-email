import {
  ColumnsColumn,
  StarterKit,
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
  StarterKit,
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
      <p className="text-sm text-[var(--re-text-muted)] mb-4">
        Type{' '}
        <code className="bg-[var(--re-hover)] px-1.5 py-0.5 rounded">/</code> to
        open the command menu. This example extends the default commands with a
        custom "Greeting" command.
      </p>
      <div className="border border-[var(--re-border)] rounded-xl p-4 min-h-[300px]">
        <EditorProvider extensions={extensions} content={content} />
      </div>
    </div>
  );
}
