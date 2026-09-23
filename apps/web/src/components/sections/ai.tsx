'use client';

import { CheckIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/button';
import { Code } from '@/components/code';
import { Heading } from '@/components/heading';
import { Text } from '@/components/text';

const AiSection = () => {
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);

  const handleCopy = async (item: (typeof items)[number]) => {
    await navigator.clipboard.writeText(item.prompt);
    setCopiedTitle(item.title);
    window.setTimeout(() => {
      setCopiedTitle((current) => (current === item.title ? null : current));
    }, 1500);
  };

  return (
    <section className="relative my-24 space-y-12 py-20 text-center max-md:px-6 md:space-y-16">
      <Blur />
      <div className="relative z-4 max-w-full space-y-4 text-center md:mx-auto md:max-w-160">
        <Heading
          as="h2"
          size="8"
          weight="medium"
          className="inline-block text-white/80 max-md:mx-auto max-md:max-w-lg md:w-96"
        >
          Build with any AI
        </Heading>
        <div className="px-4 md:px-40">
          <Text size="5" className="opacity-70">
            Describe the email you want. Your agent builds it with React Email.
          </Text>
        </div>
      </div>
      <ul className="mx-auto grid w-fit grid-cols-3 gap-6 md:grid-cols-6 lg:gap-16">
        {items.map((item) => {
          const isCopied = copiedTitle === item.title;

          return (
            <li
              key={item.title}
              className="flex flex-col items-center justify-center gap-3"
            >
              <button
                type="button"
                onClick={() => {
                  void handleCopy(item);
                }}
                className="flex flex-col items-center justify-center gap-3 bg-transparent outline-hidden focus-visible:ring-1 focus-visible:ring-slate-7"
              >
                <div className="flex items-center w-20 h-20 shrink-0 grow justify-center bg-linear-to-b from-zinc-800 to-zinc-950 rounded-[18px] shadow-[0px_32px_64px_-16px_transparent,0px_16px_32px_-8px_transparent,0px_8px_16px_-4px_transparent,0px_4px_8px_-2px_transparent,0px_-8px_16px_-1px_transparent,0px_2px_4px_-1px_transparent,0px_0px_0px_1px_transparent,inset_0px_0px_0px_1px_rgba(255,255,255,0.1),inset_0px_1px_0px_rgb(255,255,255,0.15)]">
                  {isCopied ? (
                    <CheckIcon className="size-8 text-cyan-11" aria-hidden />
                  ) : (
                    item.icon
                  )}
                </div>
                <Text
                  size="3"
                  className="relative z-4 grid opacity-90 font-[460] tracking-tight"
                  aria-live="polite"
                >
                  <span
                    className={`text-gradient [grid-area:1/1] ${isCopied ? 'invisible' : ''}`}
                  >
                    {item.title}
                  </span>
                  <span
                    className={`text-gradient [grid-area:1/1] ${isCopied ? '' : 'invisible'}`}
                  >
                    Copied
                  </span>
                </Text>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="relative z-4 mb-0 flex flex-wrap items-center justify-center gap-4">
        <Code language="bash" className="w-auto! max-w-full">
          npx skills add resend/react-email
        </Code>
        <Button asChild size="4" appearance="gradient">
          <Link href="/docs/llms.txt">Docs for LLMs</Link>
        </Button>
      </div>
      <Image
        alt=""
        className="pointer-events-none absolute sm:-translate-x-48 -top-20 z-3 scale-110 select-none mix-blend-lighten opacity-100"
        fill
        src="/static/bg.png"
      />
    </section>
  );
};

const Blur = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-1"
      style={{
        background:
          'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(37, 99, 235, 0.06) 0%, transparent 70%)',
      }}
    />
  );
};

const Icons = {
  claude: () => (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fill="#D97757"
        d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"
      />
    </svg>
  ),
  codex: () => (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient
          id="codex-gradient"
          gradientUnits="userSpaceOnUse"
          x1="12"
          x2="12"
          y1="0"
          y2="24"
        >
          <stop stopColor="#B1A7FF" />
          <stop offset=".5" stopColor="#7A9DFF" />
          <stop offset="1" stopColor="#3941FF" />
        </linearGradient>
      </defs>
      <path
        fill="url(#codex-gradient)"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.086.457a6.105 6.105 0 013.046-.415c1.333.153 2.521.72 3.564 1.7a.117.117 0 00.107.029c1.408-.346 2.762-.224 4.061.366l.063.03.154.076c1.357.703 2.33 1.77 2.918 3.198.278.679.418 1.388.421 2.126a5.655 5.655 0 01-.18 1.631.167.167 0 00.04.155 5.982 5.982 0 011.578 2.891c.385 1.901-.01 3.615-1.183 5.14l-.182.22a6.063 6.063 0 01-2.934 1.851.162.162 0 00-.108.102c-.255.736-.511 1.364-.987 1.992-1.199 1.582-2.962 2.462-4.948 2.451-1.583-.008-2.986-.587-4.21-1.736a.145.145 0 00-.14-.032c-.518.167-1.04.191-1.604.185a5.924 5.924 0 01-2.595-.622 6.058 6.058 0 01-2.146-1.781c-.203-.269-.404-.522-.551-.821a7.74 7.74 0 01-.495-1.283 6.11 6.11 0 01-.017-3.064.166.166 0 00.008-.074.115.115 0 00-.037-.064 5.958 5.958 0 01-1.38-2.202 5.196 5.196 0 01-.333-1.589 6.915 6.915 0 01.188-2.132c.45-1.484 1.309-2.648 2.577-3.493.282-.188.55-.334.802-.438.286-.12.573-.22.861-.304a.129.129 0 00.087-.087A6.016 6.016 0 015.635 2.31C6.315 1.464 7.132.846 8.086.457zm-.804 7.85a.848.848 0 00-1.473.842l1.694 2.965-1.688 2.848a.849.849 0 001.46.864l1.94-3.272a.849.849 0 00.007-.854l-1.94-3.393zm5.446 6.24a.849.849 0 000 1.695h4.848a.849.849 0 000-1.696h-4.848z"
      />
      <path
        fill="white"
        d="M7.282 8.307a.848.848 0 00-1.473.842l1.694 2.965-1.688 2.848a.849.849 0 001.46.864l1.94-3.272a.849.849 0 00.007-.854l-1.94-3.393zM12.728 14.547a.849.849 0 000 1.695h4.848a.849.849 0 000-1.696h-4.848z"
      />
    </svg>
  ),
  cursor: () => (
    <svg
      width="36"
      height="41"
      viewBox="400 395 166.789 191"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fill="#72716D"
        d="M483.395 490.5L566 538.297C565.493 539.178 564.757 539.93 563.845 540.456L486.636 585.13C484.632 586.29 482.159 586.29 480.154 585.13L402.945 540.456C402.034 539.93 401.297 539.178 400.79 538.297L483.395 490.5Z"
      />
      <path
        fill="#55544F"
        d="M483.395 395V490.5L400.79 538.297C400.282 537.416 400 536.398 400 535.346V445.654C400 443.545 401.122 441.6 402.945 440.544L480.15 395.87C481.154 395.29 482.273 395 483.391 395H483.395Z"
      />
      <path
        fill="#43413C"
        d="M565.996 442.703C565.489 441.822 564.752 441.07 563.841 440.544L486.632 395.87C485.632 395.29 484.513 395 483.395 395V490.5L566 538.297C566.507 537.416 566.789 536.398 566.789 535.346V445.654C566.789 444.598 566.511 443.588 566 442.703H565.996Z"
      />
      <path
        fill="#D6D5D2"
        d="M560.218 446.049C560.686 446.858 560.751 447.896 560.218 448.82L485.235 578.974C484.732 579.855 483.392 579.493 483.392 578.479V492.713C483.392 492.029 483.209 491.37 482.877 490.794L560.215 446.045H560.218V446.049Z"
      />
      <path
        fill="white"
        d="M560.218 446.049L482.88 490.797C482.552 490.224 482.073 489.737 481.48 489.394L407.369 446.511C406.49 446.006 406.851 444.663 407.862 444.663H557.824C558.889 444.663 559.754 445.239 560.218 446.049Z"
      />
    </svg>
  ),
  copilot: () => (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fill="white"
        fillRule="evenodd"
        d="M19.245 5.364c1.322 1.36 1.877 3.216 2.11 5.817.622 0 1.2.135 1.592.654l.73.964c.21.278.323.61.323.955v2.62c0 .339-.173.669-.453.868C20.239 19.602 16.157 21.5 12 21.5c-4.6 0-9.205-2.583-11.547-4.258-.28-.2-.452-.53-.453-.868v-2.62c0-.345.113-.679.321-.956l.73-.963c.392-.517.974-.654 1.593-.654l.029-.297c.25-2.446.81-4.213 2.082-5.52 2.461-2.54 5.71-2.851 7.146-2.864h.198c1.436.013 4.685.323 7.146 2.864zm-7.244 4.328c-.284 0-.613.016-.962.05-.123.447-.305.85-.57 1.108-1.05 1.023-2.316 1.18-2.994 1.18-.638 0-1.306-.13-1.851-.464-.516.165-1.012.403-1.044.996a65.882 65.882 0 00-.063 2.884l-.002.48c-.002.563-.005 1.126-.013 1.69.002.326.204.63.51.765 2.482 1.102 4.83 1.657 6.99 1.657 2.156 0 4.504-.555 6.985-1.657a.854.854 0 00.51-.766c.03-1.682.006-3.372-.076-5.053-.031-.596-.528-.83-1.046-.996-.546.333-1.212.464-1.85.464-.677 0-1.942-.157-2.993-1.18-.266-.258-.447-.661-.57-1.108-.32-.032-.64-.049-.96-.05zm-2.525 4.013c.539 0 .976.426.976.95v1.753c0 .525-.437.95-.976.95a.964.964 0 01-.976-.95v-1.752c0-.525.437-.951.976-.951zm5 0c.539 0 .976.426.976.95v1.753c0 .525-.437.95-.976.95a.964.964 0 01-.976-.95v-1.752c0-.525.437-.951.976-.951zM7.635 5.087c-1.05.102-1.935.438-2.385.906-.975 1.037-.765 3.668-.21 4.224.405.394 1.17.657 1.995.657h.09c.649-.013 1.785-.176 2.73-1.11.435-.41.705-1.433.675-2.47-.03-.834-.27-1.52-.63-1.813-.39-.336-1.275-.482-2.265-.394zm6.465.394c-.36.292-.6.98-.63 1.813-.03 1.037.24 2.06.675 2.47.968.957 2.136 1.104 2.776 1.11h.044c.825 0 1.59-.263 1.995-.657.555-.556.765-3.187-.21-4.224-.45-.468-1.335-.804-2.385-.906-.99-.088-1.875.058-2.265.394zM12 7.615c-.24 0-.525.015-.84.044.03.16.045.336.06.526l-.001.159a2.94 2.94 0 01-.014.25c.225-.022.425-.027.612-.028h.366c.187 0 .387.006.612.028-.015-.146-.015-.277-.015-.409.015-.19.03-.365.06-.526a9.29 9.29 0 00-.84-.044z"
      />
    </svg>
  ),
  v0: () => (
    <svg
      width="44"
      height="44"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fill="white"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.252 8.25h5.624c.088 0 .176.006.26.018l-5.87 5.87a1.889 1.889 0 01-.019-.265V8.25h-2.25v5.623a4.124 4.124 0 004.125 4.125h5.624v-2.25h-5.624c-.09 0-.179-.006-.265-.018l5.874-5.875a1.9 1.9 0 01.02.27v5.623H24v-5.624A4.124 4.124 0 0019.876 6h-5.624v2.25zM0 7.5v.006l7.686 9.788c.924 1.176 2.813.523 2.813-.973V7.5H8.25v6.87L2.856 7.5H0z"
      />
    </svg>
  ),
  lovable: () => (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <radialGradient
          id="lovable-gradient"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(-1 22.49999 -30.45394 -1.3535 14 3)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".25" stopColor="#FE7B02" />
          <stop offset=".433" stopColor="#FE4230" />
          <stop offset=".548" stopColor="#FE529A" />
          <stop offset=".654" stopColor="#DD67EE" />
          <stop offset=".95" stopColor="#4B73FF" />
        </radialGradient>
      </defs>
      <path
        fill="url(#lovable-gradient)"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.082 0c3.91 0 7.081 3.179 7.081 7.1v2.7h2.357c3.91 0 7.082 3.178 7.082 7.1 0 3.923-3.17 7.1-7.082 7.1H0V7.1C0 3.18 3.17 0 7.082 0z"
      />
    </svg>
  ),
};

const installPrompt = (agent: string) =>
  `Install the React Email skill with \`npx skills add resend/react-email --agent ${agent}\`, then help me build an HTML email using React Email components. Docs: https://react.email/docs/llms.txt`;

const items = [
  {
    title: 'Claude Code',
    prompt: installPrompt('claude-code'),
    icon: <Icons.claude />,
  },
  {
    title: 'Codex',
    prompt: installPrompt('codex'),
    icon: <Icons.codex />,
  },
  {
    title: 'Cursor',
    prompt: installPrompt('cursor'),
    icon: <Icons.cursor />,
  },
  {
    title: 'Copilot',
    prompt: installPrompt('github-copilot'),
    icon: <Icons.copilot />,
  },
  {
    title: 'v0',
    prompt: installPrompt('eve'),
    icon: <Icons.v0 />,
  },
  {
    title: 'Lovable',
    prompt:
      'Import the React Email skill from https://github.com/resend/react-email (path: skills/react-email). Then help me build an HTML email using React Email components. Docs: https://react.email/docs/llms.txt',
    icon: <Icons.lovable />,
  },
];

export default AiSection;
