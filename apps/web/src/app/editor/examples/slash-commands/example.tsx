'use client';

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
import { ExampleShell } from '../example-shell';

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
    <ExampleShell
      title="Slash Commands"
      description='Type / to open the command menu. Includes default commands plus a custom "Greeting" command.'
    >
      <EditorProvider
        extensions={extensions}
        content={content}
        immediatelyRender={false}
      >
        <SlashCommand.Root items={[...defaultSlashCommands, CUSTOM_COMMAND]} />
      </EditorProvider>
    </ExampleShell>
  );
}
