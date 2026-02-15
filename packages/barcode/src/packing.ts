import type { Grid, Span } from './types';

/**
 * Greedy rectangle packing: scan top-left to bottom-right, at each uncovered
 * cell find the maximal-area same-color rectangle anchored there.
 */
export function packGreedy(
  grid: Grid,
  totalRows: number,
  totalCols: number,
): { spans: (Span | null)[][]; cellCount: number } {
  const used = Array.from({ length: totalRows }, () =>
    new Uint8Array(totalCols),
  );

  function findBestRect(r: number, c: number) {
    const val = grid[r][c];
    let maxW = 0;
    while (
      c + maxW < totalCols &&
      grid[r][c + maxW] === val &&
      !used[r][c + maxW]
    )
      maxW++;

    let bestArea = 0;
    let bestW = 0;
    let bestH = 0;
    let curW = maxW;

    for (let h = 1; r + h - 1 < totalRows; h++) {
      if (h > 1) {
        const row = r + h - 1;
        let newW = 0;
        while (
          newW < curW &&
          c + newW < totalCols &&
          grid[row][c + newW] === val &&
          !used[row][c + newW]
        )
          newW++;
        curW = newW;
        if (curW === 0) break;
      }
      const area = curW * h;
      if (area > bestArea) {
        bestArea = area;
        bestW = curW;
        bestH = h;
      }
    }
    return { w: bestW, h: bestH };
  }

  const spans: (Span | null)[][] = [];
  for (let r = 0; r < totalRows; r++)
    spans[r] = new Array<Span | null>(totalCols).fill(null);

  let cellCount = 0;
  for (let r = 0; r < totalRows; r++) {
    for (let c = 0; c < totalCols; c++) {
      if (used[r][c]) continue;
      const { w, h } = findBestRect(r, c);
      spans[r][c] = { w, h, dark: grid[r][c] };
      for (let dr = 0; dr < h; dr++)
        for (let dc = 0; dc < w; dc++) used[r + dr][c + dc] = 1;
      cellCount++;
    }
  }

  return { spans, cellCount };
}

/**
 * Try all 8 orientations of the dihedral group D4 (4 reflections x
 * identity/transpose) and return the packing with the fewest cells.
 */
export function packBestOrientation(
  grid: Grid,
  totalRows: number,
  totalCols: number,
): { spans: (Span | null)[][]; cellCount: number } {
  const R = totalRows;
  const C = totalCols;

  // Identity (original scan order)
  let best = packGreedy(grid, R, C);

  const orientations: [boolean, boolean, boolean][] = [
    [false, true, false],
    [false, false, true],
    [false, true, true],
    [true, false, false],
    [true, true, false],
    [true, false, true],
    [true, true, true],
  ];

  for (const [trans, fH, fV] of orientations) {
    const tR = trans ? C : R;
    const tC = trans ? R : C;
    const tGrid: Grid = Array.from({ length: tR }, (_, r) => {
      const row = new Array<boolean>(tC);
      for (let c = 0; c < tC; c++) {
        let srcR = trans ? c : r;
        let srcC = trans ? r : c;
        if (fV) srcR = R - 1 - srcR;
        if (fH) srcC = C - 1 - srcC;
        row[c] = grid[srcR][srcC];
      }
      return row;
    });

    const result = packGreedy(tGrid, tR, tC);
    if (result.cellCount >= best.cellCount) continue;

    // Map spans back to original coordinates
    const newSpans: (Span | null)[][] = Array.from({ length: R }, () =>
      new Array<Span | null>(C).fill(null),
    );
    for (let r = 0; r < tR; r++)
      for (let c = 0; c < tC; c++) {
        const s = result.spans[r][c];
        if (!s) continue;
        let tlR = trans ? c : r;
        let tlC = trans ? r : c;
        let brR = trans ? c + s.w - 1 : r + s.h - 1;
        let brC = trans ? r + s.h - 1 : c + s.w - 1;
        if (fV) {
          tlR = R - 1 - tlR;
          brR = R - 1 - brR;
        }
        if (fH) {
          tlC = C - 1 - tlC;
          brC = C - 1 - brC;
        }
        const minR = Math.min(tlR, brR);
        const minC = Math.min(tlC, brC);
        const maxR = Math.max(tlR, brR);
        const maxC = Math.max(tlC, brC);
        newSpans[minR][minC] = {
          w: maxC - minC + 1,
          h: maxR - minR + 1,
          dark: s.dark,
        };
      }
    best = { spans: newSpans, cellCount: result.cellCount };
  }

  return best;
}
