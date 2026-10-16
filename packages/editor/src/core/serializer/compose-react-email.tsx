import type { Editor, Extensions, JSONContent } from '@tiptap/core';
import type { MarkType, Schema } from '@tiptap/pm/model';
import { Fragment } from 'react';
import { pretty, render, toPlainText } from 'react-email';
import { inlineCssToJs } from '../../utils/styles';
import type { ComposeContext } from './compose-context';
import { createComposeContext, toComposeContext } from './compose-context';
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
  /** Prettier-formatted HTML, suitable for displaying in a source-code view. */
  html: string;
  /** Plain-text version of the email body. */
  text: string;
  /**
   * Unformatted HTML as produced by `render()` before `pretty()` runs.
   * Use this when persisting or sending the email — Prettier indentation
   * can inflate the byte size by 5–10× on deeply-nested table layouts
   * (e.g. exports from Stripo, Mailchimp), and adds nothing for clients
   * that parse HTML to render it.
   */
  unformattedHtml: string;
}

interface ComposeSharedOptions {
  /** Preview text shown in inbox list views before the email is opened. */
  preview?: string;
  previewMode?: boolean;
  format?: boolean;
}

export interface ComposeFromContentOptions extends ComposeSharedOptions {
  /**
   * The document to serialize, as TipTap JSON. HTML strings are not
   * accepted — convert them first with `generateJSON` from `@tiptap/html`.
   */
  content: JSONContent;
  extensions: Extensions;
  editor?: never;
}

export interface ComposeFromEditorOptions extends ComposeSharedOptions {
  editor: Editor;
  content?: never;
  extensions?: never;
}

function resolveContext(
  options: ComposeFromContentOptions | ComposeFromEditorOptions,
): ComposeContext {
  if (options.editor) {
    if (options.content || options.extensions) {
      throw new Error(
        'composeReactEmail received both `editor` and `content`/`extensions` — pass either an editor, or content with extensions.',
      );
    }
    return toComposeContext(options.editor);
  }

  if (!options.content) {
    throw new Error(
      'composeReactEmail needs either `editor` or `content` + `extensions`.',
    );
  }

  return createComposeContext(options);
}

const EDITOR_ONLY_MEMBERS = new Set([
  'extensionManager',
  'state',
  'view',
  'commands',
  'chain',
  'can',
  'storage',
  'options',
  'isDestroyed',
  'isEditable',
  'isEmpty',
  'getJSON',
  'getHTML',
  'getText',
  'getAttributes',
]);

function withLegacyEditorAccess(
  context: ComposeContext,
  editor: Editor | undefined,
): ComposeContext {
  return new Proxy(context, {
    get(target, property, receiver) {
      if (property in target || typeof property === 'symbol') {
        return Reflect.get(target, property, receiver);
      }
      if (editor) {
        const member = editor[property as keyof Editor];
        return typeof member === 'function'
          ? (member as (...args: unknown[]) => unknown).bind(editor)
          : member;
      }
      if (EDITOR_ONLY_MEMBERS.has(property as string)) {
        throw new Error(
          `Composing from \`content\` runs without an Editor: \`${String(property)}\` is not available inside serializer plugins. Read the \`ComposeContext\` ({ doc, schema, extensions }) the serializer passes instead — e.g. resolve theming with \`getEmailTheming(context)\`.`,
        );
      }
      return undefined;
    },
  });
}

export function composeReactEmail(
  options: ComposeFromContentOptions,
): Promise<ComposeReactEmailResult>;
export function composeReactEmail(
  options: ComposeFromEditorOptions,
): Promise<ComposeReactEmailResult>;
export async function composeReactEmail(
  options: ComposeFromContentOptions | ComposeFromEditorOptions,
): Promise<ComposeReactEmailResult> {
  const { preview, previewMode = false, format = true } = options;
  const context = withLegacyEditorAccess(
    resolveContext(options),
    options.editor,
  );
  const { doc, schema, extensions } = context;

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

  function parseContent(_content: JSONContent[] | undefined, depth = 0) {
    let content = _content;
    if (!content) {
      return;
    }

    // Drop empty paragraphs that exist only as editing affordances (the
    // TrailingNode filler after a trailing table/section, the schema filler
    // in an empty cell); blank lines between paragraphs still render.
    content = content.filter((node, index, nodes) => {
      if (node.type !== 'paragraph' || node.content?.length) {
        return true;
      }
      if (index !== nodes.length - 1) {
        return true;
      }
      const previousNode = nodes[index - 1];
      return previousNode ? previousNode.type === 'paragraph' : false;
    });

    return content.map((node: JSONContent, index: number) => {
      const style = serializerPlugin?.getNodeStyles(node, depth, context) ?? {};

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
        for (const mark of sortMarksBySchema(node.marks, schema)) {
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
                context,
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

      return <Fragment key={index}>{renderedNode}</Fragment>;
    });
  }

  const BaseTemplate = serializerPlugin?.BaseTemplate ?? DefaultBaseTemplate;

  const parsedContent = parseContent(doc.content);
  const unformattedHtml = await render(
    <BaseTemplate
      previewText={preview}
      context={context}
      editor={options.editor ?? context}
      previewMode={previewMode}
    >
      {parsedContent}
    </BaseTemplate>,
  );

  const [prettyHtml, text] = await Promise.all([
    format ? pretty(unformattedHtml) : unformattedHtml,
    toPlainText(unformattedHtml),
  ]);

  return { html: prettyHtml, text, unformattedHtml };
}
