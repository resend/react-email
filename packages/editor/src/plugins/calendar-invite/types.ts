export interface CalendarEvent {
  title: string;
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:MM (24-hour)
  duration: number;   // minutes; -1 = all day
  timezone: string;   // IANA timezone identifier
  location: string;
  description: string;
  // Optional card style overrides set by the developer
  cardBg?: string;
  accentColor?: string;
  borderColor?: string;
}

export interface CalendarPluginOptions {
  defaultTimezone?: string;
  cardBg?: string;       // Card background color
  accentColor?: string;  // Accent color for provider buttons
  borderColor?: string;  // Card border color
}

export const CALENDAR_TIMEZONES = [
  { label: 'UTC', value: 'UTC' },
  { label: 'Eastern Time (ET)', value: 'America/New_York' },
  { label: 'Central Time (CT)', value: 'America/Chicago' },
  { label: 'Mountain Time (MT)', value: 'America/Denver' },
  { label: 'Pacific Time (PT)', value: 'America/Los_Angeles' },
  { label: 'Alaska Time', value: 'America/Anchorage' },
  { label: 'Hawaii Time', value: 'Pacific/Honolulu' },
  { label: 'London (GMT/BST)', value: 'Europe/London' },
  { label: 'Paris / Berlin (CET)', value: 'Europe/Paris' },
  { label: 'Moscow (MSK)', value: 'Europe/Moscow' },
  { label: 'Dubai (GST)', value: 'Asia/Dubai' },
  { label: 'India (IST)', value: 'Asia/Kolkata' },
  { label: 'Bangkok (ICT)', value: 'Asia/Bangkok' },
  { label: 'Singapore (SGT)', value: 'Asia/Singapore' },
  { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
  { label: 'Sydney (AEDT)', value: 'Australia/Sydney' },
  { label: 'Auckland (NZST)', value: 'Pacific/Auckland' },
] as const;
