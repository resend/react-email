import { render } from '@react-email/render';
import * as React from 'react';
import { type LinkCheckingResult, checkLinks } from './check-links';

test('checkLinks()', async () => {
  expect(
    await checkLinks(
      await render(
        <div>
          <a href="/">Root</a>
          <a href="https://resend.com">Resend</a>
          <a href="https://notion.so">Notion</a>
          <a href="http://example.com">Example unsafe</a>
        </div>,
      ),
    ),
  ).toEqual([
    {
      status: 'error',
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
            fetchStatusCode: 200,
          },
          passed: true,
        },
      ],
      link: 'http://example.com',
    },
  ] satisfies LinkCheckingResult[]);
});
