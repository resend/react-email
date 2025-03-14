import prettyBytes from "pretty-bytes";
import { useEffect, useRef, useState } from "react";
import { nicenames } from "../../actions/email-validation/caniemail-data";
import {
  type CompatibilityCheckingResult,
  checkCompatibility,
} from "../../actions/email-validation/check-compatibility";
import {
  type ImageCheckingResult,
  checkImages,
} from "../../actions/email-validation/check-images";
import {
  type LinkCheckingResult,
  checkLinks,
} from "../../actions/email-validation/check-links";
import { cn } from "../../utils";
import { IconWarning } from "../icons/icon-warning";
import { Results } from "./results";

export type LintingRow =
  | {
      source: "image";
      result: ImageCheckingResult;
    }
  | {
      source: "link";
      result: LinkCheckingResult;
    }
  | {
      source: "compatibility";
      result: CompatibilityCheckingResult;
    };

interface LinterProps {
  rows: LintingRow[] | undefined;
}

export interface LintingSource<T> {
  getStream(): Promise<ReadableStream<T>>;
  mapValue(value: NoInfer<T>): LintingRow | undefined;
}

export function getLintingSources(
  markup: string,
  reactMarkup: string,
  emailPath: string,
): LintingSource<unknown>[] {
  return [
    createSource({
      getStream() {
        return checkImages(markup, `${location.protocol}//${location.host}`);
      },
      mapValue(result) {
        if (result && result.status !== "success") {
          return {
            result: result,
            source: "image",
          };
        }
      },
    }),
    createSource({
      getStream() {
        return checkLinks(markup);
      },
      mapValue(result) {
        if (result && result.status !== "success") {
          return {
            result: result,
            source: "link",
          };
        }
      },
    }),
    createSource({
      getStream() {
        return checkCompatibility(reactMarkup, emailPath);
      },
      mapValue(value) {
        if (value && value.status !== "success") {
          return {
            result: value,
            source: "compatibility",
          };
        }
      },
    }),
  ];
}

export function createSource<T>(source: LintingSource<T>): LintingSource<T> {
  return source;
}

