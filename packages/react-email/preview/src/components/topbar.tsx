import * as React from 'react';
import classnames from 'classnames';
import { Heading } from './heading';
import { Text } from './text';
import { Send } from './send';
import * as ToggleGroup from '@radix-ui/react-toggle-group';

type TopbarElement = React.ElementRef<'header'>;
type RootProps = React.ComponentPropsWithoutRef<'header'>;

interface TopbarProps extends RootProps {
  title: string;
  viewMode?: string;
  markup?: string;
  setViewMode?: (viewMode: string) => void;
}

export const Topbar = React.forwardRef<TopbarElement, Readonly<TopbarProps>>(
  ({ className, title, markup, viewMode, setViewMode, ...props }, forwardedRef) => {
    const columnWidth = 'w-[200px]';

    return (
      <header
        ref={forwardedRef}
        className={classnames(
          'bg-black flex relative items-center px-6 justify-between h-[70px] border-b border-slate-6',
          className,
        )}
        {...props}
      >
        <div className={`flex items-center overflow-hidden ${columnWidth}`}>
          <Heading as="h2" size="2" weight="medium" className="truncate">
            {title}
          </Heading>
        </div>

        <div className={`${columnWidth}`}>
          {setViewMode && (
            <ToggleGroup.Root
              className="w-[145px] m-auto items-center bg-slate-2 p-1.5 flex gap-1 border border-slate-6 rounded-md"
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
              <ToggleGroup.Item
                className={classnames(
                  'text-sm text-slate-11 rounded px-1.5 py-0.5',
                  {
                    'text-slate-12 bg-slate-3 font-medium':
                      viewMode === 'desktop',
                  },
                )}
                value="desktop"
              >
                Desktop
              </ToggleGroup.Item>
              <ToggleGroup.Item
                className={classnames(
                  'text-sm text-slate-11 rounded px-1.5 py-0.5',
                  {
                    'text-slate-12 bg-slate-3 font-medium': viewMode === 'source',
                  },
                )}
                value="source"
              >
                Source
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          )}
        </div>

        {markup && (
          <div className={`flex justify-end ${columnWidth}`}>
            <Send markup={markup} />
          </div>
        )}
      </header>
    );
  },
);

Topbar.displayName = 'Topbar';
