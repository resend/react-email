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

const MAX_VISIBLE = 3;

function getVisibleSegments(segments: InspectorBreadcrumbSegment[]) {
  if (segments.length <= MAX_VISIBLE) {
    return {
      items: segments.map((s, i) => ({ segment: s, index: i })),
      hasEllipsis: false,
    };
  }

  const first = { segment: segments[0], index: 0 };
  const last = segments.slice(-2).map((s, i) => ({
    segment: s,
    index: segments.length - 2 + i,
  }));

  return { items: [first, ...last], hasEllipsis: true };
}

function BreadcrumbDefault({
  segments,
}: {
  segments: InspectorBreadcrumbSegment[];
}) {
  const { items, hasEllipsis } = getVisibleSegments(segments);

  return (
    <nav data-re-inspector-breadcrumb="">
      <ol data-re-inspector-breadcrumb-list="">
        {items.map(({ segment, index }, i) => {
          const label = segment.node
            ? getNodeMeta(segment.node.nodeType).label
            : 'Layout';
          const isLast = index === segments.length - 1;

          return (
            <li key={index} data-re-inspector-breadcrumb-item="">
              {i !== 0 && (
                <span data-re-inspector-breadcrumb-separator="">/</span>
              )}
              {i === 1 && hasEllipsis && (
                <>
                  <span data-re-inspector-breadcrumb-ellipsis="">&hellip;</span>
                  <span data-re-inspector-breadcrumb-separator="">/</span>
                </>
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
