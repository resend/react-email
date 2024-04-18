'use client';
import * as Collapsible from '@radix-ui/react-collapsible';
import * as React from 'react';
import { cn } from '../../utils';
import { type EmailsDirectory } from '../../actions/get-emails-directory-metadata';
import { Heading } from '../heading';
import { IconFolder } from '../icons/icon-folder';
import { IconFolderOpen } from '../icons/icon-folder-open';
import { IconArrowDown } from '../icons/icon-arrow-down';
import { SidebarDirectoryChildren } from './sidebar-directory-children';

interface SidebarDirectoryProps {
  emailsDirectoryMetadata: EmailsDirectory;
  className?: string;
  currentEmailOpenSlug?: string;
}

const persistedOpenDirectories = new Set<string>();

export const SidebarDirectory = ({
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
          'text-[14px] flex items-center font-medium gap-2 justify-between w-full my-1',
          {
            'cursor-pointer': !isEmpty,
          },
        )}
      >
        <div className="flex items-center text-slate-11 transition ease-in-out duration-200 hover:text-slate-12 gap-1">
          {open ? (
            <IconFolderOpen height="24" width="24" />
          ) : (
            <IconFolder height="24" width="24" />
          )}
          <Heading
            as="h3"
            className="transition ease-in-out duration-200 hover:text-slate-12"
            color="gray"
            size="2"
            weight="medium"
          >
            {directoryMetadata.directoryName}
          </Heading>
        </div>
        {!isEmpty ? (
          <IconArrowDown
            className="data-[open=true]:rotate-180 transition-transform opacity-60 justify-self-end"
            data-open={open}
          />
        ) : null}
      </Collapsible.Trigger>

      {!isEmpty ? (
        <SidebarDirectoryChildren
          currentEmailOpenSlug={currentEmailOpenSlug}
          emailsDirectoryMetadata={directoryMetadata}
          open={open}
        />
      ) : null}
    </Collapsible.Root>
  );
};
