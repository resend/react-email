import {
  type HtmlNode,
  type HtmlTag,
  type HtmlTagProperty,
  lenientParse,
} from './lenient-parse';

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

  lineBreak: '\n' | '\r\n';
}

export const getIndentationOfLine = (line: string) => {
  const match = line.match(/^\s+/);
  if (match === null) return '';
  return match[0];
};

export const pretty = (
  html: string,
  options: Options = { lineBreak: '\n' },
) => {
  const nodes = lenientParse(html);

  return prettyNodes(nodes, options);
};

export const wrapText = (
  text: string,
  linePrefix: string,
  maxLineLength: number,
  lineBreak: string,
): string => {
  if (!text.includes(' ')) {
    return `${linePrefix}${text}`;
  }
  let wrappedText = linePrefix + text;
  let currentLineStartIndex = linePrefix.length;
  while (wrappedText.length - currentLineStartIndex > maxLineLength) {
    console.log('current wrapped text', wrappedText);
    const overflowingCharacterIndex = Math.min(
      currentLineStartIndex + maxLineLength - 1,
      wrappedText.length,
    );
    let lineBreakIndex = wrappedText.lastIndexOf(
      ' ',
      overflowingCharacterIndex + 1,
    );
    console.log('overflowingCharacterIndex', overflowingCharacterIndex);
    // YOU ARE HERE: there was an issue happening when falling back to lines larger than the maxLineLength,
    // and you were debugging why it was happening to fix it
    if (lineBreakIndex === -1) {
      lineBreakIndex = wrappedText.indexOf(' ', overflowingCharacterIndex);
      console.log(
        'text after overflow:',
        wrappedText.slice(overflowingCharacterIndex),
      );
      if (lineBreakIndex === -1) {
        return wrappedText;
      }
    }
    console.log('lineBreakIndex', lineBreakIndex);
    wrappedText =
      wrappedText.slice(0, lineBreakIndex) +
      lineBreak +
      linePrefix +
      wrappedText.slice(lineBreakIndex + 1);
    currentLineStartIndex =
      lineBreak.length + linePrefix.length + lineBreakIndex;
  }
  console.log(wrappedText);
  return wrappedText;
};

const printProperty = (
  property: HtmlTagProperty,
  maxLineLength: number,
  lineBreak: string,
) => {
  const singleLineProperty = `${property.name}=${property.value}`;
  if (property.name === 'style' && singleLineProperty.length > maxLineLength) {
    // This uses a negative lookbehing to ensure that the semicolon is not
    // part of an HTML entity (e.g., `&amp;`, `&quot;`, `&nbsp;`, etc.).
    const nonHtmlEntitySemicolonRegex = /(?<!&[^;]+);/;
    const styles = property.value
      .slice(1, -1)
      .split(nonHtmlEntitySemicolonRegex);
    const wrappedStyles = styles
      .map((style) => `    ${style}`)
      .join(`;${lineBreak}`);

    let multiLineProperty = `${property.name}="${lineBreak}`;
    multiLineProperty += `${wrappedStyles}${lineBreak}`;
    multiLineProperty += `  "`;

    return multiLineProperty;
  }
  return singleLineProperty;
};

const printTagStart = (
  node: HtmlTag,
  maxLineLength: number,
  lineBreak: string,
) => {
  const singleLineProperties = node.properties
    .map((property) => ` ${property.name}=${property.value}`)
    .join('');
  const singleLineTagStart = `<${node.name}${singleLineProperties}${node.void ? ' /' : ''}>`;

  if (singleLineTagStart.length <= maxLineLength) {
    return singleLineTagStart;
  }

  let multilineTagStart = `<${node.name}${lineBreak}`;
  for (const property of node.properties) {
    const printedProperty = printProperty(property, maxLineLength, lineBreak);
    multilineTagStart += `  ${printedProperty}${lineBreak}`;
  }
  multilineTagStart += `${node.void ? '/' : ''}>`;
  return multilineTagStart;
};

const prettyNodes = (
  nodes: HtmlNode[],
  options: Options,
  stack: HtmlNode[] = [],
  currentIndentationSize = 0,
) => {
  const { preserveLinebreaks = false, maxLineLength = 80, lineBreak } = options;
  const indentation = ' '.repeat(currentIndentationSize);

  let formatted = '';
  for (const node of nodes) {
    if (node.type === 'text') {
      if (
        preserveLinebreaks ||
        (stack.length > 0 &&
          stack[0].type === 'tag' &&
          ['script', 'style'].includes(stack[0].name))
      ) {
        formatted += `${indentation}${node.content}`;
      } else {
        const rawText = node.content.replaceAll(/(\r|\n|\r\n)\s*/g, '');
        formatted += wrapText(rawText, indentation, maxLineLength, lineBreak);
      }
      formatted += lineBreak;
    } else if (node.type === 'tag') {
      formatted += `${indentation}`;
      formatted += printTagStart(node, maxLineLength, lineBreak).replaceAll(
        lineBreak,
        `${lineBreak}${indentation}`,
      );

      if (node.void) {
        formatted += lineBreak;
      } else {
        if (node.children.length > 0) {
          formatted += `${lineBreak}${prettyNodes(
            node.children,
            options,
            [node, ...stack],
            currentIndentationSize + 2,
          )}`;
          formatted += `${indentation}`;
        }

        formatted += `</${node.name}>${lineBreak}`;
      }
    } else if (node.type === 'comment') {
      formatted += `${indentation}<!--${node.content}-->${lineBreak}`;
    } else if (node.type === 'doctype') {
      formatted += `${indentation}<!DOCTYPE${node.content}>${lineBreak}`;
    }
  }
  return formatted;
};
