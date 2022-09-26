import { render } from '@react-email/render';
import Head from 'next/head';
import * as React from 'react';
import { VercelInviteUser } from '../components/vercel-invite-user';
import Logo from '../components/topbar/logo';
import External from '../components/topbar/external';
import Feedback from '../components/topbar/feedback';
import SendTest from '../components/topbar/send-test';
import ToggleView from '../components/topbar/toggle-view';
import { Code } from 'design-system';

export default function Home() {
  const markup = render(<VercelInviteUser />, { pretty: true });
  const [isPreview, setIsPreview] = React.useState(true);

  return (
    <>
      <Head>
        <title>Preview - React Email</title>
      </Head>

      <div className="w-full bg-gray-1 text-gray-12">
        <nav className="max-w-6xl mx-auto flex items-center justify-between m-2 p-2">
          <div className="w-60">
            <Logo />
          </div>
          <div className="w-60">
            <ToggleView isPreview={isPreview} setIsPreview={setIsPreview} />
          </div>
          <div className="w-60 flex gap-2 justify-end">
            <SendTest markup={markup} />
            <div className="flex items-center border-l ml-2 pl-4 border-gray-8">
              <div className="flex gap-2 items-center justify-center">
                <Feedback />
                <External />
              </div>
            </div>
          </div>
        </nav>
      </div>

      {isPreview ? (
        <iframe
          srcDoc={markup}
          className="w-full bg-white"
          style={{ height: 'calc(100vh - 60px)' }}
        />
      ) : (
        <div className="max-w-6xl mx-auto">
          <Code>{markup}</Code>
        </div>
      )}
    </>
  );
}
