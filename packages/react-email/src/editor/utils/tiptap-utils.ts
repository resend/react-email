import type { EditorView } from '@tiptap/pm/view';
import { absoluteRect } from './absolute-rect.js';

export const getNode = (
  view: EditorView,
  pos: { pos: number; inside: number },
) => {
  const resolvedPos = view.state.doc.resolve(pos.pos);
  const isCurrentNodeImage =
    resolvedPos.nodeAfter && resolvedPos.nodeAfter.type.name === 'image';
  const isInsideNodeImage =
    pos.inside !== -1 &&
    resolvedPos.doc.nodeAt(pos.inside)?.type.name === 'image';

  if (isCurrentNodeImage) {
    return isInsideNodeImage
      ? resolvedPos.nodeAfter
      : resolvedPos.doc.nodeAt(pos.inside);
  }

  if (resolvedPos.parent.type.name !== 'doc') {
    // Use the parent node if not at the document root and not handling an image
    return resolvedPos.parent;
  }

  // Fallback for positions directly at the document root or other specific cases
  return resolvedPos.nodeAfter?.isTextblock
    ? resolvedPos.nodeBefore
    : resolvedPos.nodeAfter;
};

/**
 * Get a node and its position from coordinates.
 * This function properly calculates the position of the returned node,
 * which may be a parent of the node at the clicked position.
 */
export const getNodeWithPos = (
  view: EditorView,
  pos: { pos: number; inside: number },
): { node: ReturnType<typeof getNode>; pos: number } | null => {
  const resolvedPos = view.state.doc.resolve(pos.pos);
  const isCurrentNodeImage =
    resolvedPos.nodeAfter && resolvedPos.nodeAfter.type.name === 'image';
  const isInsideNodeImage =
    pos.inside !== -1 &&
    resolvedPos.doc.nodeAt(pos.inside)?.type.name === 'image';

  if (isCurrentNodeImage) {
    const node = isInsideNodeImage
      ? resolvedPos.nodeAfter
      : resolvedPos.doc.nodeAt(pos.inside);
    // For images, use the provided inside position
    return { node, pos: isInsideNodeImage ? pos.pos : pos.inside };
  }

  if (resolvedPos.parent.type.name !== 'doc') {
    // Use the parent node if not at the document root
    // Calculate the position of the parent node (position before the parent)
    const parentPos = resolvedPos.before(resolvedPos.depth);
    return { node: resolvedPos.parent, pos: parentPos };
  }

  // Fallback for positions directly at the document root
  const node = resolvedPos.nodeAfter?.isTextblock
    ? resolvedPos.nodeBefore
    : resolvedPos.nodeAfter;
  return { node, pos: pos.pos };
};

export const nodeDOMAtCoords = (coords: { x: number; y: number }) => {
  return document
    .elementsFromPoint(coords.x, coords.y)
    .find((element) =>
      element.matches(
        [
          'div',
          'li',
          'p:not(:is(blockquote > p, li > p))',
          'pre',
          'blockquote',
          'h1, h2, h3',
          'section',
          '.node-htmlContent',
          '.node-button',
          '.node-socialLinks',
          'img:not(:is(.node-socialLinks img))',
        ].join(','),
      ),
    );
};

export const nodePosAtDOM = (node: Element, view: EditorView) => {
  const boundingRect = node.getBoundingClientRect();

  return view.posAtCoords({
    left: boundingRect.left + 2,
    top: boundingRect.top + 2,
  })?.inside;
};

export interface SideButtonOptions {
  buttonWidth: number;
  positionLeft?: number;
}

export const positionSideButtons = (
  node: Element,
  options: SideButtonOptions,
  element: HTMLElement,
) => {
  const compStyle = window.getComputedStyle(node);
  const lineHeight = Number.parseInt(compStyle.lineHeight, 10);
  const paddingTop = Number.parseInt(compStyle.paddingTop, 10);

  const rect = absoluteRect(node);

  rect.top += (lineHeight - 24) / 2;
  rect.top += paddingTop;

  // Position according to elements
  if (node.matches('ul li, ol li')) {
    rect.left -= options.buttonWidth;
    rect.top += 1;
  }
  if (node.matches('h1, h2, h3, h4, h5, h6')) {
    rect.top += 2;
  }
  if (node.matches('pre, section')) {
    rect.top -= paddingTop + 5;
  }

  rect.width = options.buttonWidth;

  element.style.left = `${
    rect.left - rect.width - (options?.positionLeft || 0)
  }px`;
  element.style.top = `${rect.top}px`;
};

export class Placeholder {
  private element: HTMLElement | null = null;
  private startDragPos: { top: number; left: number } | null = null;
  private targetNode: Element | null = null;

  constructor(
    private view: EditorView,
    private options: SideButtonOptions,
  ) {
    // Make the drag handle element part of ProseMirror boundaries
    view.dom.style.paddingLeft = `${options.buttonWidth}px`;
    view.dom.style.marginLeft = `${-options.buttonWidth}px`;
  }

  mount(node: Element) {
    this.element = document.createElement('div');
    const wrapper = document.createElement(node.parentElement!.nodeName);
    const clonedNode = node.cloneNode(true) as HTMLElement;

    node.parentElement?.getAttributeNames().forEach((attr) => {
      wrapper.setAttribute(attr, node.parentElement?.getAttribute(attr) ?? '');
    });

    wrapper.classList.remove('ProseMirror-selectednode');
    clonedNode.classList.remove('ProseMirror-selectednode');

    wrapper.appendChild(clonedNode);
    this.element.appendChild(wrapper);

    this.element.className = [
      'tiptap ProseMirror', // parent className to ensure default styes
      'animate-[fade-in_150ms_ease-out]',
      'pointer-events-none',
      'opacity-80',
      'z-50',
      'relative',
      '!fixed',
      '!h-auto',
      '!bg-transparent',
      '!opacity-0', // to be removed later
    ].join(' ');

    this.view.dom.parentNode?.appendChild(this.element);
    this.targetNode = node;
  }

  update(event: DragEvent): void {
    if (!this.startDragPos) {
      this.startDragPos = { top: event.clientY, left: event.clientX };
    }

    if (this.element && this.targetNode) {
      const { top, left, width } = this.targetNode.getBoundingClientRect();

      let rectLeft = event.clientX - this.startDragPos.left + left;
      let rectTop = event.clientY - this.startDragPos.top + top;

      if (this.targetNode.matches('ul li, ol li')) {
        rectLeft -= this.options.buttonWidth;
      }

      if (rectTop < 0) {
        rectLeft = left;
        rectTop = top;
      }

      this.element.style.left = `${rectLeft}px`;
      this.element.style.top = `${rectTop}px`;
      this.element.style.width = `${width}px`;
      this.element.classList.remove('!opacity-0');
    }
  }

  dispose(): void {
    this.element?.remove();

    this.element = null;
    this.startDragPos = null;
    this.targetNode = null;
  }
}
