# Public Export Map

This document records the public surface of `@react-email/editor@1.1.1` before
package isolation. Phase 2 adds an export smoke command:

```sh
pnpm asym:editor-export-smoke
```

The smoke command imports all JavaScript subpaths after build and resolves all
CSS/theme export subpaths.

## Package Export Subpaths

| Subpath | Kind | Target |
|---|---|---|
| `@react-email/editor` | JS | `./dist/index.mjs`, `./dist/index.cjs` |
| `@react-email/editor/core` | JS | `./dist/core/index.mjs`, `./dist/core/index.cjs` |
| `@react-email/editor/extensions` | JS | `./dist/extensions/index.mjs`, `./dist/extensions/index.cjs` |
| `@react-email/editor/plugins` | JS | `./dist/plugins/index.mjs`, `./dist/plugins/index.cjs` |
| `@react-email/editor/ui` | JS | `./dist/ui/index.mjs`, `./dist/ui/index.cjs` |
| `@react-email/editor/utils` | JS | `./dist/utils/index.mjs`, `./dist/utils/index.cjs` |
| `@react-email/editor/styles/bubble-menu.css` | CSS | `./dist/ui/bubble-menu/bubble-menu.css` |
| `@react-email/editor/styles/link-bubble-menu.css` | CSS | `./dist/ui/link-bubble-menu/link-bubble-menu.css` |
| `@react-email/editor/styles/button-bubble-menu.css` | CSS | `./dist/ui/button-bubble-menu/button-bubble-menu.css` |
| `@react-email/editor/styles/image-bubble-menu.css` | CSS | `./dist/ui/image-bubble-menu/image-bubble-menu.css` |
| `@react-email/editor/styles/slash-command.css` | CSS | `./dist/ui/slash-command/slash-command.css` |
| `@react-email/editor/styles/inspector.css` | CSS | `./dist/ui/inspector/inspector.css` |
| `@react-email/editor/themes/default.css` | CSS theme | `./dist/ui/themes/default.css` |

## Root Export: `@react-email/editor`

Source: `packages/editor/src/index.ts`

Exports:

- `EmailEditor`
- `EmailEditorProps` type
- `EmailEditorRef` type

Current behavior:

- `EmailEditor` is a React component around TipTap `EditorProvider`.
- It configures `StarterKit`, `Placeholder`, `EmailTheming`, image upload,
  `BubbleMenu`, and `SlashCommandRoot` by default.
- `EmailEditorRef` exposes `getEmail`, `getEmailHTML`, `getEmailText`,
  `getJSON`, and `editor`.

## Core Export: `@react-email/editor/core`

Source: `packages/editor/src/core/index.ts`

Runtime exports:

- `composeReactEmail`
- `EmailMark`
- `EmailNode`
- `editorEventBus`
- `isDocumentVisuallyEmpty`
- `useEditorEvent`

Type exports:

- `ComposeReactEmailResult` is internal today; the function return type is
  inferred from `composeReactEmail`.
- `ConfigParameter`
- `DispatchOptions`
- `EditorEventHandler`
- `EditorEventMap`
- `EditorEventName`
- `EditorEventSubscription`
- `EventHandler`
- `EventSubscription`
- `MarkRendererComponent`
- `NodeClickedEvent`
- `NodeRendererComponent`
- `PlaceholderItem`
- `CustomPlaceholder`
- `SerializerPluginStorage`

Important email-specific public concepts:

- `composeReactEmail`
- `EmailNode`
- `EmailMark`
- `renderToReactEmail`
- `BaseTemplate` in `SerializerPluginStorage`

These are structurally useful but must become document/PDF terms in later
phases without breaking current exports prematurely.

## Extensions Export: `@react-email/editor/extensions`

Source: `packages/editor/src/extensions/index.ts`

Runtime exports:

- `AlignmentAttribute`
- `Blockquote`
- `Body`
- `Bold`
- `BulletList`
- `Button`
- `ClassAttribute`
- `Code`
- `CodeBlockPrism`
- `ColumnsColumn`
- `Container`
- `Div`
- `Divider`
- `FourColumns`
- `GlobalContent`
- `HardBreak`
- `Heading`
- `Italic`
- `Link`
- `ListItem`
- `MaxNesting`
- `OrderedList`
- `Paragraph`
- `PreservedStyle`
- `PreviewText`
- `Section`
- `StarterKit`
- `Strike`
- `StyleAttribute`
- `Sup`
- `Table`
- `TableCell`
- `TableHeader`
- `TableRow`
- `Text`
- `ThreeColumns`
- `TrailingNode`
- `TwoColumns`
- `Underline`
- `Uppercase`

