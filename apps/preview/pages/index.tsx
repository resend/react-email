import React from 'react';
import Head from 'next/head';

import VercelInviteUser from '../components/vercel-invite-user';
import { render } from '../../../packages/render/dist/index';

export default function Home() {
  const html = render(<VercelInviteUser />);

  return (
    <>
      <Head>
        <title>Preview - React Email</title>
      </Head>
      <iframe srcDoc={html} className="w-full h-screen bg-white" />
    </>
  );
}