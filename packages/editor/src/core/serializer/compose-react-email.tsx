import { pretty, render, toPlainText } from '@react-email/components';
import type { Editor, JSONContent } from '@tiptap/core';
import type { MarkType, Schema } from '@tiptap/pm/model';
import { inlineCssToJs } from '../../utils/styles';
import { DefaultBaseTemplate } from './default-base-template';
import { EmailMark } from './email-mark';
import { EmailNode } from './email-node';
import type { SerializerPlugin } from './serializer-plugin';

const NODES_WITH_INCREMENTED_CHILD_DEPTH = new Set([
  'bulletList',
  'orderedList',
]);

/**
 * ProseMirror assigns each mark type a numeric `rank` at schema compile time; the public
 * `MarkType` typings omit it, but it exists at runtime (see prosemirror-model `MarkType.compile`).
 */
type MarkTypeWithRank = MarkType & { rank: number };

function getMarkRank(schema: Schema, markName: string): number {
  const markType = schema.marks[markName] as MarkTypeWithRank | undefined;
  return markType?.rank ?? Number.MAX_SAFE_INTEGER;
}

/** Sort marks by schema rank (Tiptap extension priority → ProseMirror order). */
function sortMarksBySchema(
  marks: NonNullable<JSONContent['marks']>,
  schema: Schema,
): NonNullable<JSONContent['marks']> {
  return [...marks].sort(
    (a, b) => getMarkRank(schema, b.type) - getMarkRank(schema, a.type),
  );
}

interface ComposeReactEmailResult {
  html: string;
  text: string;
}

export const composeReactEmail = async ({
  editor,
  preview,
}: {
  editor: Editor;
  preview?: string;
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
      if (!emailNode || !(emailNode instanceof EmailNode)) {
        return null;
      }

      const NodeComponent = emailNode.config.renderToReactEmail;
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
        for (const mark of sortMarksBySchema(node.marks, editor.schema)) {
          const emailMark = typeToExtensionMap[mark.type];
          if (emailMark instanceof EmailMark) {
            const MarkComponent = emailMark.config.renderToReactEmail;
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
