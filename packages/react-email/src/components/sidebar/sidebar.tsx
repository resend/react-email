'use client';

import * as Collapsible from '@radix-ui/react-collapsible';
import * as React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import clsx from 'clsx';
import { useEmails } from '../../contexts/emails';
import { cn } from '../../utils';
import { Logo } from '../logo';
import { IconEmail } from '../icons/icon-email';
import { IconStamp } from '../icons/icon-stamp';
import type { EmailValidationWarning } from '../../actions/get-warnings-for-emails';
import { SidebarDirectoryChildren } from './sidebar-directory-children';

interface SidebarProps {
  className?: string;
  emailValidationWarnings?: EmailValidationWarning[];
  currentEmailOpenSlug?: string;
  style?: React.CSSProperties;
}

interface SidebarTabTriggerProps {
  className?: string;
  children?: React.ReactNode;

  tabValue: SidebarTab;
  activeTabValue: SidebarTab;
}

type SidebarTab = 'email-templates' | 'validation';

const SidebarTabTrigger = ({
  children,
  className,
  tabValue,
  activeTabValue,
}: SidebarTabTriggerProps) => {
  return (
    <Tabs.Trigger
      className={clsx(
        'w-[36px] h-[36px] flex items-center justify-center bg-transparent data-[active=true]:bg-slate-6 text-white',
        className,
      )}
      data-active={tabValue === activeTabValue}
      value={tabValue}
    >
      {children}
    </Tabs.Trigger>
  );
};

export const Sidebar = ({
  className,
  currentEmailOpenSlug,
  emailValidationWarnings,
  style,
}: SidebarProps) => {
  const [activeTabValue, setActiveTabValue] =
    React.useState<SidebarTab>('email-templates');
  const { emailsDirectoryMetadata } = useEmails();

  return (
    <Tabs.Root
      asChild
      onValueChange={(v) => {
        setActiveTabValue(v as SidebarTab);
      }}
      value={activeTabValue}
    >
      <aside
        className={cn('border-r flex flex-col border-slate-6', className)}
        style={{ ...style }}
      >
        <div className="p-4 h-[70px] flex-shrink items-center hidden lg:flex">
          <Logo />
        </div>
        <div className="flex border-t border-slate-6 h-[calc(100vh_-_70px)]">
          <Tabs.List className="flex flex-col w-[36px] h-full border-r border-slate-6">
            <SidebarTabTrigger
              activeTabValue={activeTabValue}
              tabValue="email-templates"
            >
              <IconEmail />
            </SidebarTabTrigger>
            <SidebarTabTrigger
              activeTabValue={activeTabValue}
              className="relative"
              tabValue="validation"
            >
              <IconStamp />
              <span className="absolute left-full text-yellow-400 text-xs font-bold -translate-x-full w-5 h-5 top-0 bg-black rounded-full border-2 border-slate-6">
                {emailValidationWarnings?.length}
              </span>
            </SidebarTabTrigger>
          </Tabs.List>
          <Tabs.Content className="flex flex-col" value="email-templates">
            <nav className="p-4 flex-grow lg:pt-0 pl-0 w-[calc(100vw-36px)] h-full lg:w-full lg:min-w-[231px] lg:max-w-[231px] flex flex-col overflow-y-auto">
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
          </Tabs.Content>
        </div>
      </aside>
    </Tabs.Root>
  );
};
