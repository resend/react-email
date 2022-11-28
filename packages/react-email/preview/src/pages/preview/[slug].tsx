import { promises as fs } from 'fs';
import path from 'path';
import { render } from '@react-email/render';
import { GetStaticPaths } from 'next';
import { Layout } from '../../components/layout';
import * as React from 'react';
import { Code } from '../../components';

interface PreviewProps {}

export const CONTENT_DIR = 'emails';

const getEmails = async () => {
  const emailsDirectory = path.join(process.cwd(), CONTENT_DIR);
  const filenames = await fs.readdir(emailsDirectory);
  const emails = filenames.map((file) => file.replace('.tsx', ''));

  return emails;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const emails = await getEmails();

  const paths = emails.map((email) => {
    return { params: { slug: email } };
  });
  return { paths, fallback: true };
};

export async function getStaticProps({ params }) {
  try {
    const emails = await getEmails();
    const Email = (await import(`../../../emails/${params.slug}`)).default;
    const markup = render(<Email />, { pretty: true });

    return emails
      ? { props: { navItems: emails, slug: params.slug, markup } }
      : { notFound: true };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}

const Preview: React.FC<Readonly<PreviewProps>> = ({
  navItems,
  markup,
  slug,
}: any) => {
  const [viewMode, setViewMode] = React.useState('desktop');

  return (
    <Layout
      navItems={navItems}
      title={slug}
      viewMode={viewMode}
      setViewMode={setViewMode}
    >
      {viewMode === 'desktop' ? (
        <iframe srcDoc={markup} width="600" height="800" frameBorder="0" />
      ) : (
        <Code>{markup}</Code>
      )}
    </Layout>
  );
};

export default Preview;
