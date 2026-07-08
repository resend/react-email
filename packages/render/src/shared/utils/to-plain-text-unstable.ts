import type { Element, Root } from 'hast';
import { fromHtml } from 'hast-util-from-html';

type ParentNode = Root | Element;

// html-to-text's default leading/trailing line-break counts for the block
// tags implemented so far ([leading, trailing]). Tags absent here are
// treated as inline and contribute no separation — notably td/tr, which is
// why table cells run together, matching `toPlainText` today. Only extend
// this alongside a spec case verifying the count against `toPlainText`.
const BLOCK_BREAKS: Record<string, [leading: number, trailing: number]> = {
  article: [1, 1],
  aside: [1, 1],
  blockquote: [2, 2],
  div: [1, 1],
  footer: [1, 1],
  form: [1, 1],
  h1: [3, 2],
  h2: [3, 2],
  h3: [3, 2],
  h4: [2, 2],
  h5: [2, 2],
  h6: [2, 2],
  header: [1, 1],
  hr: [2, 2],
  main: [1, 1],
  nav: [1, 1],
  p: [2, 2],
  section: [1, 1],
  table: [2, 2],
};

const HEADING_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

const SKIPPED_TAGS = new Set([
  'img',
  'noscript',
  'script',
  'style',
  'template',
]);

// The conversion is split in two so that break semantics can be reasoned
// about (and tested) over a flat sequence instead of mid-traversal state:
// `tokenize` walks the tree and only says what separates content and by how
// much; `joinTokens` owns every rule about how separations collapse.
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
  let uppercase = 0;

  // One frame per element whose children are being walked; a frame's index
  // running past its children is the moment the walk knows the element has
  // ended. `textFrom` records where the element's content started in the
  // token stream, for the anchor handling above.
  const stack: { parent: ParentNode; index: number; textFrom: number }[] = [
    { parent: findBody(tree) ?? tree, index: 0, textFrom: 0 },
  ];
  while (stack.length > 0) {
    const top = stack[stack.length - 1];
    const node = top.parent.children[top.index];
    if (node === undefined) {
      stack.pop();
      if (top.parent.type === 'element') exitElement(top.parent, top.textFrom);
      continue;
    }
    top.index += 1;

    if (node.type === 'text') {
      for (const segment of node.value.split(/([ \t\n\r\f\u200b]+)/)) {
        if (segment.length === 0) continue;
        if (/^[ \t\n\r\f\u200b]/.test(segment)) {
          tokens.push({ type: 'space' });
        } else {
          tokens.push({
            type: 'word',
            value: uppercase > 0 ? segment.toUpperCase() : segment,
          });
        }
      }
    } else if (node.type === 'element') {
      if (SKIPPED_TAGS.has(node.tagName) || node.properties.dataSkipInText) {
        continue;
      }

      const breaks = BLOCK_BREAKS[node.tagName];
      if (breaks) {
        tokens.push({ type: 'open-block', breaks: breaks[0] });
      }

      if (HEADING_TAGS.has(node.tagName)) {
        uppercase += 1;
      }

      if (node.tagName === 'hr') {
        tokens.push({ type: 'word', value: '-'.repeat(40) });
      } else if (node.tagName === 'br') {
        tokens.push({ type: 'hard-break' });
      }

      stack.push({ parent: node, index: 0, textFrom: tokens.length });
    }
  }

  function exitElement(element: Element, textFrom: number) {
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
        for (let i = textFrom; i < tokens.length; i++) {
          const token = tokens[i];
          if (token.type === 'word') anchorText += token.value;
        }
        if (anchorText !== href) {
          if (anchorText.length > 0) tokens.push({ type: 'space' });
          tokens.push({ type: 'word', value: href });
        }
      }
    }
    const breaks = BLOCK_BREAKS[element.tagName];
    if (breaks) tokens.push({ type: 'close-block', breaks: breaks[1] });
    if (HEADING_TAGS.has(element.tagName)) uppercase -= 1;
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
        if (writesOnOpen.pop() === writes && text.length > 0) payPending();
        pendingBreaks = Math.max(pendingBreaks, token.breaks);
        break;
    }
  }
  return text.join('') + '\n'.repeat(hardBreaks);
}
