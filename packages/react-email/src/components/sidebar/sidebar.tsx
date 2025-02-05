'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import * as Tabs from '@radix-ui/react-tabs';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type * as React from 'react';
import animatedHelpIcon from '../../animated-icons-data/help.json';
import animatedLinkIcon from '../../animated-icons-data/link.json';
import animatedMailIcon from '../../animated-icons-data/mail.json';
import { useEmails } from '../../contexts/emails';
import { useIconAnimation } from '../../hooks/use-icon-animation';
import { cn } from '../../utils';
import { Button } from '../button';
import { Heading } from '../heading';
import { IconImage } from '../icons/icon-image';
import { Tooltip } from '../tooltip';
import { FileTree } from './file-tree';
import { ImageChecker } from './image-checker';
import { LinkChecker } from './link-checker';

type SidebarPanelValue = 'file-tree' | 'link-checker' | 'image-checker';

interface SidebarProps {
  className?: string;
  currentEmailOpenSlug?: string;
  markup?: string;
  style?: React.CSSProperties;
}

interface NavigationButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  side?: 'top' | 'bottom' | 'left' | 'right';
  tooltip?: string;
}

interface TabTriggerProps {
  activeTabValue: SidebarPanelValue;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  tabValue: SidebarPanelValue;
  tooltipText: string;
}

interface PanelProps {
  active: boolean;
  children: React.ReactNode;
  title: string;
}

const TAB_ACTION_BASE_CLASSES =
  'group relative aspect-square w-full cursor-pointer text-slate-12 transition-colors duration-150 ease-[cubic-bezier(.36,.66,.6,1)] hover:bg-slate-3 disabled:cursor-not-allowed disabled:bg-slate-2 disabled:text-slate-10';

const NavigationButton = ({
  children,
  className,
  href,
  onMouseEnter,
  onMouseLeave,
  side,
  tooltip,
}: NavigationButtonProps) => (
  <Tooltip.Provider>
    <Tooltip>
      <Tooltip.Trigger asChild>
        <Link
          href={href ?? '#'}
          className={cn(TAB_ACTION_BASE_CLASSES, className)}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {children}
        </Link>
      </Tooltip.Trigger>
      {tooltip && <Tooltip.Content side={side}>{tooltip}</Tooltip.Content>}
    </Tooltip>
  </Tooltip.Provider>
);

const TabTrigger = ({
  activeTabValue,
  children,
  className,
  disabled,
  onMouseEnter,
  onMouseLeave,
  tabValue,
  tooltipText,
}: TabTriggerProps) => {
  const isActive = tabValue === activeTabValue;

  return (
    <Tooltip.Provider>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <Tabs.Trigger
            className={clsx(TAB_ACTION_BASE_CLASSES, className, {
              'bg-slate-6': isActive,
            })}
            data-active={isActive}
            disabled={disabled}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            value={tabValue}
          >
            {isActive && (
              <motion.div
                className="absolute top-0 left-0 h-full w-1 bg-[#0BB9CD] transition-colors duration-300 ease-[bezier(.36,.66,.6,1)]"
                layoutId="sidebar-active-tab"
                transition={{ type: 'spring', bounce: 0.12, duration: 0.6 }}
              />
            )}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center justify-center pl-1 transition-opacity duration-150 ease-in"
            >
              {children}
            </div>
          </Tabs.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Content side="right">{tooltipText}</Tooltip.Content>
      </Tooltip>
    </Tooltip.Provider>
  );
};

const Panel = ({ title, active, children }: PanelProps) => (
  <>
    <div
      className={clsx(
        'hidden min-h-[3.3125rem] flex-shrink items-center p-3 px-4 lg:flex',
        {
          'bg-slate-3': active,
        },
      )}
    >
      <Heading as="h2" className="truncate" size="2" weight="medium">
        {title}
      </Heading>
    </div>
    <div className="-mt-[.5px] relative h-[calc(100vh-4.375rem)] w-full border-slate-4 border-t px-4 pb-3">
      {children}
    </div>
  </>
);

