import { extensions } from '@tiptap/core';
import type { Attrs } from '@tiptap/pm/model';
import {
  NodeSelection,
  Plugin,
  PluginKey,
  TextSelection,
} from '@tiptap/pm/state';
import { useCurrentEditor, useEditorState } from '@tiptap/react';
import * as React from 'react';
import type { NodeClickedEvent } from '../../core';

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

export interface FocusedNode {
  nodeType: string;
  nodeAttrs: Attrs;
  nodePos: { pos: number; inside: number };
}

type InspectorTarget = 'doc' | 'text' | FocusedNode | null;

export interface RootProps {
  children: React.ReactNode;
}

export interface InspectorContextValue {
  target: InspectorTarget;
  pathFromRoot: FocusedNode[];

  focus: (event: Event) => void;
  blur: (event: Event) => void;
}

export const InspectorContext =
  React.createContext<InspectorContextValue | null>(null);

export function useInspector() {
  const context = React.useContext(InspectorContext);
  if (!context) {
    throw new Error(
      'useInspector can only be called from inside the InspectorContext. This probably means you forgot the <Inspector.Provider>',
    );
  }
  return context;
}

export function InspectorProvider({ children }: RootProps) {
  const { editor } = useCurrentEditor();

  const target = useEditorState({
    editor,
    selector(context): InspectorTarget {
      if (!context.editor) {
        return null;
      }

      if (!context.editor.isFocused) {
        return 'doc';
      }

      const { selection } = context.editor.state;

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
    if (typeof target === 'object' && target) {
      const atPos = getHierarchyAtPosition(editor, target.nodePos.pos);
      const path = [...atPos].reverse();
      return path.length > 0 ? path : [target];
    }
    if (target === 'text') {
      const hierarchy = getNodeHierarchy(editor);
      return [...hierarchy].reverse();
    }
    return [];
  }, [editor, target]);

  const editorDomFocused = React.useRef(false);
  const inspectorFocused = React.useRef(false);
  React.useEffect(() => {
    // This is the plugin that sets up the `focus` and `blur` event handlers for `editor.view.dom`, which then sets editor.isFocused.
    // We want isFocused to only be true if the focus is not in the editor and not in the inspector, therefore we override this to keep track of it ourselves.
    const defaultFocusPlugin = editor?.state.plugins.find(
      (plugin) => plugin.spec.key === extensions.focusEventsPluginKey,
    );
    if (editor && defaultFocusPlugin) {
      editor?.unregisterPlugin(extensions.focusEventsPluginKey);
      const pluginKey = new PluginKey('inspectorReactEmailFocusEvents');
      editor.registerPlugin(
        new Plugin({
          key: new PluginKey('inspectorReactEmailFocusEvents'),
          props: {
            handleDOMEvents: {
              focus: (view, event: Event) => {
                editorDomFocused.current = true;
                editor.isFocused = true;

                const transaction = editor.state.tr
                  .setMeta('focus', { event })
                  .setMeta('addToHistory', false);

                view.dispatch(transaction);

                return false;
              },
              blur: (view, event: Event) => {
                editorDomFocused.current = false;

                if (!inspectorFocused.current) {
                  editor.isFocused = false;

                  const transaction = editor.state.tr
                    .setMeta('blur', { event })
                    .setMeta('addToHistory', false);

                  view.dispatch(transaction);
                }

                return false;
              },
            },
          },
        }),
      );

      return () => {
        editor?.unregisterPlugin(pluginKey);
        editor?.registerPlugin(defaultFocusPlugin);
      };
    }
  }, [editor]);

  return (
    <InspectorContext.Provider
      value={{
        target,
        pathFromRoot,
        focus: (event: Event) => {
          inspectorFocused.current = true;
          if (editor) {
            editor.isFocused = true;

            const transaction = editor.state.tr
              .setMeta('focus', { event })
              .setMeta('addToHistory', false);

            editor.view.dispatch(transaction);
          }
        },
        blur: (event: Event) => {
          inspectorFocused.current = false;
          if (!editorDomFocused.current && editor) {
            editor.isFocused = false;

            const transaction = editor.state.tr
              .setMeta('blur', { event })
              .setMeta('addToHistory', false);

            editor.view.dispatch(transaction);
          }
        },
      }}
    >
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
