import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createPlaceholderExtension, placeholder } from './placeholder';

describe('Placeholder Extension', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = new Editor({
      extensions: [StarterKit.configure({}), placeholder],
      content: '',
    });
  });

  afterEach(() => {
    editor.destroy();
  });

  describe('Extension Configuration', () => {
    it('be properly configured', () => {
      const extension = editor.extensionManager.extensions.find(
        (ext) => ext.name === 'placeholder',
      );

      expect(extension).toBeDefined();
      expect(extension?.options.includeChildren).toBe(true);
    });

    it('allows custom configuration', () => {
      const customExtension = createPlaceholderExtension({
        includeChildren: false,
      });

      expect(customExtension.options.includeChildren).toBe(false);
    });
  });

  describe('Placeholder Content', () => {
    it('returns default placeholder for paragraph nodes', () => {
      const { schema } = editor;
      const paragraphNode = schema.nodes.paragraph.create();

      const extension = editor.extensionManager.extensions.find(
        (ext) => ext.name === 'placeholder',
      );

      const placeholderText = extension?.options.placeholder({
        node: paragraphNode,
      });

      expect(placeholderText).toBe("Press '/' for commands");
    });

    it('returns heading placeholder for heading nodes', () => {
      const testEditor = new Editor({
        extensions: [StarterKit.configure({ heading: {} }), placeholder],
        content: '',
      });

      const { schema } = testEditor;
      const headingNode = schema.nodes.heading.create({ level: 1 });

      const extension = testEditor.extensionManager.extensions.find(
        (ext) => ext.name === 'placeholder',
      );

      const placeholderText = extension?.options.placeholder({
        node: headingNode,
      });

      expect(placeholderText).toBe('Heading 1');

      testEditor.destroy();
    });

    it('supports different heading levels', () => {
      const testEditor = new Editor({
        extensions: [StarterKit.configure({ heading: {} }), placeholder],
        content: '',
      });

      const { schema } = testEditor;
      const extension = testEditor.extensionManager.extensions.find(
        (ext) => ext.name === 'placeholder',
      );

      [1, 2, 3, 4, 5, 6].forEach((level) => {
        const headingNode = schema.nodes.heading.create({ level });
        const placeholderText = extension?.options.placeholder({
          node: headingNode,
        });
        expect(placeholderText).toBe(`Heading ${level}`);
      });

      testEditor.destroy();
    });
  });

  describe('Integration with Editor', () => {
    it('adds placeholder attributes to empty paragraphs', () => {
      editor.commands.setContent('');

      const editorElement = editor.view.dom;
      const paragraph = editorElement.querySelector('p');

      expect(paragraph).toBeTruthy();
      expect(
        paragraph?.classList.contains('is-empty') ||
          paragraph?.hasAttribute('data-placeholder'),
      ).toBe(true);
    });

    it('remove placeholder when content is added', () => {
      editor.commands.setContent('');
      editor.commands.setContent('<p>Hello World</p>');

      const editorElement = editor.view.dom;
      const paragraph = editorElement.querySelector('p');

      expect(paragraph?.textContent).toBe('Hello World');
      expect(paragraph?.classList.contains('is-empty')).toBe(false);
    });

    it('handles multiple paragraphs with empty lines correctly', () => {
      editor.commands.setContent(
        '<p>First paragraph</p><p></p><p>Third paragraph</p>',
      );

      const editorElement = editor.view.dom;
      const paragraphs = editorElement.querySelectorAll('p');

      expect(paragraphs).toHaveLength(3);
      expect(paragraphs[0].textContent).toBe('First paragraph');
      expect(paragraphs[1].textContent).toBe('');
      expect(paragraphs[2].textContent).toBe('Third paragraph');

      expect(paragraphs[1].nodeName.toLowerCase()).toBe('p');
    });

    it('keeps placeholder on first line when all content is removed', () => {
      editor.commands.setContent('<p>Some content</p><p>More content</p>');

      let editorElement = editor.view.dom;
      let paragraphs = editorElement.querySelectorAll('p');

      expect(paragraphs).toHaveLength(2);
      expect(paragraphs[0].textContent).toBe('Some content');
      expect(paragraphs[1].textContent).toBe('More content');

      editor.commands.setContent('');

      editorElement = editor.view.dom;
      paragraphs = editorElement.querySelectorAll('p');

      expect(paragraphs).toHaveLength(1);
      expect(paragraphs[0].textContent).toBe('');
      expect(
        paragraphs[0].classList.contains('is-empty') ||
          paragraphs[0].hasAttribute('data-placeholder'),
      ).toBe(true);
    });

    it('maintains proper document structure when navigating between empty and filled paragraphs', () => {
      editor.commands.setContent('<p>First line</p><p></p><p>Third line</p>');

      const editorElement = editor.view.dom;
      const paragraphs = editorElement.querySelectorAll('p');

      expect(paragraphs).toHaveLength(3);
      expect(paragraphs[0].textContent).toBe('First line');
      expect(paragraphs[1].textContent).toBe('');
      expect(paragraphs[2].textContent).toBe('Third line');

      editor.commands.focus();

      const emptyParagraphPos = editor.state.doc.resolve(15).pos;
      editor.commands.setTextSelection(emptyParagraphPos);

      expect(paragraphs[1].nodeName.toLowerCase()).toBe('p');
    });
  });
});
