import { StarterKit } from '@react-email/editor/extensions';
import { EmailTheming } from '@react-email/editor/plugins';
import { Inspector } from '@react-email/editor/ui';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
import { ExampleShell } from '../example-shell';

const extensions = [StarterKit, EmailTheming];

const content = `
  <h1>Custom Inspector</h1>
  <p>This inspector is built entirely from scratch — no pre-built sections or primitives. Just render-props data and plain HTML inputs.</p>
  <div class="align-left"><a class="node-button button" data-id="react-email-button" href="https://react.email">Click me</a></div>
  <img src="https://placehold.co/600x200" alt="Placeholder" />
`;

export function InspectorCustom() {
  const editor = useEditor({
    extensions,
    content,
  });

  return (
    <ExampleShell
      title="Inspector — Fully Custom"
      description="Build the entire inspector UI from scratch using only render-props data and plain HTML. No primitives or section components."
    >
      <EditorContext.Provider value={{ editor }}>
        <div className="flex flex-1 min-h-0 overflow-hidden -m-4">
          <div className="flex-1 min-w-0 p-4 overflow-y-auto">
            <EditorContent editor={editor} />
          </div>

          <aside className="w-60 shrink-0 border-l border-(--re-border) p-4 flex flex-col gap-3 overflow-y-auto text-xs">
            <Inspector.Provider>
              <Inspector.Document>
                {({ findStyleValue, setGlobalStyle }) => (
                  <fieldset className="border border-(--re-border) rounded p-2 m-0">
                    <legend className="text-xs font-bold px-1">Document</legend>
                    <Row label="Background">
                      <ColorPicker
                        value={String(
                          findStyleValue('body', 'backgroundColor') ?? '',
                        )}
                        onChange={(v) =>
                          setGlobalStyle('body', 'backgroundColor', v)
                        }
                      />
                    </Row>
                    <Row label="Container width">
                      <NumberField
                        value={findStyleValue('container', 'width')}
                        onChange={(v) =>
                          setGlobalStyle('container', 'width', v)
                        }
                        unit="px"
                      />
                    </Row>
                    <Row label="Container radius">
                      <NumberField
                        value={findStyleValue('container', 'borderRadius')}
                        onChange={(v) =>
                          setGlobalStyle('container', 'borderRadius', v)
                        }
                        unit="px"
                      />
                    </Row>
                  </fieldset>
                )}
              </Inspector.Document>

              <Inspector.Node>
                {({ nodeType, getStyle, setStyle, getAttr, setAttr }) => (
                  <fieldset className="border border-(--re-border) rounded p-2 m-0">
                    <legend className="text-xs font-bold px-1">
                      {nodeType}
                    </legend>
                    <Row label="Background">
                      <ColorPicker
                        value={String(getStyle('backgroundColor') ?? '')}
                        onChange={(v) => setStyle('backgroundColor', v)}
                      />
                    </Row>
                    <Row label="Padding">
                      <NumberField
                        value={getStyle('paddingTop')}
                        onChange={(v) => setStyle('paddingTop', v)}
                        unit="px"
                      />
                    </Row>
                    {nodeType === 'image' && (
                      <>
                        <Row label="Width">
                          <NumberField
                            value={getAttr('width') as number}
                            onChange={(v) => setAttr('width', v)}
                            unit="px"
                          />
                        </Row>
                        <Row label="Alt">
                          <input
                            type="text"
                            value={String(getAttr('alt') ?? '')}
                            onChange={(e) => setAttr('alt', e.target.value)}
                            className="w-full text-xs bg-transparent border border-(--re-border) rounded px-1.5 py-1"
                          />
                        </Row>
                      </>
                    )}
                    {nodeType === 'button' && (
                      <Row label="Link">
                        <input
                          type="text"
                          value={String(getAttr('href') ?? '')}
                          onChange={(e) => setAttr('href', e.target.value)}
                          className="w-full text-xs bg-transparent border border-(--re-border) rounded px-1.5 py-1"
                        />
                      </Row>
                    )}
                  </fieldset>
                )}
              </Inspector.Node>

              <Inspector.Text>
                {({
                  marks,
                  toggleMark,
                  alignment,
                  setAlignment,
                  linkColor,
                  setLinkColor,
                  isLinkActive,
                  getStyle,
                  setStyle,
                }) => (
                  <fieldset className="border border-(--re-border) rounded p-2 m-0">
                    <legend className="text-xs font-bold px-1">Text</legend>
                    <Row label="Format">
                      <span className="flex gap-0.5">
                        <MarkButton
                          label="B"
                          active={marks.bold}
                          onClick={() => toggleMark('bold')}
                          className="font-bold"
                        />
                        <MarkButton
                          label="I"
                          active={marks.italic}
                          onClick={() => toggleMark('italic')}
                          className="italic"
                        />
                        <MarkButton
                          label="U"
                          active={marks.underline}
                          onClick={() => toggleMark('underline')}
                          className="underline"
                        />
                        <MarkButton
                          label="S"
                          active={marks.strike}
                          onClick={() => toggleMark('strike')}
                          className="line-through"
                        />
                      </span>
                    </Row>
                    <Row label="Align">
                      <span className="flex gap-0.5">
                        {(['left', 'center', 'right'] as const).map((a) => (
                          <MarkButton
                            key={a}
                            label={a[0].toUpperCase()}
                            active={alignment === a}
                            onClick={() => setAlignment(a)}
                          />
                        ))}
                      </span>
                    </Row>
                    <Row label="Color">
                      <ColorPicker
                        value={String(getStyle('color') ?? '')}
                        onChange={(v) => setStyle('color', v)}
                      />
                    </Row>
                    <Row label="Size">
                      <NumberField
                        value={getStyle('fontSize')}
                        onChange={(v) => setStyle('fontSize', v)}
                        unit="px"
                      />
                    </Row>
                    {isLinkActive && (
                      <Row label="Link color">
                        <ColorPicker
                          value={linkColor}
                          onChange={setLinkColor}
                        />
                      </Row>
                    )}
                  </fieldset>
                )}
              </Inspector.Text>
            </Inspector.Provider>
          </aside>
        </div>
      </EditorContext.Provider>
    </ExampleShell>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2 mt-1.5 first:mt-0">
      <span className="text-(--re-text-muted) shrink-0">{label}</span>
      {children}
    </div>
  );
}

