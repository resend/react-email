'use client';

import { NodeSelection } from '@tiptap/pm/state';
import { useCurrentEditor, useEditorState } from '@tiptap/react';
import { useCallback, useMemo, useState } from 'react';
import type { NodeClickedEvent } from '../../../core/types';
import {
  stylesToCss,
  useEmailTheming,
} from '../../../plugins/email-theming/extension';
import {
  expandShorthandProperties,
  inlineCssToJs,
} from '../../../utils/styles';
import type { EditorSnapshot } from '../config/text-config';
import { useDocumentColors } from '../hooks/use-document-colors';
import {
  getLinkColor,
  updateLinkColor,
  useLinkMark,
} from '../hooks/use-link-mark';
import { BackgroundSection } from '../sections/background';
import { BorderSection } from '../sections/border';
import { LinkSection } from '../sections/link';
import { PaddingSection } from '../sections/padding';
import { TextTypographySection } from '../sections/text-typography';
import {
  normalizeInlineStyleUnits,
  resolveThemeDefaults,
} from '../utils/resolve-theme-defaults';
import {
  getBlockInfoFromNodeData,
  getParentBlockInfo,
  updateParentBlockPadding,
  updateParentBlockStyle,
} from '../utils/text-block-utils';

type CollapsibleSection = 'padding' | 'background' | 'border';

const SECTION_PROPERTIES: Record<CollapsibleSection, string[]> = {
  padding: [
    'padding',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
  ],
  background: ['backgroundColor'],
  border: ['borderRadius', 'borderWidth', 'borderColor', 'borderStyle'],
};

function sectionHasValues(
  sectionId: CollapsibleSection,
  styleObject: Record<string, string | number | undefined>,
): boolean {
  return SECTION_PROPERTIES[sectionId].some(
    (prop) => styleObject[prop] !== undefined && styleObject[prop] !== '',
  );
}

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

  const [addedSections, setAddedSections] = useState<Set<CollapsibleSection>>(
    new Set(),
  );

  const isCollapsed = useCallback(
    (id: CollapsibleSection) =>
      !addedSections.has(id) && !sectionHasValues(id, blockStyle),
    [addedSections, blockStyle],
  );

  const addSection = useCallback((id: CollapsibleSection) => {
    setAddedSections((prev) => new Set([...prev, id]));
  }, []);

  const removeSection = useCallback((id: CollapsibleSection) => {
    setAddedSections((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  if (!editor || !editorState || !theming || !css) {
    return null;
  }

  const themeLinkColor = css.link?.color;
  const themeBodyColor = (css.body?.color as string) || '#000000';
  const effectiveColor = linkMark.isActive
    ? getLinkColor(linkMark.style, themeLinkColor)
    : editorState.currentColor || themeBodyColor;

  const parentPos = editorState.parentBlock.pos;

  const handleColorChange = (color: string) => {
    if (linkMark.isActive) {
      updateLinkColor(editor, linkMark.style, color);
      return;
    }

    const { selection } = editor.state;
    const isNodeSel = selection instanceof NodeSelection;
    const isCursorCollapsed = !isNodeSel && selection.from === selection.to;

    if (isNodeSel || isCursorCollapsed) {
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

  const handleRemovePadding = () => {
    updateParentBlockPadding(editor, parentPos, {
      paddingTop: undefined,
      paddingRight: undefined,
      paddingBottom: undefined,
      paddingLeft: undefined,
    });
    removeSection('padding');
  };

  const handleRemoveBackground = () => {
    handleBlockStyleChange('backgroundColor', '');
    removeSection('background');
  };

  const handleRemoveBorder = () => {
    handleBlockStyleChange('borderRadius', '');
    handleBlockStyleChange('borderWidth', '');
    handleBlockStyleChange('borderColor', '');
    handleBlockStyleChange('borderStyle', '');
    removeSection('border');
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <TextTypographySection
        editor={editor}
        editorState={editorState}
        effectiveColor={effectiveColor}
        onColorChange={handleColorChange}
        presetColors={documentColors}
      />

      <LinkSection
        href={linkMark.href}
        isCollapsed={!linkMark.href}
        onAdd={() => editor.chain().focus().setLink({ href: '#' }).run()}
        onRemove={() => editor.chain().focus().unsetLink().run()}
        isLinkMark
      />

      <PaddingSection
        styleObject={blockStyle}
        onChange={handlePaddingChange}
        isCollapsed={isCollapsed('padding')}
        onAdd={() => addSection('padding')}
        onRemove={handleRemovePadding}
      />

      <BackgroundSection
        backgroundColor={(blockStyle.backgroundColor as string) ?? ''}
        onChange={handleBlockStyleChange}
        isCollapsed={isCollapsed('background')}
        onAdd={() => addSection('background')}
        onRemove={handleRemoveBackground}
        presetColors={documentColors}
      />

      <BorderSection
        styleObject={blockStyle}
        onChange={handleBlockStyleChange}
        isCollapsed={isCollapsed('border')}
        onAdd={() => addSection('border')}
        onRemove={handleRemoveBorder}
        presetColors={documentColors}
      />
    </div>
  );
}
