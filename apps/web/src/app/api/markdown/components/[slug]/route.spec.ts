import { GET } from './route';

describe('GET /api/markdown/components/[slug]', () => {
  it('serves a known category as markdown with a day of cache', async () => {
    const response = await GET(new Request('https://react.email'), {
      params: Promise.resolve({ slug: 'headers' }),
    });
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe(
      'text/markdown; charset=utf-8',
    );
    expect(response.headers.get('cache-control')).toBe(
      'public, max-age=86400, s-maxage=86400',
    );
    expect(body).toContain('# Headers');
    expect(body).toContain('## Header with centered menu');
    expect(body).toContain('```tsx');
  });

  it('answers an unknown category with a short-lived 404 that names the index', async () => {
    const response = await GET(new Request('https://react.email'), {
      params: Promise.resolve({ slug: 'nope' }),
    });

    expect(response.status).toBe(404);
    expect(response.headers.get('cache-control')).toBe(
      'public, max-age=60, s-maxage=60',
    );
    expect(await response.text()).toContain(
      'https://react.email/components.md',
    );
  });
});
