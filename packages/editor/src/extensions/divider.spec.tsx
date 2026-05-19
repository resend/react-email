import { Editor } from '@tiptap/core';
import { render } from 'react-email';
import { DEFAULT_STYLES } from '../utils/default-styles';
import { Divider } from './divider';
import { StarterKit } from './index';

function createDividerEditor() {
  const element = document.createElement('div');
  document.body.append(element);
  return new Editor({
    element,
    extensions: [
      StarterKit.configure({ Container: false, TrailingNode: false }),
    ],
    content: {
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Before' }] },
        { type: 'horizontalRule', attrs: { class: 'divider' } },
        { type: 'paragraph', content: [{ type: 'text', text: 'After' }] },
      ],
    },
  });
}

function getHrPosition(editor: Editor): number {
  let pos = -1;
  editor.state.doc.descendants((node, p) => {
    if (node.type.name === 'horizontalRule') pos = p;
  });
  return pos;
}

describe('Divider Node', () => {
  it('renders React Email properly', async () => {
    const Component = Divider.config.renderToReactEmail;
    expect(Component).toBeDefined();
    const node = {
      type: 'horizontalRule',
      attrs: {
        class: 'divider',
        style: '',
      },
    };
    expect(
      await render(
        <Component
          node={node}
          style={{ ...DEFAULT_STYLES.hr }}
          extension={Divider}
        />,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });
});

describe('Divider node selection protection', () => {
  it('does not replace the divider when typing while it is node-selected', () => {
    const editor = createDividerEditor();
    const hrPos = getHrPosition(editor);
    editor.commands.setNodeSelection(hrPos);

    const { state } = editor;
    const para = state.schema.nodes.paragraph.createAndFill(
      null,
      state.schema.text('a'),
    )!;
    editor.view.dispatch(state.tr.replaceSelectionWith(para));

    expect(
      editor.getJSON().content?.some((n) => n.type === 'horizontalRule'),
    ).toBe(true);

    editor.destroy();
  });

  it('still deletes the divider when Backspace is pressed while it is node-selected', () => {
    const editor = createDividerEditor();
    const hrPos = getHrPosition(editor);
    editor.commands.setNodeSelection(hrPos);

    const event = new KeyboardEvent('keydown', {
      key: 'Backspace',
      bubbles: true,
      cancelable: true,
    });
    editor.view.someProp('handleKeyDown', (f) => f(editor.view, event));

    expect(
      editor.getJSON().content?.some((n) => n.type === 'horizontalRule'),
    ).toBe(false);

    editor.destroy();
  });
});
