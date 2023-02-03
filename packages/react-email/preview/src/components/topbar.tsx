import * as React from 'react';
import classnames from 'classnames';
import { Heading } from './heading';
import { Send } from './send';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { AnimateSharedLayout, motion } from 'framer-motion';

type TopbarElement = React.ElementRef<'header'>;
type RootProps = React.ComponentPropsWithoutRef<'header'>;

interface TopbarProps extends RootProps {
  title: string;
  viewMode?: string;
  markup?: string;
  setViewMode?: (viewMode: string) => void;
}

export const Topbar = React.forwardRef<TopbarElement, Readonly<TopbarProps>>(
  (
    { className, title, markup, viewMode, setViewMode, ...props },
    forwardedRef,
  ) => {
    const [hovered, setHovered] = React.useState('');
    const columnWidth = 'w-[200px]';

    return (
      <header
        ref={forwardedRef}
        className={classnames(
          'bg-black h-[50px] lg:h-[70px] flex items-center justify-around relative  px-6  border-b border-slate-6',
          className,
        )}
        {...props}
      >
        <div className={` overflow-hidden `}>
          <Heading as="h2" size="2" weight="medium" className="truncate">
            {title}
          </Heading>
        </div>

        <div>
          <AnimateSharedLayout>
            {setViewMode && (
              <ToggleGroup.Root
                className="inline-block items-center bg-slate-2 border border-slate-6 rounded-md overflow-hidden"
                type="single"
                value={viewMode}
                aria-label="View mode"
                onValueChange={(value) => {
                  if (!value) {
                    return setViewMode('desktop');
                  }
                  setViewMode(value);
                }}
              >
                <ToggleGroup.Item value="desktop">
                  <motion.div
                    className={classnames(
                      'text-sm text-slate-11 font-medium px-3 py-2 transition ease-in-out duration-200 relative',
                      {
                        'text-slate-12': viewMode === 'desktop',
                      },
                    )}
                    onHoverStart={() => setHovered('desktop')}
                    onHoverEnd={() => setHovered('')}
                  >
                    {hovered === 'desktop' && (
                      <motion.span
                        layoutId="nav"
                        className="absolute left-0 right-0 top-0 bottom-0 bg-slate-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                    Desktop
                  </motion.div>
                </ToggleGroup.Item>
                <ToggleGroup.Item value="source">
                  <motion.div
                    className={classnames(
                      'text-sm text-slate-11 font-medium px-3 py-2 transition ease-in-out duration-200 relative',
                      {
                        'text-slate-12': viewMode === 'source',
                      },
                    )}
                    onHoverStart={() => setHovered('source')}
                    onHoverEnd={() => setHovered('')}
                  >
                    {hovered === 'source' && (
                      <motion.span
                        layoutId="nav"
                        className="absolute left-0 right-0 top-0 bottom-0 bg-slate-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                    Source
                  </motion.div>
                </ToggleGroup.Item>
              </ToggleGroup.Root>
            )}
          </AnimateSharedLayout>
        </div>

        {markup && (
          <div>
            <Send markup={markup} />
          </div>
        )}
      </header>
    );
  },
);

Topbar.displayName = 'Topbar';
