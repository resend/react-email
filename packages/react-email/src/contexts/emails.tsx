'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { getEmailsDirectoryMetadataAction } from '../actions/get-emails-directory-metadata-action';
import { useHotreload } from '../hooks/use-hot-reload';
import { getEmailPathFromSlug } from '../actions/get-email-path-from-slug';
import type { EmailValidationWarning } from '../actions/get-warnings-for-email';
import { getWarningsForEmail } from '../actions/get-warnings-for-email';
import type { EmailsDirectory } from '../utils/get-emails-directory-metadata';

const EmailsContext = createContext<
  | {
    emailsDirectoryMetadata: EmailsDirectory;
    useEmailWarnings: (
      emailPath: string,
      serverValidationWarnings: EmailValidationWarning[]
    ) => EmailValidationWarning[];
  }
  | undefined
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
  const [emailsDirectoryMetadata, setEmailsDirectoryMetadata] =
    useState<EmailsDirectory>(props.initialEmailsDirectoryMetadata);

  const [validationWarningsPerEmailPath, setValidationWarningsPerEmailPath] =
    useState<Record<string, EmailValidationWarning[]>>({});

  if (process.env.NEXT_PUBLIC_IS_BUILDING !== 'true') {
    // this will not change on runtime so it doesn't violate
    // the rules of hooks
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useHotreload(async (changes) => {
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

      for await (const change of changes) {
        const slugForChangedEmail =
          // ex: apple-receipt.tsx
          // it will be the path relative to the emails directory, so it is already
          // going to be equivalent to the slug
          change.filename;

        const pathForChangedEmail =
          await getEmailPathFromSlug(slugForChangedEmail);

        const lastWarnings = validationWarningsPerEmailPath[pathForChangedEmail];

        if (typeof lastWarnings !== 'undefined') {
          const warnings = await getWarningsForEmail(pathForChangedEmail);

          setValidationWarningsPerEmailPath((map) => ({
            ...map,
            [pathForChangedEmail]: warnings,
          }));
        }
      }
    });
  }

  return (
    <EmailsContext.Provider
      value={{
        emailsDirectoryMetadata,
        useEmailWarnings: (emailPath, serverValidationWarnings) => {
          useEffect(() => {
            if (typeof validationWarningsPerEmailPath[emailPath] === 'undefined') {
              setValidationWarningsPerEmailPath((map) => ({
                ...map,
                [emailPath]: serverValidationWarnings,
              }));
            }
          }, [serverValidationWarnings, emailPath]);

          if (typeof validationWarningsPerEmailPath[emailPath] !== 'undefined') {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return validationWarningsPerEmailPath[emailPath]!;
          }

          return serverValidationWarnings;
        },
      }}
    >
      {props.children}
    </EmailsContext.Provider>
  );
};
