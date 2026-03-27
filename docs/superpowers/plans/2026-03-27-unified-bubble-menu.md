# Unified BubbleMenu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify 4 separate bubble menu components (BubbleMenu, ButtonBubbleMenu, LinkBubbleMenu, ImageBubbleMenu) into a single `BubbleMenu` component with configurable `shouldShow` triggers.

**Architecture:** Single `BubbleMenu.Root` with `shouldShow` prop replaces 4 separate Root components. Unified context provides `{ editor, isEditing, setIsEditing }`. Trigger helper functions exported as `bubbleMenuTriggers`. Old variant directories deleted; sub-components moved into `bubble-menu/` with prefixed names.

**Tech Stack:** React, TipTap, TypeScript

---

### Task 1: Create trigger helpers

**Files:**
- Create: `packages/editor/src/ui/bubble-menu/triggers.ts`
- Test: `packages/editor/src/ui/bubble-menu/triggers.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
// triggers.spec.ts
import type { Editor } from '@tiptap/core';
import type { EditorView } from '@tiptap/pm/view';
import type { EditorState } from '@tiptap/pm/state';
import { bubbleMenuTriggers } from './triggers';

function createMockParams(overrides: {
  isActive?: (name: string) => boolean;
  selectionSize?: number;
  isDragging?: boolean;
  nodeAtDepth?: (d: number) => { type: { name: string } };
  fromDepth?: number;
}) {
  const {
    isActive = () => false,
    selectionSize = 5,
    isDragging = false,
    nodeAtDepth = () => ({ type: { name: 'paragraph' } }),
    fromDepth = 1,
  } = overrides;

  return {
    editor: { isActive, view: { state: { selection: { content: () => ({ size: selectionSize }) } } } } as unknown as Editor,
    view: { dom: { classList: { contains: (cls: string) => cls === 'dragging' && isDragging } } } as unknown as EditorView,
    state: {
      selection: {
        $from: { depth: fromDepth, node: nodeAtDepth },
        content: () => ({ size: selectionSize }),
      },
    } as unknown as EditorState,
    from: 0,
    to: selectionSize,
  };
}

describe('bubbleMenuTriggers', () => {
  describe('textSelection', () => {
    it('shows when there is a non-empty text selection', () => {
      const shouldShow = bubbleMenuTriggers.textSelection();
      expect(shouldShow(createMockParams({ selectionSize: 5 }))).toBe(true);
    });

    it('hides when selection is empty', () => {
      const shouldShow = bubbleMenuTriggers.textSelection();
      expect(shouldShow(createMockParams({ selectionSize: 0 }))).toBe(false);
    });

    it('hides when dragging', () => {
      const shouldShow = bubbleMenuTriggers.textSelection();
      expect(shouldShow(createMockParams({ isDragging: true }))).toBe(false);
    });

    it('hides when an excluded node is active', () => {
      const shouldShow = bubbleMenuTriggers.textSelection(['codeBlock']);
      expect(shouldShow(createMockParams({ isActive: (n) => n === 'codeBlock' }))).toBe(false);
    });

    it('hides when an excluded node is in ancestor chain', () => {
      const shouldShow = bubbleMenuTriggers.textSelection(['codeBlock']);
      const params = createMockParams({
        fromDepth: 2,
        nodeAtDepth: (d) => ({ type: { name: d === 2 ? 'paragraph' : 'codeBlock' } }),
      });
      expect(shouldShow(params)).toBe(false);
    });

    it('hides when an excluded mark is active', () => {
      const shouldShow = bubbleMenuTriggers.textSelection([], ['link']);
      expect(shouldShow(createMockParams({ isActive: (n) => n === 'link' }))).toBe(false);
    });
  });

  describe('node', () => {
    it('shows when the specified node is active', () => {
      const shouldShow = bubbleMenuTriggers.node('button');
      expect(shouldShow(createMockParams({ isActive: (n) => n === 'button' }))).toBe(true);
    });

    it('hides when the specified node is not active', () => {
      const shouldShow = bubbleMenuTriggers.node('button');
      expect(shouldShow(createMockParams({}))).toBe(false);
    });

    it('hides when dragging', () => {
      const shouldShow = bubbleMenuTriggers.node('button');
      expect(shouldShow(createMockParams({ isActive: (n) => n === 'button', isDragging: true }))).toBe(false);
    });
  });

  describe('nodeWithoutSelection', () => {
    it('shows when node is active and selection is empty', () => {
      const shouldShow = bubbleMenuTriggers.nodeWithoutSelection('link');
      expect(shouldShow(createMockParams({ isActive: (n) => n === 'link', selectionSize: 0 }))).toBe(true);
    });

    it('hides when there is a text selection', () => {
      const shouldShow = bubbleMenuTriggers.nodeWithoutSelection('link');
      expect(shouldShow(createMockParams({ isActive: (n) => n === 'link', selectionSize: 5 }))).toBe(false);
    });

    it('hides when node is not active', () => {
      const shouldShow = bubbleMenuTriggers.nodeWithoutSelection('link');
      expect(shouldShow(createMockParams({ selectionSize: 0 }))).toBe(false);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/editor && pnpm vitest run src/ui/bubble-menu/triggers.spec.ts`
Expected: FAIL — module `./triggers` not found

- [ ] **Step 3: Write the implementation**

