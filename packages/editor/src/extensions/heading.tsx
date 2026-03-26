import { Heading as EmailHeading } from '@react-email/components';
import type { HeadingOptions as TipTapHeadingOptions } from '@tiptap/extension-heading';
import { Heading as TipTapHeading } from '@tiptap/extension-heading';

export type HeadingOptions = TipTapHeadingOptions;

import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from '@tiptap/react';
import { getTextAlignment } from '../utils/get-text-alignment';
import { inlineCssToJs } from '../utils/styles';

export const Heading = TipTapHeading.extend({
  addNodeView() {
    return ReactNodeViewRenderer(({ node }) => {
      const level = (node.attrs.level as number) ?? 1;
      const { class: className, ...rest } = node.attrs;

      const attrs = {
        ...rest,
        className: `node-h${level} ${className}`,
        style: inlineCssToJs(node.attrs.style),
      };

      return (
        <NodeViewWrapper>
          <EmailHeading as={`h${level}` as 'h1' | 'h2' | 'h3'} {...attrs}>
            <NodeViewContent />
          </EmailHeading>
        </NodeViewWrapper>
      );
    });
  },

  renderToReactEmail({ children, node, style }) {
    const level = node.attrs?.level ?? 1;
    return (
      <EmailHeading
        as={`h${level}` as 'h1' | 'h2' | 'h3'}
        className={node.attrs?.class || undefined}
        style={{
          ...style,
          ...inlineCssToJs(node.attrs?.style),
          ...getTextAlignment(node.attrs?.align ?? node.attrs?.alignment),
        }}
      >
        {children}
      </EmailHeading>
    );
  },
});
