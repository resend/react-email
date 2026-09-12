import {
  darkModeSearchParamValue,
  parseDarkModePreview,
  resolveDarkModeRendering,
} from './dark-mode-preview';

describe('resolveDarkModeRendering()', () => {
  it('keeps the light color scheme while emulating client color inversion', () => {
    // Clients that force-invert (Gmail, Outlook.com) ignore
    // `prefers-color-scheme`, so the email's own dark rules must NOT apply —
    // otherwise the inversion runs on top of an already-dark theme.
    expect(resolveDarkModeRendering('inversion')).toEqual({
      colorScheme: 'light',
      invertColors: true,
    });
  });

  it('asks for the dark color scheme and no inversion in native mode', () => {
    // Clients that honor `prefers-color-scheme` render the authored dark
    // theme untouched.
    expect(resolveDarkModeRendering('native')).toEqual({
      colorScheme: 'dark',
      invertColors: false,
    });
  });

  it('leaves the email alone when dark mode is off', () => {
    expect(resolveDarkModeRendering('off')).toEqual({
      colorScheme: 'light',
      invertColors: false,
    });
  });
});

describe('parseDarkModePreview()', () => {
  it('is off when the URL carries no dark mode at all', () => {
    expect(parseDarkModePreview(new URLSearchParams(''))).toBe('off');
    expect(parseDarkModePreview(new URLSearchParams('view=source'))).toBe(
      'off',
    );
  });

  it('reads the native mode from the URL', () => {
    expect(parseDarkModePreview(new URLSearchParams('dark=native'))).toBe(
      'native',
    );
  });

  it('falls back to color inversion for a value it does not know', () => {
    expect(parseDarkModePreview(new URLSearchParams('dark=banana'))).toBe(
      'inversion',
    );
  });

  it('reads an existing `?dark` link as the color inversion mode', () => {
    // The toggle shipped as a boolean `?dark` flag that meant color inversion.
    // Links and bookmarks carrying it have to keep meaning the same thing.
    expect(parseDarkModePreview(new URLSearchParams('dark='))).toBe(
      'inversion',
    );
    expect(parseDarkModePreview(new URLSearchParams('dark'))).toBe('inversion');
  });
});

describe('darkModeSearchParamValue()', () => {
  it('drops the parameter when dark mode is off', () => {
    expect(darkModeSearchParamValue('off')).toBeNull();
  });

  it('writes the modes back in a form it can read again', () => {
    for (const mode of ['inversion', 'native'] as const) {
      const value = darkModeSearchParamValue(mode);
      const params = new URLSearchParams();
      params.set('dark', value!);
      expect(parseDarkModePreview(params)).toBe(mode);
    }
  });

  it('keeps writing the valueless form for color inversion', () => {
    // So the URL a user shares stays identical to what older versions produced.
    expect(darkModeSearchParamValue('inversion')).toBe('');
  });
});
