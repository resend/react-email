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
  const isActive = tabValue === activeTabValue;

  return (
    <Tabs.Trigger
      className={clsx(
        'relative flex aspect-square w-full cursor-pointer items-center justify-center pl-1 text-slate-12 transition-colors duration-150 ease-[bezier(.36,.66,.6,1)] disabled:cursor-not-allowed disabled:bg-slate-2 disabled:text-slate-10',
        className,
        {
          'bg-slate-6': isActive,
        },
      )}
      data-active={isActive}
      disabled={disabled}
      value={tabValue}
    >
      <div
        className={clsx(
          'absolute left-0 top-0 h-full w-1 transition-colors duration-75 ease-[bezier(.36,.66,.6,1)]',
          {
            'bg-[#246078]': isActive,
          },
        )}
        data-active={isActive}
      />
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
        className={cn('flex flex-col bg-black', className)}
        style={{ ...style }}
      >
        <div className="flex h-screen">
          <Tabs.List className="flex h-full w-[3rem] flex-col border-r border-slate-6">
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
          </Tabs.List>
          <div className="flex flex-col p-1 pt-[.625rem]">
            <div className="hidden h-8 flex-shrink items-center pl-1 lg:flex">
              <Logo />
            </div>
            <div className="h-[calc(100vh-4.375rem)]">
              {activeTabValue === 'link-checker' && currentEmailOpenSlug ? (
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