```ts
// triggers.ts
import type { Editor } from '@tiptap/core';
import type { EditorState } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';

export interface ShouldShowParams {
  editor: Editor;
  view: EditorView;
  state: EditorState;
  from: number;
  to: number;
}

export type ShouldShowFn = (params: ShouldShowParams) => boolean;

export const bubbleMenuTriggers = {
  textSelection(
    hideWhenActiveNodes: string[] = [],
    hideWhenActiveMarks: string[] = [],
  ): ShouldShowFn {
    return ({ editor, view, state }) => {
      for (const node of hideWhenActiveNodes) {
        if (editor.isActive(node)) {
          return false;
        }
        const { $from } = state.selection;
        for (let d = $from.depth; d > 0; d--) {
          if ($from.node(d).type.name === node) {
            return false;
          }
        }
      }
      for (const mark of hideWhenActiveMarks) {
        if (editor.isActive(mark)) {
          return false;
        }
      }
      if (view.dom.classList.contains('dragging')) {
        return false;
      }
      return editor.view.state.selection.content().size > 0;
    };
  },

  node(nodeName: string): ShouldShowFn {
    return ({ editor, view }) =>
      editor.isActive(nodeName) && !view.dom.classList.contains('dragging');
  },

  nodeWithoutSelection(nodeName: string): ShouldShowFn {
    return ({ editor }) =>
      editor.isActive(nodeName) &&
      editor.view.state.selection.content().size === 0;
  },
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/editor && pnpm vitest run src/ui/bubble-menu/triggers.spec.ts`
Expected: PASS — all tests green

- [ ] **Step 5: Commit**

```bash
git add packages/editor/src/ui/bubble-menu/triggers.ts packages/editor/src/ui/bubble-menu/triggers.spec.ts
git commit -m "feat(editor): add bubbleMenuTriggers helper functions"
```

---

### Task 2: Unify context and update Root

**Files:**
- Modify: `packages/editor/src/ui/bubble-menu/context.tsx`
- Modify: `packages/editor/src/ui/bubble-menu/root.tsx`
- Modify: `packages/editor/src/ui/bubble-menu/root.spec.tsx`

- [ ] **Step 1: Update the context to include isEditing/setIsEditing**

Replace the full content of `packages/editor/src/ui/bubble-menu/context.tsx`:

```tsx
import type { Editor } from '@tiptap/core';
import * as React from 'react';

export interface BubbleMenuContextValue {
  editor: Editor;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export const BubbleMenuContext =
  React.createContext<BubbleMenuContextValue | null>(null);

export function useBubbleMenuContext(): BubbleMenuContextValue {
  const context = React.useContext(BubbleMenuContext);
  if (!context) {
    throw new Error(
      'BubbleMenu compound components must be used within <BubbleMenu.Root>',
    );
  }
  return context;
}
```

- [ ] **Step 2: Update the Root to accept shouldShow and pluginKey, rename exclude props**

Replace the full content of `packages/editor/src/ui/bubble-menu/root.tsx`:

```tsx
import { useCurrentEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import * as React from 'react';
import { BubbleMenuContext } from './context';
import { type ShouldShowFn, bubbleMenuTriggers } from './triggers';

export interface BubbleMenuRootProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  shouldShow?: ShouldShowFn;
  pluginKey?: string;
  hideWhenActiveNodes?: string[];
  hideWhenActiveMarks?: string[];
  placement?: 'top' | 'bottom';
  offset?: number;
  onHide?: () => void;
  children: React.ReactNode;
}

export function BubbleMenuRoot({
  shouldShow,
  pluginKey = 'bubbleMenu',
  hideWhenActiveNodes = [],
  hideWhenActiveMarks = [],
  placement = 'bottom',
  offset = 8,
  onHide,
  className,
  children,
  ...rest
}: BubbleMenuRootProps) {
  const { editor } = useCurrentEditor();
  const [isEditing, setIsEditing] = React.useState(false);

  const resolvedShouldShow =
    shouldShow ??
    bubbleMenuTriggers.textSelection(hideWhenActiveNodes, hideWhenActiveMarks);

  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      pluginKey={pluginKey}
      data-re-bubble-menu=""
      shouldShow={resolvedShouldShow}
      options={{
        placement,
        offset,
        onHide: () => {
          setIsEditing(false);
          onHide?.();
        },
      }}
      className={className}
      {...rest}
    >
      <BubbleMenuContext.Provider value={{ editor, isEditing, setIsEditing }}>
        {children}
      </BubbleMenuContext.Provider>
    </BubbleMenu>
  );
}
```

- [ ] **Step 3: Update the root spec**

Replace the full content of `packages/editor/src/ui/bubble-menu/root.spec.tsx`:

```tsx
import { render } from '@testing-library/react';
import { BubbleMenuRoot } from './root';

describe('BubbleMenuRoot', () => {
  it('renders null when no editor context is available', () => {
    const { container } = render(
      <BubbleMenuRoot>
        <div>child</div>
      </BubbleMenuRoot>,
    );
    expect(container.innerHTML).toBe('');
  });
});
```

- [ ] **Step 4: Update existing BubbleMenu sub-components that use the old context**

All sub-components in `packages/editor/src/ui/bubble-menu/` that call `useBubbleMenuContext()` already import from `./context`. The hook name stays `useBubbleMenuContext` — no changes needed to those files. However, check that no sub-component destructures only `editor` when the context now also has `isEditing`/`setIsEditing` — this is fine since they just ignore the extra fields.

- [ ] **Step 5: Run tests**

Run: `cd packages/editor && pnpm vitest run src/ui/bubble-menu/`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add packages/editor/src/ui/bubble-menu/context.tsx packages/editor/src/ui/bubble-menu/root.tsx packages/editor/src/ui/bubble-menu/root.spec.tsx
git commit -m "feat(editor): unify BubbleMenu context and Root with shouldShow/pluginKey"
```

---

### Task 3: Move button bubble menu sub-components into bubble-menu/

**Files:**
- Create: `packages/editor/src/ui/bubble-menu/button-toolbar.tsx`
- Create: `packages/editor/src/ui/bubble-menu/button-form.tsx`
- Create: `packages/editor/src/ui/bubble-menu/button-edit-link.tsx`
- Create: `packages/editor/src/ui/bubble-menu/button-unlink.tsx`
- Create: `packages/editor/src/ui/bubble-menu/button-default.tsx`
- Delete: `packages/editor/src/ui/button-bubble-menu/` (entire directory)

- [ ] **Step 1: Create button-toolbar.tsx**

```tsx
// packages/editor/src/ui/bubble-menu/button-toolbar.tsx
import type * as React from 'react';
import { useBubbleMenuContext } from './context';

