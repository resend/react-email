'use client';

import React from 'react';
import { Button, Heading, Text } from './components';
import { Shell } from './components/shell';

export const Home = ({ templateNames }: { templateNames: string[] }) => {
  React.useEffect(() => {
    document.title = 'JSX Email 📧';
  }, []);

  return (
    <Shell templateNames={templateNames}>
      <div className="max-w-md border border-slate-6 m-auto mt-56 rounded-md p-8">
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

        <Button asChild>
          <a href="https://react.email/docs">Check the docs</a>
        </Button>
      </div>
    </Shell>
  );
};
