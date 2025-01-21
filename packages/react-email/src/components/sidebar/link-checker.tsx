import * as Collapsible from '@radix-ui/react-collapsible';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';
import {
  type LinkCheckingResult,
  checkLinks,
} from '../../actions/email-validation/check-links';
import { Button } from '../button';

interface LinkCheckerProps {
  emailSlug: string;
  emailMarkup: string;
}

type ResultStatus = 'error' | 'warning' | 'success';

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

interface CollapsibleTriggerProps {
  count: number;
  label: string;
  variant: 'error' | 'warning' | 'success';
}

const CollapsibleTrigger = ({
  count,
  label,
  variant,
}: CollapsibleTriggerProps) => {
  const isDisabled = count === 0;

  return (
    <Collapsible.Trigger
      className={clsx(
        'group flex w-full items-center gap-1 rounded p-2 transition-colors duration-200 ease-[cubic-bezier(.36,.66,.6,1)]',
        statusStyles[variant],
        isDisabled && 'cursor-not-allowed opacity-60',
      )}
      disabled={isDisabled}
    >
      <span
        className={clsx(
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
      <div className="flex flex-1 items-center gap-1 text-[.625rem] font-bold uppercase tracking-wide">
        <span>{label}</span>
        <span>({count})</span>
      </div>
    </Collapsible.Trigger>
  );
};

interface ResultSectionProps {
  status: ResultStatus;
  label: string;
  results: LinkCheckingResult[];

  defaultOpen?: boolean;
}

const ResultSection = ({
  status,
  label,
  results,

  defaultOpen,
}: ResultSectionProps) => (
  <Collapsible.Root className="group" defaultOpen={defaultOpen}>
    <CollapsibleTrigger count={results.length} label={label} variant={status} />
    {results.length > 0 && (
      <Collapsible.Content>
        <ol className="mb-1 mt-2 flex list-none flex-col gap-4">
          {results.map((result, index) => (
            <LinkResultView key={index} {...result} />
          ))}
        </ol>
      </Collapsible.Content>
    )}
  </Collapsible.Root>
);

export const LinkChecker = ({ emailSlug, emailMarkup }: LinkCheckerProps) => {
  const cacheKey = `link-checking-results-${emailSlug.replaceAll('/', '-')}`;
  const cachedResults = localStorage.getItem(cacheKey);

  const [results, setResults] = React.useState<
    LinkCheckingResult[] | undefined
  >(cachedResults ? JSON.parse(cachedResults) : undefined);
  const [loading, setLoading] = React.useState(false);

  const errorResults = React.useMemo(
    () => results?.filter((result) => result.status === 'error') || [],
    [results],
  );
  const warningResults = React.useMemo(
    () => results?.filter((result) => result.status === 'warning') || [],
    [results],
  );
  const successResults = React.useMemo(
    () => results?.filter((result) => result.status === 'success') || [],
    [results],
  );

  const handleRun = () => {
    setLoading(true);
    checkLinks(emailMarkup)
      .then((newResults) => {
        setResults(newResults);
        localStorage.setItem(cacheKey, JSON.stringify(newResults));
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="mt-3 flex w-full flex-col gap-2 text-pretty">
      {results ? (
        <>
          <ResultSection
            defaultOpen
            label="Errors"
            results={errorResults}
            status="error"
          />
          <ResultSection
            label="Warnings"
            results={warningResults}
            status="warning"
          />
          <ResultSection
            label="Success"
            results={successResults}
            status="success"
          />
          <Button
            className="mt-2 transition-all disabled:border-transparent disabled:bg-slate-11"
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
            className="mt-1.5 transition-all disabled:border-transparent disabled:bg-slate-11"
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
      className="group/item relative rounded-md p-2 pl-4 transition-colors duration-300 ease-out hover:bg-slate-5"
      data-status={props.status}
      initial="hidden"
      layout
      variants={containerAnimation}
    >
      <a href={props.link} target="_blank" rel="noopener noreferrer">
        <motion.div
          className="flex items-center gap-2 text-xs group-data-[status=error]/item:text-red-400 group-data-[status=success]/item:text-green-400 group-data-[status=warning]/item:text-yellow-300"
          variants={childAnimation}
        >
          <span className="flex-shrink overflow-hidden text-ellipsis whitespace-nowrap transition-all duration-200">
            {props.link}
          </span>
        </motion.div>
        <motion.div
          className="mt-1 text-[.625rem] font-semibold uppercase"
          variants={childAnimation}
        >
          {props.checks
            .map((check) => {
              if (check.type === 'syntax' && !check.passed)
                return 'Invalid URL';
              if (check.type === 'fetch_attempt')
                return `${check.metadata.fetchStatusCode}`;
              if (check.type === 'security')
                return check.passed ? 'Secure' : 'Insecure';
              return null;
            })
            .filter(Boolean)
            .join(' - ')}
        </motion.div>
      </a>
    </motion.li>
  </AnimatePresence>
);
