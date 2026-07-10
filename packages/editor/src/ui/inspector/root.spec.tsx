import { render, screen } from '@testing-library/react';
import { Editor } from '@tiptap/core';
import { EditorContext } from '@tiptap/react';
import TipTapStarterKit from '@tiptap/starter-kit';
import { afterEach, describe, expect, it } from 'vitest';
import { StarterKit } from '../../extensions';
import { focusScopePluginKey } from '../../extensions/focus-scopes';
import { EmailTheming } from '../../plugins';
import { EditorFocusScopeProvider } from '../editor-focus-scope';
import { InspectorRoot } from './root';

let editor: Editor | null = null;
let element: HTMLElement | null = null;

function createEditor(extensions: Parameters<typeof Editor>[0]['extensions']) {
  element = document.createElement('div');
  document.body.append(element);

  editor = new Editor({
    element,
    extensions,
    content: '<p>Hello world</p>',
  });

  return editor;
}

function countFocusScopePlugins(editor: Editor) {
  return editor.state.plugins.filter(
    (plugin) => plugin.spec.key === focusScopePluginKey,
  ).length;
}

afterEach(() => {
  editor?.destroy();
  editor = null;
  element?.remove();
  element = null;
});

describe('InspectorRoot focus scope compatibility', () => {
  it('installs focus scope tracking when the editor does not use StarterKit', () => {
    const editor = createEditor([TipTapStarterKit, EmailTheming]);

    render(
      <EditorContext.Provider value={{ editor }}>
        <InspectorRoot data-testid="inspector">Inspector</InspectorRoot>
      </EditorContext.Provider>,
    );

    const inspector = screen.getByTestId('inspector');
    editor.view.dom.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    editor.view.dom.dispatchEvent(
      new FocusEvent('focusout', {
        bubbles: true,
        relatedTarget: inspector,
      }),
    );
    inspector.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));

    expect(countFocusScopePlugins(editor)).toBe(1);
    expect(editor.isFocused).toBe(true);
  });

  it('does not duplicate focus scope tracking when StarterKit already provides it', () => {
    const editor = createEditor([StarterKit.configure(), EmailTheming]);
    expect(countFocusScopePlugins(editor)).toBe(1);

    const { unmount } = render(
      <EditorContext.Provider value={{ editor }}>
        <InspectorRoot data-testid="inspector">Inspector</InspectorRoot>
      </EditorContext.Provider>,
    );

    expect(countFocusScopePlugins(editor)).toBe(1);

    unmount();
    expect(countFocusScopePlugins(editor)).toBe(1);
  });

  it('does not duplicate focus scope tracking with an ancestor provider', () => {
    const editor = createEditor([TipTapStarterKit, EmailTheming]);

    render(
      <EditorContext.Provider value={{ editor }}>
        <EditorFocusScopeProvider>
          <InspectorRoot data-testid="inspector">Inspector</InspectorRoot>
        </EditorFocusScopeProvider>
      </EditorContext.Provider>,
    );

    expect(countFocusScopePlugins(editor)).toBe(1);
  });
});
