'use client';

import { EmailEditor, type EmailEditorRef } from '@react-email/editor';
import { StarterKit } from '@react-email/editor/extensions';
import { generateJSON } from '@tiptap/html';
import { useRef, useState } from 'react';
import { ExampleShell } from '../example-shell';

const sampleHtml = `<h1>Hello from HTML</h1>
<p>This <strong>HTML</strong> was converted to <em>Tiptap JSON</em> and loaded into the editor.</p>
<ul>
  <li>List item one</li>
  <li>List item two</li>
</ul>
<blockquote>You can also paste HTML directly into the editor — the paste handler converts it automatically.</blockquote>`;

const htmlToTiptap = (html: string) => generateJSON(html, [StarterKit]);

export function HtmlToTiptap() {
  const editorRef = useRef<EmailEditorRef>(null);
  const [html, setHtml] = useState(sampleHtml);
  const [json, setJson] = useState('');
  const [initialContent] = useState(() => htmlToTiptap(sampleHtml));

  const handleImport = () => {
    const content = htmlToTiptap(html);
    editorRef.current?.editor?.commands.setContent(content);
    setJson(JSON.stringify(content, null, 2));
  };

  return (
    <ExampleShell
      title="HTML → Tiptap JSON"
      description="Paste HTML below and click Import to convert it into Tiptap JSON and load it into the editor. You can also paste HTML directly into the editor."
    >
      <textarea
        value={html}
        onChange={(event) => setHtml(event.target.value)}
        className="w-full h-32 p-3 mb-3 font-mono text-xs bg-(--re-bg) text-(--re-text) border border-(--re-border) rounded-lg resize-y"
      />
      <button
        type="button"
        onClick={handleImport}
        className="self-start px-3 py-1.5 mb-4 border border-(--re-border) rounded-lg bg-(--re-bg) text-(--re-text) cursor-pointer text-[0.8125rem] hover:bg-(--re-hover)"
      >
        Import HTML
      </button>
      <EmailEditor
        ref={editorRef}
        className="p-4 bg-white rounded-md"
        content={initialContent}
      />
      {json && (
        <textarea
          readOnly
          value={json}
          className="mt-3 w-full h-64 p-3 font-mono text-xs bg-(--re-bg) text-(--re-text) border border-(--re-border) rounded-lg resize-y"
        />
      )}
    </ExampleShell>
  );
}
