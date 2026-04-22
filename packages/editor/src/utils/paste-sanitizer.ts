import { isSafeUrl } from './is-safe-url';

const EDITOR_CLASS_PATTERN = /class="[^"]*node-/;

const PRESERVED_ATTRIBUTES: Record<string, string[]> = {
  a: ['href', 'target', 'rel'],
  img: ['src', 'alt', 'width', 'height'],
  td: ['colspan', 'rowspan'],
  th: ['colspan', 'rowspan', 'scope'],
  table: ['border', 'cellpadding', 'cellspacing'],
  '*': ['id'],
};

const URL_ATTRIBUTES = new Set(['href', 'src']);

const isFromEditor = (html: string): boolean => EDITOR_CLASS_PATTERN.test(html);

export const sanitizePastedHtml = (html: string): string => {
  if (isFromEditor(html)) {
    return html;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  sanitizeNode(doc.body);

  return doc.body.innerHTML;
};

const sanitizeNode = (node: Node): void => {
  if (node.nodeType === Node.ELEMENT_NODE) {
    sanitizeElement(node as HTMLElement);
  }

  Array.from(node.childNodes).forEach((child) => {
    sanitizeNode(child);
  });
};

const sanitizeElement = (el: HTMLElement): void => {
  const tagName = el.tagName.toLowerCase();

  const allowedForTag = PRESERVED_ATTRIBUTES[tagName] || [];
  const allowedGlobal = PRESERVED_ATTRIBUTES['*'] || [];
  const allowed = new Set([...allowedForTag, ...allowedGlobal]);

  const attributesToRemove = Array.from(el.attributes)
    .filter((attr) => {
      if (attr.name.startsWith('data-')) {
        return true;
      }
      if (!allowed.has(attr.name)) {
        return true;
      }
      if (URL_ATTRIBUTES.has(attr.name) && !isSafeUrl(attr.value)) {
        return true;
      }
      return false;
    })
    .map((attr) => attr.name);

  attributesToRemove.forEach((attr) => {
    el.removeAttribute(attr);
  });
};
