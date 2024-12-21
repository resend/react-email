'use client';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { motion } from 'framer-motion';
import { cn } from '../utils';
import { tabTransition } from '../utils/constants';
import type * as React from 'react';
import { Heading } from './heading';
import { IconHideSidebar } from './icons/icon-hide-sidebar';
import { Send } from './send';
import { Tooltip } from './tooltip';
import { ViewSizeControls } from './topbar/view-size-controls';
import { ActiveViewToggleGroup } from './topbar/active-view-toggle-group';

interface TopbarProps {
  currentEmailOpenSlug: string;
  pathSeparator: string;
  markup?: string;
  onToggleSidebar?: () => void;

  activeView?: string;
  setActiveView?: (view: string) => void;

  viewWidth?: number;
  setViewWidth?: (width: number) => void;
  viewHeight?: number;
  setViewHeight?: (height: number) => void;
}

export const Topbar = ({
  currentEmailOpenSlug,
  pathSeparator,
  markup,
  activeView,
  setActiveView,
  viewWidth,
  setViewWidth,
  viewHeight,
  setViewHeight,
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

        <div className="flex gap-3 justify-between items-center lg:justify-start w-full lg:w-fit">
          {setViewWidth && setViewHeight && viewWidth && viewHeight ? (
            <ViewSizeControls
              setViewHeight={setViewHeight}
              setViewWidth={setViewWidth}
              viewHeight={viewHeight}
              viewWidth={viewWidth}
            />
          ) : null}

          {activeView && setActiveView ? (
            <ActiveViewToggleGroup
              activeView={activeView}
              setActiveView={setActiveView}
            />
          ) : null}

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
