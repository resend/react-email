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

const MARK_ORDER: Record<string, number> = {
  preservedStyle: 0,
  italic: 1,
  strike: 2,
  underline: 3,
  link: 4,
  bold: 5,
  code: 6,
};

const NODES_WITH_INCREMENTED_CHILD_DEPTH = new Set(['bulletList', 'orderedList']);

function getOrderedMarks(marks: SerializedMark[] | undefined) {
  if (!marks) {
    return [];
  }

  return [...marks].sort(
    (a, b) =>
      (MARK_ORDER[a.type] ?? Number.MAX_SAFE_INTEGER) -
      (MARK_ORDER[b.type] ?? Number.MAX_SAFE_INTEGER),
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
            {parseContent(node.content, childDepth)}
          </Component>
        );
      }

      switch (node.type) {
        case 'text': {
          let wrappedText: React.ReactNode = node.text;

          const textMarks = getOrderedMarks(node.marks);
          textMarks.forEach((mark: SerializedMark) => {
            wrappedText = renderMark(mark, node, wrappedText, depth);
          });

          const textAttributes = node.marks?.find(
            (mark: SerializedMark) => mark.type === 'textStyle',
          )?.attrs;

          return (
            <span key={index} style={{ ...textAttributes, ...style }}>
              {wrappedText}
            </span>
          );
        }

        default:
          return null;
      }
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
