import { useState } from 'react';
import '@react-email/editor/themes/default.css';
import { BasicEditor } from './examples/basic-editor';
import { ColumnLayouts } from './examples/column-layouts';
import { CustomBubbleMenus } from './examples/custom-bubble-menus';
import { SlashCommands } from './examples/slash-commands';

const examples = [
  { id: 'basic', label: 'Basic editor', component: BasicEditor },
  {
    id: 'bubble-menus',
    label: 'Custom bubble menus',
    component: CustomBubbleMenus,
  },
  { id: 'columns', label: 'Column layouts', component: ColumnLayouts },
  { id: 'slash', label: 'Slash commands', component: SlashCommands },
] as const;

export function App() {
  const [active, setActive] = useState(examples[0].id);
  const ActiveExample = examples.find((e) => e.id === active)!.component;

  return (
    <div className="max-w-[900px] mx-auto p-8 font-sans text-[var(--re-text)]">
      <h1 className="text-2xl mb-6">@react-email/editor examples</h1>
      <nav className="flex gap-1 mb-8 border-b border-[var(--re-border)]">
        {examples.map((example) => (
          <button
            key={example.id}
            onClick={() => setActive(example.id)}
            type="button"
            className={`px-4 py-2 border-0 bg-transparent cursor-pointer text-sm ${
              active === example.id
                ? 'font-semibold text-[var(--re-text)] border-b-2 border-b-[var(--re-text)]'
                : 'font-normal text-[var(--re-text-muted)] border-b-2 border-b-transparent'
            }`}
          >
            {example.label}
          </button>
        ))}
      </nav>
      <ActiveExample />
    </div>
  );
}
