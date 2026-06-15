import { Editor, extensions as nativeTiptapExtensions } from '@tiptap/core';
import { vi } from 'vitest';
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
    // The selection is reset to the start of the document. It must resolve
    // into a node with inline content (not the doc node at position 0), so
    // the first valid cursor position is used.
    expect(editor.state.selection.$from.parent.inlineContent).toBe(true);

    editor.destroy();
    element.remove();
    externalScope.remove();
  });

  it('clears the selection on blur without an invalid TextSelection warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let editor: Editor | undefined;
    let element: HTMLElement | undefined;

    try {
      ({ editor, element } = createEditor());
      await waitForCreate();

      editor.commands.setTextSelection({ from: 2, to: 7 });
      editor.view.dom.dispatchEvent(
        new FocusEvent('focusin', { bubbles: true }),
      );

      editor.view.dom.dispatchEvent(
        new FocusEvent('focusout', {
          bubbles: true,
          relatedTarget: document.body,
        }),
      );

      expect(editor.isFocused).toBe(false);
      expect(editor.state.selection.empty).toBe(true);
      expect(editor.state.selection.$from.parent.inlineContent).toBe(true);
      // Position 0 resolves to the doc node, which has no inline content, and
      // ProseMirror warns when a TextSelection endpoint lands there. Scan every
      // argument of every recorded call for the warning substring so additional
      // ProseMirror arguments cannot turn this into a false negative.
      const warnedAboutInvalidEndpoint = warn.mock.calls.some((args) =>
        args.some((arg) =>
          String(arg).includes(
            'TextSelection endpoint not pointing into a node with inline content',
          ),
        ),
      );
      expect(warnedAboutInvalidEndpoint).toBe(false);
    } finally {
      // Clean up in `finally` so a failed assertion above cannot leak the
      // console.warn spy or a live editor instance into later tests.
      warn.mockRestore();
      editor?.destroy();
      element?.remove();
    }
  });
});
