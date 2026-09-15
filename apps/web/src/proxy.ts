import { type NextRequest, NextResponse } from 'next/server';

const MARKDOWN_TYPE = 'text/markdown; charset=utf-8';

const markdownPathFor = (pathname: string): string | null => {
  if (pathname === '/') {
    return '/llms.txt';
  }
  if (pathname === '/components') {
    return '/api/markdown/components';
  }
  if (pathname === '/templates') {
    return '/api/markdown/templates';
  }
  const category = pathname.match(/^\/components\/([\w-]+)$/);
  if (category) {
    return `/api/markdown/components/${category[1]}`;
  }
  return null;
};

export const proxy = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const endsWithMd = pathname.endsWith('.md');
  const accept = (request.headers.get('accept') ?? '').toLowerCase();

  if (!endsWithMd && !accept.includes('text/markdown')) {
    return NextResponse.next();
  }

  const target = markdownPathFor(
    endsWithMd ? pathname.slice(0, -'.md'.length) : pathname,
  );
  if (!target) {
    if (endsWithMd) {
      return new NextResponse(
        'Not found. Markdown is available at https://react.email/components.md and https://react.email/templates.md',
        {
          status: 404,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        },
      );
    }
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = target;
  if (endsWithMd) {
    return NextResponse.rewrite(url);
  }

  // Vercel's edge drops headers set on a rewrite, so negotiated responses are fetched and rebuilt to carry Content-Type and Vary.
  const upstream = await fetch(url);
  if (!upstream.ok) {
    return NextResponse.next();
  }
  const headers: Record<string, string> = {
    'Content-Type': MARKDOWN_TYPE,
    Vary: 'Accept',
  };
  const cacheControl = upstream.headers.get('cache-control');
  if (cacheControl) {
    headers['Cache-Control'] = cacheControl;
  }
  return new NextResponse(await upstream.text(), { headers });
};

export const config = {
  matcher: [
    '/',
    '/components',
    '/components.md',
    '/components/:slug',
    '/templates',
    '/templates.md',
  ],
};
