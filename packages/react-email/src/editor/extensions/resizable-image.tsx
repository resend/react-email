import TiptapImage from '@tiptap/extension-image';
import { NodeSelection } from '@tiptap/pm/state';
import { UploadImagesPlugin } from './upload-image.js';

type ResizeDirection =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left';

interface ResizeState {
  isResizing: boolean;
  direction: ResizeDirection | null;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  aspectRatio: number;
}

const HANDLE_STYLES: Record<
  ResizeDirection,
  { cursor: string; position: Record<string, string>; transform?: string }
> = {
  'top-left': {
    cursor: 'nwse-resize',
    position: { top: '-5px', left: '-5px' },
  },
  'top-right': {
    cursor: 'nesw-resize',
    position: { top: '-5px', right: '-5px' },
  },
  'bottom-left': {
    cursor: 'nesw-resize',
    position: { bottom: '-5px', left: '-5px' },
  },
  'bottom-right': {
    cursor: 'nwse-resize',
    position: { bottom: '-5px', right: '-5px' },
  },
  top: {
    cursor: 'ns-resize',
    position: { top: '-5px', left: '50%' },
    transform: 'translateX(-50%)',
  },
  bottom: {
    cursor: 'ns-resize',
    position: { bottom: '-5px', left: '50%' },
    transform: 'translateX(-50%)',
  },
  left: {
    cursor: 'ew-resize',
    position: { top: '50%', left: '-5px' },
    transform: 'translateY(-50%)',
  },
  right: {
    cursor: 'ew-resize',
    position: { top: '50%', right: '-5px' },
    transform: 'translateY(-50%)',
  },
};

const DIRECTIONS: ResizeDirection[] = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
  'top',
  'right',
  'bottom',
  'left',
];

function createResizeHandle(direction: ResizeDirection): HTMLElement {
  const handle = document.createElement('div');
  handle.className = 'image-resize-handle';
  handle.dataset.direction = direction;

  const { cursor, position, transform } = HANDLE_STYLES[direction];
  Object.assign(handle.style, {
    position: 'absolute',
    width: '10px',
    height: '10px',
    backgroundColor: '#3b82f6',
    border: '2px solid white',
    borderRadius: '50%',
    cursor,
    zIndex: '10',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    pointerEvents: 'auto',
    transform: transform || '',
    ...position,
  });

  return handle;
}

export interface ResizableImageOptions {
  allowBase64: boolean;
  inline: boolean;
  HTMLAttributes: Record<string, string>;
}

