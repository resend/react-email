import { pretty, render, toPlainText } from '@react-email/components';
import type { Editor, JSONContent } from '@tiptap/core';
import { inlineCssToJs } from '../../utils/styles';
import { DefaultBaseTemplate } from './default-base-template';
import {
  EmailMark,
  type RendererComponent as EmailMarkRenderer,
  type SerializedMark,
} from './email-mark';
import { EmailNode } from './email-node';
import type { SerializerPlugin } from './serializer-plugin';

const NODES_WITH_INCREMENTED_CHILD_DEPTH = new Set([
  'bulletList',
  'orderedList',
]);

interface ComposeReactEmailResult {
  html: string;
  text: string;
}

export const composeReactEmail = async ({
  editor,
  preview,
}: {
  editor: Editor;
  preview: string | null;
}): Promise<ComposeReactEmailResult> => {
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

  const emailNodeComponentRegistry = Object.fromEntries(
    extensions
      .filter((ext): ext is EmailNode => ext instanceof EmailNode)
      .map((extension) => [
        extension.name,
        extension.config.renderToReactEmail,
      ]),
  );

  const emailMarkComponentRegistry = Object.fromEntries(
    extensions
      .filter((ext): ext is EmailMark => ext instanceof EmailMark)
      .map((extension) => [
        extension.name,
        extension.config.renderToReactEmail,
      ]),
  ) as Record<string, EmailMarkRenderer>;

  function renderMark(
    mark: SerializedMark,
    node: JSONContent,
    children: React.ReactNode,
    depth: number,
  ) {
    const markStyle =
      serializerPlugin?.getNodeStyles(
        {
          type: mark.type,
          attrs: mark.attrs ?? {},
        },
        depth,
        editor,
      ) ?? {};

    const markRenderer = emailMarkComponentRegistry[mark.type];
    if (markRenderer) {
      return markRenderer({
        mark,
        node,
        style: markStyle,
        children,
      });
    }

    return children;
  }

  function parseContent(content: JSONContent[] | undefined, depth = 0) {
    if (!content) {
      return;
    }

    return content.map((node: JSONContent, index: number) => {
      const style = serializerPlugin?.getNodeStyles(node, depth, editor) ?? {};

      const inlineStyles = inlineCssToJs(node.attrs?.style);

      if (node.type && emailNodeComponentRegistry[node.type]) {
        const Component = emailNodeComponentRegistry[node.type];
        const childDepth = NODES_WITH_INCREMENTED_CHILD_DEPTH.has(node.type)
          ? depth + 1
          : depth;

        let children: React.ReactNode = node.text
          ? node.text
          : parseContent(node.content, childDepth);
        if (node.marks) {
          for (const mark of node.marks) {
            children = renderMark(mark, node, children, depth);
          }
        }

        return (
          <Component
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
          >
            {children}
          </Component>
        );
      }

      return null;
    });
  }

  const BaseTemplate = serializerPlugin?.BaseTemplate ?? DefaultBaseTemplate;

  const parsedContent = parseContent(data.content);
  const unformattedHtml = await render(
    <BaseTemplate previewText={preview} editor={editor}>
      {parsedContent}
    </BaseTemplate>,
  );

  const [prettyHtml, text] = await Promise.all([
    pretty(unformattedHtml),
    toPlainText(unformattedHtml),
  ]);

  return { html: prettyHtml, text };
};
