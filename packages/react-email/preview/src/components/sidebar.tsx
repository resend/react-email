import { Logo } from './logo';
import * as React from 'react';
import classnames from 'classnames';
import Link from 'next/link';
import { Heading } from './heading';
import { useRouter } from 'next/router';
import * as Collapsible from '@radix-ui/react-collapsible';

type SidebarElement = React.ElementRef<'aside'>;
type RootProps = React.ComponentPropsWithoutRef<'aside'>;

interface SidebarProps extends RootProps {
  navItems: string[];
}

export const Sidebar = React.forwardRef<SidebarElement, Readonly<SidebarProps>>(
  ({ className, navItems, ...props }, forwardedRef) => {
    const { query } = useRouter();

    return (
      <aside
        ref={forwardedRef}
        className="px-6 min-w-[275px] max-w-[275px] flex flex-col gap-4 border-r border-slate-6"
        {...props}
      >
        <div className="h-[70px] flex items-center">
          <Logo />
        </div>

        <nav className="flex flex-col gap-4">
          <Collapsible.Root defaultOpen>
            <Collapsible.Trigger
              className={classnames('flex items-center gap-1', {
                'cursor-default': navItems && navItems.length === 0,
              })}
            >
              <svg
                className="text-slate-11"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.25 17.25V9.75C19.25 8.64543 18.3546 7.75 17.25 7.75H4.75V17.25C4.75 18.3546 5.64543 19.25 6.75 19.25H17.25C18.3546 19.25 19.25 18.3546 19.25 17.25Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.5 7.5L12.5685 5.7923C12.2181 5.14977 11.5446 4.75 10.8127 4.75H6.75C5.64543 4.75 4.75 5.64543 4.75 6.75V11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="flex items-center">
                <Heading as="h3" color="white" size="2" weight="medium">
                  All emails
                </Heading>
                {navItems && navItems.length > 0 && (
                  <svg
                    className="text-slate-11"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 15L8.5359 9.75L15.4641 9.75L12 15Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </div>
            </Collapsible.Trigger>

            {navItems && navItems.length > 0 && (
              <Collapsible.Content className="relative mt-3">
                <div className="absolute left-2.5  w-px h-full bg-slate-6" />

                <div className="py-2 flex flex-col gap-1.5 truncate">
                  {navItems &&
                    navItems.map((item) => (
                      <Link key={item} href={`/preview/${item}`}>
                        <span
                          className={classnames(
                            'text-[14px] flex items-center font-medium gap-2 h-8 w-full pl-4 rounded-md text-slate-11',
                            {
                              'bg-cyan-3 text-cyan-11': query.slug === item,
                              'hover:text-slate-12': query.slug !== item,
                            },
                          )}
                        >
                          {query.slug === item && (
                            <div className="h-5 bg-cyan-11 w-px absolute left-2.5" />
                          )}
                          <svg
                            className="flex-shrink-0
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7.75 19.25H16.25C17.3546 19.25 18.25 18.3546 18.25 17.25V9L14 4.75H7.75C6.64543 4.75 5.75 5.64543 5.75 6.75V17.25C5.75 18.3546 6.64543 19.25 7.75 19.25Z"
                              stroke="currentColor"
                              strokeOpacity="0.927"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18 9.25H13.75V5"
                              stroke="currentColor"
                              strokeOpacity="0.927"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {item}
                        </span>
                      </Link>
                    ))}
                </div>
              </Collapsible.Content>
            )}
          </Collapsible.Root>
        </nav>
      </aside>
    );
  },
);

Sidebar.displayName = 'Sidebar';
