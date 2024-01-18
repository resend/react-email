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
            className="absolute top-0 -translate-x-1/2 left-1/2 -translate-y-[80px] opacity-70"
            height={349}
            src={pattern}
            width={349}
          />
          <div
            className="absolute top-0 -translate-x-1/2 left-1/2 -translate-y-[80px] opacity-50"
            style={{
              width: '300px',
              height: '300px',
              borderRadius: '300px',
              background:
                'radial-gradient(70% 70% at 50% 50%, rgba(118, 187, 218, 1)10%, rgba(118, 187, 218, 0.0) 100%)',
              mixBlendMode: 'color-dodge',
              filter: 'blur(100px)',
            }}
          />
          <div className="relative z-10 flex flex-col text-center items-center">
            <Image alt="React Email Icon" height={144} src={logo} width={141} />
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