export const ResizableImage = TiptapImage.extend<ResizableImageOptions>({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        parseHTML: (element) => {
          const width = element.getAttribute('width') || element.style.width;
          return width || '100%';
        },
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {};
          }
          return { width: attributes.width };
        },
      },
      height: {
        default: null,
        parseHTML: (element) => {
          const height = element.getAttribute('height') || element.style.height;
          return height || null;
        },
        renderHTML: (attributes) => {
          if (!attributes.height) {
            return {};
          }
          return { height: attributes.height };
        },
      },
      href: {
        default: '',
        parseHTML: (element) => {
          const parentAnchor = element.closest('a');
          return parentAnchor?.getAttribute('href') || '';
        },
        renderHTML: (attributes) => {
          if (!attributes.href) {
            return {};
          }
          return { href: attributes.href };
        },
      },
    };
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      // Container for the image and resize handles
      const container = document.createElement('div');
      container.className = 'resizable-image-container';
      Object.assign(container.style, {
        position: 'relative',
        display: 'inline-block',
        lineHeight: '0',
      });

      // Apply alignment via margins (table display shrink-wraps content)
      const applyAlignment = (alignment: string) => {
        container.style.display = 'table';
        const isRight = alignment === 'right';
        const isCenter = alignment === 'center';
        container.style.marginLeft = isRight || isCenter ? 'auto' : '0';
        container.style.marginRight = isRight ? '0' : 'auto';
      };

      applyAlignment(node.attrs.alignment || 'left');

      // The image element
      const img = document.createElement('img');
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || '';
      img.title = node.attrs.title || '';
      img.className = 'node-image';
      img.draggable = false;

      // Apply width/height from attributes
      applyDimensions(img, node.attrs);

      container.appendChild(img);

      // Resize handles container (only visible when selected)
      const handlesContainer = document.createElement('div');
      handlesContainer.className = 'image-resize-handles';
      Object.assign(handlesContainer.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        pointerEvents: 'none',
        display: 'none',
        border: '2px solid #3b82f6',
        borderRadius: '2px',
      });

      // Create resize handles (4 corners + 4 sides)
      for (const direction of DIRECTIONS) {
        handlesContainer.appendChild(createResizeHandle(direction));
      }

      container.appendChild(handlesContainer);

      // Resize state
      const resizeState: ResizeState = {
        isResizing: false,
        direction: null,
        startX: 0,
        startY: 0,
        startWidth: 0,
        startHeight: 0,
        aspectRatio: 1,
      };

      // Handle resize start
      const onMouseDown = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.classList.contains('image-resize-handle')) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        const direction = target.dataset.direction as ResizeDirection;
        const rect = img.getBoundingClientRect();

        resizeState.isResizing = true;
        resizeState.direction = direction;
        resizeState.startX = e.clientX;
        resizeState.startY = e.clientY;
        resizeState.startWidth = rect.width;
        resizeState.startHeight = rect.height;
        resizeState.aspectRatio = rect.width / rect.height;

        container.classList.add('is-resizing');
        document.body.style.cursor = HANDLE_STYLES[direction].cursor;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      };

      // Handle resize move - all handles preserve aspect ratio
      const onMouseMove = (e: MouseEvent) => {
        if (!resizeState.isResizing || !resizeState.direction) {
          return;
        }

        const deltaX = e.clientX - resizeState.startX;
        const deltaY = e.clientY - resizeState.startY;

        const direction = resizeState.direction;
        const aspectRatio = resizeState.aspectRatio;

        let newWidth: number;
        let newHeight: number;

        // Horizontal handles: resize based on X movement
        if (direction === 'left' || direction === 'right') {
          newWidth =
            direction === 'right'
              ? resizeState.startWidth + deltaX
              : resizeState.startWidth - deltaX;
          newHeight = newWidth / aspectRatio;
        }
        // Vertical handles: resize based on Y movement
        else if (direction === 'top' || direction === 'bottom') {
          newHeight =
            direction === 'bottom'
              ? resizeState.startHeight + deltaY
              : resizeState.startHeight - deltaY;
          newWidth = newHeight * aspectRatio;
        }
        // Corner handles: use larger delta
        else {
          const widthDelta = direction.includes('right') ? deltaX : -deltaX;
          const heightDelta = direction.includes('bottom') ? deltaY : -deltaY;

          if (Math.abs(widthDelta) > Math.abs(heightDelta)) {
            newWidth = resizeState.startWidth + widthDelta;
            newHeight = newWidth / aspectRatio;
          } else {
            newHeight = resizeState.startHeight + heightDelta;
            newWidth = newHeight * aspectRatio;
          }
        }

        // Apply minimum constraints while preserving aspect ratio
        if (newWidth < 50) {
          newWidth = 50;
          newHeight = newWidth / aspectRatio;
        }
        if (newHeight < 50) {
          newHeight = 50;
          newWidth = newHeight * aspectRatio;
        }

        // Apply dimensions
        img.style.width = `${Math.round(newWidth)}px`;
        img.style.height = `${Math.round(newHeight)}px`;
      };

      // Handle resize end
      const onMouseUp = () => {
        if (!resizeState.isResizing) {
          return;
        }

        resizeState.isResizing = false;
        resizeState.direction = null;
        container.classList.remove('is-resizing');
        document.body.style.cursor = '';

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        // Commit the new dimensions to the editor
        if (typeof getPos === 'function') {
          const pos = getPos();
          if (pos !== undefined) {
            const width = Math.round(img.offsetWidth);
            const height = Math.round(img.offsetHeight);

            editor.commands.updateAttributes('image', {
              width,
              height,
            });

            // Restore node selection
            editor.commands.setNodeSelection(pos);
          }
        }
      };

      // Add event listeners
      container.addEventListener('mousedown', onMouseDown);

      // Show/hide handles based on selection
      const updateHandlesVisibility = () => {
        const { selection } = editor.state;
        const pos = typeof getPos === 'function' ? getPos() : undefined;

        const isSelected =
          selection instanceof NodeSelection &&
          selection.node.type.name === 'image' &&
          pos !== undefined &&
          selection.from === pos;

        handlesContainer.style.display =
          isSelected && editor.isEditable ? 'block' : 'none';
      };

      const onBlur = () => {
        handlesContainer.style.display = 'none';
      };

      // Listen to editor selection changes
      editor.on('selectionUpdate', updateHandlesVisibility);
      editor.on('focus', updateHandlesVisibility);
      editor.on('blur', onBlur);

      // Initial visibility check
      updateHandlesVisibility();

      return {
        dom: container,
        contentDOM: null,
        update: (updatedNode) => {
          if (updatedNode.type.name !== 'image') {
            return false;
          }

          // Update image attributes
          img.src = updatedNode.attrs.src;
          img.alt = updatedNode.attrs.alt || '';
          img.title = updatedNode.attrs.title || '';

          applyDimensions(img, updatedNode.attrs);
          applyAlignment(updatedNode.attrs.alignment || 'left');
          updateHandlesVisibility();

          return true;
        },
        selectNode: () => {
          handlesContainer.style.display = editor.isEditable ? 'block' : 'none';
        },
        deselectNode: () => {
          if (!resizeState.isResizing) {
            handlesContainer.style.display = 'none';
          }
        },
        destroy: () => {
          editor.off('selectionUpdate', updateHandlesVisibility);
          editor.off('focus', updateHandlesVisibility);
          editor.off('blur', onBlur);
          container.removeEventListener('mousedown', onMouseDown);
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        },
      };
    };
  },

  addProseMirrorPlugins() {
    return [UploadImagesPlugin()];
  },
}).configure({
  allowBase64: true,
  inline: false,
  HTMLAttributes: {
    class: 'node-image',
  },
});

function applyDimensions(
  img: HTMLImageElement,
  attrs: Record<string, unknown>,
) {
  if (attrs.width) {
    const width = String(attrs.width);
    img.style.width =
      width.includes('%') || width.includes('px') ? width : `${width}px`;
  } else {
    img.style.width = '100%';
  }

  if (attrs.height) {
    const height = String(attrs.height);
    img.style.height =
      height.includes('%') || height.includes('px') ? height : `${height}px`;
  } else {
    img.style.height = 'auto';
  }
}
