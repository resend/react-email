'use client';

import { useCurrentEditor } from '@tiptap/react';
import * as React from 'react';
import {
  stylesToCss,
  useEmailTheming,
} from '../../plugins/email-theming/extension';
import { SUPPORTED_CSS_PROPERTIES } from '../../plugins/email-theming/themes';
import type { KnownCssProperties } from '../../plugins/email-theming/types';
import { inlineCssToJs } from '../../utils/styles';
import { useDocumentColors } from './hooks/use-document-colors';
import type { FocusedNode } from './root';
import { useInspector } from './root';
import { AttributesSection } from './sections/attributes';
import { BackgroundSection } from './sections/background';
import { BorderSection } from './sections/border';
import { PaddingSection } from './sections/padding';
import { SizeSection } from './sections/size';
import { TypographySection } from './sections/typography';
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
    typeof target === 'object' && target.nodeType !== 'body' ? target : null;

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

  const getStyle = (prop: KnownCssProperties) => {
    const value = mergedStyles[prop];
    // Strip the trailing CSS unit only for numeric properties so that
    // numeric inputs receive a parseable number. Non-numeric properties
    // (colors, gradients, etc.) are returned verbatim — stripping `%`/`px`
    // globally would corrupt values like `hsl(200, 50%, 40%)`.
    const isNumericProperty = Boolean(SUPPORTED_CSS_PROPERTIES[prop]?.unit);
    if (isNumericProperty && typeof value === 'string') {
      return value.replace(/(px|%)$/, '');
    }
    return value;
  };

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

interface NodeLayout {
  sections: Array<{
    type:
      | 'attributes'
      | 'size'
      | 'link'
      | 'typography'
      | 'padding'
      | 'background'
      | 'border';
  }>;
}

function getDefaultLayout(nodeType: string): NodeLayout {
  switch (nodeType) {
    case 'image':
      return {
        sections: [
          { type: 'attributes' },
          { type: 'size' },
          { type: 'link' },
          { type: 'padding' },
          { type: 'border' },
        ],
      };
    case 'button':
      return {
        sections: [
          { type: 'link' },
          { type: 'typography' },
          { type: 'size' },
          { type: 'padding' },
          { type: 'border' },
          { type: 'background' },
        ],
      };
    case 'section':
    case 'div':
      return {
        sections: [
          { type: 'background' },
          { type: 'padding' },
          { type: 'border' },
        ],
      };
    case 'codeBlock':
      return {
        sections: [
          { type: 'attributes' },
          { type: 'padding' },
          { type: 'border' },
        ],
      };
    case 'footer':
      return {
        sections: [
          { type: 'typography' },
          { type: 'padding' },
          { type: 'background' },
        ],
      };
    default:
      return {
        sections: [
          { type: 'typography' },
          { type: 'padding' },
          { type: 'background' },
          { type: 'border' },
        ],
      };
  }
}

function InspectorNodeDefaults({ context }: { context: InspectorNodeContext }) {
  const layout = getDefaultLayout(context.nodeType);

  return (
    <>
      {layout.sections.map((section) => {
        switch (section.type) {
          case 'attributes':
            return <AttributesSection key={section.type} {...context} />;
          case 'size':
            return <SizeSection key={section.type} {...context} />;
          case 'typography':
            return <TypographySection key={section.type} {...context} />;
          case 'padding':
            return <PaddingSection key={section.type} {...context} />;
          case 'background':
            return <BackgroundSection key={section.type} {...context} />;
          case 'border':
            return <BorderSection key={section.type} {...context} />;
          default:
            return null;
        }
      })}
    </>
  );
}
