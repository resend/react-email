import Head from 'next/head';
import Layout from '../components/layout';
import React from 'react';

export async function getServerSideProps({ params }: { params: any }) {
  const { path } = params;
  const resolvedPath = path.length > 0 ? path.join('/') : path;

  try {
    const req = await fetch(`http://localhost:3001/api/${resolvedPath}?json=true`)
    const { markup } = await req.json()

    return {
      props: { markup, path }
    }
  }
  catch(e) {
    return {
      props: {}
    }
  }
}

export default function Preview({ markup, path }: { markup: string, path: string }) {
  return (
    <>
      <Head>
        <title>Preview - React Email</title>
      </Head>
      <Layout markup={markup} path={path} />
    </>
  );
}
