import { Bolt, Cpu, Layers2, Rocket } from 'lucide-react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { createElement } from 'react';

import { Heading } from '@/components/heading';
import { PageTransition } from '@/components/page-transition';
import { PageWrapper } from '@/components/page-wrapper';
import { SmartLink } from '@/components/smart-link';
import { Spotlight } from '@/components/spotlight';
import { TabButton } from '@/components/tab-button';
import {
  type IllustrationProps,
  sectionTitleToTone,
} from '@/illustrations/editor-examples/illustration-shared';

interface Example {
  slug: string;
  title: string;
  description: string;
  docsUrl?: string;
}

interface Section {
  title: string;
  examples: Example[];
}

const sections: Section[] = [
  {
    title: 'Standalone Editor',
    examples: [
      {
        slug: 'one-line-editor',
        title: 'Minimal',
        description:
          'The simplest setup — one component with everything included.',
        docsUrl: 'https://react.email/docs/editor/getting-started',
      },
      {
        slug: 'one-line-editor-full',
        title: 'Full Features',
        description:
          'Theme switching, ref methods (export, getJSON), and callbacks — all with a single component.',
        docsUrl: 'https://react.email/docs/editor/getting-started',
      },
      {
        slug: 'one-line-editor-inspector',
        title: 'Inspector',
        description:
          'Add an inspector sidebar alongside the one-line EmailEditor — no manual EditorProvider setup needed.',
        docsUrl: 'https://react.email/docs/editor/features/inspector',
      },
    ],
  },
  {
    title: 'Getting Started',
    examples: [
      {
        slug: 'basic-editor',
        title: 'Basic Editor',
        description: 'Minimal setup with StarterKit and no UI overlays.',
        docsUrl: 'https://react.email/docs/editor/getting-started',
      },
      {
        slug: 'bubble-menu',
        title: 'Bubble Menu',
        description:
          'Select text to see the default bubble menu with formatting options.',
        docsUrl: 'https://react.email/docs/editor/features/bubble-menu',
      },
      {
        slug: 'slash-commands',
        title: 'Slash Commands',
        description:
          'Type / to open the command menu. Includes default commands plus a custom "Greeting" command.',
        docsUrl: 'https://react.email/docs/editor/features/slash-commands',
      },
    ],
  },
  {
    title: 'Intermediate',
    examples: [
      {
        slug: 'custom-bubble-menu',
        title: 'Custom Bubble Menu',
        description: 'Building bubble menus from primitives.',
        docsUrl: 'https://react.email/docs/editor/features/bubble-menu',
      },
      {
        slug: 'link-editing',
        title: 'Link Editing',
        description:
          'Click a link to see the link bubble menu. Select text and press Cmd+K to add links.',
        docsUrl: 'https://react.email/docs/editor/features/link-editing',
      },
      {
        slug: 'column-layouts',
        title: 'Column Layouts',
        description: 'Insert multi-column layouts using the toolbar buttons.',
        docsUrl: 'https://react.email/docs/editor/features/column-layouts',
      },
      {
        slug: 'buttons',
        title: 'Buttons',
        description:
          'Click the button to edit its link via the button bubble menu.',
        docsUrl: 'https://react.email/docs/editor/features/buttons',
      },
      {
        slug: 'image-upload',
        title: 'Image Upload',
        description:
          'Upload images via paste, drop, or the slash command — with a stubbed uploader and an error-path toggle.',
        docsUrl: 'https://react.email/docs/editor/features/image-upload',
      },
    ],
  },
  {
    title: 'Advanced',
    examples: [
      {
        slug: 'email-theming',
        title: 'Email Theming',
        description:
          'Switch between Basic and Minimal themes to see how email styles change.',
        docsUrl: 'https://react.email/docs/editor/features/theming',
      },
      {
        slug: 'email-export',
        title: 'Email Export',
        description:
          'Edit content and export it as email-ready HTML using composeReactEmail().',
        docsUrl: 'https://react.email/docs/editor/features/email-export',
      },
      {
        slug: 'custom-extensions',
        title: 'Custom Extensions',
        description:
          'A custom Callout node created with EmailNode.create — showing how to extend the editor with email-compatible nodes.',
        docsUrl: 'https://react.email/docs/editor/advanced/custom-extensions',
      },
      {
        slug: 'inspector-defaults',
        title: 'Inspector — Defaults',
        description:
          'Zero-config inspector sidebar. All three inspectors render sensible defaults when no children are passed.',
        docsUrl: 'https://react.email/docs/editor/overview',
      },
      {
        slug: 'inspector-composed',
        title: 'Inspector — Composed',
        description:
          'Cherry-pick which sections render, control collapse state, and mix in custom sections alongside built-in ones.',
        docsUrl: 'https://react.email/docs/editor/overview',
      },
      {
        slug: 'inspector-custom',
        title: 'Inspector — Fully Custom',
        description:
          'Build the entire inspector UI from scratch using only render-props data and plain HTML.',
        docsUrl: 'https://react.email/docs/editor/overview',
      },
      {
        slug: 'full-email-builder',
        title: 'Full Email Builder',
        description:
          'All components combined: bubble menus, slash commands, theming, inspector sidebar, and export.',
        docsUrl: 'https://react.email/docs/editor/features/email-export',
      },
    ],
  },
];

export const metadata: Metadata = {
  title: 'Editor Examples',
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
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <TabButton asChild>
              <SmartLink href="/docs/editor/overview">Overview</SmartLink>
            </TabButton>
            <TabButton asChild>
              <SmartLink href="/docs/editor/getting-started">
                Getting Started
              </SmartLink>
            </TabButton>
            <TabButton asChild>
              <SmartLink href="/docs/editor/api-reference">
                API Reference
              </SmartLink>
            </TabButton>
          </div>
        </div>
        <ul className="grid grid-cols-1 gap-4 px-6 pb-10 md:grid-cols-2 md:px-8 lg:grid-cols-3">
          {sections.map((section) =>
            section.examples.map((example) => {
              const sectionIcon = {
                'Standalone Editor': Bolt,
                'Getting Started': Rocket,
                Intermediate: Layers2,
                Advanced: Cpu,
              }[section.title];
              const tone = sectionTitleToTone(section.title);
              const illustrationComponent = dynamic<IllustrationProps>(
                () => import(`@/illustrations/editor-examples/${example.slug}`),
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
