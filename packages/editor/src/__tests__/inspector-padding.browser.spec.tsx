import { NodeSelection } from '@tiptap/pm/state';
import { vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { EmailEditor, type EmailEditorRef } from '../email-editor/email-editor';
import { Inspector } from '../ui/inspector';

const CONTENT = {
  type: 'doc',
  content: [
    {
      type: 'section',
      attrs: {
        style:
          'padding-top: 44px; padding-right: 44px; padding-bottom: 44px; padding-left: 44px;',
      },
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Inside section' }],
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
        <Inspector.Node />
      </Inspector.Root>
    </EmailEditor>
  );
}

function selectSectionNode(editorRef: EmailEditorRef | null) {
  const editor = editorRef?.editor;
  if (!editor) throw new Error('Editor not ready');
  let sectionPos = -1;
  editor.state.doc.descendants((node, pos) => {
    if (sectionPos === -1 && node.type.name === 'section') {
      sectionPos = pos;
      return false;
    }
    return true;
  });
  if (sectionPos === -1) throw new Error('Section not found');
  editor.view.focus();
  const selection = NodeSelection.create(editor.state.doc, sectionPos);
  editor.view.dispatch(editor.state.tr.setSelection(selection));
}

async function waitForSpacingSection() {
  return vi.waitFor(() => {
    const inspector = document.querySelector<HTMLElement>(
      '[data-testid="inspector"]',
    );
    if (!inspector) throw new Error('Inspector not rendered yet');
    const header = Array.from(
      inspector.querySelectorAll<HTMLElement>(
        '[data-re-inspector-section-header]',
      ),
    ).find((h) => h.textContent?.includes('Spacing'));
    const section = header?.closest<HTMLElement>('[data-re-inspector-section]');
    if (!section) throw new Error('Spacing section not rendered yet');
    return section;
  });
}

async function waitForPaddingInputWithValue(expected: string) {
  return vi.waitFor(async () => {
    const spacing = await waitForSpacingSection();
    const input = spacing.querySelector<HTMLInputElement>(
      'input[data-re-inspector-input]',
    );
    if (!input) throw new Error('Padding input not rendered yet');
    if (input.value !== expected) {
      throw new Error(`expected ${expected}, got ${input.value}`);
    }
    return input;
  });
}

describe('inspector padding input (browser)', () => {
  it('keeps the same value after focus + blur', async () => {
    const editorRef: React.RefObject<EmailEditorRef | null> = {
      current: null,
    };
    render(<Harness editorRef={editorRef} />);

    const editor = page.getByRole('textbox');
    await expect.element(editor).toBeVisible();

    selectSectionNode(editorRef.current);

    const paddingInput = await waitForPaddingInputWithValue('44');

    paddingInput.focus();
    expect(document.activeElement).toBe(paddingInput);

    paddingInput.blur();
    expect(document.activeElement).not.toBe(paddingInput);

    // The value must still be "44" — not reset to "0".
    expect(paddingInput.value).toBe('44');
  });

  it('keeps a newly committed value after a subsequent focus + blur', async () => {
    const editorRef: React.RefObject<EmailEditorRef | null> = {
      current: null,
    };
    render(<Harness editorRef={editorRef} />);

    const editor = page.getByRole('textbox');
    await expect.element(editor).toBeVisible();

    selectSectionNode(editorRef.current);

    const paddingInput = await waitForPaddingInputWithValue('44');

    paddingInput.focus();
    paddingInput.select();
    await userEvent.keyboard('12');
    await userEvent.keyboard('{Enter}');

    await vi.waitFor(() => {
      if (paddingInput.value !== '12') {
        throw new Error(`expected 12, got ${paddingInput.value}`);
      }
    });

    paddingInput.focus();
    paddingInput.blur();

    expect(paddingInput.value).toBe('12');
  });
});

const HSL_CONTENT = {
  type: 'doc',
  content: [
    {
      type: 'section',
      attrs: {
        style: 'background-color: hsl(200, 50%, 40%);',
      },
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Inside section' }],
        },
      ],
    },
  ],
};

function HslHarness({
  editorRef,
}: {
  editorRef: React.RefObject<EmailEditorRef | null>;
}) {
  return (
    <EmailEditor
      ref={(value) => {
        editorRef.current = value;
      }}
      content={HSL_CONTENT}
    >
      <Inspector.Root data-testid="inspector">
        <Inspector.Node />
      </Inspector.Root>
    </EmailEditor>
  );
}

async function waitForBackgroundSection() {
  return vi.waitFor(() => {
    const inspector = document.querySelector<HTMLElement>(
      '[data-testid="inspector"]',
    );
    if (!inspector) throw new Error('Inspector not rendered yet');
    const header = Array.from(
      inspector.querySelectorAll<HTMLElement>(
        '[data-re-inspector-section-header]',
      ),
    ).find((h) => h.textContent?.includes('Background'));
    const section = header?.closest<HTMLElement>('[data-re-inspector-section]');
    if (!section) throw new Error('Background section not rendered yet');
    return section;
  });
}

describe('inspector background color input (browser)', () => {
  it('does not strip % from HSL color values at parse time', async () => {
    const editorRef: React.RefObject<EmailEditorRef | null> = {
      current: null,
    };
    render(<HslHarness editorRef={editorRef} />);

    const editor = page.getByRole('textbox');
    await expect.element(editor).toBeVisible();

    selectSectionNode(editorRef.current);

    const hexInput = await vi.waitFor(() => {
      const bg = document.querySelector<HTMLElement>(
        '[data-testid="inspector"]',
      );
      if (!bg) throw new Error('Inspector not rendered yet');
      return waitForBackgroundSection().then((section) => {
        const input = section.querySelector<HTMLInputElement>(
          'input[data-re-inspector-color-hex]',
        );
        if (!input) throw new Error('Color hex input not rendered yet');
        if (input.value === '') {
          throw new Error('Color hex input not populated yet');
        }
        return input;
      });
    });

    expect(hexInput.value).toBe('hsl(200, 50%, 40%)');
  });
});
