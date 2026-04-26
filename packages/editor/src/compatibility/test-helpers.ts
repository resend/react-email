import type { AnyExtension, JSONContent } from '@tiptap/core';
import { Editor } from '@tiptap/core';
import { StarterKit } from '../extensions';

export function createEditorWithContent(
  content: JSONContent,
  extraExtensions: readonly AnyExtension[] = [],
): Editor {
  return new Editor({
    content,
    extensions: [StarterKit, ...extraExtensions],
  });
}

export function docWithGlobalContent(
  content: JSONContent['content'],
  data: Record<string, unknown>,
): JSONContent {
  return {
    type: 'doc',
    content: [
      {
        type: 'globalContent',
        attrs: { data },
      },
      ...(content ?? []),
    ],
  };
}

export function destroyEditor(editor: Editor | null): void {
  editor?.destroy();
  document.head
    .querySelectorAll('style[id^="tiptap-theme-"]')
    .forEach((node) => {
      node.remove();
    });
}

export function expectHtmlContainsInOrder(
  html: string,
  expectedParts: readonly string[],
): void {
  let cursor = 0;

  for (const expectedPart of expectedParts) {
    const index = html.indexOf(expectedPart, cursor);
    expect(index).toBeGreaterThanOrEqual(0);
    cursor = index + expectedPart.length;
  }
}
