import prettyBytes from 'pretty-bytes';
import { useEffect, useState } from 'react';
import {
  type ImageCheck,
  type ImageCheckingResult,
  checkImages,
} from '../../actions/email-validation/check-images';
import {
  type LinkCheck,
  type LinkCheckingResult,
  checkLinks,
} from '../../actions/email-validation/check-links';
import { IconWarning } from '../icons/icon-warning';
import { Results } from './results';

type LintingResult = Omit<
  ImageCheckingResult | LinkCheckingResult,
  'checks'
> & {
  checks: (LinkCheck | ImageCheck)[];
};

interface LinterProps {
  results: LintingResult[] | undefined;
}

export const useLinter = ({
  markup,
  slug,
}: {
  markup: string;
  slug: string;
}) => {
  const cacheKey = `linter-${slug.replaceAll('/', '-')}`;
  const [results, setResults] = useState<LintingResult[] | undefined>();

  useEffect(() => {
    const cachedValue =
      'localStorage' in global ? global.localStorage.getItem(cacheKey) : null;
    if (cachedValue) {
      setResults(JSON.parse(cachedValue));
    }
  }, [cacheKey]);

  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const imageResultsReader = (
      await checkImages(markup, `${location.protocol}//${location.host}`)
    ).getReader();
    const linkResultsReader = (await checkLinks(markup)).getReader();
    setResults([]);

    try {
      while (true) {
        const { done: imageResultsReaderDone, value: imageLintingResult } =
          await imageResultsReader.read();
        if (imageLintingResult) {
          setResults((results) => [...results!, imageLintingResult]);
        }
        const { done: linkResultsReaderDone, value: linkLintingResult } =
          await linkResultsReader.read();
        if (linkLintingResult) {
          setResults((results) => [...results!, linkLintingResult]);
        }
        if (linkResultsReaderDone && imageResultsReaderDone) {
          break;
        }
      }
    } finally {
      linkResultsReader.releaseLock();
      imageResultsReader.releaseLock();
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return [results, { loading, load }] as const;
};

export const Linter = ({ results }: LinterProps) => {
  if (results === undefined) return null;

  return (
    <Results>
      {results
        .filter((result) => result.status !== 'success')
        .map((result, i) => {
          const metadataString = result.checks
            .map((check) => {
              if (
                check.type === 'fetch_attempt' &&
                check.metadata.fetchStatusCode
              )
                return `${check.metadata?.fetchStatusCode}`;
              if (check.type === 'image_size' && check.metadata.byteCount)
                return `${prettyBytes(check.metadata.byteCount)}`;
              return null;
            })
            .filter(Boolean)
            .join(' - ');
          const failingCheck = result.checks.find(
            (check) => check.passed === false,
          )!;

          const checkDescription = (() => {
            if (failingCheck.type === 'security') {
              return 'Insecure URL, use HTTPS instead of HTTP';
            }
            if (
              failingCheck.type === 'fetch_attempt' &&
              failingCheck.metadata.fetchStatusCode !== undefined
            ) {
              if (
                failingCheck.metadata.fetchStatusCode >= 300 &&
                failingCheck.metadata.fetchStatusCode < 400
              ) {
                return `There was a redirect (${failingCheck.metadata.fetchStatusCode}), the content may have been moved`;
              }
              return `The link is broken, returning ${failingCheck.metadata.fetchStatusCode}`;
            }
            if (failingCheck.type === 'accessibility') {
              return 'Missing alt text';
            }
            if (failingCheck.type === 'syntax') {
              return 'The link is broken due to invalid syntax';
            }
            if (
              failingCheck.type === 'image_size' &&
              failingCheck.metadata.byteCount
            ) {
              return `This image is too large (${prettyBytes(failingCheck.metadata.byteCount)}), keep it under 1mb`;
            }
          })();

          return (
            <Results.Row key={i}>
              <Results.Column>
                <span
                  className="flex uppercase gap-1 items-center data-[status=error]:text-red-400 data-[status=warning]:text-orange-300"
                  data-status={result.status}
                >
                  <IconWarning />
                  {failingCheck.type}
                </span>
              </Results.Column>
              <Results.Column>
                {checkDescription}
                {result.intendedFor && (
                  <span className="float-right font-mono text-slate-11 max-w-[30ch] text-nowrap overflow-hidden text-ellipsis">
                    {result.intendedFor}
                  </span>
                )}
              </Results.Column>
              <Results.Column align="right" className="font-mono text-slate-11">
                {metadataString}
              </Results.Column>
            </Results.Row>
          );
        })}
    </Results>
  );
};
