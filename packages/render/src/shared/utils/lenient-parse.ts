export interface HtmlTagProperty {
  name: string;
  value: string;
}

export interface HtmlTag {
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
export interface HtmlDoctype {
  type: 'doctype';
  content: string;
}

export interface HtmlComment {
  type: 'comment';
  content: string;
}

export interface HtmlText {
  type: 'text';
  content: string;
}

export type HtmlNode = HtmlTag | HtmlDoctype | HtmlComment | HtmlText;

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

    if (html.startsWith('<!--', index)) {
      const commentEnd = html.indexOf('-->', index + '<!--'.length);
      if (commentEnd === -1) {
        // Assumes the rest of the document is part of this comment
        const content = html.slice(index + '<!--'.length);
        addToTree({ type: 'comment', content });
        break;
      }

      const content = html.substring(index + '<!--'.length, commentEnd);
      addToTree({ type: 'comment', content });
      index = commentEnd + '-->'.length;
      continue;
    }

    if (html.startsWith('<!DOCTYPE', index)) {
      const declEnd = html.indexOf('>', index + '<!DOCTYPE'.length);
      if (declEnd === -1) {
        // Assumes the rest of the document is part of this doctype
        const content = html.slice(index + '<!DOCTYPE'.length);
        addToTree({ type: 'doctype', content });
        break;
      }

      const content = html.substring(index + '<!DOCTYPE'.length, declEnd);
      addToTree({ type: 'doctype', content });
      index = declEnd + '>'.length;
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
