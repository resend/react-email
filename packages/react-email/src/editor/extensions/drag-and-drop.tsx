import { Extension } from '@tiptap/core';
import { NodeSelection, Plugin, TextSelection } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import {
  nodeDOMAtCoords,
  nodePosAtDOM,
  Placeholder,
  positionSideButtons,
  type SideButtonOptions,
} from '../utils/tiptap-utils.js';

function DragHandle(options: SideButtonOptions) {
  let placeholder: Placeholder | null = null;
  let dragHandleElement: HTMLElement | null = null;
  let currentNode: Element | null = null;
  let rafId: number | null = null;

  function handleDragStart(event: DragEvent, view: EditorView) {
    view.focus();

    if (!event.dataTransfer) {
      return;
    }
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.dropEffect = 'move';

    const node = nodeDOMAtCoords({
      x: event.clientX + 50 + options.buttonWidth,
      y: event.clientY,
    });

    if (!(node instanceof Element)) {
      return;
    }

    const nodePos = nodePosAtDOM(node, view);
    if (nodePos == null || nodePos < 0) {
      return;
    }

    view.dispatch(
      view.state.tr.setSelection(NodeSelection.create(view.state.doc, nodePos)),
    );

    placeholder?.mount(node);
    placeholder?.update(event);

    view.dragging = {
      slice: view.state.selection.content(),
      move: event.ctrlKey,
    };
  }

  function hideAndReset() {
    dragHandleElement?.classList.add('opacity-0');
    currentNode = null;
  }

  return new Plugin({
    props: {
      handleDOMEvents: {
        mousemove(view, event) {
          if (!view.editable || !dragHandleElement) {
            return false;
          }

          // Cancel pending frame and schedule new one (throttle to RAF)
          if (rafId) {
            cancelAnimationFrame(rafId);
          }

          rafId = requestAnimationFrame(() => {
            rafId = null;

            const node = nodeDOMAtCoords({
              x: event.clientX + 50 + options.buttonWidth,
              y: event.clientY,
            });

            if (!node) {
              hideAndReset();
              return;
            }

            // Only reposition if hovering a different node
            if (node !== currentNode) {
              currentNode = node;
              positionSideButtons(node, options, dragHandleElement!);
            }

            dragHandleElement!.classList.remove('opacity-0');
          });

          return false;
        },
        keydown() {
          hideAndReset();
          return false;
        },
        wheel() {
          hideAndReset();
          return false;
        },
        mouseleave(_view, event) {
          if (!dragHandleElement?.contains(event.relatedTarget as Node)) {
            hideAndReset();
          }
          return false;
        },
      },
    },
    view(view) {
      placeholder = new Placeholder(view, options);
      const ac = new AbortController();

      dragHandleElement = document.createElement('div');
      dragHandleElement.draggable = true;
      dragHandleElement.dataset.dragHandle = '';
      dragHandleElement.classList.add('drag-handle', 'opacity-0');

      dragHandleElement.addEventListener(
        'dragstart',
        (e) => {
          handleDragStart(e, view);
          view.dom.classList.add('dragging');
        },
        { signal: ac.signal },
      );

      dragHandleElement.addEventListener(
        'drag',
        (e) => placeholder?.update(e),
        { signal: ac.signal },
      );

      dragHandleElement.addEventListener(
        'dragend',
        () => {
          view.dom.classList.remove('dragging');
          view.dispatch(
            view.state.tr.setSelection(TextSelection.create(view.state.doc, 0)),
          );
          placeholder?.dispose();
          hideAndReset();
        },
        { signal: ac.signal },
      );

      // Append after React mount
      requestAnimationFrame(() => {
        view.dom.parentElement?.appendChild(dragHandleElement!);
      });

      // Hide on scroll/resize
      const scrollContainer = document.querySelector(
        '.editor-scrollable-container',
      );
      window.addEventListener('resize', hideAndReset, { signal: ac.signal });
      scrollContainer?.addEventListener('scroll', hideAndReset, {
        signal: ac.signal,
      });

      return {
        destroy() {
          if (rafId) {
            cancelAnimationFrame(rafId);
          }
          ac.abort();
          placeholder?.dispose();
          placeholder = null;
          dragHandleElement?.remove();
          dragHandleElement = null;
        },
      };
    },
  });
}

export const DragAndDrop = Extension.create({
  name: 'dragAndDrop',

  addProseMirrorPlugins() {
    return [DragHandle({ buttonWidth: 24 })];
  },
});
