import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import * as Collapsible from '@radix-ui/react-collapsible';
import clsx from 'clsx';
import {
  checkLinks,
  type LinkCheckingResult,
} from '../../actions/email-validation/check-links';
import { Button } from '../button';

interface LinkCheckerProps {
  emailSlug: string;
  emailMarkup: string;
}

type ResultStatus = 'error' | 'warning' | 'success';

interface ResultSection {
  status: ResultStatus;
  label: string;
  results: LinkCheckingResult[];
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const containerAnimation = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.1 },
  },
};

const childAnimation = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const statusStyles = {
  error: 'text-red-400 hover:bg-red-400/10',
  warning: 'text-yellow-300 hover:bg-yellow-400/10',
  success: 'text-green-400 hover:bg-green-400/10',
};

const resultsCache = new Map<string, LinkCheckingResult[]>();

const CollapsibleTrigger = ({ count, label, variant, open }) => {
  const isDisabled = count === 0;

  return (
    <Collapsible.Trigger
      className={clsx(
        'flex w-full items-center gap-1 rounded p-2',
        statusStyles[variant],
        isDisabled && 'cursor-not-allowed opacity-50',
      )}
      disabled={isDisabled}
    >
      <span
        className={clsx(
          '-mt-[.125rem] transition-transform duration-200 ease-[cubic-bezier(.36,.66,.6,1)]',
          open ? 'rotate-90' : 'rotate-0',
        )}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <div className="flex flex-1 items-center gap-1 text-[.625rem] font-bold uppercase tracking-wide">
        <span>{label}</span>
        <span>({count})</span>
      </div>
    </Collapsible.Trigger>
  );
};

const ResultSection = ({
  status,
  label,
  results,
  isOpen,
  setOpen,
}: ResultSection) => (
  <Collapsible.Root open={isOpen} onOpenChange={setOpen}>
    <CollapsibleTrigger
      count={results.length}
      label={label}
      variant={status}
      open={isOpen}
    />
    {results.length > 0 && (
      <Collapsible.Content>
        <ol className="mb-1 flex list-none flex-col gap-4 pl-3.5 pt-2">
          {results.map((result, index) => (
            <LinkResultView key={index} {...result} />
          ))}
        </ol>
      </Collapsible.Content>
    )}
  </Collapsible.Root>
);

export const LinkChecker = ({ emailSlug, emailMarkup }: LinkCheckerProps) => {
  const [results, setResults] = React.useState<
    LinkCheckingResult[] | undefined
  >(resultsCache.get(emailSlug));
  const [loading, setLoading] = React.useState(false);
  const [errorOpen, setErrorOpen] = React.useState(true);
  const [warningOpen, setWarningOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);

  const resultSections = React.useMemo(() => {
    const filteredResults = {
      error: results?.filter((result) => result.status === 'error') || [],
      warning: results?.filter((result) => result.status === 'warning') || [],
      success: results?.filter((result) => result.status === 'success') || [],
    };

    return [
      {
        status: 'error' as ResultStatus,
        label: 'Errors',
        results: filteredResults.error,
        isOpen: errorOpen,
        setOpen: setErrorOpen,
      },
      {
        status: 'warning' as ResultStatus,
        label: 'Warnings',
        results: filteredResults.warning,
        isOpen: warningOpen,
        setOpen: setWarningOpen,
      },
      {
        status: 'success' as ResultStatus,
        label: 'Success',
        results: filteredResults.success,
        isOpen: successOpen,
        setOpen: setSuccessOpen,
      },
    ];
  }, [results, errorOpen, warningOpen, successOpen]);

  const handleRun = () => {
    setLoading(true);
    checkLinks(emailMarkup)
      .then((newResults) => {
        resultsCache.set(emailSlug, newResults);
        setResults(newResults);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  return (
    <div className="mt-3 flex w-full flex-col gap-2 text-pretty">
      {results ? (
        <>
          {resultSections.map((section) => (
            <ResultSection key={section.status} {...section} />
          ))}
          <Button
            className="mt-2 disabled:border-transparent disabled:bg-slate-11"
            disabled={loading}
            onClick={handleRun}
          >
            Re-run
          </Button>
        </>
      ) : (
        <>
          <span className="text-xs leading-relaxed">
            Check if all links are valid and redirect to the correct pages.
          </span>
          <Button
            className="mt-1.5 disabled:border-transparent disabled:bg-slate-11"
            disabled={loading}
            onClick={handleRun}
          >
            Run
          </Button>
        </>
      )}
    </div>
  );
};

const LinkResultView = (props: LinkCheckingResult) => (
  <AnimatePresence mode="wait">
    <motion.li
      animate="visible"
      className="group relative"
      data-status={props.status}
      initial="hidden"
      layout
      variants={containerAnimation}
    >
      <motion.div
        className="flex items-center gap-2 text-xs group-data-[status=error]:text-red-400 group-data-[status=success]:text-green-400 group-data-[status=warning]:text-yellow-300"
        variants={childAnimation}
      >
        <a
          className="flex-shrink overflow-hidden text-ellipsis whitespace-nowrap transition-colors duration-200 hover:underline"
          href={props.link}
        >
          {props.link}
        </a>
      </motion.div>
      <motion.div
        className="mt-1 text-[.625rem] font-semibold uppercase"
        variants={childAnimation}
      >
        {props.checks
          .map((check) => {
            if (check.type === 'syntax' && !check.passed) return 'Invalid URL';
            if (check.type === 'fetch_attempt')
              return `${check.metadata.fetchStatusCode}`;
            if (check.type === 'security')
              return check.passed ? 'Secure' : 'Insecure';
            return null;
          })
          .filter(Boolean)
          .join(' - ')}
      </motion.div>
    </motion.li>
  </AnimatePresence>
);
