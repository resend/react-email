import { render } from '@react-email/render';
import * as React from 'react';
import { type ImageCheckingResult, checkImages } from './check-images';

test('checkImages()', async () => {
  expect(
    await checkImages(
      await render(
        <div>
          {/* biome-ignore lint/a11y/useAltText: This is intentional to test the checking for accessibility */}
          <img src="https://resend.com/static/brand/resend-icon-white.png" />,
        </div>,
      ),
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
            byteCount: 23138,
          },
        },
      ],
      status: 'warning',
    },
  ] satisfies ImageCheckingResult[]);
});
