import * as React from 'react';
import Link from 'next/link';
import classnames from 'classnames';

type MenuElement = React.ElementRef<'nav'>;
type RootProps = React.ComponentPropsWithoutRef<'nav'>;

interface MenuProps extends RootProps {}

const GITHUB_URL = 'https://github.com/zenorocha/react-email';
const DISCORD_URL = '/discord';

export const Menu = React.forwardRef<MenuElement, Readonly<MenuProps>>(
  ({ className, ...props }, forwardedRef) => (
    <nav
      ref={forwardedRef}
      className={classnames('flex items-center gap-2', className)}
      {...props}
    >
      <ul className="flex gap-2">
        <MenuItem className="w-full px-2" href="/docs">
          Docs
        </MenuItem>
        <MenuItem className="w-full px-2" href="/examples">
          Examples
        </MenuItem>
      </ul>
      <span
        aria-hidden="true"
        className="bg-slate-6 mx-2 hidden h-5 w-px sm:!inline-block"
      />
      <ul className="flex gap-2">
        <MenuItem href={GITHUB_URL} className="w-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
              fill="currentColor"
            />
          </svg>
        </MenuItem>
        <MenuItem href={DISCORD_URL} className="w-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 127.14 96.36"
            width="20"
            height="20"
          >
            <g>
              <g id="Discord_Logos" data-name="Discord Logos">
                <g
                  id="Discord_Logo_-_Large_-_White"
                  data-name="Discord Logo - Large - White"
                >
                  <path
                    fill="currentColor"
                    d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
                  />
                </g>
              </g>
            </g>
          </svg>
        </MenuItem>
      </ul>
    </nav>
  ),
);

Menu.displayName = 'Menu';

type MenuItemElement = React.ElementRef<'li'>;
type ItemProps = React.ComponentPropsWithoutRef<'li'>;

interface MenuItemProps extends ItemProps {
  href: string;
}

const MenuItem = React.forwardRef<MenuItemElement, Readonly<MenuItemProps>>(
  ({ className, children, href, ...props }, forwardedRef) => (
    <li
      ref={forwardedRef}
      className="inline-flex items-center justify-center"
      {...props}
    >
      <Link
        className={classnames(
          'text-slate-11 inline-flex h-8 items-center justify-center rounded-md text-sm',
          'hover:text-slate-12 hover:bg-white/10',
          'outline-none focus:bg-white/10 focus:ring-2 focus:ring-white/20',
          className,
        )}
        href={href}
      >
        {children}
      </Link>
    </li>
  ),
);

MenuItem.displayName = 'MenuItem';
