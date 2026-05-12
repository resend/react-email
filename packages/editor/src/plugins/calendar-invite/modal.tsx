import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { formatDisplayTime } from './ical-generator';
import type { CalendarEvent } from './types';
import { CALENDAR_TIMEZONES } from './types';

// ─── constants ────────────────────────────────────────────────────────────────

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/** Half-hour slots from 6:00 AM to 11:00 PM */
const TIME_SLOTS: string[] = [];
for (let h = 6; h <= 23; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, '0')}:00`);
  if (h < 23) TIME_SLOTS.push(`${String(h).padStart(2, '0')}:30`);
}

const DURATION_PILLS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1 hr', value: 60 },
  { label: '1.5 hr', value: 90 },
  { label: '2 hr', value: 120 },
  { label: '3 hr', value: 180 },
  { label: '4 hr', value: 240 },
  { label: 'All day', value: -1 },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}

function getGmtOffset(tz: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en', {
      timeZone: tz,
      timeZoneName: 'shortOffset',
    }).formatToParts(new Date());
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
  } catch {
    return '';
  }
}

function buildCalendarGrid(month: number, year: number): (number | null)[][] {
  const firstDow = new Date(year, month - 1, 1).getDay();
  const days = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = [
    ...Array<null>(firstDow).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

function getDefaultStartTime(): string {
  const next = new Date();
  next.setHours(next.getHours() + 1, 0, 0, 0);
  const h = Math.max(6, Math.min(23, next.getHours()));
  return `${String(h).padStart(2, '0')}:00`;
}

interface SelectedDate {
  year: number;
  month: number;
  day: number;
}

interface FormState {
  title: string;
  selected: SelectedDate;
  viewYear: number;
  viewMonth: number;
  startTime: string; // HH:MM 24h
  duration: number;
  timezone: string;
  location: string;
  description: string;
}

function makeInitialState(defaultTimezone?: string): FormState {
  const now = new Date();
  const rawTz = defaultTimezone ?? detectTimezone();
  const tz = CALENDAR_TIMEZONES.some((t) => t.value === rawTz) ? rawTz : 'UTC';
  return {
    title: '',
    selected: {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    },
    viewYear: now.getFullYear(),
    viewMonth: now.getMonth() + 1,
    startTime: getDefaultStartTime(),
    duration: 60,
    timezone: tz,
    location: '',
    description: '',
  };
}

function formToEvent(f: FormState): CalendarEvent {
  const m = String(f.selected.month).padStart(2, '0');
  const d = String(f.selected.day).padStart(2, '0');
  return {
    title: f.title,
    date: `${f.selected.year}-${m}-${d}`,
    startTime: f.startTime,
    duration: f.duration,
    timezone: f.timezone,
    location: f.location,
    description: f.description,
  };
}

function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '5px 11px',
        borderRadius: '20px',
        border: `1px solid ${active ? 'transparent' : 'var(--re-border, #e5e5e5)'}`,
        backgroundColor: active ? 'var(--re-text, #1c1c1c)' : 'transparent',
        color: active ? 'var(--re-bg, #fff)' : 'var(--re-text, #1c1c1c)',
        fontSize: '12px',
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        whiteSpace: 'nowrap' as const,
        flexShrink: 0,
        lineHeight: '1.4',
      }}
    >
      {label}
    </button>
  );
}

function CalendarGrid({
  selected,
  viewYear,
  viewMonth,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
}: {
  selected: SelectedDate;
  viewYear: number;
  viewMonth: number;
  onSelectDay: (day: number, month: number, year: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}) {
  const grid = buildCalendarGrid(viewMonth, viewYear);
  const today = new Date();
  const todayY = today.getFullYear();
  const todayM = today.getMonth() + 1;
  const todayD = today.getDate();

  const cellBase: React.CSSProperties = {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    fontSize: '13px',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    margin: '0 auto',
  };

  return (
    <div>
      {/* Month nav */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <button
          type="button"
          onClick={onPrevMonth}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '4px',
            color: 'var(--re-text-muted, #6b6b6b)',
            fontSize: '14px',
          }}
          aria-label="Previous month"
        >
          ‹
        </button>
        <span
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--re-text, #1c1c1c)',
          }}
        >
          {MONTHS_LONG[viewMonth - 1]} {viewYear}
        </span>
        <button
          type="button"
          onClick={onNextMonth}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '4px',
            color: 'var(--re-text-muted, #6b6b6b)',
            fontSize: '14px',
          }}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {/* Weekday headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          marginBottom: '4px',
        }}
      >
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            style={{
              textAlign: 'center',
              fontSize: '11px',
              color: 'var(--re-text-muted, #6b6b6b)',
              fontWeight: 500,
              padding: '2px 0',
            }}
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Day rows */}
      {grid.map((row, ri) => (
        <div
          key={ri}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}
        >
          {row.map((day, ci) => {
            if (day === null)
              return <div key={ci} style={{ height: '32px' }} />;
            const isSelected =
              day === selected.day &&
              viewMonth === selected.month &&
              viewYear === selected.year;
            const isToday =
              day === todayD && viewMonth === todayM && viewYear === todayY;
            return (
              <button
                key={ci}
                type="button"
                onClick={() => onSelectDay(day, viewMonth, viewYear)}
                style={{
                  ...cellBase,
                  backgroundColor: isSelected
                    ? 'var(--re-text, #1c1c1c)'
                    : 'transparent',
                  color: isSelected
                    ? 'var(--re-bg, #fff)'
                    : isToday
                      ? 'var(--re-text, #1c1c1c)'
                      : 'var(--re-text, #1c1c1c)',
                  fontWeight: isToday && !isSelected ? 700 : 400,
                  boxShadow:
                    isToday && !isSelected
                      ? 'inset 0 0 0 1.5px var(--re-border, #e5e5e5)'
                      : 'none',
                }}
                aria-label={`${MONTHS_SHORT[viewMonth - 1]} ${day}`}
                aria-pressed={isSelected}
              >
                {day}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export interface CalendarModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (event: CalendarEvent) => void;
  defaultTimezone?: string;
}

export function CalendarModal({
  open,
  onClose,
  onSubmit,
  defaultTimezone,
}: CalendarModalProps) {
  const [form, setForm] = useState<FormState>(() =>
    makeInitialState(defaultTimezone),
  );
  const [titleError, setTitleError] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const timePillsRef = useRef<HTMLDivElement>(null);
  const activeTimePillRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setForm(makeInitialState(defaultTimezone));
      setTitleError(false);
      setTimeout(() => titleRef.current?.focus(), 60);
    }
  }, [open, defaultTimezone]);

  // Scroll selected time pill into view when modal opens
  useLayoutEffect(() => {
    if (open && activeTimePillRef.current && timePillsRef.current) {
      const pill = activeTimePillRef.current;
      const container = timePillsRef.current;
      const offset =
        pill.offsetLeft - container.clientWidth / 2 + pill.clientWidth / 2;
      container.scrollLeft = offset;
    }
  }, [open]);

  const set = useCallback(
    <K extends keyof FormState>(k: K, v: FormState[K]) => {
      setForm((p) => ({ ...p, [k]: v }));
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    if (!form.title.trim()) {
      setTitleError(true);
      titleRef.current?.focus();
      return;
    }
    onSubmit(formToEvent(form));
  }, [form, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit();
    },
    [onClose, handleSubmit],
  );

  const prevMonth = useCallback(() => {
    setForm((p) => {
      let m = p.viewMonth - 1;
      let y = p.viewYear;
      if (m < 1) {
        m = 12;
        y--;
      }
      return { ...p, viewMonth: m, viewYear: y };
    });
  }, []);

  const nextMonth = useCallback(() => {
    setForm((p) => {
      let m = p.viewMonth + 1;
      let y = p.viewYear;
      if (m > 12) {
        m = 1;
        y++;
      }
      return { ...p, viewMonth: m, viewYear: y };
    });
  }, []);

  const selectDay = useCallback(
    (day: number, month: number, year: number) => {
      set('selected', { day, month, year });
    },
    [set],
  );

  if (!open) return null;

  const isAllDay = form.duration === -1;

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '32px',
    padding: '0 10px',
    border: '1px solid var(--re-border, #e5e5e5)',
    borderRadius: '6px',
    backgroundColor: 'var(--re-bg, #fff)',
    color: 'var(--re-text, #1c1c1c)',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
    color: 'var(--re-text-muted, #6b6b6b)',
    marginBottom: '8px',
  };

  const sectionStyle: React.CSSProperties = { marginBottom: '20px' };

  const dividerStyle: React.CSSProperties = {
    border: 'none',
    borderTop: '1px solid var(--re-border, #e5e5e5)',
    margin: '0 -20px 20px',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.45)',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add Calendar Invite"
        style={{
          position: 'relative',
          backgroundColor: 'var(--re-bg, #fff)',
          border: '1px solid var(--re-border, #e5e5e5)',
          borderRadius: '14px',
          width: '400px',
          maxWidth: '92vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--re-shadow, 0 20px 60px rgba(0,0,0,0.2))',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px 14px',
            borderBottom: '1px solid var(--re-border, #e5e5e5)',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--re-text, #1c1c1c)',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
            }}
          >
            <span style={{ fontSize: '16px' }}>📅</span> Calendar Invite
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 6px',
              color: 'var(--re-text-muted, #6b6b6b)',
              fontSize: '20px',
              lineHeight: 1,
              borderRadius: '4px',
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {/* Event name */}
          <div style={sectionStyle}>
            <label style={labelStyle} htmlFor="cal-title">
              Event name
            </label>
            <input
              id="cal-title"
              ref={titleRef}
              style={{
                ...inputStyle,
                ...(titleError
                  ? { borderColor: 'var(--re-danger, #dc2626)' }
                  : {}),
              }}
              type="text"
              value={form.title}
              onChange={(e) => {
                set('title', e.target.value);
                if (titleError) setTitleError(false);
              }}
              placeholder="Team sync, Product launch…"
              autoComplete="off"
            />
            {titleError && (
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--re-danger, #dc2626)',
                  marginTop: '4px',
                  display: 'block',
                }}
              >
                Required
              </span>
            )}
          </div>

          <hr style={dividerStyle} />

          {/* Date — calendar grid */}
          <div style={sectionStyle}>
            <label style={labelStyle}>Date</label>
            <CalendarGrid
              selected={form.selected}
              viewYear={form.viewYear}
              viewMonth={form.viewMonth}
              onSelectDay={selectDay}
              onPrevMonth={prevMonth}
              onNextMonth={nextMonth}
            />
          </div>

          <hr style={dividerStyle} />

          {/* Start time — pill row */}
          {!isAllDay && (
            <div style={sectionStyle}>
              <label style={labelStyle}>Start time</label>
              <div
                ref={timePillsRef}
                style={{
                  display: 'flex',
                  gap: '6px',
                  overflowX: 'auto',
                  paddingBottom: '4px',
                  scrollbarWidth: 'none',
                }}
              >
                {TIME_SLOTS.map((slot) => {
                  const active = slot === form.startTime;
                  return (
                    <button
                      key={slot}
                      ref={active ? activeTimePillRef : undefined}
                      type="button"
                      onClick={() => set('startTime', slot)}
                      style={{
                        padding: '5px 11px',
                        borderRadius: '20px',
                        border: `1px solid ${active ? 'transparent' : 'var(--re-border, #e5e5e5)'}`,
                        backgroundColor: active
                          ? 'var(--re-text, #1c1c1c)'
                          : 'transparent',
                        color: active
                          ? 'var(--re-bg, #fff)'
                          : 'var(--re-text, #1c1c1c)',
                        fontSize: '12px',
                        fontWeight: active ? 600 : 400,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        lineHeight: '1.4',
                      }}
                    >
                      {formatDisplayTime(slot)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Duration — pill grid */}
          <div style={sectionStyle}>
            <label style={labelStyle}>Duration</label>
            <div
              style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}
            >
              {DURATION_PILLS.map((d) => (
                <Pill
                  key={d.value}
                  label={d.label}
                  active={form.duration === d.value}
                  onClick={() => set('duration', d.value)}
                />
              ))}
            </div>
          </div>

          {/* Timezone */}
          {!isAllDay && (
            <>
              <hr style={dividerStyle} />
              <div style={sectionStyle}>
                <label style={labelStyle} htmlFor="cal-tz">
                  Time zone
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    id="cal-tz"
                    value={form.timezone}
                    onChange={(e) => set('timezone', e.target.value)}
                    style={{
                      ...inputStyle,
                      height: 'auto',
                      padding: '7px 32px 7px 10px',
                      appearance: 'none',
                      cursor: 'pointer',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236b6b6b' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 10px center',
                    }}
                  >
                    {CALENDAR_TIMEZONES.map((tz) => {
                      const offset = getGmtOffset(tz.value);
                      return (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                          {offset ? `  ·  ${offset}` : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {/* Inline offset hint below */}
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--re-text-muted, #6b6b6b)',
                    marginTop: '5px',
                  }}
                >
                  {getGmtOffset(form.timezone)} · {form.timezone}
                </div>
              </div>
            </>
          )}

          <hr style={dividerStyle} />

          {/* Location */}
          <div style={sectionStyle}>
            <label style={labelStyle} htmlFor="cal-location">
              Location{' '}
              <span
                style={{
                  fontWeight: 400,
                  textTransform: 'none',
                  letterSpacing: 0,
                }}
              >
                (optional)
              </span>
            </label>
            <input
              id="cal-location"
              style={inputStyle}
              type="text"
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder="Conference Room A, Zoom link…"
              autoComplete="off"
            />
          </div>

          {/* Notes */}
          <div style={sectionStyle}>
            <label style={labelStyle} htmlFor="cal-notes">
              Notes{' '}
              <span
                style={{
                  fontWeight: 400,
                  textTransform: 'none',
                  letterSpacing: 0,
                }}
              >
                (optional)
              </span>
            </label>
            <textarea
              id="cal-notes"
              style={{
                ...inputStyle,
                height: '72px',
                padding: '8px 10px',
                resize: 'vertical',
                lineHeight: '1.5',
              }}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Agenda, dial-in info…"
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
            padding: '12px 20px 16px',
            borderTop: '1px solid var(--re-border, #e5e5e5)',
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              height: '32px',
              padding: '0 16px',
              border: '1px solid var(--re-border, #e5e5e5)',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              color: 'var(--re-text, #1c1c1c)',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              height: '32px',
              padding: '0 16px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: 'var(--re-text, #1c1c1c)',
              color: 'var(--re-bg, #fff)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Add to email
          </button>
        </div>
      </div>
    </div>
  );
}
