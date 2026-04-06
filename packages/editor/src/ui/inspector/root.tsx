import { Slot } from '@radix-ui/react-slot';
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
  registerFocusScope: (el: HTMLElement | null) => void;
  unregisterFocusScope: (el: HTMLElement | null) => void;
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

    const editorDomFocused = React.useRef(false);
    const inspectorFocused = React.useRef(false);
    React.useEffect(() => {
      const defaultFocusPlugin = editor?.state.plugins.find(
        (plugin) => plugin.spec.key === extensions.focusEventsPluginKey,
      );
      if (editor && defaultFocusPlugin) {
        editor?.unregisterPlugin(extensions.focusEventsPluginKey);
        const pluginKey = new PluginKey('inspectorReactEmailFocusEvents');
        editor.registerPlugin(
          new Plugin({
            key: pluginKey,
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

    const scopeRefs = React.useRef(new Set<HTMLElement>());

    // these useCallbacks are importnat to ensure that the same function references are used when adding/removing event listeners,
    // and so that the focus scopes are not registered/unregistered every re-render
    const handleFocus = React.useCallback(
      (event: FocusEvent) => {
        inspectorFocused.current = true;
        if (editor) {
          editor.isFocused = true;

          const transaction = editor.state.tr
            .setMeta('focus', { event })
            .setMeta('addToHistory', false);

          editor.view.dispatch(transaction);
        }
      },
      [editor],
    );

    const handleBlur = React.useCallback(
      (event: FocusEvent) => {
        const nextFocus = event.relatedTarget as Node | null;
        const stillInside = [...scopeRefs.current].some(
          (el) => nextFocus && el.contains(nextFocus),
        );
        if (!stillInside) {
          inspectorFocused.current = false;
          if (!editorDomFocused.current && editor) {
            editor.isFocused = false;

            const transaction = editor.state.tr
              .setMeta('blur', { event })
              .setMeta('addToHistory', false);

            editor.view.dispatch(transaction);
          }
        }
      },
      [editor],
    );

    const registerFocusScope = React.useCallback(
      (el: HTMLElement | null) => {
        if (!el) return;
        scopeRefs.current.add(el);
        el.addEventListener('focusin', handleFocus);
        el.addEventListener('focusout', handleBlur);
      },
      [handleFocus, handleBlur],
    );

    const unregisterFocusScope = React.useCallback(
      (el: HTMLElement | null) => {
        if (!el) return;
        scopeRefs.current.delete(el);
        el.removeEventListener('focusin', handleFocus);
        el.removeEventListener('focusout', handleBlur);
      },
      [handleFocus, handleBlur],
    );

    const Component = asChild ? Slot : 'aside';

    return (
      <InspectorContext.Provider
        value={{
          target,
          pathFromRoot,
          registerFocusScope,
          unregisterFocusScope,
        }}
      >
        <InspectorFocusScope>
          <Component ref={forwardedRef} {...restProps} tabIndex={-1}>
            {children}
          </Component>
        </InspectorFocusScope>
      </InspectorContext.Provider>
    );
  },
);

export interface FocusScopeProps {
  children: React.ReactNode;
}

export function InspectorFocusScope({ children }: FocusScopeProps) {
  const { registerFocusScope, unregisterFocusScope } = useInspector();

  const scopeElementRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (scopeElementRef.current) {
      registerFocusScope(scopeElementRef.current);
      return () => {
        unregisterFocusScope(scopeElementRef.current);
      };
    }
  }, [scopeElementRef.current, registerFocusScope, unregisterFocusScope]);

  return (
    <Slot
      ref={(element) => {
        scopeElementRef.current = element;
      }}
    >
      {children}
    </Slot>
  );
}
