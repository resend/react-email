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

export async function toPlainTextUnstable(html: string): Promise<string> {
  const tree = fromHtml(html);

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

  const text: string[] = [];
  // Separation between two pieces of text is the max of every block
  // boundary crossed between them, never the sum: `</p><p>` is two breaks,
  // not four. And breaks bordering the start or end of the output never
  // materialize. Both fall out of making closes and opens only *raise*
  // `pendingBreaks`, with the next word paying it — at the moment a block
  // ends there's no way to know yet whether more text follows.
  let pendingBreaks = 0;
  let pendingSpace = false;
  let uppercase = 0;

  function writeWord(word: string) {
    if (text.length > 0) {
      if (pendingBreaks > 0) text.push('\n'.repeat(pendingBreaks));
      else if (pendingSpace) text.push(' ');
    }
    pendingBreaks = 0;
    pendingSpace = false;
    text.push(uppercase > 0 ? word.toUpperCase() : word);
  }

  function exitElement(element: Element) {
    const breaks = BLOCK_BREAKS[element.tagName];
    if (breaks) pendingBreaks = Math.max(pendingBreaks, breaks[1]);
    if (HEADING_TAGS.has(element.tagName)) uppercase -= 1;
  }

  let node = firstChild(body ?? tree);
  while (node !== undefined) {
    if (node.type === 'text') {
      for (const segment of node.value.split(/([ \t\n\r\f]+)/)) {
        if (segment.length > 0) {
          if (/^[ \t\n\r\f]/.test(segment)) {
            pendingSpace = true;
          } else {
            writeWord(segment);
          }
        }
      }
    } else if (node.type === 'element') {
      const skipped =
        SKIPPED_TAGS.has(node.tagName) || node.properties.dataSkipInText;

      if (!skipped) {
        const breaks = BLOCK_BREAKS[node.tagName];
        if (breaks) {
          pendingBreaks = Math.max(pendingBreaks, breaks[0]);
        }

        if (HEADING_TAGS.has(node.tagName)) {
          uppercase += 1;
        }

        if (node.tagName === 'hr') {
          writeWord('-'.repeat(40));
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
  return text.join('');
}
