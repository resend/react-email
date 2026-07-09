import type { Comment, Doctype, Element, Root, Text } from 'hast';
import { fromHtml } from 'hast-util-from-html';

type ParentNode = Root | Element;

const BLOCK_TAGS = new Set([
  'article',
  'aside',
  'blockquote',
  'div',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hr',
  'main',
  'nav',
  'p',
  'pre',
  'section',
  'table',
]);

const HEADING_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

const SKIPPED_TAGS = new Set([
  'img',
  'noscript',
  'script',
  'style',
  'template',
]);

// A block prefix puts `first` before the block's content and `rest` at the
// start of every following line: blockquote marks every line ("> "), a list
// item marks the first (" * ") and indents the rest to align nested content.
type BlockPrefix = { first: string; rest: string };

type Token =
  | { type: 'word'; value: string }
  | { type: 'space' }
  | { type: 'hard-break' }
  | { type: 'open-block'; breaks: number; prefix?: BlockPrefix }
  | { type: 'close-block'; breaks: number };

export function toPlainTextUnstable(html: string): string {
  return joinTokens(tokenize(fromHtml(html)));
}

function findBody(node: ParentNode): Element | undefined {
  for (const child of node.children) {
    if (child.type !== 'element') continue;
    if (child.tagName === 'body') return child;
    const body = findBody(child);
    if (body !== undefined) return body;
  }
  return undefined;
}

interface Frame {
  parent: ParentNode;
  index: number;
}

function walk<T extends object>(options: {
  root: ParentNode;
  rootData: T;
  // frame data for an element the walk is about to descend into; computed
  // from the frame it's entered from, so facts about an element's own
  // parent (e.g. its tag) only ever need deriving once, here, rather than
  // wherever they're later needed
  init(node: Element, parentFrame: Frame & T): T;
  // returning false skips the element's entire subtree
  enter(
    node: Element | Comment | Doctype | Text,
    frame: Frame & T,
  ): boolean | undefined;
  exit(node: ParentNode, frame: Frame & T): void;
}) {
  const stack: (Frame & T)[] = [
    { parent: options.root, index: 0, ...options.rootData },
  ];
  while (stack.length > 0) {
    const frame = stack[stack.length - 1];
    const node = frame.parent.children[frame.index];
    if (node === undefined) {
      stack.pop();
      options.exit(frame.parent, frame);
      continue;
    }

    frame.index += 1;
    const descend = options.enter(node, frame);
    if (node.type === 'element' && descend !== false) {
      stack.push({ parent: node, index: 0, ...options.init(node, frame) });
    }
  }
}

interface TokenizeFrameData {
  textFrom: number;
  pre: boolean;
  // the tag of this frame's own parent element, if any — an <li> under a
  // nested <ul> reads this off the ul's frame to learn about its grandparent
  // without walking the stack itself
  parentTag: string | undefined;
}

function tokenize(tree: Root): Token[] {
  const tokens: Token[] = [];

  walk<TokenizeFrameData>({
    root: findBody(tree) ?? tree,
    rootData: {
      textFrom: 0,
      pre: false,
      parentTag: undefined,
    },
    init: (node, parentFrame) => ({
      textFrom: tokens.length,
      pre: parentFrame.pre || node.tagName === 'pre',
      parentTag:
        parentFrame.parent.type === 'element'
          ? parentFrame.parent.tagName
          : undefined,
    }),
    enter(node, frame) {
      if (node.type === 'text') {
        if (frame.pre) {
          // whitespace is significant inside <pre>: one verbatim word,
          // newlines and all, so the reducer never collapses it
          if (node.value.length > 0) {
            tokens.push({ type: 'word', value: node.value });
          }
        } else {
          for (const segment of node.value.split(/([ \t\n\r\f\u200b]+)/)) {
            if (segment.length === 0) continue;
            if (/^[ \t\n\r\f\u200b]/.test(segment)) {
              tokens.push({ type: 'space' });
            } else {
              tokens.push({ type: 'word', value: segment });
            }
          }
        }
      } else if (node.type === 'element') {
        if (SKIPPED_TAGS.has(node.tagName) || node.properties.dataSkipInText) {
          return false;
        }

        if (BLOCK_TAGS.has(node.tagName)) {
          tokens.push({
            type: 'open-block',
            breaks: HEADING_TAGS.has(node.tagName) ? 3 : 2,
            prefix:
              node.tagName === 'blockquote'
                ? { first: '> ', rest: '> ' }
                : undefined,
          });
        } else if (node.tagName === 'ul') {
          // a list directly inside an <li> sits closer to its parent item:
          // single line breaks (html-to-text's isNestedList). `frame` is
          // this <ul>'s own enclosing frame, so its parent is one hop away.
          const nested =
            frame.parent.type === 'element' && frame.parent.tagName === 'li';
          tokens.push({ type: 'open-block', breaks: nested ? 1 : 2 });
        } else if (
          node.tagName === 'li' &&
          frame.parent.type === 'element' &&
          frame.parent.tagName === 'ul'
        ) {
          // `frame` is the enclosing <ul>'s own frame, so its `parentTag`
          // (the ul's parent) tells us whether that ul is itself nested
          const inNestedList = frame.parentTag === 'li';
          tokens.push({
            type: 'open-block',
            breaks: 1,
            prefix: inNestedList
              ? { first: '* ', rest: '  ' }
              : { first: ' * ', rest: '   ' },
          });
        }

        if (node.tagName === 'hr') {
          tokens.push({ type: 'word', value: '-'.repeat(40) });
        } else if (node.tagName === 'br') {
          tokens.push({ type: 'hard-break' });
        }
      }
    },
    exit(node, frame) {
      if (node.type === 'element') {
        if (node.tagName === 'a') {
          const href =
            typeof node.properties.href === 'string'
              ? node.properties.href.replace(/^mailto:/, '')
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

        if (BLOCK_TAGS.has(node.tagName)) {
          tokens.push({ type: 'close-block', breaks: 2 });
        } else if (node.tagName === 'ul') {
          tokens.push({
            type: 'close-block',
            breaks: frame.parentTag === 'li' ? 1 : 2,
          });
        } else if (node.tagName === 'li' && frame.parentTag === 'ul') {
          tokens.push({ type: 'close-block', breaks: 1 });
        }
      }
    },
  });

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
  // Per open block: where its content starts in `text`. Serves double duty —
  // a block closing while `text` hasn't grown past it was empty, and prefixed
  // blocks transform everything from there on close.
  const openBlocks: { textFrom: number; prefix?: BlockPrefix }[] = [];

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
        pendingBreaks = Math.max(pendingBreaks, token.breaks);
        openBlocks.push({ textFrom: text.length, prefix: token.prefix });
        break;
      case 'close-block': {
        const block = openBlocks.pop();
        if (block !== undefined) {
          if (block.textFrom === text.length && text.length > 0) {
            payPending();
          }
          const prefix = block.prefix;
          if (prefix !== undefined) {
            let from = block.textFrom;
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
        }
        pendingBreaks = Math.max(pendingBreaks, token.breaks);
        break;
      }
    }
  }
  return text.join('') + '\n'.repeat(hardBreaks);
}
