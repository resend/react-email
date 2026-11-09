import './globals.css';

import type { Metadata } from 'next';
import { Shell } from '../components/shell';
import { EmailsProvider } from '../contexts/emails';
import { WorkspaceProvider } from '../contexts/workspace';
import { getEmailsDirectoryMetadata } from '../utils/get-emails-directory-metadata';
import { getWorkspaceId } from '../utils/get-workspace-id';
import { emailsDirectoryAbsolutePath } from './env';
import { inter, sfMono } from './fonts';

export const metadata: Metadata = {
  title: 'React Email',
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const emailsDirectoryMetadata = await getEmailsDirectoryMetadata(
    emailsDirectoryAbsolutePath,
  );

  if (typeof emailsDirectoryMetadata === 'undefined') {
    throw new Error(
      `Could not find the emails directory specified under ${emailsDirectoryAbsolutePath}!`,
    );
  }

  const workspaceId = getWorkspaceId(emailsDirectoryAbsolutePath);

  return (
    <html
      className={`${inter.variable} ${sfMono.variable} font-sans`}
      lang="en"
    >
      <body className="relative h-screen bg-black text-slate-11 leading-loose selection:bg-cyan-5 selection:text-cyan-12">
        <div className="bg-linear-to-t from-slate-3 flex flex-col">
          <WorkspaceProvider id={workspaceId}>
            <EmailsProvider
              initialEmailsDirectoryMetadata={emailsDirectoryMetadata}
            >
              <Shell>{children}</Shell>
            </EmailsProvider>
          </WorkspaceProvider>
        </div>
      </body>
    </html>
  );
}
