import { checkImages, type ImageCheckingResult } from './check-images';

test('checkImages()', async () => {
  const results: ImageCheckingResult[] = [];
  const html = `<div>
  <img src="https://resend.com/static/brand/resend-icon-white.png" />,
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
  expect(results).toEqual([
    {
      source: 'https://resend.com/static/brand/resend-icon-white.png',
      codeLocation: {
        line: 2,
        column: 3,
      },
      checks: [
        {
          passed: false,
          type: 'accessibility',
          metadata: {
            alt: undefined,
          },
        },
        {
          passed: true,
          type: 'syntax',
        },
        {
          passed: true,
          type: 'security',
        },
        {
          passed: true,
          type: 'fetch_attempt',
          metadata: {
            fetchStatusCode: 200,
          },
        },
        {
          passed: true,
          type: 'image_size',
          metadata: {
            byteCount: 23_138,
          },
        },
      ],
      status: 'warning',
    },
    {
      codeLocation: {
        line: 3,
        column: 3,
      },
      checks: [
        {
          metadata: {
            alt: 'codepen challenges',
          },
          passed: true,
          type: 'accessibility',
        },
        {
          passed: true,
          type: 'syntax',
        },
        {
          passed: true,
          type: 'security',
        },
        {
          metadata: {
            fetchStatusCode: 200,
          },
          passed: true,
          type: 'fetch_attempt',
        },
        {
          metadata: {
            byteCount: 111_922,
          },
          passed: true,
          type: 'image_size',
        },
      ],
      source: '/static/codepen-challengers.png',
      status: 'success',
    },
  ] satisfies ImageCheckingResult[]);
});
