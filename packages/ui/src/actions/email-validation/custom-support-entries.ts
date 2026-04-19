import type { SupportEntry } from './check-compatibility';

/**
 * Manually curated compatibility entries that aren't covered by caniemail's
 * dataset. These get merged with `supportEntries` at runtime, so regenerating
 * `caniemail-data.ts` via `pnpm caniemail:fetch` won't wipe them.
 */
export const customSupportEntries: SupportEntry[] = [
  // https://github.com/resend/react-email/issues/2947
  // Outlook (Windows versions using Word's MS rendering engine) silently
  // strips `hsl()`/`hsla()` color functions. Caniemail.com doesn't ship an
  // entry for this, so we curate one here so the checker can flag it.
  {
    slug: 'css-hsl-hsla',
    title: 'hsl(), hsla()',
    description:
      'HSL and HSLA color functions. Outlook on Windows silently drops these declarations, so hex or rgb() is safer for broad email client support.',
    url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl',
    category: 'css',
    tags: [],
    keywords: 'color,hsl,hsla',
    last_test_date: '2026-04-19',
    test_url:
      'https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl',
    test_results_url: null,
    stats: {
      outlook: {
        windows: [
          { '2007': 'n' },
          { '2010': 'n' },
          { '2013': 'n' },
          { '2016': 'n' },
          { '2019': 'n' },
        ],
      },
    },
    notes: null,
    notes_by_num: null,
  },
];
