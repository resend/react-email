import {
  ColumnsColumn,
  FourColumns,
  StarterKit,
  ThreeColumns,
  TwoColumns,
} from '@react-email/editor/extensions';
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import { Columns2, Columns3, Columns4 } from 'lucide-react';

const columnExtensions = [
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
          text: 'Use the toolbar above to insert column layouts.',
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
      <ToolbarButton
        label="2 columns"
        icon={<Columns2 size={16} />}
        onClick={() => editor.chain().focus().insertColumns(2).run()}
      />
      <ToolbarButton
        label="3 columns"
        icon={<Columns3 size={16} />}
        onClick={() => editor.chain().focus().insertColumns(3).run()}
      />
      <ToolbarButton
        label="4 columns"
        icon={<Columns4 size={16} />}
        onClick={() => editor.chain().focus().insertColumns(4).run()}
      />
      <ToolbarButton
        label="Section"
        onClick={() => editor.chain().focus().insertSection().run()}
      />
      <ToolbarButton
        label="Button"
        onClick={() => editor.chain().focus().setButton().run()}
      />
    </div>
  );
}

export function ColumnLayouts() {
  return (
    <div>
      <p className="text-sm text-[var(--re-text-muted)] mb-4">
        Insert multi-column layouts using the toolbar buttons.
      </p>
      <EditorProvider
        extensions={columnExtensions}
        content={content}
        slotBefore={<Toolbar />}
        editorContainerProps={{
          className:
            'border border-[var(--re-border)] rounded-xl p-4 min-h-[300px]',
        }}
      />
    </div>
  );
}

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
      className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--re-border)] rounded-lg bg-[var(--re-bg)] text-[var(--re-text)] cursor-pointer text-[0.8125rem] hover:bg-[var(--re-hover)]"
    >
      {icon}
      {label}
    </button>
  );
}
