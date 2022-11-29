import * as React from 'react';
import { Topbar } from './topbar';
import { Sidebar } from './sidebar';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import classnames from 'classnames';

type LayoutElement = React.ElementRef<'div'>;
type RootProps = React.ComponentPropsWithoutRef<'div'>;

interface LayoutProps extends RootProps {
  navItems: string[];
  viewMode?: string;
  setViewMode?: (viewMode: string) => void;
}

export const Layout = React.forwardRef<LayoutElement, Readonly<LayoutProps>>(
  (
    { className, title, navItems, children, viewMode, setViewMode, ...props },
    forwardedRef,
  ) => {
    return (
      <>
        <div className="flex justify-between h-screen">
          <Sidebar navItems={navItems} />
          <main className="w-full bg-slate-2">
            {title && <Topbar title={title} />}
            <div className="relative h-[calc(100vh_-_70px)] overflow-auto">
              {setViewMode && (
                <ToggleGroup.Root
                  className="items-center bg-slate-2 p-1.5 flex gap-1 border border-slate-6 rounded-md absolute top-4 right-4"
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
                        'text-slate-12 bg-slate-3 font-medium':
                          viewMode === 'source',
                      },
                    )}
                    value="source"
                  >
                    Source
                  </ToggleGroup.Item>
                </ToggleGroup.Root>
              )}
              <div className="mx-auto">{children}</div>
            </div>
          </main>
        </div>
      </>
    );
  },
);

Layout.displayName = 'Layout';
