import bwipjs from 'bwip-js';
import { GridDrawing } from './grid-drawing';
import type { BarcodeType, ErrorCorrectionLevel, Grid } from './types';

const EC_MAP: Record<ErrorCorrectionLevel, number> = {
  L: 10,
  M: 23,
  Q: 36,
  H: 50,
};

export function generateBwip(
  bcid: BarcodeType,
  text: string,
  hasEc: boolean,
  ecLevel: ErrorCorrectionLevel,
  pad: number,
): { grid: Grid; moduleRows: number; moduleCols: number } {
  const drawing = new GridDrawing();

  const opts: Record<string, unknown> = {
    bcid,
    text,
    scale: 1,
    includetext: false,
    padding: 0,
  };

  if (hasEc) {
    opts.eclevel = EC_MAP[ecLevel] || 23;
  }

  bwipjs.render(opts as Parameters<typeof bwipjs.render>[0], drawing as never);

  const rawGrid = drawing.end();
  const moduleRows = rawGrid.length;
  const moduleCols = moduleRows > 0 ? rawGrid[0].length : 0;

  if (pad > 0) {
    const totalR = moduleRows + pad * 2;
    const totalC = moduleCols + pad * 2;
    const padded: Grid = [];
    for (let r = 0; r < totalR; r++) {
      padded[r] = [];
      for (let c = 0; c < totalC; c++) {
        const sr = r - pad;
        const sc = c - pad;
        padded[r][c] =
          sr >= 0 && sr < moduleRows && sc >= 0 && sc < moduleCols
            ? rawGrid[sr][sc]
            : false;
      }
    }
    return { grid: padded, moduleRows, moduleCols };
  }

  return { grid: rawGrid, moduleRows, moduleCols };
}
