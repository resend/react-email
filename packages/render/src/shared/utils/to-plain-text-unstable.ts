import { decodeHTML, decodeHTMLAttribute } from 'entities/lib/decode.js';
import { type INode, type ITag, parse, SyntaxKind } from 'html5parser';

const SKIPPED_TAGS = new Set([
  'img',
  'noscript',
  'script',
  'style',
  'template',
]);

const WHITESPACE_RUN = /([ \t\n\r\f\u200b]+)/;

// A block prefix puts `first` before the block's content and `rest` at the
// start of every following line: blockquote marks every line ("> "), a list
// item marks the first (" * ") and indents the rest to align nested content.
type BlockPrefix = { first: string; rest: string };

// Everything tag-specific about how a block separates from its surroundings.
type Block = { open: number; close: number; prefix?: BlockPrefix };

// html-to-text's default separation for the block tags implemented so far.
// Tags absent here (and not handled in `enterNode`) are treated as inline
// and contribute no separation — notably td/tr, which is why table cells run
// together, matching `toPlainText` today. Only extend this alongside a spec
// case verifying the behavior against `toPlainText`.
const TAG_BLOCKS: Record<string, Block> = {
  article: { open: 2, close: 2 },
  aside: { open: 2, close: 2 },
  blockquote: { open: 2, close: 2, prefix: { first: '> ', rest: '> ' } },
  div: { open: 2, close: 2 },
  footer: { open: 2, close: 2 },
  form: { open: 2, close: 2 },
  h1: { open: 3, close: 2 },
  h2: { open: 3, close: 2 },
  h3: { open: 3, close: 2 },
  h4: { open: 3, close: 2 },
  h5: { open: 3, close: 2 },
  h6: { open: 3, close: 2 },
  header: { open: 2, close: 2 },
  hr: { open: 2, close: 2 },
  main: { open: 2, close: 2 },
  nav: { open: 2, close: 2 },
  p: { open: 2, close: 2 },
  pre: { open: 2, close: 2 },
  section: { open: 2, close: 2 },
  table: { open: 2, close: 2 },
};

interface OpenBlock {
  block: Block;
  text: string[];
  leading: number;
  stash: number;
  space: boolean;
}

interface OrderedList {
  next: number;
  prefixLength: number;
  nested: boolean;
}

interface WalkFrame {
  // the element whose children this frame is iterating, or undefined at root
  parent: ITag | undefined;
  children: INode[];
  index: number;
  pre: boolean;
  // whether this element opened a block, to be closed back on exit
  opened: boolean;
  // content length of the enclosing block when this element was entered;
  // exit of an <a> reads back the text written since
  textFrom: number;
  orderedList: OrderedList | undefined;
}