export interface BubbleMenuButtonToolbarProps
  extends React.ComponentProps<'div'> {}

export function BubbleMenuButtonToolbar({
  children,
  ...rest
}: BubbleMenuButtonToolbarProps) {
  const { isEditing } = useBubbleMenuContext();

  if (isEditing) {
    return null;
  }

  return (
    <div data-re-btn-bm-toolbar="" {...rest}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create button-edit-link.tsx**

```tsx
// packages/editor/src/ui/bubble-menu/button-edit-link.tsx
import type * as React from 'react';
import { PencilIcon } from '../icons';
import { useBubbleMenuContext } from './context';

export interface BubbleMenuButtonEditLinkProps
  extends Omit<React.ComponentProps<'button'>, 'type'> {}

export function BubbleMenuButtonEditLink({
  className,
  children,
  onClick,
  onMouseDown,
  ...rest
}: BubbleMenuButtonEditLinkProps) {
  const { setIsEditing } = useBubbleMenuContext();

  return (
    <button
      {...rest}
      type="button"
      aria-label="Edit link"
      data-re-btn-bm-item=""
      data-item="edit-link"
      className={className}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown?.(e);
      }}
      onClick={(e) => {
        onClick?.(e);
        setIsEditing(true);
      }}
    >
      {children ?? <PencilIcon />}
    </button>
  );
}
```

- [ ] **Step 3: Create button-unlink.tsx**

```tsx
// packages/editor/src/ui/bubble-menu/button-unlink.tsx
import type * as React from 'react';
import { UnlinkIcon } from '../icons';
import { focusEditor } from './utils';
import { useBubbleMenuContext } from './context';

export interface BubbleMenuButtonUnlinkProps
  extends Omit<React.ComponentProps<'button'>, 'type'> {
  onLinkRemove?: () => void;
}

export function BubbleMenuButtonUnlink({
  className,
  children,
  onClick,
  onMouseDown,
  onLinkRemove,
  ...rest
}: BubbleMenuButtonUnlinkProps) {
  const { editor } = useBubbleMenuContext();

  return (
    <button
      {...rest}
      type="button"
      aria-label="Remove link"
      data-re-btn-bm-item=""
      data-item="unlink"
      className={className}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown?.(e);
      }}
      onClick={(e) => {
        onClick?.(e);
        editor.commands.updateButton({ href: '#' });
        focusEditor(editor);
        onLinkRemove?.();
      }}
    >
      {children ?? <UnlinkIcon />}
    </button>
  );
}
```

- [ ] **Step 4: Create button-form.tsx**

```tsx
// packages/editor/src/ui/bubble-menu/button-form.tsx
import * as React from 'react';
import { Check, UnlinkIcon } from '../icons';
import { useBubbleMenuContext } from './context';
import { focusEditor, getUrlFromString } from './utils';

export interface BubbleMenuButtonFormProps {
  className?: string;
  validateUrl?: (value: string) => string | null;
  onLinkApply?: (href: string) => void;
  onLinkRemove?: () => void;
}

export function BubbleMenuButtonForm({
  className,
  validateUrl,
  onLinkApply,
  onLinkRemove,
}: BubbleMenuButtonFormProps) {
  const { editor, isEditing, setIsEditing } = useBubbleMenuContext();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const buttonHref =
    (editor.getAttributes('button').href as string) ?? '';
  const displayHref = buttonHref === '#' ? '' : buttonHref;
  const [inputValue, setInputValue] = React.useState(displayHref);

  React.useEffect(() => {
    if (!isEditing) {
      return;
    }
    const currentHref =
      (editor.getAttributes('button').href as string) ?? '';
    const display = currentHref === '#' ? '' : currentHref;
    setInputValue(display);
    const timeoutId = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [isEditing, editor]);

  React.useEffect(() => {
    if (!isEditing) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        const form = formRef.current;
        const submitEvent = new Event('submit', {
          bubbles: true,
          cancelable: true,
        });
        form.dispatchEvent(submitEvent);
        setIsEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, setIsEditing]);

  if (!isEditing) {
    return null;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const value = inputValue.trim();

    if (value === '') {
      editor.commands.updateButton({ href: '#' });
      setIsEditing(false);
      focusEditor(editor);
      onLinkRemove?.();
      return;
    }

    const validate = validateUrl ?? getUrlFromString;
    const finalValue = validate(value);

    if (!finalValue) {
      editor.commands.updateButton({ href: '#' });
      setIsEditing(false);
      focusEditor(editor);
      onLinkRemove?.();
      return;
    }

    editor.commands.updateButton({ href: finalValue });
    setIsEditing(false);
    focusEditor(editor);
    onLinkApply?.(finalValue);
  }

  function handleUnlink(e: React.MouseEvent) {
    e.stopPropagation();
    editor.commands.updateButton({ href: '#' });
    setIsEditing(false);
    focusEditor(editor);
    onLinkRemove?.();
  }

  return (
    <form
      ref={formRef}
      data-re-btn-bm-form=""
      className={className}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onSubmit={handleSubmit}
    >
      <input
        ref={inputRef}
        data-re-btn-bm-input=""
        value={inputValue}
        onFocus={(e) => e.stopPropagation()}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Paste a link"
        type="text"
      />

      {displayHref ? (
        <button
          type="button"
          aria-label="Remove link"
          data-re-btn-bm-unlink=""
          onClick={handleUnlink}
        >
          <UnlinkIcon />
        </button>
      ) : (
        <button
          type="submit"
          aria-label="Apply link"
          data-re-btn-bm-apply=""
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Check />
        </button>
      )}
    </form>
  );
}
```

Note: `buttonHref` is now derived inline via `editor.getAttributes('button').href` instead of from context. The `useEffect` also reads it directly from the editor.

- [ ] **Step 5: Create button-default.tsx**

```tsx
// packages/editor/src/ui/bubble-menu/button-default.tsx
import { useEditorState } from '@tiptap/react';
import type * as React from 'react';
import { useBubbleMenuContext } from './context';
import { BubbleMenuButtonEditLink } from './button-edit-link';
import { BubbleMenuButtonForm } from './button-form';
import { BubbleMenuButtonToolbar } from './button-toolbar';
import { BubbleMenuButtonUnlink } from './button-unlink';
import { BubbleMenuRoot } from './root';
import { bubbleMenuTriggers } from './triggers';

export interface BubbleMenuButtonDefaultProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  placement?: 'top' | 'bottom';
  offset?: number;
  onHide?: () => void;
  validateUrl?: (value: string) => string | null;
  onLinkApply?: (href: string) => void;
  onLinkRemove?: () => void;
}

function BubbleMenuButtonDefaultInner({
  validateUrl,
  onLinkApply,
  onLinkRemove,
}: Pick<
  BubbleMenuButtonDefaultProps,
  'validateUrl' | 'onLinkApply' | 'onLinkRemove'
>) {
  const { editor } = useBubbleMenuContext();
  const buttonHref = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      (e?.getAttributes('button').href as string) ?? '',
  });
  const hasLink = (buttonHref ?? '') !== '' && buttonHref !== '#';

  return (
    <>
      <BubbleMenuButtonToolbar>
        <BubbleMenuButtonEditLink />
        {hasLink && <BubbleMenuButtonUnlink onLinkRemove={onLinkRemove} />}
      </BubbleMenuButtonToolbar>
      <BubbleMenuButtonForm
        validateUrl={validateUrl}
        onLinkApply={onLinkApply}
        onLinkRemove={onLinkRemove}
      />
    </>
  );
}

export function BubbleMenuButtonDefault({
  placement = 'top',
  offset,
  onHide,
  className,
  validateUrl,
  onLinkApply,
  onLinkRemove,
  ...rest
}: BubbleMenuButtonDefaultProps) {
  return (
    <BubbleMenuRoot
      shouldShow={bubbleMenuTriggers.node('button')}
      pluginKey="buttonBubbleMenu"
      placement={placement}
      offset={offset}
      onHide={onHide}
      className={className}
      {...rest}
    >
      <BubbleMenuButtonDefaultInner
        validateUrl={validateUrl}
        onLinkApply={onLinkApply}
        onLinkRemove={onLinkRemove}
      />
    </BubbleMenuRoot>
  );
}
```

- [ ] **Step 6: Delete the old button-bubble-menu directory**

```bash
rm -rf packages/editor/src/ui/button-bubble-menu
```

- [ ] **Step 7: Run tests**

Run: `cd packages/editor && pnpm vitest run src/ui/bubble-menu/`
Expected: PASS (old button-bubble-menu tests are gone — we'll verify via build)

- [ ] **Step 8: Commit**

```bash
git add -A packages/editor/src/ui/bubble-menu/button-*.tsx
git add packages/editor/src/ui/button-bubble-menu
git commit -m "refactor(editor): move button bubble menu into unified bubble-menu/"
```

---

### Task 4: Move link bubble menu sub-components into bubble-menu/

**Files:**
- Create: `packages/editor/src/ui/bubble-menu/link-toolbar.tsx`
- Create: `packages/editor/src/ui/bubble-menu/link-form.tsx`
- Create: `packages/editor/src/ui/bubble-menu/link-edit-link.tsx`
- Create: `packages/editor/src/ui/bubble-menu/link-unlink.tsx`
- Create: `packages/editor/src/ui/bubble-menu/link-open-link.tsx`
- Create: `packages/editor/src/ui/bubble-menu/link-default.tsx`
- Delete: `packages/editor/src/ui/link-bubble-menu/` (entire directory)

- [ ] **Step 1: Create link-toolbar.tsx**

```tsx
// packages/editor/src/ui/bubble-menu/link-toolbar.tsx
import type * as React from 'react';
import { useBubbleMenuContext } from './context';

export interface BubbleMenuLinkToolbarProps
  extends React.ComponentProps<'div'> {}

export function BubbleMenuLinkToolbar({
  children,
  ...rest
}: BubbleMenuLinkToolbarProps) {
  const { isEditing } = useBubbleMenuContext();

  if (isEditing) {
    return null;
  }

  return (
    <div data-re-link-bm-toolbar="" {...rest}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create link-edit-link.tsx**

```tsx
// packages/editor/src/ui/bubble-menu/link-edit-link.tsx
import type * as React from 'react';
import { PencilIcon } from '../icons';
import { useBubbleMenuContext } from './context';

export interface BubbleMenuLinkEditLinkProps
  extends Omit<React.ComponentProps<'button'>, 'type'> {}

export function BubbleMenuLinkEditLink({
  className,
  children,
  onClick,
  onMouseDown,
  ...rest
}: BubbleMenuLinkEditLinkProps) {
  const { setIsEditing } = useBubbleMenuContext();

  return (
    <button
      type="button"
      aria-label="Edit link"
      data-re-link-bm-item=""
      data-item="edit-link"
      className={className}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown?.(e);
      }}
      onClick={(e) => {
        onClick?.(e);
        setIsEditing(true);
      }}
      {...rest}
    >
      {children ?? <PencilIcon />}
    </button>
  );
}
```

- [ ] **Step 3: Create link-unlink.tsx**

```tsx
// packages/editor/src/ui/bubble-menu/link-unlink.tsx
import type * as React from 'react';
import { UnlinkIcon } from '../icons';
import { useBubbleMenuContext } from './context';

export interface BubbleMenuLinkUnlinkProps
  extends Omit<React.ComponentProps<'button'>, 'type'> {}

export function BubbleMenuLinkUnlink({
  className,
  children,
  onClick,
  onMouseDown,
  ...rest
}: BubbleMenuLinkUnlinkProps) {
  const { editor } = useBubbleMenuContext();

  return (
    <button
      type="button"
      aria-label="Remove link"
      data-re-link-bm-item=""
      data-item="unlink"
      className={className}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown?.(e);
      }}
      onClick={(e) => {
        onClick?.(e);
        editor.chain().focus().unsetLink().run();
      }}
      {...rest}
    >
      {children ?? <UnlinkIcon />}
    </button>
  );
}
```

- [ ] **Step 4: Create link-open-link.tsx**

```tsx
// packages/editor/src/ui/bubble-menu/link-open-link.tsx
import type * as React from 'react';
import { useEditorState } from '@tiptap/react';
import { ExternalLinkIcon } from '../icons';
import { useBubbleMenuContext } from './context';

