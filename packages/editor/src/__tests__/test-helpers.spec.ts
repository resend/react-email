import { afterEach, describe, expect, it, vi } from 'vitest';
import { createTestEditor, paragraphDoc } from './editor-test-helpers';

vi.mock('@/actions/ai', () => ({
  uploadImageViaAI: vi.fn(),
}));

describe('createTestEditor', () => {
  let editor: ReturnType<typeof createTestEditor> | null = null;
  afterEach(() => {
    editor?.destroy();
    editor = null;
  });

  it('creates an editor with default StarterKit and renders text', () => {
    editor = createTestEditor({ content: paragraphDoc('hello') });
    expect(editor.getHTML()).toContain('hello');
  });

  it('accepts custom content as JSON', () => {
    editor = createTestEditor({
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'World' }],
          },
        ],
      },
    });
    const html = editor.getHTML();
    expect(html).toContain('<h2');
    expect(html).toContain('World');
  });
});
