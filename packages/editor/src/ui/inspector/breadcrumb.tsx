import { useCurrentEditor } from '@tiptap/react';
import React from 'react';
import { getNodeMeta } from './config/node-meta';
import { type FocusedNode, useInspector } from './provider';

export interface InspectorBreadcrumbSegment {
  node: FocusedNode | null;
  focus: () => void;
}

export interface InspectorBreadcrumbProps {
  children?: (segments: InspectorBreadcrumbSegment[]) => React.ReactNode;
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

  if (children) {
    return children(segments);
  }

  return <BreadcrumbDefault segments={segments} />;
}

function BreadcrumbDefault({
  segments,
}: {
  segments: InspectorBreadcrumbSegment[];
}) {
  return (
    <nav data-re-inspector-breadcrumb="">
      <ol data-re-inspector-breadcrumb-list="">
        {segments.map((segment, i) => {
          const label = segment.node
            ? getNodeMeta(segment.node.nodeType).label
            : 'Layout';
          const isLast = i === segments.length - 1;

          return (
            <li key={i} data-re-inspector-breadcrumb-item="">
              {i !== 0 && (
                <span data-re-inspector-breadcrumb-separator="">/</span>
              )}
              <button
                type="button"
                data-re-inspector-breadcrumb-button=""
                {...(!isLast ? { 'data-clickable': '' } : {})}
                onClick={() => segment.focus()}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
