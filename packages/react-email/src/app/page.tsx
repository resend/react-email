import path from 'node:path';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Heading, Text } from '../components';
import CodeSnippet from '../components/code-snippet';
import { Shell } from '../components/shell';
import { emailsDirectoryAbsolutePath } from '../utils/emails-directory-absolute-path';
import logo from './logo.png';

const Home = () => {
  const baseEmailsDirectoryName = path.basename(emailsDirectoryAbsolutePath);

  return (
    <Shell>
      <div className="relative mx-auto flex h-[inherit] max-w-lg items-center justify-center p-8">
        <div className="-mt-10 relative flex flex-col items-center gap-3 text-center">
          <Image
            alt="React Email Icon"
            className="mb-8"
            height={144}
            src={logo}
            style={{
              borderRadius: 34,
              boxShadow: '0 .625rem 12.5rem 1.25rem #2B7CA080',
            }}
            width={141}
          />
          <Heading as="h2" size="6" weight="medium">
            Welcome to React Email
          </Heading>
          <Text as="p">
            To start developing your emails, you can create a<br />
            <CodeSnippet>.jsx</CodeSnippet> or <CodeSnippet>.tsx</CodeSnippet>{' '}
            file under your <CodeSnippet>{baseEmailsDirectoryName}</CodeSnippet>{' '}
            folder.
          </Text>
          <Button asChild className="mt-3" size="3">
            <Link href="https://react.email/docs">Check the docs</Link>
          </Button>
        </div>
      </div>
    </Shell>
  );
};

export default Home;
