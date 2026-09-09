// @vitest-environment node
import type { Extensions, JSONContent } from '@tiptap/core';
import { Editor, Extension } from '@tiptap/core';
import { describe, expect, it } from 'vitest';
import { StarterKit } from '../../extensions';
import { getGlobalContentFromJSON } from '../../extensions/global-content';
import {
  EmailTheming,
  getEmailTheming,
  getMergedCssJs,
  getResolvedNodeStyles,
} from '../../plugins/email-theming/extension';
import { composeReactEmail } from './compose-react-email';
import type { SerializerPlugin } from './serializer-plugin';

/**
 * These tests run in a plain `node` environment — no happy-dom — to
 * guarantee the serialization pipeline works server-side. If any of them
 * start touching `document`/`window`, they will crash here even though
 * they would pass in the default unit environment.
 */

const richDoc: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'globalContent',
      attrs: { data: { theme: 'basic', css: '.custom { color: red; }' } },
    },
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Server rendered' }],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Nested ' },
        {
          type: 'text',
          text: 'marks',
          marks: [
            { type: 'bold' },
            { type: 'italic' },
            { type: 'link', attrs: { href: 'https://example.com' } },
          ],
        },
      ],
    },
    {
      type: 'button',
      attrs: { href: 'https://example.com/cta', alignment: 'left' },
      content: [{ type: 'text', text: 'Click' }],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'First item' }],
            },
          ],
        },
      ],
    },
    { type: 'horizontalRule' },
  ],
};

it('runs without a DOM', () => {
  expect(typeof document).toBe('undefined');
  expect(typeof window).toBe('undefined');
});

