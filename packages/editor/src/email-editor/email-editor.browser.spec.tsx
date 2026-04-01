import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { EmailEditor } from './email-editor';

function getEditor() {
  return page.getByRole('textbox');
}

describe('EmailEditor (browser)', () => {
  it('loads and content is editable', async () => {
    render(<EmailEditor />);

    const editor = getEditor();
    await expect.element(editor).toBeVisible();
    await expect.element(editor).toHaveAttribute('contenteditable', 'true');

    // Type content into the editor
    await editor.click();
    await userEvent.keyboard('Hello world');

    // Content should be visible
    await expect.element(editor).toHaveTextContent('Hello world');
  });

  it('slash command opens and inserts a heading', async () => {
    render(<EmailEditor />);

    const editor = getEditor();
    await editor.click();

    // Type "/" to trigger slash command menu
    await userEvent.keyboard('/');

    // The slash command menu should be visible (rendered via portal to body)
    const titleButton = page.getByRole('button', {
      name: 'Title',
      exact: true,
    });
    await expect.element(titleButton).toBeVisible();

    // Click "Title" (H1) from the command menu
    await titleButton.click();

    // Menu should close
    await expect.element(titleButton).not.toBeInTheDocument();

    // A heading element should now exist in the editor
    const editorEl = editor.element() as HTMLElement;
    expect(editorEl.innerHTML).toMatch(/<h1/i);

    // Type content into the heading
    await userEvent.keyboard('E2E Heading Content');

    expect(editorEl.textContent).toContain('E2E Heading Content');
  });

  it('slash command inserts a bullet list', async () => {
    render(<EmailEditor />);

    const editor = getEditor();
    await editor.click();

    await userEvent.keyboard('/');

    const bulletListButton = page.getByRole('button', { name: 'Bullet list' });
    await expect.element(bulletListButton).toBeVisible();

    await bulletListButton.click();

    await expect.element(bulletListButton).not.toBeInTheDocument();

    const editorEl = editor.element() as HTMLElement;
    expect(editorEl.innerHTML).toMatch(/<ul/i);

    // Type list items
    await userEvent.keyboard('First item');
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard('Second item');

    expect(editorEl.textContent).toContain('First item');
    expect(editorEl.textContent).toContain('Second item');
  });

  it('applies text formatting via keyboard shortcuts', async () => {
    // Use Control on Linux (CI), Meta (Cmd) on macOS
    const mod = navigator.platform.includes('Mac') ? 'Meta' : 'Control';

    render(<EmailEditor />);

    const editor = getEditor();
    await editor.click();

    // Type and apply bold
    await userEvent.keyboard('Bold text');
    await userEvent.keyboard(`{${mod}>}a{/${mod}}`);
    await userEvent.keyboard(`{${mod}>}b{/${mod}}`);

    const editorEl = editor.element() as HTMLElement;
    expect(editorEl.innerHTML).toMatch(/<strong/i);

    // Move to end, new line, type and apply italic
    await userEvent.keyboard('{End}');
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard('Italic text');
    await userEvent.keyboard(`{${mod}>}a{/${mod}}`);
    await userEvent.keyboard(`{${mod}>}i{/${mod}}`);

    expect(editorEl.innerHTML).toMatch(/<em/i);

    // Move to end, new line, type and apply underline
    await userEvent.keyboard('{End}');
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard('Underlined text');
    await userEvent.keyboard(`{${mod}>}a{/${mod}}`);
    await userEvent.keyboard(`{${mod}>}u{/${mod}}`);

    expect(editorEl.innerHTML).toMatch(/<u[ >]/i);
  });
});
