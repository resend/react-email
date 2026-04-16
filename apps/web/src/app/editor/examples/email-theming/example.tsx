'use client';

import { StarterKit } from '@react-email/editor/extensions';
import {
  type EditorThemeInput,
  EmailTheming,
  extendTheme,
} from '@react-email/editor/plugins';
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
          text: 'This is a themed email editor. Toggle between Basic, Minimal, and Custom themes to see how styles change.',
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

const customTheme = extendTheme('basic', {
  body: { backgroundColor: '#f8f4ff' },
  container: { backgroundColor: '#ffffff', borderRadius: '8px' },
  h1: { color: '#6d28d9' },
  h2: { color: '#7c3aed' },
  h3: { color: '#8b5cf6' },
  link: { color: '#7c3aed' },
  button: {
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    borderRadius: '6px',
  },
});

type ThemeOption = 'basic' | 'minimal' | 'custom';

const themeMap: Record<ThemeOption, EditorThemeInput> = {
  basic: 'basic',
  minimal: 'minimal',
  custom: customTheme,
};

export function EmailThemingExample() {
  const [selected, setSelected] = useState<ThemeOption>('basic');
  const contentRef = useRef<JSONContent>(initialContent);
  const theme = themeMap[selected];

  const editor = useEditor(
    {
      extensions: [StarterKit, EmailTheming.configure({ theme })],
      content: contentRef.current,
      immediatelyRender: false,
      onUpdate: ({ editor: e }) => {
        contentRef.current = e.getJSON();
      },
    },
    [selected],
  );

  return (
    <ExampleShell
      title="Email theming"
      description="Switch between Basic, Minimal, and Custom themes to see how email styles change."
    >
      <div className="flex gap-2 mb-4">
        {(['basic', 'minimal', 'custom'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSelected(option)}
            className={`px-3 py-1.5 border border-(--re-border) rounded-lg cursor-pointer text-[0.8125rem] capitalize ${
              selected === option
                ? 'bg-(--re-text) text-(--re-bg) font-medium'
                : 'bg-(--re-bg) text-(--re-text) hover:bg-(--re-hover)'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <EditorContext.Provider value={{ editor }}>
        <EditorContent editor={editor} />
        <BubbleMenu />
      </EditorContext.Provider>
    </ExampleShell>
  );
}