export interface BubbleMenuLinkOpenLinkProps
  extends Omit<React.ComponentProps<'a'>, 'href' | 'target' | 'rel'> {}

export function BubbleMenuLinkOpenLink({
  className,
  children,
  ...rest
}: BubbleMenuLinkOpenLinkProps) {
  const { editor } = useBubbleMenuContext();

  const linkHref = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      (e?.getAttributes('link').href as string) ?? '',
  });

  return (
    <a
      {...rest}
      href={linkHref ?? ''}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open link"
      data-re-link-bm-item=""
      data-item="open-link"
      className={className}
    >
      {children ?? <ExternalLinkIcon />}
    </a>
  );
}
```

- [ ] **Step 5: Create link-form.tsx**

```tsx
// packages/editor/src/ui/bubble-menu/link-form.tsx
import { useEditorState } from '@tiptap/react';
import * as React from 'react';
import { Check, UnlinkIcon } from '../icons';
import { useBubbleMenuContext } from './context';
import { focusEditor, getUrlFromString, setLinkHref } from './utils';

export interface BubbleMenuLinkFormProps {
  className?: string;
  validateUrl?: (value: string) => string | null;
  onLinkApply?: (href: string) => void;
  onLinkRemove?: () => void;
  children?: React.ReactNode;
}

