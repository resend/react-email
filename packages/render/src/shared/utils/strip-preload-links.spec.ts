import { stripAutoInjectedImagePreloads } from './strip-preload-links';

describe('stripAutoInjectedImagePreloads', () => {
  it('removes image preload links that match an <img> src', () => {
    const html =
      '<link rel="preload" as="image" href="img/test.png"/><h1>Hello</h1><img src="img/test.png"/>';
    expect(stripAutoInjectedImagePreloads(html)).toBe(
      '<h1>Hello</h1><img src="img/test.png"/>',
    );
  });

  it('removes multiple matching image preload links', () => {
    const html =
      '<link rel="preload" as="image" href="a.png"/><link rel="preload" as="image" href="b.png"/><img src="a.png"/><img src="b.png"/>';
    expect(stripAutoInjectedImagePreloads(html)).toBe(
      '<img src="a.png"/><img src="b.png"/>',
    );
  });

  it('preserves image preload links that do NOT match any <img> src', () => {
    const html =
      '<link rel="preload" as="image" href="bg-pattern.png"/><img src="logo.png"/>';
    expect(stripAutoInjectedImagePreloads(html)).toBe(html);
  });

  it('preserves non-image preload links (fonts, scripts, etc.)', () => {
    const html =
      '<link rel="preload" as="font" href="font.woff2" crossorigin/><link rel="preload" as="script" href="app.js"/><img src="logo.png"/>';
    expect(stripAutoInjectedImagePreloads(html)).toBe(html);
  });

  it('returns unchanged html when no images exist', () => {
    const html =
      '<link rel="preload" as="image" href="test.png"/><h1>Hello</h1>';
    expect(stripAutoInjectedImagePreloads(html)).toBe(html);
  });

  it('returns unchanged html when no preload links exist', () => {
    const html = '<h1>Hello</h1><img src="test.png"/>';
    expect(stripAutoInjectedImagePreloads(html)).toBe(html);
  });

  it('handles self-closing tags with a space before the slash', () => {
    const html =
      '<link rel="preload" as="image" href="test.png" /><img src="test.png" />';
    expect(stripAutoInjectedImagePreloads(html)).toBe(
      '<img src="test.png" />',
    );
  });

  it('removes srcset-based image preloads that match an <img> srcset', () => {
    const html =
      '<link rel="preload" as="image" imagesrcset="img-1x.png 1x, img-2x.png 2x"/><img srcset="img-1x.png 1x, img-2x.png 2x"/>';
    expect(stripAutoInjectedImagePreloads(html)).toBe(
      '<img srcset="img-1x.png 1x, img-2x.png 2x"/>',
    );
  });

  it('removes srcset-based preloads with imagesizes', () => {
    const html =
      '<link rel="preload" as="image" imagesrcset="sm.png 480w, lg.png 800w" imagesizes="(max-width: 600px) 480px, 800px"/><img srcset="sm.png 480w, lg.png 800w" sizes="(max-width: 600px) 480px, 800px"/>';
    expect(stripAutoInjectedImagePreloads(html)).toBe(
      '<img srcset="sm.png 480w, lg.png 800w" sizes="(max-width: 600px) 480px, 800px"/>',
    );
  });

  it('preserves srcset-based preloads that do NOT match any <img> srcset', () => {
    const html =
      '<link rel="preload" as="image" imagesrcset="other.png 1x"/><img srcset="logo.png 1x"/>';
    expect(stripAutoInjectedImagePreloads(html)).toBe(html);
  });

  it('handles mixed src and srcset images', () => {
    const html =
      '<link rel="preload" as="image" href="a.png"/><link rel="preload" as="image" imagesrcset="b-1x.png 1x, b-2x.png 2x"/><img src="a.png"/><img srcset="b-1x.png 1x, b-2x.png 2x"/>';
    expect(stripAutoInjectedImagePreloads(html)).toBe(
      '<img src="a.png"/><img srcset="b-1x.png 1x, b-2x.png 2x"/>',
    );
  });
});
