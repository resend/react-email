import { useState } from 'react';
import { BasicEditor } from './examples/basic-editor';
import { ColumnLayouts } from './examples/column-layouts';
import { CustomBubbleMenus } from './examples/custom-bubble-menus';
import { DocumentInspector } from './examples/document-inspector';
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
  {
    id: 'document-inspector',
    label: 'Document inspector',
    component: DocumentInspector,
  },
] as const;

export function App() {
  const [active, setActive] = useState<(typeof examples)[number]['id']>(examples[0].id);
  const ActiveExample = examples.find((e) => e.id === active)!.component;

  return (
    <div className="max-w-225 mx-auto p-8 font-sans text-(--re-text)">
      <h1 className="text-2xl mb-6">@react-email/editor examples</h1>
      <nav className="flex gap-1 mb-8 border-b border-(--re-border)">
        {examples.map((example) => (
          <button
            key={example.id}
            onClick={() => setActive(example.id)}
            type="button"
            className={`px-4 py-2 border-0 bg-transparent cursor-pointer text-sm ${
              active === example.id
                ? 'font-semibold text-(--re-text) border-b-2 border-b-(--re-text)'
                : 'font-normal text-(--re-text-muted) border-b-2 border-b-transparent'
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
