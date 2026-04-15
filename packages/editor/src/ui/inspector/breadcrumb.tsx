import { useCurrentEditor } from '@tiptap/react';
import React from 'react';
import { getNodeMeta } from './config/node-meta';
import { type FocusedNode, useInspector } from './root';

export interface InspectorBreadcrumbSegment {
  node: FocusedNode;
  focus: () => void;
}

export interface InspectorBreadcrumbProps {
  children?: (segments: InspectorBreadcrumbSegment[]) => React.ReactNode;
}

export function InspectorBreadcrumb({ children }: InspectorBreadcrumbProps) {
  const { editor } = useCurrentEditor();
  const inspector = useInspector();

  const pathFromRoot = inspector.ready ? inspector.pathFromRoot : null;

  const segments = React.useMemo(() => {
    if (!editor || !pathFromRoot) {
      return [];
    }
    return pathFromRoot.map((focusedNode) => ({
      node: focusedNode,
      focus() {
        if (focusedNode.nodeType === 'body') {
          // Body is a logical root, not always a concrete ProseMirror node —
          // blur to surface the document-level inspector rather than risk
          // selecting whatever is at pos 0.
          if (typeof document !== 'undefined') {
            const active = document.activeElement;
            if (active instanceof HTMLElement) {
              active.blur();
            }
          }
          editor.commands.blur();
          return;
        }
        editor.commands.setNodeSelection(focusedNode.nodePos.pos);
        editor.commands.focus();
      },
    })) satisfies InspectorBreadcrumbSegment[];
  }, [editor, pathFromRoot]);

  if (!inspector.ready) {
    return null;
  }

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
          const label = getNodeMeta(segment.node.nodeType).label;
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
