export const pxToPt = (px: number | undefined): number | undefined =>
  typeof px === 'number' && !Number.isNaN(Number(px)) ? (px * 3) / 4 : undefined;
