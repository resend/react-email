import { Container as ReactEmailContainer } from '@react-email/components';
import { mergeAttributes } from '@tiptap/core';
import type { Node as PmNode } from '@tiptap/pm/model';
import { type EditorState, Plugin, PluginKey } from '@tiptap/pm/state';
import { EmailNode } from '../core/serializer/email-node';
import { hasCollaborationExtension } from '../utils/is-collaboration';
import { inlineCssToJs } from '../utils/styles';

function hasContainerNode(doc: PmNode): boolean {
  let found = false;
  doc.forEach((node) => {
    if (node.type.name === 'container') {
      found = true;
    }
  });
  return found;
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
    return [
      new Plugin({
        key: new PluginKey('containerEnforcer'),
        view: isCollaborative
          ? undefined
          : (editorView) => {
              if (!hasContainerNode(editorView.state.doc)) {
                const tr = wrapInContainer(editorView.state);
                editorView.dispatch(tr);
              }
              return {};
            },
        appendTransaction(_transactions, oldState, newState) {
          if (hasContainerNode(newState.doc)) {
            return null;
          }

          // This is meant to deal with the weird behavior from Liveblocks's
          // extension. It repeatedly creates transactions that do basically no
          // changes before the actual content of the room arrives. And, if we
          // don't do this, this plugin wraps the initial document from TipTap
          // (an empty paragraph) with a container, and this is then kept in
          // the TipTap, effectively duplicating containers every time someone
          // opens the editor.
          //
          // This check is, at the end of the day, a heuristic and therefore it
          // might fail. It's just not the best solution, the best solution
          // would be for us to either not receive any content update until the
          // contents are actually being set, or to be able to distinguish
          // between "fake" transactions and "real" transactions in the
          // Liveblocks extension. But, for now, this is what we have.
          //
          // One such case where this fails is if the email's contents are
          // literally the default contents from TipTap, meaning an empty
          // paragraph, it won't wrap, and we have a test for this that's being
          // skipped in container.spec.tsx
          if (newState.doc.eq(oldState.doc)) {
            return null;
          }

          return wrapInContainer(newState);
        },
      }),
    ];
  },

  renderToReactEmail({ children, node, style }) {
    const inlineStyles = inlineCssToJs(node.attrs?.style);

    return (
      <ReactEmailContainer
        className={node.attrs?.class || undefined}
        align={node.attrs?.align ?? node.attrs?.alignment ?? 'center'}
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
