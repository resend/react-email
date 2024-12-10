import * as React from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
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
    <div className="flex h-full w-[calc(100vw-36px)] flex-col lg:w-full lg:min-w-[231px] lg:max-w-[231px]">
      <nav className="flex w-full flex-grow flex-col overflow-y-auto p-4 pl-0 md:px-2">
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
