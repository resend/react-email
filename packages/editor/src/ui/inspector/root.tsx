import type { Attrs } from '@tiptap/pm/model';
import { NodeSelection, TextSelection } from '@tiptap/pm/state';
import { useCurrentEditor, useEditorState } from '@tiptap/react';
import * as React from 'react';
import type { NodeClickedEvent } from '../../core';
import type { PanelInputProperty } from '../../plugins/email-theming/types';
import { getNodeMeta } from './inspector/config/node-meta';
import { InspectorGlobal } from './inspector/global';
import { InspectorLocal } from './inspector/local';
import { InspectorText } from './inspector/text';
import { InspectorBreadcrumb } from './breadcrumb';

const IGNORED_NODES = ['doc', 'text'];

/**
 * Returns the node hierarchy at a given document position (innermost first).
 * Includes the node that starts at pos (if any) then its ancestors.
 */
function getHierarchyAtPosition(
  editor: ReturnType<typeof useCurrentEditor>['editor'],
  pos: number,
): NodeClickedEvent[] {
  if (!editor) {
    return [];
  }

  const { doc } = editor.state;
  const hierarchy: NodeClickedEvent[] = [];

  const nodeAtPos = doc.nodeAt(pos);
  if (nodeAtPos && !IGNORED_NODES.includes(nodeAtPos.type.name)) {
    hierarchy.push({
      nodeType: nodeAtPos.type.name,
      nodeAttrs: { ...nodeAtPos.attrs },
      nodePos: { pos, inside: pos },
    });
  }

  const resolvedPos = doc.resolve(pos);
  for (let depth = resolvedPos.depth; depth > 0; depth--) {
    const node = resolvedPos.node(depth);
    const nodePos = resolvedPos.before(depth);

    if (node && !IGNORED_NODES.includes(node.type.name)) {
      const isDuplicate = hierarchy.some((h) => h.nodePos.pos === nodePos);
      if (!isDuplicate) {
        hierarchy.push({
          nodeType: node.type.name,
          nodeAttrs: { ...node.attrs },
          nodePos: { pos: nodePos, inside: nodePos },
        });
      }
    }
  }

  return hierarchy;
}

function getNodeHierarchy(
  editor: ReturnType<typeof useCurrentEditor>['editor'],
): NodeClickedEvent[] {
  if (!editor) {
    return [];
  }

  const { selection } = editor.state;
  const hierarchy: NodeClickedEvent[] = [];

  if (selection instanceof NodeSelection) {
    const node = selection.node;
    if (node && !IGNORED_NODES.includes(node.type.name)) {
      hierarchy.push({
        nodeType: node.type.name,
        nodeAttrs: { ...node.attrs },
        nodePos: { pos: selection.from, inside: selection.from },
      });
    }
  }

  // Get all ancestor nodes from the selection
  const { from } = selection;
  const resolvedPos = editor.state.doc.resolve(from);

  // Traverse from deepest to shallowest (innermost to outermost)
  for (let depth = resolvedPos.depth; depth > 0; depth--) {
    const node = resolvedPos.node(depth);
    const pos = resolvedPos.before(depth);

    if (node && !IGNORED_NODES.includes(node.type.name)) {
      // Avoid duplicates (in case of NodeSelection)
      const isDuplicate = hierarchy.some((h) => h.nodePos.pos === pos);
      if (!isDuplicate) {
        hierarchy.push({
          nodeType: node.type.name,
          nodeAttrs: { ...node.attrs },
          nodePos: { pos, inside: pos },
        });
      }
    }
  }

  return hierarchy;
}

interface FocusedNode {
  nodeType: string;
  nodeAttrs: Attrs;
  nodePos: { pos: number; inside: number };
}

type InspectorTarget = 'doc' | 'text' | FocusedNode | null;

export interface RootProps {
  children: React.ReactNode;
}

export interface InspectorContextValue {
  inspectorTarget: InspectorTarget;
  pathToRoot: FocusedNode[];
}

export const InspectorContext =
  React.createContext<InspectorContextValue | null>(null);

export function useInspector() {
  const context = React.useContext(InspectorContext);
  if (!context) {
    throw new Error(
      'useInspector can only be called from inside the InspectorContext. This probably means you forgot the <Inspector.Root>',
    );
  }
  return context;
}