export function BubbleMenuLinkForm({
  className,
  validateUrl,
  onLinkApply,
  onLinkRemove,
  children,
}: BubbleMenuLinkFormProps) {
  const { editor, isEditing, setIsEditing } = useBubbleMenuContext();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const linkHref = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      (e?.getAttributes('link').href as string) ?? '',
  });

  const displayHref = (linkHref ?? '') === '#' ? '' : (linkHref ?? '');
  const [inputValue, setInputValue] = React.useState(displayHref);

  React.useEffect(() => {
    if (!isEditing) {
      return;
    }
    setInputValue(displayHref);
    const timeoutId = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [isEditing, displayHref]);

  React.useEffect(() => {
    if (!isEditing) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        const form = formRef.current;
        const submitEvent = new Event('submit', {
          bubbles: true,
          cancelable: true,
        });
        form.dispatchEvent(submitEvent);
        setIsEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, setIsEditing]);

  if (!isEditing) {
    return null;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const value = inputValue.trim();

    if (value === '') {
      setLinkHref(editor, '');
      setIsEditing(false);
      focusEditor(editor);
      onLinkRemove?.();
      return;
    }

    const validate = validateUrl ?? getUrlFromString;
    const finalValue = validate(value);

    if (!finalValue) {
      setLinkHref(editor, '');
      setIsEditing(false);
      focusEditor(editor);
      onLinkRemove?.();
      return;
    }

    setLinkHref(editor, finalValue);
    setIsEditing(false);
    focusEditor(editor);
    onLinkApply?.(finalValue);
  }

  function handleUnlink(e: React.MouseEvent) {
    e.stopPropagation();
    setLinkHref(editor, '');
    setIsEditing(false);
    focusEditor(editor);
    onLinkRemove?.();
  }

  return (
    <form
      ref={formRef}
      data-re-link-bm-form=""
      className={className}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onSubmit={handleSubmit}
    >
      <input
        ref={inputRef}
        data-re-link-bm-input=""
        value={inputValue}
        onFocus={(e) => e.stopPropagation()}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Paste a link"
        type="text"
      />

      {children}

      {displayHref ? (
        <button
          type="button"
          aria-label="Remove link"
          data-re-link-bm-unlink=""
          onClick={handleUnlink}
        >
          <UnlinkIcon />
        </button>
      ) : (
        <button
          type="submit"
          aria-label="Apply link"
          data-re-link-bm-apply=""
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Check />
        </button>
      )}
    </form>
  );
}
```

- [ ] **Step 6: Create link-default.tsx**

```tsx
// packages/editor/src/ui/bubble-menu/link-default.tsx
import type * as React from 'react';
import { BubbleMenuLinkEditLink } from './link-edit-link';
import { BubbleMenuLinkForm } from './link-form';
import { BubbleMenuLinkOpenLink } from './link-open-link';
import { BubbleMenuLinkToolbar } from './link-toolbar';
import { BubbleMenuLinkUnlink } from './link-unlink';
import { BubbleMenuRoot } from './root';
import { bubbleMenuTriggers } from './triggers';

type ExcludableItem = 'edit-link' | 'open-link' | 'unlink';

export interface BubbleMenuLinkDefaultProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  excludeItems?: ExcludableItem[];
  placement?: 'top' | 'bottom';
  offset?: number;
  onHide?: () => void;
  validateUrl?: (value: string) => string | null;
  onLinkApply?: (href: string) => void;
  onLinkRemove?: () => void;
}

export function BubbleMenuLinkDefault({
  excludeItems = [],
  placement = 'top',
  offset,
  onHide,
  className,
  validateUrl,
  onLinkApply,
  onLinkRemove,
  ...rest
}: BubbleMenuLinkDefaultProps) {
  const has = (item: ExcludableItem) => !excludeItems.includes(item);

  const hasToolbarItems = has('edit-link') || has('open-link') || has('unlink');

  return (
    <BubbleMenuRoot
      shouldShow={bubbleMenuTriggers.nodeWithoutSelection('link')}
      pluginKey="linkBubbleMenu"
      placement={placement}
      offset={offset}
      onHide={onHide}
      className={className}
      {...rest}
    >
      {hasToolbarItems && (
        <BubbleMenuLinkToolbar>
          {has('edit-link') && <BubbleMenuLinkEditLink />}
          {has('open-link') && <BubbleMenuLinkOpenLink />}
          {has('unlink') && <BubbleMenuLinkUnlink />}
        </BubbleMenuLinkToolbar>
      )}
      <BubbleMenuLinkForm
        validateUrl={validateUrl}
        onLinkApply={onLinkApply}
        onLinkRemove={onLinkRemove}
      />
    </BubbleMenuRoot>
  );
}
```

- [ ] **Step 7: Delete the old link-bubble-menu directory**

```bash
rm -rf packages/editor/src/ui/link-bubble-menu
```

- [ ] **Step 8: Run tests**

Run: `cd packages/editor && pnpm vitest run src/ui/bubble-menu/`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add -A packages/editor/src/ui/bubble-menu/link-*.tsx
git add packages/editor/src/ui/link-bubble-menu
git commit -m "refactor(editor): move link bubble menu into unified bubble-menu/"
```

---

### Task 5: Move image bubble menu sub-components into bubble-menu/

**Files:**
- Create: `packages/editor/src/ui/bubble-menu/image-toolbar.tsx`
- Create: `packages/editor/src/ui/bubble-menu/image-edit-link.tsx`
- Create: `packages/editor/src/ui/bubble-menu/image-default.tsx`
- Delete: `packages/editor/src/ui/image-bubble-menu/` (entire directory)

- [ ] **Step 1: Create image-toolbar.tsx**

```tsx
// packages/editor/src/ui/bubble-menu/image-toolbar.tsx
import type * as React from 'react';
import { useBubbleMenuContext } from './context';

export interface BubbleMenuImageToolbarProps
  extends React.ComponentProps<'div'> {}

export function BubbleMenuImageToolbar({
  children,
  ...rest
}: BubbleMenuImageToolbarProps) {
  const { isEditing } = useBubbleMenuContext();

  if (isEditing) {
    return null;
  }

  return (
    <div data-re-img-bm-toolbar="" {...rest}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create image-edit-link.tsx**

```tsx
// packages/editor/src/ui/bubble-menu/image-edit-link.tsx
import type * as React from 'react';
import { LinkIcon } from '../icons';
import { useBubbleMenuContext } from './context';

export interface BubbleMenuImageEditLinkProps
  extends Omit<React.ComponentProps<'button'>, 'type'> {}

export function BubbleMenuImageEditLink({
  className,
  children,
  onClick,
  onMouseDown,
  ...rest
}: BubbleMenuImageEditLinkProps) {
  const { setIsEditing } = useBubbleMenuContext();

  return (
    <button
      {...rest}
      type="button"
      aria-label="Edit link"
      data-re-img-bm-item=""
      data-item="edit-link"
      className={className}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown?.(e);
      }}
      onClick={(e) => {
        onClick?.(e);
        setIsEditing(true);
      }}
    >
      {children ?? <LinkIcon />}
    </button>
  );
}
```

- [ ] **Step 3: Create image-default.tsx**

```tsx
// packages/editor/src/ui/bubble-menu/image-default.tsx
import type * as React from 'react';
import { BubbleMenuImageEditLink } from './image-edit-link';
import { BubbleMenuImageToolbar } from './image-toolbar';
import { BubbleMenuRoot } from './root';
import { bubbleMenuTriggers } from './triggers';

type ExcludableItem = 'edit-link';

export interface BubbleMenuImageDefaultProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  excludeItems?: ExcludableItem[];
  placement?: 'top' | 'bottom';
  offset?: number;
  onHide?: () => void;
}

export function BubbleMenuImageDefault({
  excludeItems = [],
  placement = 'top',
  offset,
  onHide,
  className,
  ...rest
}: BubbleMenuImageDefaultProps) {
  const hasEditLink = !excludeItems.includes('edit-link');

  return (
    <BubbleMenuRoot
      shouldShow={bubbleMenuTriggers.node('image')}
      pluginKey="imageBubbleMenu"
      placement={placement}
      offset={offset}
      onHide={onHide}
      className={className}
      {...rest}
    >
      {hasEditLink && (
        <BubbleMenuImageToolbar>
          <BubbleMenuImageEditLink />
        </BubbleMenuImageToolbar>
      )}
    </BubbleMenuRoot>
  );
}
```

- [ ] **Step 4: Delete the old image-bubble-menu directory**

```bash
rm -rf packages/editor/src/ui/image-bubble-menu
```

- [ ] **Step 5: Run tests**

Run: `cd packages/editor && pnpm vitest run src/ui/bubble-menu/`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add -A packages/editor/src/ui/bubble-menu/image-*.tsx
git add packages/editor/src/ui/image-bubble-menu
git commit -m "refactor(editor): move image bubble menu into unified bubble-menu/"
```

---