const ReactIcon = () => (
  <svg
    fill="none"
    height="32"
    viewBox="0 0 32 32"
    width="32"
    xmlns="http://www.w3.org/2000/svg"
    className="pointer-events-none duration-300 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:rotate-90"
  >
    <g clipPath="url(#clip0_27_291)">
      <path
        clipRule="evenodd"
        d="M24.4558 24.4853C25.2339 23.7073 25.3805 22.6549 25.2947 21.746C25.2078 20.8254 24.8697 19.8258 24.3896 18.8287C23.957 17.9302 23.3802 16.9745 22.6821 16C23.3802 15.0255 23.957 14.0698 24.3896 13.1713C24.8697 12.1742 25.2078 11.1746 25.2947 10.254C25.3805 9.34508 25.2339 8.29273 24.4558 7.51472C23.6778 6.73671 22.6255 6.59004 21.7165 6.67584C20.796 6.76273 19.7964 7.10086 18.7993 7.58094C17.9007 8.01357 16.945 8.59036 15.9706 9.28842C14.9961 8.59036 14.0404 8.01357 13.1418 7.58094C12.1447 7.10086 11.1451 6.76273 10.2246 6.67584C9.31564 6.59004 8.26329 6.73671 7.48528 7.51472C6.70727 8.29273 6.5606 9.34508 6.6464 10.254C6.7333 11.1746 7.07142 12.1742 7.5515 13.1713C7.98414 14.0698 8.56092 15.0255 9.25898 16C8.56092 16.9745 7.98414 17.9302 7.5515 18.8287C7.07142 19.8258 6.7333 20.8254 6.6464 21.746C6.5606 22.6549 6.70727 23.7073 7.48528 24.4853C8.26329 25.2633 9.31564 25.41 10.2246 25.3242C11.1451 25.2373 12.1447 24.8991 13.1418 24.4191C14.0404 23.9864 14.9961 23.4096 15.9706 22.7116C16.945 23.4096 17.9007 23.9864 18.7993 24.4191C19.7964 24.8991 20.796 25.2373 21.7165 25.3242C22.6255 25.41 23.6778 25.2633 24.4558 24.4853ZM15.9706 20.948C16.8399 20.2684 17.724 19.4874 18.591 18.6205C19.458 17.7535 20.239 16.8693 20.9186 16C20.239 15.1307 19.458 14.2465 18.591 13.3795C17.724 12.5126 16.8399 11.7316 15.9706 11.052C15.1012 11.7316 14.2171 12.5126 13.3501 13.3795C12.4831 14.2465 11.7021 15.1307 11.0225 16C11.7021 16.8693 12.4831 17.7535 13.3501 18.6205C14.2171 19.4874 15.1012 20.2684 15.9706 20.948ZM17.1498 21.8145C17.968 21.1558 18.7885 20.4195 19.5893 19.6187C20.39 18.818 21.1264 17.9974 21.7851 17.1792C23.7187 19.9919 24.4627 22.4819 23.4576 23.487C22.4524 24.4922 19.9625 23.7482 17.1498 21.8145ZM10.156 17.1792C10.8148 17.9974 11.5511 18.818 12.3518 19.6187C13.1526 20.4195 13.9731 21.1558 14.7914 21.8145C11.9786 23.7482 9.48871 24.4922 8.48355 23.487C7.47839 22.4819 8.22238 19.9919 10.156 17.1792ZM10.156 14.8208C10.8148 14.0026 11.5511 13.182 12.3518 12.3813C13.1526 11.5805 13.9731 10.8442 14.7914 10.1855C11.9786 8.25182 9.48871 7.50783 8.48355 8.51299C7.47839 9.51815 8.22238 12.0081 10.156 14.8208ZM17.1498 10.1855C17.968 10.8442 18.7885 11.5805 19.5893 12.3813C20.39 13.182 21.1264 14.0026 21.7851 14.8208C23.7187 12.0081 24.4627 9.51815 23.4576 8.51299C22.4524 7.50783 19.9625 8.25182 17.1498 10.1855Z"
        fill="white"
        fillRule="evenodd"
        stroke="white"
        strokeWidth="0.5"
      />
    </g>
  </svg>
);

