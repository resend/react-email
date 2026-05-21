import * as Popover from '@radix-ui/react-popover';
import { useId, useState } from 'react';
import { toast } from 'sonner';
import { useCachedWorkspaceState } from '../hooks/use-cached-workspace-state';
import { Button } from './button';
import { Text } from './text';

interface SendProps {
  markup: string;
  defaultSubject?: string;
  /**
   * Stable identifier for the email template (typically the slug/relative
   * path). When provided, user edits to the subject are persisted in
   * localStorage so the next visit reuses what they typed.
   */
  storageKey?: string;
}

export const Send = ({ markup, defaultSubject, storageKey }: SendProps) => {
  const fallbackSubject = defaultSubject?.trim() || 'Testing React Email';

  const [cachedSubject, setCachedSubject] = useCachedWorkspaceState<string>(
    `test-email-subject-${(storageKey ?? '').replaceAll('/', '-')}`,
  );
  // The recipient is cached under a single workspace-wide key — testers
  // usually send to the same address regardless of which template they're
  // on, so per-template scoping would just make them retype it.
  const [cachedRecipient, setCachedRecipient] =
    useCachedWorkspaceState<string>('test-email-recipient');

  const [to, setTo] = useState(cachedRecipient ?? '');
  const [subject, setSubject] = useState(cachedSubject ?? fallbackSubject);
  const [isSending, setIsSending] = useState(false);
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch('https://react.email/api/send/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          subject,
          html: markup,
        }),
      });

      if (response.ok) {
        toast.success('Email sent! Check your inbox.');
      } else if (response.status === 429) {
        toast.error('Too many requests. Try again in around 1 minute');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    }

    setIsSending(false);
  };

  const toId = useId();
  const subjectId = useId();

  return (
    <Popover.Root
      onOpenChange={() => {
        if (!isPopOverOpen) {
          document.body.classList.add('popup-open');
          setIsPopOverOpen(true);
        } else {
          document.body.classList.remove('popup-open');
          setIsPopOverOpen(false);
        }
      }}
      open={isPopOverOpen}
    >
      <Popover.Trigger asChild>
        <button
          className="box-border flex h-5 w-20 items-center justify-center self-center rounded-lg border border-slate-6 bg-slate-2 px-4 py-4 text-center font-sans text-sm text-slate-11 outline-hidden transition duration-300 ease-in-out hover:border-slate-10 hover:text-slate-12"
          type="submit"
        >
          Send
        </button>
      </Popover.Trigger>
      <Popover.Anchor />
      <Popover.Portal>
        <Popover.Content
          align="end"
          className="-mt-10 w-80 rounded-lg border border-slate-6 bg-black/70 p-3 text-slate-11 shadow-md backdrop-blur-lg font-sans"
          sideOffset={48}
        >
          <form className="mt-1" onSubmit={(e) => void onFormSubmit(e)}>
            <label
              className="mb-2 block text-xs uppercase text-slate-10"
              htmlFor={toId}
            >
              Recipient
            </label>
            <input
              autoFocus
              className="mb-3 w-full appearance-none rounded-lg border border-slate-6 bg-slate-3 px-2 py-1 text-sm text-slate-12 placeholder-slate-10 outline-hidden transition duration-300 ease-in-out focus:ring-1 focus:ring-slate-10"
              value={to}
              id={toId}
              onChange={(e) => {
                const next = e.target.value;
                setTo(next);
                if (next.length === 0) {
                  setCachedRecipient(undefined);
                } else {
                  setCachedRecipient(next);
                }
              }}
              placeholder="you@example.com"
              required
              type="email"
            />
            <label
              className="mb-2 mt-1 block text-xs uppercase text-slate-10"
              htmlFor={subjectId}
            >
              Subject
            </label>
            <input
              className="mb-3 w-full appearance-none rounded-lg border border-slate-6 bg-slate-3 px-2 py-1 text-sm text-slate-12 placeholder-slate-10 outline-hidden transition duration-300 ease-in-out focus:ring-1 focus:ring-slate-10"
              value={subject}
              id={subjectId}
              onChange={(e) => {
                const next = e.target.value;
                setSubject(next);
                if (!storageKey) return;

                // Persist the override only when the user diverges from the inferred
                // title; if they revert to the default (or clear the field), drop the
                // override so future changes to the inferred title can take effect.
                if (next === fallbackSubject || next.length === 0) {
                  setCachedSubject(undefined);
                } else {
                  setCachedSubject(next);
                }
              }}
              placeholder="My Email"
              required
              type="text"
            />
            <input
              className="appearance-none checked:bg-blue-500"
              type="checkbox"
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="inline-flex flex-col">
                <Text size="1">
                  Powered by{' '}
                  <a
                    className="text-white/85 transition duration-300 ease-in-out hover:text-slate-12"
                    href="https://go.resend.com/react-email"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Resend
                  </a>
                </Text>
              </div>
              <Button
                className="disabled:border-transparent disabled:bg-slate-11 m-0"
                disabled={subject.length === 0 || to.length === 0 || isSending}
                type="submit"
              >
                Send
              </Button>
            </div>
          </form>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
