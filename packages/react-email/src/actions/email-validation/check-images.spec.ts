import { type ImageCheckingResult, checkImages } from './check-images';

test('checkImages()', async () => {
  expect(
    await checkImages(
      `<img src="https://resend.com/static/brand/resend-icon-white.png" />`,
    ),
  ).toEqual([
    {
      source: 'https://resend.com/static/brand/resend-icon-white.png',
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
          type: 'fetch_attempt',
          metadata: {
            imageSize: 23138,
            fetchStatusCode: 200,
          },
        },
        {
          passed: true,
          type: 'security',
        },
        {
          passed: true,
          type: 'syntax',
        },
      ],
      status: 'warning',
    },
  ] satisfies ImageCheckingResult[]);
});
