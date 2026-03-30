import { Section as ReactEmailSection } from '@react-email/components';
import { mergeAttributes } from '@tiptap/core';
import type * as React from 'react';
import { EmailNode } from '../core/serializer/email-node';
import { getTextAlignment } from '../utils/get-text-alignment';
import { inlineCssToJs } from '../utils/styles';

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
