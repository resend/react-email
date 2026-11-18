import * as React from 'react';
import { markAsElement } from '../element-marker.js';
import type { PrismLanguage } from './languages-available.js';
import { Prism } from './prism.js';
import type { Theme } from './themes.js';

type PrismToken = InstanceType<typeof Prism.Token>;

export interface CodeBlockProps extends React.ComponentPropsWithoutRef<'pre'> {
  lineNumbers?: boolean;

  /**
   * This applies a certain font family on all elements render in this component,
   * it is mostly meant to override a global font that has already been used with
   * our `<Font>` component
   */
  fontFamily?: string;

  theme: Theme;
  language: PrismLanguage;
  code: string;
}

const stylesForToken = (token: PrismToken, theme: Theme) => {
  let styles = { ...theme[token.type] };

  const aliases = Array.isArray(token.alias) ? token.alias : [token.alias];

  for (const alias of aliases) {
    styles = { ...styles, ...theme[alias] };
  }

  return styles;
};

interface Segment {
  text: string;
  style: React.CSSProperties | undefined;
}

/**
 * Flattens Prism's token tree into plain text segments, each with the
 * fully merged style it would have had in the nested markup.
 */
const toSegments = (
  token: string | PrismToken,
  theme: Theme,
  inheritedStyles: React.CSSProperties | undefined,
): Segment[] => {
  if (typeof token === 'string') {
    return [{ text: token, style: inheritedStyles }];
  }

  const style = { ...inheritedStyles, ...stylesForToken(token, theme) };
  const children = Array.isArray(token.content)
    ? token.content
    : [token.content];

  return children.flatMap((child) => toSegments(child, theme, style));
};

const isWhitespaceOnly = (text: string) => /^\s+$/.test(text);

/**
 * Spark Mail flattens email HTML and drops `<span>` elements that contain
 * only whitespace, which used to remove indentation and the spaces between
 * tokens (for example the space in `npm install`).
 *
 * Instead of replacing spaces with invisible characters (which break code
 * copied out of the email), we make sure no rendered `<span>` contains
 * only whitespace: each whitespace-only segment wraps the segment after it
 * (or, at the end of a line, the segment before it). The text and the
 * styles of every segment stay the same.
 */
const renderLine = (segments: Segment[]): React.ReactNode => {
  const nodes: React.ReactNode[] = [];
  let pendingWhitespace: Segment[] = [];

  const wrap = (node: React.ReactNode, whitespace: Segment[]) =>
    whitespace.reduceRight<React.ReactNode>(
      (inner, segment) => (
        <span style={segment.style}>
          {segment.text}
          {inner}
        </span>
      ),
      node,
    );

  for (const segment of segments) {
    if (segment.text.length === 0) continue;

    if (isWhitespaceOnly(segment.text)) {
      pendingWhitespace.push(segment);
      continue;
    }

    nodes.push(
      wrap(
        <span style={segment.style}>{segment.text}</span>,
        pendingWhitespace,
      ),
    );
    pendingWhitespace = [];
  }

  if (pendingWhitespace.length > 0) {
    const previous = nodes.pop();
    if (previous === undefined) {
      // The whole line is whitespace, so there is nothing to attach it to.
      // If a client drops it, the line still renders as an empty line.
      nodes.push(
        <span style={pendingWhitespace[0]?.style}>
          {pendingWhitespace.map((segment) => segment.text).join('')}
        </span>,
      );
    } else {
      nodes.push(
        pendingWhitespace.reduce<React.ReactNode>(
          (inner, segment) => (
            <span style={segment.style}>
              {inner}
              {segment.text}
            </span>
          ),
          previous,
        ),
      );
    }
  }

  return nodes.map((node, i) => (
    <React.Fragment key={i}>{node}</React.Fragment>
  ));
};

export const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(
  ({ code, fontFamily, lineNumbers, theme, language, ...rest }, ref) => {
    const languageGrammar = Prism.languages[language];
    if (typeof languageGrammar === 'undefined') {
      throw new Error(
        `CodeBlock: There is no language defined on Prism called ${language}`,
      );
    }

    const lines = code.split(/\r\n|\r|\n/gm);
    const tokensPerLine = lines.map((line) =>
      Prism.tokenize(line, languageGrammar),
    );

    return (
      <pre
        {...rest}
        ref={ref}
        style={{ ...theme.base, width: '100%', ...rest.style }}
      >
        <code>
          {tokensPerLine.map((tokensForLine, lineIndex) => (
            <React.Fragment key={lineIndex}>
              {lineNumbers ? (
                <span
                  style={{
                    width: '2em',
                    height: '1em',
                    display: 'inline-block',
                    fontFamily: fontFamily,
                  }}
                >
                  {lineIndex + 1}
                </span>
              ) : null}

              {renderLine(
                tokensForLine.flatMap((token) =>
                  toSegments(token, theme, { fontFamily }),
                ),
              )}
              <br />
            </React.Fragment>
          ))}
        </code>
      </pre>
    );
  },
);

CodeBlock.displayName = 'CodeBlock';
markAsElement(CodeBlock);
