'use client';

import { EmailEditor, type EmailEditorRef } from '@react-email/editor';
import { useRef, useState } from 'react';
import { ExampleShell } from '../example-shell';

const content = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Welcome to the Newsletter' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Edit this content, then use the buttons below to export or inspect the editor output. Try switching themes to see how the editor adapts.',
        },
      ],
    },
  ],
};

export function StandaloneEditorFull() {
  const editorRef = useRef<EmailEditorRef>(null);
  const [theme, setTheme] = useState<'basic' | 'minimal'>('basic');
  const [output, setOutput] = useState('');

  const handleExportHtml = async () => {
    if (!editorRef.current) return;
    const html = await editorRef.current.getEmailHTML();
    setOutput(html);
  };

  const handleGetJson = () => {
    if (!editorRef.current) return;
    setOutput(JSON.stringify(editorRef.current.getJSON(), null, 2));
  };

  return (
    <ExampleShell
      title="Standalone Editor — Full Features"
      description="Theme switching, ref methods (export, getJSON), and callbacks — all with a single component."
    >
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setTheme(theme === 'basic' ? 'minimal' : 'basic')}
          className="px-3 py-1.5 border border-(--re-border) rounded-lg bg-(--re-bg) text-(--re-text) cursor-pointer text-[0.8125rem] hover:bg-(--re-hover)"
        >
          Theme: {theme}
        </button>
        <button
          type="button"
          onClick={handleExportHtml}
          className="px-3 py-1.5 border border-(--re-border) rounded-lg bg-(--re-bg) text-(--re-text) cursor-pointer text-[0.8125rem] hover:bg-(--re-hover)"
        >
          Export HTML
        </button>
        <button
          type="button"
          onClick={handleGetJson}
          className="px-3 py-1.5 border border-(--re-border) rounded-lg bg-(--re-bg) text-(--re-text) cursor-pointer text-[0.8125rem] hover:bg-(--re-hover)"
        >
          Get JSON
        </button>
      </div>

      <EmailEditor ref={editorRef} content={content} theme={theme} />

      {output && (
        <textarea
          readOnly
          value={output}
          className="mt-4 w-full h-64 p-3 font-mono text-xs bg-(--re-bg) text-(--re-text) border border-(--re-border) rounded-lg resize-y"
        />
      )}
    </ExampleShell>
  );
}