### Task 6: Update the unified index and BubbleMenu namespace

**Files:**
- Modify: `packages/editor/src/ui/bubble-menu/index.ts`
- Modify: `packages/editor/src/ui/index.ts`
- Modify: `packages/editor/src/ui/bubble-menu/default.tsx`

- [ ] **Step 1: Update default.tsx to use renamed props**

In `packages/editor/src/ui/bubble-menu/default.tsx`, rename `excludeNodes`/`excludeMarks` to `hideWhenActiveNodes`/`hideWhenActiveMarks`:

Replace every occurrence of `excludeNodes` with `hideWhenActiveNodes` and `excludeMarks` with `hideWhenActiveMarks` in the props interface and function body. The forwarded props to `BubbleMenuRoot` change accordingly.

- [ ] **Step 2: Rewrite index.ts with full unified namespace**

Replace the full content of `packages/editor/src/ui/bubble-menu/index.ts`:

```ts
import { BubbleMenuAlignCenter } from './align-center';
import { BubbleMenuAlignLeft } from './align-left';
import { BubbleMenuAlignRight } from './align-right';
import { BubbleMenuBold } from './bold';
import { BubbleMenuButtonDefault } from './button-default';
import { BubbleMenuButtonEditLink } from './button-edit-link';
import { BubbleMenuButtonForm } from './button-form';
import { BubbleMenuButtonToolbar } from './button-toolbar';
import { BubbleMenuButtonUnlink } from './button-unlink';
import { BubbleMenuCode } from './code';
import { BubbleMenuDefault } from './default';
import { BubbleMenuItemGroup } from './group';
import { BubbleMenuImageDefault } from './image-default';
import { BubbleMenuImageEditLink } from './image-edit-link';
import { BubbleMenuImageToolbar } from './image-toolbar';
import { BubbleMenuItalic } from './italic';
import { BubbleMenuItem } from './item';
import { BubbleMenuLinkDefault } from './link-default';
import { BubbleMenuLinkEditLink } from './link-edit-link';
import { BubbleMenuLinkForm } from './link-form';
import { BubbleMenuLinkOpenLink } from './link-open-link';
import { BubbleMenuLinkToolbar } from './link-toolbar';
import { BubbleMenuLinkUnlink } from './link-unlink';
import { BubbleMenuLinkSelector } from './link-selector';
import {
  BubbleMenuNodeSelector,
  NodeSelectorContent,
  NodeSelectorRoot,
  NodeSelectorTrigger,
} from './node-selector';
import { BubbleMenuRoot } from './root';
import { BubbleMenuSeparator } from './separator';
import { BubbleMenuStrike } from './strike';
import { BubbleMenuUnderline } from './underline';
import { BubbleMenuUppercase } from './uppercase';

// Named exports
export { BubbleMenuAlignCenter } from './align-center';
export { BubbleMenuAlignLeft } from './align-left';
export { BubbleMenuAlignRight } from './align-right';
export { BubbleMenuBold } from './bold';
export { BubbleMenuButtonDefault } from './button-default';
export type { BubbleMenuButtonDefaultProps } from './button-default';
export { BubbleMenuButtonEditLink } from './button-edit-link';
export type { BubbleMenuButtonEditLinkProps } from './button-edit-link';
export { BubbleMenuButtonForm } from './button-form';
export type { BubbleMenuButtonFormProps } from './button-form';
export { BubbleMenuButtonToolbar } from './button-toolbar';
export type { BubbleMenuButtonToolbarProps } from './button-toolbar';
export { BubbleMenuButtonUnlink } from './button-unlink';
export type { BubbleMenuButtonUnlinkProps } from './button-unlink';
export { BubbleMenuCode } from './code';
export { useBubbleMenuContext } from './context';
export type { BubbleMenuContextValue } from './context';
export type { PreWiredItemProps } from './create-mark-bubble-item';
export type { BubbleMenuDefaultProps } from './default';
export { BubbleMenuDefault } from './default';
export type { BubbleMenuItemGroupProps } from './group';
export { BubbleMenuItemGroup } from './group';
export { BubbleMenuImageDefault } from './image-default';
export type { BubbleMenuImageDefaultProps } from './image-default';
export { BubbleMenuImageEditLink } from './image-edit-link';
export type { BubbleMenuImageEditLinkProps } from './image-edit-link';
export { BubbleMenuImageToolbar } from './image-toolbar';
export type { BubbleMenuImageToolbarProps } from './image-toolbar';
export { BubbleMenuItalic } from './italic';
export type { BubbleMenuItemProps } from './item';
export { BubbleMenuItem } from './item';
export { BubbleMenuLinkDefault } from './link-default';
export type { BubbleMenuLinkDefaultProps } from './link-default';
export { BubbleMenuLinkEditLink } from './link-edit-link';
export type { BubbleMenuLinkEditLinkProps } from './link-edit-link';
export { BubbleMenuLinkForm } from './link-form';
export type { BubbleMenuLinkFormProps } from './link-form';
export { BubbleMenuLinkOpenLink } from './link-open-link';
export type { BubbleMenuLinkOpenLinkProps } from './link-open-link';
export { BubbleMenuLinkToolbar } from './link-toolbar';
export type { BubbleMenuLinkToolbarProps } from './link-toolbar';
export { BubbleMenuLinkUnlink } from './link-unlink';
export type { BubbleMenuLinkUnlinkProps } from './link-unlink';
export type { BubbleMenuLinkSelectorProps } from './link-selector';
export { BubbleMenuLinkSelector } from './link-selector';
export type {
  BubbleMenuNodeSelectorProps,
  NodeSelectorContentProps,
  NodeSelectorItem,
  NodeSelectorRootProps,
  NodeSelectorTriggerProps,
  NodeType,
} from './node-selector';
export {
  BubbleMenuNodeSelector,
  NodeSelectorContent,
  NodeSelectorRoot,
  NodeSelectorTrigger,
} from './node-selector';
export type { BubbleMenuRootProps } from './root';
export { BubbleMenuRoot } from './root';
export type { BubbleMenuSeparatorProps } from './separator';
export { BubbleMenuSeparator } from './separator';
export { BubbleMenuStrike } from './strike';
export { BubbleMenuUnderline } from './underline';
export { BubbleMenuUppercase } from './uppercase';
export { bubbleMenuTriggers } from './triggers';
export type { ShouldShowFn, ShouldShowParams } from './triggers';

export const BubbleMenu = {
  Root: BubbleMenuRoot,
  ItemGroup: BubbleMenuItemGroup,
  Separator: BubbleMenuSeparator,
  Item: BubbleMenuItem,
  Bold: BubbleMenuBold,
  Italic: BubbleMenuItalic,
  Underline: BubbleMenuUnderline,
  Strike: BubbleMenuStrike,
  Code: BubbleMenuCode,
  Uppercase: BubbleMenuUppercase,
  AlignLeft: BubbleMenuAlignLeft,
  AlignCenter: BubbleMenuAlignCenter,
  AlignRight: BubbleMenuAlignRight,
  NodeSelector: Object.assign(BubbleMenuNodeSelector, {
    Root: NodeSelectorRoot,
    Trigger: NodeSelectorTrigger,
    Content: NodeSelectorContent,
  }),
  LinkSelector: BubbleMenuLinkSelector,
  Default: BubbleMenuDefault,
  ButtonToolbar: BubbleMenuButtonToolbar,
  ButtonEditLink: BubbleMenuButtonEditLink,
  ButtonUnlink: BubbleMenuButtonUnlink,
  ButtonForm: BubbleMenuButtonForm,
  ButtonDefault: BubbleMenuButtonDefault,
  LinkToolbar: BubbleMenuLinkToolbar,
  LinkEditLink: BubbleMenuLinkEditLink,
  LinkUnlink: BubbleMenuLinkUnlink,
  LinkOpenLink: BubbleMenuLinkOpenLink,
  LinkForm: BubbleMenuLinkForm,
  LinkDefault: BubbleMenuLinkDefault,
  ImageToolbar: BubbleMenuImageToolbar,
  ImageEditLink: BubbleMenuImageEditLink,
  ImageDefault: BubbleMenuImageDefault,
} as const;
```

