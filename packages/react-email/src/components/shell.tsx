'use client';
import * as React from 'react';
import { cn } from '../utils';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { Logo } from './logo';

type RootProps = React.ComponentPropsWithoutRef<'div'>;

interface ShellProps extends RootProps {
  markup?: string;
  currentEmailOpenSlug?: string;
  pathSeparator?: string;
  activeView?: string;
  setActiveView?: (view: string) => void;
}

export const Shell = ({
  currentEmailOpenSlug,
  children,
  pathSeparator,
  markup,
  activeView,
  setActiveView,
}: ShellProps) => {
  const [sidebarToggled, setSidebarToggled] = React.useState(false);
  const [triggerTransition, setTriggerTransition] = React.useState(false);

  return (
    <>
      <div className="flex h-[4.375rem] items-center justify-between border-b border-slate-6 px-6 lg:hidden">
        <div className="flex h-[4.375rem] items-center">
          <Logo />
        </div>
        <button
          className="flex h-6 w-6 items-center justify-center rounded text-white"
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
            <title>Menu</title>
            <path
              clipRule="evenodd"
              d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <Sidebar
        className={cn(
          'fixed left-0 top-[4.375rem] z-50 h-screen w-screen max-w-full will-change-auto lg:top-0 lg:z-auto lg:h-auto lg:max-w-[18rem]',
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
          'will-change-width w-[100vw] overflow-hidden p-2 md:absolute md:right-0 lg:h-screen',
          {
            'lg:w-[calc(100vw)] lg:translate-x-0': sidebarToggled,
            'lg:w-[calc(100vw-18rem)] lg:translate-x-0': !sidebarToggled,
          },
        )}
        style={{
          transition: triggerTransition
            ? 'width 0.2s ease-in-out, transform 0.2s ease-in-out'
            : '',
        }}
      >
        <div className="h-full w-full border-slate-6 lg:rounded-lg lg:border lg:shadow-sm">
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
            />
          ) : null}
          <div className="mx-auto h-[calc(100vh-4.375rem)] grow md:h-full">
            {children}
          </div>
        </div>
      </main>
    </>
  );
};
