import { Editor, extensions as nativeTiptapExtensions } from '@tiptap/core';
import { StarterKit } from '.';
import { focusScopePluginKey } from './focus-scopes';

function waitForCreate() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function createEditor() {
  const element = document.createElement('div');
  document.body.append(element);

  const editor = new Editor({
    element,
    extensions: [StarterKit.configure()],
    content: '<p>Hello world</p>',
  });

  return { editor, element };
}

describe('FocusScopes', () => {
  it('replaces the default Tiptap focus events plugin', async () => {
    const { editor, element } = createEditor();
    await waitForCreate();

    expect(
      editor.state.plugins.some(
        (plugin) => plugin.spec.key === focusScopePluginKey,
      ),
    ).toBe(true);
    expect(
      editor.state.plugins.some(
        (plugin) =>
          plugin.spec.key === nativeTiptapExtensions.focusEventsPluginKey,
      ),
    ).toBe(false);

    editor.destroy();
    element.remove();
  });

  it('keeps editor focus and selection when focus moves into a registered scope', async () => {
    const { editor, element } = createEditor();
    const externalScope = document.createElement('button');
    document.body.append(externalScope);
    await waitForCreate();

    editor.commands.setTextSelection({ from: 2, to: 7 });
    editor.view.dom.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));

    editor.extensionStorage.focusScope.registerScope(externalScope);
    editor.view.dom.dispatchEvent(
      new FocusEvent('focusout', {
        bubbles: true,
        relatedTarget: externalScope,
      }),
    );

    expect(editor.isFocused).toBe(true);
    expect(editor.state.selection.from).toBe(2);
    expect(editor.state.selection.to).toBe(7);

    externalScope.dispatchEvent(
      new FocusEvent('focusout', {
        bubbles: true,
        relatedTarget: document.body,
      }),
    );

    expect(editor.isFocused).toBe(false);
    expect(editor.state.selection.from).toBe(0);

    editor.destroy();
    element.remove();
    externalScope.remove();
  });
});