describe('composeReactEmail from content', () => {
  it('serializes JSON content without an editor', async () => {
    const result = await composeReactEmail({
      content: richDoc,
      extensions: [StarterKit, EmailTheming],
      preview: 'preview text',
    });

    expect(result.html).toContain('Server rendered');
    expect(result.html).toContain('https://example.com/cta');
    expect(result.html).toContain('.custom { color: red; }');
    // Plain-text conversion uppercases headings.
    expect(result.text).toContain('SERVER RENDERED');
    expect(result.unformattedHtml).toContain('Server rendered');
  });

  it('produces byte-identical output to the editor path', async () => {
    const extensions = [StarterKit, EmailTheming];
    const editor = new Editor({ extensions, content: richDoc });
    try {
      const fromEditor = await composeReactEmail({
        editor,
        preview: 'parity',
      });
      const fromContent = await composeReactEmail({
        content: richDoc,
        extensions,
        preview: 'parity',
      });

      expect(fromContent.unformattedHtml).toBe(fromEditor.unformattedHtml);
      expect(fromContent.text).toBe(fromEditor.text);
    } finally {
      editor.destroy();
    }
  });

  it('materializes attribute defaults like the editor does', async () => {
    // `button` has a `class: 'button'` default attribute. A hand-written
    // doc that omits it must still render with the default applied.
    const doc: JSONContent = {
      type: 'doc',
      content: [
        {
          type: 'button',
          attrs: { href: 'https://example.com' },
          content: [{ type: 'text', text: 'Go' }],
        },
      ],
    };

    const { unformattedHtml } = await composeReactEmail({
      content: doc,
      extensions: [StarterKit],
    });

    expect(unformattedHtml).toContain('class="button"');
  });

  it('renders preview text and honors previewMode', async () => {
    const extensions = [StarterKit, EmailTheming];
    const withPreview = await composeReactEmail({
      content: richDoc,
      extensions,
      preview: 'the inbox snippet',
    });
    expect(withPreview.unformattedHtml).toContain('the inbox snippet');
    // Dark-mode CSS ships in emails but is stripped in preview mode.
    expect(withPreview.unformattedHtml).toContain('prefers-color-scheme');

    const previewMode = await composeReactEmail({
      content: richDoc,
      extensions,
      previewMode: true,
    });
    expect(previewMode.unformattedHtml).not.toContain('prefers-color-scheme');
  });

  it('serializes different documents with the same extensions array', async () => {
    // Schema compilation is cached per extensions-array identity; the cache
    // must not leak document state between compose runs.
    const extensions = [StarterKit, EmailTheming];
    const first = await composeReactEmail({ content: richDoc, extensions });
    const other = await composeReactEmail({
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'A different document' }],
          },
        ],
      },
      extensions,
    });
    const firstAgain = await composeReactEmail({
      content: richDoc,
      extensions,
    });

    expect(other.unformattedHtml).toContain('A different document');
    expect(other.unformattedHtml).not.toContain('Server rendered');
    expect(firstAgain.unformattedHtml).toBe(first.unformattedHtml);
  });

  it('rejects string content with an actionable error', async () => {
    await expect(
      composeReactEmail({
        // @ts-expect-error — the API only accepts JSON, this tests the runtime guard
        content: '<p>hello</p>',
        extensions: [StarterKit],
      }),
    ).rejects.toThrow(/generateJSON|JSON\.parse/);
  });

  it('rejects content without extensions', async () => {
    await expect(
      // @ts-expect-error — extensions is required with content; tests the runtime guard
      composeReactEmail({ content: richDoc }),
    ).rejects.toThrow(/also requires `extensions`/);
  });

  it('rejects content whose root is not a doc', async () => {
    await expect(
      composeReactEmail({
        content: { type: 'paragraph', content: [{ type: 'text', text: 'x' }] },
        extensions: [StarterKit],
      }),
    ).rejects.toThrow(/full document/);
  });

  it('rejects unknown node types with a clear error', async () => {
    const doc: JSONContent = {
      type: 'doc',
      content: [{ type: 'divider' }],
    };

    await expect(
      composeReactEmail({ content: doc, extensions: [StarterKit] }),
    ).rejects.toThrow(/Unknown node type: divider/);
  });

  it('rejects options mixing editor and content', async () => {
    // Content must be JSON here: string content (the default '') parses
    // through the DOM and cannot be used in this node environment.
    const editor = new Editor({
      extensions: [StarterKit],
      content: { type: 'doc', content: [{ type: 'paragraph' }] },
    });
    try {
      await expect(
        composeReactEmail({
          // @ts-expect-error — mixing modes is a type error; the runtime guard backs it up
          editor,
          content: richDoc,
          extensions: [StarterKit],
        }),
      ).rejects.toThrow(/both `editor` and `content`/);
    } finally {
      editor.destroy();
    }
  });

  it('rejects options mixing editor and extensions', async () => {
    const editor = new Editor({
      extensions: [StarterKit],
      content: { type: 'doc', content: [{ type: 'paragraph' }] },
    });
    try {
      await expect(
        // @ts-expect-error — mixing modes is a type error; the runtime guard backs it up
        composeReactEmail({
          editor,
          extensions: [StarterKit],
        }),
      ).rejects.toThrow(/both `editor` and `content`/);
    } finally {
      editor.destroy();
    }
  });

  it('rejects an already-resolved extensions array', async () => {
    const editor = new Editor({
      extensions: [StarterKit, EmailTheming],
      content: { type: 'doc', content: [{ type: 'paragraph' }] },
    });
    try {
      await expect(
        composeReactEmail({
          content: richDoc,
          extensions: editor.extensionManager.extensions,
        }),
      ).rejects.toThrow(/already-resolved/);
    } finally {
      editor.destroy();
    }
  });

  it('re-resolves when the extensions array is mutated between calls', async () => {
    const extensions: Extensions = [StarterKit];
    const plainDoc: JSONContent = {
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'hello' }] },
      ],
    };
    const first = await composeReactEmail({ content: plainDoc, extensions });
    expect(first.unformattedHtml).toContain('hello');

    extensions.push(EmailTheming);
    const second = await composeReactEmail({ content: richDoc, extensions });
    expect(second.unformattedHtml).toContain('.custom { color: red; }');
  });

  it('skips the prettier pass with format: false', async () => {
    const extensions = [StarterKit, EmailTheming];
    const formatted = await composeReactEmail({ content: richDoc, extensions });
    const unformatted = await composeReactEmail({
      content: richDoc,
      extensions,
      format: false,
    });

    expect(unformatted.html).toBe(unformatted.unformattedHtml);
    expect(formatted.html).not.toBe(formatted.unformattedHtml);
    expect(unformatted.unformattedHtml).toBe(formatted.unformattedHtml);
  });
});

