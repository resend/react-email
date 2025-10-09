'use client';

import { ArrowRightIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/button';
import { Code } from '@/components/code';
import { Heading } from '@/components/heading';
import { Text } from '@/components/text';

// Dynamically import Tower component to avoid SSR issues with Three.js
const Tower = dynamic(() => import('@/webgl/tower').then((mod) => mod.Tower), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-white/30">Loading...</div>
    </div>
  ),
});

const HeroSection = () => {
  return (
    <>
      {/* Right Column - Tower */}
      <div className="w-[100dvw] h-[100dvh] max-lg:hidden z-[0] absolute right-0 top-0">
        <div className="w-full h-full">
          <Tower />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at center right, transparent 0%, rgba(0, 0, 0, 0.6) 40%, rgba(0, 0, 0, 0.95) 60%, #000 80%), linear-gradient(175deg, transparent 60%, black 97%), linear-gradient(to bottom, rgba(0, 0, 0, .8) 5%, transparent 30%)',
            }}
          />
        </div>
      </div>

      <section className="flex flex-col h-[calc(100dvh-11.5rem)] lg:max-w-7xl mx-auto max-lg:items-center justify-center relative w-full pt-12 lg:pt-0 pointer-events-none">
        <Image
          alt=""
          className="pointer-events-none absolute inset-0 -top-40 z-[3] scale-150 select-none mix-blend-lighten lg:opacity-30"
          fill
          priority
          src="/static/bg.png"
        />

        {/* Left Column - Content */}
        <div className="w-full lg:w-[44rem] z-10 px-4 lg:px-12 pointer-events-auto">
          <div className="mb-8 flex justify-center lg:justify-start">
            <Image
              alt="React Email Logo"
              height="100"
              src="/brand/logo.png"
              width="100"
            />
          </div>
          <Heading
            className="!text-white/80 relative mb-8 text-center lg:text-left before:absolute before:top-0 before:left-0 before:w-full before:animate-[shine_2s_ease-in-out] before:bg-[length:200%] before:bg-shine before:bg-clip-text before:text-transparent before:content-['The_next_generation_of_writing_emails'] before:select-none before:pointer-events-none text-balance"
            weight="medium"
            size="10"
          >
            The next generation of writing emails
          </Heading>
          <div className="max-w-xl max-lg:mx-auto text-center lg:text-left">
            <Text size="5" className="text-pretty">
              React Email is a next-generation collection of unstyled components
              for creating beautiful emails using React, Tailwind, and
              TypeScript.
            </Text>
          </div>
          <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 flex-wrap">
            <Button asChild size="4">
              <Link href="/components">
                Explore components
                <ArrowRightIcon size={16} />
              </Link>
            </Button>
            <Code className="lg:!inline-flex hidden max-w-max">
              npx create-email@latest
            </Code>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
