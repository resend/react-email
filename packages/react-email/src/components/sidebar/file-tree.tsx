import * as Collapsible from '@radix-ui/react-collapsible';
import * as React from 'react';
import type { EmailsDirectory } from '../../utils/get-emails-directory-metadata';
import { FileTreeDirectoryChildren } from './file-tree-directory-children';

interface FileTreeProps {
  currentEmailOpenSlug: string | undefined;
  emailsDirectoryMetadata: EmailsDirectory;
}

export const FileTree = ({
  currentEmailOpenSlug,
  emailsDirectoryMetadata,
}: FileTreeProps) => {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden lg:w-full lg:min-w-[14.5rem] lg:max-w-[14.5rem]">
      <nav className="flex w-full flex-grow flex-col overflow-y-auto p-4 pr-0 pl-0">
        <Collapsible.Root open>
          <React.Suspense>
            <FileTreeDirectoryChildren
              currentEmailOpenSlug={currentEmailOpenSlug}
              emailsDirectoryMetadata={emailsDirectoryMetadata}
              isRoot
              open
            />
          </React.Suspense>
        </Collapsible.Root>
      </nav>
    </div>
  );
};
