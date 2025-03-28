'use client';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { motion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '../utils';
import { tabTransition } from '../utils/constants';
import { Heading } from './heading';
import { IconHideSidebar } from './icons/icon-hide-sidebar';
import { IconMonitor } from './icons/icon-monitor';
import { IconMoon } from './icons/icon-moon';
import { IconPhone } from './icons/icon-phone';
import { IconSource } from './icons/icon-source';
import { IconSun } from './icons/icon-sun';
import { Send } from './send';
import { Tooltip } from './tooltip';

interface TopbarProps {
  currentEmailOpenSlug: string;
  pathSeparator: string;
  markup?: string;
  onToggleSidebar?: () => void;
}

export const Topbar: React.FC<Readonly<TopbarProps>> = ({
  currentEmailOpenSlug,
  pathSeparator,
  markup,
  onToggleSidebar,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTheme = searchParams.get('theme') ?? 'light';
  const activeView = searchParams.get('view') ?? 'desktop';

  const setActiveView = (view: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('view', view);
    router.push(`${pathname}?${params.toString()}`);
  };

  const setTheme = (theme: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('theme', theme);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Tooltip.Provider>
      <header className="relative flex h-[70px] items-center justify-between border-slate-6 border-b px-4">
        <Tooltip>
          <Tooltip.Trigger asChild>
            <button
              className="relative hidden rounded-lg px-2 py-2 text-slate-11 transition duration-200 ease-in-out hover:bg-slate-5 hover:text-slate-12 lg:flex"
              onClick={() => {
                if (onToggleSidebar) {
                  onToggleSidebar();
                }
              }}
              type="button"
            >
              <IconHideSidebar height={20} width={20} />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content>Show/hide sidebar</Tooltip.Content>
        </Tooltip>

        <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 hidden transform items-center overflow-hidden text-center lg:flex">
          <Heading as="h2" className="truncate" size="2" weight="medium">
            {currentEmailOpenSlug.split(pathSeparator).pop()}
          </Heading>
        </div>

        <div className="flex w-full justify-between gap-3 lg:w-fit lg:justify-start">
          <ToggleGroup.Root
            aria-label="Color Scheme"
            className="inline-block h-[36px] items-center overflow-hidden rounded-md border border-slate-6 bg-slate-2"
            id="theme-toggle"
            onValueChange={(value) => {
              if (value) setTheme(value);
            }}
            type="single"
            value={activeTheme}
          >
            <ToggleGroup.Item value="light">
              <Tooltip>
                <Tooltip.Trigger asChild>
                  <div
                    className={cn(
                      'relative px-3 py-2 transition duration-200 ease-in-out hover:text-slate-12',
                      {
                        'text-slate-11': activeTheme !== 'light',
                        'text-slate-12': activeTheme === 'light',
                      },
                    )}
                  >
                    {activeTheme === 'light' && (
                      <motion.span
                        animate={{ opacity: 1 }}
                        className="absolute top-0 right-0 bottom-0 left-0 bg-slate-4"
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0 }}
                        layoutId="topbar-theme-tabs"
                        transition={tabTransition}
                      />
                    )}
                    <IconSun />
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Content>Light</Tooltip.Content>
              </Tooltip>
            </ToggleGroup.Item>
            <ToggleGroup.Item value="dark">
              <Tooltip>
                <Tooltip.Trigger asChild>
                  <div
                    className={cn(
                      'relative px-3 py-2 transition duration-200 ease-in-out hover:text-slate-12',
                      {
                        'text-slate-11': activeTheme !== 'dark',
                        'text-slate-12': activeTheme === 'dark',
                      },
                    )}
                  >
                    {activeTheme === 'dark' && (
                      <motion.span
                        animate={{ opacity: 1 }}
                        className="absolute top-0 right-0 bottom-0 left-0 bg-slate-4"
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0 }}
                        layoutId="topbar-theme-tabs"
                        transition={tabTransition}
                      />
                    )}
                    <IconMoon />
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Content>Dark</Tooltip.Content>
              </Tooltip>
            </ToggleGroup.Item>
          </ToggleGroup.Root>

          <ToggleGroup.Root
            aria-label="View mode"
            className="inline-block h-[36px] items-center overflow-hidden rounded-md border border-slate-6 bg-slate-2"
            id="view-toggle"
            onValueChange={(value) => {
              if (value) setActiveView(value);
            }}
            type="single"
            value={activeView}
          >
            <ToggleGroup.Item value="desktop">
              <Tooltip>
                <Tooltip.Trigger asChild>
                  <div
                    className={cn(
                      'relative px-3 py-2 transition duration-200 ease-in-out hover:text-slate-12',
                      {
                        'text-slate-11': activeView !== 'desktop',
                        'text-slate-12': activeView === 'desktop',
                      },
                    )}
                  >
                    {activeView === 'desktop' && (
                      <motion.span
                        animate={{ opacity: 1 }}
                        className="absolute top-0 right-0 bottom-0 left-0 bg-slate-4"
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0 }}
                        layoutId="topbar-view-tabs"
                        transition={tabTransition}
                      />
                    )}
                    <IconMonitor />
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Content>Desktop</Tooltip.Content>
              </Tooltip>
            </ToggleGroup.Item>
            <ToggleGroup.Item value="mobile">
              <Tooltip>
                <Tooltip.Trigger asChild>
                  <div
                    className={cn(
                      'relative px-3 py-2 transition duration-200 ease-in-out hover:text-slate-12',
                      {
                        'text-slate-11': activeView !== 'mobile',
                        'text-slate-12': activeView === 'mobile',
                      },
                    )}
                  >
                    {activeView === 'mobile' && (
                      <motion.span
                        animate={{ opacity: 1 }}
                        className="absolute top-0 right-0 bottom-0 left-0 bg-slate-4"
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0 }}
                        layoutId="topbar-view-tabs"
                        transition={tabTransition}
                      />
                    )}
                    <IconPhone />
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Content>Mobile</Tooltip.Content>
              </Tooltip>
            </ToggleGroup.Item>
            <ToggleGroup.Item value="source">
              <Tooltip>
                <Tooltip.Trigger asChild>
                  <div
                    className={cn(
                      'relative px-3 py-2 transition duration-200 ease-in-out hover:text-slate-12',
                      {
                        'text-slate-11': activeView !== 'source',
                        'text-slate-12': activeView === 'source',
                      },
                    )}
                  >
                    {activeView === 'source' && (
                      <motion.span
                        animate={{ opacity: 1 }}
                        className="absolute top-0 right-0 bottom-0 left-0 bg-slate-4"
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0 }}
                        layoutId="topbar-view-tabs"
                        transition={tabTransition}
                      />
                    )}
                    <IconSource />
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Content>Code</Tooltip.Content>
              </Tooltip>
            </ToggleGroup.Item>
          </ToggleGroup.Root>

          {markup ? (
            <div className="flex justify-end">
              <Send markup={markup} />
            </div>
          ) : null}
        </div>
      </header>
    </Tooltip.Provider>
  );
};
