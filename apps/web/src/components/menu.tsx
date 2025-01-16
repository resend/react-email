'use client';

import classnames from 'classnames';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { Drawer } from 'vaul';

interface MenuItemProps {
  className?: string;
  children: React.ReactNode;
  href: string;
  onClick?: () => void;
}

const GITHUB_URL = 'https://github.com/resend/react-email';
const DISCORD_URL = '/discord';

const MenuItem: React.FC<Readonly<MenuItemProps>> = ({
  className,
  children,
  href,
  onClick,
}) => (
  <li className="inline-flex w-full items-center justify-center md:w-fit">
    <Link
      className={classnames(
        'inline-flex h-8 scroll-m-2 items-center rounded-md text-sm text-slate-11 transition-colors hover:bg-slate-6 hover:text-slate-12 focus:bg-slate-6 focus:outline-none focus:ring focus:ring-slate-3 md:justify-center',
        className,
      )}
      href={href}
      onClick={onClick}
      tabIndex={0}
    >
      {children}
    </Link>
  </li>
);

const MenuItems = ({ onItemClick }: { onItemClick: () => void }) => (
  <>
    <MenuItem
      className="w-full px-2 md:w-fit"
      href="/components"
      onClick={onItemClick}
    >
      Components
    </MenuItem>
    <MenuItem
      className="w-full px-2 md:w-fit"
      href="/examples"
      onClick={onItemClick}
    >
      Templates
    </MenuItem>
    <MenuItem
      className="w-full px-2 md:w-fit"
      href="/docs"
      onClick={onItemClick}
    >
      Docs
    </MenuItem>
  </>
);

const SocialIcons = ({ onItemClick }: { onItemClick: () => void }) => (
  <>
    <MenuItem
      className="w-8 justify-center"
      href={GITHUB_URL}
      onClick={onItemClick}
    >
      <svg
        height="20"
        viewBox="0 0 24 24"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          fill="currentColor"
        />
      </svg>
    </MenuItem>
    <MenuItem
      className="w-8 justify-center"
      href={DISCORD_URL}
      onClick={onItemClick}
    >
      <svg
        height="20"
        viewBox="0 0 127.14 96.36"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <g data-name="Discord Logos" id="Discord_Logos">
            <g
              data-name="Discord Logo - Large - White"
              id="Discord_Logo_-_Large_-_White"
            >
              <path
                d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
                fill="currentColor"
              />
            </g>
          </g>
        </g>
      </svg>
    </MenuItem>
  </>
);

export const Menu: React.FC = () => {
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);

  const handleItemClick = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <nav className="hidden items-center gap-2 md:flex">
        <ul className="flex gap-2">
          <MenuItems onItemClick={handleItemClick} />
        </ul>
        <span
          aria-hidden="true"
          className="mx-2 hidden h-5 w-px bg-slate-6 sm:!inline-block"
        />
        <ul className="flex gap-2">
          <SocialIcons onItemClick={handleItemClick} />
        </ul>
      </nav>
      <nav className="relative flex items-center gap-2 md:hidden">
        <ul className="flex gap-2">
          <Drawer.Root
            onOpenChange={setDrawerOpen}
            open={isDrawerOpen}
            shouldScaleBackground
          >
            <Drawer.Trigger className="p-2">
              <MenuIcon />
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed left-1/2 top-1/2 z-[2] h-[200dvh] w-[200dvw] -translate-x-1/2 -translate-y-1/2 bg-slate-800/50" />
              <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[3] flex h-fit flex-col gap-8 rounded-t-xl bg-black p-8 pt-10">
                <ul className="flex w-full flex-col items-start gap-4">
                  <MenuItems onItemClick={handleItemClick} />
                </ul>
                <ul className="flex w-fit gap-2">
                  <SocialIcons onItemClick={handleItemClick} />
                </ul>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </ul>
      </nav>
    </>
  );
};
