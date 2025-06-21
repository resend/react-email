import { render } from '@react-email/components';
import { vi } from 'vitest';
import { checkSpam } from './check-spam';
import { StripeWelcomeEmail } from './testing/stripe-welcome-email';

const mockChecks = [
  { description: 'Test rule 1', name: 'TEST_RULE_1', points: 2.5 },
  { description: 'Test rule 2', name: 'TEST_RULE_2', points: 3.0 },
];

// Mock the parser to return a stable result, making the test more robust.
vi.mock('../../../utils/spam-assassin/parse-pointing-table-rows', () => ({
  parsePointingTableRows: () => mockChecks,
}));

// Mock sendToSpamd just to prevent it from trying to make a real network connection.
// The actual return value doesn't matter because we mocked the parser.
vi.mock('../../../utils/spam-assassin/send-to-spamd', () => ({
  sendToSpamd: async () => 'mocked response',
}));

describe('checkSpam()', { timeout: 10_000 }, () => {
  test('with most spammy email', async () => {
    const template = (
      <html lang="en">
        <body>
          This email is spam. We sell rolexss for cheap. Get your viagra. We
          also sell weight loss pills today. Money back guaranteed. sEnd me $500
          and I'll send you back $700. don't tell anyone. Send this email to ten
          friends
        </body>
      </html>
    );
    const html = await render(template);
    // const plainText = await render(template, { plainText: true });
    const plainText = 'Completely different content from the original';

    expect(await checkSpam(html, plainText)).toMatchSnapshot();
  });

  test('with stripe email template using true base url', async () => {
    const html = await render(<StripeWelcomeEmail />);
    const plainText = await render(<StripeWelcomeEmail />, {
      plainText: true,
    });

    expect(await checkSpam(html, plainText)).toMatchSnapshot();
  });
});
