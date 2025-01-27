'use client';
import * as Collapsible from '@radix-ui/react-collapsible';
import * as React from 'react';
import { cn } from '../../utils';
import { type EmailsDirectory } from '../../utils/get-emails-directory-metadata';
import { Heading } from '../heading';
import { IconFolder } from '../icons/icon-folder';
import { IconFolderOpen } from '../icons/icon-folder-open';
import { IconArrowDown } from '../icons/icon-arrow-down';
import { FileTreeDirectoryChildren } from './file-tree-directory-children';

interface SidebarDirectoryProps {
  emailsDirectoryMetadata: EmailsDirectory;
  className?: string;
  currentEmailOpenSlug?: string;
}

const persistedOpenDirectories = new Set<string>();

export const FileTreeDirectory = ({
  emailsDirectoryMetadata: directoryMetadata,
  className,
  currentEmailOpenSlug,
}: SidebarDirectoryProps) => {
  const doesDirectoryContainCurrentEmailOpen = currentEmailOpenSlug
    ? currentEmailOpenSlug.includes(directoryMetadata.relativePath)
    : false;

  const isEmpty =
    directoryMetadata.emailFilenames.length === 0 &&
    directoryMetadata.subDirectories.length === 0;

  const [open, setOpen] = React.useState(
    persistedOpenDirectories.has(directoryMetadata.absolutePath) ||
      doesDirectoryContainCurrentEmailOpen,
  );

  return (
    <Collapsible.Root
      className={cn('group', className)}
      onOpenChange={(isOpening) => {
        if (isOpening) {
          persistedOpenDirectories.add(directoryMetadata.absolutePath);
        } else {
          persistedOpenDirectories.delete(directoryMetadata.absolutePath);
        }

        setOpen(isOpening);
      }}
      open={open}
    >
      <Collapsible.Trigger
        className={cn(
          'my-1 flex w-full items-center justify-between gap-2 text-[14px] font-medium',
          {
            'cursor-pointer': !isEmpty,
          },
        )}
      >
        <div className="flex items-center gap-1 text-slate-11 transition duration-200 ease-in-out hover:text-slate-12">
          {open ? (
            <IconFolderOpen height="24" width="24" />
          ) : (
            <IconFolder height="24" width="24" />
          )}
          <Heading
            as="h3"
            className="transition duration-200 ease-in-out hover:text-slate-12"
            color="gray"
            size="2"
            weight="medium"
          >
            {directoryMetadata.directoryName}
          </Heading>
        </div>
        {!isEmpty ? (
          <IconArrowDown
            className="justify-self-end opacity-60 transition-transform data-[open=true]:rotate-180"
            data-open={open}
          />
        ) : null}
      </Collapsible.Trigger>

      {!isEmpty ? (
        <FileTreeDirectoryChildren
          currentEmailOpenSlug={currentEmailOpenSlug}
          emailsDirectoryMetadata={directoryMetadata}
          open={open}
        />
      ) : null}
    </Collapsible.Root>
  );
};
