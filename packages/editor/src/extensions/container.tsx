import { mergeAttributes } from '@tiptap/core';
import type { Node as PmNode } from '@tiptap/pm/model';
import { type EditorState, Plugin, PluginKey } from '@tiptap/pm/state';
import { Container as ReactEmailContainer } from 'react-email';
import { EmailNode } from '../core/serializer/email-node';
import { hasCollaborationExtension } from '../utils/is-collaboration';
import { inlineCssToJs } from '../utils/styles';

function hasContainerNode(doc: PmNode): boolean {
  for (let i = 0; i < doc.childCount; i++) {
    if (doc.child(i).type.name === 'container') {
      return true;
    }
  }
  return false;
}

function wrapInContainer(state: EditorState) {
  const { doc } = state;
  const containerType = state.schema.nodes.container;

  const contentNodes: PmNode[] = [];
  const globalContentNodes: PmNode[] = [];

  doc.forEach((node) => {
    if (node.type.name === 'globalContent') {
      globalContentNodes.push(node);
    } else {
      contentNodes.push(node);
    }
  });

  const containerContent =
    contentNodes.length > 0
      ? contentNodes
      : [state.schema.nodes.paragraph.create()];

  const containerNode = containerType.create(null, containerContent);

  const newDocContent = [...globalContentNodes, containerNode];

  const tr = state.tr;
  tr.replaceWith(0, doc.content.size, newDocContent);
  tr.setMeta('addToHistory', false);

  return tr;
}

export interface ContainerOptions {
  HTMLAttributes: Record<string, unknown>;
}

export const COLLABORATIVE_WRAP_DEBOUNCE_MS = 500;

function isBareEmptyDoc(doc: PmNode): boolean {
  return (
    doc.childCount === 1 &&
    doc.firstChild !== null &&
    doc.firstChild.type.name === 'paragraph' &&
    doc.firstChild.childCount === 0
  );
}

export const Container = EmailNode.create<ContainerOptions>({
  name: 'container',

  group: 'block',

  content: 'block+',

  defining: true,
  isolating: true,
  selectable: false,
  draggable: false,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      { tag: 'div[data-type="container"]' },
      {
        tag: 'table[role="presentation"]',
        priority: 60,
        getAttrs: (node) => {
          if (typeof node === 'string') {
            return false;
          }
          const table = node as HTMLElement;
          if (!table.style.maxWidth) {
            return false;
          }
          const td = table.querySelector(
            ':scope > tbody > tr:only-child > td:only-child',
          );
          if (!td) {
            return false;
          }
          return null;
        },
        contentElement: (node) =>
          node.querySelector(':scope > tbody > tr > td') as HTMLElement,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        { 'data-type': 'container', class: 'node-container' },
        this.options.HTMLAttributes,
        HTMLAttributes,
      ),
      0,
    ];
  },

  addProseMirrorPlugins() {
    const isCollaborative = hasCollaborationExtension(
      this.editor.extensionManager.extensions,
    );

    if (!isCollaborative) {
      return [
        new Plugin({
          key: new PluginKey('containerEnforcer'),
          view: (editorView) => {
            if (!hasContainerNode(editorView.state.doc)) {
              editorView.dispatch(wrapInContainer(editorView.state));
            }
            return {};
          },
          appendTransaction(_transactions, oldState, newState) {
            if (hasContainerNode(newState.doc)) {
              return null;
            }
            if (newState.doc.eq(oldState.doc)) {
              return null;
            }
            return wrapInContainer(newState);
          },
        }),
      ];
    }

    // In collaborative mode the initial document streams in through several
    // Yjs/Liveblocks sync transactions, so the doc can be transiently
    // containerless mid-sync. Wrapping that transient synchronously (what
    // appendTransaction used to do here) merges a spurious container into
    // the shared Yjs doc permanently, duplicating containers on every
    // editor open. Instead, wrapping is debounced and armed only by a real
    // document change: no-op sync transactions neither arm nor delay it,
    // and the bare empty placeholder doc (the shape mid-sync transients
    // have) is never wrapped — an empty doc is wrapped after the first
    // real edit instead.
    //
    // This is still a heuristic and can fail: a stall longer than the
    // debounce around a containerless, content-bearing transient still
    // wraps too early, and two clients can wrap a legitimately
    // containerless doc at the same time (CRDT merge keeps both). The real
    // fix needs the collaboration provider's sync status, which this
    // package cannot see — consumers should gate editor mount on sync
    // completion and seed rooms with a container so this plugin never has
    // work to do.
    let wrapTimer: ReturnType<typeof setTimeout> | null = null;
    return [
      new Plugin({
        key: new PluginKey('containerEnforcer'),
        view: (editorView) => {
          const cancelPendingWrap = () => {
            if (wrapTimer !== null) {
              clearTimeout(wrapTimer);
              wrapTimer = null;
            }
          };
          const scheduleWrap = () => {
            cancelPendingWrap();
            wrapTimer = setTimeout(() => {
              wrapTimer = null;
              if (editorView.isDestroyed) {
                return;
              }
              if (editorView.composing) {
                scheduleWrap();
                return;
              }
              const state = editorView.state;
              if (hasContainerNode(state.doc)) {
                return;
              }
              if (isBareEmptyDoc(state.doc)) {
                return;
              }
              editorView.dispatch(wrapInContainer(state));
            }, COLLABORATIVE_WRAP_DEBOUNCE_MS);
          };

          return {
            update: (view, prevState) => {
              if (view.state.doc.eq(prevState.doc)) {
                return;
              }
              if (hasContainerNode(view.state.doc)) {
                cancelPendingWrap();
                return;
              }
              scheduleWrap();
            },
          };
        },
      }),
    ];
  },

  renderToReactEmail({ children, node, style }) {
    const inlineStyles = inlineCssToJs(node.attrs?.style);

    return (
      <ReactEmailContainer
        className={node.attrs?.class || undefined}
        align={
          ((style as Record<string, unknown>).align as
            | 'left'
            | 'center'
            | 'right') || 'center'
        }
        style={{
          ...style,
          ...inlineStyles,
          width: '100%',
          maxWidth: style?.width ?? style?.maxWidth,
        }}
      >
        {children}
      </ReactEmailContainer>
    );
  },
});
