import { render } from '@react-email/render';
import Head from 'next/head';
import * as React from 'react';
import Layout from '../components/layout';
import { WorkOS } from '../components/templates/workos';

export default function Preview() {
  const markup = render(<WorkOS />, { pretty: true });
  return (
    <>
      <Head>
        <title>Preview - React Email</title>
      </Head>
      <Layout markup={markup} />
    </>
  );
}
