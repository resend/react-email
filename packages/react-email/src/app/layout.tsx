import type { Metadata } from 'next';
import './globals.css';
import { EmailsProvider } from '../contexts/emails';
import { emailsDirectoryAbsolutePath } from '../utils/emails-directory-absolute-path';
import { getEmailsDirectoryMetadata } from '../utils/get-emails-directory-metadata';
import { inter } from './inter';

export const metadata: Metadata = {
  title: 'React Email',
};

export const dynamic = 'force-dynamic';

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const emailsDirectoryMetadata = await getEmailsDirectoryMetadata(
    emailsDirectoryAbsolutePath,
  );

  if (typeof emailsDirectoryMetadata === 'undefined') {
    throw new Error(
      `Could not find the emails directory specified under ${emailsDirectoryAbsolutePath}!`,
    );
  }

  return (
    <html className={inter.className} lang="en">
      <body className="relative flex h-screen flex-col overflow-x-hidden bg-black text-slate-11 leading-loose selection:bg-cyan-5 selection:text-cyan-12">
        <EmailsProvider
          initialEmailsDirectoryMetadata={emailsDirectoryMetadata}
        >
          {children}
        </EmailsProvider>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-3"
        />
      </body>
    </html>
  );
};

export default RootLayout;
