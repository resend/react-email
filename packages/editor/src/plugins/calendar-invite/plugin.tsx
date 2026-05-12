import { useCurrentEditor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';
import { editorEventBus } from '../../core/event-bus';
import { CalendarModal } from './modal';
import type { CalendarEvent, CalendarPluginOptions } from './types';

export function CalendarInvitePlugin({
  defaultTimezone,
  cardBg,
  accentColor,
  borderColor,
}: CalendarPluginOptions = {}) {
  const { editor } = useCurrentEditor();
  const [isOpen, setIsOpen] = useState(false);
  const [pendingRange, setPendingRange] = useState<{ from: number; to: number } | null>(null);

  useEffect(() => {
    const sub = editorEventBus.on('calendar-invite:open', (payload) => {
      if (payload.editorRef !== editor) return;
      setPendingRange(payload.range);
      setIsOpen(true);
    });
    return () => sub.unsubscribe();
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setPendingRange(null);
    editor?.commands.focus();
  }, [editor]);

  const handleSubmit = useCallback(
    (event: CalendarEvent) => {
      if (!editor || !pendingRange) return;

      const mergedEvent = {
        ...event,
        cardBg: event.cardBg ?? cardBg,
        accentColor: event.accentColor ?? accentColor,
        borderColor: event.borderColor ?? borderColor,
      };

      // Resolve the parent block (paragraph) that contains the slash command text
      // so we replace the whole block rather than just deleting inline text and
      // letting insertContent pick an unpredictable cursor position.
      const $pos = editor.state.doc.resolve(pendingRange.from);
      const blockStart = $pos.before($pos.depth);
      const blockEnd = $pos.after($pos.depth);

      editor
        .chain()
        .focus()
        .insertContentAt(
          { from: blockStart, to: blockEnd },
          [
            { type: 'calendarInvite', attrs: mergedEvent },
            { type: 'paragraph' },
          ],
        )
        .run();

      setIsOpen(false);
      setPendingRange(null);
    },
    [editor, pendingRange, cardBg, accentColor, borderColor],
  );

  return (
    <CalendarModal
      open={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      defaultTimezone={defaultTimezone}
    />
  );
}
