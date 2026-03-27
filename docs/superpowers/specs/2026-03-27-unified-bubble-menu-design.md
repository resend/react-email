# Unified BubbleMenu API Design

## Context

PR #3104 review feedback (Gabriel): `excludeNodes`/`excludeMarks` naming is confusing (sounds like hiding toggles, actually controls menu visibility triggers), and having 4 separate bubble menu components (BubbleMenu, ButtonBubbleMenu, LinkBubbleMenu, ImageBubbleMenu) is unnecessary — should unify into a single component with configurable triggers.

## Design

### Unified Root

`BubbleMenu.Root` becomes the single Root for all bubble menu use cases.

```tsx
interface BubbleMenuRootProps {
  shouldShow?: ShouldShowFn;
  pluginKey?: string;  // default: "bubbleMenu"
  hideWhenActiveNodes?: string[];
  hideWhenActiveMarks?: string[];
  placement?: 'top' | 'bottom';
  offset?: number;
  onHide?: () => void;
  children: React.ReactNode;
}
```

- `shouldShow` — matches TipTap's native API signature: `({ editor, view, state, from, to }) => boolean`
- `hideWhenActiveNodes` / `hideWhenActiveMarks` — renamed from `excludeNodes`/`excludeMarks`. Only apply when `shouldShow` is not provided (they compose into the default text-selection trigger)
- When `shouldShow` is provided, `hideWhenActiveNodes`/`hideWhenActiveMarks` are ignored — user controls visibility entirely. TypeScript overloads or runtime warning not needed; just documented behavior.

### Unified Context

```tsx
interface BubbleMenuContextValue {
  editor: Editor;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}
```

Replaces 4 separate contexts. Node-specific derived state (`buttonHref`, `linkHref`) moves into the sub-components that need it via `useEditorState`.

### Trigger Helpers

Exported as standalone `bubbleMenuTriggers` (not on the `BubbleMenu` namespace — `BubbleMenu` looks like a component, not a constant):

```tsx
const triggers = {
  textSelection: (hideWhenActiveNodes?: string[], hideWhenActiveMarks?: string[]) => ShouldShowFn,
  node: (nodeName: string) => ShouldShowFn,
  nodeWithoutSelection: (nodeName: string) => ShouldShowFn,
}
```

- `textSelection` — current BubbleMenu behavior (show on non-empty selection, exclude specified nodes/marks, hide while dragging)
- `node` — shows when a node is active and not dragging (for button, image)
- `nodeWithoutSelection` — shows when node is active AND selection is empty (for link — cursor inside link, no text selected)

### Single Namespace

All sub-components live under `BubbleMenu.*`. The separate `ButtonBubbleMenu`, `LinkBubbleMenu`, `ImageBubbleMenu` namespaces are deleted entirely (alpha — no backwards compat needed).

```tsx
export const BubbleMenu = {
  Root: BubbleMenuRoot,
  // text formatting
  ItemGroup, Separator, Item,
  Bold, Italic, Underline, Strike, Code, Uppercase,
  AlignLeft, AlignCenter, AlignRight,
  NodeSelector: Object.assign(BubbleMenuNodeSelector, {
    Root: NodeSelectorRoot,
    Trigger: NodeSelectorTrigger,
    Content: NodeSelectorContent,
  }),
  LinkSelector,
  Default: BubbleMenuDefault,
  // button node
  ButtonToolbar, ButtonForm, ButtonEditLink, ButtonUnlink, ButtonDefault,
  // link node
  LinkToolbar, LinkForm, LinkEditLink, LinkUnlink, LinkOpenLink, LinkDefault,
  // image node
  ImageToolbar, ImageEditLink, ImageDefault,
} as const;
```

Usage:
```tsx
import { BubbleMenu, bubbleMenuTriggers } from '@react-email/editor/ui'

// Text selection menu (default behavior)
<BubbleMenu.Default hideWhenActiveNodes={['codeBlock']} />

// Button menu
<BubbleMenu.Root shouldShow={bubbleMenuTriggers.node('button')} pluginKey="buttonBubbleMenu">
  <BubbleMenu.ButtonDefault />
</BubbleMenu.Root>

// Or use the pre-wired default directly
<BubbleMenu.ButtonDefault />  // wraps Root internally with correct trigger

// Custom node menu
<BubbleMenu.Root shouldShow={({ editor }) => editor.isActive('myNode')} pluginKey="myNodeMenu">
  <div>Custom UI</div>
</BubbleMenu.Root>
```

### File Structure

```
ui/bubble-menu/
  root.tsx          — unified Root (shouldShow, pluginKey, hideWhenActive*, isEditing state)
  context.tsx       — unified context (editor, isEditing, setIsEditing)
  triggers.ts       — trigger factory functions
  index.ts          — single BubbleMenu namespace with all sub-components
  # text-formatting files unchanged
  # button sub-components (prefixed):
  button-toolbar.tsx, button-form.tsx, button-edit-link.tsx, button-unlink.tsx, button-default.tsx
  # link sub-components (prefixed):
  link-toolbar.tsx, link-form.tsx, link-edit-link.tsx, link-unlink.tsx, link-open-link.tsx, link-default.tsx
  # image sub-components (prefixed):
  image-toolbar.tsx, image-edit-link.tsx, image-default.tsx

ui/button-bubble-menu/  — DELETED
ui/link-bubble-menu/    — DELETED
ui/image-bubble-menu/   — DELETED
```

### Breaking Changes

| Change | Type |
|--------|------|
| `excludeNodes` → `hideWhenActiveNodes` | Rename |
| `excludeMarks` → `hideWhenActiveMarks` | Rename |
| `ButtonBubbleMenu` namespace | Removed — use `BubbleMenu.*` |
| `LinkBubbleMenu` namespace | Removed — use `BubbleMenu.*` |
| `ImageBubbleMenu` namespace | Removed — use `BubbleMenu.*` |
| `useButtonBubbleMenuContext()` | Removed — use `useBubbleMenuContext()` |
| `useLinkBubbleMenuContext()` | Removed — use `useBubbleMenuContext()` |
| `useImageBubbleMenuContext()` | Removed — use `useBubbleMenuContext()` |
| `buttonHref` / `linkHref` removed from context | Derived in sub-components via `useEditorState` |

### Dashboard Impact

The `resend/dashboard` repo needs these updates:
- `BubbleMenu.Root`: rename `excludeNodes` → `hideWhenActiveNodes`
- `ButtonBubbleMenu.Root` → `BubbleMenu.Root` with `shouldShow={bubbleMenuTriggers.node('button')}`
- `ButtonBubbleMenu.Toolbar` → `BubbleMenu.ButtonToolbar`
- `ButtonBubbleMenu.EditLink` → `BubbleMenu.ButtonEditLink`
- `useButtonBubbleMenuContext()` → `useBubbleMenuContext()`
- Same pattern for Link and Image variants
- Dashboard only reads `editor`, `setIsEditing` from context — never `buttonHref`/`linkHref`, so safe
- Inspector uses `[data-re-bubble-menu]` selector — no impact
- Social links bubble menu (uses TipTap directly) could migrate to `BubbleMenu.Root` later

### Verification

1. Run existing tests: `pnpm --filter @react-email/editor test`
2. Check EmailEditor still renders all bubble menu types correctly
3. Verify text selection bubble menu with `hideWhenActiveNodes` works
4. Verify button/link/image bubble menus appear on correct triggers
5. Build package: `pnpm --filter @react-email/editor build`
