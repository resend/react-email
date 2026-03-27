/**
 * Sanitizes pasted HTML.
 * - From editor (has node-* classes): pass through as-is
 * - From external: strip all styles/classes, keep only semantic HTML
 */

/**
 * Detects content from the Resend editor by checking for node-* class names.
 */
const EDITOR_CLASS_PATTERN = /class="[^"]*node-/;

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
  if (isFromEditor(html)) {
    return html;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  sanitizeNode(doc.body);

  return doc.body.innerHTML;
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
