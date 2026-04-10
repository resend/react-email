'use client';

import { StarterKit } from '@react-email/editor/extensions';
import { EmailTheming } from '@react-email/editor/plugins';
import { BubbleMenu } from '@react-email/editor/ui';
import type { JSONContent } from '@tiptap/react';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
import { useRef, useState } from 'react';
import { ExampleShell } from '../example-shell';

const initialContent = {
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
  const contentRef = useRef<JSONContent>(initialContent);

  const editor = useEditor(
    {
      extensions: [StarterKit, EmailTheming.configure({ theme })],
      content: contentRef.current,
      immediatelyRender: false,
      onUpdate: ({ editor: e }) => {
        contentRef.current = e.getJSON();
      },
    },
    [theme],
  );

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
      <EditorContext.Provider value={{ editor }}>
        <EditorContent editor={editor} />
        <BubbleMenu />
      </EditorContext.Provider>
    </ExampleShell>
  );
}
