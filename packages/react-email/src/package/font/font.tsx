type FallbackFont =
  | 'Arial'
  | 'Helvetica'
  | 'Verdana'
  | 'Georgia'
  | 'Times New Roman'
  | 'serif'
  | 'sans-serif'
  | 'monospace'
  | 'cursive'
  | 'fantasy';

type FontFormat =
  | 'woff'
  | 'woff2'
  | 'truetype'
  | 'opentype'
  | 'embedded-opentype'
  | 'svg';

type FontWeight = React.CSSProperties['fontWeight'];
type FontStyle = React.CSSProperties['fontStyle'];

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
  fontStyle = 'normal',
  fontWeight = 400,
}) => {
  const src = webFont
    ? `src: url(${webFont.url}) format('${webFont.format}');`
    : '';

  const style = `
    @font-face {
      font-family: '${fontFamily}';
      font-style: ${fontStyle};
      font-weight: ${fontWeight};
      mso-font-alt: '${
        Array.isArray(fallbackFontFamily)
          ? fallbackFontFamily[0]
          : fallbackFontFamily
      }';
      ${src}
    }

    * {
      font-family: '${fontFamily}', ${
        Array.isArray(fallbackFontFamily)
          ? fallbackFontFamily.join(', ')
          : fallbackFontFamily
      };
    }
  `;
  return <style dangerouslySetInnerHTML={{ __html: style }} />;
};
