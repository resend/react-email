import * as Tabs from '@radix-ui/react-tabs';
import { LayoutGroup, motion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { act, useEffect, useState } from 'react';
import { cn } from '../utils';
import { IconArrowDown } from './icons/icon-arrow-down';
import { IconReload } from './icons/icon-reload';
import { IconScanner } from './icons/icon-scanner';
import { IconScissors } from './icons/icon-scissors';
import { Linter, useLinter } from './toolbar/linter';
import { SpamAssassin, useSpamAssassin } from './toolbar/spam-assassin';
import { Tooltip } from './tooltip';

type ToolbarProps = React.ComponentProps<'div'> & {
  emailSlug: string;
  markup: string;
  plainText: string;
};

type ActivePanelValue = 'linter' | 'spam-assassin';

interface ToolbarButton extends React.ComponentProps<'button'> {
  children: React.ReactNode;
  active?: boolean;
  tooltip?: React.ReactNode;
}

const ToolbarButton = ({
  children,
  className,
  active,
  tooltip,
  ...props
}: ToolbarButton) => {
  return (
    <Tooltip.Provider>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            {...props}
            className={cn(
              'h-full w-fit font-medium flex text-sm text-slate-10 items-center align-middle justify-center px-1 py-2 gap-1 relative',
              'hover:text-slate-12 transition-colors',
              active && 'data-[state=active]:text-cyan-11',
              className,
            )}
          >
            {children}
            {active ? (
              <motion.span
                className="-bottom-px absolute rounded-sm left-0 w-full bg-cyan-11 h-px"
                layoutId="active-toolbar-button"
                transition={{
                  type: 'spring',
                  bounce: 0.2,
                  duration: 0.6,
                }}
              />
            ) : null}
          </button>
        </Tooltip.Trigger>
        {tooltip ? <Tooltip.Content>{tooltip}</Tooltip.Content> : null}
      </Tooltip>
    </Tooltip.Provider>
  );
};

export const Toolbar = ({
  emailSlug,
  markup,
  plainText,
  className,
  ...rest
}: ToolbarProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const activePanelValue = (searchParams.get('toolbar-panel') ?? undefined) as
    | ActivePanelValue
    | undefined;

  const toggled = activePanelValue !== undefined;

  const setActivePanelValue = (newValue: ActivePanelValue | undefined) => {
    console.log(newValue);
    const params = new URLSearchParams(searchParams);
    if (newValue === undefined) {
      params.delete('toolbar-panel');
    } else {
      params.set('toolbar-panel', newValue);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const [spamCheckingResult, { load: loadSpamChecking }] = useSpamAssassin({
    slug: emailSlug,
    markup,
    plainText,
  });

  const [lintingResults, { load: loadLinting }] = useLinter({
    slug: emailSlug,
    markup,
  });

  useEffect(() => {
    loadLinting();
    loadSpamChecking();
  }, []);

  return (
    <div
      {...rest}
      data-toggled={toggled}
      className={cn(
        'bg-black group/toolbar text-xs text-slate-11 h-48 transition-all',
        'data-[toggled=false]:h-8',
        className,
      )}
    >
      <Tabs.Root
        value={activePanelValue}
        onValueChange={(newValue) => {
          setActivePanelValue(newValue as ActivePanelValue);
        }}
        asChild
      >
        <div className="flex flex-col h-full">
          <Tabs.List className="flex gap-4 px-2 border-b border-solid border-slate-6 h-7 w-full">
            <LayoutGroup id="toolbar">
              <Tabs.Trigger asChild value="spam-assassin">
                <ToolbarButton active={activePanelValue === 'spam-assassin'}>
                  <IconScissors />
                  Spam Assassin
                </ToolbarButton>
              </Tabs.Trigger>
              <Tabs.Trigger asChild value="linter">
                <ToolbarButton active={activePanelValue === 'linter'}>
                  <IconScanner />
                  Linter
                </ToolbarButton>
              </Tabs.Trigger>
            </LayoutGroup>
            <div className="flex gap-1 ml-auto">
              <ToolbarButton
                tooltip="Reload"
                onClick={() => {
                  if (activePanelValue === 'spam-assassin') {
                    void loadSpamChecking();
                  } else if (activePanelValue === 'linter') {
                    void loadLinting();
                  } else {
                    setActivePanelValue('linter');
                    void loadLinting();
                  }
                }}
              >
                <IconReload />
              </ToolbarButton>
              <ToolbarButton
                tooltip="Toggle toolbar"
                onClick={() => {
                  if (activePanelValue === undefined) {
                    setActivePanelValue('linter');
                  } else {
                    setActivePanelValue(undefined);
                  }
                }}
              >
                <IconArrowDown className="transition-transform group-data-[toggled=false]/toolbar:rotate-180" />
              </ToolbarButton>
            </div>
          </Tabs.List>

          <div className="flex-grow transition-opacity opacity-100 group-data-[toggled=false]/toolbar:opacity-0 overflow-y-auto px-2">
            <Tabs.Content value="linter">
              <Linter results={lintingResults} />
            </Tabs.Content>
            <Tabs.Content value="spam-assassin">
              <SpamAssassin result={spamCheckingResult} />
            </Tabs.Content>
          </div>
        </div>
      </Tabs.Root>
    </div>
  );
};
