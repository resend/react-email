/**
 * Sanitizes pasted HTML.
 * - Always: drop dangerous elements (script, iframe, ...) and unsafe URL schemes (javascript:, ...).
 * - From editor (has node-* classes): preserve attributes so node identity round-trips.
 * - From external: strip all styles/classes, keep only semantic HTML.
 */

const EDITOR_CLASS_PATTERN = /class="[^"]*node-/;

const FORBIDDEN_TAGS = new Set([
  'script',
  'iframe',
  'object',
  'embed',
  'meta',
  'base',
]);

const URL_ATTRIBUTES = new Set(['href', 'src']);

/**
 * Attributes to preserve on specific elements for EXTERNAL content.
 * Only functional attributes - NO style or class.
 */
const PRESERVED_ATTRIBUTES: Record<string, string[]> = {
  a: ['href', 'target', 'rel'],
  img: ['src', 'alt', 'width', 'height'],
  td: ['colspan', 'rowspan'],
  th: ['colspan', 'rowspan', 'scope'],
  table: ['border', 'cellpadding', 'cellspacing'],
  '*': ['id'],
};

function isFromEditor(html: string): boolean {
  return EDITOR_CLASS_PATTERN.test(html);
}

export function sanitizePastedHtml(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  removeForbiddenElements(doc.body);
  scrubUnsafeUrlAttributes(doc.body);

  if (isFromEditor(html)) {
    return doc.body.innerHTML;
  }

  sanitizeNode(doc.body);

  return doc.body.innerHTML;
}

function removeForbiddenElements(root: Element): void {
  for (const tag of FORBIDDEN_TAGS) {
    for (const el of Array.from(root.getElementsByTagName(tag))) {
      el.remove();
    }
  }
}

function scrubUnsafeUrlAttributes(root: Element): void {
  for (const el of Array.from(
    root.querySelectorAll<HTMLElement>('[href], [src]'),
  )) {
    const allowDataImage = el.tagName.toLowerCase() === 'img';
    for (const attr of URL_ATTRIBUTES) {
      const value = el.getAttribute(attr);
      if (value !== null && !isSafeUrl(value, allowDataImage)) {
        el.removeAttribute(attr);
      }
    }
  }
}

function isSafeUrl(value: string, allowDataImage: boolean): boolean {
  const trimmed = value.trim().toLowerCase();
  if (trimmed.startsWith('javascript:')) return false;
  if (trimmed.startsWith('vbscript:')) return false;
  if (trimmed.startsWith('data:')) {
    return allowDataImage && trimmed.startsWith('data:image/');
  }
  return true;
}

function sanitizeNode(node: Node): void {
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    sanitizeElement(el);
  }

  for (const child of Array.from(node.childNodes)) {
    sanitizeNode(child);
  }
}

function sanitizeElement(el: HTMLElement): void {
  const tagName = el.tagName.toLowerCase();

  const allowedForTag = PRESERVED_ATTRIBUTES[tagName] || [];
  const allowedGlobal = PRESERVED_ATTRIBUTES['*'] || [];
  const allowed = new Set([...allowedForTag, ...allowedGlobal]);

  const attributesToRemove: string[] = [];

  for (const attr of Array.from(el.attributes)) {
    if (attr.name.startsWith('data-')) {
      attributesToRemove.push(attr.name);
      continue;
    }

    if (!allowed.has(attr.name)) {
      attributesToRemove.push(attr.name);
    }
  }

  for (const attr of attributesToRemove) {
    el.removeAttribute(attr);
  }
}
