'use client';

import * as SlotPrimitive from '@radix-ui/react-slot';
import React from 'react';
import { Heading, Text } from './components';
import { Shell } from './components/shell';

export const Home = ({ templateNames }: { templateNames: string[] }) => {
  React.useEffect(() => {
    document.title = 'JSX email';
  }, []);

  return (
    <Shell templateNames={templateNames}>
      <div className="max-w-md border border-dark-bg-border m-auto mt-56 rounded-md p-8">
        <Heading as="h2" weight="medium">
          JSX Email Preview
        </Heading>
        <Text as="p" className="mt-2 mb-4">
          Start creating an email template by running{' '}
          <code>email create &lt;template-name&gt;</code>
          <br />
          <br />
          Run <code>email help create</code> for a list of options
          <br />
          <br />
          Happy coding!
        </Text>

        <SlotPrimitive.Slot className="mt-4 inline-block focus:ring-2 focus:ring-white/20 focus:outline-none focus:bg-white/90 text-base py-2 px-4 rounded gap-2 bg-cta-bg text-cta-text hover:bg-cta-bg-hover font-extrabold">
          <SlotPrimitive.Slottable>
            <a href="https://react.email/docs">Read our Documentation</a>
          </SlotPrimitive.Slottable>
        </SlotPrimitive.Slot>
      </div>
    </Shell>
  );
};
