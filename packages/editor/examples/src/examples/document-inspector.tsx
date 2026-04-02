import { StarterKit } from '@react-email/editor/extensions';
import { EmailTheming } from '@react-email/editor/plugins';
import { Inspector } from '@react-email/editor/ui';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
import { useId } from 'react';

const extensions = [StarterKit, EmailTheming];

const content = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This example uses Inspector.Provider and Inspector.Document to render document-level style properties through a render-props API.',
        },
      ],
    },
  ],
};

export function DocumentInspector() {
  const editor = useEditor({
    extensions,
    content,
  });

  return (
    <div>
      <p className="text-sm text-(--re-text-muted) mb-4">
        Using <code>Inspector.Provider</code> and{' '}
        <code>Inspector.Document</code> to render document-level global styles
        with predefined sections and a render-props API.
      </p>
      <EditorContext.Provider value={{ editor }}>
        <div className="flex gap-4 border border-(--re-border) rounded-xl min-h-75">
          <div className="flex-1 p-4">
            <EditorContent editor={editor} />
          </div>

          <aside className="w-80 border-l border-(--re-border) p-4 flex flex-col gap-4 overflow-y-auto">
            <Inspector.Provider>
              <nav>
                <ol className="flex items-center gap-1 text-xs list-none m-0 p-0">
                  <Inspector.Breadcrumb>
                    {(segments) =>
                      segments.map((segment, i) => (
                        <li key={i} className="flex items-center gap-1">
                          {i !== 0 && (
                            <span className="text-(--re-text-muted)">/</span>
                          )}
                          <button
                            type="button"
                            data-clickable={i !== segments.length - 1}
                            className="bg-transparent border-0 data-clickable:cursor-pointer text-(--re-text) p-0 text-xs data-clickable:hover:underline"
                            onClick={() => segment.focus()}
                          >
                            {segment.node?.nodeType ?? 'Layout'}
                          </button>
                        </li>
                      ))
                    }
                  </Inspector.Breadcrumb>
                </ol>
              </nav>

              <Inspector.Document>
                {({ findStyleValue, setGlobalStyle }) => (
                  <div className="flex flex-col gap-4">
                    {/* Background */}
                    <Section title="Background">
                      <ColorRow
                        label="Color"
                        value={findStyleValue('body', 'backgroundColor')}
                        onChange={(v) =>
                          setGlobalStyle('body', 'backgroundColor', v)
                        }
                      />
                      <NumberRow
                        label="Padding"
                        unit="px"
                        value={findStyleValue('body', 'padding')}
                        onChange={(v) => setGlobalStyle('body', 'padding', v)}
                      />
                    </Section>

                    {/* Body */}
                    <Section title="Body">
                      <ColorRow
                        label="Color"
                        value={findStyleValue('container', 'backgroundColor')}
                        onChange={(v) =>
                          setGlobalStyle('container', 'backgroundColor', v)
                        }
                      />
                      <NumberRow
                        label="Width"
                        unit="px"
                        value={findStyleValue('container', 'width')}
                        onChange={(v) =>
                          setGlobalStyle('container', 'width', v)
                        }
                      />
                      <NumberRow
                        label="Height"
                        unit="px"
                        value={findStyleValue('container', 'height')}
                        onChange={(v) =>
                          setGlobalStyle('container', 'height', v)
                        }
                      />
                      <NumberRow
                        label="Padding"
                        unit="px"
                        value={findStyleValue('container', 'padding')}
                        onChange={(v) =>
                          setGlobalStyle('container', 'padding', v)
                        }
                      />
                      <NumberRow
                        label="Rounded"
                        unit="px"
                        value={findStyleValue('container', 'borderRadius')}
                        onChange={(v) =>
                          setGlobalStyle('container', 'borderRadius', v)
                        }
                      />
                      <NumberRow
                        label="Border"
                        unit="px"
                        value={findStyleValue('container', 'borderWidth')}
                        onChange={(v) =>
                          setGlobalStyle('container', 'borderWidth', v)
                        }
                      />
                      <ColorRow
                        label=""
                        value={findStyleValue('container', 'borderColor')}
                        onChange={(v) =>
                          setGlobalStyle('container', 'borderColor', v)
                        }
                      />
                    </Section>
                  </div>
                )}
              </Inspector.Document>
            </Inspector.Provider>
          </aside>
        </div>
      </EditorContext.Provider>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small presentational helpers for the predefined sections           */
/* ------------------------------------------------------------------ */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-(--re-border) pt-3 first:border-0 first:pt-0">
      <h3 className="text-xs font-semibold text-(--re-text) m-0 mb-2">
        {title}
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  );
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | number | undefined;
  onChange: (v: string) => void;
}) {
  const strValue = value == null ? '' : String(value);
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-2">
      <label htmlFor={id} className="text-xs text-(--re-text-muted) min-w-20">
        {label}
      </label>
      <span className="flex items-center gap-1">
        <input
          id={id}
          type="color"
          value={normalizeHex(strValue)}
          onChange={(e) => onChange(e.target.value)}
          className="w-6 h-6 border-0 p-0 cursor-pointer"
        />
        <input
          type="text"
          value={strValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 text-xs bg-transparent border border-(--re-border) rounded px-1.5 py-1 text-(--re-text)"
        />
      </span>
    </div>
  );
}

function NumberRow({
  label,
  value,
  unit,
  onChange,
}: {
  label: string;
  value: string | number | undefined;
  unit?: string;
  onChange: (v: number | '') => void;
}) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-2">
      <label htmlFor={id} className="text-xs text-(--re-text-muted) min-w-20">
        {label}
      </label>
      <span className="flex items-center gap-1">
        <input
          id={id}
          type="number"
          value={value}
          onChange={(e) => {
            const raw = e.target.value;
            onChange(raw === '' ? '' : Number.parseFloat(raw));
          }}
          className="w-16 text-xs bg-transparent border border-(--re-border) rounded px-1.5 py-1 text-(--re-text)"
        />
        {unit && <span className="text-xs text-(--re-text-muted)">{unit}</span>}
      </span>
    </div>
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
