import { checkLinks, type LinkCheckingResult } from './check-links';

test('checkLinks()', async () => {
  const results: LinkCheckingResult[] = [];
  const html = `<div>
  <a href="/">Root</a>
  <a href="https://resend.com">Resend</a>
  <a href="https://notion.so">Notion</a>
  <a href="http://react.email">React Email unsafe</a>
</div>`;
  const stream = await checkLinks(html);
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
      codeLocation: {
        line: 2,
        column: 3,
      },
      checks: [
        {
          type: 'syntax',
          passed: false,
        },
      ],
      link: '/',
    },
    {
      status: 'success',
      codeLocation: {
        line: 3,
        column: 3,
      },
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
      link: 'https://resend.com',
    },
    {
      status: 'warning',
      codeLocation: {
        line: 4,
        column: 3,
      },
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
      link: 'https://notion.so',
    },
    {
      status: 'warning',
      codeLocation: {
        line: 5,
        column: 3,
      },
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
      link: 'http://react.email',
    },
  ] satisfies LinkCheckingResult[]);
});
