import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  checkLinks,
  type LinkCheckingResult,
} from '../../actions/email-validation/check-links';
import { Button } from '../button';
import { useEmails } from '../../contexts/emails';
import { emailSlugToPathMap } from '../../app/preview/[...slug]/preview';
import { IconCircleCheck } from '../icons/icon-circle-check';
import { IconCircleClose } from '../icons/icon-circle-close';
import { IconCircleWarning } from '../icons/icon-circle-warning';
import { Heading } from '../heading';

const checkingResultsCache = new Map<string, LinkCheckingResult[]>();

interface LinkCheckerProps {
  currentEmailOpenSlug: string;
}

export const LinkChecker = ({ currentEmailOpenSlug }: LinkCheckerProps) => {
  const [results, setResults] = React.useState<
    LinkCheckingResult[] | undefined
  >(checkingResultsCache.get(currentEmailOpenSlug));

  const { renderingResultPerEmailPath } = useEmails();

  const emailPath = emailSlugToPathMap[currentEmailOpenSlug];
  if (!emailPath) return;
  const renderingResult = renderingResultPerEmailPath[emailPath];
  if (!renderingResult || 'error' in renderingResult) return;

  const handleRun = () => {
    checkLinks(renderingResult.markup)
      .then((newResults) => {
        checkingResultsCache.set(currentEmailOpenSlug, newResults);
        setResults(newResults);
      })
      .catch((exception) => {
        throw exception;
      });
  };

  return (
    <div className="mt-4 flex w-full flex-col gap-2 text-pretty p-2 pr-2.5">
      <Heading as="h2" size="2" weight="medium">
        Link Checker
      </Heading>
      {results ? (
        <>
          <ol className="mb-3.5 mt-2 flex list-none flex-col gap-4 p-0">
            {results.map((result, i) => (
              <LinkCheckingResultView {...result} key={i} />
            ))}
          </ol>
          <Button className="mr-auto mt-auto w-fit" onClick={handleRun}>
            Re-run
          </Button>
        </>
      ) : (
        <>
          <span className="text-xs">
            Check if all links are valid and going to the correct pages.
          </span>
          <Button className="mt-1.5 w-fit" onClick={handleRun}>
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
              if (props.status === 'success') return <IconCircleCheck size={14} />;
              if (props.status === 'warning') return <IconCircleWarning size={14} />;
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
          {(() => {
            if (props.checks.syntax === 'failed') {
              return 'Invalid URL';
            }

            if (props.responseStatusCode) {
              return `${props.responseStatusCode} - ${props.checks.security === 'failed' ? 'Insecure' : 'Secure'
                }`;
            }

            if (!props.responseStatusCode) {
              return `URL could not be reached`;
            }
          })()}
        </motion.div>
      </motion.li>
    </AnimatePresence>
  );
};
