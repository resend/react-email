import { vi } from 'vitest';
import { checkLinks, type LinkCheckingResult } from './check-links';

vi.mock('./quick-fetch', () => ({
  quickFetch: vi.fn((url: URL) => {
    const mockResponses: Record<string, { statusCode: number }> = {
      'https://resend.com/': { statusCode: 200 },
      'https://notion.so/': { statusCode: 301 },
      'http://react.email/': { statusCode: 308 },
    };

    const response = mockResponses[url.href];
    if (!response) {
      return Promise.reject(new Error(`Unexpected URL: ${url.href}`));
    }

    return Promise.resolve({
      statusCode: response.statusCode,
      resume: () => { },
    });
  }),
}));

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
  expect(results).toMatchInlineSnapshot(`
    [
      {
        "checks": [
          {
            "passed": false,
            "type": "syntax",
          },
        ],
        "codeLocation": {
          "column": 3,
          "line": 2,
        },
        "link": "/",
        "status": "error",
      },
      {
        "checks": [
          {
            "passed": true,
            "type": "syntax",
          },
          {
            "passed": true,
            "type": "security",
          },
          {
            "metadata": {
              "fetchStatusCode": 200,
            },
            "passed": true,
            "type": "fetch_attempt",
          },
        ],
        "codeLocation": {
          "column": 3,
          "line": 3,
        },
        "link": "https://resend.com",
        "status": "success",
      },
      {
        "checks": [
          {
            "passed": true,
            "type": "syntax",
          },
          {
            "passed": true,
            "type": "security",
          },
          {
            "metadata": {
              "fetchStatusCode": 301,
            },
            "passed": false,
            "type": "fetch_attempt",
          },
        ],
        "codeLocation": {
          "column": 3,
          "line": 4,
        },
        "link": "https://notion.so",
        "status": "warning",
      },
      {
        "checks": [
          {
            "passed": true,
            "type": "syntax",
          },
          {
            "passed": false,
            "type": "security",
          },
          {
            "metadata": {
              "fetchStatusCode": 308,
            },
            "passed": false,
            "type": "fetch_attempt",
          },
        ],
        "codeLocation": {
          "column": 3,
          "line": 5,
        },
        "link": "http://react.email",
        "status": "warning",
      },
    ]
  `);
});
