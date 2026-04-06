import { useCurrentEditor } from '@tiptap/react';
import React from 'react';
import { type FocusedNode, useInspector } from './provider';

export interface InspectorBreadcrumbSegment {
  node: FocusedNode | null;
  focus: () => void;
}

export interface InspectorBreadcrumbProps {
  children: (segments: InspectorBreadcrumbSegment[]) => React.ReactNode;
}

export function InspectorBreadcrumb({ children }: InspectorBreadcrumbProps) {
  const { editor } = useCurrentEditor();
  const { pathFromRoot } = useInspector();

  const segments = React.useMemo(() => {
    return [
      {
        node: null,
        focus() {
          editor?.commands.setTextSelection(0);
        },
      },
      ...pathFromRoot.map((focusedNode) => ({
        node: focusedNode,
        focus() {
          editor?.commands.setNodeSelection(focusedNode.nodePos.pos);
          editor?.commands.focus();
        },
      })),
    ] satisfies InspectorBreadcrumbSegment[];
  }, [pathFromRoot]);

  return children(segments);
}
