import type { Metadata } from 'next';
import './globals.css';
import { EmailsProvider } from '../contexts/emails';
import { getEmailsDirectoryMetadata } from '../utils/get-emails-directory-metadata';
import { emailsDirectoryAbsolutePath } from './env';
import { inter, sfMono } from './fonts';

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
    <html
      className={`${inter.variable} ${sfMono.variable} font-sans`}
      lang="en"
    >
      <body className="relative h-screen bg-black text-slate-11 leading-loose selection:bg-cyan-5 selection:text-cyan-12">
        <div className="bg-gradient-to-t from-slate-3 flex flex-col">
          <EmailsProvider
            initialEmailsDirectoryMetadata={emailsDirectoryMetadata}
          >
            {children}
          </EmailsProvider>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
