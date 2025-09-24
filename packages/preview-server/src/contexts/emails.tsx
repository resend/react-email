'use client';

import { createContext, useContext, useState } from 'react';
import { getEmailsDirectoryMetadataAction } from '../actions/get-emails-directory-metadata-action';
import { isBuilding, isPreviewDevelopment } from '../app/env';
import { useHotreload } from '../hooks/use-hot-reload';
import type { EmailsDirectory } from '../utils/get-emails-directory-metadata';

const EmailsContext = createContext<
  | {
      emailsDirectoryMetadata: EmailsDirectory;
    }
  | undefined
>(undefined);

export const useEmails = () => {
  const providerValue = useContext(EmailsContext);

  if (typeof providerValue === 'undefined') {
    throw new Error(
      'Cannot call `useEmails` outside of an `EmailsContext` provider.',
    );
  }

  return providerValue;
};

export const EmailsProvider = (props: {
  initialEmailsDirectoryMetadata: EmailsDirectory;
  children: React.ReactNode;
}) => {
  const [emailsDirectoryMetadata, setEmailsDirectoryMetadata] =
    useState<EmailsDirectory>(props.initialEmailsDirectoryMetadata);

  if (!isBuilding && !isPreviewDevelopment) {
    // biome-ignore lint/correctness/useHookAtTopLevel: this will not change on runtime so it doesn't violate the rules of hooks
    useHotreload(async () => {
      const metadata = await getEmailsDirectoryMetadataAction(
        props.initialEmailsDirectoryMetadata.absolutePath,
      );
      if (metadata) {
        setEmailsDirectoryMetadata(metadata);
      } else {
        throw new Error(
          'Hot reloading: unable to find the emails directory to update the sidebar',
        );
      }
    });
  }

  return (
    <EmailsContext.Provider value={{ emailsDirectoryMetadata }}>
      {props.children}
    </EmailsContext.Provider>
  );
};
