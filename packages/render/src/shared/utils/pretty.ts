import { CommentNode, HTMLElement, NodeType, parse } from 'node-html-parser';

interface Options {
  /**
   * Disables the word wrapping we do to ensure the maximum line length is kept.
   *
   * @default false
   */
  preserveLinebreaks?: boolean;
  /**
   * The maximum line length before wrapping some piece of the document.
   *
   * @default 80
   */
  maxLineLength?: number;

  lineBreak?: '\n' | '\r\n';
}

export const getIndentationOfLine = (line: string) => {
  const match = line.match(/^\s+/);
  if (match === null) return '';
  return match[0];
};

export const wrapText = (
  text: string,
  maxLineLength: number,
  lineBreak: string,
): string => {
  if (!text.includes(' ')) {
    return `${text}`;
  }
  let wrappedText = text;
  let currentLineStartIndex = 0;
  while (wrappedText.length - currentLineStartIndex > maxLineLength) {
    const overflowingCharacterIndex = Math.min(
      currentLineStartIndex + maxLineLength - 1,
      wrappedText.length,
    );
    let lineBreakIndex = wrappedText.lastIndexOf(
      ' ',
      overflowingCharacterIndex + 1,
    );
    if (lineBreakIndex === -1 || lineBreakIndex < currentLineStartIndex) {
      lineBreakIndex = wrappedText.indexOf(' ', overflowingCharacterIndex);
      if (lineBreakIndex === -1) {
        return wrappedText;
      }
    }
    wrappedText =
      wrappedText.slice(0, lineBreakIndex) +
      lineBreak +
      wrappedText.slice(lineBreakIndex + 1);
    currentLineStartIndex = lineBreak.length + lineBreakIndex;
  }
  return wrappedText;
};

const printProperty = (
  propertyName: string,
  propertyValue: string,
  maxLineLength: number,
  lineBreak: string,
) => {
  const singleLineProperty = `${propertyName}="${propertyValue}"`;
  if (propertyName === 'style' && singleLineProperty.length > maxLineLength) {
    // This uses a negative lookbehing to ensure that the semicolon is not
    // part of an HTML entity (e.g., `&amp;`, `&quot;`, `&nbsp;`, etc.).
    const nonHtmlEntitySemicolonRegex = /(?<!&[^;]+);/;
    const styles = propertyValue.split(nonHtmlEntitySemicolonRegex);
    const wrappedStyles = styles
      .map((style) => `    ${style}`)
      .join(`;${lineBreak}`);
    let multiLineProperty = `${propertyName}="${lineBreak}`;
    multiLineProperty += `${wrappedStyles}${lineBreak}`;
    multiLineProperty += `  "`;

    return multiLineProperty;
  }
  return singleLineProperty;
};

const printTagStart = (
  element: HTMLElement,
  maxLineLength: number,
  lineBreak: string,
) => {
  const singleLineProperties = Object.entries(element.rawAttributes)
    .map(([name, value]) => ` ${name}="${value}"`)
    .join('');
  const singleLineTagStart = `<${element.tagName.toLowerCase()}${singleLineProperties}${element.isVoidElement ? ' /' : ''}>`;

  if (singleLineTagStart.length <= maxLineLength) {
    return singleLineTagStart;
  }

  let multilineTagStart = `<${element.tagName.toLowerCase()}${lineBreak}`;
  for (const [name, value] of Object.entries(element.rawAttributes)) {
    const printedProperty = printProperty(
      name,
      value,
      maxLineLength,
      lineBreak,
    );
    multilineTagStart += `  ${printedProperty}${lineBreak}`;
  }
  multilineTagStart += `${element.isVoidElement ? '/' : ''}>`;
  return multilineTagStart;
};

export const pretty = (html: string, options: Options = {}) => {
  const root = parse(html, { comment: true });

  return printChildrenOf(root, {
    preserveLinebreaks: false,
    maxLineLength: 80,
    lineBreak: '\n',
    ...options,
  });
};

const printChildrenOf = (
  element: HTMLElement,
  options: Required<Options>,
  currentIndentationSize = 0,
) => {
  const { preserveLinebreaks, lineBreak, maxLineLength } = options;
  const indentation = ' '.repeat(currentIndentationSize);

  let formatted = '';
  for (const node of element.childNodes) {
    if (node.nodeType === NodeType.TEXT_NODE) {
      if (
        preserveLinebreaks ||
        ['script', 'style'].includes(
          (node.parentNode.tagName ?? '').toLowerCase(),
        ) ||
        node.rawText.startsWith('<!DOCTYPE')
      ) {
        formatted += `${indentation}${node.rawText}`;
      } else {
        const inlinedText = node.rawText.replaceAll(/(\r|\n|\r\n)\s*/g, '');
        formatted += wrapText(inlinedText, maxLineLength, lineBreak)
          .split(lineBreak)
          .map((line) => `${indentation}${line}`)
          .join(lineBreak);
      }
      formatted += lineBreak;
    } else if (node instanceof HTMLElement) {
      formatted += `${indentation}`;
      formatted += printTagStart(node, maxLineLength, lineBreak).replaceAll(
        lineBreak,
        `${lineBreak}${indentation}`,
      );

      if (node.isVoidElement) {
        formatted += lineBreak;
      } else {
        if (node.childNodes.length > 0) {
          formatted += `${lineBreak}${printChildrenOf(
            node,
            options,
            currentIndentationSize + 2,
          )}`;
          formatted += `${indentation}`;
        }

        formatted += `</${node.tagName.toLowerCase()}>${lineBreak}`;
      }
    } else if (node instanceof CommentNode) {
      formatted += `${indentation}<!--${node.rawText}-->${lineBreak}`;
    }
  }
  return formatted;
};