export function InspectorRoot({ children }: RootProps) {
  const { editor } = useCurrentEditor();

  const inspectorTarget = useEditorState({
    editor,
    selector(context): InspectorTarget {
      if (!context.editor) {
        return null;
      }

      const { selection } = context.editor.state;

      // If there's actual content selected, it's a text selection
      if (selection.content().size > 0 && selection instanceof TextSelection) {
        const { $from } = selection;
        for (let depth = $from.depth; depth > 0; depth--) {
          if ($from.node(depth).type.name === 'button') {
            const pos = $from.before(depth);
            const node = context.editor.state.doc.nodeAt(pos);
            if (node) {
              return {
                nodeType: 'button',
                nodeAttrs: { ...node.attrs },
                nodePos: { pos, inside: pos },
              };
            }
            break;
          }
        }

        return 'text';
      }

      // Derive the inspector target from the node hierarchy
      const hierarchy = getNodeHierarchy(context.editor);

      if (hierarchy.length > 0) {
        const innermost = hierarchy[0];
        const columnEntry = hierarchy.find(
          (h) => h.nodeType === 'columnsColumn',
        );
        const preferColumn = columnEntry && innermost.nodeType === 'paragraph';
        return preferColumn ? columnEntry : innermost;
      }

      return 'doc';
    },
  });

  const pathFromRoot = React.useMemo(() => {
    if (!editor) {
      return [];
    }
    if (typeof inspectorTarget === 'object' && inspectorTarget) {
      const atPos = getHierarchyAtPosition(editor, inspectorTarget.nodePos.pos);
      const path = [...atPos].reverse();
      return path.length > 0 ? path : [inspectorTarget];
    }
    if (inspectorTarget === 'text') {
      const hierarchy = getNodeHierarchy(editor);
      return [...hierarchy].reverse();
    }
    return [];
  }, [editor, inspectorTarget]);

  const handleSelectNode = React.useCallback(
    (entry: NodeClickedEvent) => {
      editor?.commands.setNodeSelection(entry.nodePos.pos);
      editor?.commands.focus();
    },
    [editor],
  );

  return (
    <InspectorContext.Provider value={{ inspectorTarget, pathToRoot }}>
      {children}
    </InspectorContext.Provider>
  );

  // if (inspectorTarget === 'text') {
  //   return (
  //     <div className="h-full flex flex-col min-h-0" ref={sidebarRef}>
  //       <div className="p-4 pb-0 shrink-0">
  //         <InspectorBreadcrumb
  //           pathFromRoot={pathFromRoot}
  //           onSelectNode={handleSelectNode}
  //           onSelectLayout={() => {
  //             editor?.commands.setTextSelection(0);
  //           }}
  //         />
  //       </div>
  //       <div className="flex-1 min-h-0 overflow-y-auto p-4">
  //         <InspectorText />
  //       </div>
  //     </div>
  //   );
  // }

  // if (inspectorTarget === 'doc') {
  // const { icon: Icon, label } = getNodeMeta('global');
  //
  // return (
  //   <div ref={sidebarRef} className="h-full flex flex-col min-h-0">
  //     <div className="p-4 pb-0 shrink-0 flex items-center gap-2">
  //       <Icon className="size-4 shrink-0 text-gray-11" aria-hidden />
  //
  //       <Text color="white" weight="bold" size="2">
  //         {label}
  //       </Text>
  //     </div>
  //
  //     <div className="flex-1 flex flex-col min-h-0 overflow-y-auto p-4">
  //       <InspectorGlobal showSectionIds={showGlobalSectionIds} />
  //     </div>
  //   </div>
  // );
  // }

  // return (
  //   <div className="h-full flex flex-col min-h-0" ref={sidebarRef}>
  //     <div className="p-4 pb-0 shrink-0">
  //       <InspectorBreadcrumb
  //         pathFromRoot={pathFromRoot}
  //         onSelectNode={handleSelectNode}
  //         onSelectLayout={() => {
  //           editor?.commands.setTextSelection(0);
  //         }}
  //       />
  //     </div>
  //     <div className="flex-1 min-h-0 overflow-y-auto p-4">
  //       <InspectorLocal
  //         key={inspectorTarget.nodePos.pos}
  //         data={inspectorTarget}
  //       />
  //     </div>
  //   </div>
  // );
}
