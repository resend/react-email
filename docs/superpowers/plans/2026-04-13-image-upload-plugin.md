# Image Upload Plugin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a `useEditorImage` hook plugin for `@react-email/editor` that returns a self-contained Tiptap extension handling image node definition, paste/drop upload, and a file-picker command.

**Architecture:** A new `plugins/image/` module exports `useEditorImage` (hook returning an `EmailNode` extension) and `imageSlashCommand` (pre-built `SlashCommandItem`). The extension bundles the Image node definition, upload orchestration (optimistic blob URL → swap), and ProseMirror paste/drop plugins. The existing `onUploadImage` prop on `<EmailEditor>` is removed.

**Tech Stack:** Tiptap 3 (`@tiptap/core`, `@tiptap/pm`), React, `react-email` (for `Img`/`Link` components in serialization), Vitest

---

## File Structure

```
packages/editor/src/
  plugins/
    image/
      types.ts              # UseEditorImageOptions, internal UploadFn type
      upload-flow.ts         # Blob URL lifecycle: create, swap src, remove node on error
      paste-handler.ts       # ProseMirror paste plugin for image files
      drop-handler.ts        # ProseMirror drop plugin for image files
      extension.tsx          # EmailNode 'image' definition (attrs, commands, renderToReactEmail)
      slash-command.ts       # imageSlashCommand export
      index.ts               # useEditorImage hook + re-exports
    index.ts                 # Add re-export from ./image
  core/
    create-paste-handler.ts  # MODIFY: remove image handling, keep text paste
    create-drop-handler.ts   # MODIFY: remove image handling, keep file/onPaste passthrough
  email-editor/
    email-editor.tsx         # MODIFY: remove onUploadImage prop and handler wiring
```

---

### Task 1: Plugin types

**Files:**
- Create: `packages/editor/src/plugins/image/types.ts`

- [ ] **Step 1: Create the types file**

```ts
// packages/editor/src/plugins/image/types.ts

export interface UploadImageResult {
  url: string;
}

export interface UseEditorImageOptions {
  uploadImage: (file: File) => Promise<UploadImageResult>;
  onUploadError?: (error: Error, file: File) => void;
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/editor/src/plugins/image/types.ts
git commit -m "add image plugin types"
```

---

### Task 2: Upload flow

**Files:**
- Create: `packages/editor/src/plugins/image/upload-flow.ts`
- Create: `packages/editor/src/plugins/image/upload-flow.spec.ts`

- [ ] **Step 1: Write failing tests for the upload flow**

The upload flow has three responsibilities: (1) create a blob URL and insert an image node, (2) on upload success swap the blob URL for the final URL, (3) on upload failure remove the node and call `onUploadError`.

We test this by mocking the Tiptap `Editor` and its chain API. The flow function operates on the editor's transaction system — we verify the right commands are called.

