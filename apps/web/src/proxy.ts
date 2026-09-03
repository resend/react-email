import { type NextRequest, NextResponse } from 'next/server';

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

/*
 * Serves markdown to agents, matching resend.com:
 * $ curl https://react.email/components/headers.md
 * $ curl -H "Accept: text/markdown" https://react.email/components/headers
 *
 * Only the header-negotiated response varies on Accept. The proxy runs before
 * the CDN cache, so the HTML variant is never cached for a markdown request.
 */
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
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = target;
  const response = NextResponse.rewrite(url);
  if (!endsWithMd) {
    response.headers.set('Vary', 'Accept');
  }
  return response;
};

export const config = {
  matcher: ['/', '/components', '/components.md', '/components/:slug'],
};
