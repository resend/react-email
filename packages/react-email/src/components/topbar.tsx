'use client';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { LayoutGroup, motion } from 'framer-motion';
import * as React from 'react';
import { cn } from '../utils';
import { tabTransition } from '../utils/constants';
import { Heading } from './heading';
import { Send } from './send';
import { IconMonitor } from './icons/icon-monitor';
import { IconSource } from './icons/icon-source';
import { IconPhone } from './icons/icon-phone';
import { IconHideSidebar } from './icons/icon-hide-sidebar';

type RootProps = React.ComponentPropsWithoutRef<'header'>;

interface TopbarProps extends RootProps {
  currentEmailOpenSlug: string;
  activeView?: string;
  markup?: string;
  setActiveView?: (view: string) => void;
}

export const Topbar: React.FC<Readonly<TopbarProps>> = ({
  className,
  currentEmailOpenSlug,
  markup,
  activeView,
  setActiveView,
  ...props
}) => {
  return (
    <header
      className={cn(
        'bg-black flex relative items-center px-4 lg:justify-between justify-end h-[70px] border-b border-slate-6',
        className,
      )}
      {...props}
    >
      <button className="hidden lg:flex rounded-lg px-2 py-2 transition ease-in-out duration-200 relative hover:bg-slate-5 text-slate-11 hover:text-slate-12">
        <IconHideSidebar height={20} width={20} />
      </button>

      <div className="items-center overflow-hidden hidden lg:flex text-center absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
        <Heading as="h2" className="truncate" size="2" weight="medium">
          {currentEmailOpenSlug}
        </Heading>
      </div>

      <div className="flex gap-3">
        <LayoutGroup id="topbar">
          {setActiveView ? (
            <ToggleGroup.Root
              aria-label="View mode"
              className="inline-block items-center bg-slate-2 border border-slate-6 rounded-md overflow-hidden h-[36px]"
              onValueChange={(value) => {
                if (!value) return;
                setActiveView(value);
              }}
              type="single"
              value={activeView}
            >
              <ToggleGroup.Item value="desktop">
                <motion.div
                  className={cn(
                    'px-3 py-2 transition ease-in-out duration-200 relative hover:text-slate-12',
                    {
                      'text-slate-11': activeView !== 'desktop',
                      'text-slate-12': activeView === 'desktop',
                    },
                  )}
                >
                  {activeView === 'desktop' && (
                    <motion.span
                      animate={{ opacity: 1 }}
                      className="absolute left-0 right-0 top-0 bottom-0 bg-slate-4"
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
                      layoutId="topbar-tabs"
                      transition={tabTransition}
                    />
                  )}
                  <IconMonitor />
                </motion.div>
              </ToggleGroup.Item>
              <ToggleGroup.Item value="mobile">
                <motion.div
                  className={cn(
                    'px-3 py-2 transition ease-in-out duration-200 relative hover:text-slate-12',
                    {
                      'text-slate-11': activeView !== 'mobile',
                      'text-slate-12': activeView === 'mobile',
                    },
                  )}
                >
                  {activeView === 'mobile' && (
                    <motion.span
                      animate={{ opacity: 1 }}
                      className="absolute left-0 right-0 top-0 bottom-0 bg-slate-4"
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
                      layoutId="topbar-tabs"
                      transition={tabTransition}
                    />
                  )}
                  <IconPhone />
                </motion.div>
              </ToggleGroup.Item>
              <ToggleGroup.Item value="source">
                <motion.div
                  className={cn(
                    'px-3 py-2 transition ease-in-out duration-200 relative hover:text-slate-12',
                    {
                      'text-slate-11': activeView !== 'source',
                      'text-slate-12': activeView === 'source',
                    },
                  )}
                >
                  {activeView === 'source' && (
                    <motion.span
                      animate={{ opacity: 1 }}
                      className="absolute left-0 right-0 top-0 bottom-0 bg-slate-4"
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
                      layoutId="topbar-tabs"
                      transition={tabTransition}
                    />
                  )}
                  <IconSource />
                </motion.div>
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          ) : null}
        </LayoutGroup>
        {markup ? (
          <div className="flex justify-end">
            <Send markup={markup} />
          </div>
        ) : null}
      </div>
    </header>
  );
};
