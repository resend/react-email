'use client';
import * as Collapsible from '@radix-ui/react-collapsible';
import * as React from 'react';
import { cn } from '@/utils';
import { emailsDirPath } from '@/utils/emails-dir-path';
import { type EmailsDirectory } from '@/utils/actions/get-emails-directory-metadata';
import { Heading } from '../heading';
import { IconFolder } from '../icons/icon-folder';
import { IconArrowDown } from '../icons/icon-arrow-down';
import { SidebarDirectoryChildren } from './sidebar-directory-children';

interface SidebarDirectoryProps {
  emailsDirectoryMetadata: EmailsDirectory;
  className?: string;
  currentEmailOpenSlug?: string;
}

export const SidebarDirectory = ({
  emailsDirectoryMetadata,
  className,
  currentEmailOpenSlug,
}: SidebarDirectoryProps) => {
  const isBaseEmailsDirectory =
    emailsDirectoryMetadata.absolutePath === emailsDirPath;
  const directoryPathRelativeToEmailsDirectory =
    emailsDirectoryMetadata.absolutePath.replace(emailsDirPath, '').trim();
  const doesFolderContainCurrentEmailOpen = currentEmailOpenSlug
    ? currentEmailOpenSlug.includes(directoryPathRelativeToEmailsDirectory)
    : false;

  const isEmpty =
    emailsDirectoryMetadata.emailFilenames.length > 0 ||
    emailsDirectoryMetadata.subDirectories.length > 0;

  const [open, setOpen] = React.useState(
    isBaseEmailsDirectory || doesFolderContainCurrentEmailOpen,
  );

  return (
    <Collapsible.Root
      className={className}
      data-root={isBaseEmailsDirectory}
      onOpenChange={setOpen}
      open={open}
    >
      <Collapsible.Trigger
        className={cn('text-[14px] flex items-center font-medium gap-2', {
          'cursor-pointer': !isEmpty
        })}
      >
        <IconFolder height="24" width="24" />

        <div className="flex items-center text-slate-11 transition ease-in-out duration-200 hover:text-slate-12">
          <Heading
            as="h3"
            className="transition ease-in-out duration-200 hover:text-slate-12"
            color="gray"
            size="2"
            weight="medium"
          >
            {emailsDirectoryMetadata.unixAbsolutePath.split('/').pop()}
          </Heading>
          {isEmpty ? (
            <IconArrowDown
              className="data-[open=true]:rotate-180 transition-transform"
              data-open={open}
            />
          ) : null}
        </div>
      </Collapsible.Trigger>

      {isEmpty ? (
        <SidebarDirectoryChildren
          currentEmailOpenSlug={currentEmailOpenSlug}
          emailsDirectoryMetadata={emailsDirectoryMetadata}
          open={open}
        />
      ) : null}
    </Collapsible.Root>
  );
};
