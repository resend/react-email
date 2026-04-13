import { Img, Link } from 'react-email';
import { EmailNode } from '../../core/serializer/email-node';
import type { UseEditorImageOptions } from './types';
import { executeUploadFlow } from './upload-flow';
import { createImagePastePlugin } from './paste-handler';
import { createImageDropPlugin } from './drop-handler';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      setImage: (attrs: {
        src: string;
        alt?: string;
        width?: string;
        height?: string;
        alignment?: string;
        href?: string;
      }) => ReturnType;
      uploadImage: () => ReturnType;
    };
  }
}

export function createImageExtension(options: UseEditorImageOptions) {
  return EmailNode.create({
    name: 'image',
    group: 'block',
    atom: true,
    draggable: true,

    addAttributes() {
      return {
        src: { default: '' },
        alt: { default: '' },
        width: { default: 'auto' },
        height: { default: 'auto' },
        alignment: { default: 'center' },
        href: { default: null },
      };
    },

    parseHTML() {
      return [{ tag: 'img[src]' }];
    },

    renderHTML({ HTMLAttributes }) {
      return ['img', HTMLAttributes];
    },

    addCommands() {
      return {
        setImage:
          (attrs) =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs,
            });
          },

        uploadImage:
          () =>
          ({ editor }) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = () => {
              const file = input.files?.[0];
              if (file) {
                void executeUploadFlow({
                  editor,
                  file,
                  uploadImage: options.uploadImage,
                  onUploadError: options.onUploadError,
                });
              }
            };
            input.click();
            return true;
          },
      };
    },

    addProseMirrorPlugins() {
      const { editor } = this;
      const { uploadImage, onUploadError } = options;

      return [
        createImagePastePlugin(editor, uploadImage, onUploadError),
        createImageDropPlugin(editor, uploadImage, onUploadError),
      ];
    },

    renderToReactEmail: ({ node, style }) => {
      const img = (
        <Img
          alt={node.attrs?.alt ?? ''}
          height={node.attrs?.height === 'auto' ? undefined : node.attrs?.height}
          src={node.attrs?.src ?? ''}
          style={style}
          width={node.attrs?.width === 'auto' ? undefined : node.attrs?.width}
        />
      );

      if (node.attrs?.href) {
        return <Link href={node.attrs.href}>{img}</Link>;
      }

      return img;
    },
  });
}

