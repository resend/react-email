'use client';
import { createContext, useContext, useState } from 'react';
import {
  getEmailsDirectoryMetadata,
  type EmailsDirectory,
} from '../utils/actions/get-emails-directory-metadata';
import { useHotreload } from '../utils/hooks/use-hot-reload';
import { emailsDirectoryAbsolutePath } from '../utils/emails-directory-absolute-path';

const EmailsContext = createContext<
  { emailsDirectoryMetadata: EmailsDirectory } | undefined
>(undefined);

export const useEmails = () => {
  const providerValue = useContext(EmailsContext);

  if (typeof providerValue === 'undefined') {
    throw new Error(
      'Cannot call `useEmail()` outside of an EmailsContext provider!',
    );
  }

  return providerValue;
};

export const EmailsProvider = (props: {
  initialEmailsDirectoryMetadata: EmailsDirectory;
  children: React.ReactNode;
}) => {
  const [emailsDirectoryMetadata, setEmailsDirectoryMetadata] = useState<EmailsDirectory>(
    props.initialEmailsDirectoryMetadata,
  );
  if (process.env.NEXT_PUBLIC_DISABLE_HOT_RELOADING !== 'true') {
    // this will not change on runtime so it doesn't violate
    // the rules of hooks
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useHotreload(() => {
      getEmailsDirectoryMetadata(emailsDirectoryAbsolutePath)
        .then((metadata) => {
          if (metadata) {
            setEmailsDirectoryMetadata(metadata);
          } else {
            throw new Error(
              'Hot reloading: unable to find the emails directory to update the sidebar',
            );
          }
        })
        .catch((exception) => {
          throw exception;
        });
    });
  }

  return (
    <EmailsContext.Provider
      value={{ emailsDirectoryMetadata }}
    >
      {props.children}
    </EmailsContext.Provider>
  );
};
