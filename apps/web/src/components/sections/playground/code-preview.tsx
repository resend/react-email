'use client';

import * as Tabs from '@radix-ui/react-tabs';
import { render } from '@react-email/render';
import classNames from 'classnames';
import React from 'react';
import { CodeBlock } from '@/components/code-block';
import { CopyCode } from '@/components/copy-code';
import { IconFile } from '@/components/icons/icon-file';
import { useScroll } from '@/utils/use-scroll';
import WelcomeEmail from './code-example';

type Tab = {
  label: string;
  value: string;
  code: string;
};

export const CodePreview = ({
  tabs,
  activeTab,
}: {
  tabs: Tab[];
  activeTab: string;
}) => {
  return (
    <div className="relative border border-zinc-800 rounded-[20px] overflow-hidden">
      <CodePreviewHeader activeTab={activeTab} tabs={tabs} />
      <CodePreviewContent tabs={tabs} />
      <Line />
    </div>
  );
};

const Line = () => {
  return (
    <div
      aria-hidden
      className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-96 bg-gradient-to-l from-transparent via-cyan-12/50 via-50% to-transparent"
    />
  );
};

const CodePreviewHeader = ({
  activeTab,
  tabs,
}: {
  activeTab: string;
  tabs: Tab[];
}) => {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 h-14 px-2.5">
      <div className="flex items-center gap-1.5 sm:gap-2 h-full ml-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="size-2.5 sm:size-3 rounded-full bg-zinc-800"
          />
        ))}
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <IconFile className="size-4 sm:size-4.5" />
        <span className="text-slate-11 font-mono text-xs sm:text-sm">
          email-template.tsx
        </span>
      </div>
      <div className="flex items-center gap-2">
        <CopyCode
          code={tabs.find((tab) => tab.value === activeTab)?.code || ''}
        />
      </div>
    </div>
  );
};

const CodePreviewContent = ({ tabs }: { tabs: Tab[] }) => {
  const [emailOutput, setEmailOutput] = React.useState<string | null>(null);

  const { isScrolling } = useScroll();

  React.useEffect(() => {
    const renderEmail = async () => {
      const html = await render(<WelcomeEmail />);
      setEmailOutput(html);
    };

    renderEmail();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 w-full">
      <div className="md:col-span-2 max-md:border-b max-md:border-zinc-800">
        {tabs.map((tab) => (
          <Tabs.Content
            key={tab.value}
            value={tab.value}
            className={classNames(
              'h-[400px] md:h-[600px] overflow-auto',
              isScrolling && 'pointer-events-none',
            )}
            style={{
              maskImage: `
                linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%),
                linear-gradient(to right, black 0%, black 96%, transparent 100%),
								linear-gradient(to left, black 0%, black 96%, transparent 100%)
              `,
              maskComposite: 'intersect',
            }}
          >
            <CodeBlock
              key={tab.value}
              children={tab.code}
              className="max-md:px-2 max-md:py-3"
              codeClassName="w-fit"
              language="tsx"
              isGradientLine={false}
            />
          </Tabs.Content>
        ))}
      </div>
      <div className="md:col-span-2 md:border-l border-zinc-800 h-[400px] md:h-auto">
        {emailOutput && (
          <iframe
            className="w-full h-full"
            srcDoc={emailOutput}
            title="Email Preview"
          />
        )}
      </div>
    </div>
  );
};
