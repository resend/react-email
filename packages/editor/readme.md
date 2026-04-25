# @react-email/editor

> Fork status: `@react-email/editor` is the retained upstream editor baseline
> for the Asymmetric.al PDF Document Builder. It still documents current package
> behavior, but product direction and phase scope live in the root README,
> OpenSpec, and `docs/`.

A rich text editor for editing and building email templates, built on top of
[Tiptap](https://tiptap.dev) and [React Email](https://react.email).

## Structure

```text
packages/editor/src/
  core/               # Editor core: hooks, serializer, event bus, types
  extensions/         # Tiptap extensions for current baseline elements
  plugins/            # ProseMirror plugins
  ui/                 # UI components: menus, slash command, inspector
  utils/              # Shared utilities
  email-editor/       # Main editor component
```

## Entry Points

The package exposes multiple entry points for granular imports:

- `@react-email/editor` - main editor component and top-level API
- `@react-email/editor/core` - serializer, types, and event bus
- `@react-email/editor/extensions` - Tiptap extensions for current baseline
  elements
- `@react-email/editor/ui` - UI components: menus, slash command, inspector
- `@react-email/editor/plugins` - ProseMirror plugins
- `@react-email/editor/utils` - shared utilities

## Installation

```bash
npm install @react-email/editor
```

## Development

```bash
# Build the package
pnpm build

# Run type checking
pnpm typecheck

# Run all tests
pnpm test

# Run unit tests only
pnpm test:unit

# Run browser tests only
pnpm test:browser

# Watch mode for tests
pnpm test:watch
```

## Documentation

For current upstream usage guide and API reference, see the
[Editor documentation](https://react.email/docs/editor/overview). For PDF
builder work, start from the root README and OpenSpec.

## License

MIT
