import * as React from 'react';
import {
  applyLossyCompression,
  buildProtectionMask,
  buildQuietZoneMask,
  enforceColumnUniformity,
} from './compression';
import { generateBwip } from './generate-bwip';
import { generateQr } from './generate-qr';
import { packBestOrientation } from './packing';
import { renderTable } from './table-renderer';
import {
  BARCODE_TYPES,
  type BarcodeProps,
  type ErrorCorrectionLevel,
} from './types';

const EC_RATES: Record<ErrorCorrectionLevel, number> = {
  L: 0.07,
  M: 0.15,
  Q: 0.25,
  H: 0.3,
};

const BWIP_EC_RATES: Record<ErrorCorrectionLevel, number> = {
  L: 0.1,
  M: 0.23,
  Q: 0.36,
  H: 0.5,
};

export const Barcode = React.forwardRef<HTMLDivElement, BarcodeProps>(
  (
    {
      value,
      type = 'qrcode',
      foregroundColor = '#000000',
      backgroundColor = '#ffffff',
      cellSize = 4,
      quietZone = true,
      errorCorrection = 'M',
      lossy = false,
      lossyBudget = 0.2,
      style,
      ...props
    },
    ref,
  ) => {
    const cfg = BARCODE_TYPES[type];
    const pad = quietZone ? 4 : 0;

    let grid: boolean[][];
    let moduleRows: number;
    let moduleCols: number;

    if (cfg.lib === 'qr') {
      const result = generateQr(value, errorCorrection, pad);
      grid = result.grid;
      moduleRows = result.moduleRows;
      moduleCols = result.moduleCols;
    } else {
      const result = generateBwip(
        type,
        value,
        cfg.hasEc,
        errorCorrection,
        pad,
      );
      grid = result.grid;
      moduleRows = result.moduleRows;
      moduleCols = result.moduleCols;
    }

    const totalRows = moduleRows + pad * 2;
    const totalCols = moduleCols + pad * 2;

    // Apply lossy compression
    if (cfg.hasLossy && lossy) {
      let protect: Uint8Array[];
      let ecPct: number;
      if (type === 'qrcode') {
        protect = buildProtectionMask(moduleRows, pad, totalRows);
        ecPct = EC_RATES[errorCorrection];
      } else {
        protect = buildQuietZoneMask(pad, totalRows, totalCols);
        ecPct = cfg.hasEc
          ? BWIP_EC_RATES[errorCorrection]
          : (cfg.ecRate ?? 0.02);
      }
      const flipped = applyLossyCompression(
        grid,
        pad,
        totalRows,
        totalCols,
        protect,
        ecPct,
        lossyBudget,
      );

      // 1D: enforce column uniformity
      if (cfg.type === '1d' && flipped > 0) {
        enforceColumnUniformity(grid, pad, totalRows, totalCols, moduleRows);
      }
    }

    const { spans } = packBestOrientation(grid, totalRows, totalCols);
    const tableHTML = renderTable(
      spans,
      totalRows,
      totalCols,
      cellSize,
      foregroundColor,
      backgroundColor,
    );

    return (
      <div
        {...props}
        dangerouslySetInnerHTML={{ __html: tableHTML }}
        data-id="react-email-barcode"
        ref={ref}
        style={style}
      />
    );
  },
);

Barcode.displayName = 'Barcode';
