'use client';

import * as Collapsible from '@radix-ui/react-collapsible';
import * as React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { clsx } from 'clsx';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';
import { useEmails } from '../../contexts/emails';
import { cn } from '../../utils';
import { Logo } from '../logo';
import animatedLinkIcon from '../../animated-icons-data/link.json';
import animatedMailIcon from '../../animated-icons-data/mail.json';
import { useIconAnimation } from '../../hooks/use-icon-animation';
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
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

type SidebarTab = 'file-tree' | 'link-checker' | 'image-checker';

const SidebarTabTrigger = ({
  children,
  className,
  tabValue,
  disabled,
  activeTabValue,
  onMouseEnter,
  onMouseLeave,
}: SidebarTabTriggerProps) => {
  const isActive = tabValue === activeTabValue;

  return (
    <Tabs.Trigger
      className={clsx(
        'group relative aspect-square w-full cursor-pointer text-slate-12 transition-colors duration-150 ease-[cubic-bezier(.36,.66,.6,1)] disabled:cursor-not-allowed disabled:bg-slate-2 disabled:text-slate-10',
        className,
        {
          'bg-slate-6': isActive,
        },
      )}
      data-active={isActive}
      disabled={disabled}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      value={tabValue}
    >
      {isActive ? (
        <motion.div
          className="absolute left-0 top-0 h-full w-1 bg-[#246078] transition-colors duration-300 ease-[bezier(.36,.66,.6,1)] group-hover:bg-[#0BB9CD]"
          layoutId="sidebar-active-tab"
          transition={{ type: 'spring', bounce: 0.12, duration: 0.6 }}
        />
      ) : null}
      <div
        aria-hidden
        className={clsx(
          'pointer-events-none absolute inset-0 flex items-center justify-center pl-1 transition-opacity duration-150 ease-in',
          {
            'opacity-20 group-hover:opacity-60': !isActive,
          },
        )}
      >
        {children}
      </div>
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
  const {
    ref: mailIconRef,
    onMouseEnter: onMailEnter,
    onMouseLeave: onMailLeave,
  } = useIconAnimation();

  const {
    ref: linkIconRef,
    onMouseEnter: onLinkEnter,
    onMouseLeave: onLinkLeave,
  } = useIconAnimation();

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
        className={cn(
          'grid h-screen grid-cols-[3.125rem,1fr] bg-black pr-6 md:px-0',
          className,
        )}
        style={{ ...style }}
      >
        <Tabs.List className="flex h-full flex-col border-r border-slate-6">
          <SidebarTabTrigger
            activeTabValue={activeTabValue}
            onMouseEnter={onMailEnter}
            onMouseLeave={onMailLeave}
            tabValue="file-tree"
          >
            <Lottie
              autoPlay={false}
              animationData={animatedMailIcon as object}
              className="h-5 w-5"
              loop={false}
              lottieRef={mailIconRef}
            />
          </SidebarTabTrigger>
          <SidebarTabTrigger
            activeTabValue={activeTabValue}
            className="relative"
            disabled={currentEmailOpenSlug === undefined}
            onMouseEnter={onLinkEnter}
            onMouseLeave={onLinkLeave}
            tabValue="link-checker"
          >
            <Lottie
              autoPlay={false}
              animationData={animatedLinkIcon as object}
              className="h-6 w-6"
              loop={false}
              lottieRef={linkIconRef}
            />
          </SidebarTabTrigger>
        </Tabs.List>
        <div className="flex flex-col pl-4 md:pr-1 md:pt-[.625rem]">
          <div className="hidden h-8 flex-shrink items-center pl-1 lg:flex">
            <Logo />
          </div>
          <div className="h-[calc(100vh-4.375rem)] w-full">
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
      </aside>
    </Tabs.Root>
  );
};
