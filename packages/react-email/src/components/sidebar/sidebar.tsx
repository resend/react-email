'use client';

import * as React from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { useEmails } from '../../contexts/emails';
import { cn } from '../../utils';
import { Logo } from '../logo';
import { SidebarDirectoryChildren } from './sidebar-directory-children';

interface SidebarProps {
  className?: string;
  currentEmailOpenSlug?: string;
}

export const Sidebar = ({ className, currentEmailOpenSlug }: SidebarProps) => {
  const { emailsDirectoryMetadata } = useEmails();

  return (
    <aside className={cn('border-r flex flex-col border-slate-6', className)}>
      <div className="p-4 h-[70px] flex-shrink items-center hidden lg:flex">
        <Logo />
      </div>
      <nav className="p-4 flex-grow lg:pt-0 pl-0 w-screen h-[calc(100vh_-_70px)] md:w-full md:min-w-[275px] md:max-w-[275px] flex flex-col overflow-y-auto">
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
};
