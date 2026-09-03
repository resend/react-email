import { type NextRequest, NextResponse } from 'next/server';

const MARKDOWN_TYPE = 'text/markdown; charset=utf-8';

const markdownPathFor = (pathname: string): string | null => {
  if (pathname === '/') {
    return '/llms.txt';
  }
  if (pathname === '/components') {
    return '/api/markdown/components';
  }
  const category = pathname.match(/^\/components\/([\w-]+)$/);
  if (category) {
    return `/api/markdown/components/${category[1]}`;
  }
  return null;
};

export const proxy = (request: NextRequest) => {
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
        'Not found. Markdown is available for the components pages, see https://react.email/components.md',
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
  const response = NextResponse.rewrite(url);
  if (target === '/llms.txt') {
    response.headers.set('Content-Type', MARKDOWN_TYPE);
  }
  // Vercel's CDN keys on Accept and runs the proxy before the cache, so Vary: Accept is only for downstream caches.
  if (!endsWithMd) {
    response.headers.set('Vary', 'Accept');
  }
  return response;
};

export const config = {
  matcher: ['/', '/components', '/components.md', '/components/:slug'],
};
