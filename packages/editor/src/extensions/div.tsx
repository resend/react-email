import { mergeAttributes } from '@tiptap/core';
import { EmailNode } from '../core/serializer/email-node';
import {
  COMMON_HTML_ATTRIBUTES,
  createStandardAttributes,
  LAYOUT_ATTRIBUTES,
} from '../utils/attribute-helpers';
import { inlineCssToJs } from '../utils/styles';

export interface DivOptions {
  HTMLAttributes: Record<string, unknown>;
}

export const Div = EmailNode.create<DivOptions>({
  name: 'div',

  group: 'block',

  content: 'block+',

  defining: true,
  isolating: true,

  parseHTML() {
    return [
      {
        tag: 'div:not([data-type])',
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

  addAttributes() {
    return {
      ...createStandardAttributes([
        ...COMMON_HTML_ATTRIBUTES,
        ...LAYOUT_ATTRIBUTES,
      ]),
    };
  },

  renderToReactEmail({ children, node, style }) {
    const inlineStyles = inlineCssToJs(node.attrs?.style);
    return (
      <div
        className={node.attrs?.class || undefined}
        style={{
          ...style,
          ...inlineStyles,
        }}
      >
        {children}
      </div>
    );
  },
});
