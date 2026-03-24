'use client';

import { NodeSelection } from '@tiptap/pm/state';
import { useCurrentEditor, useEditorState } from '@tiptap/react';
import { useMemo } from 'react';
import type { NodeClickedEvent } from '@/types/editor/styles';
import {
  stylesToCss,
  useEmailTheming,
} from '../../../plugins/email-theming/extension';
import {
  expandShorthandProperties,
  inlineCssToJs,
} from '../../../utils/styles';
import { BackgroundSection } from '../sections/background';
import { BorderSection } from '../sections/border';
import { LinkSection } from '../sections/link';
import { PaddingSection } from '../sections/padding';
import { TextTypographySection } from '../sections/text-typography';
import type { SectionId } from './config/node-section-config';
import type { EditorSnapshot } from './config/text-config';
import { useCollapsibleSections } from './hooks/use-collapsible-sections';
import { useDocumentColors } from './hooks/use-document-colors';
import {
  normalizeInlineStyleUnits,
  resolveThemeDefaults,
} from './utils/resolve-theme-defaults';
import {
  getBlockInfoFromNodeData,
  getParentBlockInfo,
  updateParentBlockPadding,
  updateParentBlockStyle,
} from './utils/text-block-utils';
import {
  getLinkColor,
  updateLinkColor,
  useLinkMark,
} from './utils/use-link-mark';

// ---------------------------------------------------------------------------
// Section layout for text/heading nodes
// ---------------------------------------------------------------------------

