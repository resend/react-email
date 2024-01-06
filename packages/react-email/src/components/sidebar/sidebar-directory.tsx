'use client';
import * as Collapsible from '@radix-ui/react-collapsible';
import * as React from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/utils';
import { emailsDirPath, pathSeparator } from '@/utils/emails-dir-path';
import { type EmailsDirectory } from '@/utils/actions/get-emails-directory-metadata';
import { Heading } from '../heading';
import { IconFolder } from '../icons/icon-folder';
import { IconArrowDown } from '../icons/icon-arrow-down';
import { IconFile } from '../icons/icon-file';

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
          'cursor-default': emailsDirectoryMetadata.emailFilenames.length === 0,
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
          {emailsDirectoryMetadata.emailFilenames.length > 0 ? (
            <IconArrowDown
              className="data-[open=true]:rotate-180 transition-transform"
              data-open={open}
            />
          ) : null}
        </div>
      </Collapsible.Trigger>

      {emailsDirectoryMetadata.emailFilenames.length > 0 ? (
        <Collapsible.Content className="relative data-[root=false]:mt-3">
          <div className="absolute left-2.5  w-px h-full bg-slate-6" />

          <div className="py-2 flex flex-col truncate">
            <LayoutGroup id="sidebar">
              {emailsDirectoryMetadata.subDirectories.map((subDirectory) => (
                <SidebarDirectory
                  className="pl-4 py-0"
                  currentEmailOpenSlug={currentEmailOpenSlug}
                  emailsDirectoryMetadata={subDirectory}
                  key={subDirectory.unixAbsolutePath}
                />
              ))}

              {emailsDirectoryMetadata.emailFilenames.map((emailFilename) => {
                const emailSlug = `${directoryPathRelativeToEmailsDirectory}${
                  !isBaseEmailsDirectory ? pathSeparator : ''
                }${emailFilename}`;
                const isCurrentPage = currentEmailOpenSlug === emailSlug;

                return (
                  <Link
                    href={`/preview/${encodeURIComponent(emailSlug).trim()}`}
                    key={emailSlug}
                  >
                    <motion.span
                      className={cn(
                        'text-[14px] flex items-center font-medium gap-2 w-full pl-4 h-8 rounded-md text-slate-11 relative transition ease-in-out duration-200',
                        {
                          'text-cyan-11': isCurrentPage,
                          'hover:text-slate-12':
                            currentEmailOpenSlug !== emailSlug,
                        },
                      )}
                    >
                      {isCurrentPage ? (
                        <motion.span
                          animate={{ opacity: 1 }}
                          className="absolute left-0 right-0 top-0 bottom-0 rounded-md bg-cyan-5"
                          exit={{ opacity: 0 }}
                          initial={{ opacity: 0 }}
                          layoutId="sidebar"
                        >
                          <div className="bg-cyan-11 w-px absolute top-1 left-2.5 h-6" />
                        </motion.span>
                      ) : null}
                      <IconFile height="24" width="24" />
                      {emailFilename}
                    </motion.span>
                  </Link>
                );
              })}
            </LayoutGroup>
          </div>
        </Collapsible.Content>
      ) : null}
    </Collapsible.Root>
  );
};
