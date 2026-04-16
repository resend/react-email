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
      className="flex flex-col gap-4"
    >
      <Tabs.List className="flex w-fit items-center overflow-hidden text-xs">
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
          className="flex items-center gap-1.5"
        >
          <IconSource size={14} />
          Code
        </TabTrigger>
      </Tabs.List>
      <Tabs.Content value="example">{children}</Tabs.Content>
      <Tabs.Content value="code">
        <ExampleCodeView code={sourceCode} githubUrl={githubUrl} />
      </Tabs.Content>
    </Tabs.Root>
  );
}
