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
    <div className="flex w-full h-full flex-col lg:w-full lg:min-w-[14.5rem]">
      <nav className="flex flex-grow flex-col p-4 pr-0 pl-0">
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
