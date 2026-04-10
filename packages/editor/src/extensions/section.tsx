import { Section as ReactEmailSection } from 'react-email';
import { mergeAttributes } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type * as React from 'react';
import { EmailNode } from '../core/serializer/email-node';
import { getTextAlignment } from '../utils/get-text-alignment';
import { inlineCssToJs } from '../utils/styles';

function isSectionEmpty(node: ProseMirrorNode): boolean {
  return node.textContent === '' && node.content.size <= node.childCount * 2;
}

export interface SectionOptions {
  HTMLAttributes: Record<string, unknown>;
  [key: string]: unknown;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    section: {
      insertSection: () => ReturnType;
    };
  }
}

export const Section = EmailNode.create<SectionOptions>({
  name: 'section',
  group: 'block',
  content: 'block+',
  isolating: true,
  defining: true,

  parseHTML() {
    return [{ tag: 'section[data-type="section"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'section',
      mergeAttributes(
        { 'data-type': 'section', class: 'node-section' },
        HTMLAttributes,
      ),
      0,
    ];
  },

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { empty, $from } = selection;

        if (!empty) return false;

        // Case 1: Cursor is inside an empty section at the start position
        for (let depth = $from.depth; depth >= 1; depth--) {
          if ($from.node(depth).type.name !== 'section') continue;

          if ($from.parentOffset !== 0) return false;
          let atStart = true;
          for (let d = depth; d < $from.depth; d++) {
            if ($from.index(d) !== 0) {
              atStart = false;
              break;
            }
          }
          if (!atStart) return false;

          const sectionNode = $from.node(depth);
          if (!isSectionEmpty(sectionNode)) return false;

          const tr = state.tr;
          const from = $from.before(depth);
          const to = $from.after(depth);
          const parent = $from.node(depth - 1);

          if (parent.childCount === 1) {
            tr.replaceWith(from, to, state.schema.nodes.paragraph.create());
          } else {
            tr.delete(from, to);
          }

          editor.view.dispatch(tr);
          return true;
        }

        // Case 2: Cursor is right after an empty section (previous sibling)
        for (let depth = $from.depth; depth >= 1; depth--) {
          if ($from.pos !== $from.start(depth)) break;

          const indexInParent = $from.index(depth - 1);
          if (indexInParent === 0) continue;

          const parent = $from.node(depth - 1);
          const prevNode = parent.child(indexInParent - 1);

          if (prevNode.type.name === 'section' && isSectionEmpty(prevNode)) {
            const deleteFrom = $from.before(depth) - prevNode.nodeSize;
            const deleteTo = $from.before(depth);
            editor.view.dispatch(state.tr.delete(deleteFrom, deleteTo));
            return true;
          }

          break;
        }

        return false;
      },
    };
  },

  addCommands() {
    return {
      insertSection:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            content: [
              {
                type: 'paragraph',
                content: [],
              },
            ],
          });
        },
    };
  },

  renderToReactEmail({ children, node, style }) {
    const inlineStyles = inlineCssToJs(node.attrs?.style);
    const textAlign = node.attrs?.align || node.attrs?.alignment;

    return (
      <ReactEmailSection
        className={node.attrs?.class || undefined}
        align={textAlign}
        style={
          {
            ...style,
            ...inlineStyles,
            ...getTextAlignment(textAlign),
          } as React.CSSProperties
        }
      >
        {children}
      </ReactEmailSection>
    );
  },
});
