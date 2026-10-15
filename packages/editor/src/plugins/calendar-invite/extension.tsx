import type { Range } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { Button as ReactEmailButton, Hr, Section, Text } from 'react-email';
import { editorEventBus } from '../../core/event-bus';
import { EmailNode } from '../../core/serializer/email-node';
import { CalendarEditorCard } from './editor-card';
import {
  computeEndDateTime,
  formatDisplayTime,
  generateAppleCalendarUri,
  generateGoogleCalendarUrl,
  generateOutlookUrl,
  generateYahooCalendarUrl,
} from './ical-generator';
import type { CalendarEvent } from './types';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    calendarInvite: {
      insertCalendarInvite: (event: CalendarEvent) => ReturnType;
      openCalendarInviteModal: (range: Range) => ReturnType;
    };
  }
}

export const CalendarInvite = EmailNode.create({
  name: 'calendarInvite',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      title:       { default: '' },
      date:        { default: '' },
      startTime:   { default: '09:00' },
      duration:    { default: 60 },
      timezone:    { default: 'UTC' },
      location:    { default: '' },
      description: { default: '' },
      // Card style overrides
      cardBg:      { default: '#fafafa' },
      accentColor: { default: '#1c1c1c' },
      borderColor: { default: '#e5e5e5' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="calendar-invite"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-type': 'calendar-invite', ...HTMLAttributes }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalendarEditorCard);
  },

  addCommands() {
    return {
      insertCalendarInvite:
        (event: CalendarEvent) =>
        ({ commands }) =>
          // Insert the node + a trailing paragraph so the cursor always lands
          // in a text position. Without this, the atom node gets NodeSelection
          // and the next insertion replaces it instead of appending.
          commands.insertContent([
            { type: 'calendarInvite', attrs: event },
            { type: 'paragraph' },
          ]),

      openCalendarInviteModal:
        (range: Range) =>
        ({ editor }) => {
          editorEventBus.dispatch('calendar-invite:open', { range, editorRef: editor });
          return true;
        },
    };
  },

  renderToReactEmail({ node }) {
    const event = node.attrs as CalendarEvent & {
      cardBg: string;
      accentColor: string;
      borderColor: string;
    };
    const {
      title, date, startTime, duration, timezone,
      location, description,
      cardBg = '#fafafa',
      accentColor = '#1c1c1c',
      borderColor = '#e5e5e5',
    } = event;

    const isAllDay = duration === -1;
    const end = isAllDay ? null : computeEndDateTime(date, startTime, duration);

    const googleUrl  = generateGoogleCalendarUrl(event);
    const outlookUrl = generateOutlookUrl(event);
    const yahooUrl   = generateYahooCalendarUrl(event);
    const appleUrl   = generateAppleCalendarUri(event);

    const formattedDate = date
      ? new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        })
      : '';

    const formattedTime = isAllDay
      ? 'All day'
      : `${formatDisplayTime(startTime)}${end ? ` – ${formatDisplayTime(end.time)}` : ''}`;

    const tzLabel = timezone.split('/').pop()?.replace(/_/g, ' ') ?? timezone;

    // ── provider buttons ──────────────────────────────────────────────────────
    const providers = [
      { label: 'Google Calendar', href: googleUrl  },
      { label: 'Outlook',         href: outlookUrl },
      { label: 'Apple Calendar',  href: appleUrl   },
      { label: 'Yahoo Calendar',  href: yahooUrl   },
    ] as const;

    const btnStyle: React.CSSProperties = {
      display: 'inline-block',
      padding: '7px 14px',
      backgroundColor: accentColor,
      color: '#ffffff',
      textDecoration: 'none',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500' as const,
      margin: '0 6px 6px 0',
    };

    return (
      <Section
        style={{
          border: `1px solid ${borderColor}`,
          borderRadius: '10px',
          padding: '20px 24px',
          marginBottom: '12px',
          backgroundColor: cardBg,
        }}
      >
        <Text style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 10px', color: '#1c1c1c' }}>
          {title}
        </Text>
        <Text style={{ color: '#444', margin: '3px 0', fontSize: '14px' }}>📅 {formattedDate}</Text>
        <Text style={{ color: '#444', margin: '3px 0', fontSize: '14px' }}>
          🕐 {formattedTime}
          {!isAllDay ? <> · <span style={{ color: '#888' }}>{tzLabel}</span></> : null}
        </Text>
        {location ? (
          <Text style={{ color: '#444', margin: '3px 0', fontSize: '14px' }}>📍 {location}</Text>
        ) : null}
        {description ? (
          <>
            <Hr style={{ border: 'none', borderTop: `1px solid ${borderColor}`, margin: '14px 0 10px' }} />
            <Text style={{ color: '#555', margin: '0', fontSize: '14px', lineHeight: '1.55' }}>
              {description}
            </Text>
          </>
        ) : null}
        <Hr style={{ border: 'none', borderTop: `1px solid ${borderColor}`, margin: '14px 0 0' }} />
        <Section style={{ paddingTop: '14px' }}>
          <Text style={{ color: '#888', fontSize: '11px', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Add to calendar
          </Text>
          {providers.map((p) => (
            <ReactEmailButton key={p.label} href={p.href} style={btnStyle}>
              {p.label}
            </ReactEmailButton>
          ))}
        </Section>
      </Section>
    );
  },
});
