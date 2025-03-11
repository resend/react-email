import { toast } from 'sonner';
import { cn } from '../../utils';
import React, { useEffect, useState } from 'react';
import { IconBase } from '../icons/icon-base';
import { IconWarning } from '../icons/icon-warning';

interface SpamAssassinProps {
  emailSlug: string;
  emailMarkup: string;
  emailPlainText: string;
}

interface SpamCheckingResult {
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

export const SpamAssassin = ({
  emailSlug,
  emailMarkup,
  emailPlainText,
}: SpamAssassinProps) => {
  const cacheKey = `spam-checking-results-${emailSlug.replaceAll('/', '-')}`;

  const [result, setResult] = useState<SpamCheckingResult | undefined>();

  useEffect(() => {
    const cachedValue =
      'localStorage' in global ? global.localStorage.getItem(cacheKey) : null;
    if (cachedValue) {
      try {
        setResult(JSON.parse(cachedValue));
      } catch (exception) {
        setResult(undefined);
      }
    }
  }, [cacheKey]);

  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);

    try {
      const response = await fetch('https://react.email/api/check-spam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: emailMarkup,
          plainText: emailPlainText,
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
          localStorage.setItem(cacheKey, JSON.stringify(responseBody));
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
    }
  };

  useEffect(() => {
    handleRun();
  }, []);

  return (
    <div className="flex w-full flex-col gap-2 text-pretty">
      {result ? (
        <table
          className="group relative w-full border-collapse text-left text-slate-10 text-xs"
          aria-label={result.isSpam ? 'spam' : 'ham'}
        >
          <Row className="sticky border-b-2 top-0 bg-black">
            <Column className="uppercase">
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
            </Column>
            <Column>Lower scores are better</Column>
            <Column
              className={cn(
                'text-right text-2xl tracking-tighter font-mono',
                result.points > 1.5 ? 'text-yellow-200' : null,
                result.points > 3 ? 'text-orange-300' : null,
                result.points >= 5 ? 'text-red-400' : null,
              )}
            >
              {result.points.toFixed(1)}
            </Column>
          </Row>
          {toSorted(result.checks, (a, b) => b.points - a.points).map(
            (check) => (
              <Row key={check.name}>
                <Column className="uppercase">
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
                </Column>
                <Column>{check.description}</Column>
                <Column
                  className={cn(
                    'text-right font-mono tracking-tighter',
                    check.points > 1 ? 'text-yellow-200' : null,
                    check.points > 2 ? 'text-orange-300' : null,
                    check.points > 3 ? 'text-red-400' : null,
                  )}
                >
                  {check.points.toFixed(1)}
                </Column>
              </Row>
            ),
          )}
        </table>
      ) : null}
    </div>
  );
};

const Row = ({ children, className, ...props }: React.ComponentProps<'tr'>) => {
  return (
    <tr
      className={cn(
        'border-collapse align-bottom border-slate-6 border-b',
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
};
const Column = ({
  children,
  className,
  ...props
}: React.ComponentProps<'td'>) => {
  return (
    <td className={cn('py-1 align-bottom font-medium', className)} {...props}>
      {children}
    </td>
  );
};
