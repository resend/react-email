import * as Popover from '@radix-ui/react-popover';
import classNames from 'classnames';
import * as React from 'react';
import { toast } from 'sonner';
import { Button } from './button';
import { Text } from './text';

interface SendProps extends React.ComponentProps<'button'> {
  markup: string;
  defaultSubject?: string;
}

export const Send = ({
  markup,
  defaultSubject,
  className,
  ...rest
}: SendProps) => {
  const [to, setTo] = React.useState('');
  const [subject, setSubject] = React.useState(defaultSubject ?? '');
  const [isSending, setIsSending] = React.useState(false);
  const [isPopOverOpen, setIsPopOverOpen] = React.useState(false);

  const onFormSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsSending(true);

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
      } else {
        if (response.status === 429) {
          const { error } = (await response.json()) as { error: string };
          toast.error(error);
        } else {
          toast.error('Something went wrong. Please try again.');
        }
      }
    } catch (_exception) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const toId = React.useId();
  const subjectId = React.useId();

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
          type="submit"
          {...rest}
          className={classNames(
            'flex items-center justify-center self-center rounded-lg bg-slate-6 border border-solid border-transparent px-3 py-1 h-full text-center font-sans text-sm text-slate-11 outline-none transition duration-300 ease-in-out hover:text-slate-12',
            className,
          )}
        >
          Send
        </button>
      </Popover.Trigger>
      <Popover.Anchor />
      <Popover.Portal>
        <Popover.Content
          align="end"
          className="-mt-10 w-80 rounded-lg border border-slate-6 bg-black/70 p-3 text-slate-11 shadow-md backdrop-blur-lg font-sans z-[3]"
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
              className="mb-3 w-full appearance-none rounded-lg border border-slate-6 bg-slate-3 px-2 py-1 text-sm text-slate-12 placeholder-slate-10 outline-none transition duration-300 ease-in-out focus:ring-1 focus:ring-slate-10"
              defaultValue={to}
              id={toId}
              onChange={(e) => {
                setTo(e.target.value);
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
              className="mb-3 w-full appearance-none rounded-lg border border-slate-6 bg-slate-3 px-2 py-1 text-sm text-slate-12 placeholder-slate-10 outline-none transition duration-300 ease-in-out focus:ring-1 focus:ring-slate-10"
              defaultValue={subject}
              id={subjectId}
              onChange={(e) => {
                setSubject(e.target.value);
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
              <Text className="inline-block" size="1">
                Powered by{' '}
                <a
                  className="text-white/85 transition duration-300 ease-in-out hover:text-slate-12"
                  href="https://resend.com"
                  rel="noreferrer"
                  target="_blank"
                >
                  Resend
                </a>
              </Text>
              <Button
                className="disabled:border-transparent disabled:bg-slate-11"
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
