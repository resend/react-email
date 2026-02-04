import { Hr } from '@react-email/components';
import type { Node } from '@tiptap/pm/model';
import { NodeViewWrapper } from '@tiptap/react';
// NOTE: Extensions layer imports from plugins layer - this is acceptable.
import { useEditorStyles } from '../plugins/theming/context.js';
import { inlineCSSToJS } from '../utils/convert-css-object.js';

type ReactEmailDividerProps = {
  node: Node;
};

export const ReactEmailDivider = (props: ReactEmailDividerProps) => {
  const node = props.node;
  const { class: className, ...rest } = node.attrs;

  const editorStyles = useEditorStyles();

  const attrs = {
    ...rest,
    className: className,
    style: {
      ...editorStyles.styles.toCss().hr,
      ...inlineCSSToJS(node.attrs.style),
    },
  };

  return (
    <NodeViewWrapper>
      <Hr {...attrs} />
    </NodeViewWrapper>
  );
};
