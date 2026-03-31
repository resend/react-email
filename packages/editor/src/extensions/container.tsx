import { Container as ReactEmailContainer } from '@react-email/components';
import { mergeAttributes } from '@tiptap/core';
import type { Node as PmNode } from '@tiptap/pm/model';
import { type EditorState, Plugin, PluginKey } from '@tiptap/pm/state';
import { EmailNode } from '../core/serializer/email-node';
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
  console.log('warpping everything in container');
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
    return [{ tag: 'div[data-type="container"]' }];
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
    return [
      new Plugin({
        key: new PluginKey('containerEnforcer'),
        // view(editorView) {
        //   debugger;
        //   if (!hasContainerNode(editorView.state.doc)) {
        //     const tr = wrapInContainer(editorView.state);
        //     editorView.dispatch(tr);
        //   }
        //   return {};
        // },
        appendTransaction(transactions, _oldState, newState) {
          const isRemoteChange = transactions.some((tr) => tr.getMeta('y-sync$'));

          if (isRemoteChange) {
            return null;
          }
          debugger;

          if (hasContainerNode(newState.doc)) {
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
