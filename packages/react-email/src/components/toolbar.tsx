import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
// import { ImageChecker } from './image-checker';
// import { LinkChecker } from './link-checker';
import { SpamAssassin } from './toolbar/spam-assassin';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '../utils';
import { IconReload } from './icons/icon-reload';
import { IconArrowDown } from './icons/icon-arrow-down';
import { IconScanner } from './icons/icon-scanner';
import { IconScissors } from './icons/icon-scissors';

type ToolbarProps = React.ComponentProps<'div'> & {
  emailSlug: string;
  markup: string;
  plainText: string;
};

type ActivePanelValue = 'linter' | 'spam-assassin';

interface ToolbarButton {
  children: React.ReactNode;
}

const ToolbarButton = ({ children }: ToolbarButton) => {
  return (
    <button
      type="button"
      className={cn(
        'h-full w-fit flex text-sm text-slate-10 items-center align-middle justify-center px-1 py-2 gap-1 relative',
        'hover:text-slate-12 transition-colors',
        'data-[state=active]:text-cyan-11 group/toolbar-button',
      )}
    >
      {children}
      <span className="hidden group-data-[state=active]/toolbar-button:inline bottom-0 absolute left-0 w-full bg-cyan-11 h-px" />
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

  // const activePanelValue = (searchParams.get('toolbar-panel') ??
  //   'linter') as ActivePanelValue;
  //
  // const setActivePanelValue = (newValue: ActivePanelValue) => {
  //   console.log(newValue);
  //   const params = new URLSearchParams(searchParams);
  //   params.set('sidebar-panel', newValue);
  //   router.push(`${pathname}?${params.toString()}`);
  // };

  return (
    <div
      {...rest}
      data-toggled={toggled}
      className={cn(
        'bg-black group/toolbar text-xs text-slate-11 h-40',
        className,
      )}
    >
      <Tabs.Root defaultValue="linter" asChild>
        <div className="flex flex-col">
          <Tabs.List className="flex gap-4 px-2 border-b border-solid border-slate-6 h-7 w-full">
            <Tabs.Trigger asChild value="spam-assassin">
              <ToolbarButton>
                <IconScissors />
                Spam Assassin
              </ToolbarButton>
            </Tabs.Trigger>
            <Tabs.Trigger asChild value="linter">
              <ToolbarButton>
                <IconScanner />
                Linter
              </ToolbarButton>
            </Tabs.Trigger>
            <div className="flex gap-1 ml-auto">
              <ToolbarButton>
                <IconReload />
              </ToolbarButton>
              <ToolbarButton>
                <IconArrowDown className="transition-transform group-data-[toggle=true]/toolbar:rotate-90" />
              </ToolbarButton>
            </div>
          </Tabs.List>

          <div className="flex-grow">
            <Tabs.Content value="linter">Linter</Tabs.Content>
            <Tabs.Content value="spam-assassin">Spam Assassin</Tabs.Content>
          </div>
        </div>
      </Tabs.Root>
    </div>
  );
};
