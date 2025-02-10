import prettyBytes from 'pretty-bytes';
import * as React from 'react';
import {
  type ImageCheckingResult,
  checkImages,
} from '../../actions/email-validation/check-images';
import { Button } from '../button';
import { Result, ResultList, type ResultStatus } from './checking-results';

interface SpamAssassinResultsProps {
  label: string;
  status: ResultStatus;
  results: ImageCheckingResult[];

  justLoadedIn: boolean;
}

const SpamAssassinResults = ({
  label,
  status,
  results,

  justLoadedIn,
}: SpamAssassinResultsProps) => {
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
      {results.map(({ source, status, checks }) => (
        <Result className="flex gap-2" key={source} status={status}>
          <img
            width="24px"
            className="my-auto rounded-sm"
            src={source}
            // biome-ignore lint/a11y/noRedundantAlt: The word image does fit in with the context and thus is not redundant
            alt="image checked"
          />
          <div className="flex w-[calc(100%-.5rem-24px)] flex-col">
            <Result.Title>
              <span className="block overflow-hidden truncate text-ellipsis whitespace-nowrap">
                {source}
              </span>
            </Result.Title>
            <Result.StatusDescription>
              {checks
                .map((check) => {
                  if (check.type === 'syntax' && !check.passed)
                    return 'Invalid URL';
                  if (check.type === 'accessibility' && !check.passed)
                    return 'Missing alt';
                  if (check.type === 'security')
                    return check.passed ? 'Secure' : 'Insecure';
                  if (
                    check.type === 'fetch_attempt' &&
                    check.metadata.fetchStatusCode
                  )
                    return `${check.metadata.fetchStatusCode}`;
                  if (check.type === 'image_size' && check.metadata.byteCount)
                    return `${prettyBytes(check.metadata.byteCount)}`;
                  return null;
                })
                .filter(Boolean)
                .join(' - ')}
            </Result.StatusDescription>
          </div>
        </Result>
      ))}
    </ResultList>
  );
};

interface SpamAssassinProps {
  emailSlug: string;
  emailMarkup: string;
}

export const SpamAssassin = ({ emailSlug, emailMarkup }: SpamAssassinProps) => {
  const cacheKey = `image-checking-results-${emailSlug.replaceAll('/', '-')}`;

  const [results, setResults] = React.useState<
    ImageCheckingResult[] | undefined
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
    checkImages(emailMarkup, `${location.protocol}//${location.host}`)
      .then((newResults) => {
        setResults(newResults);
        setJustLoadedIn(true);
        localStorage.setItem(cacheKey, JSON.stringify(newResults));
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
          <SpamAssassinResults
            label="Errors"
            results={errorResults}
            justLoadedIn={justLoadedIn}
            status="error"
          />
          <SpamAssassinResults
            label="Warnings"
            results={warningResults}
            justLoadedIn={justLoadedIn}
            status="warning"
          />
          <SpamAssassinResults
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
