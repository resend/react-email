import type { Editor } from '@tiptap/core';
import { useEditorState } from '@tiptap/react';
import { inlineCssToJs, jsToInlineCss } from '../../../../utils/styles';

interface LinkMarkState {
  href: string;
  style: string;
  isActive: boolean;
}

/**
 * Resolves the link mark directly from the ProseMirror document at the cursor
 * position. This is more reliable than `editor.getAttributes('link')` because
 * `style` is not a declared attribute on the Link extension, so `getAttributes`
 * can't return it for collapsed selections.
 */
export function useLinkMark(editor: Editor | null): LinkMarkState {
  return (
    useEditorState({
      editor,
      selector: ({ editor }) => {
        if (!editor) {
          return { href: '', style: '', isActive: false };
        }
        const { from } = editor.state.selection;
        const mark =
          editor.state.doc
            .resolve(from)
            .marks()
            .find((m) => m.type.name === 'link') ?? null;
        return {
          href: (mark?.attrs?.href as string) ?? '',
          style: (mark?.attrs?.style as string) ?? '',
          isActive: !!mark,
        };
      },
    }) ?? { href: '', style: '', isActive: false }
  );
}

/**
 * Extracts the effective color for a link mark, falling back through:
 * 1. Inline style on the link mark
 * 2. Theme's default link color
 * 3. The provided fallback (defaults to `#000000`)
 */
export function getLinkColor(
  linkStyle: string,
  themeLinkColor: string | undefined,
  fallback = '#000000',
): string {
  return inlineCssToJs(linkStyle).color || themeLinkColor || fallback;
}

/**
 * Updates the color property on a link mark's inline style, preserving
 * other styles like `text-decoration`.
 */
export function updateLinkColor(
  editor: Editor,
  linkStyle: string,
  color: string,
): void {
  const styleObj = inlineCssToJs(linkStyle);
  styleObj.color = color;
  const newStyle = jsToInlineCss(styleObj);
  editor
    .chain()
    .focus()
    .extendMarkRange('link')
    .updateAttributes('link', { style: newStyle })
    .run();
}
