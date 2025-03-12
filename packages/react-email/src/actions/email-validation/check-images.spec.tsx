import { render } from '@react-email/render';
import { type ImageCheckingResult, checkImages } from './check-images';

test('checkImages()', async () => {
  const results: ImageCheckingResult[] = [];
  const stream = await checkImages(
    await render(
      <div>
        {/* biome-ignore lint/a11y/useAltText: This is intentional to test the checking for accessibility */}
        <img src="https://resend.com/static/brand/resend-icon-white.png" />,
        <img src="/static/codepen-challengers.png" alt="codepen challenges" />,
      </div>,
    ),
    'https://demo.react.email',
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
      intendedFor: 'https://resend.com/static/brand/resend-icon-white.png',
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
      intendedFor: '/static/codepen-challengers.png',
      status: 'success',
    },
  ] satisfies ImageCheckingResult[]);
});
