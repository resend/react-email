import path from 'node:path';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Heading, Text } from '../components';
import { Shell } from '../components/shell';
import { emailsDirectoryAbsolutePath } from '../utils/emails-directory-absolute-path';
import logo from './logo.png';
import { getEmailsDirectoryMetadata } from '../actions/get-emails-directory-metadata';
import { getWarningsForEmails } from '../actions/get-warnings-for-emails';

const Home = async () => {
  const baseEmailsDirectoryName = path.basename(emailsDirectoryAbsolutePath);
  const emailsDirMetadata = await getEmailsDirectoryMetadata(
    emailsDirectoryAbsolutePath,
  );
  if (typeof emailsDirMetadata === 'undefined') {
    throw new Error(
      `Could not find the emails directory specified under ${emailsDirectoryAbsolutePath}!

This is most likely not an issue with the preview server. Maybe there was a typo on the "--dir" flag?`,
    );
  }

  const emailValidationWarnings = await getWarningsForEmails(emailsDirMetadata);

  return (
    <Shell emailValidationWarnings={emailValidationWarnings}>
      <div className="relative max-w-lg mx-auto p-8 flex items-center justify-center h-[inherit]">
        <div className="relative z-10 flex flex-col text-center items-center">
          <Image
            alt="React Email Icon"
            className="mb-8"
            height={144}
            src={logo}
            style={{
              borderRadius: 34,
              boxShadow: '0px 10px 200px 20px #2B7CA080',
            }}
            width={141}
          />
          <Heading as="h2" size="6" weight="medium">
            Welcome to React Email
          </Heading>
          <Text as="p" className="mt-2 mb-4">
            To start developing your emails, you can create a<br />
            <code className="text-slate-12">.jsx</code> or{' '}
            <code className="text-slate-12">.tsx</code> file under your{' '}
            <code className="text-slate-12">{baseEmailsDirectoryName}</code>{' '}
            folder.
          </Text>

          <Button asChild size="3">
            <Link href="https://react.email/docs">Check the docs</Link>
          </Button>
        </div>
      </div>
    </Shell>
  );
};

export default Home;
