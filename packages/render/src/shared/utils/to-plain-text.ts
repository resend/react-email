import type { Element, ElementContent, Root } from 'hast';
import { fromHtml } from 'hast-util-from-html';
import {
  convert,
  type HtmlToTextOptions,
  type SelectorDefinition,
} from 'html-to-text';

export const plainTextSelectors: SelectorDefinition[] = [
  { selector: 'img', format: 'skip' },
  { selector: '[data-skip-in-text=true]', format: 'skip' },
  {
    selector: 'a',
    options: { linkBrackets: false, hideLinkHrefIfSameAsText: true },
  },
];

const SKIPPED_TAGS = new Set([
  'head',
  'link',
  'meta',
  'noscript',
  'script',
  'style',
  'template',
  'title',
  'img',
]);

const HEADING_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

/**
 * Line breaks that surround each block-level tag, mirroring the defaults of
 * `html-to-text` (its `leadingLineBreaks`/`trailingLineBreaks` per block).
 * Between two blocks the larger of the two adjacent values wins.
 */
const BLOCK_BREAKS: Record<string, { leading: number; trailing: number }> = {
  address: { leading: 2, trailing: 2 },
  article: { leading: 2, trailing: 2 },
  aside: { leading: 2, trailing: 2 },
  blockquote: { leading: 2, trailing: 2 },
  div: { leading: 1, trailing: 1 },
  figure: { leading: 2, trailing: 2 },
  footer: { leading: 2, trailing: 2 },
  h1: { leading: 3, trailing: 2 },
  h2: { leading: 3, trailing: 2 },
  h3: { leading: 3, trailing: 2 },
  h4: { leading: 2, trailing: 2 },
  h5: { leading: 2, trailing: 2 },
  h6: { leading: 2, trailing: 2 },
  header: { leading: 2, trailing: 2 },
  hr: { leading: 2, trailing: 2 },
  main: { leading: 2, trailing: 2 },
  nav: { leading: 2, trailing: 2 },
  ol: { leading: 2, trailing: 2 },
  p: { leading: 2, trailing: 2 },
  pre: { leading: 2, trailing: 2 },
  section: { leading: 2, trailing: 2 },
  table: { leading: 2, trailing: 2 },
  ul: { leading: 2, trailing: 2 },
};

type Chunk = { break: number } | { text: string };

class PlainTextBuilder {
  private chunks: Chunk[] = [];

  addBreak(count: number): void {
    const last = this.chunks[this.chunks.length - 1];
    if (last && 'break' in last) {
      last.break = Math.max(last.break, count);
    } else {
      this.chunks.push({ break: count });
    }
  }

  addText(text: string, preformatted = false): void {
    const collapsed = preformatted ? text : text.replace(/[ \t\r\n\f]+/g, ' ');
    if (collapsed.length === 0 || (!preformatted && collapsed === ' ')) {
      // Whitespace-only inline text collapses into block spacing rather than
      // producing stray space-only lines.
      if (/[ \t\r\n\f]/.test(text)) this.pendingSpace = true;
      return;
    }
    const last = this.chunks[this.chunks.length - 1];
    const space = this.pendingSpace && last && 'text' in last ? ' ' : '';
    this.pendingSpace = false;
    if (last && 'text' in last) {
      last.text += space + collapsed;
    } else {
      this.chunks.push({ text: collapsed.replace(/^[ \t\r\n\f]+/, '') });
    }
  }

  private pendingSpace = false;

  toString(): string {
    let out = '';
    for (const [i, chunk] of this.chunks.entries()) {
      if ('break' in chunk) {
        if (i > 0 && i < this.chunks.length - 1) {
          out = out.replace(/[ \t]+$/, '');
          out += '\n'.repeat(chunk.break);
        }
      } else {
        out += chunk.text;
      }
    }
    return out.trim();
  }
}

function elementText(node: ElementContent): string {
  if (node.type === 'text') return node.value;
  if (node.type === 'element')
    return node.children.map(elementText).join('');
  return '';
}

function walk(
  nodes: ElementContent[],
  builder: PlainTextBuilder,
  context: { uppercase: boolean; preformatted: boolean },
): void {
  for (const node of nodes) {
    if (node.type === 'text') {
      const value = context.uppercase ? node.value.toUpperCase() : node.value;
      builder.addText(value, context.preformatted);
      continue;
    }
    if (node.type !== 'element') continue;
    const element: Element = node;
    const tag = element.tagName;

    if (SKIPPED_TAGS.has(tag)) continue;
    if (element.properties['dataSkipInText'] === 'true') continue;

    if (tag === 'br') {
      builder.addBreak(1);
      continue;
    }

    const block = BLOCK_BREAKS[tag];
    if (block) builder.addBreak(block.leading);

    if (tag === 'hr') {
      builder.addText('-'.repeat(40));
    } else if (tag === 'a') {
      walk(element.children, builder, context);
      const href = element.properties.href;
      const text = elementText(element).replace(/[ \t\r\n\f]+/g, ' ').trim();
      if (
        typeof href === 'string' &&
        href.length > 0 &&
        !href.startsWith('#') &&
        href !== text
      ) {
        builder.addText(` ${href.startsWith('mailto:') ? href.slice(7) : href}`);
      }
    } else {
      walk(element.children, builder, {
        uppercase: context.uppercase || HEADING_TAGS.has(tag),
        preformatted: context.preformatted || tag === 'pre',
      });
    }

    if (block) builder.addBreak(block.trailing);
    if (tag === 'td' || tag === 'th') builder.addText(' ');
  }
}

function hastToPlainText(html: string): string {
  const root: Root = fromHtml(html);
  const builder = new PlainTextBuilder();
  walk(root.children as ElementContent[], builder, {
    uppercase: false,
    preformatted: false,
  });
  return builder.toString();
}

/**
 * Converts the rendered email HTML into a plain text version, mirroring the
 * long-standing `html-to-text` defaults: images and `data-skip-in-text=true`
 * elements are skipped, headings are uppercased, and link hrefs are appended
 * without brackets unless they match the link text.
 *
 * When `options` are passed the conversion still goes through the deprecated
 * `html-to-text` package so existing behavior is preserved; that path is
 * scheduled for removal in the next major version (see #2961).
 */
export function toPlainText(html: string, options?: HtmlToTextOptions) {
  if (options === undefined) {
    return hastToPlainText(html);
  }
  return convert(html, {
    wordwrap: false,
    ...options,
    selectors: [...plainTextSelectors, ...(options.selectors ?? [])],
  });
}
