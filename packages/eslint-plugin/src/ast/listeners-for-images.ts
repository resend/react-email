import path from "node:path";
import { TSESTree } from "@typescript-eslint/utils";
import type { RuleListener } from "@typescript-eslint/utils/ts-eslint";

export type ImageSourceType =
  | "base64"
  | "avif"
  | "bmp"
  | "gif"
  | "jpg"
  | "ico"
  | "heif"
  | "hdr"
  | "png"
  | "svg"
  | "tiff"
  | "webp";

export const listenersForImage = (
  callback: (
    node: TSESTree.Literal | TSESTree.TemplateElement,
    sourceType: ImageSourceType,
  ) => void,
): RuleListener => {
  return {
    "JSXOpeningElement:matches([name.name='Img'], [name.name='img']) JSXAttribute[name.name='src'] :matches(Literal, TemplateElement)":
      (node: TSESTree.Literal | TSESTree.TemplateElement) => {
        if (node.value === null) return;

        const value =
          node.type === TSESTree.AST_NODE_TYPES.TemplateElement
            ? node.value.cooked
            : node.value;

        if (typeof value === "string") {
          const imageSource = value;
          const base64Regex = /data:image\/[^;]+;base64[^"]+/g;

          const imageTypePerFileExtension: Record<string, ImageSourceType> = {
            ".avif": "avif",
            ".bmp": "bmp",
            ".gif": "gif",
            ".jpg": "jpg",
            ".jpeg": "jpg",
            ".ico": "ico",
            ".heif": "heif",
            ".heic": "heif",
            ".hdr": "hdr",
            ".png": "png",
            ".svg": "svg",
            ".tiff": "tiff",
            ".webp": "webp",
          };

          if (base64Regex.test(imageSource)) {
            callback(node, "base64");
          } else {
            const extension = path.extname(imageSource);
            if (extension in imageTypePerFileExtension) {
              callback(node, imageTypePerFileExtension[extension]);
            }
          }
        }
      },
  };
};
