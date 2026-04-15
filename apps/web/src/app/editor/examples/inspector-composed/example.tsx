'use client';

import { StarterKit } from '@react-email/editor/extensions';
import { EmailTheming } from '@react-email/editor/plugins';
import { Inspector } from '@react-email/editor/ui';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
import { ExampleShell } from '../example-shell';

const extensions = [StarterKit, EmailTheming];

const content = `
  <h1>Composed Inspector</h1>
  <p>This example picks specific sections and adds a custom one. Click an element to see the composed sidebar.</p>
  <div class="align-left"><a class="node-button button" data-id="react-email-button" href="https://react.email">Click me</a></div>
  <img src="https://placehold.co/600x200" alt="Placeholder" />
`;

export function InspectorComposed() {
  const editor = useEditor({
    extensions,
    content,
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <ExampleShell
      title="Inspector — Composed"
      description="Cherry-pick which sections render, control collapse state, and mix in custom sections alongside built-in ones."
    >
      <EditorContext.Provider value={{ editor }}>
        <div className="flex flex-1 min-h-0 overflow-hidden -m-4">
          <div className="flex-1 min-w-0 p-4 overflow-y-auto">
            <EditorContent editor={editor} />
          </div>

          <aside className="w-60 shrink-0 border-l border-(--re-border) p-4 flex flex-col gap-4 overflow-y-auto text-xs">
            <Inspector.Root>
              <Breadcrumb />

              <Inspector.Document>
                {({ findStyleValue, setGlobalStyle }) => (
                  <fieldset className="border border-(--re-border) rounded p-2 m-0">
                    <legend className="text-xs font-bold px-1">
                      Theme Colors
                    </legend>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="text-(--re-text-muted)">Page</span>
                      <input
                        type="color"
                        value={normalizeHex(
                          String(
                            findStyleValue('body', 'backgroundColor') ?? '',
                          ),
                        )}
                        onChange={(e) =>
                          setGlobalStyle(
                            'body',
                            'backgroundColor',
                            e.target.value,
                          )
                        }
                        className="w-6 h-6 border-0 p-0 cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="text-(--re-text-muted)">Container</span>
                      <input
                        type="color"
                        value={normalizeHex(
                          String(
                            findStyleValue('container', 'backgroundColor') ??
                              '',
                          ),
                        )}
                        onChange={(e) =>
                          setGlobalStyle(
                            'container',
                            'backgroundColor',
                            e.target.value,
                          )
                        }
                        className="w-6 h-6 border-0 p-0 cursor-pointer"
                      />
                    </div>
                  </fieldset>
                )}
              </Inspector.Document>

              <Inspector.Node>
                {(ctx) => (
                  <>
                    <Inspector.Background {...ctx} />
                    <Inspector.Padding {...ctx} />
                    {ctx.nodeType === 'image' && <Inspector.Size {...ctx} />}
                    <Inspector.Border {...ctx} initialCollapsed />

                    <fieldset className="border border-(--re-border) rounded p-2 m-0">
                      <legend className="text-xs font-bold px-1">Data</legend>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-(--re-text-muted)">ID</span>
                        <input
                          type="text"
                          value={String(ctx.getAttr('data-id') ?? '')}
                          onChange={(e) =>
                            ctx.setAttr('data-id', e.target.value)
                          }
                          className="w-24 text-xs bg-transparent border border-(--re-border) rounded px-1.5 py-1"
                        />
                      </div>
                    </fieldset>
                  </>
                )}
              </Inspector.Node>

              <Inspector.Text>
                {(ctx) => (
                  <>
                    <Inspector.Typography {...ctx} />
                    {ctx.isLinkActive && <Inspector.Link {...ctx} />}
                  </>
                )}
              </Inspector.Text>
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
              const label =
                segment.node.nodeType === 'body'
                  ? 'Layout'
                  : segment.node.nodeType;
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

function normalizeHex(value: string): string {
  if (!value) return '#000000';
  const v = value.trim();
  const shortHex = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(v);
  if (shortHex) {
    return `#${shortHex[1]}${shortHex[1]}${shortHex[2]}${shortHex[2]}${shortHex[3]}${shortHex[3]}`;
  }
  if (/^#[0-9a-f]{6}$/i.test(v)) return v;
  return '#000000';
}
