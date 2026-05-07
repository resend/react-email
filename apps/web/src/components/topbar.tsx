import classNames from 'classnames';
import Link from 'next/link';
import type * as React from 'react';
import { Logo } from './logo';
import { Menu } from './menu';

async function getRepoStarCount() {
  try {
    const res = await fetch('https://api.github.com/repos/resend/react-email', {
      next: { revalidate: 3600, tags: ['github-repo-stars'] },
    });

    // Avoid caching transient GitHub failures as valid fallback data
    if (!res.ok) return null;

    const data = await res.json();
    const starCount = data.stargazers_count as number;

    // Guard against undefined/NaN if API response shape changes
    if (typeof starCount !== 'number' || Number.isNaN(starCount)) {
      return null;
    }

    if (starCount > 999) return `${(starCount / 1000).toFixed(1)}K`;

    return `${starCount}`;
  } catch {
    // Network failure or JSON  parse error — fail silently
    return null;
  }
}

export async function Topbar({
  className,
  ...props
}: Omit<React.ComponentProps<'header'>, 'children'>) {
  const starCount = await getRepoStarCount();

  return (
    <header
      className={classNames(
        'relative z-50 flex items-center justify-between py-8 px-6 md:px-8',
        className,
      )}
      {...props}
    >
      <Link
        className="-ml-1.5 flex scroll-m-2 rounded-md pr-[.375rem] transition-colors focus:outline-hidden focus-visible:ring-3 focus-visible:ring-slate-4"
        href="/"
      >
        <Logo />
        <span className="sr-only">Home</span>
      </Link>
      <Menu starCount={starCount ?? '—'} />
    </header>
  );
}
