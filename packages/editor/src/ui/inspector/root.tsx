import { Slot } from '@radix-ui/react-slot';
import type { Attrs } from '@tiptap/pm/model';
import { NodeSelection, TextSelection } from '@tiptap/pm/state';
import { useCurrentEditor, useEditorState } from '@tiptap/react';
import * as React from 'react';
import type { NodeClickedEvent } from '../../core';
import {
  EditorFocusScope,
  EditorFocusScopeProvider,
} from '../editor-focus-scope';

const IGNORED_NODES = ['doc', 'text'];

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

  const { from } = selection;
  const resolvedPos = editor.state.doc.resolve(from);

  for (let depth = resolvedPos.depth; depth > 0; depth--) {
    const node = resolvedPos.node(depth);
    const pos = resolvedPos.before(depth);

    if (node && !IGNORED_NODES.includes(node.type.name)) {
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

export interface RootProps extends React.ComponentPropsWithRef<'aside'> {
  asChild?: boolean;
}

export interface InspectorContextValue {
  target: InspectorTarget;
  pathFromRoot: FocusedNode[];
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

export const InspectorRoot = React.forwardRef<HTMLElement, RootProps>(
  function InspectorRoot({ children, asChild, ...restProps }, forwardedRef) {
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

        if (
          selection.content().size > 0 &&
          selection instanceof TextSelection
        ) {
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
          const preferColumn =
            columnEntry && innermost.nodeType === 'paragraph';
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

    const editorRef = React.useRef(editor);
    editorRef.current = editor;

    const handleFocusWithin = React.useCallback((event: FocusEvent) => {
      const ed = editorRef.current;
      if (ed) {
        ed.isFocused = true;

        const transaction = ed.state.tr
          .setMeta('focus', { event })
          .setMeta('addToHistory', false);

        ed.view.dispatch(transaction);
      }
    }, []);

    const handleBlurWithin = React.useCallback((event: FocusEvent) => {
      const ed = editorRef.current;
      if (ed) {
        ed.isFocused = false;

        const transaction = ed.state.tr
          .setMeta('blur', { event })
          .setMeta('addToHistory', false);

        ed.view.dispatch(transaction);
      }
    }, []);

    const Component = asChild ? Slot : 'aside';

    return (
      <InspectorContext.Provider
        value={{
          target,
          pathFromRoot,
        }}
      >
        <EditorFocusScopeProvider
          onFocusIn={handleFocusWithin}
          onFocusOut={handleBlurWithin}
        >
          <EditorFocusScope>
            <Component ref={forwardedRef} {...restProps} tabIndex={-1}>
              {children}
            </Component>
          </EditorFocusScope>
        </EditorFocusScopeProvider>
      </InspectorContext.Provider>
    );
  },
);

