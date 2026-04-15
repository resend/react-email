import Link from 'next/link';
import { Heading } from '@/components/heading';
import { IconArrowLeft } from '@/components/icons/icon-arrow-left';
import { PageTransition } from '@/components/page-transition';
import { PageWrapper } from '@/components/page-wrapper';
import { SmartLink } from '@/components/smart-link';

interface ExamplePageShellProps {
  slug: string;
  title: string;
  docsUrl?: string;
  children: React.ReactNode;
}

export function ExamplePageShell({
  slug,
  title,
  docsUrl,
  children,
}: ExamplePageShellProps) {
  return (
    <PageWrapper>
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
              <SmartLink
                className="ml-auto text-sm text-slate-11 transition-colors hover:text-slate-12"
                href={docsUrl}
              >
                Docs
              </SmartLink>
            )}
          </div>
          <Heading size="6" weight="medium" className="text-slate-12">
            {title}
          </Heading>
        </div>
        <div className="px-6 pb-10 md:px-8">{children}</div>
      </PageTransition>
    </PageWrapper>
  );
}
