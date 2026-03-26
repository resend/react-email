import CodeBase from '@tiptap/extension-code';
import { inlineCssToJs } from '../utils/styles';

export const Code = CodeBase.extend({
  renderToReactEmail({ children, node, style }) {
    return (
      <code style={{ ...style, ...inlineCssToJs(node.attrs?.style) }}>
        {children}
      </code>
    );
  },
});
