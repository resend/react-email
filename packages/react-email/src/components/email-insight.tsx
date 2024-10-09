import { clsx } from 'clsx';
import Markdown from 'react-markdown';
import { Insight } from '../actions/get-insights-for-email';
import { nicenames } from '../app/caniemail-data';
import type { EmailClient } from './email-insights';
import { IconExternalLink } from './icons/icon-external-link';
import { Tooltip } from './tooltip';
import { IconCircleCheck } from './icons/icon-circle-check';
import { IconClose } from './icons/icon-close';
import { IconWarning } from './icons/icon-warning';

interface InsightProps {
  insight: Insight;
  pathToFile: string;
  emailClient: EmailClient;
}

export const EmailInsight = ({
  emailClient,
  pathToFile,
  insight,
}: InsightProps) => {
  const statEntries = Object.entries(insight.stats);
  const orderPerStatus = {
    'working': 0,
    'working with caveats': 1,
    'not working': 2,
  };
  statEntries.sort(
    ([_p1, { status: firstStatus }], [_p2, { status: secondStatus }]) => {
      const firstOrder = orderPerStatus[firstStatus];
      const secondOrder = orderPerStatus[secondStatus];
      return secondOrder - firstOrder;
    },
  );
  return (
    <div
      aria-describedby={`${emailClient}-${insight.entry.slug}-title`}
      className={clsx('border-2 space-y-3 w-full rounded-md p-2', {
        'border-red-500': insight.worseStatus === 'not working',
        'border-yellow-300': insight.worseStatus === 'working with caveats',
        'border-green-500': insight.worseStatus === 'working',
      })}
    >
      <div className="flex justify-between items-center">
        <a
          className={clsx('font-semibold underline', {
            'text-red-400': insight.worseStatus === 'not working',
            'text-yellow-300': insight.worseStatus === 'working with caveats',
            'text-green-500': insight.worseStatus === 'working',
          })}
          href={`vscode://file/${pathToFile}:${insight.location.start.line}:${insight.location.start.column}`}
          id={`${emailClient}-${insight.entry.slug}-title`}
        >
          {insight.entry.title}
        </a>

        <a href={insight.entry.url} rel="noopener" target="_blank">
          <IconExternalLink />
        </a>
      </div>

      <ul className="list-none m-0 px-2 space-y-1">
        {statEntries.map(([platform, statsForPlatform]) => (
          <Tooltip.Provider key={platform}>
            <Tooltip>
              <li key={platform}>
                {statsForPlatform.status === 'working' ? (
                  <div className="flex gap-2 text-green-400 cursor-default text-sm items-center">
                    <IconCircleCheck
                      className="text-green-400  text-xs"
                      height="1rem"
                      width="1eem"
                    />
                    {nicenames.platform[platform]}
                  </div>
                ) : null}
                {statsForPlatform.status === 'not working' ? (
                  <div className="flex gap-2 text-red-400 cursor-default text-sm items-center">
                    <IconClose
                      className="text-xs flex-shrink"
                      height="1rem"
                      width="1eem"
                    />
                    {nicenames.platform[platform]}
                  </div>
                ) : null}
                {statsForPlatform.status === 'working with caveats'
                  ? (() => {
                      const hasNotes = statsForPlatform.notes.trim().length > 0;
                      const content = (
                        <div
                          className={clsx(
                            'flex gap-2 text-yellow-300 cursor-default text-sm items-center',
                            hasNotes && 'underline',
                          )}
                        >
                          <Tooltip.Content>
                            <Markdown>{statsForPlatform.notes}</Markdown>
                          </Tooltip.Content>
                          <IconWarning
                            className="text-xs text-yellow-300"
                            height="1rem"
                            width="1rem"
                          />
                          {nicenames.platform[platform]}
                        </div>
                      );

                      if (hasNotes) {
                        return (
                          <Tooltip.Trigger asChild>{content}</Tooltip.Trigger>
                        );
                      }

                      return content;
                    })()
                  : null}
              </li>
            </Tooltip>
          </Tooltip.Provider>
        ))}
      </ul>
    </div>
  );
};
