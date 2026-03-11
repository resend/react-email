import {
  ColumnsColumn,
  coreExtensions,
  FourColumns,
  ThreeColumns,
  TwoColumns,
} from '@react-email/editor';
import { EditorContent, useEditor } from '@tiptap/react';
import { Columns2, Columns3, Columns4 } from 'lucide-react';

const columnExtensions = [
  ...coreExtensions,
  TwoColumns,
  ThreeColumns,
  FourColumns,
  ColumnsColumn,
];

export function ColumnLayouts() {
  const editor = useEditor({
    extensions: columnExtensions,
    content: {
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
    },
  });

  if (!editor) return null;

  return (
    <div>
      <p
        style={{ fontSize: '0.875rem', color: '#6b6b6b', marginBottom: '1rem' }}
      >
        Insert multi-column layouts using the toolbar buttons below.
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
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
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: '0.375rem 0.75rem',
        border: '1px solid #e5e5e5',
        borderRadius: '0.375rem',
        background: '#fff',
        cursor: 'pointer',
        fontSize: '0.8125rem',
      }}
    >
      {icon}
      {label}
    </button>
  );
}
