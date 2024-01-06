import * as React from 'react';
import type { EmailsDirectory } from '@/utils/actions/get-emails-directory-metadata';
import { SidebarDirectory } from './sidebar-directory';

type SidebarElement = React.ElementRef<'aside'>;
type RootProps = React.ComponentPropsWithoutRef<'aside'>;

interface SidebarProps extends RootProps {
  emailsDirectoryMetadata: EmailsDirectory;
  currentEmailOpenSlug?: string;
}

export const Sidebar = React.forwardRef<SidebarElement, Readonly<SidebarProps>>(
  ({ className, emailsDirectoryMetadata, currentEmailOpenSlug, ...props }, forwardedRef) => {
    return (
      <aside className={className} ref={forwardedRef} {...props}>
        <nav className="p-6 w-screen md:w-full md:min-w-[275px] md:max-w-[275px] overflow-x-auto flex flex-col gap-4 border-r border-slate-6">
          <SidebarDirectory
            className="w-fit"
            currentEmailOpenSlug={currentEmailOpenSlug}
            emailsDirectoryMetadata={emailsDirectoryMetadata}
          />
        </nav>
      </aside>
    );
  },
);

Sidebar.displayName = 'Sidebar';
