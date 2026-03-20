import { composeReactEmail } from '@react-email/editor/core';
import { StarterKit } from '@react-email/editor/extensions';
import { EmailTheming } from '@react-email/editor/plugins';
import {
  BubbleMenu,
  ButtonBubbleMenu,
  defaultSlashCommands,
  LinkBubbleMenu,
  SlashCommand,
} from '@react-email/editor/ui';
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import { useState } from 'react';
import { ExampleShell } from '../example-shell';

type EditorTheme = 'basic' | 'minimal';

const content = `
  <h1>Weekly Newsletter</h1>
  <p>This is a full-featured email editor combining all available components. Try selecting text, inserting columns, adding buttons, and switching themes.</p>
  <h2>Featured Article</h2>
  <p>Check out our latest post on <a href="https://react.email" target="_blank">React Email</a> for building better email templates.</p>
  <div class="align-left"><a class="node-button button" data-id="react-email-button" href="https://react.email">Read More</a></div>
`;

function ControlPanel() {
  const { editor } = useCurrentEditor();
  const [html, setHtml] = useState('');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!editor) return;
    setExporting(true);
    const result = await composeReactEmail({ editor, preview: null });
    setHtml(result.html);
    setExporting(false);
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

export function FullEmailBuilder() {
  const [theme, setTheme] = useState<EditorTheme>('basic');
  const extensions = [StarterKit, EmailTheming.configure({ theme })];

  return (
    <ExampleShell
      title="Full Email Builder"
      description="All components combined: bubble menus, slash commands, theming, and export."
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
          Basic Theme
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
          Minimal Theme
        </button>
      </div>
      <EditorProvider key={theme} extensions={extensions} content={content}>
        <BubbleMenu.Default excludeNodes={['button']} excludeMarks={['link']} />
        <LinkBubbleMenu.Default />
        <ButtonBubbleMenu.Default />
        <SlashCommand.Root items={defaultSlashCommands} />
        <ControlPanel />
      </EditorProvider>
    </ExampleShell>
  );
}
