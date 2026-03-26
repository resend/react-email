import type { ListItemOptions } from '@tiptap/extension-list-item';
import ListItemBase from '@tiptap/extension-list-item';
import { getTextAlignment } from '../utils/get-text-alignment';
import { inlineCssToJs } from '../utils/styles';

export { type ListItemOptions };

export const ListItem = ListItemBase.extend({
  renderToReactEmail({ children, node, style }) {
    return (
      <li
        className={node.attrs?.class || undefined}
        style={{
          ...style,
          ...inlineCssToJs(node.attrs?.style),
          ...getTextAlignment(node.attrs?.align || node.attrs?.alignment),
        }}
      >
        {children}
      </li>
    );
  },
});
