'use client';

import { use } from 'react';
import { cn } from '../utils';
import { Heading } from './heading';
import { IconHideSidebar } from './icons/icon-hide-sidebar';
import { ShellContext } from './shell';
import { Tooltip } from './tooltip';

interface TopbarProps extends React.ComponentProps<'header'> {
  emailTitle: string;
  children: React.ReactNode;
}

export const Topbar = ({
  emailTitle,
  children,
  className,
  ...props
}: TopbarProps) => {
  const { toggleSidebar } = use(ShellContext)!;

  return (
    <Tooltip.Provider>
      <header
        {...props}
        className={cn(
          'flex h-14 items-center justify-between gap-3 border-slate-6 border-b px-3 py-2',
          className,
        )}
      >
        <div className="flex w-fit items-center gap-3">
          <Tooltip>
            <Tooltip.Trigger asChild>
              <button
                className="hidden rounded-lg px-2 py-2 text-slate-11 transition duration-200 ease-in-out hover:bg-slate-5 hover:text-slate-12 lg:flex"
                onClick={() => {
                  toggleSidebar();
                }}
                type="button"
              >
                <IconHideSidebar height={20} width={20} />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content>Show/hide sidebar</Tooltip.Content>
          </Tooltip>
          <div className="hidden items-center overflow-hidden text-center lg:flex">
            <Heading as="h2" className="truncate" size="2" weight="medium">
              {emailTitle}
            </Heading>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-3 lg:w-fit lg:justify-start">
          {children}
        </div>
      </header>
    </Tooltip.Provider>
  );
};
