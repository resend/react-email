import { mergeAttributes } from '@tiptap/core';
import { type Node as PmNode, Slice } from '@tiptap/pm/model';
import {
  type EditorState,
  Plugin,
  PluginKey,
  Selection,
  TextSelection,
} from '@tiptap/pm/state';
import type { Mappable } from '@tiptap/pm/transform';
import { Container as ReactEmailContainer } from 'react-email';
import { EmailNode } from '../core/serializer/email-node';
import { hasCollaborationExtension } from '../utils/is-collaboration';
import { inlineCssToJs } from '../utils/styles';

/** A container's whole content, re-selected after every change. */
export class ContainerSelection extends Selection {
  static create(doc: PmNode, containerPos: number): ContainerSelection {
    const $start = doc.resolve(containerPos + 1);
    return new ContainerSelection($start, doc.resolve($start.end()));
  }

  map(doc: PmNode, mapping: Mappable): Selection {
    const container = mapping.mapResult(this.$from.before());
    if (
      !container.deleted &&
      doc.nodeAt(container.pos)?.type === this.$from.parent.type
    ) {
      return ContainerSelection.create(doc, container.pos);
    }
    return TextSelection.between(
      doc.resolve(mapping.map(this.anchor)),
      doc.resolve(mapping.map(this.head)),
    );
  }

  // Closed blocks, so the clipboard carries no container wrapper.
  content(): Slice {
    return new Slice(this.$from.parent.content, 0, 0);
  }

  eq(other: Selection): boolean {
    return (
      other instanceof ContainerSelection &&
      other.from === this.from &&
      other.to === this.to
    );
  }

  toJSON(): { type: string; anchor: number; head: number } {
    return TextSelection.between(this.$anchor, this.$head).toJSON();
  }
}

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

  addKeyboardShortcuts() {
    return {
      // The body, not the document. A code block selects itself first.
      'Mod-a': ({ editor }) => {
        const { state } = editor;
        const { $from, from, to } = state.selection;
        for (let depth = $from.depth; depth > 0; depth--) {
          const start = $from.start(depth);
          const end = $from.end(depth);
          const selected = from === start && to === end;
          if ($from.node(depth).type !== this.type) {
            if ($from.node(depth).type.spec.code && !selected) {
              return false;
            }
            continue;
          }
          if (!selected) {
            editor.view.dispatch(
              state.tr.setSelection(
                ContainerSelection.create(state.doc, $from.before(depth)),
              ),
            );
          }
          return true;
        }
        return false;
      },
      // Clear the selected body; the default appends a paragraph after it.
      Enter: ({ editor }) =>
        editor.state.selection instanceof ContainerSelection &&
        editor.commands.deleteSelection(),
    };
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
