import TiptapImage from '@tiptap/extension-image';

export interface ImageOptions {
  allowBase64: boolean;
  inline: boolean;
  HTMLAttributes: Record<string, string>;
}

export const Image = TiptapImage.extend<ImageOptions>({
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
}).configure({
  allowBase64: true,
  inline: false,
  HTMLAttributes: {
    class: 'node-image',
  },
});