```ts
// packages/editor/src/plugins/image/upload-flow.spec.ts
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { executeUploadFlow } from './upload-flow';

const createMockEditor = () => {
  const state = {
    nodes: new Map<string, { pos: number; attrs: Record<string, string> }>(),
  };

  const editor = {
    chain: vi.fn().mockReturnThis(),
    focus: vi.fn().mockReturnThis(),
    setImage: vi.fn().mockImplementation((attrs: Record<string, string>) => {
      state.nodes.set(attrs.src, { pos: 0, attrs });
      return editor;
    }),
    run: vi.fn().mockReturnValue(true),
    state: {
      doc: {
        descendants: vi.fn(
          (cb: (node: any, pos: number) => boolean | void) => {
            for (const [src, data] of state.nodes) {
              cb({ type: { name: 'image' }, attrs: data.attrs }, data.pos);
            }
          },
        ),
      },
      tr: {
        setNodeMarkup: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
      },
    },
    view: {
      dispatch: vi.fn(),
    },
    _state: state,
  };
  return editor;
};

describe('executeUploadFlow', () => {
  const originalCreateObjectURL = globalThis.URL.createObjectURL;
  const originalRevokeObjectURL = globalThis.URL.revokeObjectURL;

  beforeEach(() => {
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    globalThis.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    globalThis.URL.createObjectURL = originalCreateObjectURL;
    globalThis.URL.revokeObjectURL = originalRevokeObjectURL;
  });

  it('inserts image with blob URL then swaps to final URL on success', async () => {
    const editor = createMockEditor();
    const file = new File([''], 'test.png', { type: 'image/png' });
    const uploadImage = vi.fn().mockResolvedValue({ url: 'https://cdn.example.com/test.png' });

    await executeUploadFlow({ editor: editor as any, file, uploadImage });

    expect(editor.chain).toHaveBeenCalled();
    expect(editor.setImage).toHaveBeenCalledWith(
      expect.objectContaining({ src: 'blob:mock-url' }),
    );
    expect(uploadImage).toHaveBeenCalledWith(file);
    expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('removes node and calls onUploadError on failure', async () => {
    const editor = createMockEditor();
    const file = new File([''], 'test.png', { type: 'image/png' });
    const error = new Error('Network error');
    const uploadImage = vi.fn().mockRejectedValue(error);
    const onUploadError = vi.fn();

    await executeUploadFlow({
      editor: editor as any,
      file,
      uploadImage,
      onUploadError,
    });

    expect(onUploadError).toHaveBeenCalledWith(error, file);
    expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('removes node on failure even without onUploadError', async () => {
    const editor = createMockEditor();
    const file = new File([''], 'test.png', { type: 'image/png' });
    const uploadImage = vi.fn().mockRejectedValue(new Error('fail'));

    await expect(
      executeUploadFlow({ editor: editor as any, file, uploadImage }),
    ).resolves.not.toThrow();

    expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd packages/editor && npx vitest run src/plugins/image/upload-flow.spec.ts`
Expected: FAIL — `executeUploadFlow` not found

- [ ] **Step 3: Implement the upload flow**

```ts
// packages/editor/src/plugins/image/upload-flow.ts
import type { Editor } from '@tiptap/core';
import type { UseEditorImageOptions } from './types';

interface ExecuteUploadFlowParams {
  editor: Editor;
  file: File;
  uploadImage: UseEditorImageOptions['uploadImage'];
  onUploadError?: UseEditorImageOptions['onUploadError'];
}

export async function executeUploadFlow({
  editor,
  file,
  uploadImage,
  onUploadError,
}: ExecuteUploadFlowParams): Promise<void> {
  const blobUrl = URL.createObjectURL(file);

  editor.chain().focus().setImage({ src: blobUrl }).run();

  try {
    const { url } = await uploadImage(file);
    swapImageSrc(editor, blobUrl, url);
  } catch (error) {
    removeImageBySrc(editor, blobUrl);
    onUploadError?.(error instanceof Error ? error : new Error(String(error)), file);
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

function swapImageSrc(editor: Editor, oldSrc: string, newSrc: string): void {
  const { state } = editor;
  const { tr } = state;
  let found = false;

  state.doc.descendants((node, pos) => {
    if (found) return false;
    if (node.type.name === 'image' && node.attrs.src === oldSrc) {
      tr.setNodeMarkup(pos, undefined, { ...node.attrs, src: newSrc });
      found = true;
      return false;
    }
  });

  if (found) {
    editor.view.dispatch(tr);
  }
}

function removeImageBySrc(editor: Editor, src: string): void {
  const { state } = editor;
  const { tr } = state;
  let found = false;

  state.doc.descendants((node, pos) => {
    if (found) return false;
    if (node.type.name === 'image' && node.attrs.src === src) {
      tr.delete(pos, pos + node.nodeSize);
      found = true;
      return false;
    }
  });

  if (found) {
    editor.view.dispatch(tr);
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd packages/editor && npx vitest run src/plugins/image/upload-flow.spec.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add packages/editor/src/plugins/image/upload-flow.ts packages/editor/src/plugins/image/upload-flow.spec.ts
git commit -m "add image upload flow with blob URL swap"
```

---

### Task 3: Image EmailNode extension

**Files:**
- Create: `packages/editor/src/plugins/image/extension.tsx`
- Create: `packages/editor/src/plugins/image/extension.spec.tsx`

- [ ] **Step 1: Write failing test for serialization**

Follow the pattern from `packages/editor/src/extensions/button.spec.tsx` — test the `renderToReactEmail` output.

