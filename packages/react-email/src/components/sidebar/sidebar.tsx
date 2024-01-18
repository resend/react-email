'use client';

import * as React from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { useEmails } from '../../contexts/emails';
import { cn } from '../../utils';
import { Logo } from '../logo';
import { SidebarDirectoryChildren } from './sidebar-directory-children';

type SidebarElement = React.ElementRef<'aside'>;
type RootProps = React.ComponentPropsWithoutRef<'aside'>;

interface SidebarProps extends RootProps {
  currentEmailOpenSlug?: string;
}

export const Sidebar = React.forwardRef<SidebarElement, Readonly<SidebarProps>>(
  ({ className, currentEmailOpenSlug, ...props }, forwardedRef) => {
    const { emailsDirectoryMetadata } = useEmails();

    return (
      <aside
        className={cn('border-r flex flex-col border-slate-6', className)}
        ref={forwardedRef}
        {...props}
      >
        <div className="p-4 h-[70px] flex-shrink items-center hidden lg:flex ">
          <Logo />
        </div>
        <nav className="p-4 flex-grow lg:pt-0 pl-0 w-screen h-full md:w-full md:min-w-[275px] md:max-w-[275px] flex flex-col overflow-y-scroll">
          <Collapsible.Root>
            <SidebarDirectoryChildren
              currentEmailOpenSlug={currentEmailOpenSlug}
              emailsDirectoryMetadata={emailsDirectoryMetadata}
              isRoot
              open
            />
          </Collapsible.Root>
        </nav>
      </aside>
    );
  },
);

Sidebar.displayName = 'Sidebar';
