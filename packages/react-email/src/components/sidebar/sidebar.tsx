'use client';

import * as React from 'react';
import {
  getEmailsDirectoryMetadata,
  type EmailsDirectory,
} from '@/utils/actions/get-emails-directory-metadata';
import { useHotreload } from '@/utils/hooks/use-hot-reload';
import { emailsDirectoryAbsolutePath } from '@/utils/emails-directory-absolute-path';
import { SidebarDirectory } from './sidebar-directory';

type SidebarElement = React.ElementRef<'aside'>;
type RootProps = React.ComponentPropsWithoutRef<'aside'>;

interface SidebarProps extends RootProps {
  emailsDirectoryMetadata: EmailsDirectory;
  currentEmailOpenSlug?: string;
}

export const Sidebar = React.forwardRef<SidebarElement, Readonly<SidebarProps>>(
  (
    {
      className,
      emailsDirectoryMetadata: initialEmailsDirectoryMetadata,
      currentEmailOpenSlug,
      ...props
    },
    forwardedRef,
  ) => {
    const [emailsDirectoryMetadata, setEmailsDirectoryMetadata] =
      React.useState(initialEmailsDirectoryMetadata);

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
      <aside className={className} ref={forwardedRef} {...props}>
        <nav className="p-6 w-screen md:w-full md:min-w-[275px] md:max-w-[275px] flex flex-col gap-4 border-r border-slate-6">
          <SidebarDirectory
            className="w-fit overflow-x-auto"
            currentEmailOpenSlug={currentEmailOpenSlug}
            emailsDirectoryMetadata={emailsDirectoryMetadata}
          />
        </nav>
      </aside>
    );
  },
);

Sidebar.displayName = 'Sidebar';
