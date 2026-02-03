import * as ReactEmailComponents from '@react-email/components';
import {
  Button,
  CodeBlock,
  Column,
  Heading,
  Hr,
  Img,
  Link,
  type PrismLanguage,
  Row,
  render,
  Section,
} from '@react-email/components';
import type { JSONContent } from '@tiptap/core';
import * as React from 'react';
import type { CssJs } from '@/types/editor/styles';
import {
  expandShorthandProperties,
  inlineCSSToJS,
} from '@/utils/convert-css-object';
import { SocialComponent } from '../../extensions/social-component';
import { TwitterComponent } from '../../extensions/twitter-component';
import { YouTubeComponent } from '../../extensions/youtube-component';
import { BaseTemplate } from '../base-template';

type Mark = {
  type: string;
  attrs?: Record<string, string | null | undefined>;
};

interface ComposeReactEmailResult {
  html: string;
  text: string;
}

const getTextAlignment = (alignment: string | undefined) => {
  switch (alignment) {
    case 'left':
      return { textAlign: 'left' };
    case 'center':
      return { textAlign: 'center' };
    case 'right':
      return { textAlign: 'right' };
    default:
      return {};
  }
};

type Source = 'broadcast' | 'template';

const getVariableText = ({
  node,
  source,
}: {
  node: JSONContent['node'];
  source: Source;
}): React.ReactNode => {
  if (source === 'broadcast') {
    return `${node.attrs.id.replace('}}}', '')}|${node.attrs.fallback}}}}`;
  }

  return node.attrs.id;
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
  source = 'broadcast',
}: {
  data: JSONContent;
  styles: CssJs;
  preview: string | null;
  css?: string;
  source?: Source;
}): Promise<ComposeReactEmailResult> => {
  if (!data || !styles) {
    return { html: '', text: '' };
  }

  // Declared inside the function to use style as a global variable
  function parseContent(content: JSONContent | undefined, depth = 0) {
    if (!content) {
      return;
    }

    return content.map((node: JSONContent['node'], index: number) => {
      const inlineStyles = inlineCSSToJS(node.attrs?.style);
      const textAlign = getTextAlignment(
        node.attrs?.align || node.attrs?.alignment,
      );
      const className = node.attrs?.class || undefined;
      const width = node.attrs?.width;

      switch (node.type) {
        case 'heading':
          return (
            <Heading
              key={index}
              as={`h${node.attrs.level}` as 'h1' | 'h2' | 'h3'}
              className={className}
              style={
                {
                  ...styles.reset,
                  ...styles[`h${node.attrs.level}` as 'h1' | 'h2' | 'h3'],
                  ...inlineStyles,
                  ...textAlign,
                } as React.CSSProperties
              }
            >
              {parseContent(node.content)}
            </Heading>
          );

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

          let wrappedText = node.text;

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
                  ? inlineCSSToJS(mark.attrs.style)
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
                  ? inlineCSSToJS(mark.attrs.style)
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
                    ? inlineCSSToJS(mark.attrs.style)
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
                    ? inlineCSSToJS(mark.attrs.style)
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
              start={node.attrs.start}
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

        case 'codeBlock': {
          const language = node.attrs.language
            ? `${node.attrs.language}`
            : 'javascript';

          // We need react-email code component export type themes
          // @ts-expect-error
          const userTheme = ReactEmailComponents[node.attrs.theme];

          // Without theme, render a gray codeblock
          const theme = userTheme
            ? userTheme
            : {
                base: {
                  color: '#1e293b',
                  background: '#f1f5f9',
                  lineHeight: '1.5',
                  fontFamily:
                    '"Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace',
                  padding: '0.75rem 1rem',
                },
              };

          theme.base = {
            ...theme.base,
            borderRadius: '0.125rem',
            padding: '0.75rem 1rem',
          };

          return (
            <CodeBlock
              key={index}
              code={node.content?.[0]?.text ?? ''}
              language={language as PrismLanguage}
              theme={theme}
              style={{
                width: 'auto',
                ...styles.codeBlock,
              }}
            />
          );
        }

        case 'hardBreak':
          return <br key={index} />;

        case 'footer':
          return (
            <Section
              key={index}
              className={className}
              style={{ ...styles.footer, ...inlineStyles }}
            >
              {parseContent(node.content)}
            </Section>
          );

        case 'horizontalRule':
          return (
            <Hr
              key={index}
              className={className}
              style={{ ...styles.hr, ...inlineStyles }}
            />
          );

        case 'htmlContent':
          return (
            <div
              key={index}
              dangerouslySetInnerHTML={{
                __html: node.attrs.content,
              }}
            />
          );

        case 'socialLinks':
          return (
            <SocialComponent
              key={index}
              className={className}
              {...node.attrs.links}
              style={{ ...inlineStyles }}
            />
          );

        case 'twitter': {
          return (
            <TwitterComponent
              key={index}
              disabledLinkWhileEditing={false}
              className={className}
              href={node.attrs.internal_linkHref}
              attrs={node.attrs}
              imageSource={node.attrs.internal_imageSource}
              style={{
                ...styles.image,
                ...inlineStyles,
                width: '100%',
                maxWidth: '550px',
              }}
            />
          );
        }

        case 'youtube':
          return (
            <YouTubeComponent
              key={index}
              disabledLinkWhileEditing={false}
              className={className}
              href={node.attrs.internal_linkHref}
              imageSource={node.attrs.internal_imageSource}
              style={{
                ...styles.reset,
                ...styles.image,
                ...inlineStyles,
              }}
            />
          );

        case 'image': {
          const alignment = node.attrs?.align || node.attrs?.alignment;

          const image = (
            <Img
              key={index}
              alt={node.attrs.alt}
              className={className}
              height={node.attrs.height}
              src={node.attrs.src}
              style={{ ...styles.image, ...inlineStyles }}
              width={node.attrs.width}
            />
          );

          if (alignment) {
            return (
              <Row key={index}>
                <Column align={alignment}>
                  {node.attrs.href !== '' ? (
                    <Link href={node.attrs.href}>
                      <React.Fragment key={index}>{image}</React.Fragment>
                    </Link>
                  ) : (
                    <React.Fragment key={index}>{image}</React.Fragment>
                  )}
                </Column>
              </Row>
            );
          }

          // If image doesn't have an explicit alignment, don't wrap it in a row or column
          return (
            <React.Fragment key={index}>
              {node.attrs.href !== '' ? (
                <Link href={node.attrs.href}>{image}</Link>
              ) : (
                image
              )}
            </React.Fragment>
          );
        }

        case 'button':
          return (
            <Row key={index}>
              <Column align={node.attrs?.align || node.attrs?.alignment}>
                <Button
                  key={index}
                  className={className}
                  href={node.attrs.href}
                  style={{
                    ...styles.reset,
                    ...styles.button,
                    ...inlineStyles,
                  }}
                >
                  {parseContent(node.content)}
                </Button>
              </Column>
            </Row>
          );

        case 'section':
          return (
            <Section
              key={index}
              className={className}
              align={node.attrs?.align || node.attrs?.alignment}
              style={
                {
                  ...styles.section,
                  ...inlineStyles,
                  ...textAlign,
                } as React.CSSProperties
              }
            >
              {parseContent(node.content)}
            </Section>
          );

        case 'body':
          return (
            <div
              key={index}
              className={className}
              style={{
                ...styles.reset,
                ...inlineStyles,
              }}
            >
              {parseContent(node.content)}
            </div>
          );

        case 'div':
          return (
            <div
              key={index}
              className={className}
              style={{
                ...styles.reset,
                ...inlineStyles,
              }}
            >
              {parseContent(node.content)}
            </div>
          );

        case 'table': {
          const alignment = node.attrs?.align || node.attrs?.alignment;

          const centeringStyles: Record<string, string> =
            alignment === 'center'
              ? { marginLeft: 'auto', marginRight: 'auto' }
              : {};

          return (
            <Section
              key={index}
              align={alignment}
              className={className}
              style={resolveConflictingStyles(styles.reset, {
                ...inlineStyles,
                ...centeringStyles,
              })}
              {...(width !== undefined ? { width } : {})}
            >
              {parseContent(node.content)}
            </Section>
          );
        }

        case 'tableRow':
          return (
            <tr
              key={index}
              className={className}
              style={{
                ...styles.reset,
                ...inlineStyles,
              }}
            >
              {parseContent(node.content)}
            </tr>
          );

        case 'tableCell':
          return (
            <Column
              key={index}
              className={className}
              align={node.attrs?.align || node.attrs?.alignment}
              style={{
                ...styles.reset,
                ...inlineStyles,
              }}
            >
              {parseContent(node.content)}
            </Column>
          );

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
