'use client';

import { StarterKit } from '@react-email/editor/extensions';
import { EmailTheming } from '@react-email/editor/plugins';
import { getNodeMeta, Inspector } from '@react-email/editor/ui';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
import { ExampleShell } from '../example-shell';

const extensions = [StarterKit, EmailTheming];

const content = `
  <h1>Inspector Defaults</h1>
  <p>Click on any element to inspect it. The sidebar renders sensible defaults for each node type — no configuration needed.</p>
  <div class="align-left"><a class="node-button button" data-id="react-email-button" href="https://react.email">Click me</a></div>
  <p>Try selecting text to see the text inspector, or click the background to see document-level styles.</p>
  <img src="https://placehold.co/600x200" alt="Placeholder" />
`;

export function InspectorDefaults() {
  const editor = useEditor({
    extensions,
    content,
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <ExampleShell
      title="Inspector — Defaults"
      description="Zero-config inspector sidebar. All three inspectors (Document, Node, Text) render sensible defaults when no children are passed."
    >
      <EditorContext.Provider value={{ editor }}>
        <div className="flex flex-1 min-h-0 overflow-hidden -m-4">
          <div className="flex-1 min-w-0 p-4 overflow-y-auto">
            <EditorContent editor={editor} />
          </div>

          <aside className="w-60 shrink-0 border-l border-(--re-border) p-4 flex flex-col gap-4 overflow-y-auto text-xs">
            <Inspector.Root>
              <Breadcrumb />
              <Inspector.Document />
              <Inspector.Node />
              <Inspector.Text />
            </Inspector.Root>
          </aside>
        </div>
      </EditorContext.Provider>
    </ExampleShell>
  );
}

function Breadcrumb() {
  return (
    <nav>
      <ol className="flex items-center gap-1 list-none m-0 p-0">
        <Inspector.Breadcrumb>
          {(segments) =>
            segments.map((segment, i) => {
              const label = getNodeMeta(segment.node.nodeType).label;
              return (
                <li key={i} className="flex items-center gap-1">
                  {i !== 0 && <span className="text-(--re-text-muted)">/</span>}
                  <button
                    type="button"
                    className="bg-transparent border-0 cursor-pointer text-(--re-text) p-0 text-xs hover:underline"
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
