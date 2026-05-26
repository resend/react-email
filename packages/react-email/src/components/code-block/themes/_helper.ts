import type React from 'react';
import type { ThemeRegistration } from 'shiki/core';

export interface Theme {
  /**
   * Inline CSS applied to the wrapping `<pre>` element. Carries
   * background, padding, font, border, etc.
   */
  base: React.CSSProperties;
  /**
   * The TextMate theme used by shiki to color tokens. Token colors
   * come from here; the visual chrome comes from `base`.
   */
  shikiTheme: ThemeRegistration & { name: string; type: 'light' | 'dark' };
}

type Settings = {
  foreground?: string;
  background?: string;
  fontStyle?: string;
};

type TokenColor = {
  scope: string | string[];
  settings: Settings;
};

const SCOPE_MAP: Record<string, string | string[]> = {
  comment: ['comment', 'punctuation.definition.comment'],
  'block-comment': 'comment.block',
  prolog: 'comment',
  cdata: 'comment',
  doctype: ['meta.tag.sgml.doctype', 'entity.name.tag.doctype'],
  punctuation: 'punctuation',
  delimiter: ['punctuation.delimiter', 'punctuation.section'],
  string: ['string', 'meta.attribute string'],
  char: ['string', 'constant.character'],
  keyword: ['keyword', 'storage.type', 'storage.modifier'],
  number: [
    'constant.numeric',
    'constant.numeric.integer',
    'constant.numeric.float',
  ],
  boolean: [
    'constant.language.boolean',
    'constant.language.true',
    'constant.language.false',
  ],
  null: ['constant.language.null', 'constant.language.undefined'],
  function: [
    'entity.name.function',
    'support.function',
    'meta.function-call entity.name.function',
  ],
  'function-name': 'entity.name.function',
  'class-name': ['entity.name.class', 'entity.name.type', 'support.class'],
  'maybe-class-name': ['entity.name.class', 'entity.name.type'],
  class: ['entity.name.class', 'storage.type.class'],
  tag: ['entity.name.tag', 'meta.tag'],
  'attr-name': 'entity.other.attribute-name',
  'attr-value': ['string.quoted', 'meta.attribute-with-value string'],
  attribute: 'entity.other.attribute-name',
  operator: [
    'keyword.operator',
    'keyword.operator.assignment',
    'keyword.operator.arithmetic',
    'keyword.operator.logical',
  ],
  property: [
    'support.type.property-name',
    'meta.object-literal.key',
    'variable.other.property',
  ],
  'property-access': 'variable.other.property',
  variable: ['variable', 'variable.other'],
  constant: ['constant', 'variable.other.constant'],
  symbol: ['constant.other.symbol', 'variable.other.symbol'],
  regex: 'string.regexp',
  selector: ['entity.name.tag.css', 'meta.selector'],
  builtin: ['support.type', 'support.class', 'support.function'],
  entity: 'constant.character.entity',
  url: ['markup.underline.link', 'string.other.link'],
  inserted: 'markup.inserted',
  deleted: 'markup.deleted',
  important: ['markup.bold', 'keyword.other.important'],
  bold: ['markup.bold', 'strong'],
  italic: ['markup.italic', 'emphasis'],
  namespace: 'entity.name.namespace',
  atrule: ['keyword.control.at-rule', 'meta.at-rule'],
  parameter: 'variable.parameter',
  interpolation: 'meta.embedded.line',
  escape: 'constant.character.escape',
  hexcode: 'constant.other.color',
  hex: 'constant.other.color',
  unit: 'keyword.other.unit',
  console: 'support.class.console',
  control: 'keyword.control',
  directive: 'keyword.control.directive',
  statement: 'keyword.control',
  placeholder: 'variable.other.placeholder',
  key: ['meta.object-literal.key', 'support.type.property-name'],
  package: 'entity.name.namespace',
  combinator: 'entity.other.attribute-name.css',
  id: 'entity.other.attribute-name.id',
  'pseudo-class': 'entity.other.attribute-name.pseudo-class.css',
  'pseudo-element': 'entity.other.attribute-name.pseudo-element.css',
  this: 'variable.language.this',
  changed: 'markup.changed',
  color: 'constant.other.color',
};

function toFontStyle(
  css: React.CSSProperties | undefined,
): string | undefined {
  if (!css) return undefined;
  const parts: string[] = [];
  if (css.fontWeight === 'bold' || css.fontWeight === 700) parts.push('bold');
  if (css.fontStyle === 'italic') parts.push('italic');
  const td = css.textDecoration;
  if (typeof td === 'string' && td.includes('underline')) parts.push('underline');
  return parts.length > 0 ? parts.join(' ') : undefined;
}

function looksLikeColor(value: string): boolean {
  if (!value) return false;
  if (value.includes('url(') || value.includes('gradient(')) return false;
  if (value === 'none' || value === 'transparent' || value === 'inherit') {
    return false;
  }
  return /^(#|rgb|rgba|hsl|hsla|[a-z]+$)/i.test(value.trim());
}

function colorOrSkip(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  return looksLikeColor(value) ? value : undefined;
}

/**
 * Builds a Theme object from a Prism-style palette. The palette uses the
 * same token-type keys that prismjs emits (e.g. `comment`, `keyword`,
 * `attr-name`), and the helper maps each one to the equivalent TextMate
 * scope(s) that shiki recognizes.
 */
export function defineTheme(opts: {
  name: string;
  type: 'light' | 'dark';
  base: React.CSSProperties;
  palette: Record<string, React.CSSProperties>;
}): Theme {
  const tokenColors: TokenColor[] = [];
  for (const [prismType, css] of Object.entries(opts.palette)) {
    const scope = SCOPE_MAP[prismType];
    if (!scope) continue;
    const settings: Settings = {};
    const fg = colorOrSkip(css.color);
    if (fg) settings.foreground = fg;
    const bg = colorOrSkip(css.background ?? css.backgroundColor);
    if (bg) settings.background = bg;
    const fs = toFontStyle(css);
    if (fs) settings.fontStyle = fs;
    if (Object.keys(settings).length === 0) continue;
    tokenColors.push({ scope, settings });
  }

  const colors: Record<string, string> = {};
  const bg = colorOrSkip(opts.base.background ?? opts.base.backgroundColor);
  if (bg) colors['editor.background'] = bg;
  const fg = colorOrSkip(opts.base.color);
  if (fg) colors['editor.foreground'] = fg;

  return {
    base: opts.base,
    shikiTheme: {
      name: opts.name,
      type: opts.type,
      colors,
      tokenColors,
    },
  };
}
