import type { Editor } from '@tiptap/core';

const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

/**
 * Basic URL validation and auto-prefixing.
 * Rejects dangerous schemes (javascript:, data:, vbscript:, etc.).
 * Returns the valid URL string or null.
 */
export function getUrlFromString(str: string): string | null {
  if (str === '#') {
    return str;
  }

  try {
    const url = new URL(str);
    if (SAFE_PROTOCOLS.has(url.protocol)) {
      return str;
    }
    return null;
  } catch {
    // not a valid URL as-is
  }

  try {
    if (str.includes('.') && !str.includes(' ')) {
      return new URL(`https://${str}`).toString();
    }
  } catch {
    // still not valid
  }

  return null;
}

export function setLinkHref(editor: Editor, href: string): void {
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

export function focusEditor(editor: Editor): void {
  setTimeout(() => {
    editor.commands.focus();
  }, 0);
}
