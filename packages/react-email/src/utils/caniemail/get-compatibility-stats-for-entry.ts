/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type {
  EmailClient,
  Platform,
  SupportEntry,
} from '../../actions/email-validation/check-compatibility';

export type SupportStatus = DetailedSupportStatus['status'];

export type DetailedSupportStatus =
  | {
      status: 'success';
    }
  | {
      status: 'error';
    }
  | {
      status: 'warning';
      notes: string;
    };

type EmailClientStats = {
  status: SupportStatus;
  perPlatform: Partial<Record<Platform, DetailedSupportStatus>>;
};

export type CompatibilityStats = {
  status: SupportStatus;
  perEmailClient: Partial<Record<EmailClient, EmailClientStats>>;
};

const noteNumbersRegex = /#(?<noteNumber>\d+)/g;

export const getCompatibilityStatsForEntry = (
  entry: SupportEntry,
  emailClients: EmailClient[],
) => {
  const stats: CompatibilityStats = {
    status: 'success',
    perEmailClient: {},
  };
  for (const emailClient of emailClients) {
    const rawStats = entry.stats[emailClient];
    if (rawStats) {
      const emailClientStats: EmailClientStats = {
        status: 'success',
        perPlatform: {},
      };

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
                supportEntry: entry,
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
              const note = entry.notes_by_num?.[Number.parseInt(noteNumber)];
              if (note) {
                notes.push(note);
              }
              // else if (isInternalDev) {
              //   console.warn(
              //     'Could not get note by the number for a support entry',
              //     {
              //       platform,
              //       statusString,
              //       note,
              //     },
              //   );
              // }
            }
          }
          if (emailClientStats.status === 'success')
            emailClientStats.status = 'warning';
          if (stats.status === 'success') stats.status = 'warning';
          emailClientStats.perPlatform[platform as Platform] = {
            status: 'warning',
            notes:
              notes.length === 1
                ? notes[0]!
                : notes.map((note) => `- ${note}`).join('\n'),
          };
        } else if (statusString.startsWith('y')) {
          emailClientStats.perPlatform[platform as Platform] = {
            status: 'success',
          };
        } else if (statusString.startsWith('n')) {
          if (emailClientStats.status !== 'error')
            emailClientStats.status = 'error';
          if (stats.status !== 'error') stats.status = 'error';
          emailClientStats.perPlatform[platform as Platform] = {
            status: 'error',
          };
        }
      }

      stats.perEmailClient[emailClient] = emailClientStats;
    }
  }

  return stats;
};