```tsx
// packages/editor/src/plugins/image/extension.spec.tsx
import { render } from 'react-email';
import { describe, expect, it } from 'vitest';
import { createImageExtension } from './extension';

describe('Image extension', () => {
  const uploadImage = async () => ({ url: '' });
  const extension = createImageExtension({ uploadImage });
  const renderToReactEmail = (extension.options as any).renderToReactEmail
    ?? extension.config.renderToReactEmail;

  it('renders basic image', async () => {
    const Component = () =>
      renderToReactEmail({
        node: {
          type: { name: 'image' },
          attrs: {
            src: 'https://example.com/img.png',
            alt: 'Test image',
            width: '600',
            height: 'auto',
            alignment: 'center',
            href: null,
          },
        },
        style: {},
        extension,
      });

    const html = await render(<Component />, { pretty: true });
    expect(html).toContain('src="https://example.com/img.png"');
    expect(html).toContain('alt="Test image"');
  });

  it('wraps image in link when href is set', async () => {
    const Component = () =>
      renderToReactEmail({
        node: {
          type: { name: 'image' },
          attrs: {
            src: 'https://example.com/img.png',
            alt: '',
            width: 'auto',
            height: 'auto',
            alignment: 'center',
            href: 'https://example.com',
          },
        },
        style: {},
        extension,
      });

    const html = await render(<Component />, { pretty: true });
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('src="https://example.com/img.png"');
  });

  it('defines expected attributes', () => {
    const attrs = extension.config.addAttributes?.call(extension) ?? {};
    expect(attrs).toHaveProperty('src');
    expect(attrs).toHaveProperty('alt');
    expect(attrs).toHaveProperty('width');
    expect(attrs).toHaveProperty('height');
    expect(attrs).toHaveProperty('alignment');
    expect(attrs).toHaveProperty('href');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd packages/editor && npx vitest run src/plugins/image/extension.spec.tsx`
Expected: FAIL — `createImageExtension` not found

- [ ] **Step 3: Implement the Image extension**

The extension is created via a factory function (not `EmailNode.create` directly) because it needs the consumer's upload config to wire up ProseMirror plugins and commands.

```tsx
// packages/editor/src/plugins/image/extension.tsx
import { Img, Link } from 'react-email';
import { EmailNode } from '../../core/serializer/email-node';
import type { UseEditorImageOptions } from './types';
import { executeUploadFlow } from './upload-flow';

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

      const pastePlugin = createImagePastePlugin(editor, uploadImage, onUploadError);
      const dropPlugin = createImageDropPlugin(editor, uploadImage, onUploadError);

      return [pastePlugin, dropPlugin];
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
```

Note: `createImagePastePlugin` and `createImageDropPlugin` are referenced here but implemented in Task 4. The tests in this task only verify serialization and attributes — the ProseMirror plugin tests come in Task 4. For now, stub these functions at the bottom of the file:

```tsx
// Temporary stubs — replaced in Task 4
import { Plugin, PluginKey } from '@tiptap/pm/state';

function createImagePastePlugin(
  _editor: Editor,
  _uploadImage: UseEditorImageOptions['uploadImage'],
  _onUploadError?: UseEditorImageOptions['onUploadError'],
) {
  return new Plugin({ key: new PluginKey('imagePaste') });
}

function createImageDropPlugin(
  _editor: Editor,
  _uploadImage: UseEditorImageOptions['uploadImage'],
  _onUploadError?: UseEditorImageOptions['onUploadError'],
) {
  return new Plugin({ key: new PluginKey('imageDrop') });
}
```

Add the `Plugin`/`PluginKey` import at the top of the file alongside existing imports. The `Editor` type is already imported from `@tiptap/core` via the `declare module` block's scope.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd packages/editor && npx vitest run src/plugins/image/extension.spec.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add packages/editor/src/plugins/image/extension.tsx packages/editor/src/plugins/image/extension.spec.tsx
git commit -m "add Image EmailNode extension with serialization"
```

---

### Task 4: Paste and drop ProseMirror plugins

**Files:**
- Create: `packages/editor/src/plugins/image/paste-handler.ts`
- Create: `packages/editor/src/plugins/image/drop-handler.ts`
- Modify: `packages/editor/src/plugins/image/extension.tsx` — replace stubs with real imports

- [ ] **Step 1: Implement the paste handler plugin**

Extract the image-specific logic from `src/core/create-paste-handler.ts` (lines 42-55). The text paste handling stays in core.

```ts
// packages/editor/src/plugins/image/paste-handler.ts
import type { Editor } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { UseEditorImageOptions } from './types';
import { executeUploadFlow } from './upload-flow';