const TEXT_EXPANDED_SECTIONS: SectionId[] = [];
const TEXT_COLLAPSED_SECTIONS: SectionId[] = [
  'padding',
  'background',
  'border',
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function InspectorText({
  nodeData,
}: {
  nodeData?: NodeClickedEvent;
} = {}) {
  const { editor } = useCurrentEditor();
  const theming = useEmailTheming(editor);
  const linkMark = useLinkMark(editor);
  const documentColors = useDocumentColors(editor);

  const css = useMemo(() => {
    if (!theming) {
      return null;
    }
    return stylesToCss(theming.styles, theming.theme);
  }, [theming]);

  const editorState = useEditorState({
    editor,
    selector: ({ editor: ed }): EditorSnapshot | null => {
      if (!ed || !css) {
        return null;
      }
      const parent = nodeData
        ? getBlockInfoFromNodeData(ed, nodeData)
        : getParentBlockInfo(ed);
      const parsedStyle = inlineCssToJs((parent.attrs.style as string) || '', {
        removeUnit: true,
      });
      const expanded = normalizeInlineStyleUnits(
        expandShorthandProperties(parsedStyle),
      );
      const themeDefaults = resolveThemeDefaults(
        parent.nodeType,
        parent.attrs,
        css,
      );
      const blockStyle = { ...themeDefaults, ...expanded };

      return {
        isBoldActive: ed.isActive('bold'),
        isItalicActive: ed.isActive('italic'),
        isUnderlineActive: ed.isActive('underline'),
        isStrikeActive: ed.isActive('strike'),
        isCodeActive: ed.isActive('code'),
        isUppercaseActive: ed.isActive('uppercase'),
        isBulletListActive: ed.isActive('bulletList'),
        isOrderedListActive: ed.isActive('orderedList'),
        isBlockquoteActive: ed.isActive('blockquote'),
        currentColor: ed.getAttributes('textStyle').color,
        parentBlock: parent,
        blockStyle,
      };
    },
  });

  const blockStyle = (editorState?.blockStyle ?? {}) as Record<
    string,
    string | number | undefined
  >;

  const { getSectionProps } = useCollapsibleSections({
    expandedSections: TEXT_EXPANDED_SECTIONS,
    collapsedSections: TEXT_COLLAPSED_SECTIONS,
    styleObject: blockStyle,
  });

  if (!editor || !editorState || !theming || !css) {
    return null;
  }

  // --- Derived colour -----------------------------------------------------

  const themeLinkColor = css.link?.color;
  const themeBodyColor = (css.body?.color as string) || '#000000';
  const effectiveColor = linkMark.isActive
    ? getLinkColor(linkMark.style, themeLinkColor)
    : editorState.currentColor || themeBodyColor;

  // --- Handlers -----------------------------------------------------------

  const parentPos = editorState.parentBlock.pos;

  const handleColorChange = (color: string) => {
    if (linkMark.isActive) {
      updateLinkColor(editor, linkMark.style, color);
      return;
    }

    const { selection } = editor.state;
    const isNodeSel = selection instanceof NodeSelection;
    const isCollapsed = !isNodeSel && selection.from === selection.to;

    // Node selection or collapsed cursor in block: apply color to entire block
    if (isNodeSel || isCollapsed) {
      const blockPos = editorState.parentBlock.pos;
      const node = editor.state.doc.nodeAt(blockPos);
      if (node && node.content.size > 0) {
        const blockFrom = blockPos + 1;
        const blockTo = blockPos + 1 + node.content.size;
        let chain = editor
          .chain()
          .setTextSelection({ from: blockFrom, to: blockTo });
        if (color === '#000000' || color === '') {
          chain = chain.unsetColor();
        } else {
          chain = chain.setColor(color);
        }
        if (isNodeSel) {
          chain.setNodeSelection(blockPos).run();
        } else {
          chain.setTextSelection(selection.from).run();
        }
      }
      return;
    }

    if (color === '#000000' || color === '') {
      editor.commands.unsetColor();
    } else {
      editor.chain().setColor(color).run();
    }
  };

  const handleBlockStyleChange = (
    propOrChanges: string | [string, string | number][],
    value?: string | number,
  ) => {
    updateParentBlockStyle(editor, parentPos, propOrChanges, value);
  };

  const handlePaddingChange = (values: Record<string, number>) => {
    updateParentBlockPadding(editor, parentPos, values);
  };

  // --- Section removal helpers (clear properties then collapse) -----------

  const handleRemovePadding = () => {
    updateParentBlockPadding(editor, parentPos, {
      paddingTop: undefined,
      paddingRight: undefined,
      paddingBottom: undefined,
      paddingLeft: undefined,
    });
    getSectionProps('padding').onRemove?.();
  };

  const handleRemoveBackground = () => {
    handleBlockStyleChange('backgroundColor', '');
    getSectionProps('background').onRemove?.();
  };

  const handleRemoveBorder = () => {
    handleBlockStyleChange('borderRadius', '');
    handleBlockStyleChange('borderWidth', '');
    handleBlockStyleChange('borderColor', '');
    handleBlockStyleChange('borderStyle', '');
    getSectionProps('border').onRemove?.();
  };

  // --- Render -------------------------------------------------------------

  const paddingProps = getSectionProps('padding');
  const backgroundProps = getSectionProps('background');
  const borderProps = getSectionProps('border');

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Text type pills + Typography (marks, alignment, lists) */}
      <TextTypographySection
        editor={editor}
        editorState={editorState}
        effectiveColor={effectiveColor}
        onColorChange={handleColorChange}
        presetColors={documentColors}
      />

      {/* Collapsible: Link */}
      <LinkSection
        href={linkMark.href}
        isCollapsed={!linkMark.href}
        onAdd={() => editor.chain().focus().setLink({ href: '#' }).run()}
        onRemove={() => editor.chain().focus().unsetLink().run()}
        isLinkMark
      />

      {/* Collapsible: Padding */}
      <PaddingSection
        styleObject={blockStyle}
        onChange={handlePaddingChange}
        isCollapsed={paddingProps.isCollapsed}
        onAdd={paddingProps.onAdd}
        onRemove={handleRemovePadding}
      />

      {/* Collapsible: Background */}
      <BackgroundSection
        backgroundColor={(blockStyle.backgroundColor as string) ?? ''}
        onChange={handleBlockStyleChange}
        isCollapsed={backgroundProps.isCollapsed}
        onAdd={backgroundProps.onAdd}
        onRemove={handleRemoveBackground}
        presetColors={documentColors}
      />

      {/* Collapsible: Border */}
      <BorderSection
        styleObject={blockStyle}
        onChange={handleBlockStyleChange}
        isCollapsed={borderProps.isCollapsed}
        onAdd={borderProps.onAdd}
        onRemove={handleRemoveBorder}
        presetColors={documentColors}
      />
    </div>
  );
}
