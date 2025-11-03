import { marked, Renderer } from 'marked';
import * as React from 'react';
import { type StylesType, styles } from './styles';
import { parseCssInJsToInlineCss } from './utils/parse-css-in-js-to-inline-css';

export type MarkdownProps = Readonly<{
  children: string;
  markdownCustomStyles?: StylesType;
  markdownContainerStyles?: React.CSSProperties;
}>;

export const Markdown = React.forwardRef<HTMLDivElement, MarkdownProps>(
  (
    { children, markdownContainerStyles, markdownCustomStyles, ...props },
    ref,
  ) => {
    const finalStyles = { ...styles, ...markdownCustomStyles };

    const renderer = new Renderer();
    renderer.blockquote = ({ tokens }) => {
      const text = renderer.parser.parse(tokens);

      return `<blockquote${
        parseCssInJsToInlineCss(finalStyles.blockQuote) !== ''
          ? ` style="${parseCssInJsToInlineCss(finalStyles.blockQuote)}"`
          : ''
      }>\n${text}</blockquote>\n`;
    };

    renderer.br = () => {
      return `<br${
        parseCssInJsToInlineCss(finalStyles.br) !== ''
          ? ` style="${parseCssInJsToInlineCss(finalStyles.br)}"`
          : ''
      } />`;
    };

    // TODO: Support all options
    renderer.code = ({ text }) => {
      text = `${text.replace(/\n$/, '')}\n`;

      return `<pre${
        parseCssInJsToInlineCss(finalStyles.codeBlock) !== ''
          ? ` style="${parseCssInJsToInlineCss(finalStyles.codeBlock)}"`
          : ''
      }><code>${text}</code></pre>\n`;
    };

    renderer.codespan = ({ text }) => {
      return `<code${
        parseCssInJsToInlineCss(finalStyles.codeInline) !== ''
          ? ` style="${parseCssInJsToInlineCss(finalStyles.codeInline)}"`
          : ''
      }>${text}</code>`;
    };

    renderer.del = ({ tokens }) => {
      const text = renderer.parser.parseInline(tokens);

      return `<del${
        parseCssInJsToInlineCss(finalStyles.strikethrough) !== ''
          ? ` style="${parseCssInJsToInlineCss(finalStyles.strikethrough)}"`
          : ''
      }>${text}</del>`;
    };

    renderer.em = ({ tokens }) => {
      const text = renderer.parser.parseInline(tokens);

      return `<em${
        parseCssInJsToInlineCss(finalStyles.italic) !== ''
          ? ` style="${parseCssInJsToInlineCss(finalStyles.italic)}"`
          : ''
      }>${text}</em>`;
    };

    renderer.heading = ({ tokens, depth }) => {
      const text = renderer.parser.parseInline(tokens);

      return `<h${depth}${
        parseCssInJsToInlineCss(
          finalStyles[`h${depth}` as keyof StylesType],
        ) !== ''
          ? ` style="${parseCssInJsToInlineCss(
              finalStyles[`h${depth}` as keyof StylesType],
            )}"`
          : ''
      }>${text}</h${depth}>`;
    };

    renderer.hr = () => {
      return `<hr${
        parseCssInJsToInlineCss(finalStyles.hr) !== ''
          ? ` style="${parseCssInJsToInlineCss(finalStyles.hr)}"`
          : ''
      } />\n`;
    };

    renderer.image = ({ href, text, title }) => {
      return `<img src="${href.replaceAll('"', '&quot;')}" alt="${text.replaceAll('"', '&quot;')}"${
        title ? ` title="${title}"` : ''
      }${
        parseCssInJsToInlineCss(finalStyles.image) !== ''
          ? ` style="${parseCssInJsToInlineCss(finalStyles.image)}"`
          : ''
      }>`;
    };

    renderer.link = ({ href, title, tokens }) => {
      const text = renderer.parser.parseInline(tokens);

      return `<a href="${href}" target="_blank"${
        title ? ` title="${title}"` : ''
      }${
        parseCssInJsToInlineCss(finalStyles.link) !== ''
          ? ` style="${parseCssInJsToInlineCss(finalStyles.link)}"`
          : ''
      }>${text}</a>`;
    };

    renderer.listitem = ({ tokens }) => {
      const hasNestedList = tokens.some((token) => token.type === 'list');
      const text = hasNestedList
        ? renderer.parser.parse(tokens)
        : renderer.parser.parseInline(tokens);

      return `<li${
        parseCssInJsToInlineCss(finalStyles.li) !== ''
          ? ` style="${parseCssInJsToInlineCss(finalStyles.li)}"`
          : ''
      }>${text}</li>\n`;
    };

    renderer.list = ({ items, ordered, start }) => {
      const type = ordered ? 'ol' : 'ul';
      const startAt = ordered && start !== 1 ? ` start="${start}"` : '';
      const styles = parseCssInJsToInlineCss(
        finalStyles[ordered ? 'ol' : 'ul'],
      );

      return (
        '<' +
        type +
        startAt +
        `${styles !== '' ? ` style="${styles}"` : ''}>\n` +
        items.map((item) => renderer.listitem(item)).join('') +
        '</' +
        type +
        '>\n'
      );
    };

    renderer.paragraph = ({ tokens }) => {
      const text = renderer.parser.parseInline(tokens);

      return `<p${
        parseCssInJsToInlineCss(finalStyles.p) !== ''
          ? ` style="${parseCssInJsToInlineCss(finalStyles.p)}"`
          : ''
      }>${text}</p>\n`;
    };

    renderer.strong = ({ tokens }) => {
      const text = renderer.parser.parseInline(tokens);

      return `<strong${
        parseCssInJsToInlineCss(finalStyles.bold) !== ''
          ? ` style="${parseCssInJsToInlineCss(finalStyles.bold)}"`
          : ''
      }>${text}</strong>`;
    };

    renderer.table = ({ header, rows }) => {
      const styleTable = parseCssInJsToInlineCss(finalStyles.table);
      const styleThead = parseCssInJsToInlineCss(finalStyles.thead);
      const styleTbody = parseCssInJsToInlineCss(finalStyles.tbody);

      const theadRow = renderer.tablerow({
        text: header.map((cell) => renderer.tablecell(cell)).join(''),
      });

      const tbodyRows = rows
        .map((row) =>
          renderer.tablerow({
            text: row.map((cell) => renderer.tablecell(cell)).join(''),
          }),
        )
        .join('');

      const thead = `<thead${styleThead ? ` style="${styleThead}"` : ''}>\n${theadRow}</thead>`;
      const tbody = `<tbody${styleTbody ? ` style="${styleTbody}"` : ''}>${tbodyRows}</tbody>`;

      return `<table${styleTable ? ` style="${styleTable}"` : ''}>\n${thead}\n${tbody}</table>\n`;
    };

    renderer.tablecell = ({ tokens, align, header }) => {
      const text = renderer.parser.parseInline(tokens);
      const type = header ? 'th' : 'td';
      const tag = align
        ? `<${type} align="${align}"${
            parseCssInJsToInlineCss(finalStyles.td) !== ''
              ? ` style="${parseCssInJsToInlineCss(finalStyles.td)}"`
              : ''
          }>`
        : `<${type}${
            parseCssInJsToInlineCss(finalStyles.td) !== ''
              ? ` style="${parseCssInJsToInlineCss(finalStyles.td)}"`
              : ''
          }>`;
      return `${tag}${text}</${type}>\n`;
    };

    renderer.tablerow = ({ text }) => {
      return `<tr${
        parseCssInJsToInlineCss(finalStyles.tr) !== ''
          ? ` style="${parseCssInJsToInlineCss(finalStyles.tr)}"`
          : ''
      }>\n${text}</tr>\n`;
    };

    return (
      <div
        {...props}
        dangerouslySetInnerHTML={{
          __html: marked.parse(children, {
            renderer,
            async: false,
          }),
        }}
        data-id="react-email-markdown"
        ref={ref}
        style={markdownContainerStyles}
      />
    );
  },
);

Markdown.displayName = 'Markdown';
