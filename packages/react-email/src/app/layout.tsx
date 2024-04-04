import type { Metadata } from 'next';
import './globals.css';
import { getEmailsDirectoryMetadata } from '../actions/get-emails-directory-metadata';
import { emailsDirectoryAbsolutePath } from '../utils/emails-directory-absolute-path';
import { EmailsProvider } from '../contexts/emails';
import { inter } from './inter';

export const metadata: Metadata = {
  title: 'React Email',
};

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
    <html lang="en">
      <body className={inter.className}>
        <EmailsProvider
          initialEmailsDirectoryMetadata={emailsDirectoryMetadata}
        >
          {children}
        </EmailsProvider>
      </body>
    </html>
  );
};

export default RootLayout;
