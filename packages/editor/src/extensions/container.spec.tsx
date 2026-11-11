import type { JSONContent } from '@tiptap/core';
import { Editor, Extension } from '@tiptap/core';
import { generateJSON } from '@tiptap/html';
import { AllSelection, type Selection } from '@tiptap/pm/state';
import { Container as ReactEmailContainer, render } from 'react-email';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createPasteHandler } from '../core/create-paste-handler';
import { composeReactEmail } from '../core/serializer/compose-react-email';
import { EmailTheming } from '../plugins';
import { DEFAULT_STYLES } from '../utils/default-styles';
import { COLLABORATIVE_WRAP_DEBOUNCE_MS, Container } from './container';
import { StarterKit } from './index';

vi.mock('@/actions/ai', () => ({
  uploadImageViaAI: vi.fn(),
}));

const containerStyle = {
  ...DEFAULT_STYLES.container,
};

describe('Container Node', () => {
  it('renders React Email properly', async () => {
    const Component = Container.config.renderToReactEmail;
    expect(Component).toBeDefined();
    expect(
      await render(
        <Component
          node={{
            type: 'container',
            attrs: {},
          }}
          style={containerStyle}
          extension={Container}
        >
          Container content
        </Component>,
        { pretty: true },
      ),
    ).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <!--$-->
      <table
        align="center"
        width="100%"
        border="0"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
        style="width:100%">
        <tbody>
          <tr style="width:100%">
            <td>Container content</td>
          </tr>
        </tbody>
      </table>
      <!--/$-->
      "
    `);
  });

  it('renders with width and maxWidth from style', async () => {
    const Component = Container.config.renderToReactEmail;
    const html = await render(
      <Component
        node={{
          type: 'container',
          attrs: {},
        }}
        style={{ ...containerStyle, width: 600 }}
        extension={Container}
      >
        Content
      </Component>,
    );

    expect(html).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:600px;width:100%"><tbody><tr style="width:100%"><td>Content</td></tr></tbody></table><!--/$-->"`,
    );
  });

  let editor: Editor | null = null;

  afterEach(() => {
    editor?.destroy();
    editor = null;
  });

  function createEditor(content: JSONContent) {
    editor = new Editor({
      content,
      extensions: [StarterKit],
    });
    editor.view.dispatch(editor.state.tr);
    return editor;
  }

  it('auto-inserts container node when editor initializes with plain content', () => {
    createEditor({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello' }],
        },
      ],
    });

    const json = editor!.getJSON();
    expect(json).toMatchInlineSnapshot(`
      {
        "content": [
          {
            "content": [
              {
                "attrs": {
                  "alignment": null,
                  "class": "",
                  "style": "",
                },
                "content": [
                  {
                    "text": "Hello",
                    "type": "text",
                  },
                ],
                "type": "paragraph",
              },
            ],
            "type": "container",
          },
        ],
        "type": "doc",
      }
    `);
  });

  it('preserves globalContent outside the container', () => {
    createEditor({
      type: 'doc',
      content: [
        {
          type: 'globalContent',
          attrs: {
            data: { theme: 'basic' },
          },
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello' }],
        },
      ],
    });

    const json = editor!.getJSON();

    expect(json).toMatchInlineSnapshot(`
      {
        "content": [
          {
            "attrs": {
              "data": {
                "theme": "basic",
              },
            },
            "type": "globalContent",
          },
          {
            "content": [
              {
                "attrs": {
                  "alignment": null,
                  "class": "",
                  "style": "",
                },
                "content": [
                  {
                    "text": "Hello",
                    "type": "text",
                  },
                ],
                "type": "paragraph",
              },
            ],
            "type": "container",
          },
        ],
        "type": "doc",
      }
    `);
  });

  it('renders container div with node-container class in editor HTML', () => {
    createEditor({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello' }],
        },
      ],
    });

    const html = editor!.getHTML();
    expect(html).toMatchInlineSnapshot(
      `"<div data-type="container" class="node-container"><p class="node-paragraph" style="">Hello</p></div>"`,
    );
  });

  it('does not duplicate the container when content already has one', () => {
    createEditor({
      type: 'doc',
      content: [
        {
          type: 'container',
          content: [
            {
              type: 'heading',
              attrs: { level: 1 },
              content: [{ type: 'text', text: 'Hello' }],
            },
          ],
        },
      ],
    });

    const json = editor!.getJSON();
    const rootContainers = json.content!.filter((n) => n.type === 'container');
    expect(rootContainers).toHaveLength(1);

    const container = rootContainers[0];
    for (const child of container.content!) {
      expect(child.type).not.toBe('container');
    }
  });

  function createEditorWithContent(content: JSONContent) {
    editor = new Editor({
      content,
      extensions: [StarterKit, EmailTheming],
    });
    editor.view.dispatch(editor.state.tr);
    return editor;
  }

  it('renders container element in serialized email output', async () => {
    const content: JSONContent = {
      type: 'doc',
      content: [
        {
          type: 'globalContent',
          attrs: {
            data: { theme: 'basic', css: '' },
          },
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello world' }],
        },
      ],
    };

    const ed = createEditorWithContent(content);
    const result = await composeReactEmail({ editor: ed, preview: '' });

    expect(result.html).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html dir="ltr" lang="en">
        <head>
          <meta content="width=device-width" name="viewport" />
          <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
          <meta name="x-apple-disable-message-reformatting" />
          <meta content="IE=edge" http-equiv="X-UA-Compatible" />
          <meta name="x-apple-disable-message-reformatting" />
          <meta
            content="telephone=no,address=no,email=no,date=no,url=no"
            name="format-detection" />
          <style>
            @media (prefers-color-scheme: dark){li::marker{color:#c4c4c4}}
          </style>
        </head>
        <body dir="ltr" lang="en" style="background-color:#ffffff">
          <!--$--><!--html--><!--head--><!--body-->
          <table
            border="0"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            align="center">
            <tbody>
              <tr>
                <td
                  dir="ltr"
                  lang="en"
                  style="font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;font-size:1em;min-height:100%;line-height:155%;background-color:#ffffff">
                  <table
                    align="center"
                    width="100%"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="max-width:600px;align:center;width:100%;color:#000000;background-color:#ffffff;border-radius:0px;border-color:#000000;line-height:155%">
                    <tbody>
                      <tr style="width:100%">
                        <td
                          style="padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px">
                          <p
                            style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                            Hello world
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <!--/$-->
        </body>
      </html>
      "
    `);
  });

  describe('collaboration mode (simulated liveblocks)', () => {
    // Replays the real Liveblocks transaction pattern observed in production:
    //
    //  1. One y-sync$ replacing doc with a bare empty paragraph
    //     (TipTap normalises null → '' → schema `block+` gives one <p>)
    //  2. ~18 rapid-fire y-sync$ "stabilisation" transactions that each
    //     replace the doc with its current content
    //  3. One final y-sync$ delivering the real document content
    //  4. Two generic no-op transactions (Liveblocks cleanup)
    const STABILIZATION_ROUNDS = 18;

    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    async function settle() {
      await vi.advanceTimersByTimeAsync(COLLABORATIVE_WRAP_DEBOUNCE_MS + 10);
    }

    function countTopLevelContainers(editorInstance: Editor) {
      return editorInstance
        .getJSON()
        .content!.filter((n) => n.type === 'container').length;
    }

    function createFakeLiveblocksExtension(getContent: (schema: any) => any) {
      let resolve: () => void;
      const promise = new Promise<void>((rslv) => {
        resolve = rslv;
      });
      return [
        Extension.create({
          name: 'liveblocksExtension',
          onCreate() {
            const { view } = this.editor;
            const { schema } = view.state;
            const finalContent = getContent(schema);

            const tr1 = view.state.tr.replaceWith(
              0,
              view.state.doc.content.size,
              schema.nodes.paragraph.create(),
            );
            tr1.setMeta('y-sync$', true);
            view.dispatch(tr1);

            // lots of updates that don't really change the document
            for (let i = 0; i < STABILIZATION_ROUNDS; i++) {
              const tr = view.state.tr.replaceWith(
                0,
                view.state.doc.content.size,
                view.state.doc,
              );
              tr.setMeta('y-sync$', true);
              view.dispatch(tr);
            }

            // some empty transactions also without the y-sync$
            view.dispatch(view.state.tr);
            view.dispatch(view.state.tr);

            const trFinal = view.state.tr.replaceWith(
              0,
              view.state.doc.content.size,
              finalContent,
            );
            trFinal.setMeta('y-sync$', true);
            view.dispatch(trFinal);

            resolve();
          },
        }),
        promise,
      ] as const;
    }

    it('wraps collaboration-synced content in a container', async () => {
      const [fakeLiveblocks, contentResolved] = createFakeLiveblocksExtension(
        (schema) =>
          schema.nodes.paragraph.create(
            null,
            schema.text('Hello from collaboration'),
          ),
      );

      editor = new Editor({
        extensions: [StarterKit, fakeLiveblocks],
      });

      await settle();
      await contentResolved;

      const json = editor!.getJSON();
      expect(json).toMatchInlineSnapshot(`
        {
          "content": [
            {
              "content": [
                {
                  "attrs": {
                    "alignment": null,
                    "class": "",
                    "style": "",
                  },
                  "content": [
                    {
                      "text": "Hello from collaboration",
                      "type": "text",
                    },
                  ],
                  "type": "paragraph",
                },
              ],
              "type": "container",
            },
          ],
          "type": "doc",
        }
      `);
    });

    it('does not duplicate container when collaboration syncs content with a container', async () => {
      const [fakeLiveblocks, contentResolved] = createFakeLiveblocksExtension(
        (schema) => {
          const paragraph = schema.nodes.paragraph.create(
            null,
            schema.text('Hello from collaboration'),
          );
          return schema.nodes.container.create(null, paragraph);
        },
      );

      editor = new Editor({
        extensions: [StarterKit, fakeLiveblocks],
      });

      await settle();
      await contentResolved;

      const json = editor!.getJSON();
      expect(json).toMatchInlineSnapshot(`
        {
          "content": [
            {
              "content": [
                {
                  "attrs": {
                    "alignment": null,
                    "class": "",
                    "style": "",
                  },
                  "content": [
                    {
                      "text": "Hello from collaboration",
                      "type": "text",
                    },
                  ],
                  "type": "paragraph",
                },
              ],
              "type": "container",
            },
          ],
          "type": "doc",
        }
      `);
    });

    it('wraps a doc that syncs with no content only after the first real edit', async () => {
      const [fakeLiveblocks, contentResolved] = createFakeLiveblocksExtension(
        (schema) => schema.nodes.paragraph.create(),
      );

      editor = new Editor({
        extensions: [StarterKit, fakeLiveblocks],
      });

      await settle();
      await contentResolved;

      expect(countTopLevelContainers(editor!)).toBe(0);

      editor!.commands.insertContent('Hello');
      await settle();

      expect(countTopLevelContainers(editor!)).toBe(1);
    });

    it('preserves globalContent outside the container when synced via collaboration', async () => {
      const [fakeLiveblocks, contentResolved] = createFakeLiveblocksExtension(
        (schema) => {
          const globalContent = schema.nodes.globalContent.create({
            data: { theme: 'basic' },
          });
          const paragraph = schema.nodes.paragraph.create(
            null,
            schema.text('Collab content'),
          );
          return [globalContent, paragraph];
        },
      );

      editor = new Editor({
        extensions: [StarterKit, fakeLiveblocks],
      });

      await settle();
      await contentResolved;

      const json = editor!.getJSON();
      expect(json).toMatchInlineSnapshot(`
        {
          "content": [
            {
              "attrs": {
                "data": {
                  "theme": "basic",
                },
              },
              "type": "globalContent",
            },
            {
              "content": [
                {
                  "attrs": {
                    "alignment": null,
                    "class": "",
                    "style": "",
                  },
                  "content": [
                    {
                      "text": "Collab content",
                      "type": "text",
                    },
                  ],
                  "type": "paragraph",
                },
              ],
              "type": "container",
            },
          ],
          "type": "doc",
        }
      `);
    });

    it('wraps multiple blocks synced via collaboration into a single container', async () => {
      const [fakeLiveblocks, contentResolved] = createFakeLiveblocksExtension(
        (schema) => {
          const heading = schema.nodes.heading.create(
            { level: 1 },
            schema.text('Title'),
          );
          const p1 = schema.nodes.paragraph.create(
            null,
            schema.text('First paragraph'),
          );
          const p2 = schema.nodes.paragraph.create(
            null,
            schema.text('Second paragraph'),
          );
          return [heading, p1, p2];
        },
      );

      editor = new Editor({
        extensions: [StarterKit, fakeLiveblocks],
      });

      await settle();
      await contentResolved;

      const json = editor!.getJSON();
      expect(json).toMatchInlineSnapshot(`
        {
          "content": [
            {
              "content": [
                {
                  "attrs": {
                    "alignment": null,
                    "class": "",
                    "level": 1,
                    "style": "",
                  },
                  "content": [
                    {
                      "text": "Title",
                      "type": "text",
                    },
                  ],
                  "type": "heading",
                },
                {
                  "attrs": {
                    "alignment": null,
                    "class": "",
                    "style": "",
                  },
                  "content": [
                    {
                      "text": "First paragraph",
                      "type": "text",
                    },
                  ],
                  "type": "paragraph",
                },
                {
                  "attrs": {
                    "alignment": null,
                    "class": "",
                    "style": "",
                  },
                  "content": [
                    {
                      "text": "Second paragraph",
                      "type": "text",
                    },
                  ],
                  "type": "paragraph",
                },
              ],
              "type": "container",
            },
          ],
          "type": "doc",
        }
      `);
    });

    it('does not duplicate container across multiple sequential y-sync$ updates', async () => {
      let resolveInit: () => void;
      let resolveUpdate: () => void;
      const initDone = new Promise<void>((r) => {
        resolveInit = r;
      });
      const updateDone = new Promise<void>((r) => {
        resolveUpdate = r;
      });

      const fakeLiveblocks = Extension.create({
        name: 'liveblocksExtension',
        onCreate() {
          const { view } = this.editor;
          const { schema } = view.state;

          // Full init pattern
          const tr1 = view.state.tr.replaceWith(
            0,
            view.state.doc.content.size,
            schema.nodes.paragraph.create(),
          );
          tr1.setMeta('y-sync$', true);
          view.dispatch(tr1);

          for (let i = 0; i < STABILIZATION_ROUNDS; i++) {
            const tr = view.state.tr.replaceWith(
              0,
              view.state.doc.content.size,
              view.state.doc,
            );
            tr.setMeta('y-sync$', true);
            view.dispatch(tr);
          }

          const p1 = schema.nodes.paragraph.create(
            null,
            schema.text('First sync'),
          );
          const trFinal = view.state.tr.replaceWith(
            0,
            view.state.doc.content.size,
            schema.nodes.container.create(null, p1),
          );
          trFinal.setMeta('y-sync$', true);
          view.dispatch(trFinal);

          view.dispatch(view.state.tr);
          view.dispatch(view.state.tr);

          resolveInit!();

          // A second user edits; Liveblocks delivers another y-sync$
          setTimeout(() => {
            const p2 = schema.nodes.paragraph.create(
              null,
              schema.text('Second sync'),
            );
            const trUpdate = view.state.tr.replaceWith(
              0,
              view.state.doc.content.size,
              schema.nodes.container.create(null, p2),
            );
            trUpdate.setMeta('y-sync$', true);
            view.dispatch(trUpdate);
            resolveUpdate!();
          }, 50);
        },
      });

      editor = new Editor({
        extensions: [StarterKit, fakeLiveblocks],
      });

      await vi.advanceTimersByTimeAsync(1);
      await initDone;
      let json = editor.getJSON();
      expect(json).toMatchInlineSnapshot(`
        {
          "content": [
            {
              "content": [
                {
                  "attrs": {
                    "alignment": null,
                    "class": "",
                    "style": "",
                  },
                  "content": [
                    {
                      "text": "First sync",
                      "type": "text",
                    },
                  ],
                  "type": "paragraph",
                },
              ],
              "type": "container",
            },
          ],
          "type": "doc",
        }
      `);

      await settle();
      await updateDone;
      json = editor.getJSON();
      expect(json).toMatchInlineSnapshot(`
        {
          "content": [
            {
              "content": [
                {
                  "attrs": {
                    "alignment": null,
                    "class": "",
                    "style": "",
                  },
                  "content": [
                    {
                      "text": "Second sync",
                      "type": "text",
                    },
                  ],
                  "type": "paragraph",
                },
              ],
              "type": "container",
            },
          ],
          "type": "doc",
        }
      `);
    });

    it('does not eagerly wrap before the first y-sync$ content arrives', async () => {
      const fakeLiveblocks = Extension.create({
        name: 'liveblocksExtension',
      });

      editor = new Editor({
        extensions: [StarterKit, fakeLiveblocks],
      });

      const json = editor!.getJSON();
      expect(json.content!.some((n) => n.type === 'container')).toBe(false);

      await settle();
      expect(countTopLevelContainers(editor!)).toBe(0);
    });

    it('does not wrap the transient containerless docs produced while sync is still streaming', async () => {
      const fakeLiveblocks = Extension.create({
        name: 'liveblocksExtension',
      });

      editor = new Editor({
        extensions: [StarterKit, fakeLiveblocks],
      });

      const { view } = editor;
      const { schema } = view.state;
      const dispatchSync = (content: any) => {
        const tr = view.state.tr.replaceWith(
          0,
          view.state.doc.content.size,
          content,
        );
        tr.setMeta('y-sync$', true);
        view.dispatch(tr);
      };

      const chunk1 = schema.nodes.paragraph.create(
        null,
        schema.text('First chunk'),
      );
      const chunk2 = schema.nodes.paragraph.create(
        null,
        schema.text('Second chunk'),
      );

      dispatchSync(chunk1);
      await vi.advanceTimersByTimeAsync(COLLABORATIVE_WRAP_DEBOUNCE_MS - 100);
      expect(countTopLevelContainers(editor!)).toBe(0);

      dispatchSync([chunk1, chunk2]);
      await vi.advanceTimersByTimeAsync(COLLABORATIVE_WRAP_DEBOUNCE_MS - 100);
      expect(countTopLevelContainers(editor!)).toBe(0);

      dispatchSync(schema.nodes.container.create(null, [chunk1, chunk2]));
      await settle();
      expect(countTopLevelContainers(editor!)).toBe(1);
    });

    it('does not arm the wrap from sync transactions that do not change the doc', async () => {
      const fakeLiveblocks = Extension.create({
        name: 'liveblocksExtension',
      });

      editor = new Editor({
        extensions: [StarterKit, fakeLiveblocks],
      });

      const { view } = editor;
      const noop = view.state.tr.replaceWith(
        0,
        view.state.doc.content.size,
        view.state.doc,
      );
      noop.setMeta('y-sync$', true);
      view.dispatch(noop);

      await settle();
      expect(countTopLevelContainers(editor!)).toBe(0);

      const { schema } = view.state;
      const late = view.state.tr.replaceWith(
        0,
        view.state.doc.content.size,
        schema.nodes.container.create(
          null,
          schema.nodes.paragraph.create(null, schema.text('Late content')),
        ),
      );
      late.setMeta('y-sync$', true);
      view.dispatch(late);

      await settle();
      expect(countTopLevelContainers(editor!)).toBe(1);
    });

    it('does not wrap a doc reduced to a bare empty paragraph until the next real edit', async () => {
      const fakeLiveblocks = Extension.create({
        name: 'liveblocksExtension',
      });

      editor = new Editor({
        extensions: [StarterKit, fakeLiveblocks],
      });

      const { view } = editor;
      const { schema } = view.state;
      const seed = view.state.tr.replaceWith(
        0,
        view.state.doc.content.size,
        schema.nodes.container.create(
          null,
          schema.nodes.paragraph.create(null, schema.text('Hi')),
        ),
      );
      seed.setMeta('y-sync$', true);
      view.dispatch(seed);

      const wipe = view.state.tr.replaceWith(
        0,
        view.state.doc.content.size,
        schema.nodes.paragraph.create(),
      );
      view.dispatch(wipe);

      await settle();
      expect(countTopLevelContainers(editor!)).toBe(0);

      editor!.commands.insertContent('Hello');
      await settle();
      expect(countTopLevelContainers(editor!)).toBe(1);
    });

    it('preserves multiple containers when the synced document has them', async () => {
      const [fakeLiveblocks, contentResolved] = createFakeLiveblocksExtension(
        (schema) => {
          const container1 = schema.nodes.container.create(null, [
            schema.nodes.paragraph.create(
              null,
              schema.text('well hello friends'),
            ),
          ]);
          const container2 = schema.nodes.container.create(
            null,
            schema.nodes.paragraph.create(),
          );
          const container3 = schema.nodes.container.create(
            null,
            schema.nodes.paragraph.create(),
          );
          return [container1, container2, container3];
        },
      );

      editor = new Editor({
        extensions: [StarterKit, fakeLiveblocks],
      });

      await settle();
      await contentResolved;

      const json = editor!.getJSON();
      const containers = json.content!.filter((n) => n.type === 'container');
      expect(containers).toHaveLength(3);
      for (const container of containers) {
        for (const child of container.content!) {
          expect(child.type).not.toBe('container');
        }
      }
    });
  });

  function createEmptyEditor() {
    editor = new Editor({ extensions: [StarterKit] });
    editor.view.dispatch(editor.state.tr);
    return editor;
  }

  it('parses Container component HTML as a container node', async () => {
    const ed = createEmptyEditor();

    ed.commands.setContent(
      await render(
        <ReactEmailContainer>
          well hello friendsssssssssss{' '}
          <a href="httsp://react.email">click this</a>
        </ReactEmailContainer>,
      ),
    );

    expect(ed.getJSON()).toMatchInlineSnapshot(`
      {
        "content": [
          {
            "content": [
              {
                "attrs": {
                  "alignment": null,
                  "class": "",
                  "style": "",
                },
                "content": [
                  {
                    "text": "well hello friendsssssssssss ",
                    "type": "text",
                  },
                  {
                    "marks": [
                      {
                        "attrs": {
                          "class": "",
                          "href": "httsp://react.email",
                          "rel": "noopener noreferrer nofollow",
                          "ses:no-track": null,
                          "style": "",
                          "target": "_blank",
                          "title": null,
                        },
                        "type": "link",
                      },
                    ],
                    "text": "click this",
                    "type": "text",
                  },
                ],
                "type": "paragraph",
              },
            ],
            "type": "container",
          },
        ],
        "type": "doc",
      }
    `);
  });

  function email(theme: string, texts: string[]): JSONContent {
    return {
      type: 'doc',
      content: [
        { type: 'globalContent', attrs: { data: { theme } } },
        {
          type: 'container',
          content: texts.map((text) => ({
            type: 'paragraph',
            content: [{ type: 'text', text }],
          })),
        },
      ],
    };
  }

  // The editor as EmailEditor builds it: with the paste handler, whose HTML
  // branch re-parses the clipboard itself.
  function createPastingEditor(content: JSONContent) {
    const extensions = [StarterKit];
    return new Editor({
      content,
      extensions,
      editorProps: { handlePaste: createPasteHandler({ extensions }) },
    });
  }

  // The whole document by default, as Mod-a copies it.
  function clipboardOf(
    source: Editor,
    selection: Selection = new AllSelection(source.state.doc),
  ) {
    const { dom, text } = source.view.serializeForClipboard(
      selection.content(),
    );
    return { html: dom.innerHTML, text };
  }

  function pasteInto(
    target: Editor,
    clipboard: { html: string; text: string },
    position: 'end' | number = 'end',
    // Shift+paste: ProseMirror pastes the plain text, and the event still
    // carries the HTML.
    asPlainText = false,
  ) {
    const data: Record<string, string> = {
      'text/html': clipboard.html,
      'text/plain': clipboard.text,
    };
    const event = {
      clipboardData: {
        getData: (type: string) => data[type] ?? '',
        files: { length: 0 },
      },
      preventDefault: () => {},
    } as unknown as ClipboardEvent;
    target.commands.focus(position);
    if (asPlainText) {
      target.view.pasteText(clipboard.text, event);
    } else {
      target.view.pasteHTML(clipboard.html, event);
    }
  }

  const bodyOf = (editor: Editor) => editor.getJSON().content?.[1];

  const paragraphOf = (text: string) => ({
    type: 'paragraph',
    content: [{ type: 'text', text }],
  });

  it('pastes a whole-document copy as plain blocks, generation after generation', () => {
    let source = createPastingEditor(
      email('minimal', ['Weekly update', 'Item']),
    );
    for (let generation = 1; generation <= 3; generation++) {
      const target = createPastingEditor(email('basic', ['Intro']));
      pasteInto(target, clipboardOf(source));

      const { content } = target.getJSON();
      expect(content).toHaveLength(2);
      expect(content?.[0]).toMatchObject({
        type: 'globalContent',
        attrs: { data: { theme: 'basic' } },
      });
      expect(content?.[1]).toMatchObject({
        type: 'container',
        content: [
          ...Array.from({ length: generation }, () => paragraphOf('Intro')),
          paragraphOf('Weekly update'),
          paragraphOf('Item'),
        ],
      });

      source.destroy();
      source = target;
    }
    source.destroy();
  });

  it('pastes paragraphs copied in the body into the paragraph under the cursor', () => {
    // The everyday copy: a text selection across two paragraphs. Its
    // clipboard is wrapped in the container div, and it has to keep pasting
    // the way ProseMirror pastes its own slice.
    const source = createPastingEditor(email('minimal', ['First', 'Second']));
    source.commands.setTextSelection({ from: 3, to: 16 });
    const target = createPastingEditor(
      email('basic', ['Hello world', 'Outro']),
    );

    // At "Hello |world": "First" joins the text before the cursor, "Second"
    // the text after it, and the cursor ends between the two.
    pasteInto(target, clipboardOf(source, source.state.selection), 9);

    expect(target.getJSON().content?.[1]).toMatchObject({
      type: 'container',
      content: [
        paragraphOf('Hello First'),
        paragraphOf('Secondworld'),
        paragraphOf('Outro'),
      ],
    });
    target.commands.insertContent('|');
    expect(target.state.doc.textContent).toContain('Second|world');
    source.destroy();
    target.destroy();
  });

  it('keeps one container when body paragraphs are pasted at the start of a paragraph', () => {
    // ProseMirror keeps a `defining` node around its content when the content
    // is pasted, and at the start of a line it had room for a whole container.
    const source = createPastingEditor(email('minimal', ['First', 'Second']));
    source.commands.setTextSelection({ from: 3, to: 16 });
    const target = createPastingEditor(
      email('basic', ['Hello world', 'Outro']),
    );

    pasteInto(target, clipboardOf(source, source.state.selection), 3);

    expect(bodyOf(target)).toMatchObject({
      type: 'container',
      content: [
        paragraphOf('First'),
        paragraphOf('SecondHello world'),
        paragraphOf('Outro'),
      ],
    });
    source.destroy();
    target.destroy();
  });

  it('keeps one container when part of a paragraph is pasted at the start of a paragraph', () => {
    // This clipboard has no container div: the container travels in
    // data-pm-slice, and ProseMirror wraps the text in it again.
    const source = createPastingEditor(email('minimal', ['First', 'Second']));
    source.commands.setTextSelection({ from: 4, to: 7 });
    const target = createPastingEditor(
      email('basic', ['Hello world', 'Outro']),
    );

    pasteInto(target, clipboardOf(source, source.state.selection), 3);

    expect(bodyOf(target)).toMatchObject({
      type: 'container',
      content: [paragraphOf('irsHello world'), paragraphOf('Outro')],
    });
    source.destroy();
    target.destroy();
  });

  it('keeps the text after the cursor out of a button that ends the copy', () => {
    // The copy ends inside the button label. Its container wrapper says how
    // deep the copy is open, so the wrapper has to parse as a container for
    // the button to come out closed.
    const source = createPastingEditor({
      type: 'doc',
      content: [
        { type: 'globalContent', attrs: { data: { theme: 'minimal' } } },
        {
          type: 'container',
          content: [
            paragraphOf('Intro'),
            { type: 'button', content: [{ type: 'text', text: 'Click' }] },
            paragraphOf('After'),
          ],
        },
      ],
    });
    source.commands.setTextSelection({ from: 3, to: 15 });
    const target = createPastingEditor(
      email('basic', ['Hello world', 'Outro']),
    );

    pasteInto(target, clipboardOf(source, source.state.selection), 9);

    const texts: string[] = [];
    target.state.doc.descendants((node) => {
      if (node.isTextblock) {
        texts.push(`${node.type.name}:${node.textContent}`);
      }
    });
    expect(texts).toEqual([
      'paragraph:Hello Intro',
      'button:Click',
      'paragraph:world',
      'paragraph:Outro',
    ]);
    source.destroy();
    target.destroy();
  });

  it('keeps one container when the handler parses the HTML of a body copy', () => {
    const source = createPastingEditor(email('minimal', ['First', 'Second']));
    source.commands.setTextSelection({ from: 3, to: 16 });
    const target = createPastingEditor(email('basic', ['Intro']));

    pasteInto(target, clipboardOf(source, source.state.selection), 'end', true);

    expect(bodyOf(target)).toMatchObject({
      type: 'container',
      content: [
        paragraphOf('Intro'),
        paragraphOf('First'),
        paragraphOf('Second'),
      ],
    });
    source.destroy();
    target.destroy();
  });

  it('sanitizes last, after data-pm-slice is dropped', () => {
    // Dropping data-pm-slice from HTML that is already sanitized could turn
    // text the sanitizer left alone (the content of a <style>) into elements.
    const target = createPastingEditor(email('basic', ['Intro']));
    const html =
      '<p class="node-paragraph">one data-pm-slice=&quot;</p><style>"<a data-id="react-email-button" href="javascript:alert(1)">Buy</a></style><p>two</p>';

    // As plain text, because happy-dom cannot give ProseMirror a <style>.
    pasteInto(target, { html, text: 'one\ntwo' }, 'end', true);

    expect(target.state.doc.textContent).toContain('two');
    expect(JSON.stringify(target.getJSON())).not.toContain('javascript:');
    target.destroy();
  });

  it('keeps pasted text that only reads like a data-pm-slice attribute', () => {
    const target = createPastingEditor(email('basic', ['Intro']));

    pasteInto(target, {
      html: '<p>Set data-pm-slice="2 2 []" on it</p><p>two</p>',
      text: 'Set data-pm-slice="2 2 []" on it\n\ntwo',
    });

    expect(target.state.doc.textContent).toContain(
      'Set data-pm-slice="2 2 []" on it',
    );
    target.destroy();
  });

  it('does not hang on a clipboard full of unclosed tags', () => {
    const target = createPastingEditor(email('basic', ['Intro']));

    pasteInto(target, {
      html: `${'<a'.repeat(100_000)}><p>one</p><p>two</p>`,
      text: 'one\n\ntwo',
    });

    expect(target.state.doc.textContent).toContain('Intro');
    target.destroy();
  });

  it('drops unsafe URLs from pasted HTML that carries the editor classes', () => {
    // The node- classes mark the editor's own HTML, and anything can carry
    // them. The paste still goes through the sanitizer.
    const target = createPastingEditor(email('basic', ['Intro']));
    const html =
      '<p class="node-paragraph"><a href="javascript:alert(1)">link</a></p>' +
      '<div class="node-button" data-type="button"><a data-id="react-email-button" href="javascript:alert(2)">Buy</a></div>';

    pasteInto(target, { html, text: 'link Buy' });

    expect(target.state.doc.textContent).toContain('link');
    expect(JSON.stringify(target.getJSON())).not.toContain('javascript:');
    target.destroy();
  });

  it('parses the container table below the Body wrapper table of a sent email', () => {
    // react-email's Body renders a full-width presentation table around the
    // Container, so an imported email's container table is never directly
    // under the doc. The table rule has to match it there.
    const json = generateJSON(
      '<table role="presentation" width="100%"><tbody><tr><td><table role="presentation" style="max-width:600px"><tbody><tr><td><p>Imported</p></td></tr></tbody></table></td></tr></tbody></table>',
      [StarterKit],
    );

    const containers: JSONContent[] = [];
    const collect = (node: JSONContent) => {
      if (node.type === 'container') {
        containers.push(node);
      }
      node.content?.forEach(collect);
    };
    collect(json);

    expect(containers).toHaveLength(1);
    expect(containers[0]).toMatchObject({ content: [paragraphOf('Imported')] });
  });

  it('does not parse a table without max-width as a container', () => {
    const ed = createEmptyEditor();

    ed.commands.setContent(
      '<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr style="width: 100%"><td><p>Hello world</p></td></tr></tbody></table>',
    );

    expect(ed.getJSON()).toMatchInlineSnapshot(`
        {
          "content": [
            {
              "content": [
                {
                  "attrs": {
                    "align": "center",
                    "alignment": "center",
                    "border": "0",
                    "cellpadding": "0",
                    "cellspacing": "0",
                    "class": "",
                    "data-id": null,
                    "dir": null,
                    "height": null,
                    "id": null,
                    "lang": null,
                    "style": "",
                    "title": null,
                    "width": "100%",
                  },
                  "content": [
                    {
                      "attrs": {
                        "align": null,
                        "alignment": null,
                        "bgcolor": null,
                        "class": "",
                        "colspan": null,
                        "data-id": null,
                        "dir": null,
                        "height": null,
                        "id": null,
                        "lang": null,
                        "rowspan": null,
                        "style": "width: 100%",
                        "title": null,
                        "valign": null,
                        "width": null,
                      },
                      "content": [
                        {
                          "attrs": {
                            "align": null,
                            "alignment": null,
                            "bgcolor": null,
                            "class": "",
                            "colspan": null,
                            "data-id": null,
                            "dir": null,
                            "height": null,
                            "id": null,
                            "lang": null,
                            "rowspan": null,
                            "style": "",
                            "title": null,
                            "valign": null,
                            "width": null,
                          },
                          "content": [
                            {
                              "attrs": {
                                "alignment": null,
                                "class": "",
                                "style": "",
                              },
                              "content": [
                                {
                                  "text": "Hello world",
                                  "type": "text",
                                },
                              ],
                              "type": "paragraph",
                            },
                          ],
                          "type": "tableCell",
                        },
                      ],
                      "type": "tableRow",
                    },
                  ],
                  "type": "table",
                },
                {
                  "attrs": {
                    "alignment": null,
                    "class": "",
                    "style": "",
                  },
                  "type": "paragraph",
                },
              ],
              "type": "container",
            },
          ],
          "type": "doc",
        }
      `);
  });

  it('does not parse a table with multiple rows as a container', () => {
    const ed = createEmptyEditor();

    ed.commands.setContent(
      '<table role="presentation" style="max-width: 37.5em"><tbody><tr><td><p>Row 1</p></td></tr><tr><td><p>Row 2</p></td></tr></tbody></table>',
    );

    expect(ed.getJSON()).toMatchInlineSnapshot(`
        {
          "content": [
            {
              "content": [
                {
                  "attrs": {
                    "align": null,
                    "alignment": null,
                    "border": null,
                    "cellpadding": null,
                    "cellspacing": null,
                    "class": "",
                    "data-id": null,
                    "dir": null,
                    "height": null,
                    "id": null,
                    "lang": null,
                    "style": "max-width: 37.5em",
                    "title": null,
                    "width": null,
                  },
                  "content": [
                    {
                      "attrs": {
                        "align": null,
                        "alignment": null,
                        "bgcolor": null,
                        "class": "",
                        "colspan": null,
                        "data-id": null,
                        "dir": null,
                        "height": null,
                        "id": null,
                        "lang": null,
                        "rowspan": null,
                        "style": "",
                        "title": null,
                        "valign": null,
                        "width": null,
                      },
                      "content": [
                        {
                          "attrs": {
                            "align": null,
                            "alignment": null,
                            "bgcolor": null,
                            "class": "",
                            "colspan": null,
                            "data-id": null,
                            "dir": null,
                            "height": null,
                            "id": null,
                            "lang": null,
                            "rowspan": null,
                            "style": "",
                            "title": null,
                            "valign": null,
                            "width": null,
                          },
                          "content": [
                            {
                              "attrs": {
                                "alignment": null,
                                "class": "",
                                "style": "",
                              },
                              "content": [
                                {
                                  "text": "Row 1",
                                  "type": "text",
                                },
                              ],
                              "type": "paragraph",
                            },
                          ],
                          "type": "tableCell",
                        },
                      ],
                      "type": "tableRow",
                    },
                    {
                      "attrs": {
                        "align": null,
                        "alignment": null,
                        "bgcolor": null,
                        "class": "",
                        "colspan": null,
                        "data-id": null,
                        "dir": null,
                        "height": null,
                        "id": null,
                        "lang": null,
                        "rowspan": null,
                        "style": "",
                        "title": null,
                        "valign": null,
                        "width": null,
                      },
                      "content": [
                        {
                          "attrs": {
                            "align": null,
                            "alignment": null,
                            "bgcolor": null,
                            "class": "",
                            "colspan": null,
                            "data-id": null,
                            "dir": null,
                            "height": null,
                            "id": null,
                            "lang": null,
                            "rowspan": null,
                            "style": "",
                            "title": null,
                            "valign": null,
                            "width": null,
                          },
                          "content": [
                            {
                              "attrs": {
                                "alignment": null,
                                "class": "",
                                "style": "",
                              },
                              "content": [
                                {
                                  "text": "Row 2",
                                  "type": "text",
                                },
                              ],
                              "type": "paragraph",
                            },
                          ],
                          "type": "tableCell",
                        },
                      ],
                      "type": "tableRow",
                    },
                  ],
                  "type": "table",
                },
                {
                  "attrs": {
                    "alignment": null,
                    "class": "",
                    "style": "",
                  },
                  "type": "paragraph",
                },
              ],
              "type": "container",
            },
          ],
          "type": "doc",
        }
      `);
  });

  it('does not parse a table with multiple cells as a container', () => {
    const ed = createEmptyEditor();

    ed.commands.setContent(
      '<table role="presentation" style="max-width: 37.5em"><tbody><tr><td><p>Cell 1</p></td><td><p>Cell 2</p></td></tr></tbody></table>',
    );

    expect(ed.getJSON()).toMatchInlineSnapshot(`
        {
          "content": [
            {
              "content": [
                {
                  "attrs": {
                    "align": null,
                    "alignment": null,
                    "border": null,
                    "cellpadding": null,
                    "cellspacing": null,
                    "class": "",
                    "data-id": null,
                    "dir": null,
                    "height": null,
                    "id": null,
                    "lang": null,
                    "style": "max-width: 37.5em",
                    "title": null,
                    "width": null,
                  },
                  "content": [
                    {
                      "attrs": {
                        "align": null,
                        "alignment": null,
                        "bgcolor": null,
                        "class": "",
                        "colspan": null,
                        "data-id": null,
                        "dir": null,
                        "height": null,
                        "id": null,
                        "lang": null,
                        "rowspan": null,
                        "style": "",
                        "title": null,
                        "valign": null,
                        "width": null,
                      },
                      "content": [
                        {
                          "attrs": {
                            "align": null,
                            "alignment": null,
                            "bgcolor": null,
                            "class": "",
                            "colspan": null,
                            "data-id": null,
                            "dir": null,
                            "height": null,
                            "id": null,
                            "lang": null,
                            "rowspan": null,
                            "style": "",
                            "title": null,
                            "valign": null,
                            "width": null,
                          },
                          "content": [
                            {
                              "attrs": {
                                "alignment": null,
                                "class": "",
                                "style": "",
                              },
                              "content": [
                                {
                                  "text": "Cell 1",
                                  "type": "text",
                                },
                              ],
                              "type": "paragraph",
                            },
                          ],
                          "type": "tableCell",
                        },
                        {
                          "attrs": {
                            "align": null,
                            "alignment": null,
                            "bgcolor": null,
                            "class": "",
                            "colspan": null,
                            "data-id": null,
                            "dir": null,
                            "height": null,
                            "id": null,
                            "lang": null,
                            "rowspan": null,
                            "style": "",
                            "title": null,
                            "valign": null,
                            "width": null,
                          },
                          "content": [
                            {
                              "attrs": {
                                "alignment": null,
                                "class": "",
                                "style": "",
                              },
                              "content": [
                                {
                                  "text": "Cell 2",
                                  "type": "text",
                                },
                              ],
                              "type": "paragraph",
                            },
                          ],
                          "type": "tableCell",
                        },
                      ],
                      "type": "tableRow",
                    },
                  ],
                  "type": "table",
                },
                {
                  "attrs": {
                    "alignment": null,
                    "class": "",
                    "style": "",
                  },
                  "type": "paragraph",
                },
              ],
              "type": "container",
            },
          ],
          "type": "doc",
        }
      `);
  });

  it('does not apply reset margin/padding to the container when using center alignment', async () => {
    const content: JSONContent = {
      type: 'doc',
      content: [
        {
          type: 'globalContent',
          attrs: {
            data: {
              theme: 'basic',
              css: '',
              styles: [
                {
                  id: 'container',
                  title: 'Content',
                  classReference: 'container',
                  inputs: [
                    {
                      label: 'Align',
                      type: 'select',
                      value: 'center',
                      options: {
                        left: 'Left',
                        center: 'Center',
                        right: 'Right',
                      },
                      prop: 'align',
                      classReference: 'container',
                    },
                    {
                      label: 'Width',
                      type: 'number',
                      value: 600,
                      unit: 'px',
                      prop: 'width',
                      classReference: 'container',
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          type: 'container',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Centered content' }],
            },
          ],
        },
      ],
    };

    const ed = createEditorWithContent(content);
    const result = await composeReactEmail({ editor: ed, preview: '' });

    expect(result.html).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html dir="ltr" lang="en">
        <head>
          <meta content="width=device-width" name="viewport" />
          <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
          <meta name="x-apple-disable-message-reformatting" />
          <meta content="IE=edge" http-equiv="X-UA-Compatible" />
          <meta name="x-apple-disable-message-reformatting" />
          <meta
            content="telephone=no,address=no,email=no,date=no,url=no"
            name="format-detection" />
          <style>
            @media (prefers-color-scheme: dark){li::marker{color:#c4c4c4}}
          </style>
        </head>
        <body dir="ltr" lang="en">
          <!--$--><!--html--><!--head--><!--body-->
          <table
            border="0"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            align="center">
            <tbody>
              <tr>
                <td
                  dir="ltr"
                  lang="en"
                  style="font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;font-size:14px;min-height:100%;line-height:155%">
                  <table
                    align="center"
                    width="100%"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="max-width:600px;align:center;width:100%">
                    <tbody>
                      <tr style="width:100%">
                        <td>
                          <p
                            style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                            Centered content
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <!--/$-->
        </body>
      </html>
      "
    `);
  });

  it('does not apply reset margin/padding to the container when using left alignment', async () => {
    const content: JSONContent = {
      type: 'doc',
      content: [
        {
          type: 'globalContent',
          attrs: {
            data: {
              theme: 'basic',
              css: '',
              styles: [
                {
                  id: 'container',
                  title: 'Content',
                  classReference: 'container',
                  inputs: [
                    {
                      label: 'Align',
                      type: 'select',
                      value: 'left',
                      options: {
                        left: 'Left',
                        center: 'Center',
                        right: 'Right',
                      },
                      prop: 'align',
                      classReference: 'container',
                    },
                    {
                      label: 'Width',
                      type: 'number',
                      value: 600,
                      unit: 'px',
                      prop: 'width',
                      classReference: 'container',
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          type: 'container',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Left-aligned content' }],
            },
          ],
        },
      ],
    };

    const ed = createEditorWithContent(content);
    const result = await composeReactEmail({ editor: ed, preview: '' });

    expect(result.html).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html dir="ltr" lang="en">
        <head>
          <meta content="width=device-width" name="viewport" />
          <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
          <meta name="x-apple-disable-message-reformatting" />
          <meta content="IE=edge" http-equiv="X-UA-Compatible" />
          <meta name="x-apple-disable-message-reformatting" />
          <meta
            content="telephone=no,address=no,email=no,date=no,url=no"
            name="format-detection" />
          <style>
            @media (prefers-color-scheme: dark){li::marker{color:#c4c4c4}}
          </style>
        </head>
        <body dir="ltr" lang="en">
          <!--$--><!--html--><!--head--><!--body-->
          <table
            border="0"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            align="center">
            <tbody>
              <tr>
                <td
                  dir="ltr"
                  lang="en"
                  style="font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;font-size:14px;min-height:100%;line-height:155%">
                  <table
                    align="left"
                    width="100%"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="max-width:600px;align:left;width:100%">
                    <tbody>
                      <tr style="width:100%">
                        <td>
                          <p
                            style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                            Left-aligned content
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <!--/$-->
        </body>
      </html>
      "
    `);
  });

  it('wraps content inside a container in the serialized output', async () => {
    const content: JSONContent = {
      type: 'doc',
      content: [
        {
          type: 'globalContent',
          attrs: {
            data: { theme: 'basic', css: '' },
          },
        },
        {
          type: 'container',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Inside container' }],
            },
          ],
        },
      ],
    };

    const ed = createEditorWithContent(content);
    const result = await composeReactEmail({ editor: ed, preview: '' });

    expect(result.html).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html dir="ltr" lang="en">
        <head>
          <meta content="width=device-width" name="viewport" />
          <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
          <meta name="x-apple-disable-message-reformatting" />
          <meta content="IE=edge" http-equiv="X-UA-Compatible" />
          <meta name="x-apple-disable-message-reformatting" />
          <meta
            content="telephone=no,address=no,email=no,date=no,url=no"
            name="format-detection" />
          <style>
            @media (prefers-color-scheme: dark){li::marker{color:#c4c4c4}}
          </style>
        </head>
        <body dir="ltr" lang="en" style="background-color:#ffffff">
          <!--$--><!--html--><!--head--><!--body-->
          <table
            border="0"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            align="center">
            <tbody>
              <tr>
                <td
                  dir="ltr"
                  lang="en"
                  style="font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;font-size:1em;min-height:100%;line-height:155%;background-color:#ffffff">
                  <table
                    align="center"
                    width="100%"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="max-width:600px;align:center;width:100%;color:#000000;background-color:#ffffff;border-radius:0px;border-color:#000000;line-height:155%">
                    <tbody>
                      <tr style="width:100%">
                        <td
                          style="padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px">
                          <p
                            style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                            Inside container
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <!--/$-->
        </body>
      </html>
      "
    `);
  });
});
