import Image from 'next/image';
import type * as React from 'react';
import { Anchor } from './anchor';
import { Text } from './text';

export const Footer: React.FC = () => (
  <footer className="flex min-h-20 items-center justify-center text-center">
    <Text className="inline-flex items-center gap-2">
      Brought to you by{' '}
      <Anchor
        className="inline-flex items-center gap-2"
        href="https://resend.com"
        target="_blank"
      >
        <Image
          alt=""
          className="inline-block rounded-full border border-slate-7"
          height="20"
          src="/brand/resend.png"
          width="20"
        />
        Resend
      </Anchor>
    </Text>
  </footer>
);
