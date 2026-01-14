import type { IncomingMessage } from 'node:http';
import { Readable } from 'node:stream';
import { checkImages, type ImageCheckingResult } from './check-images';

vi.mock('./quick-fetch', () => ({
  quickFetch: vi.fn((url: URL) => {
    const mockResponses: Record<string, Partial<IncomingMessage>> = {
      'https://cdn.resend.com/brand/resend-icon-black.png': {
        statusCode: 200,
        async *[Symbol.asyncIterator]() {
          yield Buffer.alloc(24534);
        },
      },
      'https://demo.react.email/static/codepen-challengers.png': {
        statusCode: 200,
        async *[Symbol.asyncIterator]() {
          yield Buffer.alloc(111922);
        },
      },
    };

    const response = mockResponses[url.href];
    if (!response) {
      return Promise.reject(new Error(`Unexpected URL: ${url.href}`));
    }

    return Promise.resolve(response);
  }),
}));

test('checkImages()', async () => {
  const results: ImageCheckingResult[] = [];
  const html = `<div>
  <img src="https://cdn.resend.com/brand/resend-icon-black.png" />,
  <img src="/static/codepen-challengers.png" alt="codepen challenges" />,
</div>`;
  const stream = await checkImages(html, 'https://demo.react.email');
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
            "metadata": {
              "alt": undefined,
            },
            "passed": false,
            "type": "accessibility",
          },
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
          {
            "metadata": {
              "byteCount": 24534,
            },
            "passed": true,
            "type": "image_size",
          },
        ],
        "codeLocation": {
          "column": 3,
          "line": 2,
        },
        "source": "https://cdn.resend.com/brand/resend-icon-black.png",
        "status": "warning",
      },
      {
        "checks": [
          {
            "metadata": {
              "alt": "codepen challenges",
            },
            "passed": true,
            "type": "accessibility",
          },
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
          {
            "metadata": {
              "byteCount": 111922,
            },
            "passed": true,
            "type": "image_size",
          },
        ],
        "codeLocation": {
          "column": 3,
          "line": 3,
        },
        "source": "/static/codepen-challengers.png",
        "status": "success",
      },
    ]
  `);
});
