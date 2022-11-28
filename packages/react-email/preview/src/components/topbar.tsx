import * as React from 'react';
import classnames from 'classnames';
import { Heading } from './heading';
import { Text } from './text';

type TopbarElement = React.ElementRef<'header'>;
type RootProps = React.ComponentPropsWithoutRef<'header'>;

interface TopbarProps extends RootProps {
  title: string;
}

export const Topbar = React.forwardRef<TopbarElement, Readonly<TopbarProps>>(
  ({ className, title, ...props }, forwardedRef) => {
    return (
      <header
        ref={forwardedRef}
        className={classnames(
          'bg-black flex relative items-center px-6 justify-between h-[70px] border-b border-slate-6',
          className,
        )}
        {...props}
      >
        <div className="flex items-center">
          <Text size="2" color="gray" weight="medium">
            All emails
          </Text>
          <svg
            className="text-slate-11"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.75 8.75L14.25 12L10.75 15.25"
              stroke="currentColor"
              stroke-opacity="0.615"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <Heading as="h2" size="2" weight="medium">
            {title}
          </Heading>
        </div>
      </header>
    );
  },
);

Topbar.displayName = 'Topbar';
