/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Platform } from 'esbuild';
import type {
  EmailClient,
  SupportEntry,
} from '../../components/email-insights';
import { isInternalDev } from '../constants';

export type InsightStatus = 'working' | 'working with caveats' | 'not working';

export type InsightStatsPerPlatform = Partial<
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

const noteNumbersRegex = /#(?<noteNumber>\d+)/g;

export const getInsightsStatsForEntry = (
  entry: SupportEntry,
  emailClient: EmailClient,
) => {
  const rawStats = entry.stats[emailClient];
  if (rawStats) {
    const stats: InsightStatsPerPlatform = {};
    let worseStatus: InsightStatus = 'working';

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
            const note = entry.notes_by_num?.[parseInt(noteNumber)];
            if (note) {
              notes.push(note);
            } else if (isInternalDev) {
              console.warn(
                'Could not get note by the number for a support entry',
                {
                  platform,
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
      worseStatus,
    };
  }

  return undefined;
};
