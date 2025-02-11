"use client"

import * as React from 'react';
import {
  type LinkCheckingResult,
  checkLinks,
} from '../../actions/email-validation/check-links';
import { Button } from '../button';
import { Result, ResultList, type ResultStatus } from './checking-results';

interface LinkCheckerResultsProps {
  label: string;
  status: ResultStatus;
  results: LinkCheckingResult[];

  justLoadedIn: boolean;
}

export const checkerContext = React.createContext(null)

export const CheckProvider = ({ children }) => {
  const [codeWithNodeIds, setCodeWithNodeIds] = React.useState("")

  return <checkerContext.Provider value={{ codeWithNodeIds, setCodeWithNodeIds }}>{children}</checkerContext.Provider>
}

const LinkCheckerResults = ({
  label,
  status,
  results,

  justLoadedIn,
}: LinkCheckerResultsProps) => {
  function highlightNode(nodeId: string) {
    const iframe = document.querySelector('iframe')

    iframe?.contentWindow.postMessage({ type: 'highlight', nodeId }, '*')
  }

  function removeHighlight(nodeId: string) {
    const iframe = document.querySelector('iframe')
    iframe?.contentWindow.postMessage({ type: 'remove-highlight', nodeId }, '*')
  }

  return (
    <ResultList
      label={
        <>
          <span>{label}</span>
          <span>({results.length})</span>
        </>
      }
      defaultOpen={justLoadedIn}
      status={status}
      disabled={results.length === 0}
    >
      {results.map(({ link, status, checks, nodeId }) => (
        <Result key={link} status={status}>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
            onMouseEnter={() => highlightNode(nodeId)}
            onMouseLeave={() => removeHighlight(nodeId)}
          >
            <Result.Title>
              <span className="block overflow-hidden truncate text-ellipsis whitespace-nowrap">
                {link}
              </span>
            </Result.Title>
            <Result.StatusDescription>
              {checks
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
            </Result.StatusDescription>
          </a>
        </Result>
      ))}
    </ResultList>
  );
};

interface LinkCheckerProps {
  emailSlug: string;
  emailMarkup: string;
}

export const LinkChecker = ({ emailSlug, emailMarkup }: LinkCheckerProps) => {
  const cacheKey = `link-checking-results-${emailSlug.replaceAll('/', '-')}`;
  const context = React.useContext(checkerContext)

  const [results, setResults] = React.useState<
    LinkCheckingResult[] | undefined
  >();

  React.useEffect(() => {
    const cachedValue =
      'localStorage' in global ? global.localStorage.getItem(cacheKey) : null;
    if (cachedValue) {
      setResults(JSON.parse(cachedValue));
    }
  }, [cacheKey]);

  const [justLoadedIn, setJustLoadedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleRun = () => {
    setLoading(true);
    checkLinks(emailMarkup)
      .then(({ linkCheckingResults, mappedAst }) => {
        setResults(linkCheckingResults);
        setJustLoadedIn(true);
        context.setCodeWithNodeIds(mappedAst)
        localStorage.setItem(cacheKey, JSON.stringify(linkCheckingResults));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

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

  return (
    <div className="mt-4 flex w-full flex-col gap-2 text-pretty">
      {results ? (
        <>
          <LinkCheckerResults
            label="Errors"
            results={errorResults}
            justLoadedIn={justLoadedIn}
            status="error"
          />
          <LinkCheckerResults
            label="Warnings"
            results={warningResults}
            justLoadedIn={justLoadedIn}
            status="warning"
          />
          <LinkCheckerResults
            label="Success"
            results={successResults}
            justLoadedIn={justLoadedIn}
            status="success"
          />
        </>
      ) : (
        <span className="text-xs leading-relaxed">
          Check if all links are valid and redirect to the correct pages.
        </span>
      )}
      <Button loading={loading} onClick={handleRun}>
        {results ? 'Re-run' : 'Run'}
      </Button>
    </div>
  );
};
