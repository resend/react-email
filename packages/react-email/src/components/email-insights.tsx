/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as Tabs from '@radix-ui/react-tabs';
import * as React from 'react';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import Markdown from 'react-markdown';
import { supportEntries, nicenames } from '../app/caniemail-data';
import { IconClose } from './icons/icon-close';
import { IconWarning } from './icons/icon-warning';
import { IconCircleCheck } from './icons/icon-circle-check';
import { Tooltip } from './tooltip';
import { IconExternalLink } from './icons/icon-external-link';
import { IconArrowDown } from './icons/icon-arrow-down';

export type EmailClient =
  | 'gmail'
  | 'outlook'
  | 'yahoo'
  | 'apple-mail'
  | 'aol'
  | 'thunderbird'
  | 'microsoft'
  | 'samsung-email'
  | 'sfr'
  | 'orange'
  | 'protonmail'
  | 'hey'
  | 'mail-ru'
  | 'fastmail'
  | 'laposte'
  | 't-online-de'
  | 'free-fr'
  | 'gmx'
  | 'web-de'
  | 'ionos-1and1'
  | 'rainloop'
  | 'wp-pl';

export type Platform =
  | 'desktop-app'
  | 'desktop-webmail'
  | 'mobile-webmail'
  | 'webmail'
  | 'ios'
  | 'android'
  | 'windows'
  | 'macos'
  | 'windows-mail'
  | 'outlook-com';

export type SupportEntryCategroy = 'html' | 'css' | 'image' | 'others';

export interface SupportEntry {
  slug: string;
  title: string;
  description: string | null;
  url: string;
  category: SupportEntryCategroy;
  tags: string[];
  keywords: string | null;
  last_test_date: string;
  test_url: string;
  test_results_url: string | null;
  stats: Partial<
    Record<
      EmailClient,
      Partial<
        Record<
          Platform,
          /*
            This last Record<string, string> has only one key, as the
            ordered version of caniemail's data is meant to be something like:
           
            [
              { "1.0": "u" },
              { "2.0": "y" },
              { "3.0": "p #1" },
            ]
           
            So only one key for each object inside of this array, TypeScript can't really
            describe this though AFAIK.
          */
          Record</* version */ string, string>[]
        >
      >
    >
  >;
  notes: string | null;
  notes_by_num: Record<number, string> | null;
}

const EmailClientInsightsTab = ({
  emailClient,
}: {
  emailClient: EmailClient;
}) => {
  return (
    <Tabs.Content className="grid grid-cols-4 gap-2" value={emailClient}>
      {supportEntries.map((entry) => {
        if (emailClient in entry.stats) {
          return (
            <Insight {...getInsight(emailClient, entry)} key={entry.slug} />
          );
        }

        return null;
      })}
    </Tabs.Content>
  );
};

