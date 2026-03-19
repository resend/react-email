import type { SupportEntry } from './check-compatibility';

/**
 * Supplemental support entries for CSS features not yet tracked by caniemail.com.
 * These entries are manually curated based on real-world email client testing.
 *
 * When caniemail.com adds official entries for these features, they can be removed
 * from this file and will be picked up automatically via `fill-caniemail-data.mts`.
 *
 * See: https://github.com/resend/react-email/issues/2947
 */
export const supplementalSupportEntries: SupportEntry[] = [
  {
    slug: 'css-hsl',
    title: 'hsl()',
    description: 'HSL functional notation for colors (`hsl()`)',
    url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl',
    category: 'css',
    tags: [],
    keywords: 'hsl,color',
    last_test_date: '2026-02-06',
    test_url: 'https://github.com/tlow92/react-email-hsl-colors',
    test_results_url: null,
    stats: {
      'apple-mail': {
        macos: [{ '16': 'y' }],
        ios: [{ '16': 'y' }],
      },
      gmail: {
        'desktop-webmail': [{ '2024-01': 'y' }],
        ios: [{ '2024-01': 'y' }],
        android: [{ '2024-01': 'y' }],
      },
      outlook: {
        windows: [
          { '2007': 'n' },
          { '2010': 'n' },
          { '2013': 'n' },
          { '2016': 'n' },
          { '2019': 'n' },
        ],
        'windows-mail': [{ '2024-01': 'n' }],
        macos: [{ '16.80': 'y' }],
        'outlook-com': [{ '2024-01': 'y' }],
        ios: [{ '2024-01': 'y' }],
        android: [{ '4.2101.0': 'y' }],
      },
      yahoo: {
        'desktop-webmail': [{ '2024-01': 'y' }],
      },
    },
    notes:
      'Microsoft Outlook on Windows (Word rendering engine) does not support hsl() color values. Colors will not render, potentially showing as transparent or default.',
    notes_by_num: null,
  },
  {
    slug: 'css-hsla',
    title: 'hsla()',
    description:
      'HSL functional notation with alpha-channel transparency value (`hsla()`)',
    url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl',
    category: 'css',
    tags: [],
    keywords: 'hsl,hsla,color,alpha',
    last_test_date: '2026-02-06',
    test_url: 'https://github.com/tlow92/react-email-hsl-colors',
    test_results_url: null,
    stats: {
      'apple-mail': {
        macos: [{ '16': 'y' }],
        ios: [{ '16': 'y' }],
      },
      gmail: {
        'desktop-webmail': [{ '2024-01': 'y' }],
        ios: [{ '2024-01': 'y' }],
        android: [{ '2024-01': 'y' }],
      },
      outlook: {
        windows: [
          { '2007': 'n' },
          { '2010': 'n' },
          { '2013': 'n' },
          { '2016': 'n' },
          { '2019': 'n' },
        ],
        'windows-mail': [{ '2024-01': 'n' }],
        macos: [{ '16.80': 'y' }],
        'outlook-com': [{ '2024-01': 'y' }],
        ios: [{ '2024-01': 'y' }],
        android: [{ '4.2101.0': 'y' }],
      },
      yahoo: {
        'desktop-webmail': [{ '2024-01': 'y' }],
      },
    },
    notes:
      'Microsoft Outlook on Windows (Word rendering engine) does not support hsla() color values. Colors will not render, potentially showing as transparent or default.',
    notes_by_num: null,
  },
];
