import {
  type AnyExtension,
  Editor,
  type EditorOptions,
  type JSONContent,
} from '@tiptap/core';
import { StarterKit } from '../extensions';

interface CreateTestEditorOptions {
  content?: EditorOptions['content'];
  extensions?: AnyExtension[];
  editorProps?: EditorOptions['editorProps'];
}

/**
 * Creates a real tiptap `Editor` instance for unit tests.
 * Mirrors the inline `createEditorWithContent` pattern from
 * `core/serializer/compose-react-email.spec.tsx` so all specs share the
 * same setup. Always remember to `editor.destroy()` in `afterEach`.
 */
export function createTestEditor(
  options: CreateTestEditorOptions = {},
): Editor {
  const editorOptions: EditorOptions = {
    extensions: options.extensions ?? [StarterKit],
  } as EditorOptions;
  if (options.content !== undefined) {
    (editorOptions as { content: EditorOptions['content'] }).content =
      options.content;
  }
  if (options.editorProps !== undefined) {
    (editorOptions as { editorProps: EditorOptions['editorProps'] }).editorProps =
      options.editorProps;
  }
  return new Editor(editorOptions);
}

/**
 * Convenience: returns the doc JSON for a single-paragraph string of `text`.
 */
export function paragraphDoc(text: string): JSONContent {
  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: text ? [{ type: 'text', text }] : undefined,
      },
    ],
  };
}
