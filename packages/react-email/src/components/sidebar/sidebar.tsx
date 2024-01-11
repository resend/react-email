'use client';

import * as React from 'react';
import { useEmails } from '../../contexts/emails';
import { SidebarDirectory } from './sidebar-directory';

type SidebarElement = React.ElementRef<'aside'>;
type RootProps = React.ComponentPropsWithoutRef<'aside'>;

interface SidebarProps extends RootProps {
  currentEmailOpenSlug?: string;
}

export const Sidebar = React.forwardRef<SidebarElement, Readonly<SidebarProps>>(
  (
    {
      className,
      currentEmailOpenSlug,
      ...props
    },
    forwardedRef,
  ) => {
    const { emailsDirectoryMetadata } = useEmails();

    return (
      <aside className={className} ref={forwardedRef} {...props}>
        <nav className="p-6 w-screen md:w-full md:min-w-[275px] md:max-w-[275px] flex flex-col gap-4 border-r border-slate-6">
          <SidebarDirectory
            className="w-fit overflow-x-auto"
            currentEmailOpenSlug={currentEmailOpenSlug}
            emailsDirectoryMetadata={emailsDirectoryMetadata}
          />
        </nav>
      </aside>
    );
  },
);

Sidebar.displayName = 'Sidebar';