- [ ] **Step 3: Update ui/index.ts to remove old barrel exports**

Replace the full content of `packages/editor/src/ui/index.ts`:

```ts
export * from './bubble-menu';
export * from './icons';
export * from './slash-command';
```

- [ ] **Step 4: Run tests**

Run: `cd packages/editor && pnpm vitest run src/ui/`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/editor/src/ui/bubble-menu/index.ts packages/editor/src/ui/bubble-menu/default.tsx packages/editor/src/ui/index.ts
git commit -m "refactor(editor): unified BubbleMenu namespace with all sub-components"
```

---

### Task 7: Update EmailEditor consumer

**Files:**
- Modify: `packages/editor/src/email-editor/email-editor.tsx`

- [ ] **Step 1: Update imports and prop names**

In `packages/editor/src/email-editor/email-editor.tsx`:

1. Replace imports:
   - Remove: `import { ButtonBubbleMenuDefault } from '../ui/button-bubble-menu/default';`
   - Remove: `import { ImageBubbleMenuDefault } from '../ui/image-bubble-menu/default';`
   - Remove: `import { LinkBubbleMenuDefault } from '../ui/link-bubble-menu/default';`
   - Add: `import { BubbleMenuButtonDefault } from '../ui/bubble-menu/button-default';`
   - Add: `import { BubbleMenuImageDefault } from '../ui/bubble-menu/image-default';`
   - Add: `import { BubbleMenuLinkDefault } from '../ui/bubble-menu/link-default';`

2. Rename interface props:
   - `excludeNodes` → `hideWhenActiveNodes`
   - `excludeMarks` → `hideWhenActiveMarks`

3. Update JSX:
   - `<BubbleMenuDefault excludeNodes={...} excludeMarks={...} />` → `<BubbleMenuDefault hideWhenActiveNodes={...} hideWhenActiveMarks={...} />`
   - `<LinkBubbleMenuDefault />` → `<BubbleMenuLinkDefault />`
   - `<ButtonBubbleMenuDefault />` → `<BubbleMenuButtonDefault />`
   - `<ImageBubbleMenuDefault />` → `<BubbleMenuImageDefault />`

- [ ] **Step 2: Run tests**

Run: `cd packages/editor && pnpm vitest run`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add packages/editor/src/email-editor/email-editor.tsx
git commit -m "refactor(editor): update EmailEditor to use unified BubbleMenu"
```

---

### Task 8: Build verification and cleanup

**Files:**
- No new files

- [ ] **Step 1: Run full test suite**

Run: `cd packages/editor && pnpm vitest run`
Expected: All tests pass

- [ ] **Step 2: Build the package**

Run: `pnpm --filter @react-email/editor build`
Expected: Build succeeds with no errors

- [ ] **Step 3: Check for any remaining references to old components**

Run: `grep -r "ButtonBubbleMenu\|LinkBubbleMenu\|ImageBubbleMenu\|useButtonBubbleMenuContext\|useLinkBubbleMenuContext\|useImageBubbleMenuContext\|excludeNodes\|excludeMarks" packages/editor/src/ --include="*.ts" --include="*.tsx" -l`
Expected: No matches (all references cleaned up)

- [ ] **Step 4: Commit any remaining cleanup**

Only if step 3 found remaining references.

```bash
git add -A packages/editor/src/
git commit -m "chore(editor): clean up remaining old bubble menu references"
```
