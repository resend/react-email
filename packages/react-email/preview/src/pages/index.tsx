import { promises as fs } from 'fs';
import path from 'path';
import { Heading } from '../components';
import { Layout } from '../components/layout';

interface HomeProps {}

export const CONTENT_DIR = 'emails';

const getEmails = async () => {
  const emailsDirectory = path.join(process.cwd(), CONTENT_DIR);
  const filenames = await fs.readdir(emailsDirectory);
  const emails = filenames.map((file) => file.replace('.tsx', ''));

  return emails;
};

export async function getStaticProps({ params }) {
  try {
    const emails = await getEmails();
    return emails ? { props: { navItems: emails } } : { notFound: true };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}

const Home: React.FC<Readonly<HomeProps>> = ({ navItems }: any) => {
  return (
    <Layout navItems={navItems}>
      <Heading>Hi</Heading>
    </Layout>
  );
};

export default Home;
