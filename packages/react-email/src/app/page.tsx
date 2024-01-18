import path from 'node:path';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Heading, Text } from '../components';
import { Shell } from '../components/shell';
import { emailsDirectoryAbsolutePath } from '../utils/emails-directory-absolute-path';
import logo from './logo.png';
import pattern from './pattern.png';

const Home = () => {
  const baseEmailsDirectoryName = path.basename(emailsDirectoryAbsolutePath);

  return (
    <Shell>
      <div className="mx-auto w-fit">
        <div className="relative max-w-lg mx-6 mt-56 rounded-md p-8 flex">
          <Image
            alt="React Email Icon"
            className="absolute top-0 -translate-x-1/2 left-1/2 -translate-y-[70px] opacity-70"
            height={349}
            src={pattern}
            width={349}
          />
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
              Welcome to the React Email preview!
            </Heading>
            <Text as="p" className="mt-2 mb-4">
              To start developing your next email template, you can create a{' '}
              <code>.jsx</code> or <code>.tsx</code> file under your &quot;
              {baseEmailsDirectoryName}&quot; folder.
            </Text>

            <Button asChild>
              <Link href="https://react.email/docs">Check the docs</Link>
            </Button>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default Home;
