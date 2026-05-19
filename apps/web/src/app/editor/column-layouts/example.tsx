'use client';

import { StarterKit } from '@react-email/editor/extensions';
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import { Columns2, Columns3, Columns4 } from 'lucide-react';
import { ExampleShell } from '../example-shell';

const extensions = [StarterKit];

const content = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Use the toolbar above to insert column layouts.',
        },
      ],
    },
  ],
};

function ToolbarButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 border border-(--re-border) rounded-lg bg-(--re-bg) text-(--re-text) cursor-pointer text-[0.8125rem] hover:bg-(--re-hover)"
    >
      {icon}
      {label}
    </button>
  );
}

function makeColumns(count: number) {
  const labels = ['First', 'Second', 'Third', 'Fourth'];
  const types: Record<number, string> = {
    2: 'twoColumns',
    3: 'threeColumns',
    4: 'fourColumns',
  };
  return {
    type: types[count],
    content: Array.from({ length: count }, (_, i) => ({
      type: 'columnsColumn',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: `${labels[i]} column` }],
        },
      ],
    })),
  };
}

function Toolbar() {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <div className="flex gap-2 mb-4">
      <ToolbarButton
        label="2 columns"
        icon={<Columns2 size={16} />}
        onClick={() =>
          editor.chain().focus().insertContent(makeColumns(2)).run()
        }
      />
      <ToolbarButton
        label="3 columns"
        icon={<Columns3 size={16} />}
        onClick={() =>
          editor.chain().focus().insertContent(makeColumns(3)).run()
        }
      />
      <ToolbarButton
        label="4 columns"
        icon={<Columns4 size={16} />}
        onClick={() =>
          editor.chain().focus().insertContent(makeColumns(4)).run()
        }
      />
    </div>
  );
}

export function ColumnLayouts() {
  return (
    <ExampleShell
      title="Column layouts"
      description="Insert multi-column layouts using the toolbar buttons."
    >
      <EditorProvider
        extensions={extensions}
        content={content}
        immediatelyRender={false}
        slotBefore={<Toolbar />}
      />
    </ExampleShell>
  );
}
