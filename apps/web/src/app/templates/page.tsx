import type { Metadata } from 'next';
import { Heading } from '@/components/heading';
import { PageWrapper } from '@/components/page-wrapper';
import { Anchor } from '../../components/anchor';
import { PageTransition } from '../../components/page-transition';
import { TemplateList } from '../../components/template-list';

const description =
  'Open source templates built with React Email';

export const metadata: Metadata = {
  title: 'Templates — React Email',
  description,
  alternates: {
    canonical: '/templates',
  },
};

export default function Templates() {
  return (
    <PageWrapper>
      <div className="pointer-events-none absolute inset-0 flex justify-center mask-[linear-gradient(to_bottom,transparent_0%,black_4%,black_96%,transparent_100%)]">
        <div className="hidden h-full w-full max-w-7xl grid-cols-2 gap-4 px-4 lg:grid">
          <div className="border-r-slate-3 border-l border-l-slate-4" />
          <div className="border-r border-r-slate-4" />
        </div>
      </div>
      <PageTransition className="pb-10" key="templates" tag="main">
        <div className="flex w-full flex-col gap-2 px-6 pt-16 pb-10 md:px-8">
          <Heading size="6" weight="medium" className="text-slate-12">
            Templates
          </Heading>
          <p>
            {description}. Recreate an existing email or submit a{' '}
            <Anchor
              href="https://github.com/resend/react-email/tree/main/apps/demo/emails"
              target="_blank"
            >
              pull request
            </Anchor>{' '}
            to add your template here.
          </p>
        </div>
        <TemplateList />
      </PageTransition>
    </PageWrapper>
  );
}
