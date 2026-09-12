import type { ColorScheme } from '../../../utils/dark-mode-preview';
import { syncDarkMode } from './email-frame';

const darkCardCss = '@media (prefers-color-scheme: dark){.card{color:#fff}}';

/**
 * A loaded preview frame whose browser reports `reports` as the reader's color
 * scheme — which is what the OS setting alone decides in every browser that
 * doesn't propagate `color-scheme` into embedded documents, Safari included.
 */
const frameReporting = async (reports: ColorScheme, markup: string) => {
  const iframe = document.createElement('iframe');
  iframe.srcdoc = markup;
  document.body.appendChild(iframe);
  await new Promise((resolve) => setTimeout(resolve, 20));

  Object.defineProperty(iframe.contentWindow, 'matchMedia', {
    configurable: true,
    value: (query: string) => ({
      matches: query.includes('dark') && reports === 'dark',
    }),
  });

  return iframe;
};

const mediaConditions = (iframe: HTMLIFrameElement) =>
  Array.from(
    iframe.contentDocument!.styleSheets as unknown as CSSStyleSheet[],
  ).flatMap((sheet) =>
    Array.from(sheet.cssRules as unknown as CSSMediaRule[])
      .map((rule) => rule.media?.mediaText)
      .filter(Boolean),
  );

/**
 * Whether the inversion has walked the document and taken over its colors.
 *
 * Read through the per-element record the undo relies on rather than through
 * the inverted values themselves: those come out of `colorjs.io` as `lch()`,
 * which happy-dom's style parser drops on assignment, so the recoloring is not
 * observable here. What it does show is that every element was visited and can
 * be put back.
 */
const isInverted = (iframe: HTMLIFrameElement) =>
  iframe.contentDocument!.body.hasAttribute('data-applied-color-inversion') &&
  iframe.contentDocument!.body.hasAttribute('data-original-color');

const rootColorScheme = (iframe: HTMLIFrameElement) =>
  iframe.contentDocument!.documentElement.style.colorScheme;

describe('syncDarkMode()', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('with the reader in light mode, as most are', () => {
    it("makes the email's own dark rules apply in the native mode", async () => {
      const iframe = await frameReporting(
        'light',
        `<html><head><style>${darkCardCss}</style></head><body></body></html>`,
      );

      syncDarkMode(iframe, 'native');

      expect(mediaConditions(iframe)).toEqual([
        '(prefers-color-scheme: light)',
      ]);
      expect(rootColorScheme(iframe)).toBe('dark');
      expect(isInverted(iframe)).toBe(false);
    });

    it('inverts the light theme, and leaves the dark rules unmatched, in the inversion mode', async () => {
      const iframe = await frameReporting(
        'light',
        `<html><head><style>${darkCardCss}</style></head><body style="color:#000"></body></html>`,
      );

      syncDarkMode(iframe, 'inversion');

      expect(isInverted(iframe)).toBe(true);
      // Still the email's own condition, which a browser reporting light does
      // not match — an inverting client never honors `prefers-color-scheme`.
      expect(mediaConditions(iframe)).toEqual(['(prefers-color-scheme: dark)']);
      expect(rootColorScheme(iframe)).toBe('');
    });

    it('leaves the email alone when dark mode is off', async () => {
      const iframe = await frameReporting(
        'light',
        `<html><head><style>${darkCardCss}</style></head><body></body></html>`,
      );

      syncDarkMode(iframe, 'off');

      expect(mediaConditions(iframe)).toEqual(['(prefers-color-scheme: dark)']);
      expect(isInverted(iframe)).toBe(false);
      expect(rootColorScheme(iframe)).toBe('');
    });
  });

  describe('with the reader in dark mode, which the frame must not inherit', () => {
    it("keeps the email's dark rules out of the preview when dark mode is off", async () => {
      const iframe = await frameReporting(
        'dark',
        `<html><head><style>${darkCardCss}</style></head><body></body></html>`,
      );

      syncDarkMode(iframe, 'off');

      expect(mediaConditions(iframe)).toEqual([
        '(prefers-color-scheme: light)',
      ]);
      expect(rootColorScheme(iframe)).toBe('');
    });

    it("inverts the light theme rather than the email's dark theme", async () => {
      // Inverting an already-dark theme is the failure this guards: the email's
      // dark rules have to stop matching before the inversion is what the
      // reader sees.
      const iframe = await frameReporting(
        'dark',
        `<html><head><style>${darkCardCss}</style></head><body style="color:#000"></body></html>`,
      );

      syncDarkMode(iframe, 'inversion');

      expect(mediaConditions(iframe)).toEqual([
        '(prefers-color-scheme: light)',
      ]);
      expect(isInverted(iframe)).toBe(true);
    });

    it('rewrites nothing in the native mode, letting the browser match on its own', async () => {
      const iframe = await frameReporting(
        'dark',
        `<html><head><style>${darkCardCss}</style></head><body></body></html>`,
      );

      syncDarkMode(iframe, 'native');

      expect(mediaConditions(iframe)).toEqual(['(prefers-color-scheme: dark)']);
      expect(rootColorScheme(iframe)).toBe('dark');
    });
  });

  it('restores the email as authored when the mode is switched back off', async () => {
    const iframe = await frameReporting(
      'light',
      `<html><head><style>${darkCardCss}</style></head><body style="color:#000"></body></html>`,
    );

    syncDarkMode(iframe, 'native');
    syncDarkMode(iframe, 'inversion');
    syncDarkMode(iframe, 'off');

    expect(mediaConditions(iframe)).toEqual(['(prefers-color-scheme: dark)']);
    expect(isInverted(iframe)).toBe(false);
    expect(rootColorScheme(iframe)).toBe('');
    expect(iframe.contentDocument!.body.style.color).toBe('#000');
  });

  it('leaves no background behind on an email that never painted one', async () => {
    // The inversion seeds `<body>` with white so it has something to invert.
    // Restoring that seed on the way out — instead of dropping it — leaves the
    // email with a white background it never asked for, which then shows
    // through as a white page under the native mode's dark theme.
    const iframe = await frameReporting(
      'light',
      `<html><head><style>${darkCardCss}</style></head><body></body></html>`,
    );
    const body = iframe.contentDocument!.body;

    syncDarkMode(iframe, 'inversion');
    expect(body.style.background).not.toBe('');

    syncDarkMode(iframe, 'native');

    expect(body.style.background).toBe('');
    expect(body.style.color).toBe('');
    expect(body.getAttribute('data-seeded-background')).toBeNull();
  });

  it("restores an email's own background after inverting it", async () => {
    // The flip side: a background the email really did declare has to come
    // back exactly as authored.
    const iframe = await frameReporting(
      'light',
      '<html><body style="background:#fafafa"></body></html>',
    );
    const body = iframe.contentDocument!.body;

    syncDarkMode(iframe, 'inversion');
    syncDarkMode(iframe, 'off');

    expect(body.style.background).toBe('#fafafa');
  });

  it('does nothing before the frame has a document', () => {
    const iframe = document.createElement('iframe');

    expect(() => syncDarkMode(iframe, 'native')).not.toThrow();
  });

  it('does nothing while the frame is still loading its markup', () => {
    // React re-attaches the ref on every render, so this runs against a frame
    // whose `srcDoc` has not been parsed yet — a document that answers, but
    // with no root element on it.
    const stillLoading = {
      contentDocument: { styleSheets: [], documentElement: null, body: null },
      contentWindow: { matchMedia: () => ({ matches: false }) },
    } as unknown as HTMLIFrameElement;

    expect(() => syncDarkMode(stillLoading, 'native')).not.toThrow();
  });
});
