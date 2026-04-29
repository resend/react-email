import { NodeSelection, TextSelection } from '@tiptap/pm/state';
import { vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { EmailEditor, type EmailEditorRef } from '../email-editor/email-editor';
import { Inspector } from '../ui/inspector';

const CONTENT = {
  type: 'doc',
  content: [
    {
      type: 'twoColumns',
      attrs: {
        cellspacing: 8,
      },
      content: [
        {
          type: 'columnsColumn',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Column A' }],
            },
          ],
        },
        {
          type: 'columnsColumn',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Column B' }],
            },
          ],
        },
      ],
    },
  ],
};

function Harness({
  editorRef,
}: {
  editorRef: React.RefObject<EmailEditorRef | null>;
}) {
  return (
    <EmailEditor
      ref={(value) => {
        editorRef.current = value;
      }}
      content={CONTENT}
    >
      <Inspector.Root data-testid="inspector">
        <Inspector.Breadcrumb>
          {(segments) => (
            <nav aria-label="Inspector breadcrumb">
              {segments.map((segment) => (
                <button
                  type="button"
                  key={`${segment.node.nodeType}-${segment.node.nodePos.pos}`}
                  data-node-type={segment.node.nodeType}
                  onClick={segment.focus}
                >
                  {segment.node.nodeType}
                </button>
              ))}
            </nav>
          )}
        </Inspector.Breadcrumb>
        <Inspector.Node />
      </Inspector.Root>
    </EmailEditor>
  );
}

function findNodePos(editorRef: EmailEditorRef | null, nodeType: string) {
  const editor = editorRef?.editor;
  if (!editor) throw new Error('Editor not ready');

  let nodePos = -1;
  editor.state.doc.descendants((node, pos) => {
    if (nodePos === -1 && node.type.name === nodeType) {
      nodePos = pos;
      return false;
    }
    return true;
  });

  if (nodePos === -1) throw new Error(`${nodeType} not found`);
  return nodePos;
}

function selectFirstParagraphText(editorRef: EmailEditorRef | null) {
  const editor = editorRef?.editor;
  if (!editor) throw new Error('Editor not ready');

  const paragraphPos = findNodePos(editorRef, 'paragraph');
  editor.view.focus();
  editor.view.dispatch(
    editor.state.tr.setSelection(
      TextSelection.create(editor.state.doc, paragraphPos + 1),
    ),
  );
}

async function waitForColumnsSection() {
  return vi.waitFor(() => {
    const inspector = document.querySelector<HTMLElement>(
      '[data-testid="inspector"]',
    );
    if (!inspector) throw new Error('Inspector not rendered yet');

    const header = Array.from(
      inspector.querySelectorAll<HTMLElement>(
        '[data-re-inspector-section-header]',
      ),
    ).find((h) => h.textContent?.includes('Column spacing'));
    const section = header?.closest<HTMLElement>('[data-re-inspector-section]');
    if (!section) throw new Error('Columns section not rendered yet');
    return section;
  });
}

describe('inspector column spacing input (browser)', () => {
  it('edits the selected column layout cellspacing attribute', async () => {
    const editorRef: React.RefObject<EmailEditorRef | null> = {
      current: null,
    };
    render(<Harness editorRef={editorRef} />);

    const editor = page.getByRole('textbox');
    await expect.element(editor).toBeVisible();

    selectFirstParagraphText(editorRef.current);

    const columnsBreadcrumb = await vi.waitFor(() => {
      const button = document.querySelector<HTMLButtonElement>(
        '[data-node-type="twoColumns"]',
      );
      if (!button) throw new Error('Columns breadcrumb not rendered yet');
      return button;
    });
    await userEvent.click(columnsBreadcrumb);

    await vi.waitFor(() => {
      const selection = editorRef.current?.editor?.state.selection;
      expect(selection).toBeInstanceOf(NodeSelection);
      expect((selection as NodeSelection).node.type.name).toBe('twoColumns');
    });

    const section = await waitForColumnsSection();
    const input = section.querySelector<HTMLInputElement>(
      'input[data-re-inspector-input]',
    );
    if (!input) throw new Error('Column spacing input not rendered yet');

    expect(input.value).toBe('8');

    input.focus();
    await userEvent.keyboard('{ArrowUp}');

    await vi.waitFor(() => {
      const columnsPos = findNodePos(editorRef.current, 'twoColumns');
      const columnsNode =
        editorRef.current?.editor?.state.doc.nodeAt(columnsPos);
      expect(columnsNode?.attrs.cellspacing).toBe(9);
    });

    const selection = editorRef.current?.editor?.state.selection;
    expect(selection).toBeInstanceOf(NodeSelection);
    expect((selection as NodeSelection).node.type.name).toBe('twoColumns');
  });
});
