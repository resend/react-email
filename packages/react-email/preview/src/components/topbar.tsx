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
    const columnWidth = 'flex md:w-[200px] min-h-[44px] sm:min-h-fit items-center';

    return (
      <header
        ref={forwardedRef}
        className={classnames(
          'bg-black flex relative items-center flex-wrap py-4 md:py-0 px-6 justify-between md:h-[70px] border-b border-slate-6',
          className,
        )}
        {...props}
      >
        <div className='w-1/2 sm:w-fit flex lg:hidden'>
          <div className='w-10 h-10 flex items-center justify-center rounded-md bg-slate-2 border border-slate-6'>
            <svg className='text-slate-11 w-4 h-4' stroke="currentColor" stroke-width="1.7px" stroke-linecap="round" stroke-linejoin="round" fill="none" viewBox="0 0 24 24" >
              <rect x="2.5" y="3.5" width="19" height="17" rx="3"></rect>
              <line x1="10.5" y1="4" x2="10.5" y2="20" ></line>
              <path d="M7.5 7H5.5"></path>
              <path d="M7.5 10H5.5"></path>
              <path d="M7.5 13H5.5"></path>
            </svg>
          </div>
        </div>

        <div className={`w-1/2 sm:w-fit flex items-center justify-end sm:justify-center lg:justify-start overflow-hidden ${columnWidth}`}>
          <Heading as="h2" size="2" weight="medium" className="truncate">
            {title}
          </Heading>
        </div>

        <div className={`w-2/3 sm:w-fit ${columnWidth} justify-start sm:justify-center`}>
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
          <div className={`w-1/3 sm:w-fit flex justify-end ${columnWidth}`}>
            <Send markup={markup} />
          </div>
        )}
      </header>
    );
  },
);

Topbar.displayName = 'Topbar';
