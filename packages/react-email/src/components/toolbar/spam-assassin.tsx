import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { cn } from '../../utils';
import { IconWarning } from '../icons/icon-warning';
import { Results } from './results';

interface SpamAssassinProps {
  result: SpamCheckingResult | undefined;
}

export interface SpamCheckingResult {
  checks: {
    name: string;
    description: string;
    points: number;
  }[];
  isSpam: boolean;
  points: number;
}

function toSorted<T>(array: T[], sorter: (a: T, b: T) => number): T[] {
  const cloned = [...array];
  cloned.sort(sorter);
  return cloned;
}

export const useSpamAssassin = ({
  slug,
  markup,
  plainText,

  initialResult,
}: {
  slug: string;
  markup: string;
  plainText: string;

  initialResult?: SpamCheckingResult;
}) => {
  const cacheKey = `spam-assassin-${slug.replaceAll('/', '-')}`;

  const [result, setResult] = useState<SpamCheckingResult | undefined>(
    initialResult,
  );

  const [loading, setLoading] = useState(false);
  const isLoadingRef = useRef(false);

  const load = async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);

    try {
      const response = await fetch('https://react.email/api/check-spam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: markup,
          plainText: plainText,
        }),
      });

      if (response.ok) {
        const responseBody = (await response.json()) as
          | { error: string }
          | SpamCheckingResult;
        if ('error' in responseBody) {
          toast.error(responseBody.error);
        } else {
          setResult(responseBody);
          return responseBody;
        }
      } else {
        console.error(await response.text());
        toast.error('Something went wrong');
      }
    } catch (exception) {
      console.error(exception);
      toast.error(JSON.stringify(exception));
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  };

  return [result, { loading, load }] as const;
};

export const SpamAssassin = ({ result }: SpamAssassinProps) => {
  return (
    <>
      {result ? (
        <Results>
          <Results.Row className="sticky border-b-2 top-0 bg-black">
            <Results.Column className="uppercase">
              <span className="flex gap-1 items-center">
                <IconWarning
                  className={cn(
                    result.points > 1.5 ? 'text-yellow-200' : null,
                    result.points > 3 ? 'text-orange-300' : null,
                    result.points >= 5 ? 'text-red-400' : null,
                  )}
                />
                Score
              </span>
            </Results.Column>
            <Results.Column>Lower scores are better</Results.Column>
            <Results.Column
              className={cn(
                'text-right text-2xl tracking-tighter font-mono',
                result.points > 1.5 ? 'text-yellow-200' : null,
                result.points > 3 ? 'text-orange-300' : null,
                result.points >= 5 ? 'text-red-400' : null,
              )}
            >
              {result.points.toFixed(1)}
            </Results.Column>
          </Results.Row>
          {toSorted(result.checks, (a, b) => b.points - a.points).map(
            (check) => (
              <Results.Row key={check.name}>
                <Results.Column className="uppercase">
                  <span className="flex gap-1 items-center">
                    <IconWarning
                      className={cn(
                        check.points > 1 ? 'text-yellow-200' : null,
                        check.points > 2 ? 'text-orange-300' : null,
                        check.points > 3 ? 'text-red-400' : null,
                      )}
                    />
                    {check.name}
                  </span>
                </Results.Column>
                <Results.Column>{check.description}</Results.Column>
                <Results.Column
                  className={cn(
                    'text-right font-mono tracking-tighter',
                    check.points > 1 ? 'text-yellow-200' : null,
                    check.points > 2 ? 'text-orange-300' : null,
                    check.points > 3 ? 'text-red-400' : null,
                  )}
                >
                  {check.points.toFixed(1)}
                </Results.Column>
              </Results.Row>
            ),
          )}
        </Results>
      ) : null}
    </>
  );
};
