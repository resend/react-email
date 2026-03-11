import BulletListExtension from '@tiptap/extension-bullet-list';
import { EmailNode } from '../core/serializer/email-node';
import { inlineCssToJs } from '../utils/styles';

export const BulletList = EmailNode.from(
  BulletListExtension,
  ({ children, node, style }) => (
    <ul
      className={node.attrs?.class || undefined}
      style={{
        ...style,
        ...inlineCssToJs(node.attrs?.style),
      }}
    >
      {children}
    </ul>
  ),
);
