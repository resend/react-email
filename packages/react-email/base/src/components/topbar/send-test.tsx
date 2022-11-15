import * as Popover from '@radix-ui/react-popover';
import * as React from 'react';

export default function TestEmail({ markup }: { markup: string }) {
  const [to, setTo] = React.useState('');
  const [subject, setSubject] = React.useState(
    'bukinoshita invited you to My Project team on Vercel',
  );
  const [isSending, setIsSending] = React.useState(false);

  const onFormSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsSending(true);

      await fetch('https://react.email/api/send/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          subject,
          html: markup,
        }),
      });
    } catch (e) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="box-border outline-none self-center relative w-20 h-5 inline-flex items-center justify-center rounded-lg text-center transition duration-300 ease-in-out border border-gray-8 text-gray-12 text-sm px-4 py-4 hover:border-gray-12">
          Send
        </button>
      </Popover.Trigger>
      <Popover.Anchor />
      <Popover.Portal>
        <Popover.Content
          align="end"
          className="w-80 -mt-10 p-3 bg-gray-1 border border-gray-8 rounded-lg"
        >
          <Popover.Close
            aria-label="Close"
            className="absolute right-2 flex items-center justify-center w-6 h-6 text-xs text-gray-11 hover:text-gray-12 transition duration-300 ease-in-out rounded-full"
          >
            ✕
          </Popover.Close>
          <form onSubmit={onFormSubmit}>
            <label htmlFor="to" className="text-gray-10 text-xs uppercase">
              Recipient
            </label>
            <input
              autoFocus={true}
              className="appearance-none rounded-lg px-2 py-1 mb-3 outline-none w-full bg-gray-3 border placeholder-gray-11 border-gray-6 text-sm text-gray-12 focus:ring-1 focus:ring-gray-10 transition duration-300 ease-in-out"
              onChange={(e) => setTo(e.target.value)}
              defaultValue={to}
              placeholder="you@example.com"
              type="email"
              id="to"
              required
            />
            <label htmlFor="subject" className="text-gray-10 text-xs uppercase">
              Subject
            </label>
            <input
              className="appearance-none rounded-lg px-2 py-1 mb-3 outline-none w-full bg-gray-3 border placeholder-gray-11 border-gray-6 text-sm text-gray-12 focus:ring-1 focus:ring-gray-10 transition duration-300 ease-in-out"
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
              <button
                type="submit"
                disabled={subject.length === 0 || to.length === 0 || isSending}
                className="box-border outline-none self-center relative w-20 h-8 inline-flex items-center justify-center rounded-lg text-center font-semibold transition duration-300 ease-in-out bg-gray-12 text-gray-1 text-sm px-4 hover:bg-cyan-1 focus:bg-cyan-1 disabled:bg-gray-11"
              >
                Send
              </button>
            </div>
          </form>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
