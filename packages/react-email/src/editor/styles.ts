// TODO: move this file somewhere else that might make more sense
import type { Editor } from '@tiptap/core';
import type { Attrs } from '@tiptap/pm/model';
import type * as React from 'react';

export type NodeClickedEvent = {
  nodeType: string;
  nodeAttrs: Attrs;
  nodePos: { pos: number; inside: number };
};

type InputType =
  | 'color'
  | 'number'
  | 'select'
  | 'text'
  | 'textarea'
  | 'toggle-group'
  | 'padding-picker'
  | 'alignment';
type InputUnit = 'px' | '%';
type Options = Record<string, string>;

export type EditorThemes = 'basic' | 'minimal';
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
  | 'lineHeight'
  | 'textDecoration'
  | 'borderRadius'
  | 'borderTopLeftRadius'
  | 'borderTopRightRadius'
  | 'borderBottomLeftRadius'
  | 'borderBottomRightRadius'
  | 'borderWidth'
  | 'borderStyle'
  | 'borderColor'
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
      props: any,
      update: (func: (tree: PanelGroup[]) => PanelGroup[]) => void,
    ) => void;
  };
};

export interface PanelInputProperty {
  label: string;
  type: InputType;
  value: string | number;
  prop: KnownCssProperties;
  classReference?: KnownThemeComponents;
  unit?: InputUnit;
  options?: Options;
  placeholder?: string;
  category: SupportedCssProperties[KnownCssProperties]['category'];
}

export interface PanelGroup {
  title: string;
  headerSlot?: React.ReactNode;
  classReference?: KnownThemeComponents;
  inputs: Omit<PanelInputProperty, 'category'>[];
}

export interface ContextProperties {
  theme: EditorThemes;
  styles: PanelGroup[] & {
    toCss: () => Record<KnownThemeComponents, React.CSSProperties>;
  };
  css: string;
}

export interface ContextValue extends ContextProperties {
  subscribe: (
    editor: Editor,
    propagateChanges?: (context: ContextProperties) => void,
  ) => void;
}
