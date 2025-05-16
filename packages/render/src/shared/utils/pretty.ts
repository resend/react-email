interface HtmlTagProperty {
  name: string;
  value: string;
}

interface HtmlTag {
  type: 'tag';
  name: string;
  /**
   * Whether the html tag is self-closing, or a void element in spec nomenclature.
   */
  void: boolean;
  properties: HtmlTagProperty[];
  children: HtmlNode[];
}

/**
 * Something like the DOCTYPE for the document, or comments.
 */
interface HtmlDeclaration {
  type: 'declaration';
  content: string;
}

interface HtmlText {
  type: 'text';
  content: string;
}

type HtmlNode = HtmlTag | HtmlDeclaration | HtmlText;

export const lenientParse = (html: string): HtmlNode[] => {
  const result: HtmlNode[] = [];

  const stack: HtmlTag[] = []; // Stack to keep track of parent tags
  let index = 0; // Current parsing index
  while (index < html.length) {
    const currentParent = stack.length > 0 ? stack[stack.length - 1] : null;
    const addToTree = (node: HtmlNode) => {
      if (currentParent) {
        currentParent.children.push(node);
      } else {
        result.push(node);
      }
    };

    const htmlObjectStart = html.indexOf('<', index);
    if (htmlObjectStart === -1) {
      if (index < html.length) {
        const content = html.slice(index);
        addToTree({ type: 'text', content });
      }

      break;
    }
    if (htmlObjectStart > index) {
      const content = html.slice(index, htmlObjectStart);
      addToTree({ type: 'text', content });
      index = htmlObjectStart;
    }

    if (html.startsWith('<!', index)) {
      // an HTML declaration, i.e. a comment or a DOCTYPE
      const declEnd = html.indexOf('>', index + 2);
      if (declEnd === -1) {
        // Assumes the rest of the document is part of this declaration
        const content = html.slice(index);
        addToTree({ type: 'declaration', content });
        break;
      }

      const content = html.substring(index, declEnd + 1);
      addToTree({ type: 'declaration', content });
      index = declEnd + 1;
      continue;
    }

    if (html.startsWith('</', index)) {
      const bracketEnd = html.indexOf('>', index + 2);
      const tagName = html.slice(index + 2, bracketEnd);

      if (stack.length > 0 && stack[stack.length - 1].name === tagName) {
        stack.pop();
      } else {
        // Mismatched closing tag. In a simple lenient parser, we might just ignore it
        // or log a warning. For now, it's effectively ignored if no match on stack top.
      }
      index += 3 + tagName.length;
      continue;
    }

    const tag: HtmlTag = {
      type: 'tag',
      name: '',
      void: false,
      properties: [],
      children: [],
    };

    index++;
    while (!html.startsWith('>', index) && !html.startsWith('/>', index)) {
      const character = html[index];
      if (character !== ' ' && tag.name.length === 0) {
        const tagNameEndIndex = Math.min(
          html.indexOf(' ', index),
          html.indexOf('>', index),
        );
        tag.name = html.slice(index, tagNameEndIndex);
        index = tagNameEndIndex;
        continue;
      }

      if (character !== ' ') {
        const propertyName = html.slice(index, html.indexOf('=', index));
        index = html.indexOf('=', index) + 1;

        index = html.indexOf('"', index);
        const propertyValue = html.slice(
          index,
          html.indexOf('"', index + 1) + 1,
        );
        index = html.indexOf('"', index + 1) + 1;

        tag.properties.push({
          name: propertyName,
          value: propertyValue,
        });
        continue;
      }

      index++;
    }
    if (html.startsWith('/>', index)) {
      index++;
      tag.void = true;
    }
    if (html.startsWith('>', index)) {
      addToTree(tag);
      if (!tag.void) {
        stack.push(tag);
      }
      index++;
    }
  }

  return result;
};

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
  let currentLineStartIndex = 0;
  while (wrappedText.length - currentLineStartIndex > maxLineLength) {
    const overflowingCharacterIndex = Math.min(
      currentLineStartIndex + maxLineLength - 1,
      wrappedText.length,
    );
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
        formatted += wrapText(
          rawText,
          indentation,
          maxLineLength - currentIndentationSize,
          lineBreak,
        );
      }
      formatted += lineBreak;
    } else if (node.type === 'tag') {
      const propertiesRawString = node.properties
        .map((property) => ` ${property.name}=${property.value}`)
        .join('');

      const rawTagStart = `${indentation}<${node.name}${propertiesRawString}${node.void ? '/' : ''}>`;
      if (rawTagStart.length > maxLineLength) {
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
    } else if (node.type === 'declaration') {
      formatted += `${indentation}${node.content}${lineBreak}`;
    }
  }
  return formatted;
};
