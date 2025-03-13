import prettyBytes from 'pretty-bytes';
import { useEffect, useState } from 'react';
import { nicenames } from '../../actions/email-validation/caniemail-data';
import {
  type CompatibilityCheckingResult,
  checkCompatibility,
} from '../../actions/email-validation/check-compatibility';
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
  reactMarkup,
  slug,
  emailPath,
}: {
  reactMarkup: string;
  markup: string;
  emailPath: string;
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

  interface LintingSource<T> {
    getStream(): Promise<ReadableStream<T>>;
    mapValue(value: T): LintingRow | undefined;
  }

  const sources = [
    {
      getStream() {
        return checkImages(markup, `${location.protocol}//${location.host}`);
      },
      mapValue(result) {
        if (result && result.status !== 'success') {
          return {
            result: result,
            source: 'image',
          };
        }
      },
    } satisfies LintingSource<ImageCheckingResult>,
    {
      getStream() {
        return checkLinks(markup);
      },
      mapValue(result) {
        if (result && result.status !== 'success') {
          return {
            result: result,
            source: 'link',
          };
        }
      },
    } satisfies LintingSource<LinkCheckingResult>,
    {
      getStream() {
        return checkCompatibility(reactMarkup, emailPath);
      },
      mapValue(value) {
        if (value && value.status !== 'working') {
          return {
            result: value,
            source: 'compatibility',
          };
        }
      },
    } satisfies LintingSource<CompatibilityCheckingResult>,
  ];

  const load = async () => {
    setLoading(true);

    setRows([]);

    const insertRow = (row: LintingRow) => {};

    try {
      await Promise.all(
        sources.map(async (source) => {
          const stream = await source.getStream();
          const reader = stream.getReader();
          try {
            while (true) {
              const { value, done } = await reader.read();
              if (done) {
                break;
              }

              const row = source.mapValue(value as never);
              if (row) {
                setRows((current) => {
                  if (!current) {
                    return [row];
                  }

                  return [...current, row];
                });
              }
            }
          } finally {
            reader.releaseLock();
          }
        }),
      );
    } finally {
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

        if (row.source === 'compatibility') {
          const statsReportedNotWorking = Object.entries(
            row.result.statsPerEmailClient,
          ).filter(([k, stats]) => stats.status === 'not working');
          const statsReportedPartiallyWorking = Object.entries(
            row.result.statsPerEmailClient,
          ).filter(([k, stats]) => stats.status === 'working with caveats');

          const unsupportedClientsString = statsReportedNotWorking
            .map(([emailClient, stats]) => nicenames.family[emailClient])
            .join(', ');
          const partiallySupportedClientsString = statsReportedPartiallyWorking
            .map(([emailClient, stats]) => nicenames.family[emailClient])
            .join(', ');

          return (
            <Result
              status={
                (
                  {
                    working: 'success',
                    'working with caveats': 'warning',
                    'not working': 'error',
                  } as const
                )[row.result.status]
              }
              key={i}
            >
              <Result.Name>{row.result.entry.title}</Result.Name>
              <Result.Description>
                {statsReportedNotWorking.length > 0
                  ? `Not supported in ${unsupportedClientsString}`
                  : null}
                {statsReportedPartiallyWorking.length > 0 &&
                statsReportedNotWorking.length > 0
                  ? '. '
                  : null}
                {statsReportedPartiallyWorking.length > 0
                  ? `Partially supported in ${partiallySupportedClientsString}`
                  : null}
              </Result.Description>
              <Result.Metadata>
                <a
                  href={row.result.entry.url}
                  className="underline"
                  rel="noreferrer"
                  target="_blank"
                >
                  See more info
                </a>
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
