import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Heading } from '@/components/heading';
import { IconArrowLeft } from '@/components/icons/icon-arrow-left';
import { PageTransition } from '@/components/page-transition';
import { PageWrapper } from '@/components/page-wrapper';
import { EditorThemeProvider } from '../_components/editor-theme-provider';
import { ExampleLoader } from '../_components/example-loader';
import { allExamples } from '../_components/examples-registry';

interface ExamplePageParams {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = async () => {
  return allExamples.map((example) => ({ slug: example.slug }));
};

export const generateMetadata = async ({
  params,
}: ExamplePageParams): Promise<Metadata> => {
  const { slug } = await params;
  const example = allExamples.find((e) => e.slug === slug);

  if (!example) {
    return { title: 'Example Not Found' };
  }

  return {
    title: `${example.title} — Editor Examples`,
    description: example.description,
    alternates: {
      canonical: `/editor/examples/${slug}`,
    },
  };
};

export default async function ExamplePage({ params }: ExamplePageParams) {
  const { slug } = await params;
  const example = allExamples.find((e) => e.slug === slug);

  if (!example) {
    notFound();
  }

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
            {example.docsUrl && (
              <Link
                className="ml-auto text-sm text-slate-11 transition-colors hover:text-slate-12"
                href={example.docsUrl}
                target="_blank"
              >
                Docs
              </Link>
            )}
          </div>
          <Heading size="6" weight="medium" className="text-slate-12">
            {example.title}
          </Heading>
        </div>
        <div className="px-6 pb-10 md:px-8">
          <EditorThemeProvider>
            <ExampleLoader slug={slug} />
          </EditorThemeProvider>
        </div>
      </PageTransition>
    </PageWrapper>
  );
}
