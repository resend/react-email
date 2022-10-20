import { render } from '@react-email/render';
import Head from 'next/head';
import * as React from 'react';
import Layout from '../../components/layout';
import Email from '../../components/packages/ol';

export default function Preview() {
  const markup = render(<Email />, { pretty: true });
  return (
    <>
      <Head>
        <title>Preview - React Email</title>
      </Head>
      <Layout markup={markup} />
    </>
  );
}
