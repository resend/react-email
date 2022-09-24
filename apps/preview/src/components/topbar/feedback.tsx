import * as Popover from '@radix-ui/react-popover';
import * as React from 'react';
import inboxIcon from '../../helpers/inbox.json';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

export default function Feedback() {
  const [message, setMessage] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);
  const inboxIconRef = React.useRef<LottieRefCurrentProps>(null);

  const onFormSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsSending(true);

      await fetch('https://react.email/api/send/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
        }),
      });
    } catch (e) {
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="text-current transition duration-300 ease-in-out hover:opacity-60"
          onMouseEnter={() => {
            inboxIconRef.current?.play();
          }}
          onMouseLeave={() => {
            inboxIconRef.current?.stop();
          }}
        >
          <Lottie
            lottieRef={inboxIconRef}
            className="w-5 h-5"
            animationData={inboxIcon}
            loop={false}
            autoplay={false}
          />
        </button>
      </Popover.Trigger>
      <Popover.Anchor />
      <Popover.Portal>
        <Popover.Content align="end" className="w-80 -mt-6 p-3 bg-gray-1 border border-gray-8 rounded-lg">
          <Popover.Close aria-label="Close" className="absolute right-2 flex items-center justify-center w-6 h-6 text-xs text-gray-11 hover:text-gray-12 transition duration-300 ease-in-out rounded-full">
            ✕
          </Popover.Close>
          <form onSubmit={onFormSubmit}>
            <label className="text-gray-10 text-xs uppercase">
              Feedback
            </label>
            <textarea
              autoFocus={true}
              className="h-28 w-full resize-none rounded-lg p-3 mt-1 text-sm outline-none border border-gray-8 bg-gray-3 focus:ring-1 focus:ring-gray-10 transition duration-300 ease-in-out"
              id="feedback"
              name="feedback"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              placeholder="What if..."
              required
            />
            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={message.length === 0 || isSending}
                className="box-border outline-none self-center relative w-20 h-8 inline-flex items-center justify-center rounded-lg text-center font-semibold transition duration-300 ease-in-out bg-gray-12 text-gray-1 text-sm px-4 hover:bg-cyan-1 focus:ring-1 focus:ring-gray-12 disabled:bg-gray-11"
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