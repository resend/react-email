import type { Metadata } from 'next';
import Link from 'next/link';
import { Heading } from '@/components/heading';
import { PageTransition } from '@/components/page-transition';
import { PageWrapper } from '@/components/page-wrapper';

interface ExampleMeta {
  slug: string;
  title: string;
  description: string;
  section: string;
  docsUrl?: string;
}

interface ExampleSection {
  title: string;
  examples: ExampleMeta[];
}

const sections: ExampleSection[] = [
  {
    title: 'One-Line Editor',
    examples: [
      {
        slug: 'one-line-editor',
        title: 'One-Line Editor — Minimal',
        description:
          'The simplest setup — one component with everything included.',
        section: 'One-Line Editor',
        docsUrl: 'https://react.email/docs/editor/getting-started',
      },
      {
        slug: 'one-line-editor-full',
        title: 'One-Line Editor — Full Features',
        description:
          'Theme switching, ref methods (export, getJSON), and callbacks — all with a single component.',
        section: 'One-Line Editor',
        docsUrl: 'https://react.email/docs/editor/getting-started',
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
        section: 'Getting Started',
        docsUrl: 'https://react.email/docs/editor/getting-started',
      },
      {
        slug: 'bubble-menu',
        title: 'Bubble Menu',
        description:
          'Select text to see the default bubble menu with formatting options.',
        section: 'Getting Started',
        docsUrl: 'https://react.email/docs/editor/features/bubble-menu',
      },
      {
        slug: 'slash-commands',
        title: 'Slash Commands',
        description:
          'Type / to open the command menu. Includes default commands plus a custom "Greeting" command.',
        section: 'Getting Started',
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
        section: 'Intermediate',
        docsUrl: 'https://react.email/docs/editor/features/bubble-menu',
      },
      {
        slug: 'link-editing',
        title: 'Link Editing',
        description:
          'Click a link to see the link bubble menu. Select text and press Cmd+K to add links.',
        section: 'Intermediate',
        docsUrl: 'https://react.email/docs/editor/features/link-editing',
      },
      {
        slug: 'column-layouts',
        title: 'Column Layouts',
        description: 'Insert multi-column layouts using the toolbar buttons.',
        section: 'Intermediate',
        docsUrl: 'https://react.email/docs/editor/features/column-layouts',
      },
      {
        slug: 'buttons',
        title: 'Buttons',
        description:
          'Click the button to edit its link via the button bubble menu.',
        section: 'Intermediate',
        docsUrl: 'https://react.email/docs/editor/features/buttons',
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
        section: 'Advanced',
        docsUrl: 'https://react.email/docs/editor/features/theming',
      },
      {
        slug: 'email-export',
        title: 'Email Export',
        description:
          'Edit content and export it as email-ready HTML using composeReactEmail().',
        section: 'Advanced',
        docsUrl: 'https://react.email/docs/editor/features/email-export',
      },
      {
        slug: 'custom-extensions',
        title: 'Custom Extensions',
        description:
          'A custom Callout node created with EmailNode.create — showing how to extend the editor with email-compatible nodes.',
        section: 'Advanced',
        docsUrl: 'https://react.email/docs/editor/advanced/custom-extensions',
      },
      {
        slug: 'inspector-defaults',
        title: 'Inspector — Defaults',
        description:
          'Zero-config inspector sidebar. All three inspectors render sensible defaults when no children are passed.',
        section: 'Advanced',
        docsUrl: 'https://react.email/docs/editor/overview',
      },
      {
        slug: 'inspector-composed',
        title: 'Inspector — Composed',
        description:
          'Cherry-pick which sections render, control collapse state, and mix in custom sections alongside built-in ones.',
        section: 'Advanced',
        docsUrl: 'https://react.email/docs/editor/overview',
      },
      {
        slug: 'inspector-custom',
        title: 'Inspector — Fully Custom',
        description:
          'Build the entire inspector UI from scratch using only render-props data and plain HTML.',
        section: 'Advanced',
        docsUrl: 'https://react.email/docs/editor/overview',
      },
      {
        slug: 'full-email-builder',
        title: 'Full Email Builder',
        description:
          'All components combined: bubble menus, slash commands, theming, inspector sidebar, and export.',
        section: 'Advanced',
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
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <a
              className="text-slate-11 transition-colors hover:text-slate-12"
              href="https://react.email/docs/editor/overview"
              rel="noopener"
              target="_blank"
            >
              Overview
            </a>
            <span className="text-slate-6">·</span>
            <a
              className="text-slate-11 transition-colors hover:text-slate-12"
              href="https://react.email/docs/editor/getting-started"
              rel="noopener"
              target="_blank"
            >
              Getting Started
            </a>
            <span className="text-slate-6">·</span>
            <a
              className="text-slate-11 transition-colors hover:text-slate-12"
              href="https://react.email/docs/editor/api-reference"
              rel="noopener"
              target="_blank"
            >
              API Reference
            </a>
          </div>
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
