import { Heading as EmailHeading } from '@react-email/components';
import { Heading as TipTapHeading } from '@tiptap/extension-heading';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { EmailNode } from '../core/serializer/email-node';
import { getTextAlignment } from '../utils/get-text-alignment';
import { inlineCssToJs } from '../utils/styles';
import { ReactEmailHeading } from './react-email-heading';

export const Heading = EmailNode.from(
  TipTapHeading.extend({
    addNodeView() {
      return ReactNodeViewRenderer(ReactEmailHeading);
    },
  }),
  ({ children, node, styles }) => {
    const level = node.attrs?.level ?? 1;
    return (
      <EmailHeading
        as={`h${level}` as 'h1' | 'h2' | 'h3'}
        className={node.attrs?.class || undefined}
        style={
          {
            ...styles.reset,
            ...styles[`h${level}` as 'h1' | 'h2' | 'h3'],
            ...inlineCssToJs(node.attrs?.style),
            ...getTextAlignment(node.attrs?.align ?? node.attrs?.alignment),
          } as React.CSSProperties
        }
      >
        {children}
      </EmailHeading>
    );
  },
);
