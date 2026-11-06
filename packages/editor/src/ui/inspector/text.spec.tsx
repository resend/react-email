import { act, cleanup, render, screen } from '@testing-library/react';
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import type { Editor } from '@tiptap/core';
import { afterEach, describe, expect, it } from 'vitest';
import { StarterKit } from '../../extensions';
import { EmailTheming } from '../../plugins';
import { InspectorContext } from './root';
import { InspectorText } from './text';

afterEach(() => {
  cleanup();
});

function EditorProbe({ onEditor }: { onEditor: (editor: Editor) => void }) {
  const { editor } = useCurrentEditor();
  if (editor) {
    onEditor(editor);
  }
  return null;
}

function renderInspectorText(
  content: string,
  onEditor: (editor: Editor) => void,
) {
  return render(
    <EditorProvider
      extensions={[StarterKit.configure(), EmailTheming]}
      immediatelyRender
      content={content}
    >
      <EditorProbe onEditor={onEditor} />
      <InspectorContext.Provider value={{ target: 'text', pathFromRoot: [] }}>
        <InspectorText />
      </InspectorContext.Provider>
    </EditorProvider>,
  );
}

describe('InspectorText', () => {
  it('renders the uppercase toggle as active when the selection has the uppercase mark', () => {
    let editor: Editor | null = null;

    renderInspectorText('<p>Hello world</p>', (instance) => {
      editor = instance;
    });

    act(() => {
      editor?.chain().selectAll().toggleUppercase().run();
    });

    const uppercaseToggle = screen.getByLabelText('Uppercase');
    expect(uppercaseToggle).toBeDefined();
    expect(uppercaseToggle.getAttribute('aria-pressed')).toBe('true');
  });

  it('renders the uppercase toggle as inactive when the selection has no uppercase mark', () => {
    let editor: Editor | null = null;

    renderInspectorText('<p>Hello world</p>', (instance) => {
      editor = instance;
    });

    const uppercaseToggle = screen.getByLabelText('Uppercase');
    expect(uppercaseToggle).toBeDefined();
    expect(uppercaseToggle.getAttribute('aria-pressed')).toBe('false');
  });
});
