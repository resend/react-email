import * as Collapsible from '@radix-ui/react-collapsible';
import { AnimatePresence, motion } from 'framer-motion';
import type { ComponentProps } from 'react';
import { cn } from '../../utils';

export type ResultStatus = 'error' | 'warning' | 'success';

const statusStyles = {
  error: 'text-red-600 hover:bg-red-600/10',
  warning: 'text-yellow-300 hover:bg-yellow-400/10',
  success: 'text-green-600 hover:bg-green-600/10',
};

interface ResultListProps {
  status: ResultStatus;
  label: React.ReactNode;

  disabled?: boolean;
  defaultOpen?: boolean;

  children: React.ReactNode;
}

export const ResultList = ({
  status,
  label,

  disabled,
  defaultOpen,

  children,
}: ResultListProps) => {
  return (
    <Collapsible.Root className="group" defaultOpen={defaultOpen && !disabled}>
      <Collapsible.Trigger
        className={cn(
          'group flex w-full items-center gap-1 rounded p-2 transition-colors duration-200 ease-[cubic-bezier(.36,.66,.6,1)]',
          statusStyles[status],
          disabled && 'cursor-not-allowed opacity-70',
        )}
        disabled={disabled}
      >
        <span
          className={cn(
            '-mt-[.125rem] transition-transform duration-200 ease-[cubic-bezier(.36,.66,.6,1)]',
            'rotate-0 group-data-[state=open]:rotate-90',
          )}
        >
          <svg
            fill="none"
            height="15"
            viewBox="0 0 15 15"
            width="15"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        </span>
        <div className="flex flex-1 items-center gap-1 font-bold text-[.625rem] uppercase tracking-wide">
          {label}
        </div>
      </Collapsible.Trigger>
      {children ? (
        <Collapsible.Content>
          <ol className="mt-2 mb-1 flex list-none flex-col gap-4">
            {children}
          </ol>
        </Collapsible.Content>
      ) : null}
    </Collapsible.Root>
  );
};

type ResultProps = {
  status: ResultStatus;
} & ComponentProps<typeof motion.li>;

const resultAnimation = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.1 },
  },
};

export const Result = ({ children, status, ...rest }: ResultProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.li
        data-status={status}
        initial="hidden"
        layout
        variants={resultAnimation}
        animate="visible"
        {...rest}
        className={cn(
          'group/item relative w-full rounded-md p-2 pl-4 transition-colors duration-300 ease-out hover:bg-slate-5',
          rest.className,
        )}
      >
        {children}
      </motion.li>
    </AnimatePresence>
  );
};

const titleStatusAnimation = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

interface ResultStatusDescriptionProps {
  children: React.ReactNode;
}

Result.StatusDescription = ({ children }: ResultStatusDescriptionProps) => {
  return (
    <motion.div
      className="mt-1 font-semibold text-[.625rem] uppercase"
      variants={titleStatusAnimation}
    >
      {children}
    </motion.div>
  );
};

interface ResultTitleProps {
  children: React.ReactNode;
}

Result.Title = ({ children }: ResultTitleProps) => {
  return (
    <motion.div
      className="flex w-full items-center gap-2 text-xs group-data-[status=error]/item:text-red-400 group-data-[status=success]/item:text-green-400 group-data-[status=warning]/item:text-yellow-300 "
      variants={titleStatusAnimation}
    >
      {children}
    </motion.div>
  );
};
