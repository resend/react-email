import { ALIGN_POS } from './align-pos';
import type { Grid } from './types';

/**
 * Build protection mask for QR structural patterns.
 * Returns a 2D Uint8Array grid in total (padded) coordinates.
 * Protected cells (1) will not be flipped during lossy compression.
 */
export function buildProtectionMask(
  moduleCount: number,
  pad: number,
  totalSize: number,
): Uint8Array[] {
  const p = Array.from({ length: totalSize }, () => new Uint8Array(totalSize));
  const n = moduleCount;

  function protectQR(r0: number, c0: number, r1: number, c1: number) {
    for (
      let r = Math.max(0, r0 + pad);
      r <= Math.min(totalSize - 1, r1 + pad);
      r++
    )
      for (
        let c = Math.max(0, c0 + pad);
        c <= Math.min(totalSize - 1, c1 + pad);
        c++
      )
        p[r][c] = 1;
  }

  // 1. Quiet zone (all padding cells)
  for (let r = 0; r < totalSize; r++)
    for (let c = 0; c < totalSize; c++)
      if (r < pad || r >= totalSize - pad || c < pad || c >= totalSize - pad)
        p[r][c] = 1;

  // 2. Finder patterns (7x7) + separator (1 module border)
  protectQR(-1, -1, 7, 7);
  protectQR(-1, n - 8, 7, n);
  protectQR(n - 8, -1, n, 7);

  // 3. Timing patterns (row 6 and col 6)
  for (let i = 0; i < n; i++) {
    p[6 + pad][i + pad] = 1;
    p[i + pad][6 + pad] = 1;
  }

  // 4. Format information areas
  for (let i = 0; i <= 8; i++) {
    if (i + pad < totalSize) p[8 + pad][i + pad] = 1;
    if (i + pad < totalSize) p[i + pad][8 + pad] = 1;
  }
  for (let i = 0; i < 8; i++) {
    if (n - 1 - i >= 0) p[8 + pad][n - 1 - i + pad] = 1;
  }
  for (let i = 0; i < 7; i++) {
    if (n - 1 - i >= 0) p[n - 1 - i + pad][8 + pad] = 1;
  }
  // Dark module
  if (4 * 1 + 9 < n) p[n - 8 + pad][8 + pad] = 1;

  // 5. Alignment patterns (5x5 each)
  const version = Math.ceil((n - 17) / 4);
  if (version >= 2 && version < ALIGN_POS.length) {
    const positions = ALIGN_POS[version];
    if (positions) {
      for (const ar of positions) {
        for (const ac of positions) {
          if (ar <= 8 && ac <= 8) continue;
          if (ar <= 8 && ac >= n - 8) continue;
          if (ar >= n - 8 && ac <= 8) continue;
          protectQR(ar - 2, ac - 2, ar + 2, ac + 2);
        }
      }
    }
  }

  // 6. Version information (versions 7+)
  if (version >= 7) {
    protectQR(0, n - 11, 5, n - 8);
    protectQR(n - 11, 0, n - 8, 5);
  }

  return p;
}

/**
 * Build a protection mask that only protects quiet zone padding cells.
 * Used for non-QR barcode types.
 */
export function buildQuietZoneMask(
  pad: number,
  totalRows: number,
  totalCols: number,
): Uint8Array[] {
  const p = Array.from({ length: totalRows }, () => new Uint8Array(totalCols));
  if (pad > 0) {
    for (let r = 0; r < totalRows; r++)
      for (let c = 0; c < totalCols; c++)
        if (r < pad || r >= totalRows - pad || c < pad || c >= totalCols - pad)
          p[r][c] = 1;
  }
  return p;
}

/**
 * Lossy compression: iteratively flip isolated data modules to aid merging.
 * Uses per-flip re-scoring so each flip updates the isolation landscape
 * for its neighbors, producing better cascading improvements.
 */
export function applyLossyCompression(
  grid: Grid,
  pad: number,
  totalRows: number,
  totalCols: number,
  protect: Uint8Array[],
  ecPct: number,
  budget: number,
): number {
  let dataModules = 0;
  for (let r = pad; r < totalRows - pad; r++)
    for (let c = pad; c < totalCols - pad; c++)
      if (!protect[r][c]) dataModules++;

  const maxFlips = Math.floor(dataModules * ecPct * 0.5 * budget);
  if (maxFlips === 0) return 0;

  const wasFlipped = new Uint8Array(totalRows * totalCols);

  function scoreAt(r: number, c: number): number {
    if (protect[r][c] || wasFlipped[r * totalCols + c]) return -1;
    const val = grid[r][c];
    let cardDiff = 0;
    if (r > 0 && grid[r - 1][c] !== val) cardDiff++;
    if (r < totalRows - 1 && grid[r + 1][c] !== val) cardDiff++;
    if (c > 0 && grid[r][c - 1] !== val) cardDiff++;
    if (c < totalCols - 1 && grid[r][c + 1] !== val) cardDiff++;
    if (cardDiff < 2) return -1;
    let diagDiff = 0;
    if (r > 0 && c > 0 && grid[r - 1][c - 1] !== val) diagDiff++;
    if (r > 0 && c < totalCols - 1 && grid[r - 1][c + 1] !== val) diagDiff++;
    if (r < totalRows - 1 && c > 0 && grid[r + 1][c - 1] !== val) diagDiff++;
    if (r < totalRows - 1 && c < totalCols - 1 && grid[r + 1][c + 1] !== val)
      diagDiff++;
    return cardDiff * 10 + diagDiff * 3;
  }

  // Build initial score grid
  const scores = Array.from({ length: totalRows }, () =>
    new Array(totalCols).fill(-1),
  );
  for (let r = pad; r < totalRows - pad; r++)
    for (let c = pad; c < totalCols - pad; c++) scores[r][c] = scoreAt(r, c);

  let flippedCount = 0;
  while (flippedCount < maxFlips) {
    let bestR = -1;
    let bestC = -1;
    let bestScore = -1;
    for (let r = pad; r < totalRows - pad; r++)
      for (let c = pad; c < totalCols - pad; c++)
        if (scores[r][c] > bestScore) {
          bestScore = scores[r][c];
          bestR = r;
          bestC = c;
        }
    if (bestScore < 0) break;

    grid[bestR][bestC] = !grid[bestR][bestC];
    wasFlipped[bestR * totalCols + bestC] = 1;
    flippedCount++;

    // Re-score the 3x3 neighborhood
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++) {
        const nr = bestR + dr;
        const nc = bestC + dc;
        if (
          nr >= pad &&
          nr < totalRows - pad &&
          nc >= pad &&
          nc < totalCols - pad
        )
          scores[nr][nc] = scoreAt(nr, nc);
      }
  }

  return flippedCount;
}

/**
 * 1D barcodes: enforce column uniformity by replicating the middle data row.
 * Edge rows near the quiet zone get artificially high isolation scores,
 * causing scattered single-row flips that break the vertical-bar structure.
 */
export function enforceColumnUniformity(
  grid: Grid,
  pad: number,
  totalRows: number,
  totalCols: number,
  moduleRows: number,
) {
  const refRow = pad + Math.floor(moduleRows / 2);
  for (let r = pad; r < totalRows - pad; r++) {
    if (r === refRow) continue;
    for (let c = pad; c < totalCols - pad; c++) grid[r][c] = grid[refRow][c];
  }
}
