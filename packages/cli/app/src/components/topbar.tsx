import * as ToggleGroup from '@radix-ui/react-toggle-group';
import classnames from 'classnames';
import { LayoutGroup, motion } from 'framer-motion';
import * as React from 'react';

import { Heading } from './heading';

type TopbarElement = React.ElementRef<'header'>;
type RootProps = React.ComponentPropsWithoutRef<'header'>;

interface TopbarProps extends RootProps {
  activeView?: string;
  markup?: string;
  setActiveView?: (view: string) => void;
  title: string;
}

export const Topbar = React.forwardRef<TopbarElement, Readonly<TopbarProps>>(
  ({ className, title, markup, activeView, setActiveView, ...props }, forwardedRef) => {
    const button = 'text-sm font-medium px-3 py-2 transition ease-in-out duration-200 relative';
    const span = 'absolute left-0 right-0 top-0 bottom-0 bg-cta-bg';

    return (
      <header
        ref={forwardedRef}
        className={classnames(
          'bg-dark-bg flex relative items-center px-6 justify-between h-[70px] border-b border-dark-bg-border',
          className
        )}
        {...props}
      >
        <div className={`items-center overflow-hidden hidden lg:flex`}>
          <Heading as="h2" className="truncate text">
            {title}
          </Heading>
        </div>

        <div>
          <LayoutGroup id="topbar">
            {setActiveView && (
              <ToggleGroup.Root
                className="inline-block items-center bg-darker-bg border border-dark-bg-border rounded overflow-hidden"
                type="single"
                value={activeView}
                aria-label="View mode"
                onValueChange={(value) => {
                  if (!value) return;
                  setActiveView(value);
                }}
              >
                <ToggleGroup.Item value="desktop">
                  <motion.div className={classnames(button, 'px-1 py-1 sm:px-3 sm:py-2')}>
                    {activeView === 'desktop' && (
                      <motion.span
                        layoutId="topbar"
                        className={span}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                    <span
                      className={classnames('relative', {
                        'text-cta-text': activeView === 'desktop'
                      })}
                    >
                      Desktop
                    </span>
                  </motion.div>
                </ToggleGroup.Item>
                <ToggleGroup.Item value="jsx">
                  <motion.div className={classnames(button)}>
                    {activeView === 'jsx' && (
                      <motion.span
                        layoutId="nav"
                        className={span}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                    <span
                      className={classnames('relative', {
                        'text-cta-text': activeView === 'jsx'
                      })}
                    >
                      {'< jsx />'}
                    </span>
                  </motion.div>
                </ToggleGroup.Item>
                <ToggleGroup.Item value="html">
                  <motion.div className={classnames(button)}>
                    {activeView === 'html' && (
                      <motion.span
                        layoutId="nav"
                        className={span}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                    <span
                      className={classnames('relative', {
                        'text-cta-text': activeView === 'html'
                      })}
                    >
                      {'< html />'}
                    </span>
                  </motion.div>
                </ToggleGroup.Item>
                <ToggleGroup.Item value="plain">
                  <motion.div className={classnames(button)}>
                    {activeView === 'plain' && (
                      <motion.span
                        layoutId="nav"
                        className={span}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                    <span
                      className={classnames('relative', {
                        'text-cta-text': activeView === 'plain'
                      })}
                    >
                      Plain Text
                    </span>
                  </motion.div>
                </ToggleGroup.Item>
              </ToggleGroup.Root>
            )}
          </LayoutGroup>
        </div>
      </header>
    );
  }
);

Topbar.displayName = 'Topbar';
