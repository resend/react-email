import type * as React from 'react';

type InputType = 'color' | 'number' | 'select' | 'text' | 'textarea';
type InputUnit = 'px' | '%';
type Options = Record<string, string>;

export type EditorTheme = 'basic' | 'minimal';
export type PanelSectionId =
  | 'body'
  | 'container'
  | 'typography'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'paragraph'
  | 'link'
  | 'image'
  | 'button'
  | 'code-block'
  | 'inline-code';
export type KnownThemeComponents =
  | 'reset'
  | 'body'
  | 'container'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'paragraph'
  | 'nestedList'
  | 'list'
  | 'listItem'
  | 'listParagraph'
  | 'blockquote'
  | 'codeBlock'
  | 'inlineCode'
  | 'codeTag'
  | 'link'
  | 'footer'
  | 'hr'
  | 'image'
  | 'button'
  | 'section';

export type KnownCssProperties =
  | 'align'
  | 'backgroundColor'
  | 'color'
  | 'fontSize'
  | 'fontWeight'
  | 'letterSpacing'
  | 'lineHeight'
  | 'textDecoration'
  | 'borderRadius'
  | 'borderTopLeftRadius'
  | 'borderTopRightRadius'
  | 'borderBottomLeftRadius'
  | 'borderBottomRightRadius'
  | 'borderWidth'
  | 'borderTopWidth'
  | 'borderRightWidth'
  | 'borderBottomWidth'
  | 'borderLeftWidth'
  | 'borderStyle'
  | 'borderTopStyle'
  | 'borderRightStyle'
  | 'borderBottomStyle'
  | 'borderLeftStyle'
  | 'borderColor'
  | 'borderTopColor'
  | 'borderRightColor'
  | 'borderBottomColor'
  | 'borderLeftColor'
  | 'padding'
  | 'paddingTop'
  | 'paddingRight'
  | 'paddingBottom'
  | 'paddingLeft'
  | 'width'
  | 'height';

export type ResetTheme = Record<KnownThemeComponents, React.CSSProperties>;

export type CssJs = {
  [K in KnownThemeComponents]: React.CSSProperties & {
    // TODO: remove align as soon as possible
    align?: 'center' | 'left' | 'right';
  };
};
export type SupportedCssProperties = {
  [K in KnownCssProperties]: {
    category: 'layout' | 'appearance' | 'typography';
    label: string;
    type: InputType;
    defaultValue: string | number;
    unit?: InputUnit;
    options?: Options;
    excludeNodes?: string[];
    placeholder?: string;
    customUpdate?: (
      props: Record<string, unknown>,
      update: (func: (tree: PanelGroup[]) => PanelGroup[]) => void,
    ) => void;
  };
};

export interface PanelInputProperty {
  label: string;
  type: InputType;
  value?: string | number;
  prop: KnownCssProperties;
  classReference?: KnownThemeComponents;
  unit?: InputUnit;
  options?: Options;
  placeholder?: string;
  category: SupportedCssProperties[KnownCssProperties]['category'];
}

export interface PanelGroup {
  id?: PanelSectionId;
  title: string;
  category?: string;
  headerSlot?: React.ReactNode;
  classReference?: KnownThemeComponents;
  inputs: Omit<PanelInputProperty, 'category'>[];
}

export type ThemeableComponent = Extract<
  KnownThemeComponents,
  | 'body'
  | 'container'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'link'
  | 'image'
  | 'button'
  | 'codeBlock'
  | 'inlineCode'
  | 'paragraph'
>;

export type ThemeComponentStyles = {
  [K in ThemeableComponent]?: React.CSSProperties & {
    align?: 'center' | 'left' | 'right';
  };
};

export interface ThemeConfig {
  extends?: EditorTheme;
  styles: ThemeComponentStyles;
}

export type EditorThemeInput = EditorTheme | ThemeConfig;
