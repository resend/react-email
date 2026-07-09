import type { Comment, Doctype, Element, Root, Text } from 'hast';
import { fromHtml } from 'hast-util-from-html';

type ParentNode = Root | Element;

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

// Everything tag-specific about how a block separates from its
// surroundings. Decided once when the element is entered and carried whole
// on its open-block token; the close token stays bare.
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

type Token =
  | { type: 'word'; value: string }
  | { type: 'space' }
  | { type: 'hard-break' }
  | { type: 'open-block'; block: Block }
  | { type: 'close-block' };

export function toPlainTextUnstable(html: string): string {
  return joinTokens(tokenize(fromHtml(html)));
}

// fromHtml always parses a full document, so the shape is fixed:
// the root holds <html>, which holds <head> and <body> directly
function findBody(tree: Root): Element {
  for (const child of tree.children) {
    if (child.type !== 'element' || child.tagName !== 'html') continue;
    for (const inner of child.children) {
      if (inner.type === 'element' && inner.tagName === 'body') return inner;
    }
  }
  throw new Error('there is no body, this can never happen');
}

interface TokenizeFrame {
  // the element whose children this frame is iterating
  parent: ParentNode;
  index: number;
  // where this element's content starts in the token stream
  textFrom: number;
  pre: boolean;
  // the block this element opened, if any, closed back on exit
  block: Block | undefined;
}

function tokenize(tree: Root): Token[] {
  const tokens: Token[] = [];
  const stack: TokenizeFrame[] = [
    {
      parent: findBody(tree),
      index: 0,
      textFrom: 0,
      pre: false,
      block: undefined,
    },
  ];

  while (stack.length > 0) {
    const frame = stack[stack.length - 1];
    const node = frame.parent.children[frame.index];
    if (node === undefined) {
      // children exhausted: the element ends here, the only moment its
      // exit effects can go out — they must follow the subtree's tokens
      stack.pop();
      exitElement(frame.parent, frame);
    } else {
      enterNode(node, frame);

      frame.index += 1;
    }
  }

  // enterNode descends into an element by pushing its frame; skipped
  // subtrees are skipped by simply not pushing
  function enterNode(
    node: Element | Comment | Doctype | Text,
    frame: TokenizeFrame,
  ) {
    if (node.type === 'text') {
      if (frame.pre) {
        // whitespace is significant inside <pre>: one verbatim word,
        // newlines and all, so the reducer never collapses it
        if (node.value.length > 0) {
          tokens.push({ type: 'word', value: node.value });
        }
      } else {
        // splitting on a capturing group alternates strictly: even
        // indices are the words, odd indices are the whitespace runs
        // between them — so parity alone says which, no need to
        // re-match each segment against the whitespace class
        const segments = node.value.split(WHITESPACE_RUN);
        for (let i = 0; i < segments.length; i++) {
          const segment = segments[i];
          if (segment.length === 0) continue;
          if (i % 2 === 1) {
            tokens.push({ type: 'space' });
          } else {
            tokens.push({ type: 'word', value: segment });
          }
        }
      }
      return;
    }
    if (node.type !== 'element') return;

    if (SKIPPED_TAGS.has(node.tagName) || node.properties.dataSkipInText) {
      return;
    }

    const parentTag =
      frame.parent.type === 'element' ? frame.parent.tagName : undefined;

    let block: Block | undefined = TAG_BLOCKS[node.tagName];
    if (node.tagName === 'ul') {
      // a list directly inside an <li> sits closer to its parent item:
      // single line breaks both ways (html-to-text's isNestedList)
      const breaks = parentTag === 'li' ? 1 : 2;
      block = { open: breaks, close: breaks };
    } else if (node.tagName === 'li' && parentTag === 'ul') {
      // whether the enclosing list is itself nested decides the item's
      // prefix; `frame` belongs to that list, so the list's own parent is
      // one frame below the top of the stack
      const grandparent = stack[stack.length - 2]?.parent;
      const inNestedList =
        grandparent?.type === 'element' && grandparent.tagName === 'li';
      block = {
        open: 1,
        close: 1,
        prefix: inNestedList
          ? { first: '* ', rest: '  ' }
          : { first: ' * ', rest: '   ' },
      };
    }

    if (block) {
      tokens.push({ type: 'open-block', block });
    }

    if (node.tagName === 'hr') {
      tokens.push({ type: 'word', value: '-'.repeat(40) });
    } else if (node.tagName === 'br') {
      tokens.push({ type: 'hard-break' });
    }

    stack.push({
      parent: node,
      index: 0,
      textFrom: tokens.length,
      pre: frame.pre || node.tagName === 'pre',
      block,
    });
  }

  function exitElement(element: ParentNode, frame: TokenizeFrame) {
    if (element.type !== 'element') return;

    if (element.tagName === 'a') {
      const href =
        typeof element.properties.href === 'string'
          ? element.properties.href.replace(/^mailto:/, '')
          : '';
      // fragment-only hrefs are suppressed (html-to-text's noAnchorUrl)
      if (href.length > 0 && !href.startsWith('#')) {
        // The token stream doubles as the buffer of the anchor's text: the
        // words emitted since the anchor opened are compared against the
        // href to decide whether to append it (html-to-text's
        // hideLinkHrefIfSameAsText, which `toPlainText` enables).
        let anchorText = '';
        for (let i = frame.textFrom; i < tokens.length; i++) {
          const token = tokens[i];
          if (token.type === 'word') anchorText += token.value;
        }
        if (anchorText !== href) {
          if (anchorText.length > 0) tokens.push({ type: 'space' });
          tokens.push({ type: 'word', value: href });
        }
      }
    }

    if (frame.block) {
      tokens.push({ type: 'close-block' });
    }
  }

  return tokens;
}

