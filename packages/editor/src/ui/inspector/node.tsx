'use client';

import { useCurrentEditor } from '@tiptap/react';
import * as React from 'react';
import {
  stylesToCss,
  useEmailTheming,
} from '../../plugins/email-theming/extension';
import type { KnownCssProperties } from '../../plugins/email-theming/types';
import { inlineCssToJs } from '../../utils/styles';
import { useDocumentColors } from './hooks/use-document-colors';
import type { FocusedNode } from './provider';
import { useInspector } from './provider';
import { resolveThemeDefaults } from './utils/resolve-theme-defaults';
import {
  customUpdateAttributes,
  customUpdateStyles,
} from './utils/style-updates';

export interface InspectorNodeContext {
  nodeType: string;
  nodePos: { pos: number; inside: number };
  getStyle: (prop: KnownCssProperties) => string | number | undefined;
  setStyle: (prop: KnownCssProperties, value: string | number) => void;
  batchSetStyle: (
    changes: Array<{ prop: KnownCssProperties; value: string | number }>,
  ) => void;
  getAttr: (name: string) => unknown;
  setAttr: (name: string, value: unknown) => void;
  themeDefaults: Record<string, string | number | undefined>;
  presetColors: string[];
}

export interface InspectorNodeProps {
  children?: (context: InspectorNodeContext) => React.ReactNode;
}

export function InspectorNode({ children }: InspectorNodeProps) {
  const { editor } = useCurrentEditor();
  const theming = useEmailTheming(editor);
  const { target } = useInspector();
  const documentColors = useDocumentColors(editor);

  const [localAttr, setLocalAttr] = React.useState<
    FocusedNode['nodeAttrs'] | null
  >(null);

  const focusedNode =
    typeof target === 'object' && target !== null ? target : null;

  React.useEffect(() => {
    if (focusedNode) {
      setLocalAttr(focusedNode.nodeAttrs);
    }
  }, [focusedNode]);

  if (!editor || !theming || !focusedNode) {
    return null;
  }

  const attrs = localAttr ?? focusedNode.nodeAttrs;
  const inlineStyles = inlineCssToJs(attrs.style || '');

  const css = stylesToCss(theming.styles, theming.theme);
  const themeDefaults = resolveThemeDefaults(
    focusedNode.nodeType,
    attrs as Record<string, unknown>,
    css,
  );

  const mergedStyles: Record<string, string | number | undefined> = {
    ...themeDefaults,
    ...inlineStyles,
  };

  const getStyle = (prop: KnownCssProperties) => mergedStyles[prop];

  const setStyle = (prop: KnownCssProperties, value: string | number) => {
    customUpdateStyles(
      {
        editor,
        nodePos: focusedNode.nodePos,
        prop,
        newValue: value,
      },
      setLocalAttr,
    );
  };

  const batchSetStyle = (
    changes: Array<{ prop: KnownCssProperties; value: string | number }>,
  ) => {
    customUpdateStyles(
      {
        editor,
        nodePos: focusedNode.nodePos,
        changes: changes.map((c) => [c.prop, c.value]),
      },
      setLocalAttr,
    );
  };

  const getAttr = (name: string) => attrs[name];

  const setAttr = (name: string, value: unknown) => {
    customUpdateAttributes(
      {
        editor,
        nodePos: focusedNode.nodePos,
        prop: name,
        newValue: value as string | number,
      },
      setLocalAttr,
    );
  };

  const context: InspectorNodeContext = {
    nodeType: focusedNode.nodeType,
    nodePos: focusedNode.nodePos,
    getStyle,
    setStyle,
    batchSetStyle,
    getAttr,
    setAttr,
    themeDefaults,
    presetColors: documentColors,
  };

  if (children) {
    return <>{children(context)}</>;
  }

  return <InspectorNodeDefaults context={context} />;
}

function InspectorNodeDefaults({
  context: _context,
}: {
  context: InspectorNodeContext;
}) {
  // Default rendering will be wired in PR 5 (section components)
  // For now, render nothing — consumers must use render-props
  return null;
}
