# @react-email/editor

## 1.5.3

### Patch Changes

- Updated dependencies [d47825a]
- Updated dependencies [3875d2a]
  - react-email@6.5.0

## 1.5.2

### Patch Changes

- 0963d30: scrub `javascript:`, `vbscript:`, and non-image `data:` URLs from pasted HTML and drop `script`, `iframe`, `object`, `embed`, `meta`, and `base` elements. This pass now runs on every paste; previously, content carrying the editor's `node-*` class marker took a fast-path that skipped sanitization entirely and could be spoofed by hosting attacker HTML with the same class name. Legitimate intra-editor copy/paste still round-trips `class`, `style`, and `data-*` attributes as before.

## 1.5.1

### Patch Changes

- Updated dependencies [ba99365]
  - react-email@6.4.0

## 1.5.0

### Minor Changes

- 3353e03: expose the unformatted (non-prettified) HTML from `composeReactEmail` as a new `unformattedHtml` field on the result. The existing `html` field is unchanged and still Prettier-formatted. Consumers that persist or send the email should prefer `unformattedHtml`, since `pretty()` indentation can inflate the byte size by 5–10× on deeply-nested table layouts (e.g. exports from Stripo or Mailchimp) and pushes the output past Gmail's 102 KB clipping threshold.

## 1.4.8

### Patch Changes

- f355fba: prevent prototype pollution in the email-theming plugin by building `cssJS` and merged theme objects from `Object.create(null)` so attacker-controlled `__proto__`, `constructor`, or `prototype` keys in panel-style input become regular own properties instead of mutating `Object.prototype`
  - react-email@6.3.3

## 1.4.7

### Patch Changes

- Updated dependencies [fbda5c8]
  - react-email@6.3.2

## 1.4.6

### Patch Changes

- Updated dependencies [c610dc0]
  - react-email@6.3.1

## 1.4.5

### Patch Changes

- react-email@6.3.0

## 1.4.4

### Patch Changes

- Updated dependencies [06f1d05]
- Updated dependencies [192d82a]
  - react-email@6.2.0

## 1.4.3

### Patch Changes

- Updated dependencies [1a61cb0]
  - react-email@6.1.5

## 1.4.2

### Patch Changes

- 962f753: Hide rich text bubble menu options when inline code is active

## 1.4.1

### Patch Changes

- 5c6c805: Blocks typing over the divider block and by mistake removing it from the content.
- Updated dependencies [1c386ce]
- Updated dependencies [ad6a9de]
  - react-email@6.1.4

## 1.4.0

### Minor Changes

- 1718669: Enable single columns deletion, and columns focus improvements.

## 1.3.10

### Patch Changes

- react-email@6.1.3

## 1.3.9

### Patch Changes

- react-email@6.1.2

## 1.3.8

### Patch Changes

- 9e4a577: reset styles for divider

## 1.3.7

### Patch Changes

- Updated dependencies [3c62bd0]
  - react-email@6.1.1

## 1.3.6

### Patch Changes

- Updated dependencies [47eeece]
  - react-email@6.1.0

## 1.3.5

### Patch Changes

- Updated dependencies [65525e0]
  - react-email@6.0.8

## 1.3.4

### Patch Changes

- Updated dependencies [87a2486]
  - react-email@6.0.7

## 1.3.3

### Patch Changes

- bbc9293: Source editor node defaults from the email theme reset.
- Updated dependencies [84bb7ab]
  - react-email@6.0.6

## 1.3.2

### Patch Changes

- dbd400d: fix bubble menu's node selector closing bubble menu

## 1.3.1

### Patch Changes

- react-email@6.0.5

## 1.3.0

### Minor Changes

- 26849a1: new cellspacing attribute for columns node, remove the gap for columns from default css

## 1.2.2

### Patch Changes

- 7b8df09: Clear the injected global CSS `<style>` element when the user empties global CSS in the editor. Previously, deleting all global CSS at once left the previously injected rules in the DOM, so the email editor preview kept showing stale styles.
- Updated dependencies [96af3a7]
- Updated dependencies [5cf57ae]
  - react-email@6.0.4

## 1.2.1

### Patch Changes

- Updated dependencies [bb51e5e]
  - react-email@6.0.3

## 1.2.0

### Minor Changes

- f2a8a42: - Add the `FocusScopes` extension to replace provider-based editor focus tracking.
  - Always wrap bubble menus and slash commands with editor focus scopes.
  - Improve reliability when handling `focusout` events from menus, inspector controls, and remounted focused elements.

### Patch Changes

- Updated dependencies [63b6e71]
  - react-email@6.0.2

## 1.1.2

### Patch Changes

- Updated dependencies [599b8c5]
  - react-email@6.0.1

## 1.1.1

### Patch Changes

- 2377e89: Emit active EmailTheming link styles in the Link mark's `renderHTML` so plain links carry inline color + underline in exported HTML. User inline styles still take precedence via the CSS cascade. `RESET_MINIMAL.link` now also ships `#0670DB` + underline.

## 1.1.0

### Minor Changes

- f5b1338: add image bubble menu edit-link form and unlink button

### Patch Changes

- 1be5684: Do not preserve button href through HTML round-trip

## 1.0.2

### Patch Changes

- 4155ec9: fix slash command scrollbar extending past rounded corners

## 1.0.1

### Patch Changes

- 8e4226a: introduce paragraph option to the custom theme property

## 1.0.0

### Major Changes

- 3ea987b: avoid injecting undefined css values
- abb7e8d: add `getEmailHTML()` and `getEmailText()` to `EmailEditorRef`, remove `getHTML()`, rename `onChange` to `onUpdate`

### Minor Changes

- 274647c: add placeholder style
- c95a1e5: add `onUploadImage` prop to `EmailEditor` and merge image paste/drop handlers into a single plugin
- 783f16f: don't add an extra focus scope provider if there's already one present above Inspector.Root
- 18323bd: add trailing nodes for columns and sections
- 73ae830: New `ThemeConfig` API for custom theming

### Patch Changes

- 766cc41: remove placeholder from starter kit, keep it in standalone editor
- 08c2865: Add `children` prop to `EmailEditor` for composing UI like the Inspector sidebar inside the editor context
- ca6a71d: Render Table as a native `<table>` instead of `Section` to fix invalid `<tr>` inside `<td>` nesting in email output
- 289290b: improved default for inspector
- 7d587f3: Align `EmailEditor`'s `onReady` callback with `onUpdate` so it receives `EmailEditorRef`
- 07fb6f0: fix color pickers closing and not letting drag happen in root node
- 29a2cd9: remove line height from default inbox styles
- c9cfb15: `InspectorBreadcrumbSegment.node` is now always a `FocusedNode`; exports `getNodeMeta` for custom breadcrumb label/icon mapping.
- f3f988b: collapse `SlashCommand.Root` into `SlashCommand` and stop exporting internal `CommandList`/`CommandListProps`. Replace `<SlashCommand.Root ...>` with `<SlashCommand ...>`.
- Updated dependencies [a3a15ea]
- Updated dependencies [d0a7a52]
  - react-email@6.0.0

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
