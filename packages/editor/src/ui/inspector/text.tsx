'use client';

import { useCurrentEditor, useEditorState } from '@tiptap/react';
import type * as React from 'react';
import {
  stylesToCss,
  useEmailTheming,
} from '../../plugins/email-theming/extension';
import type { KnownCssProperties } from '../../plugins/email-theming/types';
import { inlineCssToJs } from '../../utils/styles';
import { useDocumentColors } from './hooks/use-document-colors';
import {
  getLinkColor,
  updateLinkColor,
  useLinkMark,
} from './hooks/use-link-mark';
import { useInspector } from './provider';
import { InspectorLink } from './sections/link';
import { InspectorTypography } from './sections/typography';
import { resolveThemeDefaults } from './utils/resolve-theme-defaults';
import {
  getParentBlockInfo,
  updateParentBlockStyle,
} from './utils/text-block-utils';

export interface InspectorTextContext {
  marks: Record<string, boolean>;
  toggleMark: (mark: string) => void;
  alignment: string;
  setAlignment: (value: string) => void;
  linkHref: string;
  linkColor: string;
  setLinkColor: (color: string) => void;
  isLinkActive: boolean;
  getStyle: (prop: KnownCssProperties) => string | number | undefined;
  setStyle: (prop: KnownCssProperties, value: string | number) => void;
  presetColors: string[];
}

export interface InspectorTextProps {
  children?: (context: InspectorTextContext) => React.ReactNode;
}

const MARK_NAMES = ['bold', 'italic', 'underline', 'strike', 'code'] as const;

export function InspectorText({ children }: InspectorTextProps) {
  const { editor } = useCurrentEditor();
  const theming = useEmailTheming(editor);
  const { target } = useInspector();
  const documentColors = useDocumentColors(editor);
  const linkMark = useLinkMark(editor);

  const activeMarks =
    useEditorState({
      editor,
      selector: ({ editor: ed }) => {
        if (!ed) return {} as Record<string, boolean>;
        const result: Record<string, boolean> = {};
        for (const mark of MARK_NAMES) {
          result[mark] = ed.isActive(mark);
        }
        return result;
      },
    }) ?? ({} as Record<string, boolean>);

  const parentBlock = useEditorState({
    editor,
    selector: ({ editor: ed }) => getParentBlockInfo(ed),
  });

  if (!editor || !theming || target !== 'text') {
    return null;
  }

  const css = stylesToCss(theming.styles, theming.theme);
  const parentAttrs = parentBlock?.attrs ?? {};
  const parentNodeType = parentBlock?.nodeType ?? 'paragraph';
  const parentPos = parentBlock?.pos ?? 0;

  const themeDefaults = resolveThemeDefaults(
    parentNodeType,
    parentAttrs as Record<string, unknown>,
    css,
  );

  const parentStyle = inlineCssToJs(parentAttrs.style || '');
  const mergedStyles: Record<string, string | number | undefined> = {
    ...themeDefaults,
    ...parentStyle,
  };

  const themeLinkColor = css.link?.color ? String(css.link.color) : undefined;

  const context: InspectorTextContext = {
    marks: activeMarks,
    toggleMark: (mark: string) => {
      editor.chain().focus().toggleMark(mark).run();
    },
    alignment: parentBlock?.alignment ?? 'left',
    setAlignment: (value: string) => {
      if (!parentBlock) return;
      editor
        .chain()
        .focus()
        .updateAttributes(parentNodeType, { alignment: value })
        .run();
    },
    linkHref: linkMark.href,
    linkColor: getLinkColor(linkMark.style, themeLinkColor),
    setLinkColor: (color: string) => {
      updateLinkColor(editor, linkMark.style, color);
    },
    isLinkActive: linkMark.isActive,
    getStyle: (prop: KnownCssProperties) => mergedStyles[prop],
    setStyle: (prop: KnownCssProperties, value: string | number) => {
      updateParentBlockStyle(editor, parentPos, prop, value);
    },
    presetColors: documentColors,
  };

  if (children) {
    return <>{children(context)}</>;
  }

  return <InspectorTextDefaults context={context} />;
}

function InspectorTextDefaults({ context }: { context: InspectorTextContext }) {
  return (
    <>
      <InspectorTypography context={context} />
      {context.isLinkActive && <InspectorLink context={context} />}
    </>
  );
}
