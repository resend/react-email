# @react-email/editor

## 0.0.0-canary.51

### Major Changes

- abb7e8d: add `getEmailHTML()` and `getEmailText()` to `EmailEditorRef`, remove `getHTML()`, rename `onChange` to `onUpdate`

### Patch Changes

- 766cc41: remove placeholder from starter kit, keep it in standalone editor
- ca6a71d: Render Table as a native `<table>` instead of `Section` to fix invalid `<tr>` inside `<td>` nesting in email output
- 7d587f3: Align `EmailEditor`'s `onReady` callback with `onUpdate` so it receives `EmailEditorRef`
- 07fb6f0: fix color pickers closing and not letting drag happen in root node
  - react-email@6.0.0-canary.2

## 0.0.0-canary.50

### Major Changes

- 3ea987b: avoid injecting undefined css values

### Minor Changes

- 274647c: add placeholder style
- c95a1e5: add `onUploadImage` prop to `EmailEditor` and merge image paste/drop handlers into a single plugin
- 783f16f: don't add an extra focus scope provider if there's already one present above Inspector.Root
- 18323bd: add trailing nodes for columns and sections

### Patch Changes

- 29a2cd9: remove line height from default inbox styles
- f3f988b: collapse `SlashCommand.Root` into `SlashCommand` and stop exporting internal `CommandList`/`CommandListProps`. Replace `<SlashCommand.Root ...>` with `<SlashCommand ...>`.
  - react-email@6.0.0-canary.1

## 0.0.0-canary.49

### Patch Changes

- 08c2865: Add `children` prop to `EmailEditor` for composing UI like the Inspector sidebar inside the editor context
- Updated dependencies [a3a15ea]
- Updated dependencies [d0a7a52]
  - react-email@6.0.0-canary.0