Type exports include each extension's option type where defined, including:

- `AlignmentOptions`
- `BlockquoteOptions`
- `BodyOptions`
- `BoldOptions`
- `ClassAttributeOptions`
- `CodeBlockPrismOptions`
- `ContainerOptions`
- `DivOptions`
- `DividerOptions`
- `EditorButtonOptions`
- `GlobalContentOptions`
- `HeadingOptions`
- `LinkOptions`
- `MaxNestingOptions`
- `PreviewTextOptions`
- `SectionOptions`
- `StarterKitOptions`
- `StyleAttributeOptions`
- `SupOptions`
- `TableCellOptions`
- `TableOptions`
- `TableRowOptions`
- `TrailingNodeOptions`
- `UnderlineOptions`
- `UppercaseOptions`

Current structural value for PDF:

- Keep the TipTap extension registration shape.
- Fork `StarterKit` and email-aware node/mark serializer behavior later.
- Preserve current exports until compatibility shims are explicitly planned.

## Plugins Export: `@react-email/editor/plugins`

Sources:

- `packages/editor/src/plugins/email-theming/index.ts`
- `packages/editor/src/plugins/image/index.ts`

Runtime exports:

- `createTheme`
- `EDITOR_THEMES`
- `EmailTheming`
- `getEmailTheming`
- `getPanelTitle`
- `getThemeBodyFontSizePx`
- `imageSlashCommand`
- `INBOX_EMAIL_DEFAULTS`
- `parseCssValue`
- `RESET_THEMES`
- `resolveResetValue`
- `SUPPORTED_CSS_PROPERTIES`
- `themeStylesToPanelOverrides`
- `useEditorImage`
- `useEmailTheming`

Type exports:

- `CssJs`
- `EditorTheme`
- `EditorThemeInput`
- `KnownCssProperties`
- `KnownThemeComponents`
- `PanelGroup`
- `PanelInputProperty`
- `PanelSectionId`
- `ResetTheme`
- `SupportedCssProperties`
- `ThemeableComponent`
- `ThemeComponentStyles`
- `ThemeConfig`
- `UploadImageResult`
- `UseEditorImageOptions`

Current PDF isolation note:

- `EmailTheming` is structurally useful for document theming, but the current
  name and defaults are email-oriented.
- `useEditorImage` keeps image upload browser-side. Future production PDF
  rendering must use structured, render-safe asset references instead of blob
  URLs or private app-session URLs.
- `createImageExtension` exists as an internal implementation helper under
  `packages/editor/src/plugins/image/extension.tsx`, but it is not exported
  from the `@react-email/editor/plugins` public subpath today.

## UI Export: `@react-email/editor/ui`

Source: `packages/editor/src/ui/index.ts`

Main grouped runtime exports:

- `BubbleMenu`
- `EditorFocusScope`
- `Inspector`
- `SlashCommand`

Bubble menu runtime exports:

- `BubbleMenuAlignCenter`
- `BubbleMenuAlignLeft`
- `BubbleMenuAlignRight`
- `BubbleMenuBold`
- `BubbleMenuButtonDefault`
- `BubbleMenuButtonEditLink`
- `BubbleMenuButtonForm`
- `BubbleMenuButtonToolbar`
- `BubbleMenuButtonUnlink`
- `BubbleMenuCode`
- `BubbleMenuImageDefault`
- `BubbleMenuImageEditLink`
- `BubbleMenuImageForm`
- `BubbleMenuImageToolbar`
- `BubbleMenuImageUnlink`
- `BubbleMenuItalic`
- `BubbleMenuItem`
- `BubbleMenuItemGroup`
- `BubbleMenuLinkDefault`
- `BubbleMenuLinkEditLink`
- `BubbleMenuLinkForm`
- `BubbleMenuLinkOpenLink`
- `BubbleMenuLinkSelector`
- `BubbleMenuLinkToolbar`
- `BubbleMenuLinkUnlink`
- `BubbleMenuNodeSelector`
- `BubbleMenuRoot`
- `BubbleMenuSeparator`
- `BubbleMenuStrike`
- `BubbleMenuUnderline`
- `BubbleMenuUppercase`
- `NodeSelectorContent`
- `NodeSelectorRoot`
- `NodeSelectorTrigger`
- `bubbleMenuTriggers`
- `useBubbleMenuContext`

