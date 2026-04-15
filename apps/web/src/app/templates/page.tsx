import type { Metadata } from 'next';
import Image from 'next/image';
import { PageWrapper } from '@/components/page-wrapper';
import { Anchor } from '../../components/anchor';
import { Heading } from '../../components/heading';
import { PageTransition } from '../../components/page-transition';
import { TemplateList } from '../../components/template-list';
import { Text } from '../../components/text';

const description = 'Open source templates built with React Email';

export const metadata: Metadata = {
  title: 'Templates — React Email',
  description,
};

export default function Templates() {
  return (
    <PageWrapper>
      <Image
        alt=""
        className="pointer-events-none absolute inset-0 z-3 select-none mix-blend-lighten"
        fill
        priority
        src="/static/bg.png"
      />
      <PageTransition
        className="mx-auto flex w-full max-w-6xl flex-col justify-center px-1 py-10 md:px-0"
        key="about"
        tag="main"
      >
        <div className="mb-12 text-pretty px-6 md:max-w-184 md:px-0">
          <Heading className="text-white" weight="medium" size="6">
            Templates
          </Heading>
          <Text as="p" className="mt-4 text-slate-11" size="2">
            {description}.
          </Text>
          <Text as="p" className="mt-2 text-slate-11" size="2">
            Recreate an existing email or submit a{' '}
            <Anchor
              href="https://github.com/resend/react-email/tree/main/apps/demo/emails"
              target="_blank"
            >
              pull request
            </Anchor>{' '}
            to add your template here.
          </Text>
        </div>
        <TemplateList />
      </PageTransition>
    </PageWrapper>
  );
}
