'use client';

import Link from 'next/link';
import type { EmailsDirectory } from '@/utils/actions/get-emails-directory-metadata';
import { Button, Heading, Text } from '../components';
import { Shell } from '../components/shell';

export const Home = (props: { emailsDirectoryMetadata: EmailsDirectory }) => {
  return (
    <Shell emailsDirectoryMetadata={props.emailsDirectoryMetadata}>
      <div className="mx-auto">
        <div className="max-w-md border border-slate-6 mx-6 mt-56 rounded-md p-8">
          <Heading as="h2" weight="medium">
            Welcome to the React Email preview!
          </Heading>
          <Text as="p" className="mt-2 mb-4">
            To start developing your next email template, you can create a{' '}
            <code>.jsx</code> or <code>.tsx</code> file under the
            &quot;emails&quot; folder.
          </Text>

          <Button asChild>
            <Link href="https://react.email/docs">Check the docs</Link>
          </Button>
        </div>
      </div>
    </Shell>
  );
};
