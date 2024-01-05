import * as Collapsible from '@radix-ui/react-collapsible';
import { LayoutGroup, motion } from 'framer-motion';
import Link from 'next/link';
import * as React from 'react';
import { cn } from '@/utils';
import { Heading } from './heading';

type SidebarElement = React.ElementRef<'aside'>;
type RootProps = React.ComponentPropsWithoutRef<'aside'>;

interface SidebarProps extends RootProps {
  emailSlugs: string[];
  title?: string;
}

export const Sidebar = React.forwardRef<SidebarElement, Readonly<SidebarProps>>(
  ({ className, emailSlugs, title, ...props }, forwardedRef) => {
    return (
      <aside className={className} ref={forwardedRef} {...props}>
        <nav className="p-6 w-screen md:w-full md:min-w-[275px] md:max-w-[275px] flex flex-col gap-4 border-r border-slate-6">
          <Collapsible.Root defaultOpen>
            <Collapsible.Trigger
              className={cn('flex items-center gap-1', {
                'cursor-default': emailSlugs.length === 0,
              })}
            >
              <svg
                className="text-slate-11"
                fill="none"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.25 17.25V9.75C19.25 8.64543 18.3546 7.75 17.25 7.75H4.75V17.25C4.75 18.3546 5.64543 19.25 6.75 19.25H17.25C18.3546 19.25 19.25 18.3546 19.25 17.25Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M13.5 7.5L12.5685 5.7923C12.2181 5.14977 11.5446 4.75 10.8127 4.75H6.75C5.64543 4.75 4.75 5.64543 4.75 6.75V11"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>

              <div className="flex items-center text-slate-11 transition ease-in-out duration-200 hover:text-slate-12">
                <Heading
                  as="h3"
                  className="transition ease-in-out duration-200 hover:text-slate-12"
                  color="gray"
                  size="2"
                  weight="medium"
                >
                  All emails
                </Heading>
                {emailSlugs.length > 0 ? (
                  <svg
                    fill="none"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 15L8.5359 9.75L15.4641 9.75L12 15Z"
                      fill="currentColor"
                    />
                  </svg>
                ) : null}
              </div>
            </Collapsible.Trigger>

            {emailSlugs.length > 0 ? (
              <Collapsible.Content className="relative mt-3">
                <div className="absolute left-2.5  w-px h-full bg-slate-6" />

                <div className="py-2 flex flex-col truncate">
                  <LayoutGroup id="sidebar">
                    {emailSlugs.map((emailSlug) => {
                      const isCurrentPage = title === emailSlug;

                      return (
                        <Link href={`/preview/${emailSlug}`} key={emailSlug}>
                          <motion.span
                            className={cn(
                              'text-[14px] flex items-center font-medium gap-2 w-full pl-4 h-8 rounded-md text-slate-11 relative transition ease-in-out duration-200',
                              {
                                'text-cyan-11': isCurrentPage,
                                'hover:text-slate-12': title !== emailSlug,
                              },
                            )}
                          >
                            {isCurrentPage ? (
                              <motion.span
                                animate={{ opacity: 1 }}
                                className="absolute left-0 right-0 top-0 bottom-0 rounded-md bg-cyan-5"
                                exit={{ opacity: 0 }}
                                initial={{ opacity: 0 }}
                                layoutId="sidebar"
                              >
                                <div className="bg-cyan-11 w-px absolute top-1 left-2.5 h-6" />
                              </motion.span>
                            ) : null}
                            <svg
                              className="flex-shrink-0"
                              fill="none"
                              height="24"
                              viewBox="0 0 24 24"
                              width="24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7.75 19.25H16.25C17.3546 19.25 18.25 18.3546 18.25 17.25V9L14 4.75H7.75C6.64543 4.75 5.75 5.64543 5.75 6.75V17.25C5.75 18.3546 6.64543 19.25 7.75 19.25Z"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeOpacity="0.927"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M18 9.25H13.75V5"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeOpacity="0.927"
                                strokeWidth="1.5"
                              />
                            </svg>
                            {emailSlug}
                          </motion.span>
                        </Link>
                      );
                    })}
                  </LayoutGroup>
                </div>
              </Collapsible.Content>
            ) : null}
          </Collapsible.Root>
        </nav>
      </aside>
    );
  },
);

Sidebar.displayName = 'Sidebar';
