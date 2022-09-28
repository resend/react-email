export const pxToPt = (px: string): number | null =>
  isNaN(Number(px)) ? null : (parseInt(px, 10) * 3) / 4;
