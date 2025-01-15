import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  checkLinks,
  type LinkCheckingResult,
} from '../../actions/email-validation/check-links';
import { Button } from '../button';
import { IconCircleCheck } from '../icons/icon-circle-check';
import { IconCircleClose } from '../icons/icon-circle-close';
import { IconCircleWarning } from '../icons/icon-circle-warning';

const checkingResultsCache = new Map<string, LinkCheckingResult[]>();

interface LinkCheckerProps {
  currentEmailOpenSlug: string;
  markup: string;
}

export const LinkChecker = ({
  currentEmailOpenSlug,
  markup,
}: LinkCheckerProps) => {
  const [results, setResults] = React.useState<
    LinkCheckingResult[] | undefined
  >(checkingResultsCache.get(currentEmailOpenSlug));

  const [loading, setLoading] = React.useState(false);

  const handleRun = () => {
    setLoading(true);
    checkLinks(markup)
      .then((newResults) => {
        checkingResultsCache.set(currentEmailOpenSlug, newResults);
        setResults(newResults);
      })
      .catch((exception) => {
        throw exception;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="mt-3 flex w-full flex-col gap-2 text-pretty">
      {results ? (
        <>
          <ol className="mb-3.5 flex list-none flex-col gap-4 p-0">
            {results.map((result, i) => (
              <LinkCheckingResultView {...result} key={i} />
            ))}
          </ol>
          <Button
            className="disabled:border-transparent disabled:bg-slate-11"
            disabled={loading}
            onClick={() => {
              handleRun();
            }}
          >
            Re-run
          </Button>
        </>
      ) : (
        <>
          <span className="text-xs leading-relaxed">
            Check if all links are valid and going to the correct pages.
          </span>
          <Button
            className="mt-1.5 disabled:border-transparent disabled:bg-slate-11"
            disabled={loading}
            onClick={() => {
              handleRun();
            }}
          >
            Run
          </Button>
        </>
      )}
    </div>
  );
};

const containerVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      staggerChildren: 0.1,
    },
  },
};

const childVariants = {
  hidden: {
    opacity: 0,
    y: 5,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

const LinkCheckingResultView = (props: LinkCheckingResult) => {
  return (
    <AnimatePresence mode="wait">
      <motion.li
        animate="visible"
        className="group relative"
        data-status={props.status}
        initial="hidden"
        layout
        variants={containerVariants}
      >
        <motion.div
          className="flex items-center gap-2 text-sm group-data-[status=error]:text-red-400 group-data-[status=success]:text-green-400 group-data-[status=warning]:text-yellow-300"
          variants={childVariants}
        >
          <motion.span
            animate={{ scale: 1 }}
            initial={{ scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {(() => {
              if (props.status === 'success')
                return <IconCircleCheck size={14} />;
              if (props.status === 'warning')
                return <IconCircleWarning size={14} />;
              return <IconCircleClose size={14} />;
            })()}
          </motion.span>
          <a
            className="flex-shrink overflow-hidden text-ellipsis whitespace-nowrap transition-colors duration-200 hover:underline"
            href={props.link}
          >
            {props.link}
          </a>
        </motion.div>
        <motion.div className="mt-1 text-xs" variants={childVariants}>
          {props.checks
            .map((check) => {
              if (check.type === 'syntax' && !check.passed) {
                return 'Invalid URL';
              }

              if (check.type === 'fetch_attempt') {
                return `${check.metadata.fetchStatusCode}`;
              }

              if (check.type === 'security') {
                return check.passed ? 'Secure' : 'Insecure';
              }

              return null;
            })
            .filter(Boolean)
            .join(' - ')}
        </motion.div>
      </motion.li>
    </AnimatePresence>
  );
};