// Block separation between two words is the max of every boundary crossed
// (`</p><p>` is two breaks, not four) and never materializes at the output's
// edges; both fall out of breaks staying pending until the next word pays
// them. Two exceptions: hard breaks (<br>) stack additively and survive the
// edges, and an empty block sitting between content acts like a zero-width
// word — it pays the pending breaks itself, so the separation on each side
// of it commits instead of collapsing into one max
// (`<p>A</p><p></p><p>B</p>` is four newlines, not two).
function joinTokens(tokens: Token[]): string {
  const text: string[] = [];
  let pendingBreaks = 0;
  let pendingSpace = false;
  let hardBreaks = 0;
  // Per open block: its descriptor (close tokens are bare, so the close
  // breaks ride here) and where its content starts in `text` — a block
  // closing while `text` hasn't grown past it was empty, and prefixed
  // blocks transform everything from there on close.
  const openBlocks: { textFrom: number; block: Block }[] = [];

  function payPending() {
    const breaks = hardBreaks + (text.length > 0 ? pendingBreaks : 0);
    if (breaks > 0) text.push('\n'.repeat(breaks));
    else if (text.length > 0 && pendingSpace) text.push(' ');
    pendingBreaks = 0;
    pendingSpace = false;
    hardBreaks = 0;
  }

  for (const token of tokens) {
    switch (token.type) {
      case 'word':
        payPending();
        text.push(token.value);
        break;
      case 'space':
        pendingSpace = true;
        break;
      case 'hard-break':
        hardBreaks += 1;
        break;
      case 'open-block':
        pendingBreaks = Math.max(pendingBreaks, token.block.open);
        openBlocks.push({ textFrom: text.length, block: token.block });
        break;
      case 'close-block': {
        const open = openBlocks.pop();
        if (open === undefined) break;
        if (open.textFrom === text.length && text.length > 0) {
          payPending();
        }
        const prefix = open.block.prefix;
        if (prefix !== undefined) {
          let from = open.textFrom;
          // the separation paid by the block's first word sits at the start
          // of its range but belongs outside the prefix
          if (/^\n+$/.test(text[from] ?? '')) from += 1;
          const content = text
            .splice(from)
            .join('')
            .replace(/^\n+|\n+$/g, '');
          text.push(
            prefix.first + content.replaceAll('\n', `\n${prefix.rest}`),
          );
        }
        pendingBreaks = Math.max(pendingBreaks, open.block.close);
        break;
      }
    }
  }
  return text.join('') + '\n'.repeat(hardBreaks);
}
