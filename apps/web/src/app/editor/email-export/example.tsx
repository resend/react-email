'use client';

import { composeReactEmail } from '@react-email/editor/core';
import { StarterKit } from '@react-email/editor/extensions';
import { EmailTheming } from '@react-email/editor/plugins';
import { BubbleMenu } from '@react-email/editor/ui';
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import { useState } from 'react';
import { ExampleShell } from '../example-shell';

const extensions = [StarterKit, EmailTheming];

const content = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'My Email Newsletter' }],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Edit this content, then click ' },
        { type: 'text', marks: [{ type: 'bold' }], text: 'Export HTML' },
        { type: 'text', text: ' to see the generated email markup.' },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'The exported HTML uses React Email components and is ready to send.',
        },
      ],
    },
  ],
};

function ExportPanel() {
  const { editor } = useCurrentEditor();
  const [html, setHtml] = useState('');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!editor) return;
    setExporting(true);
    try {
      const result = await composeReactEmail({ editor });
      setHtml(result.html);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleExport}
        disabled={exporting}
        className="px-3 py-1.5 border border-(--re-border) rounded-lg bg-(--re-bg) text-(--re-text) cursor-pointer text-[0.8125rem] hover:bg-(--re-hover) disabled:opacity-50"
      >
        {exporting ? 'Exporting...' : 'Export HTML'}
      </button>
      {html && (
        <textarea
          readOnly
          value={html}
          className="mt-3 w-full h-64 p-3 font-mono text-xs bg-(--re-bg) text-(--re-text) border border-(--re-border) rounded-lg resize-y"
        />
      )}
    </div>
  );
}

export function EmailExport() {
  return (
    <ExampleShell
      title="Email export"
      description="Edit content and export it as email-ready HTML using composeReactEmail()."
    >
      <EditorProvider
        extensions={extensions}
        content={content}
        immediatelyRender={false}
        editorProps={{
          attributes: {
            class: 'p-4 bg-white rounded-md',
          },
        }}
      >
        <BubbleMenu />
        <ExportPanel />
      </EditorProvider>
    </ExampleShell>
  );
}
