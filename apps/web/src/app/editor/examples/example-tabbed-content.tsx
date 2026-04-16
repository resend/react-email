'use client';

import * as Tabs from '@radix-ui/react-tabs';
import { useState } from 'react';
import { IconSource } from '@/components/icons/icon-source';
import { TabTrigger } from '@/components/tab-trigger';
import { ExampleCodeView } from './example-code-view';

interface ExampleTabbedContentProps {
  sourceCode: string;
  githubUrl: string;
  children: React.ReactNode;
}

type ActiveView = 'example' | 'code';

export function ExampleTabbedContent({
  sourceCode,
  githubUrl,
  children,
}: ExampleTabbedContentProps) {
  const [activeView, setActiveView] = useState<ActiveView>('example');

  return (
    <Tabs.Root
      defaultValue="example"
      onValueChange={(v) => setActiveView(v as ActiveView)}
      className="relative flex w-full flex-col gap-2"
    >
      <div className="relative flex w-full items-center pb-3">
        <Tabs.List className="relative flex w-fit items-center overflow-hidden p-1 text-xs">
          <TabTrigger
            activeView={activeView}
            layoutId="example-view"
            value="example"
          >
            Example
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
        <div className="absolute right-0 bottom-0 left-0 h-px bg-slate-4" />
      </div>
      <Tabs.Content
        className="relative h-fit scroll-m-2 focus:outline-hidden focus:ring-3 focus:ring-slate-8"
        value="example"
      >
        {children}
      </Tabs.Content>
      <Tabs.Content
        className="relative h-fit scroll-m-2 overflow-hidden rounded-2xl border border-slate-4 focus:outline-hidden focus:ring-3 focus:ring-slate-8"
        value="code"
      >
        <ExampleCodeView code={sourceCode} githubUrl={githubUrl} />
      </Tabs.Content>
    </Tabs.Root>
  );
}
