'use client';

import * as Collapsible from '@radix-ui/react-collapsible';
import * as React from 'react';
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
      className={cn('flex flex-col border-slate-6 border-r', className)}
      style={{ ...style }}
    >
      <div className="hidden h-[70px] flex-shrink items-center p-4 lg:flex">
        <Logo />
      </div>
      <nav className="flex h-[calc(100vh_-_70px)] w-screen flex-grow flex-col overflow-y-auto p-4 pl-0 lg:w-full lg:min-w-[275px] lg:max-w-[275px] lg:pt-0">
        <Collapsible.Root open>
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
