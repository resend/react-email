/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as Tabs from '@radix-ui/react-tabs';
import * as React from 'react';
import { clsx } from 'clsx';
import Markdown from 'react-markdown';
import { supportEntries, nicenames } from '../app/caniemail-data';
import { IconClose } from './icons/icon-close';
import { IconWarning } from './icons/icon-warning';
import { IconCircleCheck } from './icons/icon-circle-check';
import { Tooltip } from './tooltip';
import { IconExternalLink } from './icons/icon-external-link';

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
  const [selectedTab, setSelectedTab] =
    React.useState<EmailClient>('apple-mail');

  return (
    <div className="h-80 overflow-y-auto bg-black border-t border-slate-6 p-4">
      <Tabs.Root
        onValueChange={(v) => {
          setSelectedTab(v as EmailClient);
        }}
        value={selectedTab}
      >
        <Tabs.List aria-label="Diagnostics available per email client">
          <Tabs.Trigger value="apple-mail">Apple Mail</Tabs.Trigger>
          <Tabs.Trigger value="gmail">Gmail</Tabs.Trigger>
          <Tabs.Trigger value="hey">Hey</Tabs.Trigger>
          <Tabs.Trigger value="outlook">Outlook</Tabs.Trigger>
          <Tabs.Trigger value="yahoo">Yahoo</Tabs.Trigger>
        </Tabs.List>
        <EmailClientInsightsTab emailClient="apple-mail" />
        <EmailClientInsightsTab emailClient="gmail" />
        <EmailClientInsightsTab emailClient="hey" />
        <EmailClientInsightsTab emailClient="outlook" />
        <EmailClientInsightsTab emailClient="yahoo" />
      </Tabs.Root>
    </div>
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
                  <span className="flex gap-2 text-green-400 cursor-default text-sm items-center align-middle">
                    <IconCircleCheck
                      className="text-green-400  text-xs"
                      height="1rem"
                      width="1eem"
                    />
                    {nicenames.platform[platform]}
                  </span>
                ) : null}
                {statsForPlatform.status === 'not working' ? (
                  <span className="flex gap-2 text-red-400 cursor-default text-sm items-center align-middle">
                    <IconClose className="text-xs" height="1rem" width="1eem" />
                    {nicenames.platform[platform]}
                  </span>
                ) : null}
                {statsForPlatform.status === 'working with caveats'
                  ? (() => {
                    const hasNotes = statsForPlatform.notes.trim().length > 0;
                    const span = (
                      <span
                        className={clsx(
                          'flex gap-2 text-yellow-300 cursor-default text-sm items-center align-middle',
                          hasNotes && 'underline',
                        )}
                      >
                        <Tooltip.Content>
                          <Markdown>{statsForPlatform.notes}</Markdown>
                        </Tooltip.Content>
                        <IconWarning
                          className="text-xs text-yellow-300"
                          height="1rem"
                          width="1eem"
                        />
                        {nicenames.platform[platform]}
                      </span>
                    );

                    if (hasNotes) {
                      return (
                        <Tooltip.Trigger asChild>{span}</Tooltip.Trigger>
                      );
                    }

                    return span;
                  })()
                  : null}
              </li>
            </Tooltip>
          </Tooltip.Provider>
        ))}
      </ul>
    </div >
  );
};