export async function* loadLintingRowsFrom(sources: LintingSource<unknown>[]) {
  for await (const source of sources) {
    const stream = await source.getStream();
    const reader = stream.getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }

        const row = source.mapValue(value);
        if (row) {
          yield row;
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}

export const useLinter = ({
  markup,
  reactMarkup,
  slug,
  emailPath,

  initialRows,
}: {
  reactMarkup: string;
  markup: string;
  emailPath: string;
  slug: string;

  initialRows?: LintingRow[];
}) => {
  const cacheKey = `linter-${slug.replaceAll("/", "-")}`;
  const [rows, setRows] = useState<LintingRow[] | undefined>(initialRows);

  useEffect(() => {
    if (initialRows === undefined) {
      const cachedValue =
        "localStorage" in global ? global.localStorage.getItem(cacheKey) : null;
      if (cachedValue) {
        setRows(JSON.parse(cachedValue));
      }
    }
  }, [cacheKey]);

  const sources = getLintingSources(markup, reactMarkup, emailPath);

  const [loading, setLoading] = useState(false);
  const isStreaming = useRef(false);

  const load = async () => {
    if (isStreaming.current) return;
    isStreaming.current = true;
    setLoading(true);

    setRows([]);
    try {
      for await (const row of loadLintingRowsFrom(sources)) {
        setRows((current) => {
          if (!current) {
            return [row];
          }

          const newArray = [...current, row];
          newArray.sort((a, b) => {
            if (a.result.status === "error" && b.result.status === "warning") {
              return -1;
            }

            if (a.result.status === "warning" && b.result.status === "error") {
              return 1;
            }

            return 0;
          });

          global.localStorage.setItem(cacheKey, JSON.stringify(newArray));

          return newArray;
        });
      }
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
        if (row.source === "link") {
          const failingCheck = row.result.checks.find(
            (check) => check.passed === false,
          )!;
          return (
            <Result status={row.result.status} key={i}>
              <Result.Name>{failingCheck.type}</Result.Name>
              <Result.Description>
                {failingCheck.type === "security"
                  ? "Insecure URL, use HTTPS insted of HTTP"
                  : null}
                {failingCheck.type === "fetch_attempt" &&
                failingCheck.metadata.fetchStatusCode &&
                failingCheck.metadata.fetchStatusCode >= 300 &&
                failingCheck.metadata.fetchStatusCode < 400
                  ? "There was a redirect, the content may have been moved"
                  : null}
                {failingCheck.type === "fetch_attempt" &&
                failingCheck.metadata.fetchStatusCode &&
                failingCheck.metadata.fetchStatusCode >= 400
                  ? "The link is broken"
                  : null}
                {failingCheck.type === "syntax"
                  ? "The link is broken due to invalid syntax"
                  : null}

                <span className="font-mono float-right text-ellipsis overflow-hidden text-nowrap max-w-[30ch]">
                  {row.result.link}
                </span>
              </Result.Description>
              <Result.Metadata>
                {failingCheck.type === "fetch_attempt"
                  ? failingCheck.metadata.fetchStatusCode
                  : ""}
              </Result.Metadata>
            </Result>
          );
        }

        if (row.source === "compatibility") {
          const statsReportedNotWorking = Object.entries(
            row.result.statsPerEmailClient,
          ).filter(([, stats]) => stats.status === "error");
          const statsReportedPartiallyWorking = Object.entries(
            row.result.statsPerEmailClient,
          ).filter(([, stats]) => stats.status === "warning");

          const unsupportedClientsString = statsReportedNotWorking
            .map(([emailClient]) => nicenames.family[emailClient])
            .join(", ");
          const partiallySupportedClientsString = statsReportedPartiallyWorking
            .map(([emailClient]) => nicenames.family[emailClient])
            .join(", ");

          return (
            <Result status={row.result.status} key={i}>
              <Result.Name>{row.result.entry.title}</Result.Name>
              <Result.Description>
                {statsReportedNotWorking.length > 0
                  ? `Not supported in ${unsupportedClientsString}`
                  : null}
                {statsReportedPartiallyWorking.length > 0 &&
                statsReportedNotWorking.length > 0
                  ? ". "
                  : null}
                {statsReportedPartiallyWorking.length > 0
                  ? `Partially supported in ${partiallySupportedClientsString}`
                  : null}
              </Result.Description>
              <Result.Metadata>
                {row.result.location.start.line.toString().padStart(2, "0")}:
                {row.result.location.start.column.toString().padStart(2, "0")}
                <a
                  href={row.result.entry.url}
                  className="underline ml-2"
                  rel="noreferrer"
                  target="_blank"
                >
                  See more info
                </a>
              </Result.Metadata>
            </Result>
          );
        }

        if (row.source === "image") {
          const failingCheck = row.result.checks.find(
            (check) => check.passed === false,
          )!;
          return (
            <Result status={row.result.status} key={i}>
              <Result.Name>{failingCheck.type}</Result.Name>
              <Result.Description>
                {failingCheck.type === "security"
                  ? "Insecure URL, use HTTPS insted of HTTP"
                  : null}
                {failingCheck.type === "fetch_attempt" &&
                failingCheck.metadata.fetchStatusCode &&
                failingCheck.metadata.fetchStatusCode >= 300 &&
                failingCheck.metadata.fetchStatusCode < 400
                  ? "There was a redirect, the image may have been moved"
                  : null}
                {failingCheck.type === "fetch_attempt" &&
                failingCheck.metadata.fetchStatusCode &&
                failingCheck.metadata.fetchStatusCode >= 400
                  ? "The image is broken"
                  : null}
                {failingCheck.type === "syntax"
                  ? "The image is broken due to an invalid source"
                  : null}

                {failingCheck.type === "accessibility"
                  ? "Missing alt text"
                  : null}

                {failingCheck.type === "image_size" &&
                failingCheck.metadata.byteCount
                  ? "This image is too large, keep it under 1mb"
                  : null}

                <span className="font-mono float-right text-ellipsis overflow-hidden text-nowrap max-w-[30ch]">
                  {row.result.source}
                </span>
              </Result.Description>
              <Result.Metadata>
                {row.result.checks
                  .map((check) => {
                    if (
                      check.type === "fetch_attempt" &&
                      check.metadata.fetchStatusCode
                    ) {
                      return check.metadata.fetchStatusCode;
                    }

                    if (
                      check.type === "image_size" &&
                      check.metadata.byteCount
                    ) {
                      return prettyBytes(check.metadata.byteCount);
                    }

                    return undefined;
                  })
                  .filter(Boolean)
                  .join("—")}
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
  status: "error" | "warning" | "success";
}

const Result = ({ children, className, status, ...props }: ResultProps) => {
  return (
    <Results.Row
      data-status={status}
      {...props}
      className={cn("group/result", className)}
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
      className={cn("font-mono text-slate-11", className)}
    >
      {children}
    </Results.Column>
  );
};
