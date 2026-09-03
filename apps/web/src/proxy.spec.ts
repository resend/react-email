import { NextRequest } from 'next/server';
import { proxy } from './proxy';

describe('proxy', () => {
  it('passes HTML requests through untouched', () => {
    const response = proxy(
      new NextRequest('https://react.email/components/headers', {
        headers: { accept: 'text/html' },
      }),
    );

    expect(response.headers.get('x-middleware-next')).toBe('1');
    expect(response.headers.get('vary')).toBeNull();
  });

  it('serves llms.txt for the homepage when Accept negotiates markdown', () => {
    const response = proxy(
      new NextRequest('https://react.email/', {
        headers: { accept: 'text/markdown' },
      }),
    );

    expect(response.headers.get('x-middleware-rewrite')).toBe(
      'https://react.email/llms.txt',
    );
    expect(response.headers.get('vary')).toBe('Accept');
  });

  it('rewrites negotiated component pages with Vary: Accept', () => {
    const response = proxy(
      new NextRequest('https://react.email/components/headers', {
        headers: { accept: 'text/markdown, text/plain;q=0.9' },
      }),
    );

    expect(response.headers.get('x-middleware-rewrite')).toBe(
      'https://react.email/api/markdown/components/headers',
    );
    expect(response.headers.get('vary')).toBe('Accept');
  });

  it('rewrites explicit .md paths without forcing Vary', () => {
    const response = proxy(
      new NextRequest('https://react.email/components/headers.md'),
    );

    expect(response.headers.get('x-middleware-rewrite')).toBe(
      'https://react.email/api/markdown/components/headers',
    );
    expect(response.headers.get('vary')).toBeNull();
  });

  it('rewrites the components index', () => {
    const response = proxy(
      new NextRequest('https://react.email/components.md'),
    );

    expect(response.headers.get('x-middleware-rewrite')).toBe(
      'https://react.email/api/markdown/components',
    );
  });

  it('passes through paths that have no markdown twin', () => {
    const response = proxy(
      new NextRequest('https://react.email/templates', {
        headers: { accept: 'text/markdown' },
      }),
    );

    expect(response.headers.get('x-middleware-next')).toBe('1');
    expect(response.headers.get('x-middleware-rewrite')).toBeNull();
  });
});
