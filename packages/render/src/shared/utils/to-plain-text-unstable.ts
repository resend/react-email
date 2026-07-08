import type { Element, ElementContent, Root, RootContent } from 'hast';
import { fromHtml } from 'hast-util-from-html';

type TreeNode = ElementContent | RootContent;
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

export async function toPlainTextUnstable(html: string): Promise<string> {
  return joinTokens(tokenize(fromHtml(html)));
}

function tokenize(tree: Root): Token[] {
  // hast nodes only carry `children` arrays: no parent or sibling links. So a
  // pointer-chasing walk has to record, on the way down, how it reached each
  // node — `firstChild` writes that link, `nextSibling` reads it back to move
  // forward, climbing out of ancestors whose children are exhausted. Each
  // ancestor climbed out of is reported through `onExit`: that climb is the
  // only moment the walk knows an element has ended.
  const positions = new WeakMap<
    object,
    { parent: ParentNode; index: number }
  >();

  function firstChild(node: ParentNode | TreeNode): TreeNode | undefined {
    if (!('children' in node)) return undefined;
    const child = node.children[0];
    if (child === undefined) return undefined;
    positions.set(child, { parent: node as ParentNode, index: 0 });
    return child;
  }

  function nextSibling(
    node: TreeNode,
    onExit?: (element: Element) => void,
  ): TreeNode | undefined {
    for (
      let position = positions.get(node);
      position !== undefined;
      position = positions.get(position.parent)
    ) {
      const sibling = position.parent.children[position.index + 1];
      if (sibling !== undefined) {
        positions.set(sibling, {
          parent: position.parent,
          index: position.index + 1,
        });
        return sibling;
      }
      if (position.parent.type === 'element') onExit?.(position.parent);
    }
    return undefined;
  }

  let body: Element | undefined;
  for (
    let node = firstChild(tree);
    node !== undefined;
    node = firstChild(node) ?? nextSibling(node)
  ) {
    if (node.type === 'element' && node.tagName === 'body') {
      body = node;
      break;
    }
  }

  const tokens: Token[] = [];
  let uppercase = 0;

  function exitElement(element: Element) {
    const breaks = BLOCK_BREAKS[element.tagName];
    if (breaks) tokens.push({ type: 'close-block', breaks: breaks[1] });
    if (HEADING_TAGS.has(element.tagName)) uppercase -= 1;
  }

  let node = firstChild(body ?? tree);
  while (node !== undefined) {
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
      const skipped =
        SKIPPED_TAGS.has(node.tagName) || node.properties.dataSkipInText;

      if (!skipped) {
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

        const child = firstChild(node);
        if (child !== undefined) {
          node = child;
          continue;
        }

        exitElement(node);
      }
    }

    node = nextSibling(node, exitElement);
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
  // one entry per currently open block: has anything been written inside it
  const wroteMarks: boolean[] = [];

  function payPending() {
    const breaks = hardBreaks + (text.length > 0 ? pendingBreaks : 0);
    if (breaks > 0) text.push('\n'.repeat(breaks));
    else if (text.length > 0 && pendingSpace) text.push(' ');
    pendingBreaks = 0;
    pendingSpace = false;
    hardBreaks = 0;
    wroteMarks.fill(true);
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
        wroteMarks.push(false);
        break;
      case 'close-block':
        if (!wroteMarks.pop() && text.length > 0) payPending();
        pendingBreaks = Math.max(pendingBreaks, token.breaks);
        break;
    }
  }
  return text.join('') + '\n'.repeat(hardBreaks);
}
