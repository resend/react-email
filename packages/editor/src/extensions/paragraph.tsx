import { EmailNode } from '../core/serializer/email-node';
import { getTextAlignment } from '../utils/get-text-alignment';
import { inlineCssToJs } from '../utils/styles';
import { getStarterKitNode } from './starter-kit-extension';

export const Paragraph = EmailNode.from(
  getStarterKitNode('paragraph'),
  ({ children, node, style }) => {
    const isEmpty = !node.content || node.content.length === 0;

    return (
      <p
        className={node.attrs?.class || undefined}
        style={{
          ...style,
          ...inlineCssToJs(node.attrs?.style),
          ...getTextAlignment(node.attrs?.align || node.attrs?.alignment),
        }}
      >
        {isEmpty ? (
          /* Add <br/> inside empty paragraph to make sure what users sees in the preview is the space that will be render in the email */
          <br />
        ) : (
          children
        )}
      </p>
    );
  },
);
