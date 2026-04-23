'use client';

import { StarterKit } from '@react-email/editor/extensions';
import {
  createTheme,
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
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Custom Theme Demo' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This example shows three approaches to theme customization: extending a built-in theme, creating one from scratch, and using a built-in preset.',
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Try switching themes' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Notice how colors, typography, and spacing change between each option.',
        },
      ],
    },
  ],
};

const brandTheme = extendTheme('basic', {
  body: { backgroundColor: '#eff6ff' },
  container: { backgroundColor: '#ffffff' },
  h1: { color: '#1e40af', fontSize: '28px' },
  h2: { color: '#2563eb' },
  link: { color: '#2563eb', textDecoration: 'underline' },
  button: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    borderRadius: '6px',
  },
});

const darkTheme = createTheme({
  body: { backgroundColor: '#1a1a2e', color: '#e2e8f0' },
  container: {
    backgroundColor: '#16213e',
    color: '#e2e8f0',
    paddingTop: '24px',
    paddingBottom: '24px',
    paddingLeft: '24px',
    paddingRight: '24px',
  },
  h1: { color: '#e2e8f0', fontSize: '28px' },
  h2: { color: '#94a3b8' },
  link: { color: '#60a5fa', textDecoration: 'underline' },
  button: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    borderRadius: '4px',
  },
});

type ThemeOption = 'basic' | 'brand' | 'dark';

const themes: Record<ThemeOption, { label: string; theme: EditorThemeInput }> =
  {
    basic: { label: 'Basic (built-in)', theme: 'basic' },
    brand: { label: 'Brand (extendTheme)', theme: brandTheme },
    dark: { label: 'Dark (createTheme)', theme: darkTheme },
  };

export function CustomThemeExample() {
  const [selected, setSelected] = useState<ThemeOption>('basic');
  const contentRef = useRef<JSONContent>(initialContent);
  const { theme } = themes[selected];

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
      title="Custom themes"
      description="Define custom themes with createTheme and extendTheme."
    >
      <div className="flex gap-2 mb-4 flex-wrap">
        {(Object.keys(themes) as ThemeOption[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelected(key)}
            className={`px-3 py-1.5 border border-(--re-border) rounded-lg cursor-pointer text-[0.8125rem] ${
              selected === key
                ? 'bg-(--re-text) text-(--re-bg) font-medium'
                : 'bg-(--re-bg) text-(--re-text) hover:bg-(--re-hover)'
            }`}
          >
            {themes[key].label}
          </button>
        ))}
      </div>
      <EditorContext.Provider value={{ editor }}>
        <EditorContent
          className="p-4 pt-0 bg-white rounded-md"
          editor={editor}
        />
        <BubbleMenu />
      </EditorContext.Provider>
    </ExampleShell>
  );
}
