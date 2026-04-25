import { describe, expect, it } from 'vitest';
import { legacyRenderExpectationFixture } from './fixtures/legacy-render-expectations';

describe('legacy render fixture expectations', () => {
  it('records deterministic legacy renderer markers for Phase 4', () => {
    expect(legacyRenderExpectationFixture).toEqual({
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
    });
  });
});
