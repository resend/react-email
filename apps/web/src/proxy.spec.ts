import { NextRequest } from 'next/server';
import { proxy } from './proxy';

const browserAccept =
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8';

describe('proxy', () => {
  it('passes browser requests through untouched', () => {
    const response = proxy(
      new NextRequest('https://react.email/components/headers', {
        headers: { accept: browserAccept },
      }),
    );

    expect(response.headers.get('x-middleware-next')).toBe('1');
    expect(response.headers.get('vary')).toBeNull();
  });

  it('serves llms.txt as markdown for the homepage when Accept negotiates markdown', () => {
    const response = proxy(
      new NextRequest('https://react.email/', {
        headers: { accept: 'text/markdown' },
      }),
    );

    expect(response.headers.get('x-middleware-rewrite')).toBe(
      'https://react.email/llms.txt',
    );
    expect(response.headers.get('content-type')).toBe(
      'text/markdown; charset=utf-8',
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

  it('rewrites the templates page', () => {
    const response = proxy(
      new NextRequest('https://react.email/templates', {
        headers: { accept: 'text/markdown' },
      }),
    );

    expect(response.headers.get('x-middleware-rewrite')).toBe(
      'https://react.email/api/markdown/templates',
    );
    expect(response.headers.get('vary')).toBe('Accept');
  });

  it('passes through negotiated paths that have no markdown twin', () => {
    const response = proxy(
      new NextRequest('https://react.email/editor', {
        headers: { accept: 'text/markdown' },
      }),
    );

    expect(response.headers.get('x-middleware-next')).toBe('1');
    expect(response.headers.get('x-middleware-rewrite')).toBeNull();
  });

  it('answers an explicit .md path with no twin with a plain 404', async () => {
    const response = proxy(
      new NextRequest('https://react.email/components/foo.bar.md'),
    );

    expect(response.status).toBe(404);
    expect(response.headers.get('content-type')).toBe(
      'text/plain; charset=utf-8',
    );
    expect(await response.text()).toContain(
      'https://react.email/components.md',
    );
  });
});
