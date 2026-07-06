import type { Element, ElementContent, RootContent } from 'hast';

type TreeNode = ElementContent | RootContent;

type Chunk = {
  text: string;
  leading: number;
  trailing: number;
};

type Context = {
  uppercase: boolean;
  insideListItem?: boolean;
};

// A sentinel for a hard line break (`<br>`), distinct from ordinary
// whitespace: whitespace next to it collapses away entirely, same as at the
// edge of a block, while whitespace between words collapses to one space.
// Built at runtime, rather than written as a literal control character, so
// this file stays plain text.
const BREAK = String.fromCharCode(0);

// Mirrors html-to-text's default selectors for the tags relevant to
// react-email's plain-text output: leading/trailing line break counts per
// tag (`[leading, trailing]`), taken from its `HtmlToTextOptions` defaults.
const BLOCK_LEADING_TRAILING: Record<string, [number, number]> = {
  p: [2, 2],
  div: [1, 1],
  article: [1, 1],
  aside: [1, 1],
  footer: [1, 1],
  form: [1, 1],
  header: [1, 1],
  main: [1, 1],
  nav: [1, 1],
  section: [1, 1],
  h1: [3, 2],
  h2: [3, 2],
  h3: [3, 2],
  h4: [2, 2],
  h5: [2, 2],
  h6: [2, 2],
  hr: [2, 2],
  pre: [2, 2],
  blockquote: [2, 2],
  // Not in the `tables` opt-in list, so it gets block spacing but its rows
  // and cells (`tr`/`td`/`th`, absent from this map) stay inline with no
  // separation between them. This is the current default `toPlainText`
  // behavior too, kept as-is rather than "fixed" here: react-email's own
  // layout primitives (Row, Column, Section, Container, Body) all render
  // as nested tables, so this is what today's plain-text output already
  // looks like for most templates.
  table: [2, 2],
};

const HEADING_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
const SKIPPED_TAGS = new Set(['script', 'style', 'noscript', 'template']);

function isSkipped(el: Element): boolean {
  if (el.tagName === 'img' || SKIPPED_TAGS.has(el.tagName)) return true;
  const skip = el.properties.dataSkipInText;
  return skip === 'true' || skip === true;
}

function normalizeSegment(segment: string): string {
  return segment.split(/[ \t\n\r\f]+/).filter(Boolean).join(' ');
}

function renderInlineText(raw: string): string {
  return raw.split(BREAK).map(normalizeSegment).join('\n');
}

function getHref(el: Element): string {
  const href = el.properties.href;
  if (typeof href !== 'string' || !href) return '';
  return href.replace(/^mailto:/, '');
}

// Used only where a nested block element isn't a realistic case: anchor
// text and `<pre>` content.
function collectPlainText(nodes: TreeNode[], ctx: Context): string {
  let raw = '';
  for (const node of nodes) {
    if (node.type === 'text') {
      raw += ctx.uppercase ? node.value.toUpperCase() : node.value;
      continue;
    }
    if (node.type !== 'element') continue;
    if (isSkipped(node)) continue;
    if (node.tagName === 'br') {
      raw += BREAK;
      continue;
    }
    raw += collectPlainText(node.children, ctx);
  }
  return raw;
}

function collectAnchor(el: Element, ctx: Context): string {
  const href = getHref(el);
  if (!href) return collectPlainText(el.children, ctx);
  const text = collectPlainText(el.children, ctx);
  const visible = renderInlineText(text);
  return visible === href ? text : `${text} ${href}`;
}

function flushInline(chunks: Chunk[], buffer: { raw: string }): void {
  if (buffer.raw === '') return;
  chunks.push({ text: renderInlineText(buffer.raw), leading: 0, trailing: 0 });
  buffer.raw = '';
}

// Walks a sibling list, accumulating inline content (text, `<br>`, `<a>`,
// and any non-block wrapper tag such as `<span>`/`<tr>`/`<td>`) into a raw
// string shared across nesting depth, and splitting out a dedicated chunk
// whenever a block-level element shows up, at any depth. The shared buffer
// (rather than recursing into a fresh string each time) is what lets a
// block nested inside an inline-only wrapper still get its own line
// breaks — the common case being a `<table>` inside a `<td>`, i.e. any
// nested email table layout.
function collectChunks(
  nodes: TreeNode[],
  ctx: Context,
  chunks: Chunk[],
  buffer: { raw: string },
): void {
  for (const node of nodes) {
    if (node.type === 'text') {
      buffer.raw += ctx.uppercase ? node.value.toUpperCase() : node.value;
      continue;
    }
    if (node.type !== 'element') continue;
    if (isSkipped(node)) continue;
    if (node.tagName === 'br') {
      buffer.raw += BREAK;
      continue;
    }
    if (node.tagName === 'a') {
      buffer.raw += collectAnchor(node, ctx);
      continue;
    }
    if (node.tagName === 'ul' || node.tagName === 'ol') {
      flushInline(chunks, buffer);
      chunks.push(renderList(node, ctx));
      continue;
    }
    const blockSpacing = BLOCK_LEADING_TRAILING[node.tagName];
    if (blockSpacing) {
      flushInline(chunks, buffer);
      chunks.push(renderBlock(node, blockSpacing, ctx));
      continue;
    }
    collectChunks(node.children, ctx, chunks, buffer);
  }
}

