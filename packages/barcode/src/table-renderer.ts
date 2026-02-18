import type { Span } from './types';

function shortHex(hex: string): string {
  if (
    hex.length === 7 &&
    hex[1] === hex[2] &&
    hex[3] === hex[4] &&
    hex[5] === hex[6]
  )
    return `#${hex[1]}${hex[3]}${hex[5]}`;
  return hex;
}

/**
 * Convert packed spans into an HTML table string with inline styles.
 * Includes Safari zero-width sizing cell fix for rowspan height.
 */
export function renderTable(
  spans: (Span | null)[][],
  totalRows: number,
  totalCols: number,
  cellSize: number,
  foregroundColor: string,
  backgroundColor: string,
): string {
  const fg = shortHex(foregroundColor);
  const bg = shortHex(backgroundColor);
  const cs = cellSize;

  let html = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border-spacing:0;margin:0 auto;font-size:0;line-height:0;background:${bg}">`;

  for (let r = 0; r < totalRows; r++) {
    html += '<tr>';
    // Zero-width sizing cell to lock row height in Safari
    html += `<td style="width:0;height:${cs}px;padding:0"></td>`;
    for (let c = 0; c < totalCols; c++) {
      const s = spans[r][c];
      if (!s) continue;
      let attrs = '';
      if (s.w > 1) attrs += ` colspan="${s.w}"`;
      if (s.h > 1) attrs += ` rowspan="${s.h}"`;
      let style = `width:${cs * s.w}px;height:${cs * s.h}px;padding:0`;
      if (s.dark) style += `;background:${fg}`;
      html += `<td${attrs} style="${style}"></td>`;
    }
    html += '</tr>';
  }

  html += '</table>';
  return html;
}
