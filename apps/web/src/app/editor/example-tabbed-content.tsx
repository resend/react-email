'use client';

import * as Tabs from '@radix-ui/react-tabs';
import classNames from 'classnames';
import { useState } from 'react';
import { IconMonitor } from '@/components/icons/icon-monitor';
import { IconSource } from '@/components/icons/icon-source';
import { TabTrigger } from '@/components/tab-trigger';
import { ExampleCodeView } from './example-code-view';
import { ExamplePageContext } from './example-shell';

interface ExampleTabbedContentProps {
  title?: string;
  sourceCode: string;
  githubUrl: string;
  children: React.ReactNode;
}

type ActiveView = 'example' | 'code';

export function ExampleTabbedContent({
  title,
  sourceCode,
  githubUrl,
  children,
}: ExampleTabbedContentProps) {
  const [activeView, setActiveView] = useState<ActiveView>('example');

  return (
    <Tabs.Root
      defaultValue="example"
      onValueChange={(v) => setActiveView(v as ActiveView)}
      className="relative mb-8 flex w-full flex-col gap-2 md:mb-12"
    >
      <div className="relative flex w-full items-center gap-6 px-6 pb-3 md:px-8">
        {title && (
          <h2 className="shrink grow basis-0 text-pretty font-semibold text-lg text-slate-12 md:text-xl">
            {title}
          </h2>
        )}
        <Tabs.List
          className={classNames(
            'relative flex w-fit items-center overflow-hidden p-1 text-xs',
            { 'ml-auto': !title },
          )}
        >
          <TabTrigger
            activeView={activeView}
            layoutId="example-view"
            value="example"
            className="flex w-9 items-center justify-center px-0!"
          >
            <IconMonitor />
          </TabTrigger>
          <TabTrigger
            activeView={activeView}
            layoutId="example-view"
            value="code"
            className="flex w-9 items-center justify-center px-0!"
          >
            <IconSource />
          </TabTrigger>
        </Tabs.List>
        <div className="absolute right-0 bottom-0 h-px w-dvw bg-slate-4" />
      </div>
      <div className="relative h-fit w-full transition-all duration-300 ease-[cubic-bezier(.36,.66,.6,1)] transition-discrete">
        <Tabs.Content
          className="relative m-4 mx-2 h-fit scroll-m-2 transition-colors focus:outline-hidden md:mx-8"
          value="example"
        >
          <ExamplePageContext.Provider value={true}>
            {children}
          </ExamplePageContext.Provider>
        </Tabs.Content>
        <Tabs.Content
          className="relative m-4 mx-2 h-fit scroll-m-2 overflow-hidden rounded-2xl border border-slate-4 transition-colors focus:outline-hidden focus:ring-3 focus:ring-slate-8 md:mx-8"
          value="code"
        >
          <ExampleCodeView code={sourceCode} githubUrl={githubUrl} />
        </Tabs.Content>
      </div>
    </Tabs.Root>
  );
}
