import classNames from 'classnames';
import Link from 'next/link';
import type * as React from 'react';
import { Logo } from './logo';
import { Menu } from './menu';

async function getRepoStarCount() {
  const res = await fetch('https://api.github.com/repos/resend/react-email', {
    next: { revalidate: 3600, tags: ['github-repo-stars'] },
  });
  const data = await res.json();
  const starCount = data.stargazers_count as number;
  if (starCount > 999) {
    return `${(starCount / 1000).toFixed(1)}K`;
  }
  return `${starCount}`;
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
      <Menu starCount={starCount} />
    </header>
  );
}
