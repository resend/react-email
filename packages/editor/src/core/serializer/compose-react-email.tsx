import { Link, pretty, render, toPlainText } from '@react-email/components';
import type { Editor, JSONContent } from '@tiptap/core';
import * as React from 'react';
import { getTextAlignment } from '../../utils/get-text-alignment';
import { inlineCssToJs } from '../../utils/styles';
import { DefaultBaseTemplate } from './default-base-template';
import { EmailNode } from './email-node';
import type { SerializerPlugin } from './serializer-plugin';

type Mark = {
  type: string;
  attrs?: Record<string, string | null | undefined>;
};

const MARK_ORDER: Record<string, number> = {
  preservedStyle: 0,
  italic: 1,
  strike: 2,
  underline: 3,
  link: 4,
  bold: 5,
  code: 6,
};

function getOrderedMarks(marks: Mark[] | undefined) {
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

type Source = 'broadcast' | 'template';

const getVariableText = ({
  node,
  source,
}: {
  node: JSONContent;
  source: Source;
}): React.ReactNode => {
  if (source === 'broadcast') {
    return `${node.attrs!.id.replace('}}}', '')}|${node.attrs!.fallback}}}}`;
  }

  return node.attrs!.id;
};

export const composeReactEmail = async ({
  editor,
  preview,
  source = 'broadcast',
}: {
  editor: Editor;
  preview: string | null;
  source?: Source;
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
      .filter(
        (ext): ext is EmailNode & { config: { renderToReactEmail: unknown } } =>
          ext instanceof EmailNode ||
          ('config' in ext &&
            ext.config != null &&
            'renderToReactEmail' in ext.config),
      )
      .map((extension) => [
        extension.name,
        extension.config.renderToReactEmail,
      ]),
  );

  function parseContent(content: JSONContent[] | undefined, depth = 0) {
    if (!content) {
      return;
    }

    return content.map((node: JSONContent, index: number) => {
      const style = serializerPlugin?.getNodeStyles(node, depth, editor) ?? {};

      const inlineStyles = inlineCssToJs(node.attrs?.style);
      const textAlign = getTextAlignment(
        node.attrs?.align || node.attrs?.alignment,
      );
      const className = node.attrs?.class || undefined;

      if (node.type && emailNodeComponentRegistry[node.type]) {
        const Component = emailNodeComponentRegistry[node.type];

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
            {parseContent(node.content)}
          </Component>
        );
      }

      switch (node.type) {
        case 'paragraph': {
          const isEmpty = !node.content || node.content.length === 0;

          return (
            <p
              key={index}
              className={className}
              style={
                {
                  ...style,
                  ...inlineStyles,
                  ...textAlign,
                } as React.CSSProperties
              }
            >
              {isEmpty ? (
                /* Add <br/> inside empty paragraph to make sure what users sees in the preview is the space that will be render in the email */
                <br />
              ) : (
                parseContent(node.content)
              )}
            </p>
          );
        }

        case 'text': {
          let wrappedText: React.ReactNode = node.text;

          const textMarks = getOrderedMarks(node.marks);
          textMarks.forEach((mark: Mark) => {
            const markStyle =
              serializerPlugin?.getNodeStyles(
                { type: mark.type, attrs: {} },
                depth,
                editor,
              ) ?? {};
            switch (mark.type) {
              case 'bold':
                wrappedText = <strong style={markStyle}>{wrappedText}</strong>;
                break;
              case 'italic':
                wrappedText = <em style={markStyle}>{wrappedText}</em>;
                break;
              case 'underline':
                wrappedText = <u style={markStyle}>{wrappedText}</u>;
                break;
              case 'strike':
                wrappedText = <s style={markStyle}>{wrappedText}</s>;
                break;
              case 'code':
                wrappedText = (
                  <code style={{ ...markStyle, ...inlineStyles }}>
                    {wrappedText}
                  </code>
                );
                break;
              case 'link': {
                const linkMarkStyle = mark.attrs?.style
                  ? inlineCssToJs(mark.attrs.style)
                  : {};
                wrappedText = (
                  <Link
                    href={mark.attrs?.href ?? ''}
                    rel={mark.attrs?.rel ?? undefined}
                    style={{
                      ...markStyle,
                      ...linkMarkStyle,
                    }}
                    target={mark.attrs?.target ?? undefined}
                    {...(mark.attrs?.['ses:no-track'] && {
                      'ses:no-track': mark.attrs['ses:no-track'],
                    })}
                  >
                    {wrappedText}
                  </Link>
                );
                break;
              }
              case 'preservedStyle': {
                const preservedStyles = mark.attrs?.style
                  ? inlineCssToJs(mark.attrs.style)
                  : {};
                wrappedText = (
                  <span style={preservedStyles}>{wrappedText}</span>
                );
                break;
              }
            }
          });

          const textAttributes = node.marks?.find(
            (mark: Mark) => mark.type === 'textStyle',
          )?.attrs;

          return (
            <span key={index} style={{ ...textAttributes, ...style }}>
              {wrappedText}
            </span>
          );
        }

        case 'variable': {
          let variableText = getVariableText({
            node,
            source,
          });

          if (node.marks && node.marks.length > 0) {
            const variableMarks = getOrderedMarks(node.marks);
            variableMarks.forEach((mark: Mark) => {
              const markStyle =
                serializerPlugin?.getNodeStyles(
                  { type: mark.type, attrs: {} },
                  depth,
                  editor,
                ) ?? {};
              switch (mark.type) {
                case 'bold':
                  variableText = (
                    <strong style={markStyle}>{variableText}</strong>
                  );
                  break;
                case 'italic':
                  variableText = <em style={markStyle}>{variableText}</em>;
                  break;
                case 'underline':
                  variableText = <u style={markStyle}>{variableText}</u>;
                  break;
                case 'strike':
                  variableText = <s style={markStyle}>{variableText}</s>;
                  break;
                case 'code':
                  variableText = (
                    <code style={{ ...markStyle, ...inlineStyles }}>
                      {variableText}
                    </code>
                  );
                  break;
                case 'link': {
                  const variableLinkMarkStyle = mark.attrs?.style
                    ? inlineCssToJs(mark.attrs.style)
                    : {};
                  variableText = (
                    <Link
                      href={mark.attrs?.href ?? ''}
                      rel={mark.attrs?.rel ?? undefined}
                      style={{
                        ...markStyle,
                        ...variableLinkMarkStyle,
                      }}
                      target={mark.attrs?.target ?? undefined}
                      {...(mark.attrs?.['ses:no-track'] && {
                        'ses:no-track': mark.attrs['ses:no-track'],
                      })}
                    >
                      {variableText}
                    </Link>
                  );
                  break;
                }
                case 'preservedStyle': {
                  const preservedStyles = mark.attrs?.style
                    ? inlineCssToJs(mark.attrs.style)
                    : {};
                  variableText = (
                    <span style={preservedStyles}>{variableText}</span>
                  );
                  break;
                }
              }
            });
          }

          return <React.Fragment key={index}>{variableText}</React.Fragment>;
        }

        case 'bulletList': {
          return (
            <ul
              key={index}
              className={className}
              style={{
                ...style,
                ...inlineStyles,
              }}
            >
              {parseContent(node.content, depth + 1)}
            </ul>
          );
        }

        case 'orderedList': {
          return (
            <ol
              key={index}
              className={className}
              start={node.attrs?.start}
              style={{
                ...style,
                ...inlineStyles,
              }}
            >
              {parseContent(node.content, depth + 1)}
            </ol>
          );
        }

        case 'listItem':
          return (
            <li
              key={index}
              className={className}
              style={
                {
                  ...style,
                  ...inlineStyles,
                  ...textAlign,
                } as React.CSSProperties
              }
            >
              {parseContent(node.content, depth)}
            </li>
          );

        case 'blockquote':
          return (
            <blockquote
              key={index}
              className={className}
              style={
                {
                  ...style,
                  ...inlineStyles,
                  ...textAlign,
                } as React.CSSProperties
              }
            >
              {parseContent(node.content)}
            </blockquote>
          );

        case 'hardBreak':
          return <br key={index} />;

        case 'loop': {
          const list = node.attrs?.list ?? '';
          if (!list.trim()) {
            return null;
          }

          return (
            <React.Fragment key={index}>
              {`{{{#each ${list}}}}`}
              {parseContent(node.content)}
              {'{{{/each}}}'}
            </React.Fragment>
          );
        }
        case 'conditional': {
          const test = node.attrs?.test ?? '';
          if (!test.trim()) {
            return null;
          }

          const negate = Boolean(node.attrs?.negate);
          const open = negate ? `{{{#unless ${test}}}}` : `{{{#if ${test}}}}`;
          const close = negate ? '{{{/unless}}}' : '{{{/if}}}';
          return (
            <React.Fragment key={index}>
              {open}
              {parseContent(node.content)}
              {close}
            </React.Fragment>
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
