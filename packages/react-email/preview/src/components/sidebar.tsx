import { Logo } from './logo';
import * as React from 'react';
import classnames from 'classnames';
import Link from 'next/link';
import { Heading } from './heading';
import { useRouter } from 'next/router';
import * as Collapsible from '@radix-ui/react-collapsible';
import { AnimateSharedLayout, motion } from 'framer-motion';

type SidebarElement = React.ElementRef<'aside'>;
type RootProps = React.ComponentPropsWithoutRef<'aside'>;

interface SidebarProps extends RootProps {
  navItems: string[];
}

export const Sidebar = React.forwardRef<SidebarElement, Readonly<SidebarProps>>(
  ({ className, navItems, ...props }, forwardedRef) => {
    const [hovered, setHovered] = React.useState('');
    const { query } = useRouter();
    const [open, setOpen] = React.useState(false);
    return (
      <aside
        ref={forwardedRef}
        className="px-6 gap-4 w-full border-r border-slate-6 flex flex-row lg:flex-col lg:min-w-[275px] lg:max-w-[275px] lg:pb-7"
        {...props}
      >
        <div className="h-[50px] lg:h-[70px] flex items-center ">
          <Logo />
        </div>

        <nav className="flex flex-col mb-2 gap-4 relative">
          <Collapsible.Root open={open} onOpenChange={setOpen}>
            <Collapsible.Trigger
              className={classnames('flex items-center gap-1 h-[50px] ', {
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

              <div className="flex items-center text-slate-11 transition ease-in-out duration-200 hover:text-slate-12">
                <Heading
                  as="h3"
                  color="gray"
                  size="2"
                  weight="medium"
                  className="transition ease-in-out duration-200 hover:text-slate-12"
                >
                  Sample emails
                </Heading>
                {navItems &&
                  navItems.length > 0 &&
                  (open ? (
                    <svg
                      width="25"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
                        fill="currentColor"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      width="25"
                      height="24"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                        fill="currentColor"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  ))}
              </div>
            </Collapsible.Trigger>

            {navItems && navItems.length > 0 && (
              <Collapsible.Content className="absolute  bg-neutral-900  pb-2">
                <div className="absolute left-2.5  w-px h-full bg-slate-6" />

                <div className="py-2 flex flex-col truncate">
                  <AnimateSharedLayout>
                    {navItems &&
                      navItems.map((item) => {
                        const isHovered = hovered === item;
                        return (
                          <Link key={item} href={`/preview/${item}`}>
                            <motion.span
                              className={classnames(
                                'text-[14px] flex items-center font-medium gap-2 w-full pl-4 h-8 rounded-md text-slate-11 relative block transition ease-in-out duration-200',
                                {
                                  'bg-cyan-3 text-cyan-11': query.slug === item,
                                  'hover:text-slate-12': query.slug !== item,
                                },
                              )}
                              onHoverStart={() => setHovered(item)}
                              onHoverEnd={() => setHovered('')}
                              onClick={() => setOpen(!open)}
                            >
                              {isHovered && (
                                <motion.span
                                  layoutId="sidebar"
                                  className="absolute left-0 right-0 top-0 bottom-0 rounded-md bg-slate-5"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                >
                                  <div className="bg-cyan-11 w-px absolute top-1 left-2.5 h-6" />
                                </motion.span>
                              )}
                              <svg
                                className="flex-shrink-0"
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
                            </motion.span>
                          </Link>
                        );
                      })}
                  </AnimateSharedLayout>
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
