import { Editor, type JSONContent } from '@tiptap/core';
import { render } from 'react-email';
import { DEFAULT_STYLES } from '../utils/default-styles';
import {
  ColumnsColumn,
  FourColumns,
  ThreeColumns,
  TwoColumns,
} from './columns';
import { StarterKit } from './index';

const columnsStyle = { ...DEFAULT_STYLES.reset };

describe('Column Variants', () => {
  it('renders TwoColumns with 2 column children', async () => {
    const Parent = TwoColumns.config.renderToReactEmail;
    const Child = ColumnsColumn.config.renderToReactEmail;

    expect(
      await render(
        <Parent
          node={{ type: 'twoColumns', attrs: {} }}
          style={columnsStyle}
          extension={TwoColumns}
        >
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            style={columnsStyle}
            extension={ColumnsColumn}
          >
            Column A
          </Child>
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            style={columnsStyle}
            extension={ColumnsColumn}
          >
            Column B
          </Child>
        </Parent>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });

  it('renders ThreeColumns with 3 column children', async () => {
    const Parent = ThreeColumns.config.renderToReactEmail;
    const Child = ColumnsColumn.config.renderToReactEmail;

    expect(
      await render(
        <Parent
          node={{ type: 'threeColumns', attrs: {} }}
          style={columnsStyle}
          extension={ThreeColumns}
        >
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            style={columnsStyle}
            extension={ColumnsColumn}
          >
            Column A
          </Child>
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            style={columnsStyle}
            extension={ColumnsColumn}
          >
            Column B
          </Child>
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            style={columnsStyle}
            extension={ColumnsColumn}
          >
            Column C
          </Child>
        </Parent>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });

  it('renders FourColumns with 4 column children', async () => {
    const Parent = FourColumns.config.renderToReactEmail;
    const Child = ColumnsColumn.config.renderToReactEmail;

    expect(
      await render(
        <Parent
          node={{ type: 'fourColumns', attrs: {} }}
          style={columnsStyle}
          extension={FourColumns}
        >
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            style={columnsStyle}
            extension={ColumnsColumn}
          >
            A
          </Child>
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            style={columnsStyle}
            extension={ColumnsColumn}
          >
            B
          </Child>
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            style={columnsStyle}
            extension={ColumnsColumn}
          >
            C
          </Child>
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            style={columnsStyle}
            extension={ColumnsColumn}
          >
            D
          </Child>
        </Parent>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });

  it('renders ColumnsColumn with custom width', async () => {
    const Component = ColumnsColumn.config.renderToReactEmail;

    expect(
      await render(
        <Component
          node={{ type: 'columnsColumn', attrs: { width: '200px' } }}
          style={columnsStyle}
          extension={ColumnsColumn}
        >
          Column content
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });

  it('renders column parent with inline styles', async () => {
    const Component = TwoColumns.config.renderToReactEmail;

    expect(
      await render(
        <Component
          node={{
            type: 'twoColumns',
            attrs: { style: 'padding: 10px;', class: 'custom-class' },
          }}
          style={columnsStyle}
          extension={TwoColumns}
        >
          Content
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });

  it('renders column parent with custom column spacing', async () => {
    const Parent = TwoColumns.config.renderToReactEmail;
    const Child = ColumnsColumn.config.renderToReactEmail;

    expect(
      await render(
        <Parent
          node={{ type: 'twoColumns', attrs: { cellspacing: 12 } }}
          style={columnsStyle}
          extension={TwoColumns}
        >
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            style={columnsStyle}
            extension={ColumnsColumn}
          >
            Column A
          </Child>
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            style={columnsStyle}
            extension={ColumnsColumn}
          >
            Column B
          </Child>
        </Parent>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });

  it('reflects column spacing in editor HTML without inventing a default gap', () => {
    type RenderHTMLFn = NonNullable<typeof TwoColumns.config.renderHTML>;
    const renderHTML = TwoColumns.config.renderHTML as
      | OmitThisParameter<RenderHTMLFn>
      | undefined;

    const defaultHtml = renderHTML?.({
      HTMLAttributes: {},
    } as unknown as Parameters<RenderHTMLFn>[0]) as [
      string,
      Record<string, unknown>,
      number,
    ];
    expect(defaultHtml[1]).not.toHaveProperty('style');

    const spacedHtml = renderHTML?.({
      HTMLAttributes: { cellspacing: '12', style: 'padding: 10px;' },
    } as unknown as Parameters<RenderHTMLFn>[0]) as [
      string,
      Record<string, unknown>,
      number,
    ];

    expect(spacedHtml[1]).toMatchObject({
      'data-type': 'two-columns',
      class: 'node-columns',
      style: 'padding: 10px;gap:12px;',
    });
    expect(spacedHtml[1]).not.toHaveProperty('cellspacing');
  });

  it('renders ColumnsColumn with inline styles', async () => {
    const Component = ColumnsColumn.config.renderToReactEmail;

    expect(
      await render(
        <Component
          node={{
            type: 'columnsColumn',
            attrs: { style: 'background-color: red;' },
          }}
          style={columnsStyle}
          extension={ColumnsColumn}
        >
          Content
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });
});

describe('Column Deletion', () => {
  const emptyCol = { type: 'columnsColumn', content: [{ type: 'paragraph' }] };

  function createColumnEditor(content: JSONContent) {
    const element = document.createElement('div');
    document.body.append(element);
    return new Editor({
      element,
      extensions: [
        StarterKit.configure({ Container: false, TrailingNode: false }),
      ],
      content,
    });
  }

  function findColDepth(
    $from: typeof Editor.prototype.state.selection.$from,
  ): number | undefined {
    for (let d = $from.depth; d >= 0; d--) {
      if ($from.node(d).type.name === 'columnsColumn') return d;
    }
    return undefined;
  }

  // editor.commands.keyboardShortcut() uses captureTransaction + step replay,
  // which discards the setSelection call. Calling handleKeyDown directly ensures
  // our custom dispatch (including selection) takes effect as-is.
  function pressBackspace(editor: Editor): void {
    const event = new KeyboardEvent('keydown', {
      key: 'Backspace',
      bubbles: true,
      cancelable: true,
    });
    editor.view.someProp('handleKeyDown', (f) => f(editor.view, event));
  }

  it('insertColumns focuses the first column', () => {
    for (const count of [2, 3, 4] as const) {
      const editor = createColumnEditor({
        type: 'doc',
        content: [{ type: 'paragraph' }],
      });
      editor.commands.insertColumns(count);
      const { $from } = editor.state.selection;
      const colDepth = findColDepth($from);
      expect(
        colDepth,
        `count=${count}: cursor not inside a columnsColumn`,
      ).toBeDefined();
      expect(
        $from.index(colDepth! - 1),
        `count=${count}: cursor not in first column`,
      ).toBe(0);
      editor.destroy();
    }
  });

  it('backspace on empty second column of twoColumns unwraps to paragraph', () => {
    const editor = createColumnEditor({
      type: 'doc',
      content: [{ type: 'twoColumns', content: [emptyCol, emptyCol] }],
    });
    editor.commands.setTextSelection(7);
    pressBackspace(editor);
    const json = editor.getJSON();
    expect(json.content?.find((n) => n.type === 'twoColumns')).toBeUndefined();
    expect(json.content?.[0].type).toBe('paragraph');
    editor.destroy();
  });

  it('backspace on empty third column of threeColumns reduces to twoColumns', () => {
    const editor = createColumnEditor({
      type: 'doc',
      content: [
        { type: 'threeColumns', content: [emptyCol, emptyCol, emptyCol] },
      ],
    });
    editor.commands.setTextSelection(11);
    pressBackspace(editor);
    const json = editor.getJSON();
    expect(json.content?.[0].type).toBe('twoColumns');
    expect(json.content?.[0].content).toHaveLength(2);
    editor.destroy();
  });

  it('backspace on empty fourth column of fourColumns reduces to threeColumns', () => {
    const editor = createColumnEditor({
      type: 'doc',
      content: [
        {
          type: 'fourColumns',
          content: [emptyCol, emptyCol, emptyCol, emptyCol],
        },
      ],
    });
    editor.commands.setTextSelection(15);
    pressBackspace(editor);
    const json = editor.getJSON();
    expect(json.content?.[0].type).toBe('threeColumns');
    expect(json.content?.[0].content).toHaveLength(3);
    editor.destroy();
  });

  it('backspace does not delete a non-empty column', () => {
    const editor = createColumnEditor({
      type: 'doc',
      content: [
        {
          type: 'twoColumns',
          content: [
            emptyCol,
            {
              type: 'columnsColumn',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'hello' }],
                },
              ],
            },
          ],
        },
      ],
    });
    editor.commands.setTextSelection(7);
    pressBackspace(editor);
    expect(editor.getJSON().content?.[0].type).toBe('twoColumns');
    editor.destroy();
  });

  it('focuses the previous column after deleting the last column', () => {
    const editor = createColumnEditor({
      type: 'doc',
      content: [
        { type: 'threeColumns', content: [emptyCol, emptyCol, emptyCol] },
      ],
    });
    editor.commands.setTextSelection(11);
    pressBackspace(editor);
    const { $from } = editor.state.selection;
    const colDepth = findColDepth($from);
    expect(
      colDepth,
      'cursor not inside a columnsColumn after deletion',
    ).toBeDefined();
    expect($from.index(colDepth! - 1)).toBe(1);
    editor.destroy();
  });

  it('focuses the first column after deleting the first empty column', () => {
    const editor = createColumnEditor({
      type: 'doc',
      content: [
        { type: 'threeColumns', content: [emptyCol, emptyCol, emptyCol] },
      ],
    });
    // Find the cursor position inside col1 dynamically from the doc
    let col1CursorPos = -1;
    editor.state.doc.descendants((node, pos) => {
      if (col1CursorPos !== -1) return false;
      if (node.type.name === 'columnsColumn') {
        col1CursorPos = pos + 2; // inside columnsColumn's first paragraph
        return false;
      }
      return true;
    });
    editor.commands.setTextSelection(col1CursorPos);
    pressBackspace(editor);
    const { $from } = editor.state.selection;
    const colDepth = findColDepth($from);
    expect(
      colDepth,
      'cursor not inside a columnsColumn after deletion',
    ).toBeDefined();
    expect($from.index(colDepth! - 1)).toBe(0);
    editor.destroy();
  });

  it('backspace with NodeSelection on all-empty column block deletes it', () => {
    const editor = createColumnEditor({
      type: 'doc',
      content: [
        { type: 'paragraph' },
        { type: 'twoColumns', content: [emptyCol, emptyCol] },
      ],
    });
    // paragraph nodeSize=2, so twoColumns starts at pos 2
    editor.commands.setNodeSelection(2);
    pressBackspace(editor);
    expect(
      editor.getJSON().content?.find((n) => n.type === 'twoColumns'),
    ).toBeUndefined();
    editor.destroy();
  });
});
