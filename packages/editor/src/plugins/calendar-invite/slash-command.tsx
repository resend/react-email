import { CalendarIcon } from '../../ui/icons/calendar';
import type { SlashCommandItem } from '../../ui/slash-command/types';

export const calendarInviteSlashCommand: SlashCommandItem = {
  title: 'Calendar invite',
  description: 'Add a calendar event invitation',
  icon: <CalendarIcon size={20} />,
  category: 'Utility',
  searchTerms: ['calendar', 'invite', 'event', 'meeting', 'schedule', 'ical', 'ics'],
  command: ({ editor, range }) => {
    editor.commands.openCalendarInviteModal(range);
  },
};
