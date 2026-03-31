import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { pasteHtml, pasteText } from '../__tests__/browser-test-helpers';
import { TestEditor } from '../__tests__/test-editor';

const htmlTemplate = `
<!doctype html>
<html>
  <body>
    <h1>Pasted heading</h1>
    <p>Pasted body content</p>
  </body>
</html>
`;

function getEditor() {
  return page.getByRole('textbox');
}

describe('paste handling (browser)', () => {
  it('pasting plain text into an empty editor inserts text', async () => {
    render(<TestEditor />);

    const editor = getEditor();
    await editor.click();

    const editorEl = editor.element() as HTMLElement;
    pasteText(editorEl, 'hello world');

    await expect.element(editor).toHaveTextContent('hello world');
  });

  it('pasting plain text into a non-empty editor appends text', async () => {
    render(<TestEditor />);

    const editor = getEditor();
    await editor.click();
    await userEvent.keyboard('existing');

    const editorEl = editor.element() as HTMLElement;
    pasteText(editorEl, ' plus pasted');

    await expect.element(editor).toHaveTextContent('existing plus pasted');
  });

  it('pasting HTML into a non-empty document preserves existing content', async () => {
    render(
      <TestEditor
        content={{
          type: 'doc',
          content: [
            {
              type: 'heading',
              attrs: { level: 1 },
              content: [{ type: 'text', text: 'Existing heading' }],
            },
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Existing paragraph' }],
            },
          ],
        }}
      />,
    );

    const editor = getEditor();

    // Click on the paragraph text to place cursor there, then move to end
    const para = page.getByText('Existing paragraph');
    await para.click();
    await userEvent.keyboard('{End}');

    const editorEl = editor.element() as HTMLElement;
    pasteHtml(editorEl, htmlTemplate);

    // The original content should still be present
    expect(editorEl.textContent).toContain('Existing heading');
    expect(editorEl.textContent).toContain('Existing paragraph');

    // The pasted content should also appear
    expect(editorEl.textContent).toContain('Pasted heading');
    expect(editorEl.textContent).toContain('Pasted body content');
  });
});
