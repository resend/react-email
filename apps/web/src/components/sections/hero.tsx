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
                'radial-gradient(circle at center right, transparent 0%, rgba(0, 0, 0, 0.6) 30%, rgba(0, 0, 0, 0.95) 60%, #000 80%), linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(0, 0, 0, 0.3) 80%, rgba(0, 0, 0, 0.8) 90%, #000 100%)',
            }}
          />
        </div>
      </div>
      <section className="relative mx-auto flex max-w-7xl items-center justify-between h-[calc(100vh-11rem)] px-6 lg:px-8">
        <Image
          alt=""
          className="pointer-events-none absolute inset-0 -top-40 z-[3] scale-150 select-none mix-blend-lighten opacity-30"
          fill
          priority
          src="/static/bg.png"
        />

        {/* Left Column - Content */}
        <div className="flex-1 max-w-2xl z-10">
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
