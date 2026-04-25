export const legacyRenderExpectationFixture = {
  description:
    'Expected legacy React Email render markers captured before PDF serialization work.',
  renderer: 'composeReactEmail',
  requiredHtmlFragments: [
    'Donation Receipt',
    '{{ donor.full_name }}',
    'Thank you,',
    'for your gift.',
  ],
  sourceFixture: 'legacy-donation-receipt-editor-json',
} as const;

export type LegacyRenderExpectationFixture =
  typeof legacyRenderExpectationFixture;
