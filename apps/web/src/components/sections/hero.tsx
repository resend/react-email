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
const Tower = dynamic(
  () => import('@/components/tower').then((mod) => mod.Tower),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white/30">Loading...</div>
      </div>
    ),
  },
);

const HeroSection = () => {
  return (
    <>
      {/* Right Column - Tower */}
      <div className="w-screen h-screen max-lg:hidden z-[0] absolute right-0 top-0">
        <div className="relative w-full h-full">
          <Tower />
          {/* Radial gradient mask */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at center right, transparent 0%, rgba(0, 0, 0, 0.6) 40%, rgba(0, 0, 0, 0.95) 60%, #000 80%), linear-gradient(175deg, transparent 60%, black 100%), linear-gradient(to bottom, rgba(0, 0, 0, .8) 5%, transparent 30%)',
            }}
          />
        </div>
      </div>

      <section className="w-px m-auto flex min-h-dvh relative">
        <Image
          alt=""
          className="pointer-events-none absolute inset-0 -top-40 z-[3] scale-150 select-none mix-blend-lighten opacity-30"
          fill
          priority
          src="/static/bg.png"
        />

        {/* Left Column - Content */}
        <div className="absolute w-[44rem] z-10 -translate-x-[40rem] translate-y-1/3 md:px-12">
          <div className="mb-8 flex items-center justify-start">
            <Image
              alt="React Email Logo"
              height="80"
              src="/brand/logo.png"
              width="80"
            />
          </div>
          <Heading
            className="!text-white/80 relative mb-8 text-left before:absolute before:top-0 before:left-0 before:w-full before:animate-[shine_2s_ease-in-out] before:bg-[length:200%] before:bg-shine before:bg-clip-text before:text-transparent before:content-['The_next_generation_of_writing_emails'] before:select-none before:pointer-events-none text-balance"
            weight="medium"
            size="10"
          >
            The next generation of writing emails
          </Heading>
          <div className="max-w-xl">
            <Text size="5" className="text-pretty text-left">
              React Email is a next-generation collection of unstyled components
              for creating beautiful emails using React, Tailwind, and
              TypeScript.
            </Text>
          </div>
          <div className="mt-10 flex items-center justify-start gap-4 flex-wrap">
            <Button asChild size="4">
              <Link href="/components">
                Explore components
                <ArrowRightIcon size={16} />
              </Link>
            </Button>
            <Code className="md:!inline-flex hidden max-w-max">
              npx create-email@latest
            </Code>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
