# @react-email/editor examples

Interactive examples demonstrating the [React Email Editor](https://react.email/docs/editor/overview). Each example is a standalone component that showcases a specific feature or pattern.

**Live website:** [editor-examples.react.email](https://editor-examples.react.email)

## Running locally

From the repository root:

```sh
pnpm install
pnpm dev --filter editor-examples
```

Then open <http://localhost:5173> in your browser. Use the sidebar to navigate between examples.

## Examples

### One-Line Editor

| Example | Demo | Source | Docs |
|---------|------|--------|------|
| **One-Line Editor — Minimal** — Single `EmailEditor` with default wiring | [Live](https://editor-examples.react.email/#one-line-editor) | [`one-line-editor.tsx`](src/examples/one-line-editor.tsx) | [Getting Started](https://react.email/docs/editor/getting-started) |
| **One-Line Editor — Full Features** — Theme toggle, HTML export, JSON output | [Live](https://editor-examples.react.email/#one-line-editor-full) | [`one-line-editor-full.tsx`](src/examples/one-line-editor-full.tsx) | [Getting Started](https://react.email/docs/editor/getting-started) |

### Getting Started

| Example | Demo | Source | Docs |
|---------|------|--------|------|
| **Basic Editor** — `EditorProvider` with `StarterKit` only | [Live](https://editor-examples.react.email/#basic-editor) | [`basic-editor.tsx`](src/examples/basic-editor.tsx) | [Getting Started](https://react.email/docs/editor/getting-started) |
| **Bubble Menu** — Default floating formatting toolbar | [Live](https://editor-examples.react.email/#bubble-menu) | [`bubble-menu.tsx`](src/examples/bubble-menu.tsx) | [Bubble Menu](https://react.email/docs/editor/features/bubble-menu) |
| **Slash Commands** — Command menu with custom commands | [Live](https://editor-examples.react.email/#slash-commands) | [`slash-commands.tsx`](src/examples/slash-commands.tsx) | [Slash Commands](https://react.email/docs/editor/features/slash-commands) |

### Intermediate

| Example | Demo | Source | Docs |
|---------|------|--------|------|
| **Custom Bubble Menu** — Composing a menu from primitives | [Live](https://editor-examples.react.email/#custom-bubble-menu) | [`custom-bubble-menu.tsx`](src/examples/custom-bubble-menu.tsx) | [Bubble Menu](https://react.email/docs/editor/features/bubble-menu) |
| **Link Editing** — Inline link editing with `Cmd+K` | [Live](https://editor-examples.react.email/#link-editing) | [`link-editing.tsx`](src/examples/link-editing.tsx) | [Link Editing](https://react.email/docs/editor/features/link-editing) |
| **Column Layouts** — Toolbar-driven 2/3/4 column insertion | [Live](https://editor-examples.react.email/#column-layouts) | [`column-layouts.tsx`](src/examples/column-layouts.tsx) | [Column Layouts](https://react.email/docs/editor/features/column-layouts) |
| **Buttons** — Button insertion and editing | [Live](https://editor-examples.react.email/#buttons) | [`images-and-buttons.tsx`](src/examples/images-and-buttons.tsx) | [Buttons](https://react.email/docs/editor/features/buttons) |

### Advanced

| Example | Demo | Source | Docs |
|---------|------|--------|------|
| **Email Theming** — Basic/Minimal theme toggle | [Live](https://editor-examples.react.email/#email-theming) | [`email-theming.tsx`](src/examples/email-theming.tsx) | [Email Theming](https://react.email/docs/editor/features/theming) |
| **Email Export** — HTML export via `composeReactEmail` | [Live](https://editor-examples.react.email/#email-export) | [`email-export.tsx`](src/examples/email-export.tsx) | [Email Export](https://react.email/docs/editor/features/email-export) |
| **Custom Extensions** — Custom Callout node with `EmailNode.create` | [Live](https://editor-examples.react.email/#custom-extensions) | [`custom-extensions.tsx`](src/examples/custom-extensions.tsx) | [Custom Extensions](https://react.email/docs/editor/advanced/custom-extensions) |
| **Inspector — Defaults** — Default inspector panels | [Live](https://editor-examples.react.email/#inspector-defaults) | [`inspector-defaults.tsx`](src/examples/inspector-defaults.tsx) | [Overview](https://react.email/docs/editor/overview) |
| **Inspector — Composed** — Composed inspector layout | [Live](https://editor-examples.react.email/#inspector-composed) | [`inspector-composed.tsx`](src/examples/inspector-composed.tsx) | [Overview](https://react.email/docs/editor/overview) |
| **Inspector — Fully Custom** — Custom inspector UI | [Live](https://editor-examples.react.email/#inspector-custom) | [`inspector-custom.tsx`](src/examples/inspector-custom.tsx) | [Overview](https://react.email/docs/editor/overview) |
| **Full Email Builder** — All features combined | [Live](https://editor-examples.react.email/#full-email-builder) | [`full-email-builder.tsx`](src/examples/full-email-builder.tsx) | [Email Export](https://react.email/docs/editor/features/email-export) |

## Documentation

- [Editor Overview](https://react.email/docs/editor/overview)
- [Getting Started](https://react.email/docs/editor/getting-started)
- [Bubble Menu](https://react.email/docs/editor/features/bubble-menu)
- [Slash Commands](https://react.email/docs/editor/features/slash-commands)
- [Email Theming](https://react.email/docs/editor/features/theming)
- [Styling](https://react.email/docs/editor/features/styling)
- [Buttons](https://react.email/docs/editor/features/buttons)
- [Column Layouts](https://react.email/docs/editor/features/column-layouts)
- [Link Editing](https://react.email/docs/editor/features/link-editing)
- [Email Export](https://react.email/docs/editor/features/email-export)
- [Extensions](https://react.email/docs/editor/advanced/extensions)
- [Custom Extensions](https://react.email/docs/editor/advanced/custom-extensions)
