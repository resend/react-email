import * as React from 'react';
import { Topbar } from './topbar';
import { Sidebar } from './sidebar';

type LayoutElement = React.ElementRef<'div'>;
type RootProps = React.ComponentPropsWithoutRef<'div'>;

interface LayoutProps extends RootProps {
  navItems: string[];
  markup?: string;
  viewMode?: string;
  setViewMode?: (viewMode: string) => void;
}

export const Layout = React.forwardRef<LayoutElement, Readonly<LayoutProps>>(
  (
    {
      className,
      title,
      navItems,
      children,
      markup,
      viewMode,
      setViewMode,
      ...props
    },
    forwardedRef,
  ) => {
    return (
      <>
        <main className="bg-black flex flex-col lg:flex-row min-h-screen">
          <Sidebar navItems={navItems} />

          <div className="w-full ">
            {title && (
              <Topbar
                title={title}
                viewMode={viewMode}
                setViewMode={setViewMode}
                markup={markup}
              />
            )}

            <article>{children}</article>
          </div>
        </main>
      </>
    );
  },
);

Layout.displayName = 'Layout';
