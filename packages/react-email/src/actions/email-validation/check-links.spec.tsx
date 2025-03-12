import { render } from '@react-email/render';
import { type LinkCheckingResult, checkLinks } from './check-links';

test('checkLinks()', async () => {
  const results: LinkCheckingResult[] = [];
  const stream = await checkLinks(
    await render(
      <div>
        <a href="/">Root</a>
        <a href="https://resend.com">Resend</a>
        <a href="https://notion.so">Notion</a>
        <a href="http://react.email">React Email unsafe</a>
      </div>,
    ),
  );
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (value) {
      results.push(value);
    }
    if (done) {
      break;
    }
  }
  expect(results).toEqual([
    {
      status: 'error',
      checks: [
        {
          type: 'syntax',
          passed: false,
        },
      ],
      intendedFor: '/',
    },
    {
      status: 'success',
      checks: [
        {
          type: 'syntax',
          passed: true,
        },
        {
          type: 'security',
          passed: true,
        },
        {
          type: 'fetch_attempt',
          passed: true,
          metadata: {
            fetchStatusCode: 200,
          },
        },
      ],
      intendedFor: 'https://resend.com',
    },
    {
      status: 'warning',
      checks: [
        {
          type: 'syntax',
          passed: true,
        },
        {
          type: 'security',
          passed: true,
        },
        {
          type: 'fetch_attempt',
          metadata: {
            fetchStatusCode: 301,
          },
          passed: false,
        },
      ],
      intendedFor: 'https://notion.so',
    },
    {
      status: 'warning',
      checks: [
        {
          type: 'syntax',
          passed: true,
        },
        {
          type: 'security',
          passed: false,
        },
        {
          type: 'fetch_attempt',
          metadata: {
            fetchStatusCode: 308,
          },
          passed: false,
        },
      ],
      intendedFor: 'http://react.email',
    },
  ] satisfies LinkCheckingResult[]);
});