function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const normalized = normalizeHex(value);
  return (
    <span className="flex items-center gap-1">
      <input
        type="color"
        value={normalized}
        onChange={(e) => onChange(e.target.value)}
        className="w-5 h-5 border-0 p-0 cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-16 text-xs bg-transparent border border-(--re-border) rounded px-1 py-0.5"
      />
    </span>
  );
}

function NumberField({
  value,
  onChange,
  unit,
}: {
  value: string | number | undefined;
  onChange: (v: number | '') => void;
  unit?: string;
}) {
  return (
    <span className="flex items-center gap-1">
      <input
        type="number"
        value={value ?? ''}
        onChange={(e) => {
          const raw = e.target.value;
          onChange(raw === '' ? '' : Number.parseFloat(raw));
        }}
        className="w-14 text-xs bg-transparent border border-(--re-border) rounded px-1 py-0.5"
      />
      {unit && <span className="text-(--re-text-muted)">{unit}</span>}
    </span>
  );
}

function MarkButton({
  label,
  active,
  onClick,
  className = '',
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-6 h-6 text-xs border rounded cursor-pointer ${
        active
          ? 'bg-(--re-text) text-(--re-bg) border-(--re-text)'
          : 'bg-transparent text-(--re-text) border-(--re-border)'
      } ${className}`}
    >
      {label}
    </button>
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
