import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
// import { ImageChecker } from './image-checker';
// import { LinkChecker } from './link-checker';
import { SpamAssassin, useSpamAssassin } from './toolbar/spam-assassin';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '../utils';
import { IconReload } from './icons/icon-reload';
import { IconArrowDown } from './icons/icon-arrow-down';
import { IconScanner } from './icons/icon-scanner';
import { IconScissors } from './icons/icon-scissors';
import { LayoutGroup, motion } from 'framer-motion';

type ToolbarProps = React.ComponentProps<'div'> & {
  emailSlug: string;
  markup: string;
  plainText: string;
};

type ActivePanelValue = 'linter' | 'spam-assassin';

interface ToolbarButton extends React.ComponentProps<'button'> {
  children: React.ReactNode;
  active?: boolean;
}

const ToolbarButton = ({
  children,
  className,
  active,
  ...props
}: ToolbarButton) => {
  return (
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

  const [toggled, setToggled] = useState(true);

  const activePanelValue = (searchParams.get('toolbar-panel') ??
    'linter') as ActivePanelValue;

  const setActivePanelValue = (newValue: ActivePanelValue) => {
    console.log(newValue);
    const params = new URLSearchParams(searchParams);
    params.set('toolbar-panel', newValue);
    router.push(`${pathname}?${params.toString()}`);
  };

  const [spamCheckingResult, { load: loadSpamChecking }] = useSpamAssassin({
    slug: emailSlug,
    markup,
    plainText,
  });

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
          setToggled(true);
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
                onClick={() => {
                  void loadSpamChecking();
                }}
              >
                <IconReload />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => {
                  setToggled((v) => !v);
                }}
              >
                <IconArrowDown className="transition-transform group-data-[toggled=false]/toolbar:rotate-180" />
              </ToolbarButton>
            </div>
          </Tabs.List>

          {toggled ? (
            <div className="flex-grow overflow-y-auto px-2">
              <Tabs.Content value="linter">Linter</Tabs.Content>
              <Tabs.Content value="spam-assassin">
                <SpamAssassin result={spamCheckingResult} />
              </Tabs.Content>
            </div>
          ) : null}
        </div>
      </Tabs.Root>
    </div>
  );
};
