import type { Editor } from '@tiptap/core';

export function defaultValidateUrl(url: string): string | null | undefined {
  if (url === '#') return url;
  try {
    new URL(url);
    return url;
  } catch {
    if (url.includes('.')) {
      return `https://${url}`;
    }
    return undefined;
  }
}

export function setHref(
  editor: Editor,
  element: 'link' | 'button' | 'image',
  href: string,
) {
  if (element === 'button') {
    editor.commands.updateAttributes('button', { href });
    return;
  }
  if (element === 'image') {
    editor.commands.updateAttributes('image', { href });
    return;
  }
  if (href.length === 0) {
    editor.chain().unsetLink().run();
    return;
  }
  const { from, to } = editor.state.selection;
  if (from === to) {
    editor
      .chain()
      .extendMarkRange('link')
      .setLink({ href })
      .setTextSelection({ from, to })
      .run();
    return;
  }
  editor.chain().setLink({ href }).run();
}
