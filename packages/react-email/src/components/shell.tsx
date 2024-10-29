'use client';
import * as React from 'react';
import { cn } from '../utils';
import { Logo } from './logo';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { ThemeProvider } from './theme-context';

type RootProps = React.ComponentPropsWithoutRef<'div'>;

interface ShellProps extends RootProps {
  markup?: string;
  currentEmailOpenSlug?: string;
  pathSeparator?: string;
  activeView?: string;
  setActiveView?: (view: string) => void;
  theme?: string;
  setTheme?: (theme: string) => void;
}

export const Shell = ({
  currentEmailOpenSlug,
  children,
  pathSeparator,
  markup,
  activeView,
  setActiveView,
  theme,
  setTheme,
}: ShellProps) => {
  const [sidebarToggled, setSidebarToggled] = React.useState(false);
  const [triggerTransition, setTriggerTransition] = React.useState(false);

  return (
    <ThemeProvider setTheme={setTheme} theme={theme}>
      <div className="flex bg-black text-white flex-col h-screen overflow-x-hidden">
        <div className="flex lg:hidden items-center px-6 justify-between h-[70px] border-b border-slate-6">
          <div className="h-[70px] flex items-center">
            <Logo />
          </div>

          <button
            className="h-6 w-6 rounded flex items-center justify-center text-white"
            onClick={() => {
              setSidebarToggled((v) => !v);
            }}
            type="button"
          >
            <svg
              fill="none"
              height="16"
              stroke="white"
              viewBox="0 0 15 15"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="flex bg-slate-2">
          <Sidebar
            className={cn(
              'w-screen max-w-full bg-black h-screen lg:h-auto z-50 lg:z-auto lg:max-w-[275px] fixed top-[70px] lg:top-0 left-0',
              {
                'translate-x-0 lg:-translate-x-full': sidebarToggled,
                '-translate-x-full lg:translate-x-0': !sidebarToggled,
              },
            )}
            currentEmailOpenSlug={currentEmailOpenSlug}
            style={{
              transition: triggerTransition ? 'transform 0.2s ease-in-out' : '',
            }}
          />

          <main
            className={cn(
              'absolute will-change-width h-screen w-[100vw] right-0',
              {
                'lg:translate-x-0 lg:w-[calc(100vw)]': sidebarToggled,
                'lg:translate-x-0 lg:w-[calc(100vw-275px)]': !sidebarToggled,
              },
            )}
            style={{
              transition: triggerTransition
                ? 'width 0.2s ease-in-out, transform 0.2s ease-in-out'
                : '',
            }}
          >
            {currentEmailOpenSlug && pathSeparator ? (
              <Topbar
                activeView={activeView}
                currentEmailOpenSlug={currentEmailOpenSlug}
                markup={markup}
                onToggleSidebar={() => {
                  setTriggerTransition(true);

                  requestAnimationFrame(() => {
                    setSidebarToggled((v) => !v);
                  });

                  setTimeout(() => {
                    setTriggerTransition(false);
                  }, 300);
                }}
                pathSeparator={pathSeparator}
                setActiveView={setActiveView}
                theme={theme}
                setTheme={setTheme}
              />
            ) : null}

            <div className="h-[calc(100vh_-_70px)] overflow-auto mx-auto ">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};
