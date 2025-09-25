import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { nicenames } from '../../actions/email-validation/caniemail-data';
import {
  type CompatibilityCheckingResult,
  checkCompatibility,
} from '../../actions/email-validation/check-compatibility';
import { sanitize } from '../../utils';
import { loadStream } from '../../utils/load-stream';
import { IconWarning } from '../icons/icon-warning';
import { CodePreviewLineLink } from './code-preview-line-link';
import { Results } from './results';

export const useCompatibility = ({
  reactMarkup,
  emailPath,

  initialResults,
}: {
  reactMarkup: string;
  emailPath: string;

  initialResults?: CompatibilityCheckingResult[];
}) => {
  const [results, setResults] = useState(initialResults);

  const [loading, setLoading] = useState(false);
  const isLoadingRef = useRef(false);

  const load = async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);

    setResults([]);
    let rawResults: CompatibilityCheckingResult[] = [];

    try {
      const stream = await checkCompatibility(reactMarkup, emailPath);
      for await (const result of loadStream(stream)) {
        if (result.status !== 'error') continue;
        setResults((current) => {
          if (!current) {
            return [result];
          }
          rawResults = [...current, result];
          return rawResults;
        });
      }
    } catch (exception) {
      console.error(exception);
      toast.error(JSON.stringify(exception));
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }

    return rawResults;
  };

  return [results, { loading, load }] as const;
};

interface CompatibilityProps {
  results: CompatibilityCheckingResult[] | undefined;
}

export const Compatibility = ({ results }: CompatibilityProps) => {
  return (
    <Results>
      {results?.map((result, i) => {
        const statsReportedNotWorking = Object.entries(
          result.statsPerEmailClient,
        ).filter(([, stats]) => stats.status === 'error');
        const unsupportedClientsString = statsReportedNotWorking
          .map(([emailClient]) => nicenames.family[emailClient])
          .join(', ');

        return (
          <Results.Row key={i}>
            <Results.Column>
              <span className="flex text-red-400 uppercase gap-2 items-center">
                <IconWarning />
                {sanitize(result.entry.title)}
              </span>
            </Results.Column>
            <Results.Column>
              {statsReportedNotWorking.length > 0
                ? `Not supported in ${unsupportedClientsString}`
                : null}

              <a
                href={result.entry.url}
                className="underline ml-2 decoration-slate-9 decoration-1 hover:decoration-slate-11 transition-colors hover:text-slate-12"
                rel="noreferrer"
                target="_blank"
              >
                More ↗
              </a>
            </Results.Column>
            <Results.Column className="font-mono text-slate-11 text-right">
              <CodePreviewLineLink
                line={result.location.start.line}
                column={result.location.start.column}
                type="react"
              />
            </Results.Column>
          </Results.Row>
        );
      })}
    </Results>
  );
};
