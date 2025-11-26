'use client';
import { clsx } from 'clsx';
import { useEmails } from '../../contexts/emails';
import { cn } from '../../utils';
import { Logo } from '../logo';
import { FileTree } from './file-tree';

interface SidebarProps {
  className?: string;
  currentEmailOpenSlug?: string;
}

export const Sidebar = ({ className, currentEmailOpenSlug }: SidebarProps) => {
  const { emailsDirectoryMetadata } = useEmails();

  return (
    <aside
      className={cn(
        'overflow-hidden',
        'lg:static lg:z-auto lg:max-h-screen lg:w-[16rem]',
        className,
      )}
    >
      <div className="flex w-full h-full overflow-hidden flex-col border-slate-6 border-r">
        <div
          className={clsx(
            'hidden min-h-14 flex-shrink items-center py-2 px-3 lg:flex border-b border-slate-4',
          )}
        >
          <h2>
            <Logo />
          </h2>
        </div>
        <div className="relative grow w-full h-full overflow-y-auto overflow-x-hidden px-4 pb-3">
          <FileTree
            currentEmailOpenSlug={currentEmailOpenSlug}
            emailsDirectoryMetadata={emailsDirectoryMetadata}
          />
        </div>
      </div>
    </aside>
  );
};
