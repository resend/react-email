'use client';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { motion } from 'framer-motion';
import type * as React from 'react';
import { cn } from '../utils';
import { tabTransition } from '../utils/constants';
import { Heading } from './heading';
import { IconHideSidebar } from './icons/icon-hide-sidebar';
import { IconMonitor } from './icons/icon-monitor';
import { IconPhone } from './icons/icon-phone';
import { IconSource } from './icons/icon-source';
import { Send } from './send';
import { Tooltip } from './tooltip';

interface TopbarProps {
  currentEmailOpenSlug: string;
  pathSeparator: string;
  activeView?: string;
  markup?: string;
  onToggleSidebar?: () => void;
  setActiveView?: (view: string) => void;
}

export const Topbar = ({
  currentEmailOpenSlug,
  pathSeparator,
  markup,
  activeView,
  setActiveView,
  onToggleSidebar,
}: TopbarProps) => {
  return (
    <Tooltip.Provider>
      <header className="relative flex h-[3.3125rem] items-center justify-between border-slate-6 border-b px-3">
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
            aria-label="View mode"
            className="inline-block h-[36px] items-center overflow-hidden rounded-md border border-slate-6 bg-slate-2"
            onValueChange={(value) => {
              if (value) setActiveView?.(value);
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
                        layoutId="topbar-tabs"
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
                        layoutId="topbar-tabs"
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
                        layoutId="topbar-tabs"
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
