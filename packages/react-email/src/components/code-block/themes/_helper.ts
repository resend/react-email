import type React from 'react';
import type { ThemeRegistration, ThemeRegistrationRaw } from 'shiki/core';

/**
 * A `<CodeBlock>` theme. Carries:
 *
 * - `base`: chrome CSS applied to the wrapping `<pre>` (font, padding,
 *   border-radius, background, color, etc.).
 * - `shikiTheme`: the TextMate theme shiki uses for tokenization.
 * - A flat `[tokenType: string]` index — kept so legacy code that reads
 *   `theme.comment.color` (prism-style) keeps working. Values are
 *   `React.CSSProperties` for known token types.
 */
export type Theme = {
  base: React.CSSProperties;
  shikiTheme: ThemeRegistration & { name: string; type: 'light' | 'dark' };
} & {
  // biome-ignore lint/suspicious/noExplicitAny: index signature must accept both CSSProperties and shikiTheme shapes
  [tokenType: string]: any;
};

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

// scope (e.g. "comment") → prism token names that map to it (e.g. ["comment", "prolog", "cdata"]).
const REVERSE_SCOPE_MAP: Record<string, string[]> = (() => {
  const out: Record<string, string[]> = {};
  for (const [prismType, scopes] of Object.entries(SCOPE_MAP)) {
    for (const scope of Array.isArray(scopes) ? scopes : [scopes]) {
      (out[scope] ??= []).push(prismType);
    }
  }
  return out;
})();

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

function fromFontStyle(fontStyle: string | undefined): React.CSSProperties {
  const out: React.CSSProperties = {};
  if (!fontStyle) return out;
  if (fontStyle.includes('bold')) out.fontWeight = 'bold';
  if (fontStyle.includes('italic')) out.fontStyle = 'italic';
  if (fontStyle.includes('underline')) out.textDecoration = 'underline';
  return out;
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
 * Walks the shiki theme's tokenColors and produces a flat record keyed by
 * the prism token type names (`comment`, `keyword`, `attr-name`, etc.).
 * First match wins, since the prism shape only has one CSS block per
 * token type. Used to keep legacy reads like `theme.comment.color` alive
 * for themes that didn't ship a hand-authored palette.
 */
function flatPaletteFromShiki(
  shikiTheme: { tokenColors?: ReadonlyArray<{ scope?: string | string[]; settings: Settings }> },
): Record<string, React.CSSProperties> {
  const out: Record<string, React.CSSProperties> = {};
  for (const { scope, settings } of shikiTheme.tokenColors ?? []) {
    if (scope === undefined) continue;
    const scopes = Array.isArray(scope) ? scope : [scope];
    for (const s of scopes) {
      const prismTypes = REVERSE_SCOPE_MAP[s];
      if (!prismTypes) continue;
      for (const prismType of prismTypes) {
        if (prismType in out) continue;
        const css: React.CSSProperties = { ...fromFontStyle(settings.fontStyle) };
        if (settings.foreground) css.color = settings.foreground;
        if (settings.background) css.backgroundColor = settings.background;
        if (Object.keys(css).length > 0) out[prismType] = css;
      }
    }
  }
  return out;
}

/**
 * Builds a Theme object from a prism-style palette. The palette uses the
 * same token-type keys that prismjs emitted (e.g. `comment`, `keyword`,
 * `attr-name`); the helper maps each one to the equivalent TextMate
 * scope(s) shiki recognizes, and also spreads the palette onto the
 * returned theme so legacy reads like `theme.comment.color` keep working.
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
    ...opts.palette,
  };
}

/**
 * Wraps a theme bundled with shiki (loaded via `import x from 'shiki/themes/<name>.mjs'`)
 * in our `{ shikiTheme, base, ...palette }` shape. Pulls `editor.background`
 * and `editor.foreground` from the bundled theme into `base` so reads
 * like `theme.base.background` still resolve to a real color, and
 * synthesizes flat per-token entries from the bundled tokenColors so
 * `theme.comment.color` keeps working.
 */
export function fromBundled(
  bundled: ThemeRegistration | ThemeRegistrationRaw,
  chromeStyles: React.CSSProperties,
): Theme {
  const shikiTheme = bundled as Theme['shikiTheme'];
  const editorBg = shikiTheme.colors?.['editor.background'];
  const editorFg = shikiTheme.colors?.['editor.foreground'];
  const base: React.CSSProperties = {
    ...chromeStyles,
    ...(editorBg ? { background: editorBg } : null),
    ...(editorFg ? { color: editorFg } : null),
  };
  return {
    base,
    shikiTheme,
    ...flatPaletteFromShiki(shikiTheme),
  };
}
