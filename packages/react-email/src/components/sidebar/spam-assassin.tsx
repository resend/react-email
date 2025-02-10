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
          <div className="border-slate-6 border-b border-solid">
            <span className="pr-2 text-2xl group-aria-[label=ham]:text-green-600 group-aria-[label=spam]:text-red-600">
              {result.points.toFixed(1)}
            </span>
            Score
          </div>

          {result.checks.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th align="right">Points</th>
                </tr>
              </thead>
              <tbody>
                {result.checks.map((check) => (
                  <tr>
                    <td>{check.description}</td>
                    <td align="right">{check.points}</td>
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
