'use client';

import Image from 'next/image';

const TestimonialSection = () => {
  return (
    <section className="relative z-[4] mt-48 bg-background">
      <div className="relative [mask-image:linear-gradient(to_right,transparent,black_30%,black_70%,transparent)] overflow-hidden rounded-t-3xl border-t border-zinc-800 pt-16">
        <Line />
        <Blur />
        <div className="flex flex-col items-center justify-center gap-14">
          <blockquote className="relative flex w-full max-w-xl flex-col gap-10">
            <p className="text-center text-2xl font-medium leading-[1.4] tracking-[-0.01em] text-gradient text-balance">
            I've added emails to my site in 30 minutes. React Email is amazing.
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="p-px rounded-full bg-gradient-to-tr from-transparent via-transparent to-neutral-300">
                <Image
                  src="/static/lee-robinson.jpg"
                  alt="Lee Robinson's profile image"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-1">
                <a
                  href="https://x.com/karrisaarinen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium leading-none text-neutral-300"
                >
                  Lee Robinson
                </a>
                <span className="text-neutral-500 dark:text-neutral-400">
                  VP of DX, Cursor
                </span>
              </div>
            </div>
          </blockquote>
        </div>
      </div>
    </section>
  );
};

const Blur = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-[1] -top-1 left-1/2 h-[600px] w-full max-w-[200px] -translate-x-1/2 -translate-y-1/2 md:max-w-[500px]"
      style={{
        background:
          'conic-gradient(from 90deg at 50% 50%, #00000000 50%, #0a0a0a 50%),radial-gradient(rgba(37, 99, 235, 0.1) 0%, transparent 80%)',
      }}
    />
  );
};

const Line = () => {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-0 h-px w-1/2 max-w-[1000px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-l from-transparent via-cyan-12/50 via-50% to-transparent"
    />
  );
};

export default TestimonialSection;
