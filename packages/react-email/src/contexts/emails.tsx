'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  getEmailsDirectoryMetadata,
  type EmailsDirectory,
} from '../actions/get-emails-directory-metadata';
import { useHotreload } from '../hooks/use-hot-reload';
import {
  renderEmailByPath,
  type EmailRenderingResult,
} from '../actions/render-email-by-path';
import { getEmailPathFromSlug } from '../actions/get-email-path-from-slug';
import { EmailValidationWarning, getWarningsForEmail } from '../actions/get-warnings-for-email';

const EmailsContext = createContext<
  | {
    emailsDirectoryMetadata: EmailsDirectory;
    useEmailWarnings: (
      emailPath: string,
      serverValidationWarnings: EmailValidationWarning[]
    ) => EmailValidationWarning[];
    /**
     * Uses the hot reloaded bundled build and rendering email result
     */
    useEmailRenderingResult: (
      emailPath: string,
      serverEmailRenderedResult: EmailRenderingResult,
    ) => EmailRenderingResult;
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

  const [renderingResultPerEmailPath, setRenderingResultPerEmailPath] =
    useState<Record<string, EmailRenderingResult>>({});

  const [validationWarningsPerEmailPath, setValidationWarningsPerEmailPath] =
    useState<Record<string, EmailValidationWarning[]>>({});

  if (process.env.NEXT_PUBLIC_IS_BUILDING !== 'true') {
    // this will not change on runtime so it doesn't violate
    // the rules of hooks
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useHotreload(async (changes) => {
      const metadata = await getEmailsDirectoryMetadata(
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

        const lastResult = renderingResultPerEmailPath[pathForChangedEmail];

        if (typeof lastResult !== 'undefined') {
          const renderingResult = await renderEmailByPath(pathForChangedEmail);

          setRenderingResultPerEmailPath((map) => ({
            ...map,
            [pathForChangedEmail]: renderingResult,
          }));
        }

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
        useEmailRenderingResult: (emailPath, serverEmailRenderedResult) => {
          useEffect(() => {
            if (typeof renderingResultPerEmailPath[emailPath] === 'undefined') {
              setRenderingResultPerEmailPath((map) => ({
                ...map,
                [emailPath]: serverEmailRenderedResult,
              }));
            }
          }, [serverEmailRenderedResult, emailPath]);

          if (typeof renderingResultPerEmailPath[emailPath] !== 'undefined') {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return renderingResultPerEmailPath[emailPath]!;
          }

          return serverEmailRenderedResult;
        },
      }}
    >
      {props.children}
    </EmailsContext.Provider>
  );
};
