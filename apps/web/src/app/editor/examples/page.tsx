import { Bolt, Cpu, Layers2, Rocket } from 'lucide-react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { createElement } from 'react';

import { Heading } from '@/components/heading';
import { PageTransition } from '@/components/page-transition';
import { PageWrapper } from '@/components/page-wrapper';
import { Spotlight } from '@/components/spotlight';
import {
  type IllustrationProps,
  sectionTitleToTone,
} from '@/illustrations/editor-examples/illustration-shared';
import { editorExampleSections } from './editor-examples-data';

export const metadata: Metadata = {
  title: 'Editor examples',
  description:
    'Interactive examples showing how to build email editors with @react-email/editor.',
  alternates: {
    canonical: '/editor/examples',
  },
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
        <ul className="grid grid-cols-1 gap-4 px-6 pb-10 md:grid-cols-2 md:px-8 lg:grid-cols-3">
          {editorExampleSections.map((section) =>
            section.examples.map((example) => {
              const sectionIcon = {
                'Standalone Editor': Bolt,
                'Getting Started': Rocket,
                Intermediate: Layers2,
                Advanced: Cpu,
              }[section.title];
              const tone = sectionTitleToTone(section.title);
              const illustrationComponent = dynamic<IllustrationProps>(() =>
                import(`@/illustrations/editor-examples/${example.slug}`).catch(
                  () =>
                    import(
                      '@/illustrations/editor-examples/illustration-placeholder'
                    ),
                ),
              );

              return (
                <li key={example.slug}>
                  <Link
                    className="group relative isolate cursor-pointer overflow-hidden rounded-md scroll-m-6 focus:outline-hidden focus:ring-slate-2"
                    href={`/editor/examples/${example.slug}`}
                  >
                    <Spotlight className="relative flex h-full w-full flex-col gap-4 bg-black">
                      <div className="pointer-events-none absolute inset-0 rounded-md border border-slate-4 transition-colors duration-300 ease-[cubic-bezier(.36,.66,.6,1)] group-hover:border-slate-6 group-focus:border-slate-6" />
                      <div
                        className={`relative flex aspect-2/1 items-center justify-center overflow-hidden rounded-xs ${
                          {
                            amber: 'text-amber-11',
                            cyan: 'text-cyan-11',
                            green: 'text-green-11',
                            purple: 'text-purple-11',
                            slate: 'text-slate-11',
                          }[tone]
                        }`}
                      >
                        <div
                          className={`pointer-events-none absolute inset-0 z-0 bg-transparent opacity-80 bg-position-[0_0,.625rem_.625rem] bg-size-[1.25rem_1.25rem] ${
                            {
                              amber:
                                'bg-[radial-gradient(hsl(45_4%_16%)_.0313rem,transparent_.0313rem),radial-gradient(hsl(45_4%_16%)_.0313rem,transparent_.0313rem)]',
                              cyan: 'bg-[radial-gradient(hsl(190_4%_16%)_.0313rem,transparent_.0313rem),radial-gradient(hsl(190_4%_16%)_.0313rem,transparent_.0313rem)]',
                              green:
                                'bg-[radial-gradient(hsl(145_4%_16%)_.0313rem,transparent_.0313rem),radial-gradient(hsl(145_4%_16%)_.0313rem,transparent_.0313rem)]',
                              purple:
                                'bg-[radial-gradient(hsl(275_4%_16%)_.0313rem,transparent_.0313rem),radial-gradient(hsl(275_4%_16%)_.0313rem,transparent_.0313rem)]',
                              slate:
                                'bg-[radial-gradient(hsl(240_4%_16%)_.0313rem,transparent_.0313rem),radial-gradient(hsl(240_4%_16%)_.0313rem,transparent_.0313rem)]',
                            }[tone]
                          }`}
                        />
                        {createElement(illustrationComponent, { tone })}
                      </div>
                      <div className="flex flex-col px-5 pb-5">
                        <span
                          className={`mb-3.5 -ml-0.5 inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-1.5 pr-2.5 text-xs ${
                            {
                              'Standalone Editor': 'bg-cyan-3 text-cyan-11',
                              'Getting Started': 'bg-green-3 text-green-11',
                              Intermediate: 'bg-amber-3 text-amber-11',
                              Advanced: 'bg-purple-3 text-purple-11',
                            }[section.title] ?? 'bg-slate-3 text-slate-11'
                          }`}
                        >
                          {sectionIcon
                            ? createElement(sectionIcon, {
                                'aria-hidden': true,
                                className: 'size-3 shrink-0',
                              })
                            : null}
                          <span className="[text-box:trim-both_cap_alphabetic]">
                            {section.title}
                          </span>
                        </span>
                        <h3 className="mb-[.375rem] font-medium leading-tight text-slate-12">
                          {example.title}
                        </h3>
                        <p className="text-pretty text-[.8125rem] leading-relaxed text-slate-11">
                          {example.description}
                        </p>
                      </div>
                    </Spotlight>
                  </Link>
                </li>
              );
            }),
          )}
        </ul>
      </PageTransition>
    </PageWrapper>
  );
}
