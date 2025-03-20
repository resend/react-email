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
        'fixed top-[4.375rem] left-0 z-[9999] h-full max-h-full w-screen max-w-ful overflow-hidden bg-black will-change-auto',
        'lg:static lg:z-auto lg:max-h-screen lg:w-[16rem]',
        className,
      )}
    >
      <div className="w-full h-full overflow-y-auto overflow-x-hidden">
        <div className="flex w-full h-full flex-col border-slate-6 border-r">
          <div
            className={clsx(
              'hidden min-h-[3.3125rem] flex-shrink items-center p-3 px-4 lg:flex',
            )}
          >
            <h2>
              <Logo />
            </h2>
          </div>
          <div className="relative h-full w-full border-slate-4 border-t px-4 pb-3">
            <FileTree
              currentEmailOpenSlug={currentEmailOpenSlug}
              emailsDirectoryMetadata={emailsDirectoryMetadata}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};
