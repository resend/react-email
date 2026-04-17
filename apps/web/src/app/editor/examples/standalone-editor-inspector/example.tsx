'use client';

import { EmailEditor } from '@react-email/editor';
import { Inspector } from '@react-email/editor/ui';
import { ExampleShell } from '../example-shell';

const content = `
  <h1>Newsletter Preview</h1>
  <p>Click any element to inspect it in the sidebar. Select text to see text controls, or click the background for document-level styles.</p>
  <a class="button" data-id="react-email-button" href="https://react.email">Read More</a>
  <p>The inspector sidebar is rendered as a child of EmailEditor.</p>
  <img src="https://placehold.co/600x200" alt="Placeholder" />
`;

export function StandaloneEditorInspector() {
  return (
    <ExampleShell
      title="Standalone editor — inspector"
      description="Add an inspector sidebar alongside the standalone EmailEditor — no manual EditorProvider setup needed."
    >
      <div
        className="flex flex-1 min-h-0 overflow-hidden"
        style={{ height: '32rem' }}
      >
        <EmailEditor
          content={content}
          className="flex-1 min-w-0 overflow-y-auto mr-4 p-4 bg-white rounded-md"
        >
          <Sidebar />
        </EmailEditor>
      </div>
    </ExampleShell>
  );
}

function Sidebar() {
  return (
    <Inspector.Root className="w-60 shrink-0 border-l border-(--re-border) pt-8 p-4 flex flex-col overflow-y-auto text-xs">
      <Breadcrumb />
      <Inspector.Document />
      <Inspector.Node />
      <Inspector.Text />
    </Inspector.Root>
  );
}

function Breadcrumb() {
  return (
    <nav>
      <ol className="flex items-center gap-1 list-none m-0 p-0 mb-4">
        <Inspector.Breadcrumb>
          {(segments) =>
            segments.map((segment, i) => {
              const label = segment.node?.nodeType ?? 'Layout';
              if (i === segments.length - 1) {
                return (
                  <li key={i} className="flex items-center gap-1">
                    {i !== 0 && (
                      <span className="text-(--re-text-muted)">/</span>
                    )}
                    <span className="text-(--re-text) p-0 text-xs capitalize">
                      {label}
                    </span>
                  </li>
                );
              }
              return (
                <li key={i} className="flex items-center gap-1">
                  {i !== 0 && <span className="text-(--re-text-muted)">/</span>}
                  <button
                    type="button"
                    className="bg-transparent border-0 cursor-pointer text-(--re-text-muted) p-0 text-xs hover:text-(--re-text) capitalize"
                    onClick={() => segment.focus()}
                  >
                    {label}
                  </button>
                </li>
              );
            })
          }
        </Inspector.Breadcrumb>
      </ol>
    </nav>
  );
}
