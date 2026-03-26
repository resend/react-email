import { useCurrentEditor } from '@tiptap/react';
import path from 'path';
import React from 'react';
import type { NodeClickedEvent } from '../../core';
import { type FocusedNode, useInspector } from './provider';

export interface InspectorBreadcrumbSegment {
  props: {};
  /**
   * Only null when the segment is for the document
   */
  node: FocusedNode | null;
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
        // the node for the root layout
        node: null,
        props: {
          onClick() {
            editor?.commands.setTextSelection(0);
          },
          ['aria-label']: 'Select layout',
        },
      },
      ...pathFromRoot.map((focusedNode, i) => ({
        node: focusedNode,
        props: {
          onClick() {
            editor?.commands.setNodeSelection(focusedNode.nodePos.pos);
            editor?.commands.focus();
          },
          ['aria-label']: `Select ${focusedNode.nodeType}`,
        },
      })),
    ] satisfies InspectorBreadcrumbSegment[];
  }, [pathFromRoot]);

  return children(segments);
}