describe('theming on the server', () => {
  const themeConfig = {
    extends: 'basic',
    styles: {
      button: { backgroundColor: '#ff6633' },
    },
  } as const;

  it('applies config-object theme styles to documents never opened in an editor', async () => {
    // The editor seeds config styles into `globalContent` when its view
    // mounts. A document serialized on a server was never mounted, so the
    // styles must be derived from the configuration itself.
    const doc: JSONContent = {
      type: 'doc',
      content: [
        {
          type: 'button',
          attrs: { href: 'https://example.com' },
          content: [{ type: 'text', text: 'Buy' }],
        },
      ],
    };

    const { unformattedHtml } = await composeReactEmail({
      content: doc,
      extensions: [StarterKit, EmailTheming.configure({ theme: themeConfig })],
    });

    expect(unformattedHtml).toContain('#ff6633');
  });

  it('applies config-object theme styles when composing from a never-mounted editor', async () => {
    // Seeding config styles into `globalContent` happens in the editor
    // view's sync() — which never runs for an editor that was created but
    // never mounted (the shape of every headless/server editor).
    const editor = new Editor({
      extensions: [StarterKit, EmailTheming.configure({ theme: themeConfig })],
      content: {
        type: 'doc',
        content: [
          {
            type: 'button',
            attrs: { href: 'https://example.com' },
            content: [{ type: 'text', text: 'Buy' }],
          },
        ],
      },
    });
    try {
      const { unformattedHtml } = await composeReactEmail({ editor });
      expect(unformattedHtml).toContain('#ff6633');
    } finally {
      editor.destroy();
    }
  });

  it('prefers styles persisted in the document over config styles', async () => {
    const doc: JSONContent = {
      type: 'doc',
      content: [
        {
          type: 'globalContent',
          attrs: {
            data: {
              theme: 'basic',
              styles: [
                {
                  id: 'button',
                  title: 'Button',
                  inputs: [
                    {
                      label: 'Background',
                      type: 'color',
                      prop: 'backgroundColor',
                      classReference: 'button',
                      value: '#0000ff',
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          type: 'button',
          attrs: { href: 'https://example.com' },
          content: [{ type: 'text', text: 'Buy' }],
        },
      ],
    };

    const { unformattedHtml } = await composeReactEmail({
      content: doc,
      extensions: [StarterKit, EmailTheming.configure({ theme: themeConfig })],
    });

    expect(unformattedHtml).toContain('#0000ff');
    expect(unformattedHtml).not.toContain('#ff6633');
  });
});

describe('custom serializer plugins', () => {
  it('keeps pre-context plugins working under editor-based composition', async () => {
    // Faithful replica of the dashboard's plot extension, written against
    // the API where the third argument and the BaseTemplate prop were a
    // live Editor: getNodeStyles calls getEmailTheming() with whatever it
    // received, and BaseTemplate looks the theming extension up through
    // editor.extensionManager before delegating with `editor` only.
    const LegacyPlugin = Extension.create({
      name: 'legacyPlugin',
      priority: 1,
      addOptions() {
        return {
          serializerPlugin: {
            getNodeStyles(node: JSONContent, depth: number, editor: Editor) {
              const resolved = getEmailTheming(editor);
              return getResolvedNodeStyles(
                node,
                depth,
                getMergedCssJs(resolved.theme, resolved.styles),
              );
            },
            BaseTemplate({
              previewText,
              children,
              editor,
            }: {
              previewText?: string;
              children: React.ReactNode;
              editor: Editor;
            }) {
              const themingExt = editor.extensionManager.extensions.find(
                (extension) => extension.name === 'theming',
              ) as { options?: { serializerPlugin?: SerializerPlugin } };
              const Original = themingExt?.options?.serializerPlugin
                ?.BaseTemplate as (props: unknown) => React.ReactNode;
              return Original?.({ previewText, children, editor }) ?? children;
            },
          },
        };
      },
    });

    const editor = new Editor({
      extensions: [
        StarterKit,
        EmailTheming.configure({ theme: 'basic' }),
        LegacyPlugin,
      ],
      content: richDoc,
    });
    try {
      const { unformattedHtml } = await composeReactEmail({
        editor,
        preview: 'legacy preview',
      });
      expect(unformattedHtml).toContain('Server rendered');
      expect(unformattedHtml).toContain('legacy preview');
    } finally {
      editor.destroy();
    }
  });

  it('receives the compose context instead of an editor', async () => {
    let receivedContext: unknown;

    const CustomSerializer = Extension.create<{
      serializerPlugin: SerializerPlugin;
    }>({
      name: 'customSerializer',
      addOptions() {
        return {
          serializerPlugin: {
            getNodeStyles(_node, _depth, context) {
              receivedContext = context;
              return {};
            },
            BaseTemplate({ children }) {
              return <html lang="en">{children}</html>;
            },
          } satisfies SerializerPlugin,
        };
      },
    });

    await composeReactEmail({
      content: richDoc,
      extensions: [StarterKit, CustomSerializer],
    });

    expect(receivedContext).toMatchObject({
      doc: expect.objectContaining({ type: 'doc' }),
      extensions: expect.any(Array),
      schema: expect.anything(),
    });
  });

  it('keeps legacy getNodeStyles reading editor internals working under editor-based composition', async () => {
    let editorInternalReads = 0;

    const LegacyInternalsPlugin = Extension.create({
      name: 'legacyInternalsPlugin',
      priority: 1,
      addOptions() {
        return {
          serializerPlugin: {
            getNodeStyles(_node: JSONContent, _depth: number, editor: Editor) {
              const themingExtension = editor.extensionManager.extensions.find(
                (extension) => extension.name === 'theming',
              );
              if (themingExtension && editor.state.doc.nodeSize > 0) {
                editorInternalReads += 1;
              }
              return {};
            },
            BaseTemplate({ children }: { children: React.ReactNode }) {
              return <html lang="en">{children}</html>;
            },
          },
        };
      },
    });

    const editor = new Editor({
      extensions: [StarterKit, EmailTheming, LegacyInternalsPlugin],
      content: richDoc,
    });
    try {
      const { unformattedHtml } = await composeReactEmail({ editor });
      expect(unformattedHtml).toContain('Server rendered');
      expect(editorInternalReads).toBeGreaterThan(0);
    } finally {
      editor.destroy();
    }
  });

  it('throws a descriptive migration error when legacy plugins read editor internals in content mode', async () => {
    const LegacyInternalsPlugin = Extension.create({
      name: 'legacyInternalsPlugin',
      priority: 1,
      addOptions() {
        return {
          serializerPlugin: {
            getNodeStyles(_node: JSONContent, _depth: number, editor: Editor) {
              editor.extensionManager.extensions.find(
                (extension) => extension.name === 'theming',
              );
              return {};
            },
            BaseTemplate({ children }: { children: React.ReactNode }) {
              return <html lang="en">{children}</html>;
            },
          },
        };
      },
    });

    await expect(
      composeReactEmail({
        content: richDoc,
        extensions: [StarterKit, EmailTheming, LegacyInternalsPlugin],
      }),
    ).rejects.toThrow(/runs without an Editor/);
  });

  it('throws a descriptive migration error when legacy BaseTemplates read editor internals in content mode', async () => {
    const LegacyTemplatePlugin = Extension.create({
      name: 'legacyTemplatePlugin',
      priority: 1,
      addOptions() {
        return {
          serializerPlugin: {
            getNodeStyles() {
              return {};
            },
            BaseTemplate({
              children,
              editor,
            }: {
              children: React.ReactNode;
              editor: Editor;
            }) {
              editor.extensionManager.extensions.find(
                (extension) => extension.name === 'theming',
              );
              return <html lang="en">{children}</html>;
            },
          },
        };
      },
    });

    await expect(
      composeReactEmail({
        content: richDoc,
        extensions: [StarterKit, EmailTheming, LegacyTemplatePlugin],
      }),
    ).rejects.toThrow(/runs without an Editor/);
  });
});

describe('getGlobalContentFromJSON', () => {
  it('reads values from the globalContent node', () => {
    expect(getGlobalContentFromJSON('theme', richDoc)).toBe('basic');
    expect(getGlobalContentFromJSON('css', richDoc)).toBe(
      '.custom { color: red; }',
    );
  });

  it('returns null when the document has no globalContent node', () => {
    const doc: JSONContent = {
      type: 'doc',
      content: [{ type: 'paragraph' }],
    };
    expect(getGlobalContentFromJSON('theme', doc)).toBeNull();
    expect(getGlobalContentFromJSON('theme', { type: 'doc' })).toBeNull();
  });
});
