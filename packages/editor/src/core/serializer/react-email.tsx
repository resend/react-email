import { pretty, render, toPlainText } from '@react-email/components';
import {
  type AnyExtension,
  type Editor,
  Extension,
  type JSONContent,
  type MarkConfig,
  type NodeConfig,
} from '@tiptap/core';
import { inlineCssToJs } from '../../utils/styles';
import { DefaultBaseTemplate } from './default-base-template';
import type { SerializerPlugin } from './serializer-plugin';

export type NodeRendererComponent = (props: {
  node: JSONContent;
  style: React.CSSProperties;
  children?: React.ReactNode;
  extension: AnyExtension;
}) => React.ReactNode;

export type SerializedMark = NonNullable<JSONContent['marks']>[number];

export type MarkRendererComponent = (props: {
  mark: SerializedMark;
  node: JSONContent;
  style: React.CSSProperties;
  children?: React.ReactNode;
  extension: AnyExtension;
}) => React.ReactNode;

declare module '@tiptap/core' {
  interface NodeConfig<Options, Storage> {
    renderToReactEmail?: NodeRendererComponent;
  }

  interface MarkConfig<Options, Storage> {
    renderToReactEmail?: MarkRendererComponent;
  }

  interface Editor {
    getReactEmail(options?: {
      preview?: string;
    }): Promise<{ html: string; text: string }>;
  }
}

const NODES_WITH_INCREMENTED_CHILD_DEPTH = new Set([
  'bulletList',
  'orderedList',
]);

function serializeToReactEmail(
  editor: Editor,
  preview?: string,
): Promise<{ html: string; text: string }> {
  const data = editor.getJSON();
  const extensions = editor.extensionManager.extensions;

  const serializerPlugin = extensions
    .map(
      (ext) =>
        (ext as { options?: { serializerPlugin?: SerializerPlugin } }).options
          ?.serializerPlugin,
    )
    .filter((p) => Boolean(p))
    .at(-1);

  const typeToExtensionMap = Object.fromEntries(
    extensions.map((extension) => [extension.name, extension]),
  );

  function parseContent(content: JSONContent[] | undefined, depth = 0) {
    if (!content) {
      return;
    }

    return content.map((node: JSONContent, index: number) => {
      const style = serializerPlugin?.getNodeStyles(node, depth, editor) ?? {};

      const inlineStyles = inlineCssToJs(node.attrs?.style);

      if (!node.type) {
        return null;
      }

      const emailNode = typeToExtensionMap[node.type];
      const nodeRenderer = emailNode?.config?.renderToReactEmail as
        | NodeRendererComponent
        | undefined;
      if (!emailNode || !nodeRenderer) {
        return null;
      }

      const NodeComponent = nodeRenderer;
      const childDepth = NODES_WITH_INCREMENTED_CHILD_DEPTH.has(node.type)
        ? depth + 1
        : depth;

      let renderedNode: React.ReactNode = node.text ? (
        node.text
      ) : (
        <NodeComponent
          key={index}
          node={
            node.type === 'table' && inlineStyles.width && !node.attrs?.width
              ? {
                  ...node,
                  attrs: { ...node.attrs, width: inlineStyles.width },
                }
              : node
          }
          style={style}
          extension={emailNode}
        >
          {parseContent(node.content, childDepth)}
        </NodeComponent>
      );
      if (node.marks) {
        for (const mark of node.marks) {
          const emailMark = typeToExtensionMap[mark.type];
          const markRenderer = emailMark?.config?.renderToReactEmail as
            | MarkRendererComponent
            | undefined;
          if (emailMark && markRenderer) {
            const MarkComponent = markRenderer;
            const markStyle =
              serializerPlugin?.getNodeStyles(
                {
                  type: mark.type,
                  attrs: mark.attrs ?? {},
                },
                depth,
                editor,
              ) ?? {};
            renderedNode = (
              <MarkComponent
                mark={mark}
                node={node}
                style={markStyle}
                extension={emailMark}
              >
                {renderedNode}
              </MarkComponent>
            );
          }
        }
      }

      return renderedNode;
    });
  }

  const BaseTemplate = serializerPlugin?.BaseTemplate ?? DefaultBaseTemplate;

  const parsedContent = parseContent(data.content);

  return render(
    <BaseTemplate previewText={preview} editor={editor}>
      {parsedContent}
    </BaseTemplate>,
  ).then(async (unformattedHtml) => {
    const [prettyHtml, text] = await Promise.all([
      pretty(unformattedHtml),
      toPlainText(unformattedHtml),
    ]);
    return { html: prettyHtml, text };
  });
}

export const ReactEmail = Extension.create({
  name: 'reactEmail',

  onBeforeCreate() {
    this.editor.getReactEmail = (options) => {
      return serializeToReactEmail(this.editor, options?.preview);
    };
  },

  onDestroy() {
    delete (this.editor as Partial<Pick<Editor, 'getReactEmail'>>)
      .getReactEmail;
  },
});
