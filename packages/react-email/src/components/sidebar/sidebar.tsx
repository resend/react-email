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
  style?: React.CSSProperties;
}

export const Sidebar = ({
  className,
  currentEmailOpenSlug,
  style,
}: SidebarProps) => {
  const { emailsDirectoryMetadata } = useEmails();

  return (
    <aside
      className={cn('border-r flex flex-col border-slate-6', className)}
      style={{ ...style }}
    >
      <div className="p-4 h-[70px] flex-shrink items-center hidden lg:flex">
        <Logo />
      </div>
      <nav className="p-4 flex-grow lg:pt-0 pl-0 w-screen h-[calc(100vh_-_70px)] lg:w-full lg:min-w-[275px] lg:max-w-[275px] flex flex-col overflow-y-auto">
        <Collapsible.Root>
          <React.Suspense>
            <SidebarDirectoryChildren
              currentEmailOpenSlug={currentEmailOpenSlug}
              emailsDirectoryMetadata={emailsDirectoryMetadata}
              isRoot
              open
            />
          </React.Suspense>
        </Collapsible.Root>
      </nav>
    </aside>
  );
};
