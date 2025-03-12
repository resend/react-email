import { fail } from 'assert';
import prettyBytes from 'pretty-bytes';
import { useEffect, useState } from 'react';
import type { CompatibilityCheckingResult } from '../../actions/email-validation/check-compatibility';
import {
  type ImageCheckingResult,
  checkImages,
} from '../../actions/email-validation/check-images';
import {
  type LinkCheckingResult,
  checkLinks,
} from '../../actions/email-validation/check-links';
import { cn } from '../../utils';
import { IconWarning } from '../icons/icon-warning';
import { Results } from './results';

type LintingRow =
  | {
    source: 'image';
    result: ImageCheckingResult;
  }
  | {
    source: 'link';
    result: LinkCheckingResult;
  }
  | {
    source: 'compatibility';
    result: CompatibilityCheckingResult;
  };

interface LinterProps {
  rows: LintingRow[] | undefined;
}

export const useLinter = ({
  markup,
  slug,
}: {
  markup: string;
  slug: string;
}) => {
  const cacheKey = `linter-${slug.replaceAll('/', '-')}`;
  const [rows, setRows] = useState<LintingRow[] | undefined>();

  useEffect(() => {
    const cachedValue =
      'localStorage' in global ? global.localStorage.getItem(cacheKey) : null;
    if (cachedValue) {
      setRows(JSON.parse(cachedValue));
    }
  }, [cacheKey]);

  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const imageResultsReader = (
      await checkImages(markup, `${location.protocol}//${location.host}`)
    ).getReader();
    const linkResultsReader = (await checkLinks(markup)).getReader();
    setRows([]);

    const insertRow = (row: LintingRow) => {
      setRows((current) => {
        if (!current) {
          return [row];
        }

        if (
          current.some((other) => {
            if (
              row.source === 'link' &&
              other.source === 'link' &&
              other.result.link === row.result.link
            )
              return true;

            if (
              row.source === 'image' &&
              other.source === 'image' &&
              other.result.source === row.result.source
            )
              return true;
          })
        ) {
          return current;
        }

        return [...current, row];
      });
    };

    try {
      while (true) {
        const { done: imageResultsReaderDone, value: imageLintingResult } =
          await imageResultsReader.read();
        if (imageLintingResult && imageLintingResult.status !== 'success') {
          insertRow({
            result: imageLintingResult,
            source: 'image',
          });
        }

        const { done: linkResultsReaderDone, value: linkLintingResult } =
          await linkResultsReader.read();
        if (linkLintingResult && linkLintingResult.status !== 'success') {
          insertRow({
            result: linkLintingResult,
            source: 'link',
          });
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

  return [rows, { loading, load }] as const;
};

export const Linter = ({ rows }: LinterProps) => {
  if (rows === undefined) return null;

  return (
    <Results>
      {rows.map((row, i) => {
        if (row.source === 'link') {
          const failingCheck = row.result.checks.find(
            (check) => check.passed === false,
          )!;
          return (
            <Result status={row.result.status} key={i}>
              <Result.Name>{failingCheck.type}</Result.Name>
              <Result.Description>
                {failingCheck.type === 'security'
                  ? 'Insecure URL, use HTTPS insted of HTTP'
                  : null}
                {failingCheck.type === 'fetch_attempt' &&
                  failingCheck.metadata.fetchStatusCode &&
                  failingCheck.metadata.fetchStatusCode >= 300 &&
                  failingCheck.metadata.fetchStatusCode < 400
                  ? 'There was a redirect, the content may have been moved'
                  : null}
                {failingCheck.type === 'fetch_attempt' &&
                  failingCheck.metadata.fetchStatusCode &&
                  failingCheck.metadata.fetchStatusCode >= 400
                  ? 'The link is broken'
                  : null}
                {failingCheck.type === 'syntax'
                  ? 'The link is broken due to invalid syntax'
                  : null}

                <span className="font-mono float-right text-ellipsis overflow-hidden text-nowrap max-w-[30ch]">
                  {row.result.link}
                </span>
              </Result.Description>
              <Result.Metadata>
                {failingCheck.type === 'fetch_attempt'
                  ? failingCheck.metadata.fetchStatusCode
                  : ''}
              </Result.Metadata>
            </Result>
          );
        }

        if (row.source === 'image') {
          const failingCheck = row.result.checks.find(
            (check) => check.passed === false,
          )!;
          return (
            <Result status={row.result.status} key={i}>
              <Result.Name>{failingCheck.type}</Result.Name>
              <Result.Description>
                {failingCheck.type === 'security'
                  ? 'Insecure URL, use HTTPS insted of HTTP'
                  : null}
                {failingCheck.type === 'fetch_attempt' &&
                  failingCheck.metadata.fetchStatusCode &&
                  failingCheck.metadata.fetchStatusCode >= 300 &&
                  failingCheck.metadata.fetchStatusCode < 400
                  ? 'There was a redirect, the image may have been moved'
                  : null}
                {failingCheck.type === 'fetch_attempt' &&
                  failingCheck.metadata.fetchStatusCode &&
                  failingCheck.metadata.fetchStatusCode >= 400
                  ? 'The image is broken'
                  : null}
                {failingCheck.type === 'syntax'
                  ? 'The image is broken due to an invalid source'
                  : null}

                {failingCheck.type === 'accessibility'
                  ? 'Missing alt text'
                  : null}

                {failingCheck.type === 'image_size' &&
                  failingCheck.metadata.byteCount
                  ? 'This image is too large, keep it under 1mb'
                  : null}

                <span className="font-mono float-right text-ellipsis overflow-hidden text-nowrap max-w-[30ch]">
                  {row.result.source}
                </span>
              </Result.Description>
              <Result.Metadata>
                {row.result.checks
                  .map((check) => {
                    if (
                      check.type === 'fetch_attempt' &&
                      check.metadata.fetchStatusCode
                    ) {
                      return check.metadata.fetchStatusCode;
                    }

                    if (
                      check.type === 'image_size' &&
                      check.metadata.byteCount
                    ) {
                      return prettyBytes(check.metadata.byteCount);
                    }

                    return undefined;
                  })
                  .filter(Boolean)
                  .join('—')}
              </Result.Metadata>
            </Result>
          );
        }

        return undefined;
      })}
    </Results>
  );
};

interface ResultProps extends React.ComponentProps<typeof Results.Row> {
  status: 'error' | 'warning' | 'success';
}

const Result = ({ children, className, status, ...props }: ResultProps) => {
  return (
    <Results.Row
      data-status={status}
      {...props}
      className={cn('group/result', className)}
    >
      {children}
    </Results.Row>
  );
};

Result.Name = ({
  children,
  ...props
}: React.ComponentProps<typeof Results.Column>) => {
  return (
    <Results.Column {...props}>
      <span className="flex uppercase gap-1 items-center group-data-[status=error]/result:text-red-400 group-data-[status=warning]/result:text-orange-300">
        <IconWarning />
        {children}
      </span>
    </Results.Column>
  );
};

Result.Description = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Results.Column>) => {
  return <Results.Column {...props}>{children}</Results.Column>;
};

Result.Metadata = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Results.Column>) => {
  return (
    <Results.Column
      align="right"
      {...props}
      className={cn('font-mono text-slate-11', className)}
    >
      {children}
    </Results.Column>
  );
};
