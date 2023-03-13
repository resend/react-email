import * as React from 'react';
import classnames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { Heading } from './heading';
import { Text } from './text';

type ExampleElement = React.ElementRef<'a'>;

interface ExampleProps {
  id: string;
  name: string;
  className?: string;
  author: string;
}

const GITHUB_URL = 'https://demo.react.email/preview';

export const Example = React.forwardRef<ExampleElement, Readonly<ExampleProps>>(
  ({ className, id, name, author, ...props }, forwardedRef) => (
    <Link
      ref={forwardedRef}
      className={classnames(
        'bg-gradient border-slate-6 flex w-full flex-col rounded-md border backdrop-blur-[20px] focus:outline-none focus:ring-2',
        'hover:bg-gradientHover',
        'focus:bg-gradientHover focus:ring-white/20',
        className,
      )}
      href={`${GITHUB_URL}/${id}`}
      target="_blank"
      {...props}
    >
      <Image
        src={`/static/examples/${id}.png`}
        alt={name}
        className="rounded-t-md"
        width="450"
        height="300"
      />
      <div className="p-4">
        <Heading size="2" weight="medium">
          {name}
        </Heading>
        <div className="mt-2 flex flex-row gap-2">
          <img
            src={`https://github.com/${author}.png`}
            alt={author}
            className="rounded-full"
            width="24"
            height="24"
          />
          <Text>{author}</Text>
        </div>
      </div>
    </Link>
  ),
);

Example.displayName = 'Example';
