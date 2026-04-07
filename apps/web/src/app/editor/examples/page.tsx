import type { Metadata } from 'next';
import Link from 'next/link';
import { Heading } from '@/components/heading';
import { PageTransition } from '@/components/page-transition';
import { PageWrapper } from '@/components/page-wrapper';
import { sections } from './_components/examples-registry';

export const metadata: Metadata = {
  title: 'Editor Examples',
  description:
    'Interactive examples showing how to build email editors with @react-email/editor.',
  alternates: {
    canonical: '/editor/examples',
  },
};

const sectionStyles: Record<string, string> = {
  'One-Line Editor': 'bg-cyan-3 text-cyan-11',
  'Getting Started': 'bg-green-3 text-green-11',
  Intermediate: 'bg-amber-3 text-amber-11',
  Advanced: 'bg-purple-3 text-purple-11',
};

export default function EditorExamplesPage() {
  return (
    <PageWrapper>
      <PageTransition className="pb-10" key="editor-examples" tag="main">
        <div className="flex w-full flex-col gap-2 px-6 pt-16 pb-10 md:px-8">
          <Heading size="6" weight="medium" className="text-slate-12">
            Editor Examples
          </Heading>
          <p>
            Interactive examples showing how to build email editors with
            @react-email/editor.
          </p>
        </div>

        <div className="flex flex-col gap-12 px-6 pb-10 md:px-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-medium text-slate-12 mb-4">
                {section.title}
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {section.examples.map((example) => (
                  <Link
                    key={example.slug}
                    href={`/editor/examples/${example.slug}`}
                    className="group relative flex flex-col gap-3 rounded-lg border border-slate-4 p-5 transition-colors hover:border-slate-6 focus:outline-hidden focus:ring-3 focus:ring-slate-3"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-slate-12">
                        {example.title}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[0.6875rem] leading-tight ${sectionStyles[section.title] ?? 'bg-slate-3 text-slate-11'}`}
                      >
                        {section.title}
                      </span>
                    </div>
                    <p className="text-sm text-slate-11">
                      {example.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PageTransition>
    </PageWrapper>
  );
}
