'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { Heading } from '@/components/heading';
import { Text } from '@/components/text';

type Tool = {
  title: string;
  description: string;
  image: string;
};

const tools: Tool[] = [
  {
    title: 'Linter',
    description:
      "Analyze every link in your email to see if it's valid or not.",
    image: '/examples/linter.png',
  },
  {
    title: 'Compatibility Checker',
    description:
      'See how well the HTML/CSS is supported across popular mail clients.',
    image: '/examples/compatibility.png',
  },
  {
    title: 'Spam Score',
    description:
      'Look at your email content and use a robust scoring framework to determine if the email is likely to be spam.',
    image: '/examples/spam.png',
  },
];

const ToolsSection = () => {
  const [activeTool, setActiveTool] = useState<number>(0);

  return (
    <section className="relative text-center space-y-24 my-56">
      <div className="space-y-8">
        <div className="max-w-full text-center space-y-6">
          <Heading size="9" weight="medium" className="text-white/80">
            Built-in deliverability tools
          </Heading>
          <div className="sm:px-20 md:max-w-2xl md:mx-auto">
            <Text size="5">
              Before you hit “send”, check how your email is doing with a set of
              tools to help you build better emails.
            </Text>
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-32">
        <div className="shrink-0 text-start space-y-5">
          {tools.map((tool, index) => (
            <div
              key={tool.title}
              className="relative p-6 max-w-md cursor-default z-[2]"
              onMouseEnter={() => setActiveTool(index)}
            >
              <AnimatePresence initial={false}>
                {activeTool === index && (
                  <motion.div
                    layoutId="background"
                    className="absolute inset-0 -z-[1] bg-[#17171799] rounded-[20px] shadow-[0px_32px_64px_-16px_transparent,0px_16px_32px_-8px_transparent,0px_8px_16px_-4px_transparent,0px_4px_8px_-2px_transparent,0px_-8px_16px_-1px_transparent,0px_2px_4px_-1px_transparent,0px_0px_0px_1px_transparent,inset_0px_0px_0px_1px_#ffffff1a,inset_0px_1px_0px_#ffffff26]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
                  />
                )}
              </AnimatePresence>
              <div className="relative flex flex-col gap-1.5">
                <Heading size="5" weight="medium" className="text-white/80">
                  {tool.title}
                </Heading>
                <Text size="4">{tool.description}</Text>
              </div>
            </div>
          ))}
        </div>
        <div className="relative border border-zinc-800 grow rounded-3xl overflow-hidden">
          <div className="relative flex items-center justify-between border-b border-zinc-800 h-14 px-4">
            <div className="flex items-center gap-2 h-full">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="size-3 rounded-full bg-zinc-800" />
              ))}
            </div>
            <Line />
          </div>
          <Image
            src={tools[activeTool].image}
            alt="Linter"
            className="w-full h-full object-cover object-left-bottom"
            width={1000}
            height={1000}
          />
        </div>
      </div>
      <Image
        alt=""
        className="pointer-events-none absolute inset-0 -top-40 z-[3] select-none mix-blend-lighten"
        fill
        priority
        src="/static/bg.png"
      />
    </section>
  );
};

const Line = () => {
  return (
    <div
      aria-hidden
      className="absolute top-0 right-0 h-px w-96 bg-gradient-to-l from-transparent via-cyan-12/30 via-50% to-transparent"
    />
  );
};

export default ToolsSection;
