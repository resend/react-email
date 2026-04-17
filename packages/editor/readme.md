# @react-email/editor

A rich text editor for editing and building email templates, built on top of [Tiptap](https://tiptap.dev) and [React Email](https://react.email).

## Structure

```
packages/editor/src/
├── core/               # Editor core: hooks, serializer, event bus, types
├── extensions/         # Tiptap extensions for email elements (button, heading, columns, etc.)
├── plugins/            # ProseMirror plugins
├── ui/                 # UI components (bubble menus, slash command, inspector)
├── utils/              # Shared utilities
└── email-editor/       # Main editor component
```

## Entry Points

The package exposes multiple entry points for granular imports:

- `@react-email/editor` — Main editor component and top-level API
- `@react-email/editor/core` — Serializer, types, and event bus
- `@react-email/editor/extensions` — Tiptap extensions for all supported email elements
- `@react-email/editor/ui` — UI components (bubble menus, slash command, inspector)
- `@react-email/editor/plugins` — ProseMirror plugins
- `@react-email/editor/utils` — Shared utilities

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

For full usage guide and API reference, see the [Editor documentation](https://react.email/docs/editor/overview).

## License

MIT