export const EmailInsights = ({ code }: { code: string }) => {
  const emailClientsOfInterest: EmailClient[] = [
    'apple-mail',
    'gmail',
    'hey',
    'outlook',
    'yahoo',
  ];
  const [selectedEmailClient, setSelectedEmailClient] =
    React.useState<EmailClient>('apple-mail');

  React.useEffect(() => {
    const storedValue = localStorage.getItem('selected-email-client');
    if (
      storedValue &&
      (emailClientsOfInterest as string[]).includes(storedValue)
    ) {
      setSelectedEmailClient(storedValue as EmailClient);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <motion.div
      animate={{
        width: isExpanded ? '100%' : '10rem',
        height: isExpanded ? '24rem' : '2.5rem',
        position: isExpanded ? 'static' : 'fixed',
        left: isExpanded ? undefined : 0,
        bottom: isExpanded ? undefined : 0,
      }}
      className={clsx(
        'border-t flex-shrink border-slate-6 box-border bg-black',
        isExpanded && 'py-4',
      )}
    >
      <AnimatePresence>
        {!isExpanded ? (
          <button
            className="bg-black flex items-center justify-center gap-1 w-full h-full transition-colors text-slate-11 hover:text-slate-12 text-xs font-semibold"
            onClick={() => {
              setIsExpanded(true);
            }}
            type="button"
          >
            Compatibility insights
            <IconArrowDown className='origin-center rotate-180' />
          </button>
        ) : null}
        {isExpanded ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="h-full"
            exit={{ opacity: 0.5 }}
            initial={{ opacity: 0.5 }}
          >
            <Tabs.Root
              className="space-y-4 h-full flex flex-col"
              onValueChange={(v) => {
                setSelectedEmailClient(v as EmailClient);
                localStorage.setItem('selected-email-client', v);
              }}
              value={selectedEmailClient}
            >
              <div className="px-4 pb-3 border-b border-slate-6 flex justify-between items-center">
                <button
                  className="bg-black flex items-center w-fit transition-colors text-slate-11 hover:text-slate-12 text-xs font-semibold"
                  onClick={() => {
                    setIsExpanded(false);
                  }}
                  type="button"
                >
                  Compatibility insights{' '}
                  <IconArrowDown />
                </button>
                <Tabs.List
                  aria-label="Diagnostics available per email client"
                  className="space-x-4"
                >
                  {emailClientsOfInterest.map((emailClient) => (
                    <Tabs.Trigger
                      className={clsx(
                        'px-2 py-1 text-sm rounded-md relative',
                        emailClient === selectedEmailClient && 'text-slate-12',
                        emailClient !== selectedEmailClient && 'text-slate-11',
                      )}
                      key={emailClient}
                      value={emailClient}
                    >
                      {emailClient === selectedEmailClient && (
                        <motion.span
                          className="pointer-events-none absolute inset-0 z-[2] rounded-md bg-slate-6 border border-slate-6 group-focus:outline-none group-focus:ring group-focus:ring-slate-3"
                          initial={false}
                          layoutId="caniemail-diagnostic-tab-bubble"
                          transition={{
                            type: 'spring',
                            bounce: 0.18,
                            duration: 0.6,
                          }}
                        />
                      )}
                      {nicenames.family[emailClient]}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>
              </div>
              <div className="px-4 overflow-y-auto flex-grow">
                {emailClientsOfInterest.map((emailClient) => (
                  <EmailClientInsightsTab
                    emailClient={emailClient}
                    key={emailClient}
                  />
                ))}
              </div>
            </Tabs.Root>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};

const noteNumbersRegex = /#(?<noteNumber>\d+)/g;

const getInsight = (
  emailClient: EmailClient,
  supportEntry: SupportEntry,
): InsightProps => {
  const rawStats = supportEntry.stats[emailClient];
  if (rawStats) {
    const stats: InsightProps['stats'] = {};
    let worseStatus: InsightProps['worseStatus'] = 'working';

    for (const [platform, statusPerVersion] of Object.entries(rawStats)) {
      const latestStatus = statusPerVersion[statusPerVersion.length - 1];
      if (latestStatus === undefined)
        throw new Error(
          'Cannot load in status because there are none recorded for this platform/email client',
          {
            cause: {
              latestStatus,
              statusPerVersion,
              platform,
              emailClient,
              supportEntry,
            },
          },
        );
      const statusString = latestStatus[Object.keys(latestStatus)[0]!]!;
      if (statusString.startsWith('u')) continue;
      if (statusString.startsWith('a')) {
        const notes: string[] = [];
        noteNumbersRegex.lastIndex = 0;
        for (const match of statusString.matchAll(noteNumbersRegex)) {
          if (match.groups?.noteNumber) {
            const { noteNumber } = match.groups;
            const note = supportEntry.notes_by_num?.[parseInt(noteNumber)];
            if (note) {
              notes.push(note);
            } else {
              console.warn(
                'Could not get note by the number for a support entry',
                {
                  platform,
                  emailClient,
                  supportEntry,
                  statusString,
                  note,
                },
              );
            }
          }
        }
        if (worseStatus === 'working') worseStatus = 'working with caveats';
        stats[platform as Platform] = {
          status: 'working with caveats',
          notes:
            notes.length === 1
              ? notes[0]!
              : notes.map((note) => `- ${note}`).join('\n'),
        };
      } else if (statusString.startsWith('y')) {
        stats[platform as Platform] = {
          status: 'working',
        };
      } else if (statusString.startsWith('n')) {
        if (worseStatus !== 'not working') worseStatus = 'not working';
        stats[platform as Platform] = {
          status: 'not working',
        };
      }
    }

    return {
      stats,
      supportEntry,
      worseStatus,
      emailClient,
    };
  }

  throw new Error('Email client is not in the support entry', {
    cause: {
      emailClient,
      supportEntry,
    },
  });
};

interface InsightProps {
  supportEntry: SupportEntry;
  emailClient: EmailClient;
  worseStatus: 'working' | 'working with caveats' | 'not working';
  stats: Partial<
    Record<
      Platform,
      | {
          status: 'working';
        }
      | {
          status: 'not working';
        }
      | {
          status: 'working with caveats';
          notes: string;
        }
    >
  >;
}

const Insight = ({
  emailClient,
  supportEntry,
  worseStatus,
  stats,
}: InsightProps) => {
  const statEntries = Object.entries(stats);
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
      aria-describedby={`${emailClient}-${supportEntry.slug}-title`}
      className={clsx('border-2 space-y-3 w-full rounded-md p-2', {
        'border-red-500': worseStatus === 'not working',
        'border-yellow-300': worseStatus === 'working with caveats',
        'border-green-500': worseStatus === 'working',
      })}
    >
      <div className="flex justify-between items-center">
        <h3
          className={clsx('font-semibold', {
            'text-red-400': worseStatus === 'not working',
            'text-yellow-300': worseStatus === 'working with caveats',
            'text-green-500': worseStatus === 'working',
          })}
          id={`${emailClient}-${supportEntry.slug}-title`}
        >
          {supportEntry.title}
        </h3>

        <a href={supportEntry.url} rel="noopener" target="_blank">
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
