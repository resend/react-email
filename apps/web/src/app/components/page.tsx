import classNames from 'classnames';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Heading } from '@/components/heading';
import { PageWrapper } from '@/components/page-wrapper';
import { componentsStructure } from '../../../components/structure';
import { PageTransition } from '../../components/page-transition';
import { Spotlight } from '../../components/spotlight';
import { slugify } from '../../utils/slugify';

export const metadata: Metadata = {
  title: 'Components - React Email',
  description:
    'Build beautiful emails with pre-built components that you can copy-and-paste into your app.',
  openGraph: {
    images: [{ url: 'https://react.email/static/covers/patterns.png' }],
  },
  alternates: {
    canonical: '/components',
  },
};

export default async function ComponentsPage() {
  return (
    <PageWrapper>
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <div className="hidden h-full w-full max-w-7xl grid-cols-2 gap-4 px-4 lg:grid">
          <div className="border-r-slate-3 border-l border-l-slate-4" />
          <div className="border-r border-r-slate-4" />
        </div>
      </div>
      <PageTransition className="pb-10" key="about" tag="main">
        <div className="flex w-full flex-col gap-2 px-6 pt-16 pb-10 md:px-8">
          <Heading size="6" weight="medium" className="text-slate-12">
            Components
          </Heading>
          <p>
            Build beautiful emails with pre-built components that you can
            copy-and-paste into your app.
          </p>
        </div>
        <div className="relative grid grid-cols-1 gap-x-4 px-1 pb-10 md:grid-cols-2 md:px-0 lg:grid-cols-3">
          <div className="-translate-x-1/2 absolute top-0 left-1/2 h-px w-[100dvw] border-slate-4 border-t" />
          <div className="-translate-x-1/2 absolute bottom-0 left-1/2 h-px w-[100dvw] border-slate-4 border-b" />
          {componentsStructure.map((category, index) => {
            const slug = slugify(category.name);
            const Illustration = dynamic(
              () =>
                import(
                  `@/illustrations/${category.name
                    .toLowerCase()
                    .replace(/ /g, '-')}`
                ),
            );

            return (
              <Link
                className={classNames(
                  'group relative isolate mt-7 cursor-pointer scroll-m-6 rounded-md focus:outline-none focus:ring focus:ring-slate-2 md:before:absolute md:before:inset-0 md:before:rounded-md md:before:border md:before:border-slate-4 md:before:border-dashed md:before:transition-colors md:before:duration-[720ms] md:before:ease-[cubic-bezier(.24,.9,.32,1.4)] md:focus:before:border-slate-6 md:hover:before:border-slate-6',
                  {
                    'lg:ml-6': index % 3 === 0,
                    'lg:mx-3': index % 3 === 1,
                    'lg:mr-6': index % 3 === 2,
                  },
                )}
                href={`/components/${slug}`}
                key={category.name}
                tabIndex={0}
              >
                <Spotlight
                  className={classNames(
                    'relative isolate flex cursor-pointer flex-col justify-end rounded-md bg-black p-4 group-focus:ring group-focus:ring-slate-2 md:transition-transform md:duration-[240ms] md:ease-[cubic-bezier(.36,.66,.6,1)]',
                    {
                      'md:group-hover:-translate-x-2 md:group-hover:-translate-y-2 md:group-focus:-translate-x-2 md:group-focus:-translate-y-2':
                        index % 3 === 0,
                      'md:group-hover:-translate-y-2 md:group-focus:-translate-y-2':
                        index % 3 === 1,
                      'md:group-hover:-translate-y-2 md:group-focus:-translate-y-2 md:group-focus:translate-x-2 md:group-hover:translate-x-2':
                        index % 3 === 2,
                    },
                  )}
                >
                  <div className="pointer-events-none absolute inset-0 rounded-md border border-slate-4 transition-colors duration-300 ease-[cubic-bezier(.36,.66,.6,1)] group-hover:border-slate-6 group-focus:border-slate-6" />
                  <div className="relative flex aspect-[2/1] items-center justify-center overflow-hidden rounded-sm text-slate-300">
                    <div className="absolute inset-0 bg-[radial-gradient(#27272A_.0313rem,transparent_.0313rem),_radial-gradient(#27272A_.0313rem,transparent_.0313rem)] bg-transparent opacity-80 [background-position:0_0,.625rem_.625rem] [background-size:1.25rem_1.25rem]" />
                    <Illustration />
                  </div>
                  <h3 className="relative z-[2] mt-4 font-medium text-slate-12 capitalize leading-7 -tracking-wide">
                    {category.name}
                  </h3>
                  <span className="relative z-[2] text-slate-11 text-xs">
                    {category.components.length} component
                    {category.components.length > 1 && 's'}
                  </span>
                </Spotlight>
              </Link>
            );
          })}
        </div>
      </PageTransition>
    </PageWrapper>
  );
}
