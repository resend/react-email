/**
 * How the preview should emulate a dark-mode email client.
 *
 * Clients are split on what they do with a dark-mode-aware email, so the
 * preview exposes both behaviors instead of picking one:
 *
 * - `inversion` — Gmail and Outlook.com ignore `prefers-color-scheme` and
 *   recolor the light theme themselves.
 * - `native` — Apple Mail and Outlook for Mac honor `prefers-color-scheme` and
 *   render whatever dark theme the email authored.
 */
export type DarkModePreview = 'off' | 'inversion' | 'native';

export type ColorScheme = 'light' | 'dark';

interface DarkModeRendering {
  /** The color scheme preference the email should be rendered under. */
  colorScheme: ColorScheme;
  invertColors: boolean;
}

const renderingByMode: Record<DarkModePreview, DarkModeRendering> = {
  off: { colorScheme: 'light', invertColors: false },
  // Deliberately `light`: a force-inverting client never applies the email's
  // own dark rules, so neither should the preview before inverting.
  inversion: { colorScheme: 'light', invertColors: true },
  native: { colorScheme: 'dark', invertColors: false },
};

export function resolveDarkModeRendering(
  mode: DarkModePreview,
): DarkModeRendering {
  return renderingByMode[mode];
}

/**
 * Reads the preview mode out of the URL.
 *
 * The toggle originally shipped as a valueless `?dark` flag standing for color
 * inversion, so a bare — or unrecognized — value keeps meaning exactly that,
 * and links written before the native mode existed still resolve the same way.
 */
export function parseDarkModePreview(
  searchParams: URLSearchParams,
): DarkModePreview {
  const value = searchParams.get('dark');
  if (value === null) return 'off';
  return value === 'native' ? 'native' : 'inversion';
}

/**
 * The `dark` search param value a mode should be written as, or `null` when the
 * param should be dropped altogether.
 */
export function darkModeSearchParamValue(mode: DarkModePreview): string | null {
  if (mode === 'off') return null;
  return mode === 'native' ? 'native' : '';
}