export const Sidebar = ({
  className,
  currentEmailOpenSlug,
  markup: emailMarkup,
  style,
}: SidebarProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const activePanelValue = (searchParams.get('sidebar-panel') ??
    'file-tree') as SidebarPanelValue;
  const { emailsDirectoryMetadata } = useEmails();

  const mailAnimation = useIconAnimation();
  const linkAnimation = useIconAnimation();
  const helpAnimation = useIconAnimation();

  const setActivePanelValue = (newValue: SidebarPanelValue) => {
    const params = new URLSearchParams(searchParams);
    params.set('sidebar-panel', newValue);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Tabs.Root
      asChild
      onValueChange={(v) => setActivePanelValue(v as SidebarPanelValue)}
      orientation="vertical"
      value={activePanelValue}
    >
      <aside
        className={cn(
          'fixed top-[4.375rem] left-0 z-[9999] grid h-full max-h-[calc(100dvh-4.375rem)] w-screen max-w-full grid-cols-[3.375rem,1fr] overflow-hidden bg-black will-change-auto lg:top-0 lg:z-auto lg:max-h-screen lg:max-w-[20rem]',
          className,
        )}
        style={style}
      >
        <Tabs.List className="flex h-full flex-col border-slate-6 border-r">
          <TabTrigger
            activeTabValue={activePanelValue}
            onMouseEnter={mailAnimation.onMouseEnter}
            onMouseLeave={mailAnimation.onMouseLeave}
            tabValue="file-tree"
            tooltipText="File Explorer"
          >
            <DotLottieReact
              data={animatedMailIcon}
              autoplay={false}
              className="h-5 w-5"
              loop={false}
              dotLottieRefCallback={(instance) => {
                mailAnimation.ref.current = instance;
              }}
            />
          </TabTrigger>
          <TabTrigger
            activeTabValue={activePanelValue}
            className="relative"
            onMouseEnter={linkAnimation.onMouseEnter}
            onMouseLeave={linkAnimation.onMouseLeave}
            tabValue="link-checker"
            tooltipText="Link Checker"
          >
            <DotLottieReact
              data={animatedLinkIcon}
              autoplay={false}
              className="h-6 w-6"
              loop={false}
              dotLottieRefCallback={(instance) => {
                linkAnimation.ref.current = instance;
              }}
            />
          </TabTrigger>
          <TabTrigger
            activeTabValue={activePanelValue}
            className="relative"
            tabValue="image-checker"
            tooltipText="Image Checker"
          >
            <IconImage className="h-6 w-6" />
          </TabTrigger>
          <div className="mt-auto flex flex-col">
            <NavigationButton
              className="flex items-center justify-center"
              href="https://react.email/docs"
              onMouseEnter={helpAnimation.onMouseEnter}
              onMouseLeave={helpAnimation.onMouseLeave}
              side="right"
              tooltip="Documentation"
            >
              <DotLottieReact
                data={animatedHelpIcon}
                autoplay={false}
                className="h-5 w-5"
                loop={false}
                dotLottieRefCallback={(instance) => {
                  helpAnimation.ref.current = instance;
                }}
              />
            </NavigationButton>
            <NavigationButton
              className="flex items-center justify-center"
              href="https://react.email"
              side="right"
              tooltip="Website"
            >
              <div className="flex h-7 w-7 items-center justify-center">
                <ReactIcon />
              </div>
            </NavigationButton>
          </div>
        </Tabs.List>
        <div className="flex overflow-y-auto overflow-x-hidden">
          <div className="flex w-full flex-col border-slate-6 border-r">
            {activePanelValue === 'link-checker' && (
              <Panel
                title="Link Checker"
                active={activePanelValue === 'link-checker'}
              >
                {currentEmailOpenSlug && emailMarkup ? (
                  <LinkChecker
                    emailMarkup={emailMarkup}
                    emailSlug={currentEmailOpenSlug}
                  />
                ) : (
                  <EmptyState
                    title="Link Checker"
                    onSelectTemplate={() => setActivePanelValue('file-tree')}
                  />
                )}
              </Panel>
            )}
            {activePanelValue === 'image-checker' && (
              <Panel
                title="Image Checker"
                active={activePanelValue === 'image-checker'}
              >
                {currentEmailOpenSlug && emailMarkup ? (
                  <ImageChecker
                    emailMarkup={emailMarkup}
                    emailSlug={currentEmailOpenSlug}
                  />
                ) : (
                  <EmptyState
                    title="Image Checker"
                    onSelectTemplate={() => setActivePanelValue('file-tree')}
                  />
                )}
              </Panel>
            )}
            {activePanelValue === 'file-tree' && (
              <Panel
                title="File Explorer"
                active={activePanelValue === 'file-tree'}
              >
                <FileTree
                  currentEmailOpenSlug={currentEmailOpenSlug}
                  emailsDirectoryMetadata={emailsDirectoryMetadata}
                />
              </Panel>
            )}
          </div>
        </div>
      </aside>
    </Tabs.Root>
  );
};

interface EmptyStateProps {
  onSelectTemplate: () => void;
  title: string;
}

const EmptyState = ({ onSelectTemplate, title }: EmptyStateProps) => {
  return (
    <div className="mt-4 flex w-full flex-col gap-2 text-pretty text-xs leading-relaxed">
      <div className="flex flex-col gap-1 rounded-lg border border-[#0BB9CD]/50 bg-[#0BB9CD]/20 text-white">
        <span className="mx-2.5 mt-2">
          To use the {title}, you need to select a template.
        </span>
        <Button
          className="mx-2 my-2.5 transition-all disabled:border-transparent disabled:bg-slate-11"
          onClick={() => onSelectTemplate()}
        >
          Select a template
        </Button>
      </div>
    </div>
  );
};
