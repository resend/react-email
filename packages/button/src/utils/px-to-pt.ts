export const pxToPt = (px: number): number | null =>
  typeof px === 'number' && !Number.isNaN(Number(px)) ? (px * 3) / 4 : null;
