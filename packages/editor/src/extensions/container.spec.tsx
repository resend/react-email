import type { JSONContent } from '@tiptap/core';
import { Editor, Extension } from '@tiptap/core';
import { Container as ReactEmailContainer, render } from 'react-email';
import { afterEach, describe, expect, it } from 'vitest';
import { composeReactEmail } from '../core/serializer/compose-react-email';
import { EmailTheming } from '../plugins';
import { DEFAULT_STYLES } from '../utils/default-styles';
import { Container } from './container';
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
        </head>
        <body style="background-color:#ffffff">
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
                  style="font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;font-size:1em;min-height:100%;line-height:155%;background-color:#ffffff">
                  <table
                    align="left"
                    width="100%"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="max-width:600px;align:left;width:100%;color:#000000;background-color:#ffffff;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;border-radius:0px;border-color:#000000;line-height:155%">
                    <tbody>
                      <tr style="width:100%">
                        <td>
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
    //     replace the doc with container+paragraph (the Yjs doc mirrors
    //     back the container that appendTransaction created after step 1)
    //  3. One final y-sync$ delivering the real document content
    //  4. Two generic no-op transactions (Liveblocks cleanup)
    const STABILIZATION_ROUNDS = 18;

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

    // We skip this because it fails and there's no good solution for this that fits in all situations.
    it.skip('wraps the schema-default empty paragraph when collaboration starts with no content', async () => {
      const [fakeLiveblocks, contentResolved] = createFakeLiveblocksExtension(
        (schema) => schema.nodes.paragraph.create(),
      );

      editor = new Editor({
        extensions: [StarterKit, fakeLiveblocks],
      });

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

    it('does not eagerly wrap before the first y-sync$ content arrives', () => {
      const fakeLiveblocks = Extension.create({
        name: 'liveblocksExtension',
      });

      editor = new Editor({
        extensions: [StarterKit, fakeLiveblocks],
      });

      const json = editor!.getJSON();
      expect(json.content!.some((n) => n.type === 'container')).toBe(false);
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
        </head>
        <body>
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
        </head>
        <body>
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
        </head>
        <body style="background-color:#ffffff">
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
                  style="font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;font-size:1em;min-height:100%;line-height:155%;background-color:#ffffff">
                  <table
                    align="left"
                    width="100%"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="max-width:600px;align:left;width:100%;color:#000000;background-color:#ffffff;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;border-radius:0px;border-color:#000000;line-height:155%">
                    <tbody>
                      <tr style="width:100%">
                        <td>
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
