import type { Element, Root } from 'hast';
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

type Token =
  | { type: 'word'; value: string }
  | { type: 'space' }
  | { type: 'hard-break' }
  | { type: 'open-block'; breaks: number }
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

function tokenize(tree: Root): Token[] {
  const tokens: Token[] = [];

  const stack: {
    parent: ParentNode;
    index: number;
    textFrom: number;
    pre: boolean;
  }[] = [{ parent: findBody(tree) ?? tree, index: 0, textFrom: 0, pre: false }];
  while (stack.length > 0) {
    const top = stack[stack.length - 1];
    const node = top.parent.children[top.index];
    if (node === undefined) {
      stack.pop();
      if (top.parent.type === 'element') {
        if (top.parent.tagName === 'a') {
          const href =
            typeof top.parent.properties.href === 'string'
              ? top.parent.properties.href.replace(/^mailto:/, '')
              : '';
          // fragment-only hrefs are suppressed (html-to-text's noAnchorUrl)
          if (href.length > 0 && !href.startsWith('#')) {
            // The token stream doubles as the buffer of the anchor's text: the
            // words emitted since the anchor opened are compared against the
            // href to decide whether to append it (html-to-text's
            // hideLinkHrefIfSameAsText, which `toPlainText` enables).
            let anchorText = '';
            for (let i = top.textFrom; i < tokens.length; i++) {
              const token = tokens[i];
              if (token.type === 'word') anchorText += token.value;
            }
            if (anchorText !== href) {
              if (anchorText.length > 0) tokens.push({ type: 'space' });
              tokens.push({ type: 'word', value: href });
            }
          }
        }

        if (BLOCK_TAGS.has(top.parent.tagName)) {
          tokens.push({ type: 'close-block', breaks: 2 });
        }
      }

      continue;
    }
    top.index += 1;

    if (node.type === 'text') {
      if (top.pre) {
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
        continue;
      }

      if (BLOCK_TAGS.has(node.tagName)) {
        tokens.push({
          type: 'open-block',
          breaks: HEADING_TAGS.has(node.tagName) ? 3 : 2,
        });
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
        pre: top.pre || node.tagName === 'pre',
      });
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
  let writes = 0;
  // the value of `writes` when each currently open block was entered; a
  // block closing while it still matches was empty
  const writesOnOpen: number[] = [];

  function payPending() {
    const breaks = hardBreaks + (text.length > 0 ? pendingBreaks : 0);
    if (breaks > 0) text.push('\n'.repeat(breaks));
    else if (text.length > 0 && pendingSpace) text.push(' ');
    pendingBreaks = 0;
    pendingSpace = false;
    hardBreaks = 0;
    writes += 1;
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
        writesOnOpen.push(writes);
        break;
      case 'close-block':
        if (writesOnOpen.pop() === writes && text.length > 0) {
          payPending();
        }
        pendingBreaks = Math.max(pendingBreaks, token.breaks);
        break;
    }
  }
  return text.join('') + '\n'.repeat(hardBreaks);
}
