import { type HtmlNode, lenientParse } from './lenient-parse';

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

export const pretty = (html: string, options: Options) => {
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
    const overflowingCharacterIndex = Math.min(
      currentLineStartIndex + maxLineLength - 1,
      wrappedText.length,
    );
    if (!wrappedText.includes(' ', currentLineStartIndex)) {
      return wrappedText;
    }
    for (let i = overflowingCharacterIndex; i >= currentLineStartIndex; i--) {
      const char = wrappedText[i];
      if (char === ' ') {
        wrappedText =
          wrappedText.slice(0, i) +
          lineBreak +
          linePrefix +
          wrappedText.slice(i + 1);
        currentLineStartIndex = lineBreak.length + linePrefix.length + i;
        break;
      }
      if (i === currentLineStartIndex) {
        const nextSpaceIndex = wrappedText.indexOf(' ', currentLineStartIndex);
        wrappedText =
          wrappedText.slice(0, nextSpaceIndex) +
          lineBreak +
          linePrefix +
          wrappedText.slice(nextSpaceIndex + 1);
        currentLineStartIndex =
          lineBreak.length + linePrefix.length + nextSpaceIndex;
      }
    }
  }
  return wrappedText;
};

const prettyNodes = (
  nodes: HtmlNode[],
  options: Options,
  currentIndentationSize = 0,
) => {
  const { preserveLinebreaks = false, maxLineLength = 80, lineBreak } = options;
  const indentation = ' '.repeat(currentIndentationSize);

  let formatted = '';
  for (const node of nodes) {
    if (node.type === 'text') {
      if (preserveLinebreaks) {
        formatted += node.content;
      } else {
        const rawText = node.content.replaceAll(/(\r|\n|\r\n)\s*/g, '');
        formatted += wrapText(rawText, indentation, maxLineLength, lineBreak);
      }
      formatted += lineBreak;
    } else if (node.type === 'tag') {
      const propertiesRawString = node.properties
        .map((property) => ` ${property.name}=${property.value}`)
        .join('');

      const rawTagStart = `${indentation}<${node.name}${propertiesRawString}${node.void ? '/' : ''}>`;
      if (rawTagStart.length - currentIndentationSize > maxLineLength) {
        let tagStart = `${indentation}<${node.name}${lineBreak}`;
        for (const property of node.properties) {
          tagStart += `${indentation}  ${property.name}=${property.value}${lineBreak}`;
        }
        tagStart += `${indentation}${node.void ? '/' : ''}>`;
        formatted += tagStart;
      } else {
        formatted += `${rawTagStart}`;
      }
      if (node.void) {
        formatted += lineBreak;
      }

      if (!node.void) {
        if (node.children.length > 0) {
          formatted += `${lineBreak}${prettyNodes(
            node.children,
            options,
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
