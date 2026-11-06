import { act, render, screen, waitFor } from '@testing-library/react';
import { Editor } from '@tiptap/core';
import { EditorContext } from '@tiptap/react';
import { afterEach, describe, expect, it } from 'vitest';
import { StarterKit } from '../../extensions';
import { EmailTheming } from '../../plugins';
import { InspectorRoot } from './root';
import { InspectorText } from './text';

let editor: Editor | null = null;
let element: HTMLElement | null = null;

function createEditor() {
  element = document.createElement('div');
  document.body.append(element);

  editor = new Editor({
    element,
    extensions: [StarterKit.configure(), EmailTheming],
    content: '<p>Hello world</p>',
  });

  return editor;
}

function focusTextSelection(ed: Editor) {
  ed.view.dom.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
  ed.commands.setTextSelection({ from: 1, to: 12 });
}

afterEach(() => {
  editor?.destroy();
  editor = null;
  element?.remove();
  element = null;
});

describe('InspectorText mark toggles', () => {
  it('shows an uppercase toggle and reflects the active mark state', async () => {
    const editor = createEditor();

    render(
      <EditorContext.Provider value={{ editor }}>
        <InspectorRoot>
          <InspectorText />
        </InspectorRoot>
      </EditorContext.Provider>,
    );

    focusTextSelection(editor);

    const toggle = await waitFor(() =>
      screen.getByRole('button', { name: 'Uppercase' }),
    );
    expect(toggle.getAttribute('aria-pressed')).toBe('false');

    act(() => {
      editor.chain().focus().toggleUppercase().run();
    });

    await waitFor(() =>
      expect(toggle.getAttribute('aria-pressed')).toBe('true'),
    );
  });
});