export function toPlainTextUnstable(html: string): string {
  const tree = parse(html, { setAttributeMap: true });
  const body = findBody(tree);

  const blocks: OpenBlock[] = [
    {
      block: { open: 0, close: 0 },
      text: [],
      leading: 0,
      stash: 0,
      space: false,
    },
  ];
  const stack: WalkFrame[] = [
    {
      parent: body,
      children: body?.body ?? tree,
      index: 0,
      pre: false,
      opened: false,
      textFrom: 0,
      orderedList: undefined,
    },
  ];

  while (stack.length > 0) {
    const frame = stack[stack.length - 1];
    const node = frame.children[frame.index];
    if (node === undefined) {
      // children exhausted: the element ends here, the only moment its
      // exit effects can go out — they must follow the subtree's content
      stack.pop();
      exitElement(frame.parent, frame);
      continue;
    }
    frame.index += 1;
    enterNode(node, frame);
  }

  function top(): OpenBlock {
    return blocks[blocks.length - 1];
  }

  function writeWord(value: string) {
    const block = top();
    if (block.stash > 0) block.text.push('\n'.repeat(block.stash));
    else if (block.space && block.text.length > 0) block.text.push(' ');
    block.stash = 0;
    block.space = false;
    block.text.push(value);
  }

  // enterNode descends into an element by pushing its frame; skipped
  // subtrees are skipped by simply not pushing
  function enterNode(node: INode, frame: WalkFrame) {
    if (node.type === SyntaxKind.Text) {
      const value = decodeHTML(node.value);
      if (frame.pre) {
        // whitespace is significant inside <pre>: one verbatim word,
        // newlines and all, so it never goes through collapsing
        if (value.length > 0) {
          writeWord(value);
        }
      } else {
        // splitting on a capturing group alternates strictly: even indices
        // are the words, odd indices are the whitespace runs between them —
        // so parity alone says which, no need to re-match each segment
        const segments = value.split(WHITESPACE_RUN);
        for (let i = 0; i < segments.length; i++) {
          const segment = segments[i];
          if (segment.length === 0) continue;
          if (i % 2 === 1) {
            top().space = true;
          } else {
            writeWord(segment);
          }
        }
      }
      return;
    }
    if (
      SKIPPED_TAGS.has(node.name) ||
      decodeHTMLAttribute(
        node.attributeMap?.['data-skip-in-text']?.value?.value ?? '',
      ) === 'true'
    ) {
      return;
    }

    const parentTag = frame.parent?.name;

    let block: Block | undefined = TAG_BLOCKS[node.name];
    let orderedList: OrderedList | undefined;
    if (node.name === 'ul') {
      // a list directly inside an <li> sits closer to its parent item:
      // single line breaks both ways (html-to-text's isNestedList)
      const breaks = parentTag === 'li' ? 1 : 2;
      block = { open: breaks, close: breaks };
    } else if (node.name === 'li' && parentTag === 'ul') {
      // whether the enclosing list is itself nested decides the item's
      // prefix; `frame` belongs to that list, so the list's own parent is
      // one frame below the top of the stack
      const grandparent = stack[stack.length - 2]?.parent;
      const inNestedList = grandparent?.name === 'li';
      block = {
        open: 1,
        close: 1,
        prefix: inNestedList
          ? { first: '* ', rest: '  ' }
          : { first: ' * ', rest: '   ' },
      };
    } else if (node.name === 'ol') {
      const nested = parentTag === 'li';
      const start = Number(
        decodeHTMLAttribute(node.attributeMap?.start?.value?.value ?? '1'),
      );
      const itemCount =
        node.body?.filter(
          (child) => child.type === SyntaxKind.Tag && child.name === 'li',
        ).length ?? 0;
      let prefixLength = 0;
      for (let index = start; index < start + itemCount; index++) {
        const prefix = `${nested ? '' : ' '}${index}. `;
        prefixLength = Math.max(prefixLength, prefix.length);
      }
      const breaks = nested ? 1 : 2;
      block = { open: breaks, close: breaks };
      orderedList = { next: start, prefixLength, nested };
    } else if (node.name === 'li' && parentTag === 'ol' && frame.orderedList) {
      const list = frame.orderedList;
      const prefix = `${list.nested ? '' : ' '}${list.next++}. `.padEnd(
        list.prefixLength,
      );
      block = {
        open: 1,
        close: 1,
        prefix: { first: prefix, rest: ' '.repeat(list.prefixLength) },
      };
    }

    if (block) {
      blocks.push({
        block,
        text: [],
        leading: block.open,
        stash: 0,
        space: false,
      });
    }

    if (node.name === 'hr') {
      writeWord('-'.repeat(40));
    } else if (node.name === 'br') {
      top().space = false;
      top().text.push('\n');
    }

    stack.push({
      parent: node,
      children: node.body ?? [],
      index: 0,
      pre: frame.pre || node.name === 'pre',
      opened: block !== undefined,
      textFrom: top().text.length,
      orderedList,
    });
  }

  function exitElement(element: ITag | undefined, frame: WalkFrame) {
    if (element === undefined) return;

    if (element.name === 'a') {
      const href = decodeHTMLAttribute(
        element.attributeMap?.href?.value?.value ?? '',
      ).replace(/^mailto:/, '');
      // fragment-only hrefs are suppressed (html-to-text's noAnchorUrl)
      if (href.length > 0 && !href.startsWith('#')) {
        // the enclosing block's content doubles as the buffer of the
        // anchor's text: what was written since the anchor opened is
        // compared against the href to decide whether to append it
        // (html-to-text's hideLinkHrefIfSameAsText, which `toPlainText`
        // enables)
        const anchorText = top().text.slice(frame.textFrom).join('');
        if (anchorText !== href) {
          if (anchorText.length > 0) top().space = true;
          writeWord(href);
        }
      }
    }

    if (frame.opened) {
      closeBlock();
    }
  }

  function closeBlock() {
    const child = blocks.pop();
    if (child === undefined) return;
    const parent = blocks[blocks.length - 1];

    let content = child.text.join('');
    const prefix = child.block.prefix;
    if (prefix !== undefined) {
      const trimmed = content.replace(/^\n+|\n+$/g, '');
      content = prefix.first + trimmed.replaceAll('\n', `\n${prefix.rest}`);
    }

    const breaks = Math.max(parent.stash, child.leading);
    if (parent.text.length > 0) {
      parent.text.push('\n'.repeat(breaks));
      if (content.length > 0) parent.text.push(content);
    } else {
      // nothing to separate from yet: the separation propagates upward
      // instead of materializing — this is edge suppression, and also how
      // empty blocks nested in empty blocks still commit their breaks
      if (content.length > 0) parent.text.push(content);
      parent.leading = breaks;
    }
    parent.stash = Math.max(child.stash, child.block.close);
  }

  return blocks[0].text.join('');
}

function findBody(tree: INode[]): ITag | undefined {
  for (const child of tree) {
    if (child.type !== SyntaxKind.Tag || child.name !== 'html') continue;
    for (const inner of child.body ?? []) {
      if (inner.type === SyntaxKind.Tag && inner.name === 'body') return inner;
    }
  }
  return undefined;
}
