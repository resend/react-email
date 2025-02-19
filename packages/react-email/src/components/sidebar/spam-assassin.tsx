import * as React from 'react';
import { toast } from 'sonner';
import { cn } from '../../utils';
import { Button } from '../button';

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

export const SpamAssassin = ({
  emailSlug,
  emailMarkup,
  emailPlainText,
}: SpamAssassinProps) => {
  const cacheKey = `spam-checking-results-${emailSlug.replaceAll('/', '-')}`;

  const [result, setResult] = React.useState<SpamCheckingResult | undefined>();

  React.useEffect(() => {
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

  const [loading, setLoading] = React.useState(false);

  const handleRun = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        'https://react-email-git-feat-spam-assassin-api-resend.vercel.app/api/check-spam',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            html: emailMarkup,
            plainText: emailPlainText,
          }),
        },
      );

      if (response.ok) {
        const responseBody = (await response.json()) as
          | { error: string }
          | SpamCheckingResult;
        if ('error' in responseBody) {
          toast.error(responseBody.error);
        } else {
          setResult(responseBody);
          localStorage.setItem(cacheKey, JSON.stringify(result));
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

  return (
    <div className="mt-4 flex w-full flex-col gap-2 text-pretty">
      {result ? (
        <div
          className="group flex flex-col gap-2"
          aria-label={result.isSpam ? 'spam' : 'ham'}
        >
          <table className="w-full border-collapse text-left text-slate-10 text-sm">
            <thead className="mb-4 h-8 border border-t-0 border-slate-6 bg-slate-3 text-xs">
              <tr>
                <th scope="col" className="px-3 py-1">
                  Rule
                </th>
                <th scope="col" className="px-3 py-1" align="right">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {result.checks.length > 0 ? (
                result.checks.map((check) => (
                  <tr
                    key={check.name}
                    className="border-collapse border-slate-6 border-b"
                  >
                    <td className="px-3 py-2">
                      <div className="font-medium text-slate-12">
                        {check.name}
                      </div>
                      <div className="mt-1 text-slate-9 text-xs">
                        {check.description}
                      </div>
                    </td>
                    <td
                      align="right"
                      className={cn(
                        'px-3 py-2 font-medium',
                        check.points > 0 ? 'text-yellow-200' : null,
                        check.points > 1 ? 'text-yellow-300' : null,
                        check.points > 2 ? 'text-orange-400' : null,
                        check.points > 3 ? 'text-red-400' : null,
                      )}
                    >
                      {check.points.toFixed(1)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="py-10 font-medium text-center">
                    Nothing from Spam Assassin
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="mb-4 h-8 border border-slate-6 bg-slate-3">
              <tr className="border-collapse border-slate-6 border-b">
                <td className="px-3 py-2">Considered </td>
                <td
                  className="text-green-300 py-2 px-3 group-aria-[label=spam]:text-red-300 bg-transparent"
                  align="right"
                >
                  {result.isSpam ? 'spam' : 'safe'}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <span className="text-xs leading-relaxed">
          Check how well your email goes on a batch of spam testing.
        </span>
      )}
      <Button loading={loading} onClick={handleRun}>
        {result ? 'Re-run' : 'Run'}
      </Button>
    </div>
  );
};
