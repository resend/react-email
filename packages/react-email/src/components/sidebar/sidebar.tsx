'use client';

import * as Collapsible from '@radix-ui/react-collapsible';
import * as React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { clsx } from 'clsx';
import { useEmails } from '../../contexts/emails';
import { cn } from '../../utils';
import { Logo } from '../logo';
import { IconEmail } from '../icons/icon-email';
import { IconLink } from '../icons/icon-link';
import { IconImage } from '../icons/icon-image';
import { SidebarDirectoryChildren } from './file-tree-directory-childrenen';
import { LinkChecker } from './link-checker';
import { FileTree } from './file-tree';

interface SidebarProps {
  className?: string;
  currentEmailOpenSlug?: string;
  style?: React.CSSProperties;
}

interface SidebarTabTriggerProps {
  className?: string;
  children?: React.ReactNode;

  disabled?: boolean;
  tabValue: SidebarTab;
  activeTabValue: SidebarTab;
}

type SidebarTab = 'file-tree' | 'link-checker' | 'image-checker';

const SidebarTabTrigger = ({
  children,
  className,
  tabValue,
  disabled,
  activeTabValue,
}: SidebarTabTriggerProps) => {
  return (
    <Tabs.Trigger
      className={clsx(
        'w-[40px] h-[40px] disabled:bg-slate-4 disabled:text-slate-10 flex items-center justify-center bg-transparent data-[active=true]:bg-slate-6 text-white',
        className,
      )}
      data-active={tabValue === activeTabValue}
      disabled={disabled}
      value={tabValue}
    >
      {children}
    </Tabs.Trigger>
  );
};

export const Sidebar = ({
  className,
  currentEmailOpenSlug,
  style,
}: SidebarProps) => {
  const [activeTabValue, setActiveTabValue] =
    React.useState<SidebarTab>('file-tree');
  const { emailsDirectoryMetadata } = useEmails();

  return (
    <Tabs.Root
      asChild
      onValueChange={(v) => {
        setActiveTabValue(v as SidebarTab);
      }}
      orientation="vertical"
      value={activeTabValue}
    >
      <aside
        className={cn('border-r flex flex-col border-slate-6', className)}
        style={{ ...style }}
      >
        <div className="flex border-t border-slate-6 h-screen">
          <Tabs.List className="flex flex-col w-[40px] h-full border-r border-slate-6">
            <SidebarTabTrigger
              activeTabValue={activeTabValue}
              tabValue="file-tree"
            >
              <IconEmail height="24" width="24" />
            </SidebarTabTrigger>
            <SidebarTabTrigger
              activeTabValue={activeTabValue}
              className="relative"
              disabled={currentEmailOpenSlug === undefined}
              tabValue="link-checker"
            >
              <IconLink height="24" width="24" />
            </SidebarTabTrigger>
            <SidebarTabTrigger
              activeTabValue={activeTabValue}
              className="relative"
              disabled={currentEmailOpenSlug === undefined}
              tabValue="image-checker"
            >
              <IconImage height="24" width="24" />
            </SidebarTabTrigger>
          </Tabs.List>
          <div>
            <div className="p-4 h-[70px] flex-shrink items-center hidden lg:flex">
              <Logo />
            </div>
            <div className="h-[calc(100vh-70px)]">
              {activeTabValue === 'link-checker' && currentEmailOpenSlug ? (
                <LinkChecker currentEmailOpenSlug={currentEmailOpenSlug} />
              ) : null}
              {activeTabValue === 'image-checker' && currentEmailOpenSlug ? (
                <LinkChecker currentEmailOpenSlug={currentEmailOpenSlug} />
              ) : null}
              {activeTabValue === 'file-tree' ? (
                <FileTree
                  currentEmailOpenSlug={currentEmailOpenSlug}
                  emailsDirectoryMetadata={emailsDirectoryMetadata}
                />
              ) : null}
            </div>
          </div>
        </div>
      </aside>
    </Tabs.Root>
  );
};
