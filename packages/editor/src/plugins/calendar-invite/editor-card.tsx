import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { computeEndDateTime, formatDisplayTime } from './ical-generator';
import type { CalendarEvent } from './types';

const PROVIDERS = ['Google Calendar', 'Outlook', 'Apple Calendar', 'Yahoo Calendar'] as const;

export function CalendarEditorCard({ node }: NodeViewProps) {
  const attrs = node.attrs as CalendarEvent & { accentColor?: string };
  const { title, date, startTime, duration, timezone, location, accentColor } = attrs;
  const isAllDay = duration === -1;

  const formattedDate = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
      })
    : '—';

  let formattedTime = 'All day';
  if (!isAllDay && startTime) {
    const end = computeEndDateTime(date, startTime, duration);
    formattedTime = `${formatDisplayTime(startTime)} – ${formatDisplayTime(end.time)}`;
  }

  const tzShort = timezone.split('/').pop()?.replace(/_/g, ' ') ?? '';
  const chipColor = accentColor ?? '#1c1c1c';

  return (
    <NodeViewWrapper>
      <div
        style={{
          border: '1px solid var(--re-border, #e5e5e5)',
          borderRadius: '10px',
          overflow: 'hidden',
          margin: '2px 0',
          backgroundColor: 'var(--re-bg, #fff)',
          cursor: 'default',
          userSelect: 'none',
        }}
        contentEditable={false}
      >
        {/* Main content */}
        <div style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '7px', backgroundColor: 'var(--re-active, rgba(0,0,0,0.06))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '17px' }}>
              📅
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--re-text, #1c1c1c)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '2px' }}>
                {title || 'Untitled Event'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--re-text-muted, #6b6b6b)' }}>
                {formattedDate} · {formattedTime}
                {!isAllDay && tzShort ? ` (${tzShort})` : ''}
              </div>
              {location ? (
                <div style={{ fontSize: '12px', color: 'var(--re-text-muted, #6b6b6b)', marginTop: '1px' }}>
                  📍 {location}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Provider buttons */}
        <div style={{ borderTop: '1px solid var(--re-border, #e5e5e5)', padding: '8px 14px', display: 'flex', gap: '5px', flexWrap: 'wrap' as const }}>
          {PROVIDERS.map((label) => (
            <span
              key={label}
              style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: '4px',
                backgroundColor: chipColor,
                color: '#fff',
                fontSize: '11px',
                fontWeight: 500,
                opacity: 0.9,
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </NodeViewWrapper>
  );
}
