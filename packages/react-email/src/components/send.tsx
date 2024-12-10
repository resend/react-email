import * as Popover from '@radix-ui/react-popover';
import * as React from 'react';
import { toast } from 'sonner';
import { inter } from '../app/inter';
import { Button } from './button';
import { Text } from './text';

export const Send = ({ markup }: { markup: string }) => {
  const [to, setTo] = React.useState('');
  const [subject, setSubject] = React.useState('Testing React Email');
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

      if (response.status === 429) {
        const { error } = (await response.json()) as { error: string };
        toast.error(error);
      }

      toast.success('Email sent! Check your inbox.');
    } catch (exception) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

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
          className="box-border flex h-5 w-20 items-center justify-center self-center rounded-lg border border-slate-6 bg-slate-2 px-4 py-4 text-center font-sans text-sm text-slate-11 outline-none transition duration-300 ease-in-out hover:border-slate-10 hover:text-slate-12"
          type="submit"
        >
          Send
        </button>
      </Popover.Trigger>
      <Popover.Anchor />
      <Popover.Portal>
        <Popover.Content
          align="end"
          className={`-mt-10 w-80 rounded-lg border border-slate-6 bg-black/70 p-3 font-sans text-slate-11 shadow-md backdrop-blur-lg ${inter.variable}`}
          sideOffset={48}
        >
          <form className="mt-1" onSubmit={(e) => void onFormSubmit(e)}>
            <label
              className="mb-2 block text-xs uppercase text-slate-10"
              htmlFor="to"
            >
              Recipient
            </label>
            <input
              autoFocus
              className="mb-3 w-full appearance-none rounded-lg border border-slate-6 bg-slate-3 px-2 py-1 text-sm text-slate-12 placeholder-slate-10 outline-none transition duration-300 ease-in-out focus:ring-1 focus:ring-slate-10"
              defaultValue={to}
              id="to"
              onChange={(e) => {
                setTo(e.target.value);
              }}
              placeholder="you@example.com"
              required
              type="email"
            />
            <label
              className="mb-2 mt-1 block text-xs uppercase text-slate-10"
              htmlFor="subject"
            >
              Subject
            </label>
            <input
              className="mb-3 w-full appearance-none rounded-lg border border-slate-6 bg-slate-3 px-2 py-1 text-sm text-slate-12 placeholder-slate-10 outline-none transition duration-300 ease-in-out focus:ring-1 focus:ring-slate-10"
              defaultValue={subject}
              id="subject"
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
