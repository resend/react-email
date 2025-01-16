'use client';

import * as Tabs from '@radix-ui/react-tabs';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import classNames from 'classnames';
import * as React from 'react';
import type { ImportedComponent } from '../app/components/get-imported-components-for';
import { ComponentCodeView } from './component-code-view';
import { ComponentPreview } from './component-preview';
import { IconMonitor } from './icons/icon-monitor';
import { IconPhone } from './icons/icon-phone';
import { IconSource } from './icons/icon-source';
import { TabTrigger } from './tab-trigger';
import { Tooltip } from './tooltip';

interface ComponentViewProps {
  component: ImportedComponent;
  className?: string;
}

type ActiveView = 'code' | 'desktop' | 'mobile';

const TabTriggetWithTooltip = ({
  tooltip,
  children,
  activeView,
  layoutId,
  value,
}: {
  tooltip: string;
  layoutId: string;
  children: React.ReactNode;
  activeView: string;
  value: string;
}) => (
  <Tooltip>
    <Tooltip.Trigger asChild>
      <TabTrigger activeView={activeView} layoutId={layoutId} value={value}>
        {children}
      </TabTrigger>
    </Tooltip.Trigger>
    <Tooltip.Content>{tooltip}</Tooltip.Content>
  </Tooltip>
);

const TabContent: React.FC<{
  value: ActiveView;
  children: React.ReactNode;
  additionalClasses?: string;
}> = ({ value, children, additionalClasses = '' }) => (
  <Tabs.Content
    className={`relative m-4 mx-2 h-fit scroll-m-2 overflow-hidden rounded-md border border-slate-4 transition-colors focus:outline-none focus:ring focus:ring-slate-8 md:mx-8 ${additionalClasses}`}
    value={value}
  >
    {children}
  </Tabs.Content>
);

export const ComponentView: React.FC<ComponentViewProps> = ({
  component,
  className,
}) => {
  const [activeView, setActiveView] = React.useState<ActiveView>('desktop');

  React.useEffect(() => {
    setActiveView(activeView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tabs.Root
      className="relative mb-8 flex w-full flex-col gap-2 md:mb-12"
      defaultValue={activeView}
      onValueChange={(value: string) => {
        setActiveView(value as ActiveView);
      }}
    >
      <TooltipProvider>
        <div
          className={classNames(
            'relative flex w-full items-center gap-6 px-6 pb-3 md:px-8',
            className,
          )}
        >
          <h2 className="shrink grow basis-0 text-pretty text-lg font-semibold text-slate-12 md:text-xl">
            {component.title}
          </h2>
          <Tabs.List className="relative flex w-fit items-center space-x-1 overflow-hidden p-1 text-xs">
            <TabTriggetWithTooltip
              activeView={activeView}
              layoutId={`${component.slug}-view`}
              tooltip="Desktop"
              value="desktop"
            >
              <IconMonitor />
            </TabTriggetWithTooltip>
            <TabTriggetWithTooltip
              activeView={activeView}
              layoutId={`${component.slug}-view`}
              tooltip="Mobile"
              value="mobile"
            >
              <IconPhone />
            </TabTriggetWithTooltip>
            <TabTriggetWithTooltip
              activeView={activeView}
              layoutId={`${component.slug}-view`}
              tooltip="Code"
              value="code"
            >
              <IconSource />
            </TabTriggetWithTooltip>
          </Tabs.List>
          <div className="absolute bottom-0 right-0 h-px w-[100dvw] bg-slate-4" />
        </div>
        <div className="relative h-fit w-full transition-all duration-300 ease-[cubic-bezier(.36,.66,.6,1)] [transition-behavior:allow-discrete]">
          <TabContent value="desktop">
            <div className="absolute inset-0 bg-transparent bg-[radial-gradient(#091A21_.0313rem,transparent_.0313rem),_radial-gradient(#091A21_.0313rem,transparent_.0313rem)] opacity-30 transition-all duration-300 ease-[cubic-bezier(.36,.66,.6,1)] [background-position:0_0,.625rem_.625rem] [background-size:1.25rem_1.25rem] [height:calc-size(auto)] [transition-behavior:allow-discrete]" />
            <ComponentPreview activeView="desktop" html={component.code.html} />
          </TabContent>
          <TabContent value="mobile">
            <div className="absolute inset-0 bg-transparent bg-[radial-gradient(#091A21_.0313rem,transparent_.0313rem),_radial-gradient(#091A21_.0313rem,transparent_.0313rem)] opacity-30 transition-all duration-300 ease-[cubic-bezier(.36,.66,.6,1)] [background-position:0_0,.625rem_.625rem] [background-size:1.25rem_1.25rem] [height:calc-size(auto)] [transition-behavior:allow-discrete]" />
            <ComponentPreview activeView="mobile" html={component.code.html} />
          </TabContent>
          <TabContent value="code">
            <ComponentCodeView component={component} />
          </TabContent>
        </div>
      </TooltipProvider>
    </Tabs.Root>
  );
};
