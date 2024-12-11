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
    <div className="flex h-full w-[calc(100vw-36px)] flex-col gap-3 p-2 text-center lg:w-full lg:min-w-[231px] lg:max-w-[231px]">
      <h2 className="text-xl">Link Checker</h2>
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
          <span className="text-sm text-gray-300">
            Check if all links are valid and going to the right pages
          </span>
          <Button className="mx-auto w-fit" onClick={handleRun}>
            Run
          </Button>
        </>
      )}
    </div>
  );
};

const LinkCheckingResultView = (props: LinkCheckingResult) => {
  let status: 'success' | 'error' | 'warning' = 'success';
  if (props.checks.security === 'failed') {
    status = 'warning';
  }
  if (props.checks.syntax === 'failed') {
    status = 'error';
  }
  if (
    props.responseStatusCode === undefined ||
    !props.responseStatusCode.toString().startsWith('2')
  ) {
    status = 'error';
  }
  return (
    <li className="group my-4 text-left" data-status={status}>
      <div className="flex items-center gap-2 text-sm group-data-[status=error]:text-red-400 group-data-[status=success]:text-green-400 group-data-[status=warning]:text-yellow-300">
        {(() => {
          if (status === 'success') {
            return <IconCircleCheck />;
          }
          if (status === 'warning') {
            return <IconCircleWarning />;
          }
          return <IconCircleClose />;
        })()}
        <a
          className="flex-shrink overflow-hidden text-ellipsis whitespace-nowrap"
          href={props.link}
        >
          {props.link}
        </a>
      </div>

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
    </li>
  );
};
