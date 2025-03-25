import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import prettyBytes from 'pretty-bytes';
import { Children, useRef, useState } from 'react';
import { nicenames } from '../../actions/email-validation/caniemail-data';
import type { CompatibilityCheckingResult } from '../../actions/email-validation/check-compatibility';
import type { ImageCheckingResult } from '../../actions/email-validation/check-images';
import type { LinkCheckingResult } from '../../actions/email-validation/check-links';
import { cn, sanitize } from '../../utils';
import { getLintingSources, loadLintingRowsFrom } from '../../utils/linting';
import { IconWarning } from '../icons/icon-warning';
import { Results } from './results';

export type LintingRow =
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
  emailPath,

  initialRows,
}: {
  reactMarkup: string;
  markup: string;
  emailPath: string;

  initialRows?: LintingRow[];
}) => {
  const [rows, setRows] = useState<LintingRow[] | undefined>(initialRows);

  const sources = getLintingSources(
    markup,
    reactMarkup,
    emailPath,
    'location' in global
      ? `${global.location.protocol}//${global.location.host}`
      : '',
  );

  const [loading, setLoading] = useState(false);
  const isStreaming = useRef(false);

  const load = async () => {
    if (isStreaming.current) return;
    isStreaming.current = true;
    setLoading(true);

    setRows([]);
    try {
      let rows: LintingRow[] = [];
      for await (const row of loadLintingRowsFrom(sources)) {
        setRows((current) => {
          if (!current) {
            return [row];
          }
          const newArray = [...current, row];
          newArray.sort((a, b) => {
            if (a.result.status === 'error' && b.result.status === 'warning') {
              return -1;
            }

            if (a.result.status === 'warning' && b.result.status === 'error') {
              return 1;
            }

            return 0;
          });
          rows = newArray;
          return newArray;
        });
      }
      return rows;
    } finally {
      setLoading(false);
      isStreaming.current = false;
    }
  };

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
              <Result.Name>{sanitize(failingCheck.type)}</Result.Name>
              <Result.Description>
                {failingCheck.type === 'security'
                  ? 'Insecure URL, use HTTPS insted of HTTP'
                  : null}
                {failingCheck.type === 'fetch_attempt' &&
                failingCheck.metadata.fetchStatusCode &&
                failingCheck.metadata.fetchStatusCode >= 300 &&
                failingCheck.metadata.fetchStatusCode < 400 ? (
                  <>
                    <strong>{failingCheck.metadata.fetchStatusCode}</strong>:
                    There was a redirect, the content may have been moved
                  </>
                ) : null}
                {failingCheck.type === 'fetch_attempt' &&
                failingCheck.metadata.fetchStatusCode &&
                failingCheck.metadata.fetchStatusCode >= 400 ? (
                  <>
                    <strong>{failingCheck.metadata.fetchStatusCode}</strong>:
                    The link is broken
                  </>
                ) : null}
                {failingCheck.type === 'syntax'
                  ? 'The link is broken due to invalid syntax'
                  : null}

                <span className="ml-2 text-ellipsis overflow-hidden text-nowrap max-w-[30ch]">
                  {row.result.link}
                </span>
              </Result.Description>
              <Result.Metadata>
                {[
                  <CodePreviewLine
                    line={row.result.codeLocation.line}
                    column={row.result.codeLocation.column}
                    type="html"
                  />,
                ]}
              </Result.Metadata>
            </Result>
          );
        }

        if (row.source === 'image') {
          const failingCheck = row.result.checks.find(
            (check) => check.passed === false,
          )!;
          const metadata: React.ReactNode[] = [];
          for (const check of row.result.checks) {
            if (check.type === 'image_size' && check.metadata.byteCount) {
              return prettyBytes(check.metadata.byteCount);
            }
          }
          metadata.push(
            <CodePreviewLine
              line={row.result.codeLocation.line}
              column={row.result.codeLocation.column}
              type="html"
            />,
          );
          return (
            <Result status={row.result.status} key={i}>
              <Result.Name>{sanitize(failingCheck.type)}</Result.Name>
              <Result.Description>
                {failingCheck.type === 'security'
                  ? 'Insecure URL, use HTTPS instead of HTTP'
                  : null}
                {failingCheck.type === 'fetch_attempt' &&
                failingCheck.metadata.fetchStatusCode &&
                failingCheck.metadata.fetchStatusCode >= 300 &&
                failingCheck.metadata.fetchStatusCode < 400 ? (
                  <>
                    <strong>{failingCheck.metadata.fetchStatusCode}</strong>:
                    There was a redirect, the image may have been moved
                  </>
                ) : null}
                {failingCheck.type === 'fetch_attempt' &&
                failingCheck.metadata.fetchStatusCode &&
                failingCheck.metadata.fetchStatusCode >= 400 ? (
                  <>
                    <strong>{failingCheck.metadata.fetchStatusCode}</strong>:
                    The image is broken
                  </>
                ) : null}
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

                <span className="ml-2 text-ellipsis overflow-hidden text-nowrap max-w-[30ch]">
                  {row.result.source}
                </span>
              </Result.Description>
              <Result.Metadata>{metadata}</Result.Metadata>
            </Result>
          );
        }

        if (row.source === 'compatibility') {
          const statsReportedNotWorking = Object.entries(
            row.result.statsPerEmailClient,
          ).filter(([, stats]) => stats.status === 'error');
          const statsReportedPartiallyWorking = Object.entries(
            row.result.statsPerEmailClient,
          ).filter(([, stats]) => stats.status === 'warning');

          const unsupportedClientsString = statsReportedNotWorking
            .map(([emailClient]) => nicenames.family[emailClient])
            .join(', ');
          const partiallySupportedClientsString = statsReportedPartiallyWorking
            .map(([emailClient]) => nicenames.family[emailClient])
            .join(', ');

          return (
            <Result status={row.result.status} key={i}>
              <Result.Name>{sanitize(row.result.entry.title)}</Result.Name>
              <Result.Description>
                {statsReportedNotWorking.length > 0
                  ? `Not supported in ${unsupportedClientsString}`
                  : null}
                {statsReportedPartiallyWorking.length > 0 &&
                statsReportedNotWorking.length > 0
                  ? '. '
                  : null}

                <a
                  href={row.result.entry.url}
                  className="underline ml-2 decoration-slate-9 decoration-1 hover:decoration-slate-11 transition-colors  hover:text-slate-12"
                  rel="noreferrer"
                  target="_blank"
                >
                  More ↗
                </a>
              </Result.Description>
              <Result.Metadata>
                {[
                  <CodePreviewLine
                    line={row.result.location.start.line}
                    column={row.result.location.start.column}
                    type="react"
                  />,
                ]}
              </Result.Metadata>
            </Result>
          );
        }

        return undefined;
      })}
    </Results>
  );
};

