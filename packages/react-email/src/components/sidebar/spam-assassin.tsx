import * as React from 'react';
import {
  type ImageCheckingResult,
  checkImages,
} from '../../actions/email-validation/check-images';
import { Button } from '../button';
import {
  checkSpam,
  type SpamCheckingResult,
} from '../../actions/email-validation/check-spam';
import { cn } from '../../utils';

interface SpamAssassinProps {
  emailSlug: string;
  emailMarkup: string;
  emailPlainText: string;
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
      setResult(JSON.parse(cachedValue));
    }
  }, [cacheKey]);

  const [loading, setLoading] = React.useState(false);

  const handleRun = () => {
    setLoading(true);
    checkSpam(emailMarkup, emailPlainText)
      .then((result) => {
        setResult(result);
        localStorage.setItem(cacheKey, JSON.stringify(result));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  return (
    <div className="mt-4 flex w-full flex-col gap-2 text-pretty">
      {result ? (
        <div
          className="group flex flex-col gap-2"
          aria-label={result.isSpam ? 'spam' : 'ham'}
        >
          {result.checks.length > 0 ? (
            <table className="w-full text-sm text-left text-slate-10 border-collapse">
              <caption className="text-left text-xl text-slate-11 py-2">
                <span className="pr-2 font-medium">
                  {result.points.toFixed(1)}
                </span>
                Score
              </caption>
              <thead className="border border-slate-6 bg-slate-3 h-8 mb-4 text-xs">
                <tr>
                  <th scope="col" className="px-3 py-1">
                    Rule
                  </th>
                  <th scope="col" className="px-3 py-1">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.checks.map((check) => (
                  <tr
                    key={check.name}
                    className="border-collapse border-b border-slate-6"
                  >
                    <td className="px-3 py-2">
                      <div className="font-medium text-slate-12">
                        {check.name}
                      </div>
                      <div className="text-xs text-slate-9 mt-1">
                        {check.description}
                      </div>
                    </td>
                    <td
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
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      ) : (
        <span className="text-xs leading-relaxed">
          Check if all links are valid and redirect to the correct pages.
        </span>
      )}
      <Button loading={loading} onClick={handleRun}>
        {result ? 'Re-run' : 'Run'}
      </Button>
    </div>
  );
};
