export { CalendarInvite } from './extension';
export { CalendarInvitePlugin } from './plugin';
export { calendarInviteSlashCommand } from './slash-command';
export type { CalendarEvent, CalendarPluginOptions } from './types';
export { CALENDAR_TIMEZONES } from './types';

/** Returns the IANA timezone from the browser (e.g. "America/New_York"). Falls back to "UTC". */
export function detectCalendarTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}
