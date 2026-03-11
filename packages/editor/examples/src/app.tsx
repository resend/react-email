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
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        maxWidth: 900,
        margin: '0 auto',
        padding: '2rem',
        color: 'var(--re-text)',
      }}
    >
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
        @react-email/editor examples
      </h1>
      <nav
        style={{
          display: 'flex',
          gap: '0.25rem',
          marginBottom: '2rem',
          borderBottom: '1px solid var(--re-border)',
        }}
      >
        {examples.map((example) => (
          <button
            key={example.id}
            onClick={() => setActive(example.id)}
            type="button"
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderBottom:
                active === example.id
                  ? '2px solid var(--re-text)'
                  : '2px solid transparent',
              background: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: active === example.id ? 600 : 400,
              color:
                active === example.id
                  ? 'var(--re-text)'
                  : 'var(--re-text-muted)',
            }}
          >
            {example.label}
          </button>
        ))}
      </nav>
      <ActiveExample />
    </div>
  );
}
