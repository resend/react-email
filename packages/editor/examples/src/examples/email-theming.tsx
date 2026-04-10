import { StarterKit } from '@react-email/editor/extensions';
import { EmailTheming } from '@react-email/editor/plugins';
import { BubbleMenu } from '@react-email/editor/ui';
import { EditorProvider } from '@tiptap/react';
import { useState } from 'react';
import { ExampleShell } from '../example-shell';

const content = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Welcome to our newsletter' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is a themed email editor. Toggle between Basic and Minimal themes to see how styles change.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Try editing this content and switching themes to see the difference.',
        },
      ],
    },
  ],
};

type EditorTheme = 'basic' | 'minimal';

export function EmailThemingExample() {
  const [theme, setTheme] = useState<EditorTheme>('basic');
  const extensions = [StarterKit, EmailTheming.configure({ theme })];

  return (
    <ExampleShell
      title="Email Theming"
      description="Switch between Basic and Minimal themes to see how email styles change."
    >
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setTheme('basic')}
          className={`px-3 py-1.5 border border-(--re-border) rounded-lg cursor-pointer text-[0.8125rem] ${
            theme === 'basic'
              ? 'bg-(--re-text) text-(--re-bg) font-medium'
              : 'bg-(--re-bg) text-(--re-text) hover:bg-(--re-hover)'
          }`}
        >
          Basic
        </button>
        <button
          type="button"
          onClick={() => setTheme('minimal')}
          className={`px-3 py-1.5 border border-(--re-border) rounded-lg cursor-pointer text-[0.8125rem] ${
            theme === 'minimal'
              ? 'bg-(--re-text) text-(--re-bg) font-medium'
              : 'bg-(--re-bg) text-(--re-text) hover:bg-(--re-hover)'
          }`}
        >
          Minimal
        </button>
      </div>
      <EditorProvider key={theme} extensions={extensions} content={content}>
        <BubbleMenu />
      </EditorProvider>
    </ExampleShell>
  );
}
