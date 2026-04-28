import { InputRule } from '@tiptap/core';
import type { HorizontalRuleOptions } from '@tiptap/extension-horizontal-rule';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { Hr } from 'react-email';

export type DividerOptions = HorizontalRuleOptions;

import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { EmailNode } from '../core';
import { inlineCssToJs } from '../utils/styles';

export const Divider: EmailNode<HorizontalRuleOptions, any> = EmailNode.from(
  HorizontalRule.extend({
    addAttributes() {
      return {
        class: {
          default: 'divider',
        },
      };
    },
    // patch to fix horizontal rule bug: https://github.com/ueberdosis/tiptap/pull/3859#issuecomment-1536799740
    addInputRules() {
      return [
        new InputRule({
          find: /^(?:---|—-|___\s|\*\*\*\s)$/,
          handler: ({ state, range }) => {
            const attributes = {};

            const { tr } = state;
            const start = range.from;
            const end = range.to;

            tr.insert(start - 1, this.type.create(attributes)).delete(
              tr.mapping.map(start),
              tr.mapping.map(end),
            );
          },
        }),
      ];
    },
    addNodeView() {
      return ReactNodeViewRenderer((props) => {
        const node = props.node;
        const { class: className, ...rest } = node.attrs;

        const attrs = {
          ...rest,
          className: 'node-hr',
          style: inlineCssToJs(node.attrs.style),
        };

        return (
          <NodeViewWrapper>
            <Hr {...attrs} />
          </NodeViewWrapper>
        );
      });
    },
  }),
  ({ node, style }) => {
    return (
      <Hr
        className={node.attrs?.class || undefined}
        style={{ ...style, ...inlineCssToJs(node.attrs?.style) }}
      />
    );
  },
);
