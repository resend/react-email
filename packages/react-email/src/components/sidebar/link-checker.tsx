import * as Collapsible from '@radix-ui/react-collapsible';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import Lottie from 'lottie-react';
import * as React from 'react';
import {
  type LinkCheckingResult,
  checkLinks,
} from '../../actions/email-validation/check-links';
import animatedLoadIcon from '../../animated-icons-data/load.json';
import { cn } from '../../utils';
import { Button } from '../button';

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
  error: 'text-red-600 hover:bg-red-600/10',
  warning: 'text-yellow-300 hover:bg-yellow-400/10',
  success: 'text-green-600 hover:bg-green-600/10',
};

interface LinkCheckerProps {
  emailSlug: string;
  emailMarkup: string;
}

type ResultStatus = 'error' | 'warning' | 'success';

interface CollapsibleTriggerProps {
  count: number;
  label: string;
  variant: ResultStatus;
  disabled?: boolean;
}

interface ResultSectionProps {
  status: ResultStatus;
  label: string;
  results: LinkCheckingResult[];
  open: boolean;
}

const CollapsibleTrigger = ({
  count,
  label,
  variant,
  disabled,
}: CollapsibleTriggerProps) => (
  <Collapsible.Trigger
    className={clsx(
      'group flex w-full items-center gap-1 rounded p-2 transition-colors duration-200 ease-[cubic-bezier(.36,.66,.6,1)]',
      statusStyles[variant],
      disabled && 'cursor-not-allowed opacity-70',
    )}
    disabled={disabled}
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
    <div className="flex flex-1 items-center gap-1 font-bold text-[.625rem] uppercase tracking-wide">
      <span>{label}</span>
      <span>({count})</span>
    </div>
  </Collapsible.Trigger>
);

const ResultSection = ({
  status,
  label,
  results,
  open,
}: ResultSectionProps) => {
  const isEmpty = results.length === 0;

  return (
    <Collapsible.Root className="group" defaultOpen={open && !isEmpty}>
      <CollapsibleTrigger
        count={results.length}
        label={label}
        variant={status}
        disabled={isEmpty}
      />
      {!isEmpty && (
        <Collapsible.Content>
          <ol className="mt-2 mb-1 flex list-none flex-col gap-4">
            {results.map((result, index) => (
              <LinkResultView key={index} {...result} />
            ))}
          </ol>
        </Collapsible.Content>
      )}
    </Collapsible.Root>
  );
};

const LoadingButton = ({
  loading,
  onClick,
  loadAnimation,
  animatedLoadIcon,
  children,
}: any) => {
  React.useEffect(() => {
    if (loading) {
      loadAnimation.current?.play();
    }
  }, [loading, loadAnimation]);

  return (
    <Button
      className="mt-2 mb-4 min-w-[5rem] transition-all disabled:border-transparent disabled:bg-slate-11"
      disabled={loading}
      onClick={onClick}
    >
      <div className="flex items-center justify-center gap-2">
        <span
          className={cn(
            '-ml-7 opacity-0 transition-opacity duration-200',
            loading && 'opacity-100',
          )}
        >
          <Lottie
            animationData={animatedLoadIcon}
            autoPlay={false}
            className="h-5 w-5"
            loop={true}
            lottieRef={loadAnimation}
          />
        </span>
        <span>{children}</span>
      </div>
    </Button>
  );
};

const LinkResultView = (props: LinkCheckingResult) => (
  <AnimatePresence mode="wait">
    <motion.li
      animate="visible"
      className="group/item relative w-full rounded-md p-2 pl-4 transition-colors duration-300 ease-out hover:bg-slate-5"
      data-status={props.status}
      initial="hidden"
      layout
      variants={containerAnimation}
    >
      <a
        href={props.link}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full"
      >
        <motion.div
          className="flex w-full items-center gap-2 text-xs group-data-[status=error]/item:text-red-400 group-data-[status=success]/item:text-green-400 group-data-[status=warning]/item:text-yellow-300"
          variants={childAnimation}
        >
          <span className="block overflow-hidden truncate text-ellipsis whitespace-nowrap">
            {props.link}
          </span>
        </motion.div>
        <motion.div
          className="mt-1 font-semibold text-[.625rem] uppercase"
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

export const LinkChecker = ({ emailSlug, emailMarkup }: LinkCheckerProps) => {
  const cacheKey = `link-checking-results-${emailSlug.replaceAll('/', '-')}`;
  const cachedResults =
    'localStorage' in window ? window.localStorage.getItem(cacheKey) : null;

  const [results, setResults] = React.useState<
    LinkCheckingResult[] | undefined
  >(cachedResults ? JSON.parse(cachedResults) : undefined);
  const [sectionsOpen, setSectionsOpen] = React.useState(false);
  const loadAnimation = React.useRef(null);
  const [loading, setLoading] = React.useState(false);

  const errorResults = React.useMemo(
    () => results?.filter((r) => r.status === 'error') || [],
    [results],
  );
  const warningResults = React.useMemo(
    () => results?.filter((r) => r.status === 'warning') || [],
    [results],
  );
  const successResults = React.useMemo(
    () => results?.filter((r) => r.status === 'success') || [],
    [results],
  );

  const handleRun = () => {
    setLoading(true);
    checkLinks(emailMarkup)
      .then((newResults) => {
        setResults(newResults);
        setSectionsOpen(true);
        localStorage.setItem(cacheKey, JSON.stringify(newResults));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  return (
    <div className="mt-4 flex w-full flex-col gap-2 text-pretty">
      {results ? (
        <>
          <ResultSection
            label="Errors"
            results={errorResults}
            status="error"
            open={sectionsOpen}
          />
          <ResultSection
            label="Warnings"
            results={warningResults}
            status="warning"
            open={sectionsOpen}
          />
          <ResultSection
            label="Success"
            results={successResults}
            status="success"
            open={sectionsOpen}
          />
        </>
      ) : (
        <span className="text-xs leading-relaxed">
          Check if all links are valid and redirect to the correct pages.
        </span>
      )}
      <LoadingButton
        loading={loading}
        onClick={handleRun}
        loadAnimation={loadAnimation}
        animatedLoadIcon={animatedLoadIcon}
      >
        {results ? 'Re-run' : 'Run'}
      </LoadingButton>
    </div>
  );
};
