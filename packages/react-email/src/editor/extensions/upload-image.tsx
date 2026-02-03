import type { EditorState } from '@tiptap/pm/state';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import Compressor from 'compressorjs';
import { generateAltTextForImage } from '@/utils/ai/generate-alt-text';
import { editorEventBus } from '../core/event-bus';

const uploadKey = new PluginKey('upload-image');

// We are limited to Vercel's 4.5 MB file size limit for function payloads,
// so we set the max file size to 4.25 MB to allow for the request overhead.
// Images larger than this will be first compressed, and if they are still too large,
// an error will be shown to the user.
const MAX_FILE_SIZE_BYTES = 4.25 * 1024 * 1024; // 4.25 MB

export const UploadImagesPlugin = () =>
  new Plugin({
    key: uploadKey,
    state: {
      init() {
        return DecorationSet.empty;
      },
      apply(tr, set) {
        set = set.map(tr.mapping, tr.doc);
        const action = tr.getMeta(uploadKey);
        if (action?.add) {
          const { id, pos, src, preserveAttributes } = action.add;

          const placeholder = document.createElement('div');
          placeholder.setAttribute(
            'class',
            'img-placeholder relative bg-white relative z-10 rounded-lg overflow-hidden',
          );
          const image = document.createElement('img');
          image.setAttribute(
            'class',
            'opacity-30 border border-gray-3 pointer-events-none',
          );

          const loader = document.createElement('div');
          loader.setAttribute(
            'class',
            'absolute inset-0 flex items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
          );
          const svg = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg',
          );
          svg.setAttribute('aria-hidden', 'true');
          svg.setAttribute(
            'class',
            'mr-2 h-8 w-8 animate-spin fill-black text-gray-10',
          );
          svg.setAttribute('fill', 'none');
          svg.setAttribute('viewBox', '0 0 100 101');

          const path1 = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path',
          );
          path1.setAttribute(
            'd',
            'M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z',
          );
          path1.setAttribute('fill', 'currentColor');

          const path2 = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path',
          );
          path2.setAttribute(
            'd',
            'M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z',
          );
          path2.setAttribute('fill', 'currentFill');

          svg.appendChild(path1);
          svg.appendChild(path2);

          loader.appendChild(svg);

          image.src = src;
          if (
            preserveAttributes?.width &&
            preserveAttributes?.width !== '100%'
          ) {
            image.width = preserveAttributes?.width;
          }
          if (preserveAttributes?.alignment) {
            placeholder.classList.add(preserveAttributes?.alignment);
          }
          placeholder.appendChild(image);
          placeholder.appendChild(loader);

          const deco = Decoration.widget(pos, placeholder, {
            id,
          });
          set = set.add(tr.doc, [deco]);
        } else if (action?.remove) {
          set = set.remove(
            set.find(
              undefined,
              undefined,
              (spec) => spec.id === action.remove.id,
            ),
          );
        }
        return set;
      },
    },
    props: {
      decorations(state) {
        return this.getState(state);
      },
    },
  });

function findPlaceholder(state: EditorState, id: object) {
  const decos = uploadKey.getState(state);
  const found = decos.find(null, null, (spec: any) => spec.id === id);
  return found.length ? found[0].from : null;
}

export async function startImageUpload(
  file: File,
  view: EditorView,
  pos: number,
  preserveAttributes?: {
    width?: string;
    height?: string;
    alignment?: string;
    href?: string;
  },
  metadata?: {
    objectType: 'broadcast' | 'template';
    objectId: string;
  },
) {
  if (
    !file.type.includes('image/') ||
    file.type === 'image/svg+xml' ||
    file.type === 'image/heic' ||
    file.type === 'image/webp'
  ) {
    editorEventBus.dispatch('image-error', {
      message: 'File type not supported',
    });
    return;
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    // Try to compress the image if it's too big. If the compression fails,
    // ignore the error and proceed with the processing as before.
    const compressedFile = await compressImage(file);

    if (compressedFile !== null) {
      file = compressedFile;
    }

    // If it is still too big after compression, show an error
    // and do not proceed with the upload
    if (file.size > MAX_FILE_SIZE_BYTES) {
      editorEventBus.dispatch('image-error', {
        message: 'File size too big (max 4.5MB)',
      });
      return;
    }
  }

  // A fresh object to act as the ID for this upload
  const id = {};

  // Replace the selection with a placeholder
  const tr = view.state.tr;
  if (!tr.selection.empty) {
    tr.deleteSelection();
  }

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    tr.setMeta(uploadKey, {
      add: {
        id,
        pos,
        src: reader.result,
        preserveAttributes,
      },
    });
    view.dispatch(tr);
  };

  handleImageUpload(file).then(async (src) => {
    const { schema } = view.state;

    const pos = findPlaceholder(view.state, id);

    // If the content around the placeholder has been deleted, drop
    // the image
    if (pos == null) {
      return;
    }

    // Otherwise, insert it at the placeholder's position, and remove
    // the placeholder

    // the image locally
    const imageSrc = typeof src === 'object' ? reader.result : src;

    let altText = '';
    if (imageSrc && metadata) {
      try {
        altText = await generateAltTextForImage(
          imageSrc as string,
          metadata.objectType,
          metadata.objectId,
        );
      } catch {
        // Continue without alt text if generation fails
      }
    }

    const node = schema.nodes.image.create({
      src: imageSrc,
      ...(altText && { alt: altText }),
      ...(preserveAttributes && {
        width: preserveAttributes.width,
        height: preserveAttributes.height,
        alignment: preserveAttributes.alignment,
        href: preserveAttributes.href,
      }),
    });

    const transaction = view.state.tr
      .replaceWith(pos, pos, node)
      .setMeta(uploadKey, { remove: { id } });
    view.dispatch(transaction);
  });
}

const handleImageUpload = (file: File) => {
  return new Promise((resolve) => {
    fetch('/api/upload-image', {
      method: 'POST',
      headers: {
        'content-type': file?.type || 'application/octet-stream',
      },
      body: file,
    }).then(async (res) => {
      if (res.status === 200) {
        const { url } = await res.json();
        // preload the image
        const image = new Image();
        image.src = url;
        image.onload = () => {
          resolve(url);
        };
      } else {
        let message = 'Error uploading image. Please try again.';

        if (res.status === 413) {
          message = 'Image size is too big (max 4.5MB)';
        }

        editorEventBus.dispatch('image-error', { message });

        throw new Error(message);
      }
    });
  });
};

export async function compressImage(file: File): Promise<File | null> {
  // compressorjs cannot preserve animated GIFs and will convert them
  // to a static PNG/JPEG via canvas. To preserve GIF format, skip compression.
  if (file.type === 'image/gif') {
    return null;
  }

  const compressedFile = await new Promise<File | Blob | null>((resolve) => {
    new Compressor(file, {
      mimeType: file.type,
      convertSize: Number.POSITIVE_INFINITY,
      maxWidth: 1500,
      quality: 0.8,
      success: (result) => resolve(result),
      error: () => resolve(null),
    });
  });

  if (compressedFile instanceof File) {
    return compressedFile;
  }

  if (compressedFile instanceof Blob) {
    return new File([compressedFile], file.name, {
      type: compressedFile.type,
      lastModified: file.lastModified,
    });
  }

  return compressedFile;
}
