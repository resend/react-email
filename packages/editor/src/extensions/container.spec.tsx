import { render } from '@react-email/components';
import type { JSONContent } from '@tiptap/core';
import { Editor, Extension } from '@tiptap/core';
import { afterEach, describe, expect, it } from 'vitest';
import { composeReactEmail } from '../core/serializer/compose-react-email';
import { DEFAULT_STYLES } from '../utils/default-styles';
import { Container } from './container';
import { StarterKit } from './index';

vi.mock('@/actions/ai', () => ({
  uploadImageViaAI: vi.fn(),
}));

const containerStyle = {
  ...DEFAULT_STYLES.reset,
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
        style="margin:0;padding:0;width:100%">
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
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:600px;margin:0;padding:0;width:100%"><tbody><tr style="width:100%"><td>Content</td></tr></tbody></table><!--/$-->"`,
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
      extensions: [StarterKit],
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
          <!--$-->
        </head>
        <body>
          <table
            border="0"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            align="center">
            <tbody>
              <tr>
                <td>
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
                        <td><p>Hello world</p></td>
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
            const content = getContent(schema);

            const tr1 = view.state.tr;
            tr1.setMeta('y-sync$', true);
            // transaction with y-sync$ meta
            view.dispatch(tr1);

            // empty transaction without y-sync$ meta also caused by liveblocks
            view.dispatch(view.state.tr);

            setTimeout(() => {
              const tr2 = view.state.tr.replaceWith(
                0,
                view.state.doc.content.size,
                content,
              );
              // actual update to the content bringing over the new content from liveblocks
              tr2.setMeta('y-sync$', true);
              view.dispatch(tr2);
              resolve();
            }, 100);
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
      const containers = json.content!.filter((n) => n.type === 'container');
      expect(containers).toHaveLength(1);
      expect(containers[0]!.content).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: 'paragraph' }),
        ]),
      );
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
      const containers = json.content!.filter((n) => n.type === 'container');
      expect(containers).toHaveLength(1);
      for (const child of containers[0]!.content!) {
        expect(child.type).not.toBe('container');
      }
    });
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
          <!--$-->
        </head>
        <body>
          <table
            border="0"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            align="center">
            <tbody>
              <tr>
                <td>
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
                        <td><p>Inside container</p></td>
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
