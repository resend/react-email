import React from 'react';
import Image from 'next/image';
import classnames from 'classnames';
import { Anchor, Text } from 'design-system';

type FooterElement = React.ElementRef<'footer'>;
type RootProps = React.ComponentPropsWithoutRef<'footer'>;

export const Footer = React.forwardRef<FooterElement, Readonly<RootProps>>(
  ({ className, ...props }, forwardedRef) => (
    <footer
      ref={forwardedRef}
      className={classnames(
        'flex h-[80px] items-center justify-center text-center',
        className,
      )}
      {...props}
    >
      <Text className="inline-flex items-center gap-2">
        Created by{' '}
        <Anchor
          target="_blank"
          href="https://twitter.com/bukinoshita"
          appearance="white"
          className="inline-flex items-center gap-2"
        >
          <Image
            className="border-slate-7 inline-block rounded-full border"
            src="/static/bu.jpg"
            alt={''}
            width="20"
            height="20"
          />
          Bu Kinoshita
        </Anchor>{' '}
        and{' '}
        <Anchor
          target="_blank"
          href="https://twitter.com/zenorocha"
          appearance="white"
          className="inline-flex items-center gap-2"
        >
          <Image
            className="border-slate-7 inline-block rounded-full border"
            src="/static/zeno.jpg"
            alt={''}
            width="20"
            height="20"
          />
          Zeno Rocha
        </Anchor>
      </Text>
    </footer>
  ),
);

Footer.displayName = 'Footer';
