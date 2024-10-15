import * as Popover from '@radix-ui/react-popover';
import * as React from 'react';
import { toast } from 'sonner';
import { inter } from '../app/inter';
import { sendTestEmail } from '../actions/send-test-email';
import { Button } from './button';
import { Text } from './text';

const useTimer = (startingSeconds: number) => {
  const [isRatelimiting, setIsRatelimiting] = React.useState(false);
  const [secondsRemaining, setSecondsRemaining] =
    React.useState(startingSeconds);

  const interval = React.useRef<NodeJS.Timer | undefined>(undefined);

  return {
    isActive: isRatelimiting,
    secondsRemaining,
    start: () => {
      setIsRatelimiting(true);
      setSecondsRemaining(startingSeconds);
      clearInterval(interval.current);

      let secondsRemainingTemp = startingSeconds;
      interval.current = setInterval(() => {
        setSecondsRemaining((v) => v - 1);
        secondsRemainingTemp -= 1;

        if (secondsRemainingTemp <= 0) {
          clearInterval(interval.current);
          setIsRatelimiting(false);
          setSecondsRemaining(startingSeconds);
        }
      }, 1_000);
    },
  };
};

export const Send = ({ markup }: { markup: string }) => {
  const [to, setTo] = React.useState('');
  const [subject, setSubject] = React.useState('Testing React Email');
  const [isSending, setIsSending] = React.useState(false);
  const [isPopOverOpen, setIsPopOverOpen] = React.useState(false);
  const rateLimiter = useTimer(15);

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const { code, ok } = await sendTestEmail({
        to,
        subject,
        markup,
      });

      if (ok) {
        toast.success('Email sent! Check your inbox.');
      } else if (code === 429) {
        toast.error('Too many requests.');
        rateLimiter.start();
      }
    } catch (exception) {
      toast.error('Something went wrong. Please try again.');
    }
    setIsSending(false);
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
          className="box-border outline-none self-center w-20 h-5 flex items-center justify-center rounded-lg bg-slate-2 text-center transition duration-300  ease-in-out border border-slate-6 text-slate-11 text-sm px-4 py-4 hover:border-slate-10 hover:text-slate-12 font-sans"
          type="submit"
        >
          Send
        </button>
      </Popover.Trigger>
      <Popover.Anchor />
      <Popover.Portal>
        <Popover.Content
          align="end"
          className={`w-80 -mt-10 p-3 bg-black/70 backdrop-blur-lg border border-slate-6 text-slate-11 rounded-lg shadow-md font-sans ${inter.variable}`}
          sideOffset={48}
        >
          <form className="mt-1" onSubmit={(e) => void onFormSubmit(e)}>
            <label
              className="text-slate-10 text-xs uppercase mb-2 block"
              htmlFor="to"
            >
              Recipient
            </label>
            <input
              autoFocus
              className="appearance-none rounded-lg px-2 py-1 mb-3 outline-none w-full bg-slate-3 border placeholder-slate-10 border-slate-6 text-slate-12 text-sm focus:ring-1 focus:ring-slate-10 transition duration-300 ease-in-out"
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
              className="text-slate-10 text-xs uppercase mb-2 mt-1 block"
              htmlFor="subject"
            >
              Subject
            </label>
            <input
              className="appearance-none rounded-lg px-2 py-1 mb-3 outline-none w-full bg-slate-3 border placeholder-slate-10 border-slate-6 text-slate-12 text-sm focus:ring-1 focus:ring-slate-10 transition duration-300 ease-in-out"
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
            <div className="flex items-center justify-between mt-3">
              <Text className="inline-block" size="1">
                Powered by{' '}
                <a
                  className="text-white/85 hover:text-slate-12 transition ease-in-out duration-300"
                  href="https://resend.com"
                  rel="noreferrer"
                  target="_blank"
                >
                  Resend
                </a>
              </Text>
              <Button
                className="disabled:bg-slate-11 disabled:border-transparent"
                disabled={
                  subject.length === 0 ||
                  to.length === 0 ||
                  isSending ||
                  rateLimiter.isActive
                }
                type="submit"
              >
                Send
                {rateLimiter.isActive
                  ? ` ${rateLimiter.secondsRemaining}s`
                  : null}
              </Button>
            </div>
          </form>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
