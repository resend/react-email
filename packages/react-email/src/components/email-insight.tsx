import { clsx } from 'clsx';
import Markdown from 'react-markdown';
import * as Collapsible from '@radix-ui/react-collapsible';
import * as React from 'react';
import type { Insight } from '../actions/get-insights-for-email';
import { nicenames } from '../app/caniemail-data';
import type { StatusForPlatform } from '../utils/caniemail/get-insights-stats-for-entry';
import type { EmailClient, Platform } from './email-insights';
import { IconExternalLink } from './icons/icon-external-link';
import { Tooltip } from './tooltip';
import { IconCircleCheck } from './icons/icon-circle-check';
import { IconClose } from './icons/icon-close';
import { IconWarning } from './icons/icon-warning';
import { IconArrowDown } from './icons/icon-arrow-down';

interface InsightProps {
  insight: Insight;
  pathToEmail: string;
  emailClient: EmailClient;
}

export const orderingPerStatus = {
  'working': 0,
  'working with caveats': 1,
  'not working': 2,
};

export const EmailInsight = ({ emailClient, insight }: InsightProps) => {
  const statEntries = React.useMemo(() => {
    const entries = Object.entries(insight.stats);
    entries.sort(
      ([_p1, { status: firstStatus }], [_p2, { status: secondStatus }]) => {
        const firstOrder = orderingPerStatus[firstStatus];
        const secondOrder = orderingPerStatus[secondStatus];
        return secondOrder - firstOrder;
      },
    );
    return entries;
  }, [insight.stats]);

  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Collapsible.Root
      className="w-full flex-col"
      onOpenChange={(v) => {
        setCollapsed(v);
      }}
      open={collapsed}
    >
      <Collapsible.Trigger
        aria-describedby={`${emailClient}-${insight.entry.slug}-title`}
        className="flex px-4 gap-2 items-center align-middle w-full hover:bg-slate-8 border border-solid border-transparent focus:border-slate-6 focus:bg-slate-8"
      >
        <IconArrowDown className={collapsed ? undefined : '-rotate-90'} />
        <div
          className={clsx('font-semibold flex items-center gap-1', {
            'text-red-400': insight.worseStatus === 'not working',
            'text-yellow-300': insight.worseStatus === 'working with caveats',
            'text-green-500': insight.worseStatus === 'working',
          })}
          id={`${emailClient}-${insight.entry.slug}-title`}
        >
          {insight.entry.title}

          <span className='text-slate-10 text-sm'>
            [Line: {insight.location.start.line}, Column:{' '}
            {insight.location.start.column}]
          </span>
        </div>

        <a
          className="ml-auto text-slate-10"
          href={insight.entry.url}
          rel="noopener"
          target="_blank"
        >
          see more
        </a>
      </Collapsible.Trigger>

      <Collapsible.Content asChild>
        <ul className="list-none m-0 py-0 pl-12 pr-2 space-y-1">
          {statEntries.map(([platform, statusForPlatform]) => (
            <PlatformStatus
              key={platform}
              platform={platform as Platform}
              statusForPlatform={statusForPlatform}
            />
          ))}
        </ul>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

const PlatformStatus = ({
  platform,
  statusForPlatform,
}: {
  platform: Platform;
  statusForPlatform: StatusForPlatform;
}) => {
  return (
    <Tooltip.Provider key={platform}>
      <Tooltip>
        <li key={platform}>
          {statusForPlatform.status === 'working' ? (
            <div className="flex gap-2 text-green-400 cursor-default text-sm items-center">
              <IconCircleCheck
                className="text-green-400  text-xs"
                height="1rem"
                width="1eem"
              />
              {nicenames.platform[platform]}
            </div>
          ) : null}
          {statusForPlatform.status === 'not working' ? (
            <div className="flex gap-2 text-red-400 cursor-default text-sm items-center">
              <IconClose
                className="text-xs flex-shrink"
                height="1rem"
                width="1eem"
              />
              {nicenames.platform[platform]}
            </div>
          ) : null}
          {statusForPlatform.status === 'working with caveats'
            ? (() => {
                const hasNotes = statusForPlatform.notes.trim().length > 0;
                const content = (
                  <div
                    className={clsx(
                      'flex gap-2 text-yellow-300 cursor-default text-sm items-center',
                      hasNotes && 'underline',
                    )}
                  >
                    <Tooltip.Content>
                      <Markdown>{statusForPlatform.notes}</Markdown>
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
                  return <Tooltip.Trigger asChild>{content}</Tooltip.Trigger>;
                }

                return content;
              })()
            : null}
        </li>
      </Tooltip>
    </Tooltip.Provider>
  );
};
