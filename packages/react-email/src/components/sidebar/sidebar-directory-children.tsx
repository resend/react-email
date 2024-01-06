import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import * as Collapsible from '@radix-ui/react-collapsible';
import Link from 'next/link';
import type { EmailsDirectory } from '@/utils/actions/get-emails-directory-metadata';
import { emailsDirPath, pathSeparator } from '@/utils/emails-dir-path';
import { cn } from '@/utils';
import { IconFile } from '../icons/icon-file';
import { SidebarDirectory } from './sidebar-directory';

export const SidebarDirectoryChildren = (props: {
  emailsDirectoryMetadata: EmailsDirectory;
  currentEmailOpenSlug?: string;
  open: boolean;
}) => {
  const directoryPathRelativeToEmailsDirectory =
    props.emailsDirectoryMetadata.absolutePath
      .replace(emailsDirPath, '')
      .trim();
  const isBaseEmailsDirectory =
    props.emailsDirectoryMetadata.absolutePath === emailsDirPath;

  return (
    <AnimatePresence>
      {props.open ? (
        <Collapsible.Content
          asChild
          className="relative data-[root=false]:mt-3 overflow-y-hidden"
          forceMount
        >
          <motion.div
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
          >
            <div className="absolute left-2.5  w-px h-full bg-slate-6" />

            <div className="py-2 flex flex-col truncate">
              <LayoutGroup id="sidebar">
                {props.emailsDirectoryMetadata.subDirectories.map(
                  (subDirectory) => (
                    <SidebarDirectory
                      className="pl-4 py-0"
                      currentEmailOpenSlug={props.currentEmailOpenSlug}
                      emailsDirectoryMetadata={subDirectory}
                      key={subDirectory.unixAbsolutePath}
                    />
                  ),
                )}

                {props.emailsDirectoryMetadata.emailFilenames.map(
                  (emailFilename) => {
                    const emailSlug = `${directoryPathRelativeToEmailsDirectory}${
                      !isBaseEmailsDirectory ? pathSeparator : ''
                    }${emailFilename}`;
                    const isCurrentPage =
                      props.currentEmailOpenSlug === emailSlug;

                    return (
                      <Link
                        href={`/preview/${encodeURIComponent(
                          emailSlug,
                        ).trim()}`}
                        key={emailSlug}
                      >
                        <motion.span
                          className={cn(
                            'text-[14px] flex items-center font-medium gap-2 w-full pl-4 h-8 rounded-md text-slate-11 relative transition ease-in-out duration-200',
                            {
                              'text-cyan-11': isCurrentPage,
                              'hover:text-slate-12':
                                props.currentEmailOpenSlug !== emailSlug,
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
                  },
                )}
              </LayoutGroup>
            </div>
          </motion.div>
        </Collapsible.Content>
      ) : null}
    </AnimatePresence>
  );
};
