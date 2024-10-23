const srcAttributeRegex = /src\s*=\s*"(?<URI>\/static.+)"/g;
const fontsUriFunctionRegex = /url\((?<URI>\/fonts[^)]+)\)/g;
const fontsUriStringRegex = /(?:"|'|`)(?<URI>\/fonts[^"'`]+)(?:"|'|`)/g;

export const convertUrisIntoUrls = (code: string) => {
  srcAttributeRegex.lastIndex = 0;
  fontsUriFunctionRegex.lastIndex = 0;
  fontsUriStringRegex.lastIndex = 0;
  return code
    .replaceAll(
      srcAttributeRegex,
      (_match, uri) => `src="https://react.email${uri}"`,
    )
    .replaceAll(
      fontsUriFunctionRegex,
      (_match, uri) => `url(https://react.email${uri})`,
    )
    .replaceAll(fontsUriStringRegex, (_match, uri: string) =>
      _match.replace(uri, `https://react.email${uri}`),
    );
};
