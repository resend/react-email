import { promises as fs } from 'fs';
import path from 'path';
import { Button, Heading, Text } from '../components';
import { Layout } from '../components/layout';
import Link from 'next/link';

interface HomeProps {}

export const CONTENT_DIR = 'emails';

const getEmails = async () => {
  const emailsDirectory = path.join(process.cwd(), CONTENT_DIR);

  const filenames = await fs.readdir(emailsDirectory);
  const emails = filenames
    .map((file) => file.replace(/\.(jsx|tsx)$/g, ''))
    .filter((file) => file !== 'components');

  return emails;
};

export async function getStaticProps({ params }) {
  try {
    const emails = await getEmails();
    return emails
      ? { props: { navItems: emails } }
      : { props: { navItems: [] } };
  } catch (error) {
    console.error(error);
    return { props: { navItems: [] } };
  }
}

const Home: React.FC<Readonly<HomeProps>> = ({ navItems }: any) => {
  return (
    <Layout navItems={navItems}>
      <div className="max-w-md border border-slate-6 mx-auto mt-56 rounded-md p-8">
        <Heading as="h2" weight="medium">
          Welcome to the React Email preview!
        </Heading>
        <Text as="p" className="mt-2 mb-4">
          To start developing your next email template, you can create a{' '}
          <code>.jsx</code> or <code>.tsx</code> file under the "emails" folder.
        </Text>

        <Button asChild>
          <Link href="https://react.email/docs">Check the docs</Link>
        </Button>
      </div>
    </Layout>
  );
};

export default Home;
