export const pxToPt = (px: number): number | null =>
  typeof px === "number" && !isNaN(Number(px)) ? (px * 3) / 4 : null;