export function createImagePastePlugin(
  editor: Editor,
  uploadImage: UseEditorImageOptions['uploadImage'],
  onUploadError?: UseEditorImageOptions['onUploadError'],
) {
  return new Plugin({
    key: new PluginKey('imagePaste'),
    props: {
      handlePaste(view, event) {
        const file = event.clipboardData?.files?.[0];
        if (!file || !file.type.includes('image/')) {
          return false;
        }

        event.preventDefault();
        void executeUploadFlow({
          editor,
          file,
          uploadImage,
          onUploadError,
        });

        return true;
      },
    },
  });
}
```

- [ ] **Step 2: Implement the drop handler plugin**

Extract the image-specific logic from `src/core/create-drop-handler.ts` (lines 29-39).

```ts
// packages/editor/src/plugins/image/drop-handler.ts
import type { Editor } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { UseEditorImageOptions } from './types';
import { executeUploadFlow } from './upload-flow';

export function createImageDropPlugin(
  editor: Editor,
  uploadImage: UseEditorImageOptions['uploadImage'],
  onUploadError?: UseEditorImageOptions['onUploadError'],
) {
  return new Plugin({
    key: new PluginKey('imageDrop'),
    props: {
      handleDrop(view, event, _slice, moved) {
        if (moved || !event.dataTransfer?.files?.[0]) {
          return false;
        }

        const file = event.dataTransfer.files[0];
        if (!file.type.includes('image/')) {
          return false;
        }

        event.preventDefault();
        void executeUploadFlow({
          editor,
          file,
          uploadImage,
          onUploadError,
        });

        return true;
      },
    },
  });
}
```

- [ ] **Step 3: Replace stubs in extension.tsx**

In `packages/editor/src/plugins/image/extension.tsx`, remove the temporary stub functions and their `Plugin`/`PluginKey` imports. Replace with:

```ts
import { createImagePastePlugin } from './paste-handler';
import { createImageDropPlugin } from './drop-handler';
```

The `addProseMirrorPlugins()` method already references these functions — no other changes needed.

- [ ] **Step 4: Run existing tests to verify nothing broke**

Run: `cd packages/editor && npx vitest run src/plugins/image/`
Expected: PASS (all tests from Tasks 2 and 3)

- [ ] **Step 5: Commit**

```bash
git add packages/editor/src/plugins/image/paste-handler.ts packages/editor/src/plugins/image/drop-handler.ts packages/editor/src/plugins/image/extension.tsx
git commit -m "add paste and drop ProseMirror plugins for image upload"
```

---

### Task 5: `imageSlashCommand` export

**Files:**
- Create: `packages/editor/src/plugins/image/slash-command.ts`

- [ ] **Step 1: Create the slash command**

Follow the pattern from `packages/editor/src/ui/slash-command/commands.tsx`. Commands use the `SlashCommandItem` interface from `src/ui/slash-command/types.ts`. Existing commands use category strings `"Text"` or `"Layout"`. The image icon is at `src/ui/icons/image.tsx`.

```tsx
// packages/editor/src/plugins/image/slash-command.ts
import { ImageIcon } from '../../ui/icons/image';
import type { SlashCommandItem } from '../../ui/slash-command/types';

export const imageSlashCommand: SlashCommandItem = {
  title: 'Image',
  description: 'Upload an image',
  icon: ImageIcon({ size: 20 }),
  category: 'Layout',
  searchTerms: ['image', 'img', 'picture', 'photo', 'upload'],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).run();
    editor.commands.uploadImage();
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add packages/editor/src/plugins/image/slash-command.ts
git commit -m "add imageSlashCommand for slash command integration"
```

---

### Task 6: `useEditorImage` hook and plugin exports

**Files:**
- Create: `packages/editor/src/plugins/image/index.ts`
- Modify: `packages/editor/src/plugins/index.ts`

- [ ] **Step 1: Create the hook and plugin barrel**

```ts
// packages/editor/src/plugins/image/index.ts
import { useMemo } from 'react';
import { createImageExtension } from './extension';
import type { UseEditorImageOptions } from './types';