Slash command runtime exports:

- `BULLET_LIST`
- `BUTTON`
- `CODE`
- `DIVIDER`
- `FOUR_COLUMNS`
- `H1`
- `H2`
- `H3`
- `NUMBERED_LIST`
- `QUOTE`
- `SECTION`
- `TEXT`
- `THREE_COLUMNS`
- `TWO_COLUMNS`
- `defaultSlashCommands`
- `filterAndRankItems`
- `isAtMaxColumnsDepth`
- `isInsideNode`
- `scoreItem`

Inspector runtime exports:

- `Inspector`
- `getNodeMeta`

Icon runtime exports:

- `AlignCenterIcon`
- `AlignCenterVerticalIcon`
- `AlignEndVerticalIcon`
- `AlignLeftIcon`
- `AlignRightIcon`
- `AlignStartVerticalIcon`
- `BoldIcon`
- `BoxIcon`
- `CaseUpperIcon`
- `CheckIcon`
- `ChevronDownIcon`
- `CodeIcon`
- `Columns2Icon`
- `Columns3Icon`
- `Columns4Icon`
- `CornerBottomLeftIcon`
- `CornerBottomRightIcon`
- `CornerTopLeftIcon`
- `CornerTopRightIcon`
- `ExternalLinkIcon`
- `Heading1Icon`
- `Heading2Icon`
- `Heading3Icon`
- `ImageIcon`
- `ItalicIcon`
- `LayoutIcon`
- `LinkIcon`
- `ListIcon`
- `ListOrderedIcon`
- `MinusIcon`
- `MousePointerClickIcon`
- `MousePointerIcon`
- `PanelBottomIcon`
- `PanelLeftIcon`
- `PanelRightIcon`
- `PanelTopIcon`
- `PencilIcon`
- `PlusIcon`
- `Rows2Icon`
- `SplitSquareVerticalIcon`
- `SquareCodeIcon`
- `SquareDashedIcon`
- `SquareIcon`
- `SquareRoundCornerIcon`
- `StrikethroughIcon`
- `TableIcon`
- `TextIcon`
- `TextQuoteIcon`
- `TypeIcon`
- `UnderlineIcon`
- `UnlinkIcon`
- `XIcon`

Type exports include component prop types, bubble menu context types, slash
command item/search types, node selector types, inspector contexts, `NodeMeta`,
and `IconProps`.

## Utils Export: `@react-email/editor/utils`

Source: `packages/editor/src/utils/index.ts`

Runtime exports:

- `setTextAlignment`

`packages/editor/src/utils` contains more internal helpers, but only
`setTextAlignment` is public through the package subpath today.

## CSS And Theme Exports

The CSS files are public import surfaces and are included in
`package.json#sideEffects`:

```ts
import '@react-email/editor/themes/default.css';
import '@react-email/editor/styles/bubble-menu.css';
import '@react-email/editor/styles/link-bubble-menu.css';
import '@react-email/editor/styles/button-bubble-menu.css';
import '@react-email/editor/styles/image-bubble-menu.css';
import '@react-email/editor/styles/slash-command.css';
import '@react-email/editor/styles/inspector.css';
```

The default theme imports the bubble menu, slash command, and inspector CSS.
Future package boundaries must keep CSS imports deterministic and explicit.

## Export Smoke Coverage

`pnpm asym:editor-export-smoke` verifies these runtime JS exports:

- root: `EmailEditor`
- core: `EmailMark`, `EmailNode`, `composeReactEmail`, `editorEventBus`,
  `isDocumentVisuallyEmpty`
- extensions: representative base blocks/marks and `StarterKit`
- plugins: `EmailTheming`, `useEditorImage`
- UI: `BubbleMenu`, `Inspector`, `SlashCommand`
- utils: `setTextAlignment`

It also resolves each CSS/theme subpath and checks the file exists.
