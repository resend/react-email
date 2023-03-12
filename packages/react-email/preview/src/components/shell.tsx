import * as React from 'react';
import { Topbar } from './topbar';
import { Sidebar } from './sidebar';

type ShellElement = React.ElementRef<'div'>;
type RootProps = React.ComponentPropsWithoutRef<'div'>;

interface ShellProps extends RootProps {
  navItems: string[];
  markup?: string;
  activeView?: string;
  setActiveView?: (view: string) => void;
}

export const Shell = React.forwardRef<ShellElement, Readonly<ShellProps>>(
  ({ title, navItems, children, markup, activeView, setActiveView }, forwardedRef) => {
    return (
      <div ref={forwardedRef} className="flex justify-between h-screen">
        <Sidebar navItems={navItems} title={title} />
        <main className="w-[calc(100%_-_275px)] bg-slate-2">
          {title && (
            <Topbar
              title={title}
              activeView={activeView}
              setActiveView={setActiveView}
              markup={markup}
            />
          )}
          <div className="relative h-[calc(100vh_-_70px)] overflow-auto">
            <div className="mx-auto">{children}</div>
          </div>
        </main>
      </div>
    );
  },
);

Shell.displayName = 'Shell';
