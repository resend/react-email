import Link from 'next/link';
import { Heading } from '@/components/heading';
import { IconArrowLeft } from '@/components/icons/icon-arrow-left';
import { PageTransition } from '@/components/page-transition';
import { PageWrapper } from '@/components/page-wrapper';
import { ExampleTabbedContent } from './example-tabbed-content';

interface ExamplePageShellProps {
  slug: string;
  title: string;
  docsUrl?: string;
  sourceCode?: string;
  githubUrl?: string;
  children: React.ReactNode;
}

export function ExamplePageShell({
  slug,
  title,
  docsUrl,
  sourceCode,
  githubUrl,
  children,
}: ExamplePageShellProps) {
  const hasTabs = sourceCode && githubUrl;
  const titleParts = title.split(' — ');
  const pageHeading = titleParts[0];
  const tabTitle =
    titleParts.length > 1 ? titleParts.slice(1).join(' — ') : undefined;

  return (
    <PageWrapper>
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <div className="hidden h-full w-full max-w-7xl grid-cols-2 gap-4 px-4 lg:grid">
          <div className="border-r-slate-3 border-l border-l-slate-4" />
          <div className="border-r border-r-slate-4" />
        </div>
      </div>
      <PageTransition className="pb-10" key={slug} tag="main">
        <div className="flex w-full flex-col gap-4 px-6 pt-16 pb-10 md:px-8">
          <div className="flex items-center gap-4">
            <Link
              className="-ml-2 flex scroll-m-2 items-center justify-center gap-2 self-start rounded-md px-2 py-1 text-slate-11 transition-colors duration-200 ease-in-out hover:text-slate-12 focus:bg-slate-6 focus:outline-hidden focus:ring-3 focus:ring-slate-3"
              href="/editor/examples"
            >
              <IconArrowLeft className="mt-[.0625rem]" size={14} />
              <span>Back</span>
            </Link>
            {docsUrl && (
              <Link
                className="ml-auto text-sm text-slate-11 transition-colors hover:text-slate-12"
                href={docsUrl}
                target="_blank"
              >
                Docs
              </Link>
            )}
          </div>
          <Heading size="6" weight="medium" className="text-slate-12">
            {pageHeading}
          </Heading>
        </div>
        {hasTabs ? (
          <div className="relative flex w-full flex-col gap-4 border-slate-4 border-y pt-3">
            <ExampleTabbedContent
              title={tabTitle}
              sourceCode={sourceCode}
              githubUrl={githubUrl}
            >
              {children}
            </ExampleTabbedContent>
          </div>
        ) : (
          <div className="px-6 pb-10 md:px-8">{children}</div>
        )}
      </PageTransition>
    </PageWrapper>
  );
}
