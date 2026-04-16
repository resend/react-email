# React Email Editor Reference

A visual rich-text editor for building email templates, built on [TipTap](https://tiptap.dev/) and [ProseMirror](https://prosemirror.net/). Embed it in your app to let users compose email-ready HTML without writing code.

## Table of Contents

- [Installation](#installation)
- [CSS Setup](#css-setup)
- [Architecture](#architecture)
- [EmailEditor Component](#emaileditor-component)
- [Minimal Setup (Extensions Only)](#minimal-setup-extensions-only)
- [Bubble Menus](#bubble-menus)
- [Slash Commands](#slash-commands)
- [Inspector](#inspector)
- [Email Theming](#email-theming)
- [Email Export](#email-export)
- [Custom Extensions](#custom-extensions)

## Installation

Install the editor and its peer dependencies:

```sh
npm install @react-email/editor
```

Requires **React 18+** and a bundler that supports [package exports](https://nodejs.org/api/packages.html#exports) (Vite, Next.js, Webpack 5, etc.).

## CSS Setup

Import the bundled default theme for the quickest start:

```tsx
import '@react-email/editor/themes/default.css';
```

This includes the default color theme and built-in UI styles for bubble menus, slash commands, and the inspector.

To import only what you need:

```tsx
import '@react-email/editor/styles/bubble-menu.css';
import '@react-email/editor/styles/slash-command.css';
import '@react-email/editor/styles/inspector.css';
```

## Architecture

The editor is organized into six entry points:

| Import | Purpose |
|--------|---------|
| `@react-email/editor` | `EmailEditor`: the all-in-one component |
| `@react-email/editor/core` | `composeReactEmail` serialization, `EmailNode`, `EmailMark`, event bus, types |
| `@react-email/editor/extensions` | `StarterKit` and 35+ email-aware extensions |
| `@react-email/editor/ui` | `BubbleMenu`, `SlashCommand`, `Inspector` |
| `@react-email/editor/plugins` | `EmailTheming` plugin |
| `@react-email/editor/utils` | Attribute helpers, style utilities |

## EmailEditor Component

The `EmailEditor` component from `@react-email/editor` is a batteries-included component that bundles StarterKit, EmailTheming, BubbleMenus, and SlashCommands. Use it when you want the full experience with minimal setup.

```tsx
import { EmailEditor, type EmailEditorRef } from '@react-email/editor';
import '@react-email/editor/themes/default.css';
import { useRef } from 'react';

export function MyEditor() {
  const editorRef = useRef<EmailEditorRef>(null);

  const handleExport = async () => {
    const { html, text } = await editorRef.current!.export();
    console.log(html, text);
  };

  return (
    <div>
      <EmailEditor
        ref={editorRef}
        content="<p>Start typing...</p>"
        theme="basic"
        onReady={(editor) => console.log('Editor ready', editor)}
        onChange={(editor) => console.log('Content changed')}
      />
      <button onClick={handleExport}>Export HTML</button>
    </div>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `Content` | — | Initial editor content (HTML string or TipTap JSON) |
| `onChange` | `(editor: Editor) => void` | — | Called on every content change |
| `onUploadImage` | `UploadImageHandler` | — | Handler for pasted/dropped images |
| `onReady` | `(editor: Editor) => void` | — | Called when editor is initialized |
| `theme` | `'basic' \| 'minimal'` | `'basic'` | Built-in email theme |
| `editable` | `boolean` | `true` | Whether content is editable |
| `placeholder` | `string` | — | Placeholder text for empty editor |
| `bubbleMenu` | `{ hideWhenActiveNodes?: string[], hideWhenActiveMarks?: string[] }` | — | Configure bubble menu visibility |
| `extensions` | `Extensions` | — | Override the default extensions entirely |
| `className` | `string` | — | CSS class for the editor container |

### Ref Methods (`EmailEditorRef`)

| Method | Returns | Description |
|--------|---------|-------------|
| `export()` | `Promise<{ html: string; text: string }>` | Export email-ready HTML and plain text |
| `getJSON()` | `JSONContent` | Get editor content as TipTap JSON |
| `getHTML()` | `string` | Get editor content as HTML |
| `editor` | `Editor \| null` | Access the underlying TipTap editor instance |

## Minimal Setup (Extensions Only)

For more control, use `EditorProvider` from `@tiptap/react` directly with `StarterKit`:

```tsx
import { StarterKit } from '@react-email/editor/extensions';
import { EditorProvider } from '@tiptap/react';

const extensions = [StarterKit];

const content = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Start typing or edit this text.' }],
    },
  ],
};

export function MyEditor() {
  return <EditorProvider extensions={extensions} content={content} />;
}
```

This gives you a content-editable area with all core extensions (paragraphs, headings, lists, tables, code blocks, columns, buttons, etc.) but no UI overlays.

## Bubble Menus

Floating formatting toolbars that appear on text selection. Add as children of `EditorProvider`.

```tsx
import { StarterKit } from '@react-email/editor/extensions';
import { BubbleMenu } from '@react-email/editor/ui';
import { EditorProvider } from '@tiptap/react';
import '@react-email/editor/themes/default.css';

const extensions = [StarterKit];

export function MyEditor() {
  return (
    <EditorProvider extensions={extensions} content={content}>
      <BubbleMenu />
    </EditorProvider>
  );
}
```

### Available Bubble Menus

| Component | Appears when... | Controls |
|-----------|----------------|----------|
| `BubbleMenu` | Text is selected | Bold, italic, underline, strike, code, uppercase, alignment, node type, link |
| `BubbleMenu.LinkDefault` | Cursor is on a link | Edit URL, open link, unlink |
| `BubbleMenu.ButtonDefault` | Cursor is on a button | Edit button URL, unlink |
| `BubbleMenu.ImageDefault` | Cursor is on an image | Edit image URL |

Exclude specific items from the default menu:

```tsx
<BubbleMenu excludeItems={['strike', 'code', 'uppercase']} />
```

When combining the text bubble menu with contextual menus for links, images, or buttons, use `hideWhenActiveMarks` on `BubbleMenu` to prevent it from appearing when a link is focused.

## Slash Commands

Insert content blocks by typing `/` in the editor.

```tsx
import { defaultSlashCommands, SlashCommand } from '@react-email/editor/ui';

<EditorProvider extensions={extensions} content={content}>
  <SlashCommand items={defaultSlashCommands} />
</EditorProvider>
```

### Default Commands

| Command | Category | Description |
|---------|----------|-------------|
| `TEXT` | Text | Plain text block |
| `H1`, `H2`, `H3` | Text | Headings |
| `BULLET_LIST` | Text | Unordered list |
| `NUMBERED_LIST` | Text | Ordered list |
| `QUOTE` | Text | Block quote |
| `CODE` | Text | Code snippet |
| `BUTTON` | Layout | Clickable button |
| `DIVIDER` | Layout | Horizontal separator |
| `SECTION` | Layout | Content section |
| `TWO_COLUMNS` | Layout | Two column layout |
| `THREE_COLUMNS` | Layout | Three column layout |
| `FOUR_COLUMNS` | Layout | Four column layout |

Cherry-pick individual commands:

```tsx
import { BUTTON, H1, H2, TEXT } from '@react-email/editor/ui';

<SlashCommand items={[TEXT, H1, H2, BUTTON]} />
```

## Inspector

A contextual sidebar for editing document-level styles, node properties, and text formatting. Requires the `EmailTheming` plugin.

```tsx
import { StarterKit } from '@react-email/editor/extensions';
import { EmailTheming } from '@react-email/editor/plugins';
import { Inspector } from '@react-email/editor/ui';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
import '@react-email/editor/themes/default.css';

const extensions = [StarterKit, EmailTheming];

export function MyEditor() {
  const editor = useEditor({ extensions, content });

  return (
    <EditorContext.Provider value={{ editor }}>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <EditorContent editor={editor} />
        </div>
        <Inspector.Root style={{ width: 240, borderLeft: '1px solid #e5e7eb', padding: 16 }}>
          <Inspector.Breadcrumb />
          <Inspector.Document />
          <Inspector.Node />
          <Inspector.Text />
        </Inspector.Root>
      </div>
    </EditorContext.Provider>
  );
}
```

The inspector automatically switches between document, node, and text controls based on the current selection.

## Email Theming

Apply visual styles (typography, spacing, colors) to email output. Themes are resolved during `composeReactEmail` and inlined as `style` attributes.

```tsx
import { StarterKit } from '@react-email/editor/extensions';
import { EmailTheming } from '@react-email/editor/plugins';

const extensions = [StarterKit, EmailTheming.configure({ theme: 'basic' })];
```

### Built-in Themes

| Theme | Description |
|-------|-------------|
| `'basic'` | Full styling: typography, spacing, borders, visual hierarchy. **Default.** |
| `'minimal'` | Essentially no styles — blank slate for custom themes. |

### Switching Themes Dynamically

```tsx
const [theme, setTheme] = useState<'basic' | 'minimal'>('basic');
const extensions = [StarterKit, EmailTheming.configure({ theme })];

// Re-key EditorProvider when theme changes
<EditorProvider key={theme} extensions={extensions} content={content}>
```

## Email Export

Convert editor content to email-ready HTML and plain text.

### Via EmailEditor ref

```tsx
const editorRef = useRef<EmailEditorRef>(null);

const { html, text } = await editorRef.current!.export();
```

### Via composeReactEmail (lower-level)

```tsx
import { composeReactEmail } from '@react-email/editor/core';
import { useCurrentEditor } from '@tiptap/react';

function ExportPanel() {
  const { editor } = useCurrentEditor();

  const handleExport = async () => {
    if (!editor) return;
    const { html, text } = await composeReactEmail({
      editor,
      preview: 'Inbox preview text', // optional
    });
    console.log(html, text);
  };

  return <button onClick={handleExport}>Export HTML</button>;
}
```

The `preview` parameter is optional — when provided, it sets the inbox preview text in the exported HTML.

The export pipeline:
1. Reads the editor's JSON document
2. Traverses each node and mark
3. Calls `renderToReactEmail()` on each `EmailNode` and `EmailMark`
4. Applies theme styles via `EmailTheming` plugin (if configured)
5. Wraps in a base template and renders to HTML string + plain text

## Custom Extensions

Create custom email-compatible nodes using `EmailNode` (extends TipTap's `Node` with `renderToReactEmail()`):

```tsx
import { EmailNode } from '@react-email/editor/core';
import { mergeAttributes } from '@tiptap/core';

const Callout = EmailNode.create({
  name: 'callout',
  group: 'block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: 'div[data-callout]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-callout': '',
        style: 'padding: 12px 16px; background: #f4f4f5; border-left: 3px solid #1c1c1c;',
      }),
      0,
    ];
  },

  renderToReactEmail({ children, style }) {
    return (
      <div style={{ ...style, padding: '12px 16px', backgroundColor: '#f4f4f5', borderLeft: '3px solid #1c1c1c' }}>
        {children}
      </div>
    );
  },
});

// Register it
const extensions = [StarterKit, Callout];
```

For custom marks (inline formatting), use `EmailMark` from `@react-email/editor/core` — same pattern but for inline elements.
