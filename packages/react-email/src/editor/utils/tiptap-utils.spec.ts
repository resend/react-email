import { Editor } from '@tiptap/core';
import Image from '@tiptap/extension-image';
import StarterKit from '@tiptap/starter-kit';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getNode, getNodeWithPos } from './tiptap-utils';

describe('tiptap-utils', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = new Editor({
      extensions: [
        StarterKit.configure({}),
        Image.configure({
          inline: true,
          allowBase64: true,
        }),
      ],
      content: '',
    });
  });

  afterEach(() => {
    editor.destroy();
  });

  describe('getNode', () => {
    it('should return parent node for nested content', () => {
      editor.commands.setContent('<p>Hello <strong>world</strong></p>');

      // Position inside the strong tag
      const pos = { pos: 8, inside: 8 };
      const node = getNode(editor.view, pos);

      expect(node).toBeDefined();
      expect(node?.type.name).toBe('paragraph');
    });

    it('should return image node when position is on an image', () => {
      editor.commands.setContent(
        '<p>Text before</p><img src="test.jpg" /><p>Text after</p>',
      );

      // Find the image position
      let imagePos = -1;
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'image') {
          imagePos = pos;
          return false;
        }
      });

      expect(imagePos).toBeGreaterThan(-1);

      const pos = { pos: imagePos, inside: imagePos };
      const node = getNode(editor.view, pos);

      expect(node).toBeDefined();
      expect(node?.type.name).toBe('image');
    });

    it('should handle positions at document root', () => {
      editor.commands.setContent(
        '<p>First paragraph</p><p>Second paragraph</p>',
      );

      // Position after the first paragraph's opening tag (inside the content)
      const pos = { pos: 1, inside: 1 };
      const node = getNode(editor.view, pos);

      expect(node).toBeDefined();
      // Should return the paragraph (parent node)
      expect(node?.type.name).toBe('paragraph');
    });
  });

  describe('getNodeWithPos', () => {
    describe('nested content', () => {
      it('should return parent node and correct position for text inside paragraph', () => {
        editor.commands.setContent('<p>Hello world</p>');

        // Position inside the paragraph (at "world")
        const pos = { pos: 8, inside: 8 };
        const result = getNodeWithPos(editor.view, pos);

        expect(result).toBeDefined();
        expect(result?.node).toBeDefined();
        expect(result?.node?.type.name).toBe('paragraph');
        expect(result?.pos).toBeDefined();
        expect(typeof result?.pos).toBe('number');
        // Position should be before the paragraph node
        expect(result?.pos).toBe(0);
      });

      it('should return correct position for nested formatted text', () => {
        editor.commands.setContent(
          '<p>Text with <strong>bold</strong> content</p>',
        );

        // Position inside the strong tag
        const pos = { pos: 12, inside: 12 };
        const result = getNodeWithPos(editor.view, pos);

        expect(result).toBeDefined();
        expect(result?.node?.type.name).toBe('paragraph');
        expect(result?.pos).toBe(0);
      });

      it('should handle multiple paragraphs correctly', () => {
        editor.commands.setContent(
          '<p>First paragraph</p><p>Second paragraph</p><p>Third paragraph</p>',
        );

        // Position in second paragraph
        let secondParaPos = -1;
        let paraCount = 0;
        editor.state.doc.descendants((node, pos) => {
          if (node.type.name === 'paragraph') {
            paraCount++;
            if (paraCount === 2) {
              secondParaPos = pos + 1; // Position inside the paragraph
              return false;
            }
          }
        });

        expect(secondParaPos).toBeGreaterThan(-1);

        const pos = { pos: secondParaPos, inside: secondParaPos };
        const result = getNodeWithPos(editor.view, pos);

        expect(result).toBeDefined();
        expect(result?.node?.type.name).toBe('paragraph');
        expect(result?.node?.textContent).toBe('Second paragraph');
      });
    });

    describe('image nodes', () => {
      it('should return image node and correct position when clicking on image', () => {
        editor.commands.setContent(
          '<p>Before</p><img src="test.jpg" /><p>After</p>',
        );

        // Find the image position
        let imagePos = -1;
        editor.state.doc.descendants((node, pos) => {
          if (node.type.name === 'image') {
            imagePos = pos;
            return false;
          }
        });

        expect(imagePos).toBeGreaterThan(-1);

        const pos = { pos: imagePos, inside: imagePos };
        const result = getNodeWithPos(editor.view, pos);

        expect(result).toBeDefined();
        expect(result?.node?.type.name).toBe('image');
        expect(result?.pos).toBe(imagePos);
      });

      it('should handle inline image within paragraph', () => {
        editor.commands.setContent(
          '<p>Text <img src="test.jpg" /> more text</p>',
        );

        let imagePos = -1;
        editor.state.doc.descendants((node, pos) => {
          if (node.type.name === 'image') {
            imagePos = pos;
            return false;
          }
        });

        expect(imagePos).toBeGreaterThan(-1);

        // When clicking on an inline image, pos and inside should match
        const pos = { pos: imagePos, inside: imagePos };
        const result = getNodeWithPos(editor.view, pos);

        expect(result).toBeDefined();
        expect(result?.node?.type.name).toBe('image');
        expect(result?.pos).toBe(imagePos);
      });
    });

    describe('document root positions', () => {
      it('should handle positions at document root', () => {
        editor.commands.setContent('<p>First</p><p>Second</p>');

        // Position inside the first paragraph
        const pos = { pos: 1, inside: 1 };
        const result = getNodeWithPos(editor.view, pos);

        expect(result).toBeDefined();
        expect(result?.node).toBeDefined();
        expect(result?.node?.type.name).toBe('paragraph');
        expect(result?.pos).toBeDefined();
        expect(result?.pos).toBe(0); // Position before the paragraph
      });

      it('should handle empty document', () => {
        editor.commands.setContent('');

        // Position inside the empty paragraph that StarterKit creates
        const pos = { pos: 1, inside: 1 };
        const result = getNodeWithPos(editor.view, pos);

        expect(result).toBeDefined();
        // Empty document should have at least a paragraph node
        expect(result?.node).toBeDefined();
        expect(result?.node?.type.name).toBe('paragraph');
      });
    });

    describe('edge cases', () => {
      it('should handle position at start of paragraph content', () => {
        editor.commands.setContent('<p>Content</p>');

        // Position at the start of the paragraph content (after opening tag)
        const pos = { pos: 1, inside: 1 };
        const result = getNodeWithPos(editor.view, pos);

        expect(result).toBeDefined();
        expect(result?.node).toBeDefined();
        expect(result?.node?.type.name).toBe('paragraph');
        expect(result?.pos).toBe(0);
      });

      it('should handle position at end of paragraph content', () => {
        editor.commands.setContent('<p>Content</p>');

        // Position at the end of "Content" (before closing tag)
        // "Content" is 7 characters, position 1 is start, so position 8 is at the end
        const pos = { pos: 8, inside: 8 };
        const result = getNodeWithPos(editor.view, pos);

        expect(result).toBeDefined();
        expect(result?.node).toBeDefined();
        expect(result?.node?.type.name).toBe('paragraph');
      });

      it('should handle lists with nested items', () => {
        editor.commands.setContent(
          '<ul><li>First item</li><li>Second item</li></ul>',
        );

        // Position inside first list item
        let listItemPos = -1;
        editor.state.doc.descendants((node, pos) => {
          if (node.type.name === 'listItem') {
            listItemPos = pos + 1; // Inside the list item
            return false;
          }
        });

        expect(listItemPos).toBeGreaterThan(-1);

        const pos = { pos: listItemPos, inside: listItemPos };
        const result = getNodeWithPos(editor.view, pos);

        expect(result).toBeDefined();
        expect(result?.node).toBeDefined();
        // Should return paragraph inside list item (StarterKit wraps list content in paragraphs)
        expect(['listItem', 'paragraph']).toContain(result?.node?.type.name);
      });

      it('should handle headings', () => {
        editor.commands.setContent('<h1>Heading</h1><p>Paragraph</p>');

        // Position inside heading
        const pos = { pos: 3, inside: 3 };
        const result = getNodeWithPos(editor.view, pos);

        expect(result).toBeDefined();
        expect(result?.node?.type.name).toBe('heading');
        expect(result?.pos).toBe(0);
      });

      it('should handle code blocks', () => {
        editor.commands.setContent('<pre><code>const x = 1;</code></pre>');

        // Position inside code block
        const pos = { pos: 5, inside: 5 };
        const result = getNodeWithPos(editor.view, pos);

        expect(result).toBeDefined();
        expect(result?.node).toBeDefined();
        expect(['codeBlock', 'text']).toContain(result?.node?.type.name);
      });
    });

    describe('consistency with getNode', () => {
      it('should return the same node as getNode', () => {
        editor.commands.setContent('<p>Test <strong>content</strong> here</p>');

        const pos = { pos: 8, inside: 8 };

        const node = getNode(editor.view, pos);
        const result = getNodeWithPos(editor.view, pos);

        expect(result?.node).toBe(node);
      });

      it('should return matching nodes for multiple positions', () => {
        editor.commands.setContent('<p>First</p><p>Second</p><p>Third</p>');

        // Test multiple positions
        [1, 10, 20].forEach((position) => {
          if (position < editor.state.doc.content.size) {
            const pos = { pos: position, inside: position };

            const node = getNode(editor.view, pos);
            const result = getNodeWithPos(editor.view, pos);

            expect(result?.node).toBe(node);
          }
        });
      });
    });
  });
});
