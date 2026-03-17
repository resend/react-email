import {
  ColumnsColumn,
  FourColumns,
  StarterKit,
  ThreeColumns,
  TwoColumns,
} from '@react-email/editor/extensions';
import {
  defaultSlashCommands,
  SlashCommand,
  type SlashCommandItem,
} from '@react-email/editor/ui';
import { EditorProvider } from '@tiptap/react';
import { Star } from 'lucide-react';

const CUSTOM_COMMAND: SlashCommandItem = {
  title: 'Greeting',
  description: 'Insert a greeting block',
  icon: <Star size={20} />,
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

const extensions = [
  StarterKit,
  TwoColumns,
  ThreeColumns,
  FourColumns,
  ColumnsColumn,
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
      <p className="text-sm text-(--re-text-muted) mb-4">
        Type <code className="bg-(--re-hover) px-1.5 py-0.5 rounded-sm">/</code>{' '}
        to open the command menu. This example extends the default commands with
        a custom "Greeting" command.
      </p>
      <div className="border border-(--re-border) rounded-xl p-4 min-h-75">
        <EditorProvider extensions={extensions} content={content}>
          <SlashCommand.Root
            items={[...defaultSlashCommands, CUSTOM_COMMAND]}
          />
        </EditorProvider>
      </div>
    </div>
  );
}
