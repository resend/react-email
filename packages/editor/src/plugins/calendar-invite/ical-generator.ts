import type { CalendarEvent } from './types';

function padZero(n: number): string {
  return String(n).padStart(2, '0');
}

function formatDateTimeLocal(date: string, time: string): string {
  // date: YYYY-MM-DD, time: HH:MM → YYYYMMDDTHHmmss
  const [year, month, day] = date.split('-');
  const [hour, minute] = time.split(':');
  return `${year}${month}${day}T${hour}${minute}00`;
}

function formatDateOnly(date: string): string {
  return date.replace(/-/g, '');
}

export function computeEndDateTime(
  date: string,
  startTime: string,
  duration: number,
): { date: string; time: string } {
  const [h, m] = startTime.split(':').map(Number);
  const totalMinutes = h * 60 + m + duration;
  const endHour = Math.floor(totalMinutes / 60) % 24;
  const endMin = totalMinutes % 60;
  const daysOverflow = Math.floor(totalMinutes / (24 * 60));

  let endDate = date;
  if (daysOverflow > 0) {
    const d = new Date(`${date}T12:00:00`);
    d.setDate(d.getDate() + daysOverflow);
    endDate = d.toISOString().split('T')[0] ?? date;
  }

  return { date: endDate, time: `${padZero(endHour)}:${padZero(endMin)}` };
}

export function formatDisplayTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = (h ?? 0) >= 12 ? 'PM' : 'AM';
  const rawHour = h ?? 0;
  const displayHour = rawHour === 0 ? 12 : rawHour > 12 ? rawHour - 12 : rawHour;
  return `${displayHour}:${padZero(m ?? 0)} ${period}`;
}

export function generateICalContent(event: CalendarEvent): string {
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@react-email`;
  const now = new Date();
  const dtstamp = [
    now.getUTCFullYear(),
    padZero(now.getUTCMonth() + 1),
    padZero(now.getUTCDate()),
    'T',
    padZero(now.getUTCHours()),
    padZero(now.getUTCMinutes()),
    padZero(now.getUTCSeconds()),
    'Z',
  ].join('');

  let dtstart: string;
  let dtend: string;

  if (event.duration === -1) {
    const nextDayDate = new Date(`${event.date}T12:00:00`);
    nextDayDate.setDate(nextDayDate.getDate() + 1);
    const nextDay = nextDayDate.toISOString().split('T')[0] ?? event.date;
    dtstart = `DTSTART;VALUE=DATE:${formatDateOnly(event.date)}`;
    dtend = `DTEND;VALUE=DATE:${formatDateOnly(nextDay)}`;
  } else {
    const end = computeEndDateTime(event.date, event.startTime, event.duration);
    dtstart = `DTSTART;TZID=${event.timezone}:${formatDateTimeLocal(event.date, event.startTime)}`;
    dtend = `DTEND;TZID=${event.timezone}:${formatDateTimeLocal(end.date, end.time)}`;
  }

  const escape = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//React Email//Calendar Invite//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    dtstart,
    dtend,
    `SUMMARY:${escape(event.title)}`,
  ];

  if (event.location) lines.push(`LOCATION:${escape(event.location)}`);
  if (event.description) lines.push(`DESCRIPTION:${escape(event.description)}`);

  lines.push('END:VEVENT', 'END:VCALENDAR');

  return lines.join('\r\n');
}

export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    ctz: event.timezone,
  });

  if (event.duration === -1) {
    const d = formatDateOnly(event.date);
    params.set('dates', `${d}/${d}`);
  } else {
    const end = computeEndDateTime(event.date, event.startTime, event.duration);
    const start = formatDateTimeLocal(event.date, event.startTime);
    const endStr = formatDateTimeLocal(end.date, end.time);
    params.set('dates', `${start}/${endStr}`);
  }

  if (event.location) params.set('location', event.location);
  if (event.description) params.set('details', event.description);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function generateOutlookUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    rru: 'addevent',
    path: '/calendar/action/compose',
    subject: event.title,
  });

  if (event.duration === -1) {
    params.set('startdt', event.date);
    params.set('enddt', event.date);
    params.set('allday', 'true');
  } else {
    const end = computeEndDateTime(event.date, event.startTime, event.duration);
    params.set('startdt', `${event.date}T${event.startTime}:00`);
    params.set('enddt', `${end.date}T${end.time}:00`);
  }

  if (event.location) params.set('location', event.location);
  if (event.description) params.set('body', event.description);

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function generateYahooCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    v: '60',
    view: 'd',
    type: '20',
    title: event.title,
  });

  if (event.duration === -1) {
    const d = formatDateOnly(event.date);
    params.set('st', d);
    params.set('et', d);
    params.set('dur', 'allday');
  } else {
    const end = computeEndDateTime(event.date, event.startTime, event.duration);
    params.set('st', formatDateTimeLocal(event.date, event.startTime));
    params.set('et', formatDateTimeLocal(end.date, end.time));
  }

  if (event.description) params.set('desc', event.description);
  if (event.location) params.set('in_loc', event.location);

  return `https://calendar.yahoo.com/?${params.toString()}`;
}

export function generateAppleCalendarUri(event: CalendarEvent): string {
  const ics = generateICalContent(event);
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}
