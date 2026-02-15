import qrcode from 'qrcode-generator';
import type { ErrorCorrectionLevel, Grid } from './types';

export function generateQR(
  text: string,
  ecLevel: ErrorCorrectionLevel,
  pad: number,
): { grid: Grid; moduleRows: number; moduleCols: number } {
  const qr = qrcode(0, ecLevel);
  qr.addData(text);
  qr.make();

  const moduleCount = qr.getModuleCount();
  const moduleRows = moduleCount;
  const moduleCols = moduleCount;
  const totalR = moduleRows + pad * 2;
  const totalC = moduleCols + pad * 2;

  const grid: Grid = [];
  for (let r = 0; r < totalR; r++) {
    grid[r] = [];
    for (let c = 0; c < totalC; c++) {
      const qrR = r - pad;
      const qrC = c - pad;
      grid[r][c] =
        qrR >= 0 && qrR < moduleCount && qrC >= 0 && qrC < moduleCount
          ? qr.isDark(qrR, qrC)
          : false;
    }
  }

  return { grid, moduleRows, moduleCols };
}
