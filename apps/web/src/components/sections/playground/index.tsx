'use client';

import * as Tabs from '@radix-ui/react-tabs';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { Heading } from '@/components/heading';
import { Text } from '@/components/text';
import { CodePreview } from './code-preview';
import { cssCode, tailwindCSSCode } from './utils';

const tabs = [
  {
    label: 'Tailwind CSS',
    value: 'tailwind',
    code: tailwindCSSCode,
  },
  {
    label: 'CSS',
    value: 'css',
    code: cssCode,
  },
];

const PlaygroundSection = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].value);

  return (
    <section className="relative min-h-screen my-24 text-center flex flex-col items-center justify-center">
      <div className="space-y-8">
        <div className="max-w-full text-center md:max-w-[40rem] md:mx-auto space-y-6">
          <Heading
            size="8"
            weight="medium"
            className="text-white/80 md:w-96 inline-block text-balance"
          >
            Modern styling using your favorite tools
          </Heading>
          <div className="sm:px-20">
            <Text size="5">
              Style your emails with your favorite tools, including support for
              inline CSS or Tailwind CSS.
            </Text>
          </div>
        </div>
        <Tabs.Root
          className="w-full max-w-6xl space-y-16"
          defaultValue={tabs[0].value}
          onValueChange={setActiveTab}
        >
          <div className="flex justify-center">
            <Tabs.List className="flex items-center p-1 rounded-2xl shadow-[0px_32px_64px_-16px_transparent,0px_16px_32px_-8px_transparent,0px_8px_16px_-4px_transparent,0px_4px_8px_-2px_transparent,0px_-8px_16px_-1px_transparent,0px_2px_4px_-1px_transparent,0px_0px_0px_1px_transparent,inset_0px_0px_0px_1px_rgba(255,255,255,0.1),inset_0px_1px_0px_rgb(255,255,255,0.15)]">
              {tabs.map((tab) => (
                <Tabs.Trigger
                  key={tab.value}
                  value={tab.value}
                  className="group relative px-4 py-2"
                >
                  <span
                    className={classNames(
                      'relative z-10 text-lg',
                      activeTab === tab.value
                        ? 'text-slate-12'
                        : 'text-slate-11 transition-colors group-hover:text-slate-12',
                    )}
                  >
                    {tab.label}
                  </span>
                  <AnimatePresence mode="wait" initial={false}>
                    {activeTab === tab.value && (
                      <motion.div
                        className="absolute inset-0 size-full rounded-xl bg-gradient-to-b from-zinc-800 to-zinc-950 border border-zinc-800 z-0"
                        layoutId="activeTab"
                        transition={{
                          type: 'spring',
                          duration: 0.3,
                          bounce: 0,
                        }}
                      />
                    )}
                  </AnimatePresence>
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </div>

          <div>
            <CodePreview tabs={tabs} activeTab={activeTab} />
          </div>
        </Tabs.Root>
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

export default PlaygroundSection;
