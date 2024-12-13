import * as React from 'react';
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
import { motion } from 'framer-motion';

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
      <Heading as="h2" size="3" weight="medium">
        Link Checker
      </Heading>
      {results ? (
        <>
          <ol className="list-none p-0">
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.15,
    },
  },
};

const LinkCheckingResultView = (props: LinkCheckingResult) => {
  let status: 'success' | 'error' | 'warning' = 'success';

  if (props.checks.security === 'failed') status = 'warning';
  if (props.checks.syntax === 'failed') status = 'error';
  if (
    props.responseStatusCode === undefined ||
    !props.responseStatusCode.toString().startsWith('2')
  )
    status = 'error';

  return (
    <motion.li
      className="group relative my-4"
      data-status={status}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex items-center gap-2 text-sm group-data-[status=error]:text-red-400 group-data-[status=success]:text-green-400 group-data-[status=warning]:text-yellow-300">
        <span>
          {(() => {
            if (status === 'success') return <IconCircleCheck size={14} />;
            if (status === 'warning') return <IconCircleWarning size={14} />;
            return <IconCircleClose size={14} />;
          })()}
        </span>
        <a
          className="flex-shrink overflow-hidden text-ellipsis whitespace-nowrap"
          href={props.link}
        >
          {props.link}
        </a>
      </motion.div>
      <motion.div className="mt-1 text-xs">
        {(() => {
          if (props.checks.syntax === 'failed') {
            return 'Invalid URL';
          }

          if (props.responseStatusCode) {
            return `${props.responseStatusCode} - ${
              props.checks.security === 'failed' ? 'Insecure' : 'Secure'
            }`;
          }

          if (!props.responseStatusCode) {
            return `URL could not be reached`;
          }
        })()}
      </motion.div>
    </motion.li>
  );
};
