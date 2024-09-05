import * as React from "react";

type FallbackFont =
  | "Arial"
  | "Helvetica"
  | "Verdana"
  | "Georgia"
  | "Times New Roman"
  | "serif"
  | "sans-serif"
  | "monospace"
  | "cursive"
  | "fantasy";

type FontFormat =
  | "woff"
  | "woff2"
  | "truetype"
  | "opentype"
  | "embedded-opentype"
  | "svg";

type FontWeight = React.CSSProperties["fontWeight"];
type FontStyle = React.CSSProperties["fontStyle"];

export interface FontProps {
  /** The font you want to use. NOTE: Do not insert multiple fonts here, use fallbackFontFamily for that */
  fontFamily: string;
  /** An array is possible, but the order of the array is the priority order */
  fallbackFontFamily: FallbackFont | FallbackFont[];
  /** Not all clients support web fonts. For support check: https://www.caniemail.com/features/css-at-font-face/ */
  webFont?: {
    url: string;
    format: FontFormat;
  };
  /** Default: 'normal' */
  fontStyle?: FontStyle;
  /** Default: 400 */
  fontWeight?: FontWeight;
}

/** The component MUST be place inside the <head> tag */
export const Font: React.FC<Readonly<FontProps>> = ({
  fontFamily,
  fallbackFontFamily,
  webFont,
  fontStyle = "normal",
  fontWeight = 400,
}) => {
  const src = webFont
    ? `src: url(${webFont.url.replace(/"/g, '\\"')}) format('${webFont.format}');`
    : "";

  const style = `
    @font-face {
      font-family: '${fontFamily.replace(/'/g, "\\'")}';
      font-style: ${fontStyle};
      font-weight: ${fontWeight};
      mso-font-alt: '${
        Array.isArray(fallbackFontFamily)
          ? fallbackFontFamily[0].replace(/'/g, "\\'")
          : fallbackFontFamily.replace(/'/g, "\\'")
      }';
      ${src}
    }

    * {
      font-family: '${fontFamily.replace(/'/g, "\\'")}', ${
        Array.isArray(fallbackFontFamily)
          ? fallbackFontFamily.map(font => font.replace(/'/g, "\\'")).join(", ")
          : fallbackFontFamily.replace(/'/g, "\\'")
      };
    }
  `;
  return <style dangerouslySetInnerHTML={{ __html: style }} />;
};
