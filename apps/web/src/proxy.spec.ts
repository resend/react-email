import { NextRequest } from 'next/server';
import { proxy } from './proxy';

const browserAccept =
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8';

const upstream = (body: string, status = 200) =>
  new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

describe('proxy', () => {
  it('passes browser requests through untouched', async () => {
    const response = await proxy(
      new NextRequest('https://react.email/components/headers', {
        headers: { accept: browserAccept },
      }),
    );

    expect(response.headers.get('x-middleware-next')).toBe('1');
    expect(response.headers.get('vary')).toBeNull();
  });

  it('serves llms.txt as markdown for the homepage when Accept negotiates markdown', async () => {
    const fetchMock = vi.fn().mockResolvedValue(upstream('# React Email'));
    global.fetch = fetchMock;

    const response = await proxy(
      new NextRequest('https://react.email/', {
        headers: { accept: 'text/markdown' },
      }),
    );

    expect(String(fetchMock.mock.calls[0][0])).toBe(
      'https://react.email/llms.txt',
    );
    expect(response.headers.get('content-type')).toBe(
      'text/markdown; charset=utf-8',
    );
    expect(response.headers.get('vary')).toBe('Accept');
    expect(response.headers.get('cache-control')).toBe(
      'public, max-age=86400, s-maxage=86400',
    );
    expect(await response.text()).toBe('# React Email');
  });

  it('serves negotiated component pages as markdown with Vary: Accept', async () => {
    const fetchMock = vi.fn().mockResolvedValue(upstream('# Headers'));
    global.fetch = fetchMock;

    const response = await proxy(
      new NextRequest('https://react.email/components/headers', {
        headers: { accept: 'text/markdown, text/plain;q=0.9' },
      }),
    );

    expect(String(fetchMock.mock.calls[0][0])).toBe(
      'https://react.email/api/markdown/components/headers',
    );
    expect(response.headers.get('content-type')).toBe(
      'text/markdown; charset=utf-8',
    );
    expect(response.headers.get('vary')).toBe('Accept');
    expect(await response.text()).toBe('# Headers');
  });

  it('serves the negotiated templates page as markdown', async () => {
    const fetchMock = vi.fn().mockResolvedValue(upstream('# Templates'));
    global.fetch = fetchMock;

    const response = await proxy(
      new NextRequest('https://react.email/templates', {
        headers: { accept: 'text/markdown' },
      }),
    );

    expect(String(fetchMock.mock.calls[0][0])).toBe(
      'https://react.email/api/markdown/templates',
    );
    expect(response.headers.get('vary')).toBe('Accept');
  });

  it('falls back to the page when the markdown twin is not ok', async () => {
    global.fetch = vi.fn().mockResolvedValue(upstream('missing', 404));

    const response = await proxy(
      new NextRequest('https://react.email/components/nope', {
        headers: { accept: 'text/markdown' },
      }),
    );

    expect(response.headers.get('x-middleware-next')).toBe('1');
  });

  it('rewrites explicit .md paths without fetching or forcing Vary', async () => {
    const fetchMock = vi.fn();
    global.fetch = fetchMock;

    const response = await proxy(
      new NextRequest('https://react.email/components/headers.md'),
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(response.headers.get('x-middleware-rewrite')).toBe(
      'https://react.email/api/markdown/components/headers',
    );
    expect(response.headers.get('vary')).toBeNull();
  });

  it('rewrites the components and templates indexes', async () => {
    const components = await proxy(
      new NextRequest('https://react.email/components.md'),
    );
    const templates = await proxy(
      new NextRequest('https://react.email/templates.md'),
    );

    expect(components.headers.get('x-middleware-rewrite')).toBe(
      'https://react.email/api/markdown/components',
    );
    expect(templates.headers.get('x-middleware-rewrite')).toBe(
      'https://react.email/api/markdown/templates',
    );
  });

  it('passes through negotiated paths that have no markdown twin', async () => {
    const response = await proxy(
      new NextRequest('https://react.email/editor', {
        headers: { accept: 'text/markdown' },
      }),
    );

    expect(response.headers.get('x-middleware-next')).toBe('1');
    expect(response.headers.get('x-middleware-rewrite')).toBeNull();
  });

  it('answers an explicit .md path with no twin with a plain 404', async () => {
    const response = await proxy(
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