interface CodePreviewLineProps {
  line: number;
  column: number;

  type: 'react' | 'html';
}

const CodePreviewLine = ({ line, column, type }: CodePreviewLineProps) => {
  const searchParams = useSearchParams();

  const newSearchParams = new URLSearchParams(searchParams);
  newSearchParams.set('view', 'source');
  if (type === 'html') {
    newSearchParams.set('lang', 'markup');
  } else if (type === 'react') {
    newSearchParams.set('lang', 'jsx');
  }

  const fragmentIdentifier = `#L${line}`;

  return (
    <Link
      href={{
        search: newSearchParams.toString(),
        hash: fragmentIdentifier,
      }}
      scroll={false}
      className="appearance-none underline mx-2"
    >
      {line.toString().padStart(2, '0')}
    </Link>
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
      <span className="flex uppercase gap-2 items-center group-data-[status=error]/result:text-red-400 group-data-[status=warning]/result:text-orange-300">
        <IconWarning />
        {typeof children === 'string' ? sanitize(children) : children}
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

interface MetadatProps extends React.ComponentProps<typeof Results.Column> {
  children: React.ReactNode[];
}

Result.Metadata = ({ children, className, ...props }: MetadatProps) => {
  return (
    <Results.Column
      align="right"
      {...props}
      className={cn('font-mono text-slate-11', className)}
    >
      {Children.map(children, (child, index) => {
        return (
          <>
            {index > 0 ? ' · ' : null}
            {child}
          </>
        );
      })}
    </Results.Column>
  );
};
