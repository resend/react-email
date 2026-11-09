import { stripImagePreloadLinks } from './strip-image-preload-links';

describe('stripImagePreloadLinks()', () => {
  it('removes React-injected image preload links', () => {
    const html =
      '<head><link rel="preload" as="image" href="https://example.com/logo.png"/></head><body><img src="https://example.com/logo.png"/></body>';

    expect(stripImagePreloadLinks(html)).toBe(
      '<head></head><body><img src="https://example.com/logo.png"/></body>',
    );
  });

  it('removes every image preload link when there are multiple images', () => {
    const html =
      '<head><link rel="preload" as="image" href="a.png"/><link rel="preload" as="image" href="b.png"/></head>';

    expect(stripImagePreloadLinks(html)).toBe('<head></head>');
  });

  it('removes image preloads emitted from srcSet (no href)', () => {
    const html =
      '<head><link rel="preload" as="image" imageSrcSet="a.png 2x" crossorigin=""/></head>';

    expect(stripImagePreloadLinks(html)).toBe('<head></head>');
  });

  it('keeps user-authored non-image preloads', () => {
    const html =
      '<head><link rel="preload" as="style" href="styles.css"/><link rel="preload" as="font" href="font.woff2"/></head>';

    expect(stripImagePreloadLinks(html)).toBe(html);
  });

  it('keeps other link tags such as stylesheets and icons', () => {
    const html =
      '<head><link rel="stylesheet" href="styles.css"/><link rel="icon" href="favicon.ico"/></head>';

    expect(stripImagePreloadLinks(html)).toBe(html);
  });

  it('is unaffected by attribute order', () => {
    const html =
      '<head><link as="image" href="logo.png" rel="preload"/></head>';

    expect(stripImagePreloadLinks(html)).toBe('<head></head>');
  });

  it('does not touch text that merely mentions a preload link', () => {
    const html =
      '<body><code>&lt;link rel="preload" as="image" /&gt;</code></body>';

    expect(stripImagePreloadLinks(html)).toBe(html);
  });

  it('returns the HTML untouched when there are no links', () => {
    const html = '<body><p>Hello</p></body>';

    expect(stripImagePreloadLinks(html)).toBe(html);
  });
});
