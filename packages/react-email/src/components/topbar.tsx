import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { LayoutGroup, motion } from 'framer-motion';
import * as React from 'react';
import { cn } from '../utils';
import { Heading } from './heading';
import { Send } from './send';

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
  const columnWidth = 'w-[200px]';

  return (
    <header
      className={cn(
        'bg-black flex relative items-center px-6 justify-between h-[70px] border-b border-slate-6',
        className,
      )}
      {...props}
    >
      <div
        className={`items-center overflow-hidden hidden lg:flex ${columnWidth}`}
      >
        <Heading as="h2" className="truncate" size="2" weight="medium">
          {currentEmailOpenSlug}
        </Heading>
      </div>

      <div className={`${columnWidth}`}>
        <LayoutGroup id="topbar">
          {setActiveView ? (
            <ToggleGroup.Root
              aria-label="View mode"
              className="inline-block items-center bg-slate-2 border border-slate-6 rounded-md overflow-hidden"
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
                    'text-sm font-medium px-1 py-1 sm:px-3 sm:py-2 transition ease-in-out duration-200 relative hover:text-slate-12',
                    {
                      'text-slate-11': activeView === 'source',
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
                      layoutId="topbar"
                    />
                  )}
                  Desktop
                </motion.div>
              </ToggleGroup.Item>
              <ToggleGroup.Item value="source">
                <motion.div
                  className={cn(
                    'text-sm font-medium px-3 py-2 transition ease-in-out duration-200 relative hover:text-slate-12',
                    {
                      'text-slate-11': activeView === 'desktop',
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
                      layoutId="nav"
                    />
                  )}
                  Source
                </motion.div>
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          ) : null}
        </LayoutGroup>
      </div>

      {markup ? (
        <div className={`flex justify-end ${columnWidth}`}>
          <Send markup={markup} />
        </div>
      ) : null}
    </header>
  );
};
