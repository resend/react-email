'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  getEmailsDirectoryMetadata,
  type EmailsDirectory,
} from '../actions/get-emails-directory-metadata';
import { useHotreload } from '../hooks/use-hot-reload';
import {
  emailsDirectoryAbsolutePath,
  pathSeparator,
} from '../utils/emails-directory-absolute-path';
import {
  renderEmailBySlug,
  type EmailRenderingResult,
} from '../actions/render-email-by-slug';

const EmailsContext = createContext<
  | {
      emailsDirectoryMetadata: EmailsDirectory;
      /**
       * Uses the hot reloaded bundled build and rendering email result
       */
      useEmailRenderingResult: (
        slug: string,
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

  const [renderingResultPerEmailSlug, setRenderingResultPerEmailSlug] =
    useState<Record<string, EmailRenderingResult>>({});

  if (process.env.NEXT_PUBLIC_IS_BUILDING !== 'true') {
    // this will not change on runtime so it doesn't violate
    // the rules of hooks
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useHotreload((changes) => {
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

      for (const change of changes) {
        const slugForChangedEmail =
          // filename ex: emails/apple-receipt.tsx
          // so we need to remove the "emails/" because it isn't used
          // on the slug parameter for the preview page
          change.filename.split(pathSeparator).slice(1).join('/');

        const lastResult = renderingResultPerEmailSlug[slugForChangedEmail];

        if (typeof lastResult !== 'undefined') {
          renderEmailBySlug(slugForChangedEmail)
            .then((renderingResult) => {
              setRenderingResultPerEmailSlug((map) => ({
                ...map,
                [slugForChangedEmail]: renderingResult,
              }));
            })
            .catch((exception) => {
              throw exception;
            });
        }
      }
    });
  }

  return (
    <EmailsContext.Provider
      value={{
        emailsDirectoryMetadata,
        useEmailRenderingResult: (
          slug: string,
          serverEmailRenderedResult: EmailRenderingResult,
        ): EmailRenderingResult => {
          useEffect(() => {
            if (typeof renderingResultPerEmailSlug[slug] === 'undefined') {
              setRenderingResultPerEmailSlug((map) => ({
                ...map,
                [slug]: serverEmailRenderedResult,
              }));
            }
          }, [serverEmailRenderedResult, slug]);

          if (typeof renderingResultPerEmailSlug[slug] !== 'undefined') {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return renderingResultPerEmailSlug[slug]!;
          }

          return serverEmailRenderedResult;
        },
      }}
    >
      {props.children}
    </EmailsContext.Provider>
  );
};
