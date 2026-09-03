import { GET } from './route';

describe('GET /api/markdown/components/[slug]', () => {
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
