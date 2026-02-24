import { Link, render } from '@react-email/components';
import type { AnyExtension, JSONContent } from '@tiptap/core';
import * as React from 'react';
import { getTextAlignment } from '../utils/get-text-alignment';
import { expandShorthandProperties, inlineCssToJs } from '../utils/styles';
import type { CssJs } from '../utils/types';
import { BaseTemplate } from './base-template';
import { EmailNode } from './email-node';

type Mark = {
  type: string;
  attrs?: Record<string, string | null | undefined>;
};

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

/**
 * Resolves conflicts between reset styles and inline styles by expanding
 * shorthand properties (margin, padding) to longhand before merging.
 * This prevents shorthand properties from overriding specific longhand properties.
 *
 * @param resetStyles - Base reset styles that may contain shorthand properties
 * @param inlineStyles - Inline styles that should override reset styles
 * @returns Merged styles with inline styles taking precedence
 */
export function resolveConflictingStyles(
  resetStyles: CssJs['reset'],
  inlineStyles: Record<string, string>,
) {
  const expandedResetStyles = expandShorthandProperties(
    resetStyles as Record<string, string>,
  );
  const expandedInlineStyles = expandShorthandProperties(inlineStyles);

  return {
    ...expandedResetStyles,
    ...expandedInlineStyles,
  };
}

export const composeReactEmail = async ({
  data,
  styles,
  preview,
  css,
  extensions,
  source = 'broadcast',
}: {
  data: JSONContent;
  styles: CssJs;
  preview: string | null;
  css?: string;
  extensions: AnyExtension[];
  source?: Source;
}): Promise<ComposeReactEmailResult> => {
  if (!data || !styles) {
    return { html: '', text: '' };
  }

  const emailNodeComponentRegistry = Object.fromEntries(
    extensions
      .filter(
        (ext): ext is EmailNode =>
          ext instanceof EmailNode || 'renderToReactEmail' in ext.config,
      )
      .map((extension) => {
        return [extension.name, extension.config.renderToReactEmail];
      }),
  );

  // Declared inside the function to use style as a global variable
  function parseContent(content: JSONContent[] | undefined, depth = 0) {
    if (!content) {
      return;
    }

    return content.map((node: JSONContent, index: number) => {
      const inlineStyles = inlineCssToJs(node.attrs?.style);
      const textAlign = getTextAlignment(
        node.attrs?.align || node.attrs?.alignment,
      );
      const className = node.attrs?.class || undefined;

      if (node.type && emailNodeComponentRegistry[node.type]) {
        const Component = emailNodeComponentRegistry[node.type]!;

        return (
          <Component key={index} node={node} styles={styles}>
            {parseContent(node.content)}
          </Component>
        );
      }

      switch (node.type) {
        case 'paragraph': {
          const stylesParagraph =
            depth > 0 ? styles.listParagraph : styles.paragraph;

          const isEmpty = !node.content || node.content.length === 0;

          return (
            <p
              key={index}
              className={className}
              style={
                {
                  ...styles.reset,
                  ...stylesParagraph,
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
          const style = node.marks?.find(
            (mark: Mark) => mark.type === 'textStyle',
          )?.attrs;

          let wrappedText: React.ReactNode = node.text;

          // Reverse the marks to apply them in the correct order
          node.marks?.reverse().forEach((mark: Mark) => {
            switch (mark.type) {
              case 'bold':
                wrappedText = <strong>{wrappedText}</strong>;
                break;
              case 'italic':
                wrappedText = <em>{wrappedText}</em>;
                break;
              case 'underline':
                wrappedText = <u>{wrappedText}</u>;
                break;
              case 'strike':
                wrappedText = <s>{wrappedText}</s>;
                break;
              case 'code':
                wrappedText = (
                  <code style={{ ...styles.inlineCode, ...inlineStyles }}>
                    {wrappedText}
                  </code>
                );
                break;
              case 'link': {
                // Preserve inline link styles
                const linkStyles = mark.attrs?.style
                  ? inlineCssToJs(mark.attrs.style)
                  : {};
                wrappedText = (
                  <Link
                    href={mark.attrs?.href ?? ''}
                    rel={mark.attrs?.rel ?? undefined}
                    style={{
                      ...styles.link,
                      ...linkStyles,
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

          return (
            <span key={index} style={style}>
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
            // Reverse the marks to apply them in the correct order
            node.marks.reverse().forEach((mark: Mark) => {
              switch (mark.type) {
                case 'bold':
                  variableText = <strong>{variableText}</strong>;
                  break;
                case 'italic':
                  variableText = <em>{variableText}</em>;
                  break;
                case 'underline':
                  variableText = <u>{variableText}</u>;
                  break;
                case 'strike':
                  variableText = <s>{variableText}</s>;
                  break;
                case 'code':
                  variableText = (
                    <code style={{ ...styles.inlineCode, ...inlineStyles }}>
                      {variableText}
                    </code>
                  );
                  break;
                case 'link': {
                  const linkStyles = mark.attrs?.style
                    ? inlineCssToJs(mark.attrs.style)
                    : {};
                  variableText = (
                    <Link
                      href={mark.attrs?.href ?? ''}
                      rel={mark.attrs?.rel ?? undefined}
                      style={{
                        ...styles.link,
                        ...linkStyles,
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
          const stylesBulletList =
            depth === 0 ? styles.list : styles.nestedList;
          return (
            <ul
              key={index}
              className={className}
              style={{
                ...styles.reset,
                ...stylesBulletList,
                ...inlineStyles,
              }}
            >
              {parseContent(node.content, depth + 1)}
            </ul>
          );
        }

        case 'orderedList': {
          const stylesOrderedList =
            depth === 0 ? styles.list : styles.nestedList;
          return (
            <ol
              key={index}
              className={className}
              start={node.attrs?.start}
              style={{
                ...styles.reset,
                ...stylesOrderedList,
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
                  ...styles.reset,
                  ...styles.listItem,
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
                  ...styles.blockquote,
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

  const parsedContent = parseContent(data.content);
  const html = await render(
    <BaseTemplate globalCss={css} previewText={preview} styles={styles}>
      {parsedContent}
    </BaseTemplate>,
    { pretty: true },
  );

  const text = await render(
    <BaseTemplate globalCss={css} previewText={preview} styles={styles}>
      {parsedContent}
    </BaseTemplate>,
    { plainText: true },
  );

  return { html, text };
};

