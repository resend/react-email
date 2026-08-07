import type * as React from 'react';

const PADDING_STYLE_KEYS = new Set([
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
]);

/**
 * Tailwind padding utilities, including responsive/variant forms.
 * Matches both author-facing classes (`max-sm:px-5`) and post-Tailwind
 * rewritten forms used in email CSS (`max-sm_px-5`).
 */
const PADDING_CLASS_RE =
  /(?:^|[_:])(p|px|py|pt|pr|pb|pl|ps|pe)(?:-|\[[^\]]+\])/;

export function isPaddingStyleKey(key: string): boolean {
  return PADDING_STYLE_KEYS.has(key);
}

export function isPaddingClassName(className: string): boolean {
  return PADDING_CLASS_RE.test(className);
}

/**
 * Split inline styles so padding lands on the inner `<td>` (Outlook/Klaviyo)
 * and non-padding styles stay on the outer `<table>`.
 */
export function splitPaddingStyles(style: React.CSSProperties = {}): {
  tdStyle: React.CSSProperties;
  tableStyle: React.CSSProperties;
} {
  const tdStyle: React.CSSProperties = {};
  const tableStyle: React.CSSProperties = {};
  const styleRecord = style as Record<string, unknown>;

  for (const key in styleRecord) {
    if (!Object.hasOwn(styleRecord, key)) {
      continue;
    }

    const value = styleRecord[key];
    if (isPaddingStyleKey(key)) {
      (tdStyle as Record<string, unknown>)[key] = value;
    } else {
      (tableStyle as Record<string, unknown>)[key] = value;
    }
  }

  return { tdStyle, tableStyle };
}

/**
 * Split `className` so padding utilities (including media-query variants)
 * land on the same element as base padding (`<td>`), preventing stacked
 * paddings when a media query targets the outer `<table>` (issue #3693).
 */
export function splitPaddingClassNames(className: string | undefined): {
  tdClassName: string | undefined;
  tableClassName: string | undefined;
} {
  if (!className) {
    return { tdClassName: undefined, tableClassName: undefined };
  }

  const tokens = className.split(/\s+/).filter(Boolean);
  const tdTokens: string[] = [];
  const tableTokens: string[] = [];

  for (const token of tokens) {
    if (isPaddingClassName(token)) {
      tdTokens.push(token);
    } else {
      tableTokens.push(token);
    }
  }

  return {
    tdClassName: tdTokens.length > 0 ? tdTokens.join(' ') : undefined,
    tableClassName: tableTokens.length > 0 ? tableTokens.join(' ') : undefined,
  };
}
