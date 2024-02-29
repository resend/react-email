import type { ImageSourceType } from "../ast/listeners-for-images";

const imageSourceTypePerName: Record<string, ImageSourceType> = {
  AVIF: "avif",
  "Base 64": "base64",
  BMP: "bmp",
  GIF: "gif",
  JPG: "jpg",
  ICO: "ico",
  HEIF: "heif",
  HDR: "hdr",
  PNG: "png",
  SVG: "svg",
  TIFF: "tiff",
  webP: "webp",
};

export const getImageTypeFromTitle = (
  title: string,
): ImageSourceType | undefined => {
  const match = /(?<imageTypeName>.+?) image format/.exec(title);
  if (match) {
    const [_full, imageTypeName] = match;

    if (imageTypeName in imageSourceTypePerName) {
      return imageSourceTypePerName[imageTypeName];
    }
  }
};