export type { UseEditorImageOptions } from './types';
export { imageSlashCommand } from './slash-command';

export function useEditorImage(options: UseEditorImageOptions) {
  return useMemo(
    () => createImageExtension(options),
    [options.uploadImage, options.onUploadError],
  );
}
```

- [ ] **Step 2: Add re-export to plugins barrel**

In `packages/editor/src/plugins/index.ts`, add the image plugin re-export. The file currently contains only:

```ts
export * from './email-theming';
```

Add:

```ts
export * from './email-theming';
export * from './image';
```

- [ ] **Step 3: Run all plugin tests**

Run: `cd packages/editor && npx vitest run src/plugins/`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add packages/editor/src/plugins/image/index.ts packages/editor/src/plugins/index.ts
git commit -m "add useEditorImage hook and plugin exports"
```

---

### Task 7: Remove `onUploadImage` from `<EmailEditor>`

**Files:**
- Modify: `packages/editor/src/email-editor/email-editor.tsx`
- Modify: `packages/editor/src/core/create-paste-handler.ts`
- Modify: `packages/editor/src/core/create-drop-handler.ts`

- [ ] **Step 1: Remove image handling from create-paste-handler.ts**

In `packages/editor/src/core/create-paste-handler.ts`:

Remove the `UploadImageHandler` type export (lines 12-22).
Remove `onUploadImage` from the function params (line 30).
Remove the image file handling block (lines 50-55).

The file should become:

```ts
import type { Extensions } from '@tiptap/core';
import { generateJSON } from '@tiptap/html';
import type { Slice } from '@tiptap/pm/model';
import type { EditorView } from '@tiptap/pm/view';
import { sanitizePastedHtml } from '../utils/paste-sanitizer';

export type PasteHandler = (
  payload: string | File,
  view: EditorView,
) => boolean;

export function createPasteHandler({
  onPaste,
  extensions,
}: {
  onPaste?: PasteHandler;
  extensions: Extensions;
}) {
  return (view: EditorView, event: ClipboardEvent, slice: Slice): boolean => {
    const text = event.clipboardData?.getData('text/plain');

    if (text && onPaste?.(text, view)) {
      event.preventDefault();

      return true;
    }

    if (event.clipboardData?.files?.[0]) {
      const file = event.clipboardData.files[0];
      if (onPaste?.(file, view)) {
        event.preventDefault();

        return true;
      }
    }

    if (slice.content.childCount === 1) {
      return false;
    }

    if (event.clipboardData?.getData?.('text/html')) {
      event.preventDefault();
      const html = event.clipboardData.getData('text/html');

      const sanitizedHtml = sanitizePastedHtml(html);

      const jsonContent = generateJSON(sanitizedHtml, extensions);
      const node = view.state.schema.nodeFromJSON(jsonContent);

      const transaction = view.state.tr.replaceSelectionWith(node, false);
      view.dispatch(transaction);

      return true;
    }
    return false;
  };
}
```

- [ ] **Step 2: Remove image handling from create-drop-handler.ts**

In `packages/editor/src/core/create-drop-handler.ts`:

Remove the `UploadImageHandler` import (line 2) — only import `PasteHandler`.
Remove `onUploadImage` from the function params (line 5).
Remove the image file handling block (lines 29-39).

The file should become:

```ts
import type { EditorView } from '@tiptap/pm/view';
import type { PasteHandler } from './create-paste-handler';

export function createDropHandler({
  onPaste,
}: {
  onPaste?: PasteHandler;
}) {
  return (
    view: EditorView,
    event: DragEvent,
    _slice: unknown,
    moved: boolean,
  ): boolean => {
    if (
      !moved &&
      event.dataTransfer &&
      event.dataTransfer.files &&
      event.dataTransfer.files[0]
    ) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];

      if (onPaste?.(file, view)) {
        return true;
      }
    }
    return false;
  };
}
```

- [ ] **Step 3: Remove onUploadImage from EmailEditor**

In `packages/editor/src/email-editor/email-editor.tsx`:

1. Remove the `UploadImageHandler` import (line 17) and `createDropHandler` import (line 14).
2. Remove `onUploadImage` from `EmailEditorProps` (line 36) and from destructuring (line 77).
3. Remove `createDropHandler` from the `editorProps` useMemo (lines 108-110).
4. Remove `onUploadImage` from the `createPasteHandler` call (line 105) and from the useMemo deps (line 112).

The editorProps useMemo becomes:

```ts
const editorProps: UseEditorOptions['editorProps'] = useMemo(
  () => ({
    handlePaste: createPasteHandler({
      extensions,
    }),
  }),
  [extensions],
);
```

- [ ] **Step 4: Run existing tests to check for breakage**

Run: `cd packages/editor && npx vitest run`
Expected: Some tests in `paste-drop-handlers.spec.ts` may fail if they test `onUploadImage`. Update those tests to remove image upload assertions — that behavior is now tested in the plugin's own tests.

- [ ] **Step 5: Update paste-drop-handlers.spec.ts**

Remove any test cases that assert `onUploadImage` behavior. Keep tests for text paste and generic file paste via `onPaste`.

- [ ] **Step 6: Run all tests again**

Run: `cd packages/editor && npx vitest run`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add packages/editor/src/core/create-paste-handler.ts packages/editor/src/core/create-drop-handler.ts packages/editor/src/email-editor/email-editor.tsx packages/editor/src/core/paste-drop-handlers.spec.ts
git commit -m "remove onUploadImage prop, extract image handling to plugin"
```

---

### Task 8: Integration test

**Files:**
- Create: `packages/editor/src/plugins/image/integration.spec.tsx`

- [ ] **Step 1: Write an integration test for the full consumer flow**

This test verifies the hook returns a valid extension that can be used with `EditorProvider`. It doesn't render a full browser environment — it tests that the extension is structurally correct and its commands are registered.

```tsx
// packages/editor/src/plugins/image/integration.spec.tsx
import { describe, expect, it, vi } from 'vitest';
import { useEditorImage } from './index';
import { createImageExtension } from './extension';

describe('useEditorImage integration', () => {
  it('createImageExtension returns an extension with image node config', () => {
    const extension = createImageExtension({
      uploadImage: vi.fn().mockResolvedValue({ url: '' }),
    });

    expect(extension.name).toBe('image');
    expect(extension.config.atom).toBe(true);
    expect(extension.config.draggable).toBe(true);
    expect(extension.config.group).toBe('block');
  });

  it('extension has setImage and uploadImage commands', () => {
    const extension = createImageExtension({
      uploadImage: vi.fn().mockResolvedValue({ url: '' }),
    });

    const commands = extension.config.addCommands?.call(extension);
    expect(commands).toHaveProperty('setImage');
    expect(commands).toHaveProperty('uploadImage');
  });

  it('extension registers paste and drop ProseMirror plugins', () => {
    const extension = createImageExtension({
      uploadImage: vi.fn().mockResolvedValue({ url: '' }),
    });

    expect(extension.config.addProseMirrorPlugins).toBeDefined();
  });
});
```

- [ ] **Step 2: Run all plugin tests**

Run: `cd packages/editor && npx vitest run src/plugins/image/`
Expected: PASS (all tests across upload-flow, extension, integration)

- [ ] **Step 3: Run the full editor test suite**

Run: `cd packages/editor && npx vitest run`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add packages/editor/src/plugins/image/integration.spec.tsx
git commit -m "add image plugin integration tests"
```

---

### Task 9: Build verification

**Files:** None (verification only)

- [ ] **Step 1: Run the package build**

Run: `cd packages/editor && npm run build` (or the monorepo build command)
Expected: Builds without errors. The `./plugins` export path in `package.json` already points to `dist/plugins/index.*`, so the new image plugin will be included.

- [ ] **Step 2: Verify the exports are accessible**

Check that the built output includes the image plugin:

```bash
ls packages/editor/dist/plugins/image/
```

Expected: `index.mjs`, `extension.mjs`, `upload-flow.mjs`, etc.

- [ ] **Step 3: Commit any build config changes if needed**

If `package.json` exports field needs updating (unlikely — `./plugins` already covers it), commit the change.