// Folds a sequence of chunks the way html-to-text's stack-based builder
// does: the separation between two chunks is `max` of the trailing break
// count requested by what came before and the leading count requested by
// what comes next, never a sum, and breaks before the first (or after the
// last) real content never materialize. This also bubbles up: a
// leading/trailing count still reads out through an empty chunk (e.g. an
// empty `<p></p>` between two real ones) instead of adding its own gap.
function foldChunks(chunks: Chunk[]): { text: string; leading: number; trailing: number } {
  let text = '';
  let pending = 0;
  let firstLeading = 0;
  let hasContent = false;
  for (const chunk of chunks) {
    if (!hasContent) {
      firstLeading = Math.max(firstLeading, chunk.leading);
      pending = Math.max(pending, chunk.trailing);
      if (chunk.text === '') continue;
      text = chunk.text;
      pending = chunk.trailing;
      hasContent = true;
      continue;
    }
    text += '\n'.repeat(Math.max(pending, chunk.leading));
    text += chunk.text;
    pending = chunk.trailing;
  }
  return { text, leading: firstLeading, trailing: pending };
}

function renderBlockChildren(nodes: TreeNode[], ctx: Context) {
  const chunks: Chunk[] = [];
  const buffer = { raw: '' };
  collectChunks(nodes, ctx, chunks, buffer);
  flushInline(chunks, buffer);
  return foldChunks(chunks);
}

function renderBlock(el: Element, [leading, trailing]: [number, number], ctx: Context): Chunk {
  if (el.tagName === 'hr') return { text: '-'.repeat(40), leading, trailing };
  if (el.tagName === 'pre') {
    return { text: collectPlainText(el.children, ctx), leading, trailing };
  }

  const innerCtx = HEADING_TAGS.has(el.tagName) ? { ...ctx, uppercase: true } : ctx;
  const inner = renderBlockChildren(el.children, innerCtx);
  // A block's own leading/trailing count is a floor: if its first (or
  // last) piece of content is itself a block that asked for more spacing,
  // that wins, so the extra spacing isn't swallowed by the outer wrapper.
  const effectiveLeading = Math.max(leading, inner.leading);
  const effectiveTrailing = Math.max(trailing, inner.trailing);

  if (el.tagName === 'blockquote') {
    const trimmed = inner.text.replace(/^\n+/, '').replace(/\n+$/, '');
    return {
      text: trimmed
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n'),
      leading: effectiveLeading,
      trailing: effectiveTrailing,
    };
  }
  return { text: inner.text, leading: effectiveLeading, trailing: effectiveTrailing };
}

function renderList(el: Element, ctx: Context): Chunk {
  const ordered = el.tagName === 'ol';
  const items = el.children.filter(
    (child): child is Element => child.type === 'element' && child.tagName === 'li',
  );
  if (items.length === 0) return { text: '', leading: 0, trailing: 0 };

  const isNested = ctx.insideListItem === true;
  const start = typeof el.properties.start === 'number' ? el.properties.start : 1;

  const prefixes = items.map((_, index) => {
    const prefix = ordered ? ` ${start + index}. ` : ' * ';
    return isNested ? prefix.trimStart() : prefix;
  });
  const maxPrefixLength = Math.max(...prefixes.map((prefix) => prefix.length));
  const continuation = `\n${' '.repeat(maxPrefixLength)}`;

  let text = '';
  let pending = 0;
  let hasContent = false;
  for (const [index, item] of items.entries()) {
    const { text: itemText, trailing: itemTrailing } = renderBlockChildren(item.children, {
      ...ctx,
      insideListItem: true,
    });
    const line = prefixes[index]!.padEnd(maxPrefixLength) + itemText.replace(/\n/g, continuation);
    if (hasContent) text += '\n'.repeat(pending);
    text += line;
    pending = Math.max(itemTrailing, 1);
    hasContent = true;
  }
  return { text, leading: isNested ? 1 : 2, trailing: isNested ? 1 : 2 };
}

function findBody(node: { children: TreeNode[] }): Element | undefined {
  for (const child of node.children) {
    if (child.type !== 'element') continue;
    if (child.tagName === 'body') return child;
    const found = findBody(child);
    if (found) return found;
  }
  return undefined;
}

/**
 * Converts HTML to plain text without html-to-text: a from-scratch
 * formatter covering the tags react-email itself renders (and common
 * hand-written HTML), matched against html-to-text's default output for
 * the same rules `toPlainText` already applies (skip `img` and
 * `[data-skip-in-text=true]`, format links without brackets, hide the href
 * when it duplicates the link text). It doesn't accept `htmlToTextOptions`
 * — that whole passthrough surface (arbitrary selectors/formatters) is
 * exactly the API coupling `unstableTextConversion` exists to move away
 * from, see `Options['unstableTextConversion']`.
 */
export async function toPlainTextUnstable(html: string): Promise<string> {
  const { fromHtml } = await import('hast-util-from-html');
  const tree = fromHtml(html);
  const body = findBody(tree);
  const nodes = body ? body.children : tree.children;
  return renderBlockChildren(nodes, { uppercase: false }).text;
}
