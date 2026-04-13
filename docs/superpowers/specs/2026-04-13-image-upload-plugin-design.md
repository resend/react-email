# Image Upload Plugin Design

**Linear:** PRODUCT-1954
**Date:** 2026-04-13

## Overview

A `useEditorImage` hook in `@react-email/editor/plugins` that returns a self-contained Tiptap extension for image upload. Replaces the current `onUploadImage` prop on `<EmailEditor>`.

## Consumer API

```tsx
import { useEditorImage, imageSlashCommand } from '@react-email/editor/plugins';
import { StarterKit } from '@react-email/editor/extensions';

function EmailEditor() {
  const Image = useEditorImage({
    uploadImage: async (file) => {
      const { url } = await myApi.upload(file);
      return { url };
    },
    onUploadError: (error, file) => {
      toast.error(`Upload failed: ${file.name}`);
    },
  });

  return (
    <EditorProvider
      extensions={[StarterKit, Image]}
      slashCommands={[...defaultSlashCommands, imageSlashCommand]}
    />
  );
}
```

### `UseEditorImageOptions`

| Option | Type | Required | Description |
|---|---|---|---|
| `uploadImage` | `(file: File) => Promise<{ url: string }>` | Yes | Uploads file, returns final URL |
| `onUploadError` | `(error: Error, file: File) => void` | No | Called when upload fails |

### Return value

A Tiptap `Extension` (specifically an `EmailNode`) that can be passed directly to `<EditorProvider extensions={[...]}/>`.

### `imageSlashCommand`

Pre-built `SlashCommandItem` that calls `editor.commands.uploadImage()`. Exported as a convenience — consumers add it to their slash commands array.

## Image Node

### Properties

| Property | Value |
|---|---|
| `name` | `'image'` |
| `group` | `'block'` |
| `atom` | `true` |
| `draggable` | `true` |

### Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | `""` | Image URL (blob during upload, final after) |
| `alt` | `string` | `""` | Alt text |
| `width` | `string` | `"auto"` | Width |
| `height` | `string` | `"auto"` | Height |
| `alignment` | `string` | `"center"` | Horizontal alignment |
| `href` | `string` | `null` | Optional wrapping link URL |

### Commands

| Command | Description |
|---|---|
| `setImage({ src, alt, ... })` | Insert image node with given attributes |
| `uploadImage()` | Open file picker, then run optimistic insert + upload flow |

### ProseMirror Plugins

The extension registers paste and drop handlers via `addProseMirrorPlugins`:

- **Paste handler** — intercepts pasted image files, runs upload flow
- **Drop handler** — intercepts dropped image files at drop position

The image-specific logic is extracted from the current `createPasteHandler` / `createDropHandler` in `core/`. The text paste handling remains in `core/` untouched.

## Upload Flow

Same flow regardless of entry point (paste, drop, slash command, programmatic):

1. Create blob URL from `File` via `URL.createObjectURL(file)`
2. Insert image node with blob URL as `src`
3. Call consumer's `uploadImage(file)`
4. **On success** — update node's `src` to the returned URL, revoke blob URL
5. **On failure** — remove the image node, revoke blob URL, call `onUploadError(error, file)` if provided

## Serialization

```tsx
renderToReactEmail: ({ node, style }) => {
  const img = <Img src={node.attrs.src} alt={node.attrs.alt} style={style} />;
  if (node.attrs.href) {
    return <Link href={node.attrs.href}>{img}</Link>;
  }
  return img;
}
```

Uses the existing React Email `<Img>` and `<Link>` components.

## Package Exports

From `@react-email/editor/plugins`:

```ts
export { useEditorImage } from './image';
export type { UseEditorImageOptions } from './image';
export { imageSlashCommand } from './image';
```

## Removals

- `onUploadImage` prop from `<EmailEditor>` component
- Image handling logic extracted out of `createPasteHandler` / `createDropHandler` in `core/` — text paste handling stays in `core/` untouched

## Unchanged

- `<BubbleMenu.ImageDefault />` — works as-is once the Image node type exists
- Slash command system — consumer adds `imageSlashCommand` to their array
- Inspector panel — already supports `'image'` type
- Theme system — already has `'image'` component key
- `AlignmentAttribute`, `StyleAttribute`, `ClassAttribute` — already include `'image'` in their type lists

## File Structure

```
packages/editor/src/
  plugins/
    image/
      index.ts              # useEditorImage hook, imageSlashCommand export
      extension.tsx          # EmailNode definition (attributes, commands, renderToReactEmail)
      upload-flow.ts         # Blob URL creation, upload orchestration, node swap/removal
      paste-handler.ts       # ProseMirror paste plugin (image logic extracted from core/)
      drop-handler.ts        # ProseMirror drop plugin (image logic extracted from core/)
      types.ts               # UseEditorImageOptions, UploadImageHandler
    index.ts                 # Re-exports from image/
```
