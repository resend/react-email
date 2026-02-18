import { mergeAttributes } from '@tiptap/core';
import { EmailNode } from '../core/email-node';
import {
  COMMON_HTML_ATTRIBUTES,
  createStandardAttributes,
  LAYOUT_ATTRIBUTES,
} from '../utils/attribute-helpers';
import { inlineCssToJs } from '../utils/styles';

export interface BodyOptions {
  HTMLAttributes: Record<string, unknown>;
}

export const Body = EmailNode.create<BodyOptions>({
  name: 'body',

  group: 'block',

  content: 'block+',

  defining: true,
  isolating: true,

  addAttributes() {
    return {
      ...createStandardAttributes([
        ...COMMON_HTML_ATTRIBUTES,
        ...LAYOUT_ATTRIBUTES,
      ]),
    };
  },

  parseHTML() {
    return [
      {
        tag: 'body',
        getAttrs: (node) => {
          if (typeof node === 'string') {
            return false;
          }
          const element = node as HTMLElement;
          const attrs: Record<string, string> = {};

          // Preserve all attributes
          Array.from(element.attributes).forEach((attr) => {
            attrs[attr.name] = attr.value;
          });

          return attrs;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  renderToReactEmail({ children, node, styles }) {
    const inlineStyles = inlineCssToJs(node.attrs?.style);
    return (
      <div
        className={node.attrs?.class || undefined}
        style={{
          ...styles.reset,
          ...inlineStyles,
        }}
      >
        {children}
      </div>
    );
  },
});
