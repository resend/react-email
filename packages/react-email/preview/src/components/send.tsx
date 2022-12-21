import { inter } from '../pages/_app';
import { Button } from './button';
import * as Popover from '@radix-ui/react-popover';
import * as React from 'react';

export const Send = ({ markup }: { markup: string }) => {
  const [to, setTo] = React.useState('');
  const [subject, setSubject] = React.useState('Testing React Email');
  const [isSending, setIsSending] = React.useState(false);

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
        const { error } = await response.json();
        alert(error);
      }
    } catch (e) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="box-border outline-none self-center w-20 h-5 flex items-center justify-center rounded-lg text-center transition duration-300 ease-in-out border border-slate-6 text-slate-11 text-sm px-4 py-4 hover:border-slate-12 hover:text-slate-12 font-sans">
          Send
        </button>
      </Popover.Trigger>
      <Popover.Anchor />
      <Popover.Portal>
        <Popover.Content
          align="end"
          className={`w-80 -mt-10 p-3 bg-black border border-slate-6 text-slate-11 rounded-lg font-sans ${inter.variable}`}
        >
          <Popover.Close
            aria-label="Close"
            className="absolute right-2 flex items-center justify-center w-6 h-6 text-xs text-slate-11 hover:text-slate-12 transition duration-300 ease-in-out rounded-full"
          >
            ✕
          </Popover.Close>
          <form onSubmit={onFormSubmit} className="mt-1">
            <label htmlFor="to" className="text-slate-10 text-xs uppercase mb-2 block">
              Recipient
            </label>
            <input
              autoFocus={true}
              className="appearance-none rounded-lg px-2 py-1 mb-3 outline-none w-full bg-slate-3 border placeholder-slate-8 border-slate-6 text-slate-12 text-sm focus:ring-1 focus:ring-slate-12 transition duration-300 ease-in-out"
              onChange={(e) => setTo(e.target.value)}
              defaultValue={to}
              placeholder="you@example.com"
              type="email"
              id="to"
              required
            />
            <label htmlFor="subject" className="text-slate-10 text-xs uppercase mb-2 block">
              Subject
            </label>
            <input
              className="appearance-none rounded-lg px-2 py-1 mb-3 outline-none w-full bg-slate-3 border placeholder-slate-8 border-slate-6 text-slate-12 text-sm focus:ring-1 focus:ring-slate-12 transition duration-300 ease-in-out"
              onChange={(e) => setSubject(e.target.value)}
              defaultValue={subject}
              placeholder="My Email"
              type="text"
              id="subject"
              required
            />
            <input
              type="checkbox"
              className="appearance-none checked:bg-blue-500"
            />
            <div className="flex items-center justify-end">
              <Button
                type="submit"
                disabled={subject.length === 0 || to.length === 0 || isSending}
                className="disabled:bg-slate-11 disabled:border-transparent"
              >
                Send
              </Button>
            </div>
          </form>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
