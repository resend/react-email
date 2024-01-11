import path from 'node:path';
import Link from 'next/link';
import { Button, Heading, Text } from '../components';
import { Shell } from '../components/shell';
import { emailsDirectoryAbsolutePath } from '../utils/emails-directory-absolute-path';

const Home = () => {
  const baseEmailsDirectoryName = path.basename(emailsDirectoryAbsolutePath);

  return (
    <Shell>
      <div className="mx-auto w-fit">
        <div className="max-w-md border border-slate-6 mx-6 mt-56 rounded-md p-8">
          <Heading as="h2" weight="medium">
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
    </Shell>
  );
};

export default Home;
