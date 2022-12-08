import { promises as fs } from 'fs';
import path from 'path';
import { render } from '@react-email/render';
import { GetStaticPaths } from 'next';
import { Layout } from '../../components/layout';
import * as React from 'react';
import { Code } from '../../components';
import Head from 'next/head';

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

    const path = `${process.cwd()}/${CONTENT_DIR}/${params.slug}`;
    const reactMarkup = await fs.readFile(`${path}.tsx`, {
      encoding: 'utf-8',
    });

    return emails
      ? { props: { navItems: emails, slug: params.slug, markup, reactMarkup } }
      : { notFound: true };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}

const Preview: React.FC<Readonly<PreviewProps>> = ({
  navItems,
  markup,
  reactMarkup,
  slug,
}: any) => {
  const [viewMode, setViewMode] = React.useState('desktop');
  const title = `${slug} — React Email`;

  return (
    <Layout
      navItems={navItems}
      title={slug}
      viewMode={viewMode}
      setViewMode={setViewMode}
    >
      <Head>
        <title>{title}</title>
      </Head>
      {viewMode === 'desktop' ? (
        <iframe
          srcDoc={markup}
          frameBorder="0"
          className="w-full h-[calc(100vh_-_70px)]"
        />
      ) : (
        <div className="flex gap-6 mx-auto p-6">
          <Code>{reactMarkup}</Code>
          <Code>{markup}</Code>
        </div>
      )}
    </Layout>
  );
};

export default Preview;
