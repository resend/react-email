import { render } from '@react-email/render';
import { html } from 'js-beautify';
import Head from 'next/head';
import * as React from 'react';
import { VercelInviteUser } from '../components/vercel-invite-user';
import Logo from '../components/topbar/logo';
import External from '../components/topbar/external';
import ToggleView from '../components/topbar/toggle-view';

export default function Home() {
  const markup = render(<VercelInviteUser />);
  const [isPreview, setIsPreview] = React.useState(true);

  return (
    <>
      <Head>
        <title>Preview - React Email</title>
      </Head>

      <div className="w-full bg-gray-1 text-gray-12">
        <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between m-2 p-2">
          <Logo />
          <div className="flex gap-2">
            <ToggleView isPreview={isPreview} setIsPreview={setIsPreview} />
            <div className="flex items-center border-l ml-4 pl-6 border-gray-8">
              <div className="flex gap-2 items-center justify-center">
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
        <pre className="max-w-6xl mx-auto pt-8 px-6 overflow-scroll text-xs">
          <code>{html(markup)}</code>
        </pre>
      )}
    </>
  );
}
