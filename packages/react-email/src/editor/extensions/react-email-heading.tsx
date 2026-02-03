import { Heading } from '@react-email/components';
import type { Node } from '@tiptap/pm/model';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { inlineCSSToJS } from '@/utils/convert-css-object';
// NOTE: Extensions layer imports from plugins layer - this is acceptable.
import { useEditorStyles } from '../plugins/theming/context';

type ReactEmailHeadingProps = {
  node: Node;
};

export const ReactEmailHeading = (props: ReactEmailHeadingProps) => {
  const node = props.node;
  const { class: className, ...rest } = node.attrs;

  const editorStyles = useEditorStyles();
  const stylesCss = editorStyles.styles.toCss();

  const attrs = {
    ...rest,
    className: className,
    style: {
      ...stylesCss.reset,
      ...stylesCss[`h${node.attrs.level}` as 'h1' | 'h2' | 'h3'],
      ...inlineCSSToJS(node.attrs.style),
    },
  };

  return (
    <NodeViewWrapper>
      <Heading as={`h${node.attrs.level}` as 'h1' | 'h2' | 'h3'} {...attrs}>
        <NodeViewContent />
      </Heading>
    </NodeViewWrapper>
  );
};
