import type * as React from 'react';

export type BarcodeType =
  | 'qrcode'
  | 'azteccode'
  | 'datamatrix'
  | 'code128'
  | 'code39'
  | 'ean13'
  | 'upca';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type Grid = boolean[][];

export interface Span {
  w: number;
  h: number;
  dark: boolean;
}

export interface BarcodeTypeConfig {
  lib: 'qr' | 'bwip';
  type: '1d' | '2d';
  hasEC: boolean;
  hasLossy: boolean;
  ecRate?: number;
}

export const BARCODE_TYPES: Record<BarcodeType, BarcodeTypeConfig> = {
  qrcode: { lib: 'qr', type: '2d', hasEC: true, hasLossy: true },
  azteccode: { lib: 'bwip', type: '2d', hasEC: true, hasLossy: true },
  datamatrix: {
    lib: 'bwip',
    type: '2d',
    hasEC: false,
    hasLossy: true,
    ecRate: 0.15,
  },
  code128: {
    lib: 'bwip',
    type: '1d',
    hasEC: false,
    hasLossy: true,
    ecRate: 0.02,
  },
  code39: {
    lib: 'bwip',
    type: '1d',
    hasEC: false,
    hasLossy: true,
    ecRate: 0.02,
  },
  ean13: {
    lib: 'bwip',
    type: '1d',
    hasEC: false,
    hasLossy: true,
    ecRate: 0.02,
  },
  upca: {
    lib: 'bwip',
    type: '1d',
    hasEC: false,
    hasLossy: true,
    ecRate: 0.02,
  },
};

export interface BarcodeProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  value: string;
  type?: BarcodeType;
  foregroundColor?: string;
  backgroundColor?: string;
  cellSize?: number;
  quietZone?: boolean;
  errorCorrection?: ErrorCorrectionLevel;
  lossy?: boolean;
  lossyBudget?: number;
}
