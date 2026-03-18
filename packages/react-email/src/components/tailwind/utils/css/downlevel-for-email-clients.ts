/**
 * Downlevels modern CSS features that email clients don't support:
 *
 * 1. Media Queries Level 4 range syntax → legacy min-width/max-width
 *    `(width>=40rem)` → `(min-width:40rem)`
 *
 * 2. CSS Nesting (nested @media inside selectors) → top-level @media
 *    `.sm_p-4{@media (min-width:40rem){padding:1rem!important}}`
 *    → `@media (min-width:40rem){.sm_p-4{padding:1rem!important}}`
 *
 * Gmail, Outlook, Yahoo, and most email clients don't support either feature.
 * See: https://www.caniemail.com/features/css-at-media/
 *      https://www.caniemail.com/features/css-nesting/
 */

/**
 * Convert Media Queries Level 4 range syntax to legacy min-width/max-width.
 *
 * Tailwind v4 generates `@media (width>=40rem)` but email clients
 * only understand `@media (min-width:40rem)`.
 *
 * Note: strict `<` and `>` are approximated as `<=` and `>=` respectively.
 * The sub-pixel difference is irrelevant for email rendering.
 */
function downlevelRangeSyntax(css: string): string {
  // Order matters: >= and <= must be replaced before > and <
  return css
    .replace(/\(\s*width\s*>=\s*([^)]+)\)/g, '(min-width:$1)')
    .replace(/\(\s*width\s*<=\s*([^)]+)\)/g, '(max-width:$1)')
    .replace(/\(\s*width\s*>\s*([^)]+)\)/g, '(min-width:$1)')
    .replace(/\(\s*width\s*<\s*([^)]+)\)/g, '(max-width:$1)')
    .replace(/\(\s*height\s*>=\s*([^)]+)\)/g, '(min-height:$1)')
    .replace(/\(\s*height\s*<=\s*([^)]+)\)/g, '(max-height:$1)')
    .replace(/\(\s*height\s*>\s*([^)]+)\)/g, '(min-height:$1)')
    .replace(/\(\s*height\s*<\s*([^)]+)\)/g, '(max-height:$1)');
}

/**
 * Extract a brace-balanced block starting at position `start` (which should
 * point to the opening `{`). Returns the index of the closing `}`.
 */
function findClosingBrace(css: string, start: number): number {
  let depth = 0;
  for (let i = start; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return css.length;
}

/**
 * Parse a block's content into top-level segments, respecting brace nesting.
 * Each segment is a complete nested rule or at-rule.
 */
function parseBlockSegments(blockContent: string): string[] {
  const segments: string[] = [];
  let i = 0;

  while (i < blockContent.length) {
    // Skip whitespace
    while (i < blockContent.length && /\s/.test(blockContent[i])) i++;
    if (i >= blockContent.length) break;

    const segStart = i;

    // Read until we find a '{' (start of a block) or run out
    while (i < blockContent.length && blockContent[i] !== '{') i++;

    if (i >= blockContent.length) {
      // No block found — this is bare declarations (shouldn't happen in
      // the non-inlinable output, but handle gracefully)
      segments.push(blockContent.slice(segStart).trim());
      break;
    }

    // Find the matching closing brace
    const closeIdx = findClosingBrace(blockContent, i);
    segments.push(blockContent.slice(segStart, closeIdx + 1).trim());
    i = closeIdx + 1;
  }

  return segments.filter((s) => s.length > 0);
}

/**
 * Unnest `@media` rules that are nested inside selectors.
 *
 * Tailwind v4 with CSS nesting generates:
 *   `.sm_p-4{@media (min-width:40rem){padding:1rem!important}}`
 *
 * Email clients need:
 *   `@media (min-width:40rem){.sm_p-4{padding:1rem!important}}`
 *
 * This handles one level of nesting (selector → @media → declarations).
 * Deeper nesting (e.g. `&:hover` inside `@media`) is preserved as-is
 * since pseudo-class support in email clients is limited regardless.
 */
function unnestMediaQueries(css: string): string {
  const result: string[] = [];
  let i = 0;

  while (i < css.length) {
    // Skip whitespace
    while (i < css.length && /\s/.test(css[i])) {
      result.push(css[i]);
      i++;
    }

    if (i >= css.length) break;

    // Check if this is already a top-level at-rule (@media, @supports, etc.)
    if (css[i] === '@') {
      const atStart = i;
      while (i < css.length && css[i] !== '{') i++;
      if (i >= css.length) {
        result.push(css.slice(atStart));
        break;
      }
      const closingBrace = findClosingBrace(css, i);
      result.push(css.slice(atStart, closingBrace + 1));
      i = closingBrace + 1;
      continue;
    }

    // This should be a selector — read until '{'
    const selectorStart = i;
    while (i < css.length && css[i] !== '{') i++;
    if (i >= css.length) {
      result.push(css.slice(selectorStart));
      break;
    }

    const selector = css.slice(selectorStart, i).trim();
    const outerOpen = i;
    const outerClose = findClosingBrace(css, outerOpen);
    const blockContent = css.slice(outerOpen + 1, outerClose).trim();

    // Parse the block into top-level segments to handle multiple nested @media
    const segments = parseBlockSegments(blockContent);
    const mediaSegments: string[] = [];
    const otherSegments: string[] = [];

    for (const segment of segments) {
      if (/^@media\s/.test(segment)) {
        mediaSegments.push(segment);
      } else {
        otherSegments.push(segment);
      }
    }

    if (mediaSegments.length > 0) {
      // Emit non-@media segments as a regular rule (if any)
      if (otherSegments.length > 0) {
        result.push(`${selector}{${otherSegments.join('')}}`);
      }

      // Unnest each @media: wrap the selector inside the @media
      for (const mediaSegment of mediaSegments) {
        const braceIdx = mediaSegment.indexOf('{');
        const mediaHeader = mediaSegment.slice(0, braceIdx).trim();
        const mediaClose = findClosingBrace(mediaSegment, braceIdx);
        const mediaBody = mediaSegment.slice(braceIdx + 1, mediaClose);

        result.push(`${mediaHeader}{${selector}{${mediaBody}}}`);
      }
    } else {
      // No nested @media — emit the entire rule as-is
      result.push(css.slice(selectorStart, outerClose + 1));
    }

    i = outerClose + 1;
  }

  return result.join('');
}

export function downlevelForEmailClients(css: string): string {
  css = downlevelRangeSyntax(css);
  css = unnestMediaQueries(css);
  return css;
}
